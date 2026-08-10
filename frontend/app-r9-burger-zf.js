/**
 * Vitrina Digital — Hamburguesas ZONA FRANCA
 * Controlador 100% exclusivo para la sucursal Zona Franca.
 * Lee ÚNICAMENTE frontend/catalog-zf.json → sección "burgers".
 * No tiene fallback a ningún otro local.
 */

// --- AUTO-DETECCIÓN DE SMART TVS ---
(function () {
  const ua = navigator.userAgent.toLowerCase();
  const urlParams = new URLSearchParams(window.location.search);
  const forceLite = urlParams.get('lite') === 'true' || urlParams.get('force_lite') === 'true';
  const isTV = forceLite ||
    ua.includes('smarttv') || ua.includes('tizen') || ua.includes('webos') ||
    ua.includes('lg browser') || ua.includes('silk') || ua.includes('googletv') ||
    ua.includes('appletv') || ua.includes('hbbtv') || ua.includes('opera tv') || ua.includes('dtv');

  if (isTV) {
    document.documentElement.classList.add('lite-mode');
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('lite-mode');
      const welcome = document.getElementById('fullscreen-welcome');
      if (welcome) welcome.remove();
    });
    const forceFS = () => {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    };
    document.addEventListener('click', forceFS, { once: true });
    document.addEventListener('keydown', forceFS, { once: true });
    console.log('📺 [ZF Burger] Modo Lite activado.');
  }
})();

// --- MANEJADOR DE IMÁGENES ROTAS (ZF) ---
window.handleImageError = function (img) {
  if (!img) return;
  if (img.dataset.hasFailed) {
    img.src = 'frontend/images/products/Zona Franca/b1.webp';
    return;
  }
  img.dataset.hasFailed = true;
  const src = img.src || '';
  const match = src.match(/([bk]\d+|mes|classic chicken|american chicken)/i);
  if (match) {
    img.src = `frontend/images/products/Zona Franca/${match[1].toLowerCase()}.webp`;
  } else {
    img.src = 'frontend/images/products/Zona Franca/b1.webp';
  }
};

