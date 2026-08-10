/**
 * Smart Showcase Screen 5 Controller (Mix Showcase) - Version 1.0.0
 * Optimized for Embedded Browsers (e.g., Amazon Fire TV Stick)
 * Displays a randomized mix of Burgers, Snacks, and Sandwiches.
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


// --- MANEJADOR DEFENSIVO DE IMÁGENES ROTAS ---
window.handleImageError = function(img) {
  if (!img) return;
  const urlParams = new URLSearchParams(window.location.search);
  const branch = urlParams.get('local') || urlParams.get('branch');
  const isZF = branch === 'zf' || window.location.pathname.includes('-zf') || (document.body && document.body.classList.contains('branch-zf'));

  if (img.dataset.hasFailed) {
    img.src = isZF ? 'frontend/images/products/Zona Franca/b1.webp' : 'frontend/images/products/b1.webp';
    return;
  }
  img.dataset.hasFailed = true;

  const src = img.src || '';
  let foundCode = null;

  const match = src.match(/([bks]\d+|classic chicken|american chicken)\b/i);
  if (match) {
    foundCode = match[1].toLowerCase();
  }

  if (foundCode) {
    img.src = isZF ? `frontend/images/products/Zona Franca/${foundCode}.webp` : `frontend/images/products/${foundCode}.webp`;
  } else {
    img.src = isZF ? 'frontend/images/products/Zona Franca/b1.webp' : 'frontend/images/products/b1.webp';
  }
};

// --- CATÁLOGOS LOCALES COMBINADOS (54 preparaciones) ---
const mockBurgers = [
  { id: 'prod-1', code: 'B1', name: 'Burger básica', price: '$6.500', tag: 'PREMIUM ⭐', image: 'frontend/images/products/b1.webp', description: 'Burger de vacuno premium preparada a la plancha con fundente queso gouda o queso cheddar.' },
  { id: 'prod-2', code: 'B2', name: 'Completa', price: '$7.500', tag: 'MÁS PEDIDA 🏆', image: 'frontend/images/products/b2.webp', description: 'Burger premium con queso gouda derretido, lechuga hidropónica fresca, tomate, cebolla morada y huevo frito.' },
  { id: 'prod-3', code: 'B3', name: 'Clásica BBQ', price: '$7.800', tag: 'AHUMADA 🔥', image: 'frontend/images/products/b3.webp', description: 'Burger premium con queso cheddar, tocino crocante, huevo frito, pepinillos dulces y salsa BBQ.' },
  { id: 'prod-6', code: 'B6', name: 'BBQ Tocino', price: '$8.200', tag: 'SÚPER COLOSAL 👑', image: 'frontend/images/products/b6.webp', description: 'Burger a las brasas con abundante queso cheddar fundido, tocino crocante, aros de cebolla y salsa BBQ.' },
  { id: 'prod-12', code: 'B12', name: 'Azul Ruibarbo', price: '$9.900', tag: 'GOURMET ⭐', image: 'frontend/images/products/b12.webp', description: 'Burger de carne madurada con queso azul de cueva, cebolla caramelizada y salsa BBQ de ruibarbo.' },
  { id: 'prod-15', code: 'B15', name: 'La Tocinetta', price: '$9.200', tag: 'FULL TOCINO 🥓', image: 'frontend/images/products/b15.webp', description: 'La burger del tocino definitivo: tocino crocante, chutney de tocino, chocobacon y mayonesa de tocino.' },
  { id: 'prod-20', code: 'B20', name: 'Los Tres Chanchitos', price: '$11.500', tag: 'EXPLOSIVA 🐷', image: 'frontend/images/products/b20.webp', description: 'El festín de la carne: burger premium con queso gouda, tocino, pulled pork, longaniza y salsa BBQ.' }
];

const mockSnacks = [
  { id: 'snack-3', code: 'K3', name: 'Bastones de muzzarella (10u.)', price: '$7.000', tag: 'PULL QUESO 🧀', image: 'frontend/images/products/k3.webp', description: '10 deliciosos bastones de queso mozzarella apanados y fritos al momento, fundentes y crujientes.' },
  { id: 'snack-5', code: 'K5', name: 'Cóndor wings + salsa (5u.)', price: '$7.000', tag: 'ALITAS 🍗', image: 'frontend/images/products/k5.webp', description: '5 jugosas alitas de pollo acompañadas de tu salsa preferida (mostaza miel, BBQ o sriracha).' },
  { id: 'snack-7', code: 'K7', name: 'Papas fritas rústicas', price: '$5.500', tag: 'CLÁSICAS 🍟', image: 'frontend/images/products/k7.webp', description: 'Papas cortadas a mano al estilo rústico, fritas al punto perfecto de crocancia.' },
  { id: 'snack-12', code: 'K12', name: 'Papas cheddar tocino pepinillo', price: '$6.500', tag: 'FULL EXTREMO 🥓', image: 'frontend/images/products/k12.webp', description: 'Papas rústicas bañadas en salsa cheddar caliente, crujiente tocino picado y pepinillos.' },
  { id: 'snack-19', code: 'K19', name: 'Papas brisket cebolla huevo', price: '$10.500', tag: 'PREMIUM 👑', image: 'frontend/images/products/k19.webp', description: 'Papas rústicas con carne brisket ahumada deshilachada, cebolla caramelizada y huevo frito.' }
];

const mockSandwiches = [
  { id: 'sand-1', code: 'S1', name: 'Baguette R9', price: '$9.200', tag: 'FRESO & CRUNCHY 🥗', image: 'frontend/images/products/s1.webp', description: 'Sándwich en baguette + lechuga + tomate.' },
  { id: 'sand-2', code: 'S2', name: 'Baguette Huevo Revuelto', price: '$6.000', tag: 'HUEVO & SABOR 🍳', image: 'frontend/images/products/s2.webp', description: 'Sándwich en baguette + huevo revuelto.' },
  { id: 'sand-3', code: 'S3', name: 'Baguette Queso y Huevo', price: '$6.500', tag: 'QUESO & HUEVO 🧀', image: 'frontend/images/products/Zona Franca/s3.webp', description: 'Sándwich en baguette + queso + huevo.' }
];

// Unificar todo el catálogo de fallback en una sola lista mezclada
let combinedFallback = [...mockBurgers, ...mockSnacks, ...mockSandwiches];

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
      alertMessage: document.getElementById('alert-message'),
      celebrationOverlay: document.getElementById('celebration-overlay')
    };

    // Intercalado inicial equilibrado: Burger -> Snack -> Burger del Mes -> Sándwich
    const bMesFallback = mockBurgers.find(b => (b.code && b.code.toUpperCase() === 'B5') || (b.name && b.name.toUpperCase().includes('DEL MES'))) || mockBurgers[0];
    const otherBurgersFallback = mockBurgers.filter(b => b !== bMesFallback);

    const initMerged = [];
    const maxLen = Math.max(otherBurgersFallback.length, mockSnacks.length, mockSandwiches.length);
    let bIdx = 0, sIdx = 0, wIdx = 0;
    for (let i = 0; i < maxLen; i++) {
      if (bIdx < otherBurgersFallback.length) initMerged.push(otherBurgersFallback[bIdx++]);
      if (sIdx < mockSnacks.length) initMerged.push(mockSnacks[sIdx++]);
      if (bMesFallback) initMerged.push(bMesFallback);
      if (wIdx < mockSandwiches.length) initMerged.push(mockSandwiches[wIdx++]);
    }
    this.products = initMerged;
    this.currentIndex = 0;
    this.loopInterval = null;
    this.countdownInterval = null;
    this.alertTimeout = null;
    this.isAlertActive = false;
    this.isCelebrationActive = false;
    this.isTransitioning = false;
    this.rotationTime = 5000; // 5 segundos exactos por producto
    this.rotationCounter = 0;

    const urlParams = new URLSearchParams(window.location.search);
    this.pbClientId = urlParams.get('local') || urlParams.get('clientId') || null; // Carga el local específico o todos si es null
    this.pbConnected = false;
    this.wakeLock = null;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request('screen');
        console.log('✅ Screen 5 — Wake Lock activado.');
      }
    } catch (err) {
      console.warn(`⚠️ Screen 5 — Wake Lock fallido: ${err.message}`);
    }
  }

  async init() {
    console.log('🚀 Inicializando Showcase Screen 5 (Mix Showcase)...');

    // Wake Lock
    this.requestWakeLock();
    document.addEventListener('visibilitychange', () => {
      if (this.wakeLock !== null && document.visibilityState === 'visible') {
        this.requestWakeLock();
      }
    });

    // Cargar PocketBase
    const tryLoadFromPocketBase = async () => {
      if (typeof window.pbLoadProducts === 'function') {
        const pbProducts = await window.pbLoadProducts(this.pbClientId);
        if (pbProducts && pbProducts.length > 0) {
          // Filtrar y mezclar todos
          this.products = this.shuffleArray([...pbProducts]);
          this.pbConnected = true;
          console.log(`🔥 Screen 5: Mix de ${this.products.length} productos cargado desde PocketBase.`);
          return true;
        }
      }
      return false;
    };

    const loaded = await tryLoadFromPocketBase();
    if (!loaded) {
      console.log('📦 Screen 5: Intentando cargar catálogo dinámico local...');
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const branch = urlParams.get('local') || urlParams.get('branch');
        const isZF = branch === 'zf' || window.location.pathname.toLowerCase().includes('zf') || (document.body && document.body.classList.contains('branch-zf'));
        const catalogFile = isZF ? 'frontend/catalog-zf.json' : 'frontend/catalog.json';
        
        const response = await fetch(catalogFile);
        const data = await response.json();
        if (data) {
          const burgersList = data.burgers || [];
          const snacksList = data.snacks || [];
          const sandwichesList = data.sandwiches || [];

          // Identificar la Burger del Mes (B5)
          const bMes = burgersList.find(b => (b.code && b.code.toUpperCase() === 'B5') || (b.name && b.name.toUpperCase().includes('DEL MES'))) || burgersList[0];
          const otherBurgers = burgersList.filter(b => b !== bMes);
          
          // Secuencia Comercial Rítmica: Burger -> Snack -> Burger del Mes -> Sándwich
          const mergedList = [];
          const maxLength = Math.max(otherBurgers.length, snacksList.length, sandwichesList.length);
          let burgerIdx = 0;
          let snackIdx = 0;
          let sandwichIdx = 0;

          for (let i = 0; i < maxLength; i++) {
            // 1. Hamburguesa regular
            if (burgerIdx < otherBurgers.length) {
              mergedList.push(otherBurgers[burgerIdx++]);
            } else if (otherBurgers.length > 0) {
              mergedList.push(otherBurgers[burgerIdx % otherBurgers.length]);
              burgerIdx++;
            }

            // 2. Snack / Acompañamiento
            if (snackIdx < snacksList.length) {
              mergedList.push(snacksList[snackIdx++]);
            } else if (snacksList.length > 0) {
              mergedList.push(snacksList[snackIdx % snacksList.length]);
              snackIdx++;
            }

            // 3. Burger del Mes (Destacado recurrente)
            if (bMes) {
              mergedList.push(bMes);
            }

            // 4. Sándwich en Baguette
            if (sandwichIdx < sandwichesList.length) {
              mergedList.push(sandwichesList[sandwichIdx++]);
            } else if (sandwichesList.length > 0) {
              mergedList.push(sandwichesList[sandwichIdx % sandwichesList.length]);
              sandwichIdx++;
            }
          }

          if (mergedList.length > 0) {
            this.products = mergedList;
            console.log(`📦 Screen 5: Mix Rítmico (Burger -> Snack -> Burger del Mes -> Sándwich) de ${this.products.length} productos creado desde ${catalogFile}`);
          }
        }
      } catch (e) {
        console.warn("⚠️ Fallback Mix: No se pudo cargar el catálogo dinámico, usando copia local en memoria.", e);
      }
    } else {
      this.connectToRealtime();
    }

    window.addEventListener('pocketbase:ready', async () => {
      if (this.pbConnected) return;
      const loadedReady = await tryLoadFromPocketBase();
      if (loadedReady) {
        this.renderCurrentProduct();
        this.updateThumbnails();
        this.connectToRealtime();
      }
    });

    this.renderCurrentProduct();
    this.updateThumbnails();
    this.startProductLoop();
    this.registerEventBridges();
    this.connectToRelay();
    this.connectToCloudRelay();
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
          img.dataset.hasFailed = false;
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
      document.body.classList.add('layout-reversed');
    }

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
    if (this.elements.productTag) this.elements.productTag.textContent = current.tag;
    if (this.elements.productDesc) this.elements.productDesc.textContent = current.description;

    // Actualizar Pop-Up Inteligente si existe en pantalla
    const popTextEl = document.getElementById('flavor-pop-text');
    const popIconEl = document.querySelector('.flavor-pop-badge .pop-icon');
    if (popTextEl && current) {
      const nameUpper = (current.name || '').toUpperCase();
      const descUpper = (current.description || '').toUpperCase();

      let popPhrase = { text: '¡100% GOURMET!', icon: '👑' };

      const isSandwich = (current.id || '').includes('sand') || (current.id || '').includes('zf-s') || (current.code || '').startsWith('S');

      if (isBurgerDelMes) {
        popPhrase = { text: '¡EDICIÓN LIMITADA!', icon: '👑🌶️' };
      } else if (isSandwich) {
        if (descUpper.includes('HUEVO') || nameUpper.includes('HUEVO')) {
          popPhrase = { text: '¡CON HUEVO REVUELTO!', icon: '🍳' };
        } else if (descUpper.includes('QUESO') || nameUpper.includes('QUESO')) {
          popPhrase = { text: '¡FULL QUESO DERRETIDO!', icon: '🧀' };
        } else if (descUpper.includes('TOCINO') || nameUpper.includes('TOCINO')) {
          popPhrase = { text: '¡BAGUETTE DE TOCINO!', icon: '🥓' };
        } else {
          popPhrase = { text: '¡BAGUETTE CROCANTE!', icon: '🥖' };
        }
      } else if (nameUpper.includes('CHICKEN') || descUpper.includes('POLLO') || descUpper.includes('MILANESA')) {
        popPhrase = { text: '¡POLLO CROCANTE!', icon: '🍗' };
      } else if (descUpper.includes('TOCINO')) {
        popPhrase = { text: '¡TOCINO CROCANTE!', icon: '🥓' };
      } else if (descUpper.includes('CHEDDAR') || descUpper.includes('GOUDA') || descUpper.includes('QUESO')) {
        popPhrase = { text: '¡FULL QUESO DERRETIDO!', icon: '🧀' };
      } else if (descUpper.includes('CEBOLLA') || nameUpper.includes('CEBOLLA')) {
        popPhrase = { text: '¡CRUJIENTES AROS!', icon: '🧅' };
      } else if (descUpper.includes('PROVENZAL') || descUpper.includes('AJO')) {
        popPhrase = { text: '¡AJO & PEREJIL!', icon: '🧄' };
      } else {
        popPhrase = { text: '¡RECETA ARTESANAL!', icon: '🍔' };
      }

      popTextEl.textContent = popPhrase.text;
      if (popIconEl) popIconEl.textContent = popPhrase.icon;
    }

    if (this.elements.productImg) {
      this.elements.productImg.src = current.image;
      this.elements.productImg.alt = current.name;
      this.elements.productImg.dataset.hasFailed = false;
    }
  }

  startProductLoop() {
    this.stopProductLoop();
    this.loopInterval = setInterval(() => {
      if (!this.isAlertActive && !this.isCelebrationActive) {
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
    
    if (this.elements.celebrationOverlay) {
      this.elements.celebrationOverlay.classList.add('active');
    }
    
    setTimeout(() => {
      if (this.elements.celebrationOverlay) {
        this.elements.celebrationOverlay.classList.remove('active');
      }
      this.isCelebrationActive = false;
      this.startProductLoop();
      this.nextProduct((this.currentIndex + 1) % this.products.length);
    }, 8000); // 8 segundos
  }

  async nextProduct(targetIndex = null) {
    if (this.isAlertActive || this.isTransitioning || this.isCelebrationActive) return;

    // Si es el Día de la Hamburguesa, intercalamos celebración
    const today = new Date();
    const isHamburgerDay = (today.getDate() === 28 && today.getMonth() === 4) || new URLSearchParams(window.location.search).get('force_celebration') === 'true';
    if (isHamburgerDay) {
      this.rotationCounter = (this.rotationCounter || 0) + 1;
      if (this.rotationCounter % 4 === 0) {
        this.triggerCelebrationOverlay();
        return;
      }
    }

    // INTERCALADO ALEATORIO DE LA BURGER DEL MES (B5) EN MENÚ COMPLETO CON FONDO ROJO:
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
        case 4: // Diagonal suave
          outX = '-300px'; outY = '-300px'; outRotate = '-10deg'; outScale = '0.8';
          inX = '300px'; inY = '300px'; inRotate = '10deg'; inScale = '0.8';
          break;
        case 5: // Zoom out suave
          outScale = '0.6'; outRotate = '-15deg';
          inScale = '0.6'; inRotate = '15deg';
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
    window.addEventListener('storage', (event) => {
      if (event.key === 'ruta9_realtime_event' && event.newValue) {
        try {
          this.handleRealtimeEvent(JSON.parse(event.newValue));
        } catch (e) {}
      }
    });

    setInterval(() => {
      const raw = localStorage.getItem('ruta9_realtime_event');
      if (!raw) return;
      try {
        const data = JSON.parse(raw);
        if (data._ts && data._ts > this.lastProcessedTimestamp) {
          this.lastProcessedTimestamp = data._ts;
          this.handleRealtimeEvent(data);
        }
      } catch (e) {}
    }, 500);

    window.showcaseController = this;
  }

  connectToRelay() {
    const hostname = window.location.hostname || 'localhost';
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.');
    if (!isLocal) return;

    try {
      const eventSource = new EventSource(`http://${hostname}:${window.location.port || '8000'}/api/events`);
      eventSource.onmessage = (event) => {
        try {
          this.handleRealtimeEvent(JSON.parse(event.data));
        } catch (e) {}
      };
    } catch (e) {}
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
        console.log(`📡 [Realtime Mix] Cambio recibido:`, product.name);
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          if (action === 'delete' || product.is_available === false) {
            this.products.splice(index, 1);
          } else {
            this.products[index] = product;
          }
          this.renderCurrentProduct();
          this.updateThumbnails();
        } else if (action === 'create' && product.is_available !== false) {
          this.products.push(product);
          this.updateThumbnails();
        }
      });
    }

    if (typeof window.pbSubscribeAlerts === 'function') {
      window.pbSubscribeAlerts(this.pbClientId, (action, alertData) => {
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
      const index = this.products.findIndex(p => p.id === record.id || p.code === record.code);
      if (index !== -1) {
        if (record.is_available === false || record.is_available === 'false') {
          this.products.splice(index, 1);
        } else {
          this.products[index].price = record.price || this.products[index].price;
          this.products[index].tag = record.tag || this.products[index].tag;
          this.products[index].name = record.name || this.products[index].name;
        }
        this.renderCurrentProduct();
        this.updateThumbnails();
      } else if (record.is_available !== false && record.is_available !== 'false') {
        this.products.push(record);
        this.updateThumbnails();
      }
    }
  }

  handleLiveAlertUpdate(eventType, alertData) {
    // Filtrar por local/clientId (ignorar si el destinatario no coincide)
    if (alertData.clientId && alertData.clientId !== this.pbClientId) {
      console.log(`🔇 Alerta ignorada (pertenece al local: ${alertData.clientId}, actual: ${this.pbClientId})`);
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

// --- EFECTO DE MOVIMIENTO 3D INTERACTIVO ---
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
