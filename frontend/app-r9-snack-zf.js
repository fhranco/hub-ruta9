/**
 * Vitrina Digital — Snacks & Acompañamientos ZONA FRANCA
 * Controlador 100% exclusivo para la sucursal Zona Franca.
 * Lee ÚNICAMENTE frontend/catalog-zf.json → sección "snacks".
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
    console.log('📺 [ZF Snack] Modo Lite activado.');
  }
})();

// --- MANEJADOR DE IMÁGENES ROTAS (ZF) ---
window.handleImageError = function (img) {
  if (!img) return;
  if (img.dataset.hasFailed) {
    img.src = 'frontend/images/products/Zona Franca/k7.webp';
    return;
  }
  img.dataset.hasFailed = true;
  const src = img.src || '';
  const match = src.match(/k\d+/i);
  if (match) {
    img.src = `frontend/images/products/Zona Franca/${match[0].toLowerCase()}.webp`;
  } else {
    img.src = 'frontend/images/products/Zona Franca/k7.webp';
  }
};

// --- CATÁLOGO LOCAL DE EMERGENCIA ---
const ZF_SNACK_FALLBACK = [
  { id:'zf-k1',  code:'K1',  name:'Aros de cebolla apanados',         price:'$3.500', tag:'CRUJIENTES 🧅',     image:'frontend/images/products/Zona Franca/k1.webp',  description:'Aros de cebolla apanados.' },
  { id:'zf-k2',  code:'K2',  name:'Aros con Salsa',                   price:'$4.000', tag:'SALSAS EXTRAS 🍯',  image:'frontend/images/products/Zona Franca/k2.webp',  description:'Aros de cebolla apanados con salsa BBQ, Cheddar o mostaza miel.' },
  { id:'zf-k7',  code:'K7',  name:'Papas fritas rústicas',            price:'$5.500', tag:'CLÁSICAS 🍟',       image:'frontend/images/products/Zona Franca/k7.webp',  description:'Papas fritas rústicas.' },
  { id:'zf-k8',  code:'K8',  name:'Mix papas + aros',                 price:'$5.500', tag:'PURA FIESTA 🎉',    image:'frontend/images/products/Zona Franca/k8.webp',  description:'Mix de papas fritas rústicas + aros de cebolla apanados.' },
  { id:'zf-k10', code:'K10', name:'Papas provenzal',                  price:'$6.000', tag:'AROMÁTICAS 🧄',     image:'frontend/images/products/Zona Franca/k10.webp', description:'Papas fritas a la provenzal: papas rústicas + ajo + perejil.' },
  { id:'zf-k12', code:'K12', name:'Papas cheddar tocino pepinillo',   price:'$6.500', tag:'SABOR INTENSO 🥓',  image:'frontend/images/products/Zona Franca/k12.webp', description:'Papas fritas con salsa Cheddar + tocino chips + pepinillos agridulces.' },
  { id:'zf-k13', code:'K13', name:'Papas queso crema y tocino',       price:'$6.500', tag:'CREMOSAS 🥓',       image:'frontend/images/products/Zona Franca/k13.webp', description:'Papas fritas con queso crema + tocino chips.' }
];

// =====================================================================
// CONTROLADOR PRINCIPAL
// =====================================================================
class ZFSnackController {
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
    this.products      = [...ZF_SNACK_FALLBACK];
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
      const snacks  = data.snacks   || [];
      const burgers = data.burgers  || [];
      const bMes    = burgers.find(b => (b.code && b.code.toUpperCase() === 'B5') ||
                                       (b.name && b.name.toUpperCase().includes('DEL MES')));

      if (snacks.length > 0) {
        // Intercalar la Burger del Mes cada 5 snacks
        const list = [];
        let pos = 0;
        for (let i = 0; i < snacks.length; i++) {
          list.push(snacks[i]);
          pos++;
          if (pos % 5 === 0 && bMes) {
            list.push({ ...bMes, _isBurgerDelMes: true });
          }
        }
        // Garantizar al menos una aparición
        if (bMes && !list.some(p => p._isBurgerDelMes)) {
          list.push({ ...bMes, _isBurgerDelMes: true });
        }
        this.products = list;
        console.log(`✅ [ZF Snack] ${list.length} items (${snacks.length} snacks + Burger del Mes) cargados desde catalog-zf.json`);
      } else {
        console.warn('⚠️ [ZF Snack] catalog-zf.json sin snacks, usando fallback.');
      }
    } catch (e) {
      console.warn('⚠️ [ZF Snack] No se pudo cargar catalog-zf.json, usando fallback.', e);
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
    console.log('🚀 [ZF Snack] Inicializando vitrina Zona Franca — Snacks...');
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
    console.log(`✅ [ZF Snack] Vitrina activa con ${this.products.length} productos.`);
  }
}

// --- ARRANQUE ---
document.addEventListener('DOMContentLoaded', () => {
  const ctrl = new ZFSnackController();
  ctrl.init();
});
