/**
 * RUTA 9 — Servidor Unificado (Estático + Tiempo Real SSE)
 * =======================================================
 * Este servidor unificado corre en el puerto 8000.
 * Sirve todos los archivos web (HTML, CSS, JS, Imágenes) y a la vez
 * actúa como relay en tiempo real vía Server-Sent Events (SSE).
 * 
 * Al correr en un único puerto, se garantizan tres cosas:
 *   1. Cero problemas de Firewall (si la pantalla puede cargar la web, tendrá tiempo real).
 *   2. Cero problemas de CORS (mismo origen y puerto).
 *   3. Despliegue inmediato cross-browser y cross-device en red local.
 * 
 * Uso: node relay-server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;

// Lista de clientes SSE conectados
const sseClients = new Set();

// Headers CORS permisivos
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Mime types para archivos estáticos
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

/**
 * Retransmite un comando a todas las pantallas SSE conectadas
 */
function broadcast(eventData) {
  const payload = `data: ${JSON.stringify(eventData)}\n\n`;
  const deadClients = [];

  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (e) {
      deadClients.push(client);
    }
  }

  // Limpiar clientes desconectados
  for (const dead of deadClients) {
    sseClients.delete(dead);
  }

  console.log(`📡 Broadcast enviado a ${sseClients.size} pantalla(s) conectada(s)`);
}

/**
 * Lee el body JSON de un request POST
 */
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathName = parsedUrl.pathname;

  // No loggear heartbeat SSE para no saturar logs
  if (pathName !== '/api/events' || req.method !== 'GET') {
    console.log(`➡️  [HTTP] ${req.method} ${pathName}`);
  }

  // --- CORS Preflight ---
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  // ==========================================
  // 1. RUTAS DE LA API (TIEMPO REAL)
  // ==========================================

  // POST /api/command → Recibe comandos del Admin y los retransmite
  if (req.method === 'POST' && pathName === '/api/command') {
    try {
      const data = await readBody(req);
      console.log(`\n🟥 Comando recibido del Admin:`, JSON.stringify(data));
      
      broadcast(data);

      res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        ok: true, 
        clients: sseClients.size,
        message: `Comando retransmitido a ${sseClients.size} pantalla(s)` 
      }));
    } catch (e) {
      console.error(`❌ Error procesando comando del Admin:`, e.message);
      res.writeHead(400, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  // GET /api/events → Conexión de tiempo real (SSE) para pantallas
  if (req.method === 'GET' && pathName === '/api/events') {
    res.writeHead(200, {
      ...CORS_HEADERS,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    });

    // Enviar confirmación inicial de conexión
    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Conectado al Relay de Ruta 9' })}\n\n`);

    sseClients.add(res);
    console.log(`📺 Nueva pantalla conectada. Total: ${sseClients.size}`);

    // Heartbeat cada 15 segundos para mantener viva la conexión local
    const heartbeat = setInterval(() => {
      try {
        res.write(`: heartbeat ${new Date().toISOString()}\n\n`);
      } catch (e) {
        clearInterval(heartbeat);
      }
    }, 15000);

    req.on('close', () => {
      clearInterval(heartbeat);
      sseClients.delete(res);
      console.log(`📺 Pantalla desconectada. Total: ${sseClients.size}`);
    });

    return;
  }

  // GET /api/health → Estado rápido del servidor
  if (req.method === 'GET' && pathName === '/api/health') {
    res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      ok: true, 
      clients: sseClients.size,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // ==========================================
  // 2. SERVIDOR DE ARCHIVOS ESTÁTICOS
  // ==========================================
  
  // Normalizar la ruta del archivo estático decodificando caracteres como %20 (espacios)
  let safePath = pathName === '/' ? '/r9-burger.html' : decodeURIComponent(pathName);
  let filePath = path.join(__dirname, safePath);

  // Evitar Directory Traversal para seguridad local
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Acceso denegado');
    return;
  }

  // Detectar MIME type
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.warn(`⚠️ 404: ${safePath}`);
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Archivo no encontrado');
      } else {
        console.error(`❌ Error 500 al leer ${safePath}:`, error.code);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Error interno del servidor: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', // Deshabilitar caché agresiva para desarrollo/pruebas
      });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║    🔥 RUTA 9 — Servidor Unificado (Puerto 8000)      ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  🌐 Escuchando en: http://0.0.0.0:${PORT}             ║`);
  console.log('║                                                      ║');
  console.log('║  Sirviendo:                                          ║');
  console.log('║    • Archivos Web locales (index, admin, etc.)       ║');
  console.log('║    • Canal Realtime SSE (Cross-Browser / Device)     ║');
  console.log('║                                                      ║');
  console.log('║  Usa la IP de tu Mac en otros dispositivos:         ║');
  console.log(`║    http://<TU_IP_LOCAL>:${PORT}/index.html           ║`);
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
});