// --- CATÁLOGO LOCAL DE EMERGENCIA (si catalog-zf.json no carga) ---
const ZF_BURGER_FALLBACK = [
  { id:'zf-b1',  code:'B1',  name:'Burger Básica',                    price:'$8.200',  tag:'RECETA CLÁSICA 🍅',   image:'frontend/images/products/Zona Franca/b1.webp',             description:'Burger + queso Gouda o Cheddar. Incluye papas fritas rústicas.' },
  { id:'zf-b2',  code:'B2',  name:'Burger Completa',                  price:'$9.600',  tag:'¡PÍDELA AHORA! 🍳',   image:'frontend/images/products/Zona Franca/b2.webp',             description:'Burger + queso Gouda + lechuga + tomate + cebolla morada + huevo frito. Incluye papas fritas rústicas.' },
  { id:'zf-b3',  code:'B3',  name:'Clásica BBQ',                      price:'$10.900', tag:'TOCINO EXTRA 🥓',      image:'frontend/images/products/Zona Franca/b3.webp',             description:'Burger + queso Cheddar + tocino + huevo frito + pepinillos + salsa BBQ. Incluye papas fritas rústicas.' },
  { id:'zf-b5',  code:'B5',  name:'Burger del Mes',                   price:'$10.500', tag:'BURGER DEL MES 👑🌶️', image:'frontend/images/products/Zona Franca/mes.webp',            description:'Burger + queso + palta + tomates + mix de ajíes + tortillas de maíz. Incluye papas fritas rústicas.' },
  { id:'zf-b6',  code:'B6',  name:'BBQ Tocino',                       price:'$10.500', tag:'TOCINO EXTRA 🥓',      image:'frontend/images/products/Zona Franca/b6.webp',             description:'Burger + queso Cheddar + tocino + aros de cebolla apanados + salsa BBQ. Incluye papas fritas rústicas.' },
  { id:'zf-b7',  code:'B7',  name:'La 420',                           price:'$9.500',  tag:'VEGGIE STYLE 🌿',     image:'frontend/images/products/Zona Franca/b7.webp',             description:'Burger veggie de garbanzos + lechuga + cebollín grillado + palta trozada + pepinillos. Incluye papas fritas rústicas.' },
  { id:'zf-b8',  code:'B8',  name:'Burger BLT',                       price:'$10.500', tag:'RECETA CLÁSICA 🍅',   image:'frontend/images/products/Zona Franca/b8.webp',             description:'Burger + tocino + lechuga + tomate. Incluye papas fritas rústicas.' },
  { id:'zf-b9',  code:'B9',  name:'Doble Cuarto de Libra V. R9',      price:'$13.600', tag:'SÚPER COLOSAL 👑',    image:'frontend/images/products/Zona Franca/b9.webp',             description:'2 burgers + medallón de queso crocante. Incluye papas fritas rústicas.' },
  { id:'zf-b14', code:'B14', name:'Gouda Frito',                      price:'$10.600', tag:'¡DISFRÚTALA! 🥚',     image:'frontend/images/products/Zona Franca/b14.webp',            description:'Burger + queso Gouda + cebolla caramelizada + tocino + huevo frito. Incluye papas fritas rústicas.' },
  { id:'zf-b17', code:'B17', name:'La Gran "S"',                      price:'$11.800', tag:'¡PÍDELA AHORA! ⭐',   image:'frontend/images/products/Zona Franca/b17.webp',            description:'Burger + queso Cheddar + tocino + palta trozada + huevo frito. Incluye papas fritas rústicas.' },
  { id:'zf-b18', code:'B18', name:'La Francesa',                      price:'$11.800', tag:'LA FRANCESA 🥖',      image:'frontend/images/products/Zona Franca/b18.webp',            description:'Burger + queso Gouda + queso azul + cebolla caramelizada + champiñones. Incluye papas fritas rústicas.' },
  { id:'zf-b19', code:'B19', name:'La "36"',                          price:'$11.800', tag:'¡DISFRÚTALA! 🍔',     image:'frontend/images/products/Zona Franca/b19.webp',            description:'Burger + queso Cheddar + tocino + aros de cebolla + pepinillos + salsa BBQ + huevo. Incluye papas fritas rústicas.' },
  { id:'zf-b22', code:'B22', name:'Club Veggie',                      price:'$10.500', tag:'CLUB VEGGIE 🌿',      image:'frontend/images/products/Zona Franca/b22.webp',            description:'Burger + queso Cheddar + lechuga + tomate + pepinillos + salsa club. Incluye papas fritas rústicas.' },
  { id:'zf-cc',  code:'CC',  name:'Classic Chicken',                  price:'$7.900',  tag:'¡DISFRÚTALA! 🍗',     image:'frontend/images/products/Zona Franca/classic chicken.webp', description:'Milanesa de pollo + tomate + lechuga + súper mayonesa + papas fritas.' },
  { id:'zf-ac',  code:'AC',  name:'American Chicken',                 price:'$7.900',  tag:'¡PÍDELA AHORA! 🛎️',  image:'frontend/images/products/Zona Franca/american chicken.webp',description:'Milanesa de pollo + queso Cheddar + tocino + salsa BBQ + papas fritas.' }
];

// =====================================================================
// CONTROLADOR PRINCIPAL
// =====================================================================
class ZFBurgerController {
  constructor() {
    this.elements = {
      productCard:  document.getElementById('product-card'),
      productImg:   document.getElementById('product-img'),
      productCode:  document.getElementById('product-code'),
      productName:  document.getElementById('product-name'),
      productPrice: document.getElementById('product-price'),
      productTag:   document.getElementById('product-tag'),
      productDesc:  document.getElementById('product-desc'),
    };
    this.products      = [...ZF_BURGER_FALLBACK];
    this.currentIndex  = 0;
    this.loopInterval  = null;
    this.isTransitioning = false;
    this.rotationTime  = 6000; // 6 segundos por producto
    this.wakeLock      = null;
  }

