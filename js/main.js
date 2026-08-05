/**
 * VINDSOL - Main UI Interactions & Business Logic Script
 * Manufacturer: Mechzephyr Engineering Pvt. Ltd, Bengaluru
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initSavingsCalculator();
  initCalculatorModal();
  initHeroAdSlider();
  initMegaMenu();
});

/* -------------------------------------------------------------------------- */
/* 6. Product Range Mega Menu Tab Switching                                   */
/* -------------------------------------------------------------------------- */
function initMegaMenu() {
  const tabs = document.querySelectorAll('.mega-tab-item');
  const panels = document.querySelectorAll('.mega-sub-panel');

  tabs.forEach(tab => {
    tab.addEventListener('mouseenter', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 1. Sticky Header Shadow on Scroll                                          */
/* -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
    }
  }, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* 2. Mobile Navigation Menu Toggle                                           */
/* -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = navMenu.style.display === 'flex';
    if (isExpanded) {
      navMenu.style.display = 'none';
    } else {
      navMenu.style.display = 'flex';
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '100%';
      navMenu.style.left = '0';
      navMenu.style.width = '100%';
      navMenu.style.background = '#FFFFFF';
      navMenu.style.padding = '1.5rem';
      navMenu.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 3. Multi-Tab Modern Engineering Sizing Calculator (Commercial & Pool)      */
/* -------------------------------------------------------------------------- */
function initSavingsCalculator() {
  // Commercial Hot Water Inputs
  const commVolume = document.getElementById('commVolume');
  const commT1 = document.getElementById('commT1');
  const commT2 = document.getElementById('commT2');
  const commHT = document.getElementById('commHT');
  const commTariff = document.getElementById('commTariff');

  // Commercial Outputs
  const commKWEl = document.getElementById('commKWVal');
  const commKcalEl = document.getElementById('commKcalVal');
  const commYearlySavingsEl = document.getElementById('commYearlySavingsVal');
  const commPaybackEl = document.getElementById('commPaybackVal');
  const commRecModelEl = document.getElementById('commRecModelVal');

  // Swimming Pool Inputs
  const poolVol = document.getElementById('poolVol');
  const poolType = document.getElementById('poolType');
  const poolT2 = document.getElementById('poolT2');
  const poolT1 = document.getElementById('poolT1');
  const poolAmb = document.getElementById('poolAmb');

  // Pool Outputs
  const poolKWEl = document.getElementById('poolKWVal');
  const poolFHEl = document.getElementById('poolFHVal');
  const poolRecModelEl = document.getElementById('poolRecModelVal');
  const poolRecModelLinkEl = document.getElementById('poolRecModelLink');

  // Tab Switchers
  const tabs = document.querySelectorAll('.calc-nav-btn');
  const panes = document.querySelectorAll('.calc-tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-calc-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Commercial Calculation Formula: Q_net = V * (T2-T1) / 860, Q_pump = Q_net / HT
  function calcCommercial() {
    if (!commVolume) return;
    const V = parseFloat(commVolume.value) || 1000;
    const T1 = parseFloat(commT1 ? commT1.value : 20) || 20;
    const T2 = parseFloat(commT2 ? commT2.value : 55) || 55;
    const HT = parseFloat(commHT ? commHT.value : 8) || 8;
    const tariff = parseFloat(commTariff ? commTariff.value : 8) || 8;

    const heatKcal = V * 1 * (T2 - T1); // Kcal
    const netKWh = heatKcal / 860; // kWh net load
    const reqKW = netKWh / HT; // Required Heat Pump Capacity in kW

    // Conventional Electric Heating Cost vs VINDSOL Heat Pump (COP 4.25)
    const geyserKWh = netKWh / 0.9;
    const geyserAnnualCost = geyserKWh * 365 * tariff;
    const vindsolKWh = netKWh / 4.25;
    const vindsolAnnualCost = vindsolKWh * 365 * tariff;
    const yearlySavings = Math.max(0, geyserAnnualCost - vindsolAnnualCost);

    let recModel = 'VCHP 3500 V Commercial (35 kW)';
    let recModelId = 'commercial';
    let estPrice = 165000;

    if (reqKW <= 12) {
      recModel = 'VDHP 11000 MB Monoblock (10 kW)';
      recModelId = 'dhw';
      estPrice = 98000;
    } else if (reqKW <= 35) {
      recModel = 'VCHP 3500 V Commercial (35 kW)';
      recModelId = 'commercial';
      estPrice = 165000;
    } else if (reqKW <= 50) {
      recModel = 'VCHP 5000 V Commercial (50 kW)';
      recModelId = 'commercial';
      estPrice = 220000;
    } else if (reqKW <= 75) {
      recModel = 'VCHP 7500 V Heavy Duty (75 kW)';
      recModelId = 'commercial';
      estPrice = 310000;
    } else {
      recModel = 'VCHP 15000 V Industrial (150 kW)';
      recModelId = 'commercial';
      estPrice = 520000;
    }

    const paybackYears = Math.max(0.9, (estPrice / yearlySavings)).toFixed(1);
    const formatINR = (val) => '₹ ' + Math.round(val).toLocaleString('en-IN');

    if (commKWEl) commKWEl.textContent = `${reqKW.toFixed(1)} kW`;
    if (commKcalEl) commKcalEl.textContent = `${Math.round(netKWh).toLocaleString()} kWh/day`;
    if (commYearlySavingsEl) commYearlySavingsEl.textContent = formatINR(yearlySavings);
    if (commPaybackEl) commPaybackEl.textContent = `${paybackYears} Years`;
    if (commRecModelEl) commRecModelEl.textContent = recModel;
  }

  // Swimming Pool Sizing Formula (From Sheet: Simming Pool in MD file)
  function calcPool() {
    if (!poolVol) return;
    const V = parseFloat(poolVol.value) || 100; // m3
    const isOutdoor = (poolType ? poolType.value : 'outdoor') === 'outdoor';
    const T2 = parseFloat(poolT2 ? poolT2.value : 28) || 28;
    const T1 = parseFloat(poolT1 ? poolT1.value : 15) || 15;
    const amb = parseFloat(poolAmb ? poolAmb.value : 20) || 20;

    // Approximate Pool Surface Area: Area ~ sqrt(V/1.5) * 8.366
    const side = Math.sqrt(V);
    const area = side * side;

    // Surface Heat Loss Factor f (W/m2) based on Ambient Temp lookup table
    let f = isOutdoor ? 953 : 512; // default 20°C
    if (amb <= 10) f = isOutdoor ? 1163 : 605;
    if (amb <= 15) f = isOutdoor ? 1070 : 558;
    if (amb <= 20) f = isOutdoor ? 953 : 512;
    if (amb <= 25) f = isOutdoor ? 814 : 419;
    if (amb >= 28) f = isOutdoor ? 721 : 372;

    const Q1 = (area * f) / 1000; // kW/h Surface Loss

    // Water Supply Makeup Loss Q2 = ((V * 0.05 * 1000/24) * (T2 - T1)) / 860
    const Q2 = ((V * 0.05 * 1000 / 24) * (T2 - T1)) / 860; // kW/h

    // Total Pool Heating Capacity Q = Q1 + Q2
    const Q_total = Q1 + Q2;

    // Initial Warm-up Time FH = (4200 * V * (T2-T1)) / (3600 * 24) kW
    const FH = (4200 * V * (T2 - T1)) / (3600 * 24);

    let recModel = 'VPHP 2500 Pool (25 kW Titanium)';
    let recModelId = 'pool';

    if (Q_total <= 16) {
      recModel = 'VPHP 1500 Pool (15 kW Titanium)';
      recModelId = 'pool';
    } else if (Q_total <= 28) {
      recModel = 'VPHP 2500 Pool (25 kW Titanium)';
      recModelId = 'pool';
    } else if (Q_total <= 40) {
      recModel = 'VPHP 3500 Pool (35 kW Titanium)';
      recModelId = 'pool';
    } else {
      const units = Math.ceil(Q_total / 35);
      recModel = `VPHP Multi-Module Array (${units}x 35kW Units = ${units * 35}kW)`;
      recModelId = 'pool';
    }

    if (poolKWEl) poolKWEl.textContent = `${Q_total.toFixed(1)} kW`;
    if (poolFHEl) poolFHEl.textContent = `${FH.toFixed(1)} kW (Initial Warmup)`;
    if (poolRecModelEl) poolRecModelEl.textContent = recModel;
    if (poolRecModelLinkEl) poolRecModelLinkEl.href = `product-detail.html?id=${recModelId}`;
  }

  [commVolume, commT1, commT2, commHT, commTariff].forEach(el => {
    if (el) {
      el.addEventListener('input', calcCommercial);
      el.addEventListener('change', calcCommercial);
    }
  });

  [poolVol, poolType, poolT2, poolT1, poolAmb].forEach(el => {
    if (el) {
      el.addEventListener('input', calcPool);
      el.addEventListener('change', calcPool);
    }
  });

  calcCommercial();
  calcPool();
}

/* -------------------------------------------------------------------------- */
/* 4. Calculator Modal Open / Close Handler                                   */
/* -------------------------------------------------------------------------- */
function initCalculatorModal() {
  const triggers = document.querySelectorAll('.open-calc-modal');
  const overlay = document.getElementById('calcModalOverlay');
  const closeBtn = document.getElementById('closeCalcModalBtn');

  if (!overlay) return;

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 5. Dynamic Hero Ad Showcase Slider                                         */
/* -------------------------------------------------------------------------- */
function initHeroAdSlider() {
  const slider = document.getElementById('heroAdSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-banner-slide, .hero-slide');
  const dots = slider.querySelectorAll('.hero-slider-dot');
  const prevBtn = document.getElementById('heroSlidePrev');
  const nextBtn = document.getElementById('heroSlideNext');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoTimer = null;

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 4000);
  }

  function stopAutoPlay() {
    if (autoTimer) clearInterval(autoTimer);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIndex - 1);
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIndex + 1);
      startAutoPlay();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
      showSlide(idx);
      startAutoPlay();
    });
  });

  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);

  startAutoPlay();
}
