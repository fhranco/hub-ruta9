# 📺 Guía de Despliegue y Optimización: Amazon Fire TV Stick
## TuVitrinaDigital.cl • RUTA 9 Gourmet Showcase

Esta guía detalla los pasos de configuración, las diferencias de hardware y las optimizaciones necesarias para desplegar la vitrina digital en dispositivos **Amazon Fire TV Stick 4K Plus** y **Amazon Fire TV Stick FHD 2024** sobre la red local.

---

## 1. Comparativa de Hardware y Rendimiento

| Característica | Amazon Fire TV Stick 4K Plus / Max | Amazon Fire TV Stick FHD (Lanzamiento 2024) |
| :--- | :--- | :--- |
| **Procesador (CPU)** | MediaTek MT8696 (4 núcleos @ 1.8 GHz) | MediaTek MT8696D (4 núcleos @ 1.7 GHz) |
| **Gráficos (GPU)** | Imagination GE9215 @ 750 MHz | Imagination GE8300 @ 650 MHz |
| **Memoria RAM** | **2 GB DDR4** | **1 GB DDR4** |
| **Sistema Operativo** | Fire OS 7 (Basado en Android 9) | Fire OS 7 / 8 (Basado en Android 11) |
| **Resolución Máxima** | 2160p (4K Ultra HD) @ 60 FPS | 1080p (Full HD) @ 60 FPS |
| **Tecnología Wi-Fi** | Wi-Fi 6 (802.11ax) Dual-band | Wi-Fi 5 (802.11ac) Dual-band |
| **Desempeño en Silk** | **Excelente**. Fluidez total (60 FPS estables) con transiciones pesadas y efectos. | **Bueno**. Requiere optimizar efectos de sombras y cantidad de partículas para evitar tirones. |

> [!IMPORTANT]
> La principal restricción de rendimiento en el modelo **FHD 2024** es su **1 GB de RAM**. El navegador web Amazon Silk puede recargar la página o ralentizarse si el consumo de memoria supera los límites permitidos. En cambio, el **4K Plus** corre el showcase actual con soltura cinematográfica.

---

## 2. Preparación de la Red Local (Conectar el Fire TV Stick)

Para que los Fire TV Sticks carguen las pantallas en tiempo real desde el Mac local, ambos deben estar bajo la misma red Wi-Fi:

1. **Obtener la IP Local de tu Mac**:
   - En tu Mac, abre el Terminal y ejecuta: `ipconfig getifaddr en0` (o ve a *Ajustes del Sistema > Red > Wi-Fi > Detalles*).
   - Supongamos que tu IP local es `192.168.100.15`.
2. **Arrancar el Servidor Unificado en tu Mac**:
   - Asegúrate de tener el servidor corriendo en el puerto `8000`:
     ```bash
     node relay-server.js
     ```
3. **Probar el acceso en el Fire TV Stick**:
   - Abre el navegador **Amazon Silk** en tu Fire TV Stick.
   - En la barra de direcciones, escribe la URL de la pantalla correspondiente:
     - **Pantalla 1 (Burgers Showcase)**: `http://<IP_DE_TU_MAC>:8000/index.html`
     - **Pantalla 2 (Acompañamientos & Bebidas)**: `http://<IP_DE_TU_MAC>:8000/pantalla2.html`

---

## 3. Configuración y Optimización del Navegador Amazon Silk

El navegador nativo de Fire OS es **Amazon Silk** (basado en Chromium). Para dejar la vitrina en producción de manera limpia, sigue estos ajustes usando el control remoto:

### A. Ocultar la Barra de Direcciones (Modo Pantalla Completa)
1. Escribe la dirección web y carga la página.
2. Presiona el botón de **Menú (las tres líneas horizontales)** en tu control remoto de Fire TV.
3. Selecciona la opción **Pantalla Completa (Full Screen)** en la parte superior.
4. La vitrina cubrirá el 100% de la pantalla del televisor sin bordes ni controles visibles.

