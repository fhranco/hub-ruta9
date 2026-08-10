/**
 * Vitrina Digital — Sándwiches ZONA FRANCA
 * Controlador 100% exclusivo para la sucursal Zona Franca.
 * Lee ÚNICAMENTE frontend/catalog-zf.json → sección "sandwiches".
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
    console.log('📺 [ZF Sandwich] Modo Lite activado.');
  }
})();

// --- MANEJADOR DE IMÁGENES ROTAS (ZF) ---
window.handleImageError = function (img) {
  if (!img) return;
  if (img.dataset.hasFailed) {
    img.src = 'frontend/images/products/Zona Franca/s1.webp';
    return;
  }
  img.dataset.hasFailed = true;
  const src = img.src || '';
  const match = src.match(/s\d+/i);
  if (match) {
    img.src = `frontend/images/products/Zona Franca/${match[0].toLowerCase()}.webp`;
  } else {
    img.src = 'frontend/images/products/Zona Franca/s1.webp';
  }
};

// --- CATÁLOGO LOCAL DE EMERGENCIA ---
const ZF_SANDWICH_FALLBACK = [
  { id:'zf-s1', code:'S1', name:'Baguette de Tocino',          price:'$9.200', tag:'FRESO & CRUNCHY 🥗', image:'frontend/images/products/Zona Franca/s1.webp', description:'Baguette de tocino + lechuga + tomate.' },
  { id:'zf-s2', code:'S2', name:'Baguette de Huevo Revuelto',  price:'$6.000', tag:'HUEVO & SABOR 🍳',    image:'frontend/images/products/Zona Franca/s2.webp', description:'Baguette de tocino + huevo revuelto.' },
  { id:'zf-s3', code:'S3', name:'Baguette de Queso y Huevo',   price:'$6.500', tag:'QUESO & HUEVO 🧀',    image:'frontend/images/products/Zona Franca/s3 baguette de queso y jamón.webp', description:'Baguette de queso + huevo.' }
];

// =====================================================================
// CONTROLADOR PRINCIPAL
// =====================================================================
class ZFSandwichController {
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
    this.products      = [...ZF_SANDWICH_FALLBACK];
    this.currentIndex  = 0;
    this.loopInterval  = null;
    this.isTransitioning = false;
    this.rotationTime  = 6000;
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
      const sandwiches = data.sandwiches || [];
      const burgers    = data.burgers    || [];
      const bMes       = burgers.find(b => (b.code && b.code.toUpperCase() === 'B5') ||
                                          (b.name && b.name.toUpperCase().includes('DEL MES')));

      if (sandwiches.length > 0) {
        // Con solo 3 sándwiches, insertar Burger del Mes después de todos
        const list = [...sandwiches];
        if (bMes) list.push({ ...bMes, _isBurgerDelMes: true });
        this.products = list;
        console.log(`✅ [ZF Sandwich] ${list.length} items (${sandwiches.length} sándwiches + Burger del Mes) cargados`);
      } else {
        console.warn('⚠️ [ZF Sandwich] catalog-zf.json sin sandwiches, usando fallback.');
      }
    } catch (e) {
      console.warn('⚠️ [ZF Sandwich] No se pudo cargar catalog-zf.json, usando fallback.', e);
    }
  }

  isBurgerDelMes(p) {
    if (!p) return false;
    return p._isBurgerDelMes ||
      (p.code && p.code.toUpperCase() === 'B5') ||
      (p.name && p.name.toUpperCase().includes('DEL MES'));
  }

  renderProduct() {
    const p = this.products[this.currentIndex];
    if (!p) return;

    const isBM = this.isBurgerDelMes(p);

    if (isBM) {
      document.body.classList.add('theme-burger-del-mes-red');
      document.body.classList.remove('layout-reversed');
    } else {
      document.body.classList.remove('theme-burger-del-mes-red');
      if (this.currentIndex % 2 === 0) {
        document.body.classList.remove('layout-reversed');
      } else {
        document.body.classList.add('layout-reversed');
      }
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
  }

  animateToNext() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const card = this.elements.productCard;
    const nextIndex = (this.currentIndex + 1) % this.products.length;
    const nextIsBM    = this.isBurgerDelMes(this.products[nextIndex]);
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
    console.log('🚀 [ZF Sandwich] Inicializando vitrina Zona Franca — Sándwiches...');
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
    console.log(`✅ [ZF Sandwich] Vitrina activa con ${this.products.length} sándwiches.`);
  }
}

// --- ARRANQUE ---
document.addEventListener('DOMContentLoaded', () => {
  const ctrl = new ZFSandwichController();
  ctrl.init();
});
