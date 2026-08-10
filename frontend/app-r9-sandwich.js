/**
 * Smart Showcase Screen 3 Controller (Sándwiches) - Version 1.0.0
 * Optimized for Embedded Browsers (e.g., Amazon Fire TV Stick)
 * Handles smooth CSS transitions, asset preloading, and real-time synchronization.
 */

// --- AUTO-DETECCIÓN DE SMART TVS (ACTIVA MODO LITE DE BAJOS RECURSOS) ---
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const forceLite = urlParams.get('lite') === 'true' || urlParams.get('force_lite') === 'true';
  const ua = navigator.userAgent.toLowerCase();
  const isTV = forceLite || 
               ua.includes('smarttv') || 
               ua.includes('tizen') || 
               ua.includes('webos') || 
               ua.includes('lg browser') || 
               ua.includes('silk') || 
               ua.includes('googletv') || 
               ua.includes('appletv') || 
               ua.includes('hbbtv') || 
               ua.includes('opera tv') ||
               ua.includes('dtv');
  if (isTV) {
    document.documentElement.classList.add('lite-mode');
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('lite-mode');
      // Auto-dismiss welcome screen on TVs to run automatically without manual clicks
      const welcome = document.getElementById('fullscreen-welcome');
      if (welcome) {
        welcome.remove();
      }
    });

    // Forzar pantalla completa (0 bordes) al primer clic o pulsación de botón en el control
    const forceFS = () => {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      }
    };
    document.addEventListener('click', forceFS, { once: true });
    document.addEventListener('keydown', forceFS, { once: true });

    console.log("📺 Modo Lite activado para optimizar recursos.");
  }
})();


// --- MANEJADOR DEFENSIVO DE IMÁGENES ROTAS (FALLBACK AUTOMÁTICO) ---
window.handleImageError = function(img) {
  if (!img) return;
  const urlParams = new URLSearchParams(window.location.search);
  const branch = urlParams.get('local') || urlParams.get('branch');
  const isZF = branch === 'zf' || window.location.pathname.toLowerCase().includes('zf') || (document.body && document.body.classList.contains('branch-zf'));

  if (img.dataset.hasFailed) {
    img.src = isZF ? 'frontend/images/products/Zona Franca/s1.webp' : 'frontend/images/products/s1.webp';
    return;
  }
  img.dataset.hasFailed = true;

  const src = img.src || '';
  let foundCode = null;

  const match = src.match(/([bs]\d+|bf)\b/i);
  if (match) {
    foundCode = match[1].toLowerCase();
  } else {
    if (img.id === 'product-img') {
      const codeEl = document.getElementById('product-code');
      if (codeEl && codeEl.textContent) {
        foundCode = codeEl.textContent.trim().toLowerCase();
      }
    }
  }

  if (foundCode) {
    img.src = isZF ? `frontend/images/products/Zona Franca/${foundCode}.webp` : `frontend/images/products/${foundCode}.webp`;
  } else {
    img.src = isZF ? 'frontend/images/products/Zona Franca/s1.webp' : 'frontend/images/products/s1.webp';
  }
};

