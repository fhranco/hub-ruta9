/**
 * Smart Showcase Screen 2 Controller (Sides & Drinks) - Version 1.0.0
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
    img.src = 'frontend/images/products/s1.webp';
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
    img.src = `frontend/images/products/${foundCode}.webp`;
  } else {
    img.src = (src.includes('side') || src.includes('/s')) 
      ? 'frontend/images/products/s1.webp' 
      : 'frontend/images/products/b1.webp';
  }
};

// --- CONFIGURACIÓN DE PRODUCTOS DE LA CARTA (ACOMPAÑAMIENTOS Y BEBIDAS) ---
const mockSides = [
  {
    id: 'snack-1',
    code: 'K1',
    name: 'Aros de cebolla apanados (15u.)',
    price: '$5.500',
    tag: 'CRUJIENTES 🧅',
    image: 'frontend/images/products/k1.webp',
    description: 'Porción de 15 crujientes aros de cebolla apanados y dorados a la perfección.'
  },
  {
    id: 'snack-2',
    code: 'K2',
    name: 'Aros de cebolla con salsa (15u.)',
    price: '$6.000',
    tag: 'SALSAS EXTRAS 🍯',
    image: 'frontend/images/products/k2.webp',
    description: '15 aros de cebolla apanados acompañados de salsa a elección (BBQ, Cheddar o Mostaza Miel).'
  },
  {
    id: 'snack-3',
    code: 'K3',
    name: 'Bastones de muzzarella (10u.)',
    price: '$7.000',
    tag: 'PULL QUESO 🧀',
    image: 'frontend/images/products/k3.webp',
    description: '10 deliciosos bastones de queso mozzarella apanados y fritos al momento, fundentes y deliciosos.'
  },
  {
    id: 'snack-4',
    code: 'K4',
    name: 'Bastones de muzzarella BBQ (10u.)',
    price: '$7.500',
    tag: 'OFERTA 🔥',
    image: 'frontend/images/products/k4.webp',
    description: '10 bastones de queso mozzarella apanados acompañados de nuestra exquisita salsa BBQ artesanal.'
  },
  {
    id: 'snack-5',
    code: 'K5',
    name: 'Cóndor wings + salsa (5u.)',
    price: '$7.000',
    tag: 'ALITAS 🍗',
    image: 'frontend/images/products/k5.webp',
    description: '5 jugosas alitas de pollo acompañadas de tu salsa preferida (mostaza miel, BBQ, club o sriracha).'
  },
  {
    id: 'snack-6',
    code: 'K6',
    name: 'Cóndor wings + salsa (10u.)',
    price: '$9.200',
    tag: 'COMPARTIR 🍗',
    image: 'frontend/images/products/k6.webp',
    description: 'Porción gigante de 10 alitas de pollo acompañadas de tu selección de salsa favorita.'
  },
  {
    id: 'snack-7',
    code: 'K7',
    name: 'Papas fritas rústicas',
    price: '$5.500',
    tag: 'CLÁSICAS 🍟',
    image: 'frontend/images/products/k7.webp',
    description: 'Papas cortadas a mano al estilo rústico, fritas al punto perfecto de crocancia.'
  },
  {
    id: 'snack-8',
    code: 'K8',
    name: 'Mix papas + aros de cebolla',
    price: '$5.500',
    tag: 'PURA FIESTA 🎉',
    image: 'frontend/images/products/k8.webp',
    description: 'Excelente mix crujiente que combina nuestras papas rústicas y aros de cebolla apanados.'
  },
  {
    id: 'snack-9',
    code: 'K9',
    name: 'Mix muzzarella + aros + papas',
    price: '$7.200',
    tag: 'TRIPLE MIX 🙌',
    image: 'frontend/images/products/k9.webp',
    description: 'El mix definitivo: bastones de mozzarella fundente, aros de cebolla crujientes y papas rústicas.'
  },
  {
    id: 'snack-10',
    code: 'K10',
    name: 'Papas provenzal ajo perejil',
    price: '$6.000',
    tag: 'AROMÁTICAS 🧄',
    image: 'frontend/images/products/k10.webp',
    description: 'Papas fritas rústicas sazonadas al momento con ajo fresco finamente picado y perejil.'
  },
  {
    id: 'snack-11',
    code: 'K11',
    name: 'Papas con dos huevos fritos',
    price: '$6.000',
    tag: 'KICKER 🍳',
    image: 'frontend/images/products/k11.webp',
    description: 'Porción de papas fritas rústicas coronadas con dos huevos fritos o revueltos al momento.'
  },
  {
    id: 'snack-12',
    code: 'K12',
    name: 'Papas cheddar tocino pepinillo',
    price: '$6.500',
    tag: 'FULL EXTREMO 🥓',
    image: 'frontend/images/products/k12.webp',
    description: 'Papas rústicas bañadas en salsa cheddar caliente, crujiente tocino picado y pepinillos agridulces.'
  },
  {
    id: 'snack-13',
    code: 'K13',
    name: 'Papas queso crema y tocino',
    price: '$6.500',
    tag: 'CREMOSAS 🥓',
    image: 'frontend/images/products/k13.webp',
    description: 'Deliciosa combinación de papas fritas rústicas con queso crema suave y trozos crujientes de tocino.'
  },
  {
    id: 'snack-14',
    code: 'K14',
    name: 'Papas mix de ajíes sriracha',
    price: '$6.200',
    tag: 'PICANTES 🌶️',
    image: 'frontend/images/products/k14.webp',
    description: 'Papas rústicas para los amantes del picante, con mix de ajíes frescos y aderezo de salsa sriracha.'
  },
  {
    id: 'snack-15',
    code: 'K15',
    name: 'Papas longaniza y dos huevos',
    price: '$7.500',
    tag: 'SABROSAS 🌭',
    image: 'frontend/images/products/k15.webp',
    description: 'Papas rústicas acompañadas de sabrosa longaniza ahumada de cerdo troceada y dos huevos fritos.'
  },
  {
    id: 'snack-16',
    code: 'K16',
    name: 'Papas camarón limón palta',
    price: '$8.800',
    tag: 'MAR Y TIERRA 🥑',
    image: 'frontend/images/products/k16.webp',
    description: 'Novedosa combinación de papas fritas coronadas con camarones salteados al limón y palta fresca picada.'
  },
  {
    id: 'snack-17',
    code: 'K17',
    name: 'Papas camarón a la parmesana',
    price: '$9.500',
    tag: 'GOURMET 🧀',
    image: 'frontend/images/products/k17.webp',
    description: 'Porción de papas rústicas gratinadas con abundantes camarones salteados y queso parmesano fundido.'
  },
  {
    id: 'snack-18',
    code: 'K18',
    name: 'Papas camarón a la vasca',
    price: '$9.500',
    tag: 'RECOMENDADO 🍤',
    image: 'frontend/images/products/k18.webp',
    description: 'Deliciosas papas fritas gratinadas y coronadas con camarones preparados al ajillo al estilo tradicional vasco.'
  },
  {
    id: 'snack-19',
    code: 'K19',
    name: 'Papas brisket cebolla huevo',
    price: '$10.500',
    tag: 'PREMIUM 👑',
    image: 'frontend/images/products/k19.webp',
    description: 'Nuestra porción de lujo: papas rústicas con carne brisket ahumada deshilachada, cebolla caramelizada y huevo frito.'
  },
  {
    id: 'snack-20',
    code: 'K20',
    name: 'Papas Hattori Hanzō',
    price: '$9.500',
    tag: 'SIGNATURE 🗡️',
    image: 'frontend/images/products/k20.webp',
    description: 'Exclusivas papas con camarones envueltos en tocino crocante, queso crema y nuestra salsa secreta ginzoo.'
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

    this.products = [...mockSides];
    this.currentIndex = 0;
    this.loopInterval = null;
    this.countdownInterval = null;
    this.alertTimeout = null;
    this.isAlertActive = false;
    this.isTransitioning = false;
    this.rotationTime = 5000; // 5 segundos exactos por producto
    
    // Configuración PocketBase Realtime
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
        console.log('✅ Screen 2 — Wake Lock activado. El televisor no se dormirá.');
      }
    } catch (err) {
      console.warn(`⚠️ Screen 2 — Wake Lock fallido: ${err.message}`);
    }
  }

  async init() {
    console.log('🚀 Inicializando Showcase Screen 2 (Sides & Drinks)...');

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
      if (data && data.snacks) {
        this.products = data.snacks;
        // Inyectar la Burger del Mes (B5) de Zona Franca como producto estrella destacado
        if (data.burgers) {
          const burgerMes = data.burgers.find(b => b.id === 'zf-b5' || b.code === 'B5' || (b.name || '').toUpperCase().includes('DEL MES'));
          if (burgerMes && !this.products.some(p => p.code === 'B5')) {
            this.products.push(burgerMes);
          }
        }
        console.log(`📦 Catálogo de Snacks + Burger del Mes cargado desde ${catalogFile}`);
      }
    } catch (e) {
      console.warn("⚠️ Fallback: No se pudo cargar el catálogo dinámico, usando copia local en memoria.", e);
    }
    
    // --- INTENTAR CARGAR DESDE POCKETBASE ---
    const tryLoadFromPocketBase = async () => {
      if (typeof window.pbLoadProducts === 'function') {
        const pbProducts = await window.pbLoadProducts(this.pbClientId);
        if (pbProducts && pbProducts.length > 0) {
          // Filtrar o seleccionar solo productos de tipo Acompañamientos / Bebidas si fuese necesario, 
          // pero como cargamos el catálogo correspondiente, los usamos directamente.
          this.products = pbProducts;
          this.pbConnected = true;
          console.log(`🔥 Vitrina 2 cargada desde PocketBase (${pbProducts.length} productos)`);
          return true;
        }
      }
      return false;
    };

    const loaded = await tryLoadFromPocketBase();
    if (!loaded) {
      console.log('📦 Usando catálogo local de ejemplo (PocketBase no disponible aún).');
    } else {
      // Conectar a PocketBase Realtime si ya está listo
      this.connectToRealtime();
    }

    // Escuchar el evento pocketbase:ready para cuando el script tipo module termine de cargar
    window.addEventListener('pocketbase:ready', async () => {
      if (this.pbConnected) return; // Ya está cargado y suscrito
      console.log('⚡ Screen 2: Evento pocketbase:ready recibido. Sincronizando catálogo en tiempo real...');
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
    
    this.registerSimulationBridge();

    // --- ESCUCHADORES DE AUTO-RECARGA DE SEGURIDAD (STABILITY CONTROLS) ---
    // 1. Recargar si se reconecta a internet (recuperación de cortes de Wi-Fi)
    window.addEventListener('online', () => {
      console.log('🌐 Screen 2: Conexión restablecida. Recargando pantalla para actualizar datos...');
      setTimeout(() => window.location.reload(), 1500);
    });

    // 2. Refresco silencioso cada 60 segundos (1 minuto) para actualizar precios y ofertas desde PocketBase
    // Esto garantiza que los acompañamientos "se desplieguen al minuto" de forma totalmente fluida y sin parpadeo blanco.
    setInterval(async () => {
      console.log('⏰ Screen 2 - Sincronización del minuto: Refrescando catálogo silenciosamente...');
      if (typeof window.pbLoadProducts === 'function') {
        const pbProducts = await window.pbLoadProducts(this.pbClientId);
        if (pbProducts && pbProducts.length > 0) {
          this.products = pbProducts;
          this.renderMenuGrid();
          console.log('🔄 Screen 2: Catálogo sincronizado y actualizado con éxito (Sin parpadeo).');
        }
      }
    }, 60000);

    // 3. Opcional: Si prefieres un refresco FÍSICO completo del navegador cada 1 minuto (para borrar caché dura de CSS/JS en Smart TVs):
    // setInterval(() => { window.location.reload(); }, 60000);

    // 4. Auto-recarga silenciosa de seguridad cada 2 horas para vaciar caché y liberar RAM en Smart TVs
    setInterval(() => {
      console.log('⏰ Screen 2: Ejecutando auto-recarga periódica de estabilidad en vitrina...');
      window.location.reload();
    }, 2 * 60 * 60 * 1000); 
  }

  renderCurrentProduct() {
    const product = this.products[this.currentIndex];
    if (!product) return;

    // Alternar el diseño izquierda/derecha de forma dinámica en cada rotación en la TV
    if (this.currentIndex % 2 === 0) {
      document.body.classList.remove('layout-reversed');
    } else {
      document.body.classList.add('layout-reversed');
    }

    // Detectar Burger del Mes (B5 o "DEL MES") para activar el fondo muy rojo de alto impacto
    const isBurgerDelMes = product.name.toUpperCase().includes('DEL MES') || (product.code && product.code.toUpperCase() === 'B5');
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

    if (this.elements.productImg) this.elements.productImg.src = product.image;
    if (this.elements.productCode) {
      this.elements.productCode.textContent = product.code;
    }
    // Actualizar dinámicamente el Pop-Up de sabor inteligente según los ingredientes reales del snack
    const popTextEl = document.getElementById('flavor-pop-text');
    const popIconEl = document.querySelector('.flavor-pop-badge .pop-icon');
    if (popTextEl && product) {
      const nameUpper = (product.name || '').toUpperCase();
      const descUpper = (product.description || '').toUpperCase();

      let popPhrase = { text: '¡100% RÚSTICAS!', icon: '🍟' };

      if (nameUpper.includes('AROS') || descUpper.includes('CEBOLLA APANADOS')) {
        popPhrase = { text: '¡CRUJIENTES AROS!', icon: '🧅' };
      } else if (descUpper.includes('PROVENZAL') || descUpper.includes('AJO')) {
        popPhrase = { text: '¡AJO & PEREJIL!', icon: '🧄' };
      } else if (descUpper.includes('QUESO CREMA')) {
        popPhrase = { text: '¡QUESO CREMA & TOCINO!', icon: '🥓' };
      } else if (descUpper.includes('CHEDDAR')) {
        popPhrase = { text: '¡SALSA CHEDDAR!', icon: '🧀' };
      } else if (nameUpper.includes('MIX') || descUpper.includes('MIX')) {
        popPhrase = { text: '¡PURA FIESTA MIX!', icon: '🎉' };
      } else {
        popPhrase = { text: '¡PAPAS RÚSTICAS!', icon: '🍟' };
      }

      popTextEl.textContent = popPhrase.text;
      if (popIconEl) popIconEl.textContent = popPhrase.icon;
    }
    
    if (this.elements.productTag) {
      this.elements.productTag.textContent = product.tag;
      this.styleProductTag(product.tag);
    }
    
    if (this.elements.productDesc) this.elements.productDesc.textContent = product.description || '';

    // Actualizar Rueda de miniaturas inferior para Acompañamientos
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
        thumbEl.setAttribute('onclick', `selectProduct(${t.idx})`);
        const img = thumbEl.querySelector('img');
        if (img && this.products[t.idx]) {
          img.src = this.products[t.idx].image;
          img.alt = this.products[t.idx].name;
        }
      }
    });

    // Countdown para ofertas flash de acompañamientos
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
          clearInterval(this.countdownInterval);
          this.countdownInterval = null;
          return;
        }
        const hours = String(Math.floor((delta / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        const minutes = String(Math.floor((delta / (1000 * 60)) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((delta / 1000) % 60)).padStart(2, '0');

        if (productCountdown) productCountdown.textContent = `${hours}:${minutes}:${seconds}`;
      };
      updateCountdown();
      this.countdownInterval = setInterval(updateCountdown, 1000);
    } else {
      if (countdownContainer) countdownContainer.classList.add('hidden');
    }
  }

  renderMenuGrid() {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    grid.innerHTML = '';

    this.products.forEach((product, index) => {
      const card = document.createElement('div');
      card.className = 'bg-neutral-900/40 border border-white/5 hover:border-amber-500/50 p-6 rounded-2xl flex flex-col justify-between space-y-4 transition-all duration-300 transform hover:-translate-y-2 group shadow-xl';
      
      card.innerHTML = `
        <div class="relative h-32 flex items-center justify-center overflow-hidden">
          <img src="${product.image}" alt="${product.name}" class="h-28 object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)] group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div class="space-y-1">
          <span class="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950">${product.tag}</span>
          <h3 class="font-extrabold text-white text-base mt-2">${product.code} • ${product.name}</h3>
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

  styleProductTag(tagText) {
    if (!this.elements.productTag) return;
    const tag = this.elements.productTag;
    
    // Usamos el sistema de diseño central de style.css
    tag.className = 'product-tag-sticker glass-badge';
    
    const text = tagText.toUpperCase();
    if (text.includes('ESTRELLA') || text.includes('OFERTA') || text.includes('PREMIUM') || text.includes('MÁS PEDIDA')) {
      tag.classList.add('glass-badge-gold');
    } else if (text.includes('AHUMADA') || text.includes('🔥') || text.includes('TOCINO') || text.includes('CARNÍVORA') || text.includes('CRUJIENTES')) {
      tag.classList.add('glass-badge-red');
    } else if (text.includes('PICANTE') || text.includes('🌶️')) {
      tag.classList.add('glass-badge-red');
    } else if (text.includes('VEGGIE') || text.includes('VEGANA') || text.includes('🌿')) {
      tag.classList.add('glass-badge-green');
    }
  }

  startProductLoop() {
    this.stopProductLoop();
    this.loopInterval = setInterval(() => {
      this.nextProduct();
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

    // INTERCALADO ALEATORIO DE LA BURGER DEL MES (B5) EN SNACKS CON FONDO ROJO:
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

      this.elements.productCard.style.transition = '';
      this.elements.productCard.style.transform = '';  // Limpiar transformaciones inline de Parallax
      this.elements.productCard.className = 'floating-burger-wrapper card-transition-out';
    }

    // 3. ESPERAR que termine la animación de salida (550ms)
    setTimeout(() => {
      this.currentIndex = nextIndex;
      this.renderCurrentProduct();

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

  handleRealtimeEvent(data) {
    const { table, event, record, new_record, type } = data;
    const targetTable = table || data.topic?.split(':')[2];
    const eventType = event || type || data.event;
    const payload = record || new_record || data.payload;

    if (!targetTable || !payload) return;

    console.log(`🔔 Screen 2 recibió evento [${eventType}] en [${targetTable}]:`, payload);

    if (targetTable === 'products') {
      this.handleProductUpdate(eventType, payload);
    } else if (targetTable === 'live_alerts') {
      this.handleLiveAlertUpdate(eventType, payload);
    } else if (targetTable === 'theme_config') {
      this.handleThemeConfigUpdate(eventType, payload);
    } else if (targetTable === 'screen_command') {
      if (payload && payload.command === 'RELOAD') {
        console.log('🔄 Screen 2: Comando de recarga remota recibido. Recargando...');
        window.location.reload();
      } else if (payload && payload.command === 'FLASH_RED') {
        console.log('🟥 Screen 2: Comando de prueba recibido. Coloreando pantalla de rojo...');
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
          <span style="font-size: 1.2rem; font-weight: bold; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.2em;">Cambio recibido en milisegundos (Pantalla 2)</span>
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
    }
  }

  /**
   * Cambia dinámicamente el tema visual y el catálogo de productos de la vitrina 2 en caliente.
   */
  handleThemeConfigUpdate(eventType, config) {
    if (!config || !config.theme) return;
    
    console.log(`🎨 Screen 2: Cambiando al Tema: [${config.theme.toUpperCase()}]`);

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

    // 3. Reemplazar catálogo de acompañamientos según el nicho
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
        }
      ];
    } else {
      // Gourmet (Por defecto)
      customCatalog = [...mockSides];
    }

    if (customCatalog) {
      this.products = customCatalog;
      this.currentIndex = 0;
      this.renderMenuGrid();
      this.nextProduct(0);
    }
  }

  handleLiveAlertUpdate(eventType, alertData) {
    // Filtrar por local/clientId (ignorar si el destinatario no coincide)
    if (alertData.clientId && alertData.clientId !== this.pbClientId) {
      console.log(`🔇 Alerta ignorada (pertenece al local: ${alertData.clientId}, actual: ${this.pbClientId})`);
      return;
    }
    
    if (alertData.active_status === true || alertData.active_status === 'true') {
      this.triggerFlashAlert(alertData);
    } else if (alertData.active_status === false || alertData.active_status === 'false') {
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

    let durationMs = 15000;
    if (alert.duration_seconds) {
      durationMs = parseFloat(alert.duration_seconds) * 1000;
    }

    this.alertTimeout = setTimeout(() => {
      this.dismissFlashAlert();
    }, durationMs);
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

  connectToRealtime() {
    if (typeof window.pbSubscribeProducts !== 'function') {
      console.warn('⚠️ PocketBase SDK no disponible en Screen 2. Operando en modo offline (BroadcastChannel).');
      return;
    }

    console.log('🔌 Screen 2: Conectando con PocketBase Realtime (Hetzner VPS)...');

    // --- SUSCRIPCIÓN A PRODUCTOS ---
    window.pbSubscribeProducts(this.pbClientId, (action, product) => {
      console.log(`📦 Screen 2: Cambio en PocketBase [products] → ${action}:`, product.name);
      const eventType = action === 'delete' ? 'DELETE' : action === 'create' ? 'INSERT' : 'UPDATE';
      this.handleProductUpdate(eventType, product);
    });

    // --- SUSCRIPCIÓN A ALERTAS ---
    window.pbSubscribeAlerts(this.pbClientId, (action, alert) => {
      console.log(`🚨 Screen 2: Alerta en PocketBase [live_alerts] → ${action}:`, alert.message);
      this.handleLiveAlertUpdate(action, {
        message: alert.message,
        active_status: alert.active,
        duration_seconds: alert.duration_seconds || 30
      });
    });

    // --- SUSCRIPCIÓN A COMANDOS DE PANTALLA ---
    if (typeof window.pbSubscribeCommands === 'function') {
      window.pbSubscribeCommands((action, record) => {
        console.log(`📺 Screen 2: Comando en PocketBase [screen_command] → ${action}:`, record.command);
        const eventType = action === 'delete' ? 'DELETE' : action === 'create' ? 'INSERT' : 'UPDATE';
        this.handleRealtimeEvent({
          table: 'screen_command',
          event: eventType,
          payload: record
        });
      });
    }

    console.log('✅ Screen 2: PocketBase Realtime activo.');
  }

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
        console.log('📡 [BroadcastChannel] Screen 2 evento recibido:', event.data);
        this.handleRealtimeEvent(event.data);
      };
      console.log('✅ Screen 2 — Capa 1: BroadcastChannel registrado.');
    } catch (e) {
      console.warn('⚠️ BroadcastChannel no soportado:', e);
    }

    // --- CAPA 2: LOCALSTORAGE EVENT BRIDGE ---
    try {
      window.addEventListener('storage', (event) => {
        if (event.key === 'ruta9_realtime_event' && event.newValue) {
          try {
            const data = JSON.parse(event.newValue);
            console.log('📡 [localStorage] Screen 2 evento recibido:', data);
            this.handleRealtimeEvent(data);
          } catch (parseErr) {
            console.warn('⚠️ Error parseando evento localStorage:', parseErr);
          }
        }
      });
      console.log('✅ Screen 2 — Capa 2: localStorage event bridge registrado.');
    } catch (e) {
      console.warn('⚠️ localStorage event bridge falló:', e);
    }

    // --- CAPA 3: POLLING DE LOCALSTORAGE (fallback para Smart TVs) ---
    try {
      let lastProcessedTimestamp = 0;
      setInterval(() => {
        const raw = localStorage.getItem('ruta9_realtime_event');
        if (!raw) return;
        try {
          const data = JSON.parse(raw);
          if (data._ts && data._ts > lastProcessedTimestamp) {
            lastProcessedTimestamp = data._ts;
            console.log('📡 [localStorage-polling] Screen 2 evento detectado:', data);
            this.handleRealtimeEvent(data);
          }
        } catch (e) {}
      }, 500);
      console.log('✅ Screen 2 — Capa 3: localStorage polling (500ms) registrado.');
    } catch (e) {
      console.warn('⚠️ localStorage polling falló:', e);
    }

    window.showcaseController = this;
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
      console.log('🌐 Screen 2 — Entorno de Producción Cloud detectado (Vercel). Saltando conexión al Relay Local SSE.');
      return;
    }

    const relayPort = window.location.port || '8000';
    const relayUrl = `http://${hostname}:${relayPort}/api/events`;

    console.log(`🔌 Screen 2: Conectando al Relay Server SSE: ${relayUrl}...`);

    try {
      const eventSource = new EventSource(relayUrl);

      eventSource.onopen = () => {
        console.log('✅ Screen 2 — CAPA 0: Conectado al Relay Server SSE (cross-browser activo).');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Ignorar mensajes de heartbeat o conexión
          if (data.type === 'connected') {
            console.log('📡 [SSE Relay] Screen 2 confirmación de conexión:', data.message);
            return;
          }
          console.log('📡 [SSE Relay] Screen 2 evento recibido:', data);
          this.handleRealtimeEvent(data);
        } catch (e) {
          console.warn('⚠️ [SSE Relay] Screen 2 error parseando evento:', e);
        }
      };

      eventSource.onerror = (e) => {
        console.warn('⚠️ [SSE Relay] Screen 2 error de conexión. Reintentando automáticamente...');
        // EventSource se reconecta automáticamente por defecto
      };

      this.relayEventSource = eventSource;
    } catch (e) {
      console.warn('⚠️ Screen 2 — SSE Relay no disponible. Usando canales locales como fallback.', e);
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
