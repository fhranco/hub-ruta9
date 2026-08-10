/**
 * Vitrina Digital — Menú Completo (Mix) ZONA FRANCA
 * Controlador 100% exclusivo para la sucursal Zona Franca.
 * Lee ÚNICAMENTE frontend/catalog-zf.json.
 * Rotación rítmica: Burger → Snack → Burger del Mes → Sándwich → (repite)
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
    console.log('📺 [ZF Mix] Modo Lite activado.');
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
  const match = src.match(/([bks]\d+|mes|classic chicken|american chicken)/i);
  if (match) {
    img.src = `frontend/images/products/Zona Franca/${match[1].toLowerCase()}.webp`;
  } else {
    img.src = 'frontend/images/products/Zona Franca/b1.webp';
  }
};

// --- CATÁLOGOS DE EMERGENCIA (en memoria) ---
const ZF_MIX_BURGERS_FALLBACK = [
  { id:'zf-b1',  code:'B1',  name:'Burger Básica',               price:'$8.200',  tag:'RECETA CLÁSICA 🍅',   image:'frontend/images/products/Zona Franca/b1.webp',             description:'Burger + queso Gouda o Cheddar. Incluye papas fritas rústicas.' },
  { id:'zf-b2',  code:'B2',  name:'Burger Completa',             price:'$9.600',  tag:'¡PÍDELA AHORA! 🍳',   image:'frontend/images/products/Zona Franca/b2.webp',             description:'Burger + queso Gouda + lechuga + tomate + cebolla morada + huevo frito. Incluye papas fritas rústicas.' },
  { id:'zf-b3',  code:'B3',  name:'Clásica BBQ',                 price:'$10.900', tag:'TOCINO EXTRA 🥓',      image:'frontend/images/products/Zona Franca/b3.webp',             description:'Burger + queso Cheddar + tocino + huevo frito + pepinillos + salsa BBQ. Incluye papas fritas rústicas.' },
  { id:'zf-b6',  code:'B6',  name:'BBQ Tocino',                  price:'$10.500', tag:'TOCINO EXTRA 🥓',      image:'frontend/images/products/Zona Franca/b6.webp',             description:'Burger + queso Cheddar + tocino + aros de cebolla apanados + salsa BBQ. Incluye papas fritas rústicas.' },
  { id:'zf-b7',  code:'B7',  name:'La 420',                      price:'$9.500',  tag:'VEGGIE STYLE 🌿',     image:'frontend/images/products/Zona Franca/b7.webp',             description:'Burger veggie de garbanzos + lechuga + cebollín grillado + palta trozada + pepinillos. Incluye papas fritas rústicas.' },
  { id:'zf-b8',  code:'B8',  name:'Burger BLT',                  price:'$10.500', tag:'RECETA CLÁSICA 🍅',   image:'frontend/images/products/Zona Franca/b8.webp',             description:'Burger + tocino + lechuga + tomate. Incluye papas fritas rústicas.' },
  { id:'zf-b9',  code:'B9',  name:'Doble Cuarto de Libra V. R9', price:'$13.600', tag:'SÚPER COLOSAL 👑',    image:'frontend/images/products/Zona Franca/b9.webp',             description:'2 burgers + medallón de queso crocante. Incluye papas fritas rústicas.' },
  { id:'zf-b14', code:'B14', name:'Gouda Frito',                 price:'$10.600', tag:'¡DISFRÚTALA! 🥚',     image:'frontend/images/products/Zona Franca/b14.webp',            description:'Burger + queso Gouda + cebolla caramelizada + tocino + huevo frito. Incluye papas fritas rústicas.' },
  { id:'zf-b17', code:'B17', name:'La Gran "S"',                 price:'$11.800', tag:'¡PÍDELA AHORA! ⭐',   image:'frontend/images/products/Zona Franca/b17.webp',            description:'Burger + queso Cheddar + tocino + palta trozada + huevo frito. Incluye papas fritas rústicas.' },
  { id:'zf-b18', code:'B18', name:'La Francesa',                 price:'$11.800', tag:'LA FRANCESA 🥖',      image:'frontend/images/products/Zona Franca/b18.webp',            description:'Burger + queso Gouda + queso azul + cebolla caramelizada + champiñones. Incluye papas fritas rústicas.' },
  { id:'zf-b19', code:'B19', name:'La "36"',                     price:'$11.800', tag:'¡DISFRÚTALA! 🍔',     image:'frontend/images/products/Zona Franca/b19.webp',            description:'Burger + queso Cheddar + tocino + aros de cebolla + pepinillos + salsa BBQ + huevo. Incluye papas fritas rústicas.' },
  { id:'zf-b22', code:'B22', name:'Club Veggie',                 price:'$10.500', tag:'CLUB VEGGIE 🌿',      image:'frontend/images/products/Zona Franca/b22.webp',            description:'Burger + queso Cheddar + lechuga + tomate + pepinillos + salsa club. Incluye papas fritas rústicas.' },
  { id:'zf-cc',  code:'CC',  name:'Classic Chicken',             price:'$7.900',  tag:'¡DISFRÚTALA! 🍗',     image:'frontend/images/products/Zona Franca/classic chicken.webp', description:'Milanesa de pollo + tomate + lechuga + súper mayonesa + papas fritas.' },
  { id:'zf-ac',  code:'AC',  name:'American Chicken',            price:'$7.900',  tag:'¡PÍDELA AHORA! 🛎️',  image:'frontend/images/products/Zona Franca/american chicken.webp',description:'Milanesa de pollo + queso Cheddar + tocino + salsa BBQ + papas fritas.' }
];
const ZF_MIX_BURGER_DEL_MES_FALLBACK = { id:'zf-b5', code:'B5', name:'Burger del Mes', price:'$10.500', tag:'BURGER DEL MES 👑🌶️', image:'frontend/images/products/Zona Franca/mes.webp', description:'Burger + queso + palta + tomates + mix de ajíes + tortillas de maíz. Incluye papas fritas rústicas.' };
const ZF_MIX_SNACKS_FALLBACK = [
  { id:'zf-k1',  code:'K1',  name:'Aros de cebolla apanados',        price:'$3.500', tag:'CRUJIENTES 🧅',    image:'frontend/images/products/Zona Franca/k1.webp',  description:'Aros de cebolla apanados.' },
  { id:'zf-k2',  code:'K2',  name:'Aros con Salsa',                  price:'$4.000', tag:'SALSAS EXTRAS 🍯', image:'frontend/images/products/Zona Franca/k2.webp',  description:'Aros de cebolla apanados con salsa BBQ, Cheddar o mostaza miel.' },
  { id:'zf-k7',  code:'K7',  name:'Papas fritas rústicas',           price:'$5.500', tag:'CLÁSICAS 🍟',      image:'frontend/images/products/Zona Franca/k7.webp',  description:'Papas fritas rústicas.' },
  { id:'zf-k8',  code:'K8',  name:'Mix papas + aros',                price:'$5.500', tag:'PURA FIESTA 🎉',   image:'frontend/images/products/Zona Franca/k8.webp',  description:'Mix de papas fritas rústicas + aros de cebolla apanados.' },
  { id:'zf-k10', code:'K10', name:'Papas provenzal',                 price:'$6.000', tag:'AROMÁTICAS 🧄',    image:'frontend/images/products/Zona Franca/k10.webp', description:'Papas fritas a la provenzal: papas rústicas + ajo + perejil.' },
  { id:'zf-k12', code:'K12', name:'Papas cheddar tocino pepinillo',  price:'$6.500', tag:'SABOR INTENSO 🥓', image:'frontend/images/products/Zona Franca/k12.webp', description:'Papas fritas con salsa Cheddar + tocino chips + pepinillos agridulces.' },
  { id:'zf-k13', code:'K13', name:'Papas queso crema y tocino',      price:'$6.500', tag:'CREMOSAS 🥓',      image:'frontend/images/products/Zona Franca/k13.webp', description:'Papas fritas con queso crema + tocino chips.' }
];
const ZF_MIX_SANDWICHES_FALLBACK = [
  { id:'zf-s1', code:'S1', name:'Baguette de Tocino',         price:'$9.200', tag:'FRESO & CRUNCHY 🥗', image:'frontend/images/products/Zona Franca/s1.webp', description:'Baguette de tocino + lechuga + tomate.' },
  { id:'zf-s2', code:'S2', name:'Baguette de Huevo Revuelto', price:'$6.000', tag:'HUEVO & SABOR 🍳',   image:'frontend/images/products/Zona Franca/s2.webp', description:'Baguette de tocino + huevo revuelto.' },
  { id:'zf-s3', code:'S3', name:'Baguette de Queso y Huevo',  price:'$6.500', tag:'QUESO & HUEVO 🧀',   image:'frontend/images/products/Zona Franca/s3 baguette de queso y jamón.webp', description:'Baguette de queso + huevo.' }
];

// =====================================================================
// CONTROLADOR PRINCIPAL
// =====================================================================
class ZFMixController {
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
    this.products      = [];
    this.currentIndex  = 0;
    this.loopInterval  = null;
    this.isTransitioning = false;
    this.rotationTime  = 6000;
    this.wakeLock      = null;
  }

  buildRhythmicList(burgers, burgerDelMes, snacks, sandwiches) {
    // Separar la Burger del Mes de las regulares
    const bMes = burgerDelMes ||
      burgers.find(b => (b.code && b.code.toUpperCase() === 'B5') ||
                        (b.name && b.name.toUpperCase().includes('DEL MES'))) ||
      null;
    const otherBurgers = bMes ? burgers.filter(b => b !== bMes) : [...burgers];

    // Pool de productos regulares alternando: Burger → Snack → Burger → Sándwich…
    const regularPool = [];
    // Hacemos suficientes iteraciones para recorrer todas las hamburguesas y sandwiches sin saltar ninguno
    const totalSteps = Math.max(otherBurgers.length, snacks.length, sandwiches.length * 2);
    let bIdx = 0, kIdx = 0, sIdx = 0;
    for (let i = 0; i < totalSteps; i++) {
      if (otherBurgers.length > 0) { regularPool.push(otherBurgers[bIdx % otherBurgers.length]); bIdx++; }
      if (snacks.length > 0)       { regularPool.push(snacks[kIdx % snacks.length]);             kIdx++; }
      if (otherBurgers.length > 0) { regularPool.push(otherBurgers[bIdx % otherBurgers.length]); bIdx++; }
      if (sandwiches.length > 0)   { regularPool.push(sandwiches[sIdx % sandwiches.length]);     sIdx++; }
      
      // Si ya dimos una vuelta completa a las hamburguesas principales, salimos del bucle base
      if (bIdx >= otherBurgers.length && kIdx >= snacks.length && sIdx >= sandwiches.length) {
        break;
      }
    }

    // Intercalar la Burger del Mes exactamente cada 5 posiciones
    if (!bMes || regularPool.length === 0) return regularPool;
    const list = [];
    let pos = 0;
    for (let i = 0; i < regularPool.length; i++) {
      list.push(regularPool[i]);
      pos++;
      if (pos % 5 === 0) {
        list.push({ ...bMes, _isBurgerDelMes: true });
      }
    }
    // Garantizar que al menos aparezca una vez si el pool es muy corto
    if (!list.some(p => p._isBurgerDelMes)) list.push({ ...bMes, _isBurgerDelMes: true });
    return list;
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
      const burgers    = data.burgers    || [];
      const snacks     = data.snacks     || [];
      const sandwiches = data.sandwiches || [];

      if (burgers.length + snacks.length + sandwiches.length > 0) {
        this.products = this.buildRhythmicList(burgers, null, snacks, sandwiches);
        console.log(`✅ [ZF Mix] Secuencia rítmica de ${this.products.length} items construida desde catalog-zf.json`);
      } else {
        throw new Error('catalog-zf.json vacío');
      }
    } catch (e) {
      console.warn('⚠️ [ZF Mix] No se pudo cargar catalog-zf.json, usando fallback.', e);
      this.products = this.buildRhythmicList(
        ZF_MIX_BURGERS_FALLBACK,
        ZF_MIX_BURGER_DEL_MES_FALLBACK,
        ZF_MIX_SNACKS_FALLBACK,
        ZF_MIX_SANDWICHES_FALLBACK
      );
    }
  }

  isBurgerDelMes(p) {
    return p._isBurgerDelMes ||
      (p.code && p.code.toUpperCase() === 'B5') ||
      (p.name && p.name.toUpperCase().includes('DEL MES'));
  }

  renderProduct() {
    const p = this.products[this.currentIndex];
    if (!p) return;

    const isBM = this.isBurgerDelMes(p);

    // Tema especial Burger del Mes
    if (isBM) {
      document.body.classList.add('theme-burger-del-mes-red');
    } else {
      document.body.classList.remove('theme-burger-del-mes-red');
    }

    // Alternar layout izquierda/derecha (no en Burger del Mes, siempre centrado/normal)
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

    // Actualizar insignia reactiva dinámicamente según el tipo de producto e ingredientes
    const popTextEl = document.getElementById('product-pop-text');
    const popIconEl = document.querySelector('#flavor-pop-badge .pop-icon');
    if (popTextEl && p) {
      const descUpper = (p.description || '').toUpperCase();
      const nameUpper = (p.name || '').toUpperCase();
      
      let popPhrase = { text: '100% GOURMET', icon: '✨' };

      if (isBM) {
        popPhrase = { text: '¡EDICIÓN LIMITADA!', icon: '👑🌶️' };
      } else if (p.id.startsWith('zf-s')) { // Sándwiches
        if (descUpper.includes('HUEVO') || nameUpper.includes('HUEVO')) {
          popPhrase = { text: '¡HUEVO CREMOSO & FRESCO!', icon: '🍳' };
        } else if (descUpper.includes('QUESO') || nameUpper.includes('QUESO')) {
          popPhrase = { text: '¡FULL QUESO DERRETIDO!', icon: '🧀' };
        } else {
          popPhrase = { text: '¡RECETA CASERA!', icon: '🥖' };
        }
      } else if (p.id.startsWith('zf-k')) { // Snacks
        popPhrase = { text: '¡EL ACOMPAÑAMIENTO PERFECTO!', icon: '🍟' };
      } else { // Hamburguesas
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

    // Clases de salida según si el producto actual es Burger del Mes
    const hideClass  = currentIsBM ? 'is-hiding-bm'  : 'is-hiding';
    const enterClass = nextIsBM    ? 'is-entering-bm' : 'is-entering';
    const hideDuration = currentIsBM ? 500 : 550;
    const enterDuration = nextIsBM   ? 750 : 600;

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
    console.log('🚀 [ZF Mix] Inicializando vitrina Zona Franca — Menú Completo...');
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
    console.log(`✅ [ZF Mix] Vitrina activa — ${this.products.length} items en rotación (Burger→Snack→Burger del Mes→Sándwich).`);
  }
}

// --- ARRANQUE ---
document.addEventListener('DOMContentLoaded', () => {
  const ctrl = new ZFMixController();
  ctrl.init();
});