  async requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request('screen');
      }
    } catch (e) { /* silencioso */ }
  }

  async loadCatalog() {
    try {
      const res  = await fetch('frontend/catalog-zf.json?v=' + Date.now());
      const data = await res.json();
      const burgers = data.burgers || [];
      if (burgers.length > 0) {
        this.products = burgers;
        console.log(`✅ [ZF Burger] ${burgers.length} productos cargados desde catalog-zf.json`);
      } else {
        console.warn('⚠️ [ZF Burger] catalog-zf.json sin burgers, usando fallback.');
      }
    } catch (e) {
      console.warn('⚠️ [ZF Burger] No se pudo cargar catalog-zf.json, usando fallback.', e);
    }
  }

  isBurgerDelMes(p) {
    if (!p) return false;
    return (p.code && p.code.toUpperCase() === 'B5') ||
           (p.name && p.name.toUpperCase().includes('DEL MES'));
  }

  renderProduct() {
    const p = this.products[this.currentIndex];
    if (!p) return;

    const isBM = this.isBurgerDelMes(p);

    // Aplicar/quitar tema especial Burger del Mes
    if (isBM) {
      document.body.classList.add('theme-burger-del-mes-red');
    } else {
      document.body.classList.remove('theme-burger-del-mes-red');
    }

    // Alternar layout (Burger del Mes: siempre normal)
    if (isBM || this.currentIndex % 2 === 0) {
      document.body.classList.remove('layout-reversed');
    } else {
      document.body.classList.add('layout-reversed');
    }

    if (this.elements.productImg)   this.elements.productImg.src = p.image;
    if (this.elements.productCode) {
      if (p.code) {
        this.elements.productCode.textContent = p.code;
        this.elements.productCode.classList.remove('hidden');
      } else {
        this.elements.productCode.classList.add('hidden');
      }
    }
    if (this.elements.productName)  this.elements.productName.textContent  = p.name;
    if (this.elements.productPrice) this.elements.productPrice.textContent = p.price;
    if (this.elements.productTag)   this.elements.productTag.textContent   = p.tag  || '';
    if (this.elements.productDesc)  this.elements.productDesc.textContent  = p.description || '';

    // Badge especial Burger del Mes
    if (this.elements.productTag && isBurgerDelMes) {
      this.elements.productTag.style.background = 'linear-gradient(135deg, #FFD700, #FF6600)';
      this.elements.productTag.style.color = '#1a0a00';
    }

    // Actualizar insignia reactiva dinámicamente
    const popTextEl = document.getElementById('product-pop-text');
    const popIconEl = document.querySelector('#flavor-pop-badge .pop-icon');
    if (popTextEl && p) {
      let popPhrase = { text: '100% GOURMET', icon: '✨' };

      if (isBurgerDelMes) {
        popPhrase = { text: '¡EDICIÓN LIMITADA!', icon: '👑🌶️' };
      } else {
        popPhrase = { text: '100% GOURMET', icon: '👑' };
      }

      popTextEl.textContent = popPhrase.text;
      if (popIconEl) popIconEl.textContent = popPhrase.icon;
    }
  }

  animateToNext() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const card = this.elements.productCard;
    const nextIndex = (this.currentIndex + 1) % this.products.length;
    const nextIsBM = this.isBurgerDelMes(this.products[nextIndex]);
    const currentIsBM = this.isBurgerDelMes(this.products[this.currentIndex]);

    const hideClass    = currentIsBM ? 'is-hiding-bm'  : 'is-hiding';
    const enterClass   = nextIsBM    ? 'is-entering-bm' : 'is-entering';
    const hideDuration  = currentIsBM ? 500 : 550;
    const enterDuration = nextIsBM    ? 750 : 600;

    if (card) card.classList.add(hideClass);

    setTimeout(() => {
      this.currentIndex = nextIndex;
      this.renderProduct();
      if (card) {
        card.classList.remove('is-hiding', 'is-hiding-bm');
        card.classList.add(enterClass);
        setTimeout(() => {
          card.classList.remove('is-entering', 'is-entering-bm');
          this.isTransitioning = false;
        }, enterDuration);
      } else {
        this.isTransitioning = false;
      }
      this.resetProgressBar();
    }, hideDuration);
  }

  startLoop() {
    this.loopInterval = setInterval(() => this.animateToNext(), this.rotationTime);
  }

  resetProgressBar() {
    const bar = document.querySelector('.lite-progress-bar-fill');
    if (!bar) return;
    bar.style.transition = 'none';
    bar.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = `width ${this.rotationTime}ms linear`;
        bar.style.width = '100%';
      });
    });
  }

  async init() {
    console.log('🚀 [ZF Burger] Inicializando vitrina Zona Franca — Hamburguesas...');
    await this.requestWakeLock();
    document.addEventListener('visibilitychange', () => {
      if (this.wakeLock !== null && document.visibilityState === 'visible') {
        this.requestWakeLock();
      }
    });

    await this.loadCatalog();
    this.renderProduct();
    this.resetProgressBar();
    this.startLoop();
    console.log(`✅ [ZF Burger] Vitrina activa con ${this.products.length} productos.`);
  }
}

// --- ARRANQUE ---
document.addEventListener('DOMContentLoaded', () => {
  const ctrl = new ZFBurgerController();
  ctrl.init();
});