### B. Limpieza de Caché Dinámica
Hemos integrado en `index.html` y `pantalla2.html` un script de fuerza bruta que desregistra automáticamente Service Workers y limpia la caché local de Silk al cargar la página:
```javascript
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let reg of registrations) reg.unregister();
    });
}
if ('caches' in window) {
    caches.keys().then(function(names) {
        for (let name of names) caches.delete(name);
    });
}
```
*Si necesitas forzar un refresco absoluto tras una actualización física de los archivos web, simplemente mantén presionado el botón central de tu control remoto sobre la opción de recarga en el navegador Silk.*

---

## 4. Modo Kiosco: Auto-Inicio Automático (Boot to App)

En un local gastronómico real, las pantallas deben encenderse y cargar la vitrina de forma automática cuando el televisor reciba energía, sin que el operador deba buscar el control remoto de Amazon.

### Opción A: Launch on Boot (Recomendada para Marcha Blanca)
1. En tu Fire TV Stick, ve a la Appstore y busca la aplicación gratuita **Launch on Boot** (o descárgala vía APK).
2. Configura la aplicación para:
   - **Enable**: Activado.
   - **Launch on**: Boot (Al iniciar el dispositivo).
   - **Select App**: Selecciona **Internet (Amazon Silk)**.
3. Asegúrate de dejar el navegador Silk con la pestaña de la vitrina abierta antes de apagarlo. Al encenderse, el Fire TV cargará directamente Silk y la pestaña activa a pantalla completa.