// --- CONFIGURACIÓN DE PRODUCTOS DE LA CARTA (SÁNDWICHES PANTALLA 3) ---
const mockSandwiches = [
  {
    id: 'sand-1',
    code: 'S1',
    name: 'TLT',
    price: '$9.200',
    tag: 'CRUNCHY 🥓',
    image: 'frontend/images/products/s1.webp',
    description: 'Crujiente sándwich en baguette de tocino ahumado acompañado de fresca lechuga hidropónica y tomates seleccionados.'
  },
  {
    id: 'sand-2',
    code: 'S2',
    name: 'THP',
    price: '$10.500',
    tag: 'RECOMENDADO ⭐',
    image: 'frontend/images/products/s2.webp',
    description: 'Delicioso sándwich en baguette de tocino con huevo frito jugoso y porción generosa de palta trozada.'
  },
  {
    id: 'sand-3',
    code: 'S3',
    name: 'QTH',
    price: '$9.900',
    tag: 'FULL GOUDA 🧀',
    image: 'frontend/images/products/s3.webp',
    description: 'Tradicional sándwich en baguette de tocino con fundente queso gouda de alta calidad y un huevo frito dorado.'
  },
  {
    id: 'sand-4',
    code: 'S4',
    name: 'Matambre chimichurri',
    price: '$12.100',
    tag: 'PARRILLERO 🔥',
    image: 'frontend/images/products/s4.webp',
    description: 'Exclusivo matambre tiernizado a la parrilla servido en baguette con queso gouda derretido y salsa chimichurri artesanal.'
  },
  {
    id: 'sand-5',
    code: 'S5',
    name: 'Matambre a la parrilla',
    price: '$12.500',
    tag: 'FULL EXTREMO 🍳',
    image: 'frontend/images/products/s5.webp',
    description: 'Baguette con tierno matambre a la parrilla acompañado de crujiente lechuga, tomate en rodajas y huevo frito.'
  },
  {
    id: 'sand-6',
    code: 'S6',
    name: 'Brisket ahumada 4 quesos',
    price: '$12.500',
    tag: 'AHUMADO 👑',
    image: 'frontend/images/products/s6.webp',
    description: 'Baguette de brisket ahumada a fuego lento con tocino crocante y una fundente mezcla especial de cuatro quesos seleccionados.'
  },
  {
    id: 'sand-7',
    code: 'S7',
    name: 'Sandwich Philly',
    price: '$12.500',
    tag: 'SIGNATURE 🧀',
    image: 'frontend/images/products/s7.webp',
    description: 'Nuestra reinterpretación del Philly Cheesesteak: baguette con brisket ahumada deshilachada y un espectacular crocante de queso fundido.'
  },
  {
    id: 'sand-8',
    code: 'S8',
    name: 'Harley Quinn',
    price: '$8.800',
    tag: 'EXPLOSIVO 🌶️',
    image: 'frontend/images/products/s8.webp',
    description: 'Sándwich en tierno pan brioche con doble queso cheddar fundido, doble huevo, tocino ahumado, salsa BBQ y un toque picante de sriracha.'
  },
  {
    id: 'sand-9',
    code: 'S9',
    name: 'Pulled Pork Gouda',
    price: '$10.500',
    tag: 'SABROSO 🐷',
    image: 'frontend/images/products/s9.webp',
    description: 'Baguette con pulled pork (cerdo deshilachado al horno) bañado en su salsa, queso gouda fundente, pepinillos crujientes y huevo frito.'
  }
];

class ShowcaseScreenController {
  constructor() {
    this.elements = {
      productCard: document.getElementById('product-card'),
      productImg: document.getElementById('product-img'),
      productCode: document.getElementById('product-code'),
      productName: document.getElementById('product-name'),
      productPrice: document.getElementById('product-price'),
      productTag: document.getElementById('product-tag'),
      productDesc: document.getElementById('product-desc'),
      alertOverlay: document.getElementById('alert-overlay'),
      alertMessage: document.getElementById('alert-message')
    };

    this.products = [...mockSandwiches];
    this.currentIndex = 0;
    this.loopInterval = null;
    this.countdownInterval = null;
    this.alertTimeout = null;
    this.isAlertActive = false;
    this.isTransitioning = false;
    this.rotationTime = 3000; // 3 segundos
    
    // Configuración PocketBase Realtime
    const urlParams = new URLSearchParams(window.location.search);
    this.pbClientId = urlParams.get('local') || urlParams.get('clientId') || null; // Carga el local específico o todos si es null
    this.pbConnected = false;
    this.wakeLock = null;
  }

