/**
 * Smart Showcase Screen Controller - Version 1.0.0
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
  if (img.dataset.hasFailed) {
    const urlParams = new URLSearchParams(window.location.search);
    const branch = urlParams.get('local') || urlParams.get('branch');
    img.src = branch === 'zf' ? 'frontend/images/products/Zona Franca/b1.webp' : 'frontend/images/products/b1.webp';
    return;
  }
  img.dataset.hasFailed = true;

  const src = img.src || '';
  let foundCode = null;

  const match = src.match(/([bs]\d+|cc|ac|k\d+)\b/i);
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

  const urlParams = new URLSearchParams(window.location.search);
  const branch = urlParams.get('local') || urlParams.get('branch');
  const pathPrefix = branch === 'zf' ? 'frontend/images/products/Zona Franca' : 'frontend/images/products';

  if (foundCode) {
    img.src = `${pathPrefix}/${foundCode}.webp`;
  } else {
    img.src = (src.includes('side') || src.includes('/s')) 
      ? `${pathPrefix}/s1.webp` 
      : `${pathPrefix}/b1.webp`;
  }
};

// --- CONFIGURACIÓN DE PRODUCTOS DE LA CARTA (MOCK) ---
const mockProducts = [
  {
    id: 'prod-1',
    code: 'B1',
    name: 'Burger básica',
    price: '$8.200',
    tag: 'OFERTA FLASH ⚡',
    image: 'frontend/images/products/b1.webp',
    description: 'Burger de vacuno premium preparada a la plancha con fundente queso gouda o queso cheddar de alta calidad.',
    endsAt: new Date(Date.now() + 25 * 60 * 1000).toISOString() // Expira en 25 minutos
  },
  {
    id: 'prod-2',
    code: 'B2',
    name: 'Completa',
    price: '$9.600',
    tag: 'MÁS PEDIDA 🏆',
    image: 'frontend/images/products/b2.webp',
    description: 'Burger premium con queso gouda derretido, lechuga hidropónica fresca, tomate rodajas, cebolla morada crujiente y huevo frito.',
    endsAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // Expira en 15 minutos
  },
  {
    id: 'prod-3',
    code: 'B3',
    name: 'Clásica BBQ',
    price: '$10.900',
    tag: 'OFERTA LIMITADA 🔥',
    image: 'frontend/images/products/b3.webp',
    description: 'Burger premium con queso cheddar fundido, tocino crocante, huevo frito, pepinillos dulces y un toque de salsa BBQ casera.',
    endsAt: new Date(Date.now() + 45 * 60 * 1000).toISOString() // Expira en 45 minutos
  },
  {
    id: 'prod-4',
    code: 'B4',
    name: 'Camarones al limón',
    price: '$10.500',
    tag: 'ESPECIAL DE MAR 🍋',
    image: 'frontend/images/products/b4.webp',
    description: 'Novedosa combinación de burger premium coronada con camarones salteados al limón y fresca palta trozada.'
  },
  {
    id: 'prod-5',
    code: 'B5',
    name: 'Nachos',
    price: '$10.500',
    tag: 'CRUNCHY MEX 🌶️',
    image: 'frontend/images/products/b5.webp',
    description: 'Burger premium acompañada de fundente queso gouda, tomates frescos, palta trozada, mix de ajíes y crujientes nachos.',
    endsAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
  },
  {
    id: 'prod-6',
    code: 'B6',
    name: 'BBQ Tocino',
    price: '$10.500',
    tag: 'DOBLE TOCINO 🥓',
    image: 'frontend/images/products/b6.webp',
    description: 'Burger a las brasas con abundante queso cheddar fundido, tocino crocante, aros de cebolla apanados y salsa BBQ.',
    endsAt: new Date(Date.now() + 55 * 60 * 1000).toISOString() // Expira en 55 minutos
  },
  {
    id: 'prod-7',
    code: 'B7',
    name: 'La 420',
    price: '$9.500',
    tag: 'VEGGIE STYLE 🌿',
    image: 'frontend/images/products/b7.webp',
    description: 'Hamburguesa vegetariana casera de garbanzos sazonados con lechuga hidropónica, cebollín grillado, palta trozada y pepinillos.'
  },
  {
    id: 'prod-8',
    code: 'B8',
    name: 'BLT',
    price: '$10.500',
    tag: 'CLÁSICA 🍅',
    image: 'frontend/images/products/b8.webp',
    description: 'La legendaria combinación BLT hecha burger: jugosa carne premium con tocino ahumado crocante, lechuga y tomate fresco.'
  },
  {
    id: 'prod-9',
    code: 'B9',
    name: 'Doble cuarto libra',
    price: '$13.600',
    tag: 'SÚPER COLOSAL 👑',
    image: 'frontend/images/products/b9.webp',
    description: 'Para estómagos insaciables: dos jugosas burgers premium acompañadas de un medallón de queso gouda crocante super fundido.',
    endsAt: new Date(Date.now() + 120 * 60 * 1000).toISOString() // Expira en 2 horas
  },
  {
    id: 'prod-10',
    code: 'B10',
    name: 'Provoleta',
    price: '$12.500',
    tag: 'QUESERA 🧀',
    image: 'frontend/images/products/b10.webp',
    description: 'Burger gourmet coronada con provoleta parrillera dorada, huevo frito y morrón asado a las brasas.'
  },
  {
    id: 'prod-11',
    code: 'B11',
    name: 'Vegetariana',
    price: '$9.500',
    tag: '100% VEGANA 🌿',
    image: 'frontend/images/products/b11.webp',
    description: 'Provoleta parrillera grillada con pimientos morrones asados, champignones salteados, cebolla caramelizada dulce y tomate rodajas.'
  },
  {
    id: 'prod-12',
    code: 'B12',
    name: 'Azul Ruibarbo',
    price: '$9.800',
    tag: 'GOURMET EXCLUSIVA 🫐',
    image: 'frontend/images/products/b12.webp',
    description: 'Exquisito contraste: burger de carne madurada con queso azul de cueva, cebolla caramelizada y salsa BBQ artesanal con toques de ruibarbo.',
    endsAt: new Date(Date.now() + 40 * 60 * 1000).toISOString() // Expira en 40 minutos
  },
  {
    id: 'prod-13',
    code: 'B13',
    name: 'Cheddar plancha',
    price: '$9.800',
    tag: 'DERRETIDA 🥞',
    image: 'frontend/images/products/b13.webp',
    description: 'Burger jugosa a la plancha con doble de queso cheddar americano, cebolla asada a la plancha y un huevo frito dorado.'
  },
  {
    id: 'prod-14',
    code: 'B14',
    name: 'Gouda frito',
    price: '$10.600',
    tag: 'SÚPER CRUNCH 🥚',
    image: 'frontend/images/products/b14.webp',
    description: 'Burger gourmet con queso gouda apanado frito, cebolla caramelizada, tocino crocante y huevo frito.'
  },
  {
    id: 'prod-15',
    code: 'B15',
    name: 'La Tocinetta',
    price: '$10.800',
    tag: 'LOCURA TOCINO 🥓',
    image: 'frontend/images/products/b15.webp',
    description: 'La burger del tocino definitivo: trozos de tocino crocante, chutney de tocino ahumado dulce, chocobacon y mayonesa de tocino.',
    endsAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // Expira en 10 minutos
  },
  {
    id: 'prod-16',
    code: 'B16',
    name: 'Kill Bill',
    price: '$12.800',
    tag: 'EXPLOSIVA 🍤',
    image: 'frontend/images/products/b16.webp',
    description: 'Carne premium de 150g con queso crema fundido y espectacular camarones envueltos en tocino crocante y salsa ginzoo.'
  },
  {
    id: 'prod-17',
    code: 'B17',
    name: 'La Gran "S"',
    price: '$11.800',
    tag: 'SÚPER COMPLETA ⭐',
    image: 'frontend/images/products/b17.webp',
    description: 'Burger premium con queso cheddar americano, tocino ahumado, palta trozada fresca y huevo frito.'
  },
  {
    id: 'prod-18',
    code: 'B18',
    name: 'La Francesa',
    price: '$11.800',
    tag: 'QUESO AZUL 🇫🇷',
    image: 'frontend/images/products/b18.webp',
    description: 'Sofisticación gourmet: burger premium con quesos gouda y azul fundidos, cebolla caramelizada y champignones salteados.'
  },
  {
    id: 'prod-19',
    code: 'B19',
    name: 'La "36"',
    price: '$11.800',
    tag: 'PARRILLERA 🍔',
    image: 'frontend/images/products/b19.webp',
    description: 'Burger premium con queso cheddar derretido, tocino crocante, aros de cebolla crujientes, pepinillos y salsa BBQ.'
  },
  {
    id: 'prod-20',
    code: 'B20',
    name: 'Los Tres Chanchitos',
    price: '$12.500',
    tag: 'CARNÍVORA 🐷',
    image: 'frontend/images/products/b20.webp',
    description: 'El festín de la carne: burger premium con queso gouda, tocino crocante, pulled pork ahumado, trozos de longaniza y salsa BBQ.'
  },
  {
    id: 'prod-21',
    code: 'B21',
    name: 'La Limeña',
    price: '$10.500',
    tag: 'SABOR PERUANO 🇵🇪',
    image: 'frontend/images/products/b21.webp',
    description: 'Exotismo puro: burger premium acompañada de suave queso crema, ceviche fresco de camarón, mix de ajíes y crujientes tortillas de maíz.'
  },
  {
    id: 'prod-22',
    code: 'B22',
    name: 'Club Veggie',
    price: '$9.800',
    tag: 'ESTILO CLUB 🌿',
    image: 'frontend/images/products/b22.webp',
    description: 'Burger vegetariana con doble de queso cheddar, lechuga hidropónica fresca, tomate, rodajas de pepinillos y salsa secreta club.'
  },

  {
    id: 'prod-24',
    code: 'B24',
    name: 'Veggie Thai',
    price: '$10.500',
    tag: 'THAI FRESH 🌶️',
    image: 'frontend/images/products/b24.webp',
    description: 'Burger de garbanzos condimentada al estilo thai, con champignones, lechuga hidropónica, cebolla morada, cebollín y mix de ajíes orientales.'
  },
  {
    id: 'prod-25',
    code: 'BF',
    name: 'Burgers Factory',
    price: '$6.700',
    tag: 'ARMA TU GUSTO 🛠️',
    image: 'frontend/images/products/b5.webp',
    description: '¡Tu imaginación es el límite! Incluye base premium, salsa artesanal a elección, y una gran variedad de extras para armar.'
  }
];

class ShowcaseScreenController {
  constructor() {
    // Referencias a los elementos del DOM
    this.elements = {
      productCard: document.getElementById('product-card'),
      productImg: document.getElementById('product-img'),
      productCode: document.getElementById('product-code'),
      productName: document.getElementById('product-name'),
      productPrice: document.getElementById('product-price'),
      productTag: document.getElementById('product-tag'),
      productDesc: document.getElementById('product-desc'), // Elemento adicional para la descripción premium
      alertOverlay: document.getElementById('alert-overlay'),
      alertMessage: document.getElementById('alert-message')
    };

    // Estado del controlador
    this.products = [...mockProducts];
    this.currentIndex = 0;
    this.loopInterval = null;
    this.countdownInterval = null; // Temporizador para ofertas por tiempo limitado
    this.alertTimeout = null;
    this.isAlertActive = false;
    this.transitionDuration = 500; // ms (debe coincidir con la duración de Tailwind)
    this.rotationTime = 5000; // 5 segundos por hamburguesa
    
    // Configuración PocketBase Realtime
    // El client_id se puede forzar aquí o detectar desde el subdominio o parámetro URL
    const urlParams = new URLSearchParams(window.location.search);
    this.pbClientId = urlParams.get('local') || urlParams.get('clientId') || null; // Carga el local específico o todos si es null
    this.pbConnected = false;
    this.wakeLock = null;
  }

  /**
   * Solicita el bloqueo de suspensión de pantalla para Smart TVs (Wake Lock)
   */
  async requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request('screen');
        console.log('✅ Wake Lock activado. El televisor no se dormirá.');
      }
    } catch (err) {
      console.warn(`⚠️ Wake Lock fallido: ${err.message}`);
    }
  }

  /**
   * Inicializa la pantalla.
   * Carga con datos locales e inicializa los timers y puentes locales.
   */
  async init() {
    console.log('🚀 Inicializando Showcase Screen Controller...');

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
      const catalogFile = branch === 'zf' ? 'frontend/catalog-zf.json' : 'frontend/catalog.json';
      
      console.log(`📦 Intentando cargar catálogo desde: ${catalogFile}`);
      const response = await fetch(catalogFile);
      const data = await response.json();
      if (data && data.burgers) {
        this.products = data.burgers;
        console.log(`📦 Catálogo de Hamburguesas cargado dinámicamente desde ${catalogFile}`);
      }
    } catch (e) {
      console.warn("⚠️ Fallback: No se pudo cargar el catálogo dinámico, usando copia local en memoria.", e);
    }

    // Generar la grilla de la carta completa
    this.renderMenuGrid();

    // Crear partículas de ambiente flotantes optimizadas para Smart TV
    this.createAmbientParticles();

    // Renderizar el primer producto
    this.renderCurrentProduct();
    
    // Iniciar el loop de rotación
    this.startProductLoop();

    // Registrar puente de simulación local (BroadcastChannel) como fallback offline
    this.registerSimulationBridge();

    // --- ESCUCHADORES DE AUTO-RECARGA DE SEGURIDAD (STABILITY CONTROLS) ---
    // 1. Recargar si se reconecta a internet (recuperación de cortes de Wi-Fi)
    window.addEventListener('online', () => {
      console.log('🌐 Conexión restablecida. Recargando pantalla para actualizar datos...');
      setTimeout(() => window.location.reload(), 1500);
    });

    // 2. Auto-recarga silenciosa de seguridad cada 2 horas para vaciar caché y liberar RAM en Smart TVs
    setInterval(() => {
      console.log('⏰ Ejecutando auto-recarga periódica de estabilidad en vitrina...');
      window.location.reload();
    }, 2 * 60 * 60 * 1000); 
  }

  /**
   * Crea partículas doradas de ambiente que flotan por la pantalla (CSS composited).
   */
  createAmbientParticles() {
    const container = document.querySelector('.app-container');
    if (!container) return;
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.className = 'tv-ambient-particle';
      p.style.setProperty('--delay', `${Math.random() * 8}s`);
      p.style.setProperty('--left', `${Math.random() * 100}%`);
      p.style.setProperty('--scale', `${0.3 + Math.random() * 0.7}`);
      p.style.setProperty('--duration', `${8 + Math.random() * 8}s`);
      container.appendChild(p);
    }
  }

  /**
   * Renderiza el producto actual en pantalla (sin animación, usado en inicio)
   */
  renderCurrentProduct() {
    const product = this.products[this.currentIndex];
    if (!product) return;

    // Alternar el diseño izquierda/derecha de forma dinámica en cada rotación en la TV
    if (this.currentIndex % 2 === 0) {
      document.body.classList.remove('layout-reversed');
    } else {
      document.body.classList.add('layout-reversed');
    }

    if (this.elements.productImg) this.elements.productImg.src = product.image;
    if (this.elements.productCode) {
      if (product.code) {
        this.elements.productCode.textContent = product.code;
        this.elements.productCode.classList.remove('hidden');
      } else {
        this.elements.productCode.classList.add('hidden');
      }
    }
    if (this.elements.productName) {
      this.elements.productName.textContent = product.name;
      if (product.name.toUpperCase().includes('DEL MES') || (product.code && product.code.toUpperCase() === 'B5')) {
        this.elements.productName.style.color = '#fbbf24';
        this.elements.productName.style.textShadow = '0 0 15px rgba(251, 191, 36, 0.4)';
      } else {
        this.elements.productName.style.color = '#ffffff';
        this.elements.productName.style.textShadow = 'none';
      }
    }
    if (this.elements.productPrice) this.elements.productPrice.textContent = product.price;

    // Actualizar dinámicamente el Pop-Up de sabor inteligente según los ingredientes reales
    const popTextEl = document.getElementById('flavor-pop-text');
    const popIconEl = document.querySelector('.flavor-pop-badge .pop-icon');
    if (popTextEl && product) {
      const nameUpper = (product.name || '').toUpperCase();
      const descUpper = (product.description || '').toUpperCase();

      let popPhrase = { text: '¡100% GOURMET!', icon: '👑' };

      if (nameUpper.includes('DEL MES') || (product.code && product.code.toUpperCase() === 'B5')) {
        popPhrase = { text: '¡EDICIÓN LIMITADA!', icon: '👑🌶️' };
      } else if (nameUpper.includes('CHICKEN') || descUpper.includes('POLLO') || descUpper.includes('MILANESA')) {
        popPhrase = { text: '¡POLLO CROCANTE!', icon: '🍗' };
      } else if (descUpper.includes('TOCINO')) {
        popPhrase = { text: '¡TOCINO CROCANTE!', icon: '🥓' };
      } else if (descUpper.includes('CHEDDAR') || descUpper.includes('GOUDA') || descUpper.includes('QUESO')) {
        popPhrase = { text: '¡FULL QUESO DERRETIDO!', icon: '🧀' };
      } else if (descUpper.includes('CEBOLLA') || nameUpper.includes('CEBOLLA')) {
        popPhrase = { text: '¡CEBOLLA CARAMELIZADA!', icon: '🧅' };
      } else {
        popPhrase = { text: '¡RECETA CASERA!', icon: '🍔' };
      }

      popTextEl.textContent = popPhrase.text;
      if (popIconEl) popIconEl.textContent = popPhrase.icon;
    }
    
    if (this.elements.productTag) {
      this.elements.productTag.textContent = product.tag;
      // Estilizar el tag según su contenido para dar un toque premium
      this.styleProductTag(product.tag);
    }
    
    // Si es la Burger del Mes (B5), aplicar aura/fondo rojo fuego de celebración
    const isBurgerDelMes = product.name.toUpperCase().includes('DEL MES') || (product.code && product.code.toUpperCase() === 'B5');
    if (isBurgerDelMes) {
      document.body.classList.add('theme-burger-del-mes-red');
    } else {
      document.body.classList.remove('theme-burger-del-mes-red');
    }

    // --- INTEGRACIÓN DINÁMICA CON EL NUEVO DISEÑO POP-ART ---
    
    // 1. Actualizar el TÍTULO GIGANTE DE FONDO según la hamburguesa activa
    const bgMassiveText = document.getElementById('bg-massive-text');
    if (bgMassiveText) {
      const nameUpper = product.name.toUpperCase();
      if (nameUpper.includes('CHEDDAR') || nameUpper.includes('BESTIA')) {
        bgMassiveText.textContent = 'CHEESEBURGER';
      } else if (nameUpper.includes('BBQ') || nameUpper.includes('MONSTER') || nameUpper.includes('TOCINO') || nameUpper.includes('TOCINETTA')) {
        bgMassiveText.textContent = 'MONSTER BBQ';
      } else if (nameUpper.includes('CHICKEN') || nameUpper.includes('VOLCANO')) {
        bgMassiveText.textContent = 'CHICKEN CRUNCH';
      } else if (nameUpper.includes('COMBO') || nameUpper.includes('FACTORY')) {
        bgMassiveText.textContent = 'BURGER FACTORY';
      } else if (nameUpper.includes('CAMARONES') || nameUpper.includes('LIMEÑA') || nameUpper.includes('BILL')) {
        bgMassiveText.textContent = 'SEAFOOD SPECIAL';
      } else if (nameUpper.includes('VEG') || nameUpper.includes('420')) {
        bgMassiveText.textContent = 'VEGGIE GARDEN';
      } else if (nameUpper.includes('MES') || nameUpper.includes('MEX')) {
        bgMassiveText.textContent = 'MEXICAN STYLE';
      } else {
        const words = product.name.split(' ');
        let firstWord = words[0] || 'BURGER';
        if ((firstWord.toLowerCase() === 'la' || firstWord.toLowerCase() === 'los') && words[1]) {
          firstWord = words[1];
        }
        // Limpiar comillas si tiene la sigla
        firstWord = firstWord.replace(/["']/g, '');
        bgMassiveText.textContent = firstWord.toUpperCase();
      }
    }

    // 2. Actualizar el PRECIO del Botón Central "ORDER NOW"
    const priceBtn = document.getElementById('price-btn');
    if (priceBtn) {
      priceBtn.textContent = `ORDER NOW • ${product.price}`;
    }

    // 3. Actualizar dinámicamente las miniaturas inferiores en formato rueda sinfín
    const total = this.products.length;
    
    const getIndex = (offset) => {
      let idx = (this.currentIndex + offset) % total;
      if (idx < 0) idx += total;
      return idx;
    };

    const left1Idx = getIndex(-2);
    const left2Idx = getIndex(-1);
    const right1Idx = getIndex(1);
    const right2Idx = getIndex(2);

    const thumbs = [
      { id: 'thumb-prod-1', idx: left1Idx },
      { id: 'thumb-prod-2', idx: left2Idx },
      { id: 'thumb-prod-3', idx: right1Idx },
      { id: 'thumb-prod-4', idx: right2Idx }
    ];

    thumbs.forEach(t => {
      const thumbEl = document.getElementById(t.id);
      if (thumbEl) {
        // Actualizar la acción de click para que salte directo al producto
        thumbEl.setAttribute('onclick', `selectProduct(${t.idx})`);
        
        // Actualizar la imagen dentro del botón
        const img = thumbEl.querySelector('img');
        if (img && this.products[t.idx]) {
          img.src = this.products[t.idx].image;
          img.alt = this.products[t.idx].name;
        }
      }
    });

    // --- MANEJO DE OFERTAS POR TIEMPO LIMITADO (COUNTDOWN TIMER) ---
    // Limpiar intervalo anterior de cuenta regresiva
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }

    const countdownContainer = document.getElementById('countdown-container');
    const productCountdown = document.getElementById('product-countdown');

    if (product.endsAt) {
      if (countdownContainer) countdownContainer.classList.remove('hidden');
      
      const updateCountdown = () => {
        const delta = new Date(product.endsAt) - Date.now();
        
        if (delta <= 0) {
          if (productCountdown) productCountdown.textContent = "OFERTA CONCLUIDA";
          if (countdownContainer) {
            countdownContainer.classList.add('bg-slate-800/80', 'text-slate-400');
            countdownContainer.classList.remove('bg-red-500/20', 'text-red-400', 'animate-pulse');
          }
          clearInterval(this.countdownInterval);
          this.countdownInterval = null;
          return;
        }

        const hours = String(Math.floor((delta / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        const minutes = String(Math.floor((delta / (1000 * 60)) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((delta / 1000) % 60)).padStart(2, '0');

        if (productCountdown) {
          productCountdown.textContent = `${hours}:${minutes}:${seconds}`;
        }
      };

      updateCountdown(); // Ejecutar de inmediato
      this.countdownInterval = setInterval(updateCountdown, 1000);
    } else {
      if (countdownContainer) countdownContainer.classList.add('hidden');
    }
  }

  /**
   * Renderiza dinámicamente la carta completa de hamburguesas en la grilla del overlay.
   */
  renderMenuGrid() {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    grid.innerHTML = ''; // Limpiar contenido anterior

    this.products.forEach((product, index) => {
      const card = document.createElement('div');
      card.className = 'bg-neutral-900/40 border border-white/5 hover:border-amber-500/50 p-6 rounded-2xl flex flex-col justify-between space-y-4 transition-all duration-300 transform hover:-translate-y-2 group shadow-xl';
      
      // Determinar clase de color del tag para la tarjeta
      const tagText = product.tag.toUpperCase();
      let tagColorClass = 'bg-white text-black border border-black/5';
      if (tagText.includes('ESTRELLA') || tagText.includes('OFERTA') || tagText.includes('PREMIUM') || tagText.includes('MÁS PEDIDA')) {
        tagColorClass = 'bg-yellow-400 text-black';
      } else if (tagText.includes('AHUMADA') || tagText.includes('🔥') || tagText.includes('TOCINO') || tagText.includes('CARNÍVORA')) {
        tagColorClass = 'bg-orange-500 text-white';
      } else if (tagText.includes('PICANTE') || tagText.includes('🌶️')) {
        tagColorClass = 'bg-red-500 text-white';
      } else if (tagText.includes('VEGGIE') || tagText.includes('VEGANA') || tagText.includes('🌿')) {
        tagColorClass = 'bg-green-600 text-white';
      }

      card.innerHTML = `
        <div class="relative h-32 flex items-center justify-center overflow-hidden">
          <img src="${product.image}" alt="${product.name}" class="h-28 object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)] group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div class="space-y-1">
          <span class="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${tagColorClass}">${product.tag}</span>
          <h3 class="font-extrabold text-white text-base mt-2">${product.code ? product.code + ' • ' : ''}${product.name}</h3>
          <p class="text-[10px] text-neutral-400 line-clamp-3">${product.description}</p>
        </div>
        <div class="flex items-center justify-between pt-2 border-t border-white/5">
          <span class="text-base font-black text-white">${product.price}</span>
          <button onclick="selectProductFromMenu(${index})" class="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full transition">
              VER PANTALLA
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  /**
   * Aplica estilos responsivos y estéticos al tag según su tipo
   */
  styleProductTag(tagText) {
    if (!this.elements.productTag) return;
    const tag = this.elements.productTag;
    
    // Usamos el sistema de diseño central de style.css
    tag.className = 'product-tag-sticker glass-badge';
    
    const text = tagText.toUpperCase();
    if (text.includes('DEL MES') || text.includes('👑') || text.includes('ESTRELLA') || text.includes('OFERTA') || text.includes('PREMIUM') || text.includes('MÁS PEDIDA')) {
      tag.classList.add('glass-badge-gold');
    } else if (text.includes('AHUMADA') || text.includes('🔥') || text.includes('TOCINO') || text.includes('CARNÍVORA')) {
      tag.classList.add('glass-badge-red');
    } else if (text.includes('PICANTE') || text.includes('🌶️')) {
      tag.classList.add('glass-badge-red');
    } else if (text.includes('VEGGIE') || text.includes('VEGANA') || text.includes('🌿')) {
      tag.classList.add('glass-badge-green');
    }
  }

  /**
   * Inicia el carrusel infinito de productos. Rotación automática cada 10s.
   */
  startProductLoop() {
    this.stopProductLoop(); // Asegurar que no haya duplicados
    
    this.loopInterval = setInterval(() => {
      this.nextProduct();
    }, this.rotationTime);
    
    console.log('🔄 Bucle de productos iniciado (Rotación: 3s)');
  }

  /**
   * Detiene el carrusel infinito
   */
  stopProductLoop() {
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
      console.log('⏸️ Bucle de productos pausado');
    }
  }

  /**
   * Pasa al siguiente producto aplicando una transición fluida libre de parpadeos.
   * Utiliza precarga de imágenes para garantizar velocidad y evitar el flash blanco en Amazon Fire TV.
   */
  /**
   * Pasa al siguiente producto aplicando una transición fluida libre de parpadeos.
   * Utiliza precarga de imágenes para garantizar velocidad y evitar el flash blanco en Amazon Fire TV.
   */
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
    if (this.isAlertActive || this.isTransitioning || this.isCelebrationActive) return; // No rotar si hay una alerta activa o si ya está en transición

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

    // INTERCALADO ALEATORIO DE LA BURGER DEL MES (B5) CON FONDO ROJO:
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

    console.log(`➡️ Preparando transición hacia el producto: ${nextProduct.name}`);

    this.isTransitioning = true;

    // Lanzar la precarga de imagen en paralelo sin bloquear las transiciones visuales
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

      this.elements.productCard.style.transition = ''; // Limpiar transiciones en línea
      this.elements.productCard.style.transform = '';  // Limpiar transformaciones inline de Parallax
      this.elements.productCard.className = 'floating-burger-wrapper card-transition-out';
    }

    // 3. ESPERAR que termine la animación de salida (500ms)
    setTimeout(() => {
      // 4. ACTUALIZAR los datos del DOM en el estado invisible offscreen
      this.currentIndex = nextIndex;
      this.renderCurrentProduct();

      // 5. ESTABLECER estado inicial de entrada (usando variables inyectadas)
      if (this.elements.productCard) {
        this.elements.productCard.className = 'floating-burger-wrapper card-transition-in-start';
      }

      // 6. ENTRADA CINEMÁTICA: Deslizar al centro con rebote elástico (Springy Ease)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (this.elements.productCard) {
            this.elements.productCard.className = 'floating-burger-wrapper card-transition-in-end';
            
            // Esperar a que termine la animación de entrada para restablecer el estado normal y habilitar el Parallax 3D
            setTimeout(() => {
              if (this.elements.productCard) {
                this.elements.productCard.className = 'floating-burger-wrapper';
                this.elements.productCard.style.transform = ''; // Restablecer
              }
              this.isTransitioning = false;
            }, 800);
          }
        });
      });
    }, 500);
  }

  /**
   * Promesa de precarga de imágenes para navegadores Smart TV.
   */
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = (err) => reject(err);
      
      // Cancelar por tiempo límite (Timeout) si la red es extremadamente lenta
      setTimeout(() => reject(new Error('Image preload timeout')), 4000);
    });
  }

  connectToRealtime() {
    // PocketBase removido por completo
  }

  /**
   * Enrutador central de eventos recibidos por Realtime (InsForge / Supabase / Websockets)
   */
  handleRealtimeEvent(data) {
    // Estructura Supabase/Postgres estándar: { table, record, type, schema } o custom Websocket
    const { table, event, record, new_record, type } = data;
    
    const targetTable = table || data.topic?.split(':')[2];
    const eventType = event || type || data.event;
    const payload = record || new_record || data.payload;

    if (!targetTable || !payload) return;

    console.log(`🔔 Evento de Realtime recibido [${eventType}] en tabla [${targetTable}]:`, payload);

    if (targetTable === 'products') {
      this.handleProductUpdate(eventType, payload);
    } else if (targetTable === 'live_alerts') {
      this.handleLiveAlertUpdate(eventType, payload);
    } else if (targetTable === 'theme_config') {
      this.handleThemeConfigUpdate(eventType, payload);
    } else if (targetTable === 'screen_command') {
      if (payload && payload.command === 'RELOAD') {
        console.log('🔄 Comando de recarga remota recibido. Recargando vitrina...');
        window.location.reload();
      } else if (payload && payload.command === 'FLASH_RED') {
        console.log('🟥 Comando de prueba recibido. Coloreando pantalla de rojo...');
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.backgroundColor = '#C52026';
        overlay.style.zIndex = '99999';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.color = '#ffffff';
        overlay.style.fontFamily = 'sans-serif';
        overlay.style.gap = '20px';
        overlay.innerHTML = `
          <span style="font-size: 5rem;">🟥</span>
          <span style="font-size: 2.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; text-align: center; text-shadow: 0 0 20px rgba(0,0,0,0.5);">¡PRUEBA EN TIEMPO REAL EXITOSA!</span>
          <span style="font-size: 1.2rem; font-weight: bold; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.2em;">Cambio recibido en milisegundos</span>
        `;
        document.body.appendChild(overlay);
        setTimeout(() => {
          overlay.style.transition = 'opacity 0.5s ease-out';
          overlay.style.opacity = '0';
          setTimeout(() => overlay.remove(), 500);
        }, 3000);
      }
    }
  }

  /**
   * Cambia dinámicamente el tema visual y el catálogo de productos de la vitrina en caliente.
   */
  handleThemeConfigUpdate(eventType, config) {
    if (!config || !config.theme) return;
    
    console.log(`🎨 Cambiando al Tema: [${config.theme.toUpperCase()}]`);

    // 1. Quitar todas las clases de tema existentes del Body
    document.body.classList.remove(
      'gourmet-slate-bg',
      'theme-gourmet',
      'theme-retail',
      'theme-tourism',
      'theme-wellness'
    );

    // 2. Aplicar la nueva clase de tema
    document.body.classList.add(`theme-${config.theme}`);

    // 3. Opcional: Reemplazar catálogo de productos según el nicho
    let customCatalog = null;
    
    if (config.theme === 'retail') {
      customCatalog = [
        {
          id: 'retail-1',
          code: 'R1',
          name: 'Zapatilla Ultra Light',
          price: '$45.990',
          tag: '20% OFF 🏷️',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
          description: 'Zapatillas deportivas premium con amortiguación reactiva y tejido transpirable de fibra ecológica.'
        },
        {
          id: 'retail-2',
          code: 'R2',
          name: 'Reloj Smartwatch Pro',
          price: '$89.990',
          tag: 'NUEVO 🆕',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
          description: 'Monitoreo de salud completo, batería de 14 días y pantalla AMOLED táctil de alta definición.'
        },
        {
          id: 'retail-3',
          code: 'R3',
          name: 'Mochila Explorer 40L',
          price: '$34.900',
          tag: 'OUTDOOR 🎒',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
          description: 'Impermeable y ultra resistente, con compartimentos de carga inteligente y espaldar ergonómico.'
        }
      ];
    } else if (config.theme === 'tourism') {
      customCatalog = [
        {
          id: 'tourism-1',
          code: 'T1',
          name: 'Glaciar Grey',
          price: '$95.000',
          tag: 'IMPERDIBLE 🏔️',
          image: 'https://images.unsplash.com/photo-1517006859690-60a3e8bef131?auto=format&fit=crop&q=80&w=800',
          description: 'Navega entre imponentes témpanos de hielo azul y descubre la majestuosidad de la Patagonia.'
        },
        {
          id: 'tourism-2',
          code: 'T2',
          name: 'Base Torres',
          price: '$65.000',
          tag: 'AVENTURA 🥾',
          image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&q=80&w=800',
          description: 'Desafía tus límites en la caminata más famosa del Parque Nacional Torres del Paine.'
        },
        {
          id: 'tourism-3',
          code: 'T3',
          name: 'Valle Serrano',
          price: '$45.000',
          tag: 'EXCLUSIVO 🐴',
          image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
          description: 'Recorre ríos de aguas turquesas y bosques nativos guiados por baqueanos locales.'
        }
      ];
    } else if (config.theme === 'wellness') {
      customCatalog = [
        {
          id: 'wellness-1',
          code: 'W1',
          name: 'Masaje Relajación',
          price: '$35.000',
          tag: 'RECOMENDADO 💆',
          image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
          description: 'Libera tensiones acumuladas con aceites orgánicos de lavanda y musicoterapia envolvente.'
        },
        {
          id: 'wellness-2',
          code: 'W2',
          name: 'Circuito Termal',
          price: '$40.000',
          tag: 'BIENESTAR 🧖',
          image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
          description: 'Acceso a piscinas minerales, sauna húmedo de eucalipto y tina de hidromasaje privada.'
        },
        {
          id: 'wellness-3',
          code: 'W3',
          name: 'Facial Detox Oro',
          price: '$28.000',
          tag: 'PIEL JOVEN ✨',
          image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
          description: 'Tratamiento revitalizante con mascarilla de arcilla mineralizada y serum rejuvenecedor.'
        }
      ];
    } else {
      // Gourmet (Por defecto)
      customCatalog = [...mockProducts];
    }

    if (customCatalog) {
      this.products = customCatalog;
      this.currentIndex = 0;
      this.renderMenuGrid();
      this.nextProduct(0);
    }
  }

  /**
   * Sincronización en tiempo real de productos.
   * Si cambia el precio o los datos, actualiza el array local.
   * Si el producto modificado es el que está en pantalla, fuerza un cambio de inmediato.
   */
  handleProductUpdate(eventType, updatedProduct) {
    if (!updatedProduct || !updatedProduct.id) return;

    if (eventType === 'UPDATE' || eventType === 'INSERT') {
      const index = this.products.findIndex(p => p.id === updatedProduct.id);
      
      if (index !== -1) {
        // Si el producto se ha deshabilitado, removerlo del carrusel en vivo
        if (updatedProduct.is_available === false || updatedProduct.is_available === 'false') {
          console.log(`🚫 Producto deshabilitado en caliente: ${updatedProduct.name}. Removiéndolo del carrusel.`);
          this.products = this.products.filter(p => p.id !== updatedProduct.id);
          this.renderMenuGrid();
          if (this.currentIndex === index) {
            this.nextProduct(0); // Forzar cambio al primer producto disponible
          }
          return;
        }

        console.log(`🔄 Actualizando producto existente en memoria: ${updatedProduct.name}`);
        this.products[index] = { ...this.products[index], ...updatedProduct };

        if (this.currentIndex === index) {
          console.log('⚡ ¡El producto visible ha sido editado! Forzando transición inmediata.');
          this.nextProduct(this.currentIndex);
        }
      } else {
        // Si el producto re-habilitado o nuevo viene, y está disponible, lo añadimos
        if (updatedProduct.is_available !== false && updatedProduct.is_available !== 'false') {
          console.log(`➕ Añadiendo o re-habilitando producto en el carrusel local: ${updatedProduct.name}`);
          this.products.push(updatedProduct);
          this.renderMenuGrid();
        }
      }
    } else if (eventType === 'DELETE') {
      console.log(`🗑️ Eliminando producto de memoria ID: ${updatedProduct.id}`);
      this.products = this.products.filter(p => p.id !== updatedProduct.id);
      
      if (this.products.length === 0) {
        this.products = [...mockProducts];
      }
      this.nextProduct(0);
    }
  }

  /**
   * Sistema de interrupción de Alertas Relámpago en Tiempo Real.
   */
  handleLiveAlertUpdate(eventType, alertData) {
    // Filtrar por local/clientId (ignorar si el destinatario no coincide)
    if (alertData.clientId && alertData.clientId !== this.pbClientId) {
      console.log(`🔇 Alerta ignorada (pertenece al local: ${alertData.clientId}, actual: ${this.pbClientId})`);
      return;
    }
    
    // Escucha inserciones o actualizaciones de alertas con active_status: true
    if (alertData.active_status === true || alertData.active_status === 'true') {
      this.triggerFlashAlert(alertData);
    } else if (alertData.active_status === false || alertData.active_status === 'false') {
      // Si la alerta pasa a inactiva de manera remota, la ocultamos de inmediato
      this.dismissFlashAlert();
    }
  }

  /**
   * Genera un sonido de alarma usando Web Audio API (sin archivos externos)
   */
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

  /**
   * Activa el modo de Alerta Relámpago, pausando el loop y cubriendo la pantalla.
   * Soporta modo intermitente: la alerta aparece/desaparece cíclicamente.
   */
  triggerFlashAlert(alert) {
    console.log(`🚨 ¡ALERTA RELÁMPAGO DETECTADA!: "${alert.message}"`);

    // Limpiar cualquier alerta anterior (intermitente o normal)
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
      const cycleMs = showMs + hideMs;
      const startTime = Date.now();

      console.log(`🔁 Modo intermitente: ${showMs/1000}s visible / ${hideMs/1000}s oculta / ${totalMs/1000}s total`);

      const runCycle = () => {
        if (Date.now() - startTime >= totalMs) {
          console.log('🔁 Alerta intermitente finalizada (duración total alcanzada).');
          this.dismissFlashAlert();
          return;
        }

        // MOSTRAR
        if (this.elements.alertOverlay) this.elements.alertOverlay.classList.add('active');
        if (withAlarm) this.playAlarmSound();
        this.isAlertActive = true;

        // Programar OCULTAR después de showMs
        this._intermittentHideTimeout = setTimeout(() => {
          if (this.elements.alertOverlay) this.elements.alertOverlay.classList.remove('active');

          // Reanudar carrusel brevemente mientras la alerta está oculta
          this.isAlertActive = false;
          this.startProductLoop();

          // Programar siguiente ciclo
          this._intermittentShowTimeout = setTimeout(() => {
            this.stopProductLoop();
            runCycle();
          }, hideMs);
        }, showMs);
      };

      // Guardar referencia al timeout maestro de seguridad
      this._intermittentMasterTimeout = setTimeout(() => {
        this.dismissFlashAlert();
      }, totalMs + 1000);

      runCycle();
      return;
    }

    // --- MODO NORMAL (no intermitente) ---
    if (this.elements.alertOverlay) {
      this.elements.alertOverlay.classList.add('active');
    }

    let durationMs = 15000;
    if (alert.duration_minutes) {
      durationMs = parseFloat(alert.duration_minutes) * 60 * 1000;
    } else if (alert.duration_seconds) {
      durationMs = parseFloat(alert.duration_seconds) * 1000;
    }

    console.log(`⏳ La alerta estará en pantalla durante ${durationMs / 1000} segundos.`);

    this.alertTimeout = setTimeout(() => {
      this.dismissFlashAlert();
    }, durationMs);
  }

  /**
   * Oculta el overlay de alerta y reanuda el carrusel de productos donde se quedó.
   */
  dismissFlashAlert(silent = false) {
    if (!this.isAlertActive && !silent) return;
    
    if (!silent) console.log('🍃 Retirando alerta y reanudando carrusel...');

    if (this.elements.alertOverlay) {
      this.elements.alertOverlay.classList.remove('active');
    }

    this.isAlertActive = false;

    // Limpiar timers normales
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
      this.alertTimeout = null;
    }

    // Limpiar timers intermitentes
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

  /**
   * Registra múltiples canales de comunicación en tiempo real.
   * CAPA 0 (SSE Relay): Cross-browser, cross-device via servidor relay local.
   * CAPA 1 (BroadcastChannel): Mismo navegador, pestañas distintas.
   * CAPA 2 (localStorage): Fallback universal same-origin.
   */
  registerSimulationBridge() {
    window.simulateRealtimeEvent = (payload) => {
      this.handleRealtimeEvent(payload);
    };

    // --- CAPA 0: SSE RELAY SERVER (CROSS-BROWSER / CROSS-DEVICE) ---
    // Este es el canal principal. Funciona entre navegadores y dispositivos distintos.
    this.connectToRelay();
    this.connectToCloudRelay();

    // --- CAPA 1: BROADCAST CHANNEL (mismo navegador, pestañas distintas) ---
    try {
      const offlineChannel = new BroadcastChannel('ruta9_showcase');
      offlineChannel.onmessage = (event) => {
        console.log('📡 [BroadcastChannel] Evento recibido:', event.data);
        this.handleRealtimeEvent(event.data);
      };
      console.log('✅ Capa 1: BroadcastChannel registrado.');
    } catch (e) {
      console.warn('⚠️ BroadcastChannel no soportado en este navegador:', e);
    }

    // --- CAPA 2: LOCALSTORAGE EVENT BRIDGE (fallback same-origin) ---
    try {
      window.addEventListener('storage', (event) => {
        if (event.key === 'ruta9_realtime_event' && event.newValue) {
          try {
            const data = JSON.parse(event.newValue);
            console.log('📡 [localStorage] Evento recibido:', data);
            this.handleRealtimeEvent(data);
          } catch (parseErr) {
            console.warn('⚠️ Error parseando evento localStorage:', parseErr);
          }
        }
      });
      console.log('✅ Capa 2: localStorage event bridge registrado.');
    } catch (e) {
      console.warn('⚠️ localStorage event bridge falló:', e);
    }

    window.showcaseController = this;

    console.log('🛠️ Puente de simulación registrado con 3 capas de comunicación.');
    console.log('👉 Ejecuta en consola para probar actualizaciones:');
    console.log('   simulateRealtimeEvent({ table: "products", event: "UPDATE", record: { id: "prod-1", name: "La Bestia Doble Cheddar", price: "$6.990", tag: "OFERTA RELÁMPAGO ⭐" } })');
  }

  /**
   * Conecta al SSE Relay Server para recibir comandos en tiempo real
   * desde otros navegadores / dispositivos en la misma red.
   * Se reconecta automáticamente si la conexión se pierde.
   */
  connectToRelay() {
    // Detectar si estamos en un entorno local (localhost, 127.0.0.1 o IP privada LAN)
    const hostname = window.location.hostname || 'localhost';
    const isLocal = hostname === 'localhost' || 
                    hostname === '127.0.0.1' || 
                    hostname.startsWith('192.168.') || 
                    hostname.startsWith('10.') || 
                    hostname.startsWith('172.');

    if (!isLocal) {
      console.log('🌐 Entorno de Producción Cloud detectado (Vercel). Saltando conexión al Relay Local SSE.');
      return;
    }

    const relayPort = window.location.port || '8000';
    const relayUrl = `http://${hostname}:${relayPort}/api/events`;

    console.log(`🔌 Conectando al Relay Server SSE: ${relayUrl}...`);

    try {
      const eventSource = new EventSource(relayUrl);

      eventSource.onopen = () => {
        console.log('✅ CAPA 0: Conectado al Relay Server SSE (cross-browser activo).');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Ignorar mensajes de heartbeat o conexión
          if (data.type === 'connected') {
            console.log('📡 [SSE Relay] Confirmación de conexión:', data.message);
            return;
          }
          console.log('📡 [SSE Relay] Evento recibido:', data);
          this.handleRealtimeEvent(data);
        } catch (e) {
          console.warn('⚠️ [SSE Relay] Error parseando evento:', e);
        }
      };

      eventSource.onerror = (e) => {
        console.warn('⚠️ [SSE Relay] Error de conexión. Reintentando automáticamente...');
        // EventSource se reconecta automáticamente por defecto
      };

      this.relayEventSource = eventSource;
    } catch (e) {
      console.warn('⚠️ SSE Relay no disponible. Usando canales locales como fallback.', e);
    }
  }

  /**
   * Conecta al SSE Cloud Relay Broker (ntfy.sh) para sincronización global
   * en la nube 100% estática (Vercel) sin base de datos ni servidores complejos.
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
          // Ignorar mensajes no válidos o heartbeats de ntfy
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
}

// --- EFECTO DE MOVIMIENTO 3D INTERACTIVO (PARALLAX TILT) ---
// Cuando el usuario mueve el mouse por la pantalla, el producto central se inclina en 3D
document.addEventListener('mousemove', (e) => {
  if (window.showcaseController && (window.showcaseController.isAlertActive || window.showcaseController.isTransitioning)) return;
  
  const card = document.getElementById('product-card');
  if (!card) return;

  const x = e.clientX;
  const y = e.clientY;
  const w = window.innerWidth;
  const h = window.innerHeight;

  // Inclinación máxima de 12 grados
  const rotateX = -((y - h / 2) / h) * 12;
  const rotateY = ((x - w / 2) / w) * 12;

  card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

// Suave transición de regreso al centro cuando el cursor sale de la ventana
document.addEventListener('mouseleave', () => {
  const card = document.getElementById('product-card');
  if (card) {
    card.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    setTimeout(() => {
      card.style.transition = 'all 0.5s ease-in-out'; // Restaurar Tailwind transition
    }, 600);
  }
});

// Inicializar la clase controladora cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  const controller = new ShowcaseScreenController();
  controller.init();
});