### Opción B: Empaquetar como APK Nativo Android (Fase 2 - Alta Escala)
Para ocultar por completo el navegador y tener control absoluto del hardware:
1. Usamos **Capacitor** para envolver nuestra web en una app nativa Android:
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init "Ruta 9 Vitrina" "cl.tuvitrinadigital.ruta9" --web-dir=.
   npx cap add android
   ```
2. Compilamos el archivo `.apk` y lo instalamos en los Fire TV Sticks mediante **ADB Link** o la app **Downloader**.
3. La aplicación se ejecuta como un canal nativo a pantalla completa y autoejecutable.

---

## 5. Prevención de Suspensión y Ahorro de Energía (Sleep Prevention)

Por defecto, los dispositivos Amazon Fire TV entran en modo de suspensión (pantalla en negro/salvapantallas) tras **20 minutos** de inactividad. Esto arruinaría la exhibición.

### Método 1: HTML5 Wake Lock API (Integrado en el Frontend)
Hemos diseñado las pantallas para utilizar la API Wake Lock de HTML5 cuando esté disponible en el motor Chromium de Silk. Esto le indica al hardware del Fire Stick que la página está mostrando contenido multimedia activo y bloquea la suspensión:
```javascript
let wakeLock = null;
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('✅ Wake Lock activado. El televisor no se dormirá.');
    }
  } catch (err) {
    console.warn(`Wake Lock fallido: ${err.message}`);
  }
}
document.addEventListener('visibilitychange', () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    requestWakeLock();
  }
});
requestWakeLock();
```

### Método 2: Desactivar la Suspensión por ADB (100% Infalible en Local)
Si deseas desactivar permanentemente el temporizador de apagado de la televisión desde tu Mac:
1. Activa **Depuración ADB** en tu Fire TV Stick (*Configuración > Mi Fire TV > Opciones para desarrolladores*).
2. Conéctate desde el terminal de tu Mac usando la IP del Fire TV Stick:
   ```bash
   adb connect <IP_DEL_FIRE_STICK>:5555
   ```
3. Ejecuta el comando para deshabilitar el apagado automático:
   ```bash
   adb shell settings put secure sleep_timeout 0
   ```
   *(Para restaurar el valor de fábrica en el futuro, ejecuta `adb shell settings put secure sleep_timeout 1200000`)*.

---

## 6. Ajustes de Código para Máximo Rendimiento (Smooth 60 FPS)

Para garantizar transiciones cinemáticas fluidas en el **Fire TV Stick FHD 2024**:

1. **Aceleración por GPU forzada**:
   En `frontend/style.css`, todas las transiciones y transformaciones se aplican sobre propiedades aceleradas por hardware (`transform` y `opacity`). Evitamos animar propiedades de maquetación como `width`, `height`, `left` o `margin`, las cuales provocan re-cálculos del flujo del navegador (reflows) y causan tirones.
2. **Optimización del Generador de Brasa (Sparks)**:
   El número de chispas flotantes está limitado a **10 elementos**. Esto previene que el buffer de gráficos se desborde en el modelo de 1 GB de RAM.
3. **Formatos de Imagen de Alto Rendimiento**:
   Todas las imágenes de las hamburguesas están en formato **WebP comprimido** (`.webp`). Este formato reduce el peso del archivo a menos de un 30% respecto a PNG tradicionales, disminuyendo radicalmente el uso de memoria RAM de texturas en la GPU del stick.

---
---
*Documento preparado con amor por Antigravity IDE para la marcha blanca y escalabilidad de Ruta 9 Gourmet en TuVitrinaDigital.cl*

---

## 7. 📺 Fire TV Stick vs. Roku: ¿Qué pasa si usamos sus navegadores nativos?

Si estás evaluando usar directamente el navegador web nativo en estos dispositivos, debes tener en cuenta que las dos plataformas son radicalmente distintas en su soporte web:

### A. Amazon Fire TV Stick (Amazon Silk Browser) — ✅ 100% Compatible
El navegador **Amazon Silk** es un navegador robusto basado en el motor **Chromium** (el mismo núcleo de Google Chrome). 
* **Soporte de Estándares**: Soporta a la perfección HTML5, CSS Grid, variables CSS, animaciones GPU y, lo más importante, **EventSource (SSE)** para la sincronización en tiempo real.
* **Resultado**: La vitrina digital funciona nativamente abriendo Silk con tu URL local. No necesitas instalar aplicaciones complejas; solo abres el navegador, configuras pantalla completa y listo.

### B. Roku (Dispositivos Roku Express, Roku TV, etc.) — ❌ Incompatible
**Roku OS NO tiene un navegador web nativo ni oficial.** Roku funciona con un sistema operativo cerrado diseñado exclusivamente para canales de streaming de video.
1. **Navegadores de Terceros**: En la tienda de canales de Roku existen navegadores no oficiales (como *Web Browser X* o *Roku Web Browser*). Sin embargo, estos navegadores utilizan motores de renderizado web **obsoletos y extremadamente limitados**.
2. **Limitaciones Técnicas de Roku**:
   - **No soporta SSE (Server-Sent Events)** ni WebSockets: Tus pantallas no se sincronizarán en tiempo real cuando el administrador o el cajero cambien precios o agoten productos.
   - **No soporta CSS Grid o Flexbox moderno**: El diseño visual premium y la tipografía de Ruta 9 se romperán por completo en pantalla.
   - **Sin aceleración gráfica para HTML5**: Las transiciones dinámicas y los efectos de chispas correrán a 1 o 2 FPS, o simplemente causarán que el Stick de Roku se congele.
3. **¿Cómo se podría usar un Roku? (No Recomendado)**: La única forma de ver la vitrina en un Roku es haciendo *Screen Mirroring* (Duplicación de Pantalla) desde un teléfono Android, una tablet o una laptop conectada 24/7. Esto no es viable comercialmente para un local, ya que tendrías un dispositivo secundario ocupado permanentemente.

> [!WARNING]
> **Conclusión técnica**: Para proyectos de cartelería digital y vitrinas dinámicas en locales, **evita por completo Roku**. Los dispositivos basados en Android TV (como **Amazon Fire TV Stick** o **Chromecast con Google TV**) son la opción profesional por excelencia, ya que su navegador Silk o Chrome corre de forma nativa e independiente tu código web a 60 FPS.