  async requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request('screen');
        console.log('✅ Screen 3 — Wake Lock activado. El televisor no se dormirá.');
      }
    } catch (err) {
      console.warn(`⚠️ Screen 3 — Wake Lock fallido: ${err.message}`);
    }
  }

  async init() {
    console.log('🚀 Inicializando Showcase Screen 3 (Sándwiches)...');

    // Activar bloqueo de suspensión de pantalla
    this.requestWakeLock();
    document.addEventListener('visibilitychange', () => {
      if (this.wakeLock !== null && document.visibilityState === 'visible') {
        this.requestWakeLock();
      }
    });

    // Cargar catálogo desde JSON central (soporta ?local=zf o ?branch=zf)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const branch = urlParams.get('local') || urlParams.get('branch');
      const isZF = branch === 'zf' || window.location.pathname.toLowerCase().includes('zf') || (document.body && document.body.classList.contains('branch-zf'));
      const catalogFile = isZF ? 'frontend/catalog-zf.json' : 'frontend/catalog.json';
      
      console.log(`📦 Intentando cargar catálogo desde: ${catalogFile}`);
      const response = await fetch(catalogFile);
      const data = await response.json();
      if (data && data.sandwiches) {
        this.products = data.sandwiches;
        // Inyectar la Burger del Mes (B5) de Zona Franca como producto estrella destacado
        if (data.burgers) {
          const burgerMes = data.burgers.find(b => b.id === 'zf-b5' || b.code === 'B5' || (b.name || '').toUpperCase().includes('DEL MES'));
          if (burgerMes && !this.products.some(p => p.code === 'B5')) {
            this.products.push(burgerMes);
          }
        }
        console.log(`📦 Catálogo de Sándwiches + Burger del Mes cargado desde ${catalogFile}`);
      }
    } catch (e) {
      console.warn("⚠️ Fallback: No se pudo cargar el catálogo dinámico, usando copia local en memoria.", e);
    }

    // --- INTENTAR CARGAR DESDE POCKETBASE ---
    const tryLoadFromPocketBase = async () => {
      if (typeof window.pbLoadProducts === 'function') {
        const pbProducts = await window.pbLoadProducts(this.pbClientId);
        if (pbProducts && pbProducts.length > 0) {
          // Filtrar solo productos que contengan 'S' en su código
          const sandwiches = pbProducts.filter(p => p.code && p.code.startsWith('S'));
          if (sandwiches.length > 0) {
            this.products = sandwiches;
            this.pbConnected = true;
            console.log(`🔥 Vitrina 3 cargada desde PocketBase (${sandwiches.length} sándwiches)`);
            return true;
          }
        }
      }
      return false;
    };

    const loaded = await tryLoadFromPocketBase();
    if (!loaded) {
      console.log('📦 Usando catálogo local de sándwiches.');
    } else {
      this.connectToRealtime();
    }

    window.addEventListener('pocketbase:ready', async () => {
      if (this.pbConnected) return;
      const loadedReady = await tryLoadFromPocketBase();
      if (loadedReady) {
        this.renderMenuGrid();
        this.renderCurrentProduct();
        this.connectToRealtime();
      }
    });

    this.renderMenuGrid();
    this.renderCurrentProduct();
    this.startProductLoop();
    this.registerEventBridges();
    this.connectToRelay();
    this.connectToCloudRelay();
  }

  renderMenuGrid() {
    // Generación dinámica en minigrid si fuese necesario, de lo contrario la app maneja minitumbnails
    this.updateThumbnails();
  }

  updateThumbnails() {
    const total = this.products.length;
    if (total === 0) return;

    const indices = [
      this.currentIndex,
      (this.currentIndex + 1) % total,
      (this.currentIndex + 2) % total,
      (this.currentIndex + 3) % total
    ];

    indices.forEach((prodIndex, uiIdx) => {
      const btn = document.getElementById(`thumb-prod-${uiIdx + 1}`);
      if (btn) {
        const img = btn.querySelector('img');
        if (img) {
          img.src = this.products[prodIndex].image;
          img.alt = this.products[prodIndex].name;
          img.dataset.hasFailed = false; // Reset fallback check
        }
        btn.onclick = () => this.nextProduct(prodIndex);
      }
    });
  }

  renderCurrentProduct() {
    const current = this.products[this.currentIndex];
    if (!current) return;

    // Alternar el diseño izquierda/derecha de forma dinámica en cada rotación en la TV
    if (this.currentIndex % 2 === 0) {
      document.body.classList.remove('layout-reversed');
    } else {
    // Detectar Burger del Mes (B5 o "DEL MES") para activar el fondo muy rojo de alto impacto
    const isBurgerDelMes = current.name.toUpperCase().includes('DEL MES') || (current.code && current.code.toUpperCase() === 'B5');
    if (isBurgerDelMes) {
      document.body.classList.add('theme-burger-del-mes-red');
      if (this.elements.productName) {
        this.elements.productName.style.color = '#fbbf24';
        this.elements.productName.style.textShadow = '0 0 15px rgba(251, 191, 36, 0.4)';
      }
    } else {
      document.body.classList.remove('theme-burger-del-mes-red');
      if (this.elements.productName) {
        this.elements.productName.style.color = '#ffffff';
        this.elements.productName.style.textShadow = 'none';
      }
    }

    if (this.elements.productCode) this.elements.productCode.textContent = current.code;
    if (this.elements.productName) this.elements.productName.textContent = current.name;
    if (this.elements.productPrice) this.elements.productPrice.textContent = current.price;

    const popTextEl = document.getElementById('flavor-pop-text');
    const popIconEl = document.querySelector('.flavor-pop-badge .pop-icon');
    if (popTextEl && current) {
      const descUpper = (current.description || '').toUpperCase();
      const nameUpper = (current.name || '').toUpperCase();
      
      let popPhrase = { text: '¡100% GOURMET!', icon: '✨' };

      if (isBurgerDelMes) {
        popPhrase = { text: '¡EDICIÓN LIMITADA!', icon: '👑🌶️' };
      } else if (descUpper.includes('HUEVO') || nameUpper.includes('HUEVO')) {
        popPhrase = { text: '¡HUEVO CREMOSO & FRESCO!', icon: '🍳' };
      } else if (descUpper.includes('QUESO') || nameUpper.includes('QUESO')) {
        popPhrase = { text: '¡FULL QUESO DERRETIDO!', icon: '🧀' };
      } else {
        popPhrase = { text: '¡BAGUETTE CROCANTE!', icon: '🥖' };
      }

      popTextEl.textContent = popPhrase.text;
      if (popIconEl) popIconEl.textContent = popPhrase.icon;
    }
    if (this.elements.productTag) this.elements.productTag.textContent = current.tag;
    if (this.elements.productDesc) this.elements.productDesc.textContent = current.description;

    if (this.elements.productImg) {
      this.elements.productImg.src = current.image;
      this.elements.productImg.alt = current.name;
      this.elements.productImg.dataset.hasFailed = false; // Reset error handler
    }

    this.updateCountdown(current);
  }

  updateCountdown(product) {
    const container = document.getElementById('countdown-container');
    const timerSpan = document.getElementById('product-countdown');
    
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }

    if (!product.endsAt) {
      if (container) container.classList.add('hidden');
      return;
    }

    const endTime = new Date(product.endsAt).getTime();
    if (isNaN(endTime) || endTime <= Date.now()) {
      if (container) container.classList.add('hidden');
      return;
    }

    if (container) container.classList.remove('hidden');

    const updateTimer = () => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(this.countdownInterval);
        if (container) container.classList.add('hidden');
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      if (timerSpan) {
        timerSpan.textContent = 
          `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
    };

    updateTimer();
    this.countdownInterval = setInterval(updateTimer, 1000);
  }

  startProductLoop() {
    this.stopProductLoop();
    this.loopInterval = setInterval(() => {
      if (!this.isAlertActive) {
        this.nextProduct();
      }
    }, this.rotationTime);
  }

  stopProductLoop() {
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
  }

  triggerCelebrationOverlay() {
    this.isCelebrationActive = true;
    this.stopProductLoop();
    
    const overlay = document.getElementById('celebration-overlay');
    if (overlay) {
      overlay.classList.add('active');
    }
    
    setTimeout(() => {
      if (overlay) {
        overlay.classList.remove('active');
      }
      this.isCelebrationActive = false;
      this.startProductLoop();
      // Avanzar al siguiente producto de forma natural
      this.nextProduct((this.currentIndex + 1) % this.products.length);
    }, 8000); // 8 segundos de celebración en pantalla
  }

  async nextProduct(targetIndex = null) {
    if (this.isAlertActive || this.isTransitioning || this.isCelebrationActive) return;

    // Si es el Día de la Hamburguesa, intercalamos la pantalla de celebración cada 4 rotaciones
    const today = new Date();
    const isHamburgerDay = (today.getDate() === 28 && today.getMonth() === 4) || new URLSearchParams(window.location.search).get('force_celebration') === 'true';
    if (isHamburgerDay) {
      this.rotationCounter = (this.rotationCounter || 0) + 1;
      if (this.rotationCounter % 4 === 0) {
        this.triggerCelebrationOverlay();
        return;
      }
    }

    // INTERCALADO ALEATORIO DE LA BURGER DEL MES (B5) EN SÁNDWICHES CON FONDO ROJO:
    this.featuredCounter = (this.featuredCounter || 0) + 1;
    const mesIndex = this.products.findIndex(p => p.id === 'zf-b5' || p.code === 'B5' || (p.name || '').toUpperCase().includes('DEL MES'));
    
    let nextIndex = targetIndex !== null ? targetIndex : this.currentIndex + 1;
    if (targetIndex === null && mesIndex !== -1 && this.currentIndex !== mesIndex) {
      if (this.featuredCounter >= 3 + Math.floor(Math.random() * 3)) {
        nextIndex = mesIndex;
        this.featuredCounter = 0; // Reiniciar contador aleatorio
      }
    }

    if (nextIndex >= this.products.length) {
      nextIndex = 0;
    }

    const nextProduct = this.products[nextIndex];
    if (!nextProduct) return;

    this.isTransitioning = true;

    // Lanzar la precarga de imagen en paralelo
    try {
      this.preloadImage(nextProduct.image).catch(() => {});
    } catch(e) {}

    // 2. EFECTO SALIDA CINEMÁTICA: Calcular vectores aleatorios y negativos
    if (this.elements.productCard) {
      let outX = '0px'; let outY = '0px'; let outRotate = '0deg'; let outScale = '0.8';
      let inX = '0px'; let inY = '0px'; let inRotate = '0deg'; let inScale = '0.8';

      // 6 perfiles dinámicos con coordenadas negativas y giros inversos
      const randType = Math.floor(Math.random() * 6);
      switch (randType) {
        case 0: // Salida abajo, entrada arriba
          outY = '400px'; outRotate = '-8deg';
          inY = '-400px'; inRotate = '8deg';
          break;
        case 1: // Salida arriba, entrada abajo
          outY = '-400px'; outRotate = '8deg';
          inY = '400px'; inRotate = '-8deg';
          break;
        case 2: // Salida derecha, entrada izquierda
          outX = '450px'; outRotate = '12deg';
          inX = '-450px'; inRotate = '-12deg';
          break;
        case 3: // Salida izquierda, entrada derecha
          outX = '-450px'; outRotate = '-12deg';
          inX = '450px'; inRotate = '12deg';
          break;
        case 4: // Diagonal negativa completa (salida arriba-izquierda, entrada abajo-derecha)
          outX = '-400px'; outY = '-400px'; outRotate = '-20deg'; outScale = '0.5';
          inX = '400px'; inY = '400px'; inRotate = '20deg'; inScale = '1.5';
          break;
        case 5: // Zoom out extremo con rotación negativa
          outScale = '0.2'; outRotate = '-45deg';
          inScale = '1.8'; inRotate = '45deg';
          break;
      }

      // Inyectar variables inline que alimentan el CSS de transiciones
      this.elements.productCard.style.setProperty('--out-x', outX);
      this.elements.productCard.style.setProperty('--out-y', outY);
      this.elements.productCard.style.setProperty('--out-rotate', outRotate);
      this.elements.productCard.style.setProperty('--out-scale', outScale);
      
      this.elements.productCard.style.setProperty('--in-x', inX);
      this.elements.productCard.style.setProperty('--in-y', inY);
      this.elements.productCard.style.setProperty('--in-rotate', inRotate);
      this.elements.productCard.style.setProperty('--in-scale', inScale);

      this.elements.productCard.style.transition = '';
      this.elements.productCard.style.transform = '';  // Limpiar transformaciones inline de Parallax
      this.elements.productCard.className = 'floating-burger-wrapper card-transition-out';
    }

    // 3. ESPERAR que termine la animación de salida (550ms)
    setTimeout(() => {
      this.currentIndex = nextIndex;
      this.renderCurrentProduct();
      this.updateThumbnails();

      // Entrada (usando variables inyectadas)
      if (this.elements.productCard) {
        this.elements.productCard.className = 'floating-burger-wrapper card-transition-in-start';
      }

      // 4. ENTRADA CINEMÁTICA: Deslizar al centro
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (this.elements.productCard) {
            this.elements.productCard.className = 'floating-burger-wrapper card-transition-in-end';
            
            setTimeout(() => {
              if (this.elements.productCard) {
                this.elements.productCard.className = 'floating-burger-wrapper';
                this.elements.productCard.style.transform = '';
              }
              this.isTransitioning = false;
            }, 950);
          }
        });
      });
    }, 550);
  }

  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = (err) => reject(err);
      setTimeout(() => reject(new Error('Image preload timeout')), 4000);
    });
  }

  registerEventBridges() {
    try {
      window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'ruta9_realtime_event') {
          console.log('📡 [iframe-bridge] Screen 3 evento recibido:', event.data);
          this.handleRealtimeEvent(event.data);
        }
      });
      console.log('✅ Screen 3 — Capa 1: iframe-bridge registrado.');
    } catch (e) {
      console.warn('⚠️ iframe-bridge falló:', e);
    }

    try {
      window.addEventListener('storage', (event) => {
        if (event.key === 'ruta9_realtime_event' && event.newValue) {
          try {
            const data = JSON.parse(event.newValue);
            console.log('📡 [localStorage] Screen 3 evento recibido:', data);
            this.handleRealtimeEvent(data);
          } catch (parseErr) {}
        }
      });
      console.log('✅ Screen 3 — Capa 2: localStorage event bridge registrado.');
    } catch (e) {
      console.warn('⚠️ localStorage event bridge falló:', e);
    }

    try {
      let lastProcessedTimestamp = 0;
      setInterval(() => {
        const raw = localStorage.getItem('ruta9_realtime_event');
        if (!raw) return;
        try {
          const data = JSON.parse(raw);
          if (data._ts && data._ts > lastProcessedTimestamp) {
            lastProcessedTimestamp = data._ts;
            console.log('📡 [localStorage-polling] Screen 3 evento detectado:', data);
            this.handleRealtimeEvent(data);
          }
        } catch (e) {}
      }, 500);
      console.log('✅ Screen 3 — Capa 3: localStorage polling (500ms) registrado.');
    } catch (e) {
      console.warn('⚠️ localStorage polling falló:', e);
    }

    window.showcaseController = this;
  }

  connectToRelay() {
    const hostname = window.location.hostname || 'localhost';
    const isLocal = hostname === 'localhost' || 
                    hostname === '127.0.0.1' || 
                    hostname.startsWith('192.168.') || 
                    hostname.startsWith('10.') || 
                    hostname.startsWith('172.');

    if (!isLocal) {
      console.log('🌐 Screen 3 — Entorno de Producción Cloud detectado (Vercel). Saltando conexión al Relay Local SSE.');
      return;
    }

    const relayPort = window.location.port || '8000';
    const relayUrl = `http://${hostname}:${relayPort}/api/events`;

    console.log(`🔌 Screen 3: Conectando al Relay Server SSE: ${relayUrl}...`);

    try {
      const eventSource = new EventSource(relayUrl);

      eventSource.onopen = () => {
        console.log('✅ Screen 3 — CAPA 0: Conectado al Relay Server SSE (cross-browser activo).');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'connected') {
            console.log('📡 [SSE Relay] Screen 3 confirmación de conexión:', data.message);
            return;
          }
          console.log('📡 [SSE Relay] Screen 3 evento recibido:', data);
          this.handleRealtimeEvent(data);
        } catch (e) {
          console.warn('⚠️ [SSE Relay] Screen 3 error parseando evento:', e);
        }
      };

      eventSource.onerror = (e) => {
        console.warn('⚠️ [SSE Relay] Screen 3 error de conexión. Reintentando automáticamente...');
      };

      this.relayEventSource = eventSource;
    } catch (e) {
      console.warn('⚠️ Screen 3 — SSE Relay no disponible. Usando canales locales como fallback.', e);
    }
  }

  /**
   * Conecta al SSE Cloud Relay Broker (ntfy.sh) para sincronización global
   */
  connectToCloudRelay() {
    const channelName = 'ruta9_gourmet_showcase_sync';
    const ntfyUrl = `https://ntfy.sh/${channelName}/sse`;

    console.log(`🔌 Conectando al Servidor de Nube en Tiempo Real (ntfy): ${ntfyUrl}...`);

    try {
      const eventSource = new EventSource(ntfyUrl);

      eventSource.onopen = () => {
        console.log('✅ CAPA CLOUD: Conectado al Servidor de Nube en Tiempo Real (ntfy).');
      };

      eventSource.onmessage = (event) => {
        try {
          const ntfyData = JSON.parse(event.data);
          if (ntfyData.event === 'message' && ntfyData.message) {
            const data = JSON.parse(ntfyData.message);
            console.log('📡 [Cloud SSE] Evento recibido:', data);
            this.handleRealtimeEvent(data);
          }
        } catch (e) {
          // Ignorar
        }
      };

      eventSource.onerror = (e) => {
        console.warn('⚠️ [Cloud SSE] Conexión interrumpida o reintentando...');
      };

      this.cloudEventSource = eventSource;
    } catch (e) {
      console.warn('⚠️ [Cloud SSE] No se pudo conectar al relay de nube:', e);
    }
  }

  connectToRealtime() {
    if (typeof window.pbSubscribeProducts === 'function') {
      window.pbSubscribeProducts(this.pbClientId, (action, product) => {
        if (product.code && product.code.startsWith('S')) {
          console.log(`📡 [PocketBase Realtime] Cambio en producto (${action}):`, product.name);
          const index = this.products.findIndex(p => p.id === product.id || p.code === product.code);
          if (index !== -1) {
            if (action === 'delete') {
              this.products.splice(index, 1);
            } else {
              this.products[index] = product;
            }
            this.renderCurrentProduct();
            this.updateThumbnails();
          } else if (action === 'create') {
            this.products.push(product);
            this.updateThumbnails();
          }
        }
      });
    }

    if (typeof window.pbSubscribeAlerts === 'function') {
      window.pbSubscribeAlerts(this.pbClientId, (action, alertData) => {
        console.log(`📡 [PocketBase Realtime] Alerta recibida:`, alertData.message);
        this.handleLiveAlertUpdate(action, alertData);
      });
    }
  }

  handleRealtimeEvent(data) {
    if (!data) return;

    // Detectar alertas en formato Supabase o local
    if (data.type === 'live_alert' || data.table === 'live_alerts') {
      const record = data.record || data.payload || data;
      this.handleLiveAlertUpdate(data.event || 'update', record);
      return;
    }

    if (data.table === 'products' && data.record) {
      const record = data.record;
      if (record.code && record.code.startsWith('S')) {
        console.log('📡 [Realtime Event Bridge] Producto sincronizado:', record.name);
        const index = this.products.findIndex(p => p.code === record.code || p.id === record.id);
        if (index !== -1) {
          if (record.is_available === false || record.is_available === 'false') {
            this.products.splice(index, 1);
            this.currentIndex = this.currentIndex % this.products.length;
          } else {
            this.products[index].price = record.price || this.products[index].price;
            this.products[index].tag = record.tag || this.products[index].tag;
            this.products[index].name = record.name || this.products[index].name;
            this.products[index].endsAt = record.endsAt || this.products[index].endsAt;
          }
          this.renderCurrentProduct();
          this.updateThumbnails();
        } else if (record.is_available !== false && record.is_available !== 'false') {
          this.products.push({
            id: record.id || `sand-${Date.now()}`,
            code: record.code,
            name: record.name,
            price: record.price,
            tag: record.tag || 'NUEVO 🔥',
            image: record.image || `frontend/images/products/${record.code.toLowerCase()}.webp`,
            description: record.description || ''
          });
          this.updateThumbnails();
        }
      }
    }
  }

  handleLiveAlertUpdate(eventType, alertData) {
    // Filtrar por local/clientId (ignorar si el destinatario no coincide)
    if (alertData.clientId && alertData.clientId !== this.pbClientId) {
      console.log(`🔇 Alerta ignorada (pertenener al local: ${alertData.clientId}, actual: ${this.pbClientId})`);
      return;
    }
    
    if (alertData.active_status === true || alertData.active_status === 'true' || alertData.active === true) {
      this.triggerFlashAlert(alertData);
    } else {
      this.dismissFlashAlert();
    }
  }

  playAlarmSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle'; // Sonido de sirena limpio y resonante
      
      // Simulación de barrido de sirena (wip-wop-wip-wop)
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1100, ctx.currentTime + 0.45);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.9);
      osc.frequency.linearRampToValueAtTime(1100, ctx.currentTime + 1.35);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 1.8);
      
      // Control de volumen con fade out al final
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + 1.5);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.8);
    } catch (e) {
      console.warn('⚠️ No se pudo reproducir alarma:', e);
    }
  }

  triggerFlashAlert(alert) {
    this.dismissFlashAlert(true);

    // Auto-dismiss welcome screen if active
    const welcome = document.getElementById('fullscreen-welcome');
    if (welcome) {
      welcome.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => welcome.remove(), 750);
    }

    this.isAlertActive = true;
    this.stopProductLoop();

    if (this.elements.alertMessage) {
      this.elements.alertMessage.textContent = alert.message;
    }

    // --- MODO INTERMITENTE ---
    if (alert.intermittent) {
      const showMs = (alert.show_seconds || 10) * 1000;
      const hideMs = (alert.hide_seconds || 50) * 1000;
      const totalMs = (alert.total_seconds || 600) * 1000;
      const withAlarm = alert.with_alarm !== false;
      const startTime = Date.now();

      const runCycle = () => {
        if (Date.now() - startTime >= totalMs) {
          this.dismissFlashAlert();
          return;
        }
        if (this.elements.alertOverlay) this.elements.alertOverlay.classList.add('active');
        if (withAlarm) this.playAlarmSound();
        this.isAlertActive = true;

        this._intermittentHideTimeout = setTimeout(() => {
          if (this.elements.alertOverlay) this.elements.alertOverlay.classList.remove('active');
          this.isAlertActive = false;
          this.startProductLoop();

          this._intermittentShowTimeout = setTimeout(() => {
            this.stopProductLoop();
            runCycle();
          }, hideMs);
        }, showMs);
      };

      this._intermittentMasterTimeout = setTimeout(() => {
        this.dismissFlashAlert();
      }, totalMs + 1000);

      runCycle();
      return;
    }

    // --- MODO NORMAL ---
    if (this.elements.alertOverlay) {
      this.elements.alertOverlay.classList.add('active');
    }

    if (this.alertTimeout) clearTimeout(this.alertTimeout);
    
    const duration = (alert.duration_seconds || alert.duration || 30) * 1000;
    this.alertTimeout = setTimeout(() => {
      this.dismissFlashAlert();
    }, duration);
  }

  dismissFlashAlert(silent = false) {
    if (!this.isAlertActive && !silent) return;
    
    if (this.elements.alertOverlay) {
      this.elements.alertOverlay.classList.remove('active');
    }

    this.isAlertActive = false;

    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
      this.alertTimeout = null;
    }
    if (this._intermittentHideTimeout) {
      clearTimeout(this._intermittentHideTimeout);
      this._intermittentHideTimeout = null;
    }
    if (this._intermittentShowTimeout) {
      clearTimeout(this._intermittentShowTimeout);
      this._intermittentShowTimeout = null;
    }
    if (this._intermittentMasterTimeout) {
      clearTimeout(this._intermittentMasterTimeout);
      this._intermittentMasterTimeout = null;
    }

    if (!silent) this.startProductLoop();
  }
}

// --- EFECTO DE MOVIMIENTO 3D INTERACTIVO (PARALLAX TILT) ---
document.addEventListener('mousemove', (e) => {
  if (window.showcaseController && (window.showcaseController.isAlertActive || window.showcaseController.isTransitioning)) return;
  const card = document.getElementById('product-card');
  if (!card) return;

  const x = e.clientX;
  const y = e.clientY;
  const w = window.innerWidth;
  const h = window.innerHeight;

  const rotateX = -((y - h / 2) / h) * 12;
  const rotateY = ((x - w / 2) / w) * 12;

  card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

document.addEventListener('mouseleave', () => {
  const card = document.getElementById('product-card');
  if (card) {
    card.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    setTimeout(() => {
      card.style.transition = 'all 0.5s ease-in-out';
    }, 600);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const controller = new ShowcaseScreenController();
  controller.init();
});
