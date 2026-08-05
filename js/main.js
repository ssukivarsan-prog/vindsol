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
  initProductQuickViewModal();
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

    const custName = document.getElementById('custName') ? document.getElementById('custName').value : 'Valued Client';
    const custCity = document.getElementById('custCity') ? document.getElementById('custCity').value : 'Site';

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
    let unitPrice = 165000;
    let tankPrice = 45000;
    const safetyPrice = 8500;
    const freightPrice = 6500;

    if (reqKW <= 12) {
      recModel = 'VDHP 11000 MB Monoblock (10 kW)';
      unitPrice = 98000;
      tankPrice = 35000;
    } else if (reqKW <= 35) {
      recModel = 'VCHP 3500 V Commercial (35 kW)';
      unitPrice = 165000;
      tankPrice = 45000;
    } else if (reqKW <= 50) {
      recModel = 'VCHP 5000 V Commercial (50 kW)';
      unitPrice = 220000;
      tankPrice = 65000;
    } else if (reqKW <= 75) {
      recModel = 'VCHP 7500 V Heavy Duty (75 kW)';
      unitPrice = 310000;
      tankPrice = 85000;
    } else {
      recModel = 'VCHP 15000 V Industrial (150 kW)';
      unitPrice = 520000;
      tankPrice = 120000;
    }

    const subtotal = unitPrice + tankPrice + safetyPrice + freightPrice;
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst;
    const paybackYears = Math.max(0.7, (grandTotal / yearlySavings)).toFixed(1);

    const formatINR = (val) => '₹ ' + Math.round(val).toLocaleString('en-IN');

    if (commKWEl) commKWEl.textContent = `${reqKW.toFixed(1)} kW`;
    if (commKcalEl) commKcalEl.textContent = `${Math.round(netKWh).toLocaleString()} kWh/day`;
    if (commYearlySavingsEl) commYearlySavingsEl.textContent = formatINR(yearlySavings);
    if (commPaybackEl) commPaybackEl.textContent = `${paybackYears} Yrs`;

    const subEl = document.getElementById('commSubtotalVal');
    const grandEl = document.getElementById('commGrandTotalVal');
    if (subEl) subEl.textContent = formatINR(subtotal);
    if (grandEl) grandEl.textContent = formatINR(grandTotal);

    // Update BOM Table
    const bomBody = document.getElementById('commBomTableBody');
    if (bomBody) {
      bomBody.innerHTML = `
        <tr>
          <td>${recModel}</td>
          <td style="text-align: right;">${formatINR(unitPrice)}</td>
        </tr>
        <tr>
          <td>Quartz Blue Glass Tank (${Math.round(V)}L)</td>
          <td style="text-align: right;">${formatINR(tankPrice)}</td>
        </tr>
        <tr>
          <td>Hydraulic Safety Valve Pack (VRV + TPRV)</td>
          <td style="text-align: right;">${formatINR(safetyPrice)}</td>
        </tr>
        <tr>
          <td>Factory Freight &amp; Commissioning</td>
          <td style="text-align: right;">${formatINR(freightPrice)}</td>
        </tr>
        <tr class="quote-total-row">
          <td>Subtotal Excl. Tax</td>
          <td style="text-align: right;">${formatINR(subtotal)}</td>
        </tr>
        <tr class="quote-total-row" style="background: rgba(255, 215, 0, 0.2); color: #FFFFFF;">
          <td>Grand Total (Incl. 18% GST)</td>
          <td style="text-align: right; font-size: 1.1rem; color: #FFD700;">${formatINR(grandTotal)}</td>
        </tr>
      `;
    }

    // Dynamic WhatsApp Link
    const commWaBtn = document.getElementById('commWaBtn');
    if (commWaBtn) {
      const msg = encodeURIComponent(`Hello VINDSOL Team,\n\nI would like an Official Quotation for ${custName} (${custCity}):\n- Required Model: ${recModel}\n- Demand: ${V}L/day (${reqKW.toFixed(1)} kW)\n- Estimated Total: ${formatINR(grandTotal)} (Incl. 18% GST)\n- Annual Savings: ${formatINR(yearlySavings)}`);
      commWaBtn.href = `https://wa.me/918041231313?text=${msg}`;
    }
  }

  // Swimming Pool Sizing & Quotation Formula
  function calcPool() {
    if (!poolVol) return;
    const V = parseFloat(poolVol.value) || 100; // m3
    const isOutdoor = (poolType ? poolType.value : 'outdoor') === 'outdoor';
    const T2 = parseFloat(poolT2 ? poolT2.value : 28) || 28;
    const T1 = parseFloat(poolT1 ? poolT1.value : 15) || 15;
    const amb = parseFloat(poolAmb ? poolAmb.value : 20) || 20;

    const custName = document.getElementById('custName') ? document.getElementById('custName').value : 'Valued Client';
    const custCity = document.getElementById('custCity') ? document.getElementById('custCity').value : 'Site';

    const side = Math.sqrt(V);
    const area = side * side;

    let f = isOutdoor ? 953 : 512;
    if (amb <= 10) f = isOutdoor ? 1163 : 605;
    if (amb <= 15) f = isOutdoor ? 1070 : 558;
    if (amb <= 20) f = isOutdoor ? 953 : 512;
    if (amb <= 25) f = isOutdoor ? 814 : 419;
    if (amb >= 28) f = isOutdoor ? 721 : 372;

    const Q1 = (area * f) / 1000;
    const Q2 = ((V * 0.05 * 1000 / 24) * (T2 - T1)) / 860;
    const Q_total = Q1 + Q2;
    const FH = (4200 * V * (T2 - T1)) / (3600 * 24);

    let recModel = 'VPHP 2500 Pool (25 kW Titanium)';
    let unitPrice = 145000;
    const freightPrice = 8500;

    if (Q_total <= 16) {
      recModel = 'VPHP 1500 Pool (15 kW Titanium)';
      unitPrice = 85000;
    } else if (Q_total <= 28) {
      recModel = 'VPHP 2500 Pool (25 kW Titanium)';
      unitPrice = 145000;
    } else if (Q_total <= 40) {
      recModel = 'VPHP 3500 Pool (35 kW Titanium)';
      unitPrice = 195000;
    } else {
      const units = Math.ceil(Q_total / 35);
      recModel = `VPHP Pool Array (${units}x 35kW Units = ${units * 35}kW)`;
      unitPrice = units * 195000;
    }

    const subtotal = unitPrice + freightPrice;
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst;
    const formatINR = (val) => '₹ ' + Math.round(val).toLocaleString('en-IN');

    if (poolKWEl) poolKWEl.textContent = `${Q_total.toFixed(1)} kW`;
    if (poolFHEl) poolFHEl.textContent = `${FH.toFixed(1)} kW`;

    const subEl = document.getElementById('poolSubtotalVal');
    const grandEl = document.getElementById('poolGrandTotalVal');
    if (subEl) subEl.textContent = formatINR(subtotal);
    if (grandEl) grandEl.textContent = formatINR(grandTotal);

    const bomBody = document.getElementById('poolBomTableBody');
    if (bomBody) {
      bomBody.innerHTML = `
        <tr>
          <td>${recModel}</td>
          <td style="text-align: right;">${formatINR(unitPrice)}</td>
        </tr>
        <tr>
          <td>Titanium Anti-Corrosion Exchanger Circuit</td>
          <td style="text-align: right;">Included</td>
        </tr>
        <tr>
          <td>Freight &amp; Commissioning</td>
          <td style="text-align: right;">${formatINR(freightPrice)}</td>
        </tr>
        <tr class="quote-total-row">
          <td>Subtotal Excl. Tax</td>
          <td style="text-align: right;">${formatINR(subtotal)}</td>
        </tr>
        <tr class="quote-total-row" style="background: rgba(255, 215, 0, 0.2); color: #FFFFFF;">
          <td>Grand Total (Incl. 18% GST)</td>
          <td style="text-align: right; font-size: 1.1rem; color: #FFD700;">${formatINR(grandTotal)}</td>
        </tr>
      `;
    }

    const poolWaBtn = document.getElementById('poolWaBtn');
    if (poolWaBtn) {
      const msg = encodeURIComponent(`Hello VINDSOL Team,\n\nI would like an Official Quotation for Swimming Pool Heating (${custName}, ${custCity}):\n- Pool Volume: ${V} m³ (${Q_total.toFixed(1)} kW)\n- Recommended Model: ${recModel}\n- Total Investment: ${formatINR(grandTotal)} (Incl. 18% GST)`);
      poolWaBtn.href = `https://wa.me/918041231313?text=${msg}`;
    }
  }

  // Residential Domestic Calculation
  function calcDomestic() {
    const peopleInput = document.getElementById('calcPeople');
    const litresInput = document.getElementById('calcLitres');
    const heaterSelect = document.getElementById('calcHeaterType');
    const tariffInput = document.getElementById('calcTariff');

    const monthlySavingsEl = document.getElementById('monthlySavingsVal');
    const paybackEl = document.getElementById('paybackPeriodVal');

    const custName = document.getElementById('custName') ? document.getElementById('custName').value : 'Valued Client';
    const custCity = document.getElementById('custCity') ? document.getElementById('custCity').value : 'Site';

    if (!litresInput) return;

    let litres = parseFloat(litresInput.value) || 200;
    const tariff = parseFloat(tariffInput ? tariffInput.value : 8) || 8;
    const heaterType = heaterSelect ? heaterSelect.value : 'geyser';

    const deltaT = 40;
    const dailyKWhRequired = (litres * 4.186 * deltaT) / 3600;

    let conventionalCOP = 0.9;
    if (heaterType === 'boiler') conventionalCOP = 0.7;
    if (heaterType === 'solar') conventionalCOP = 1.5;

    const geyserDailyKWh = dailyKWhRequired / conventionalCOP;
    const geyserAnnualCost = geyserDailyKWh * 365 * tariff;

    const vindsolDailyKWh = dailyKWhRequired / 4.25;
    const vindsolAnnualCost = vindsolDailyKWh * 365 * tariff;

    const yearlySavings = Math.max(0, geyserAnnualCost - vindsolAnnualCost);
    const monthlySavings = yearlySavings / 12;

    let recModel = 'VDHP 4500 MB All-in-One (200L)';
    let unitPrice = 65000;
    const installPrice = 4500;

    if (litres <= 150) {
      recModel = 'VDHP 3000 MB All-in-One (150L)';
      unitPrice = 48000;
    } else if (litres <= 250) {
      recModel = 'VDHP 4500 MB All-in-One (200L)';
      unitPrice = 65000;
    } else if (litres <= 400) {
      recModel = 'VDHP 6000 MB All-in-One (300L)';
      unitPrice = 78000;
    } else {
      recModel = 'VDHP 7500 MB All-in-One (500L)';
      unitPrice = 95000;
    }

    const subtotal = unitPrice + installPrice;
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst;
    const paybackYears = Math.max(1.1, (grandTotal / yearlySavings)).toFixed(1);
    const formatINR = (val) => '₹ ' + Math.round(val).toLocaleString('en-IN');

    if (monthlySavingsEl) monthlySavingsEl.textContent = formatINR(monthlySavings);
    if (paybackEl) paybackEl.textContent = `${paybackYears} Yrs`;

    const subEl = document.getElementById('domSubtotalVal');
    const grandEl = document.getElementById('domGrandTotalVal');
    if (subEl) subEl.textContent = formatINR(subtotal);
    if (grandEl) grandEl.textContent = formatINR(grandTotal);

    const bomBody = document.getElementById('domBomTableBody');
    if (bomBody) {
      bomBody.innerHTML = `
        <tr>
          <td>${recModel}</td>
          <td style="text-align: right;">${formatINR(unitPrice)}</td>
        </tr>
        <tr>
          <td>Standard Installation &amp; Hydraulic Piping Kit</td>
          <td style="text-align: right;">${formatINR(installPrice)}</td>
        </tr>
        <tr class="quote-total-row">
          <td>Subtotal Excl. Tax</td>
          <td style="text-align: right;">${formatINR(subtotal)}</td>
        </tr>
        <tr class="quote-total-row" style="background: rgba(255, 215, 0, 0.2); color: #FFFFFF;">
          <td>Grand Total (Incl. 18% GST)</td>
          <td style="text-align: right; font-size: 1.1rem; color: #FFD700;">${formatINR(grandTotal)}</td>
        </tr>
      `;
    }

    const domWaBtn = document.getElementById('domWaBtn');
    if (domWaBtn) {
      const msg = encodeURIComponent(`Hello VINDSOL Team,\n\nI would like an Official Quotation for Domestic Heat Pump (${custName}, ${custCity}):\n- Recommended Model: ${recModel}\n- Daily Usage: ${litres}L/day\n- Total Investment: ${formatINR(grandTotal)} (Incl. 18% GST)\n- Monthly Power Savings: ${formatINR(monthlySavings)}`);
      domWaBtn.href = `https://wa.me/918041231313?text=${msg}`;
    }
  }

  [commVolume, commT1, commT2, commHT, commTariff].forEach(el => {
    if (el) {
      ['input', 'change', 'keyup'].forEach(evt => el.addEventListener(evt, calcCommercial));
    }
  });

  [poolVol, poolType, poolT2, poolT1, poolAmb].forEach(el => {
    if (el) {
      ['input', 'change', 'keyup'].forEach(evt => el.addEventListener(evt, calcPool));
    }
  });

  const domPeople = document.getElementById('calcPeople');
  const domLitres = document.getElementById('calcLitres');
  const domHeater = document.getElementById('calcHeaterType');
  const domTariff = document.getElementById('calcTariff');

  if (domPeople && domLitres) {
    domPeople.addEventListener('input', () => {
      domLitres.value = Math.max(100, parseFloat(domPeople.value || 4) * 50);
      calcDomestic();
    });
  }

  [domPeople, domLitres, domHeater, domTariff].forEach(el => {
    if (el) {
      ['input', 'change', 'keyup'].forEach(evt => el.addEventListener(evt, calcDomestic));
    }
  });

  calcCommercial();
  calcPool();
  calcDomestic();
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

/* -------------------------------------------------------------------------- */
/* 6. Global In-Page Product Quick-View Spec Modal (No Page Reload Needed)   */
/* -------------------------------------------------------------------------- */
const VINDSOL_PRODUCT_CATALOG = {
  'dhw': {
    title: 'All-in-One Domestic Hot Water Heat Pump',
    category: 'AIR SOURCE &bull; RESIDENTIAL MONOBLOCK',
    price: '₹ 45,000 - ₹ 85,000',
    img: 'assets/images/products/dhw-monoblock.jpg',
    reviews: '4.9 (142 Verified Factory Reviews)',
    highlights: [
      'Tank Capacity: 150L to 1000L Storage',
      'Saginomya Electronic Expansion Valve for low ambient stability',
      'Ultra-Quiet Operation (<48 dBA) with silent rotary compressor',
      'Up to 75% Lower Operational Electricity Cost'
    ],
    specs: [
      { model: 'VDHP 3000 MB', kw: '3.16 kW', cop: '2.92 – 4.21x', tank: '150 Litres', temp: '60°C' },
      { model: 'VDHP 4500 MB', kw: '4.42 kW', cop: '3.38 – 4.70x', tank: '200 Litres', temp: '60°C' },
      { model: 'VDHP 6000 MB', kw: '6.00 kW', cop: '3.90 – 4.92x', tank: '300 Litres', temp: '65°C' },
      { model: 'VDHP 7500 MB', kw: '7.63 kW', cop: '4.29 – 5.25x', tank: '500 Litres', temp: '65°C' },
      { model: 'VDHP 11000 MB', kw: '10.17 kW', cop: '4.90 – 5.83x', tank: '750L / 1000L', temp: '65°C' }
    ]
  },
  'commercial': {
    title: 'V-Type Heavy Duty Commercial Heat Pump',
    category: 'AIR SOURCE &bull; COMMERCIAL MULTI-COMPRESSOR',
    price: '₹ 1,20,000 - ₹ 3,50,000',
    img: 'assets/images/products/vtype-commercial.jpg',
    reviews: '4.9 (98 Verified Commercial Reviews)',
    highlights: [
      'Capacity: 35kW to 150kW Multi-Compressor System',
      'Copeland Scroll Multi-Compressor V-Type Design',
      'COP Rating: 4.25 to 5.2x High Efficiency',
      'Replaces Commercial Diesel Boilers for Hotels & Hospitals'
    ],
    specs: [
      { model: 'VCHP 3500 V', kw: '35 kW', cop: '4.25x', tank: '1000L - 3000L', temp: '60°C' },
      { model: 'VCHP 5000 V', kw: '50 kW', cop: '4.40x', tank: '3000L - 5000L', temp: '60°C' },
      { model: 'VCHP 7500 V', kw: '75 kW', cop: '4.65x', tank: '5000L - 10000L', temp: '60°C' },
      { model: 'VCHP 15000 V', kw: '150 kW', cop: '4.85x', tank: '10000L+', temp: '60°C' }
    ]
  },
  'pool': {
    title: 'Titanium Swimming Pool & Spa Heat Pump',
    category: 'AIR SOURCE &bull; POOLS & SPA',
    price: '₹ 85,000 - ₹ 2,10,000',
    img: 'assets/images/products/swimming-pool-titanium.png',
    reviews: '5.0 (88 Verified Resort Reviews)',
    highlights: [
      '100% Pure Titanium PVC Shell Heat Exchanger',
      'Maintains 28°C Constant Heated Pool Water All Year',
      'Chlorine & Salt Water Anti-Corrosion Warranty',
      'COP Rating: 4.25 to 6.0x Ultra High Efficiency'
    ],
    specs: [
      { model: 'VPHP 1500 Pool', kw: '15 kW', cop: '4.25 – 5.50x', tank: 'Pool 40m³', temp: '28°C - 35°C' },
      { model: 'VPHP 2500 Pool', kw: '25 kW', cop: '4.50 – 5.80x', tank: 'Pool 70m³', temp: '28°C - 35°C' },
      { model: 'VPHP 3500 Pool', kw: '35 kW', cop: '4.75 – 6.00x', tank: 'Pool 110m³', temp: '28°C - 35°C' }
    ]
  },
  'spa': {
    title: 'Spa and Pool Anti-Corrosion Heat Pump',
    category: 'AIR SOURCE &bull; SPA & JACUZZI',
    price: '₹ 95,000 - ₹ 2,40,000',
    img: 'assets/images/products/spa-pool-heater.png',
    reviews: '4.9 (64 Verified Spa Reviews)',
    highlights: [
      'Designed for 40°C High Temp Spa & Jacuzzi Water',
      'Compact Footprint for Resort Patios & Rooftops',
      'Quiet Dual Rotary Compressor Operation',
      'Automated Intelligent Defrost & Water Flow Control'
    ],
    specs: [
      { model: 'VPHP Spa 10k', kw: '10 kW', cop: '4.15x', tank: 'Jacuzzi 15m³', temp: '40°C' },
      { model: 'VPHP Spa 20k', kw: '20 kW', cop: '4.35x', tank: 'Resort Spa 35m³', temp: '40°C' }
    ]
  },
  'high-temp': {
    title: '80°C High Temp Industrial System',
    category: 'AIR SOURCE &bull; INDUSTRIAL EXTREME 80°C',
    price: '₹ 1,80,000 - ₹ 4,20,000',
    img: 'assets/images/products/high-temp-industrial.jpg',
    reviews: '4.9 (64 Industrial Reviews)',
    highlights: [
      'Extreme High Temp Output: Up to 80°C Water',
      'Replaces Industrial Diesel & Heavy Oil Boilers',
      'Ideal for Dairy, Textile, Chemical & Sterilization Wash',
      'R134a EVI Dual Injection Compressor Circuit'
    ],
    specs: [
      { model: 'VIHP 2500 HT', kw: '25 kW', cop: '3.85x', tank: 'Process 1000L', temp: '80°C' },
      { model: 'VIHP 5000 HT', kw: '50 kW', cop: '4.10x', tank: 'Process 3000L', temp: '80°C' }
    ]
  },
  'thermo-allinone': {
    title: 'All-in-One Thermodynamic Solar Heat Pump',
    category: 'THERMODYNAMIC &bull; RESIDENTIAL SOLAR',
    price: '₹ 65,000 - ₹ 1,15,000',
    img: 'assets/images/products/thermo-allinone-solar.jpg',
    reviews: '4.8 (110 Solar Reviews)',
    highlights: [
      'Dual Solar Panel + Ambient Air Heat Source Integration',
      'Heats Water Day & Night in Rain, Wind, or Sunshine',
      'Lightweight Aluminum Solar Collector Panel',
      'COP up to 5.50x Ultra High Energy Efficiency'
    ],
    specs: [
      { model: 'VTSP 200L Solar', kw: '3.80 kW', cop: '5.20x', tank: '200 Litres', temp: '65°C' },
      { model: 'VTSP 300L Solar', kw: '5.20 kW', cop: '5.50x', tank: '300 Litres', temp: '65°C' }
    ]
  },
  'storage-tanks': {
    title: 'Quartz Blue Glass Lined Storage Tank',
    category: 'STORAGE &bull; GLASS LINED TANKS',
    price: '₹ 25,000 - ₹ 65,000',
    img: 'assets/images/products/quartz-glass-tank.png',
    reviews: '4.9 (78 Tank Reviews)',
    highlights: [
      'German Glass Enamel Internal Lining',
      '50mm High-Density PUF Thermal Insulation Layer',
      'Resists Hard Water Corrosion & Mineral Scaling',
      'Pressurized Storage Capacity: 200L to 1000L'
    ],
    specs: [
      { model: 'VQBT 200L', kw: 'Storage Tank', cop: '50mm PUF', tank: '200 Litres', temp: '90°C' },
      { model: 'VQBT 300L', kw: 'Storage Tank', cop: '50mm PUF', tank: '300 Litres', temp: '90°C' },
      { model: 'VQBT 500L', kw: 'Storage Tank', cop: '50mm PUF', tank: '500 Litres', temp: '90°C' },
      { model: 'VQBT 1000L', kw: 'Storage Tank', cop: '50mm PUF', tank: '1000 Litres', temp: '90°C' }
    ]
  },
  'vacuum-valve': {
    title: 'Vacuum Relief Valve (Safety Accessory)',
    category: 'SAFETY &bull; VACUUM PROTECTION',
    price: '₹ 4,500 - ₹ 8,500',
    img: 'assets/images/products/vacuum-relief-valve.png',
    reviews: '4.9 (62 Valve Reviews)',
    highlights: [
      'Prevents Internal Vacuum Collapse in Storage Tanks',
      'High Temp Resistant SS304 / Brass Body Construction',
      'Automatic Air Inlet & Hydraulic Pressure Balance',
      'Rated Operating Pressure: Up to 7 Bar'
    ],
    specs: [
      { model: 'VRV-15 (1/2")', kw: 'Safety Valve', cop: '7 Bar Max', tank: 'All Tanks', temp: '110°C' },
      { model: 'VRV-20 (3/4")', kw: 'Safety Valve', cop: '7 Bar Max', tank: 'Commercial Tanks', temp: '110°C' }
    ]
  },
  'tp-valve': {
    title: 'Temperature & Pressure Relief Valve (T&P Valve)',
    category: 'SAFETY &bull; T&P RELIEF VALVES',
    price: '₹ 6,500 - ₹ 12,500',
    img: 'assets/images/products/tp-relief-valve.png',
    reviews: '4.8 (110 Valve Reviews)',
    highlights: [
      'Dual Protection: Discharges at 99°C or 7 Bar Pressure',
      'Heavy-Duty Bronze Body with Stainless Steel Spring',
      'Essential Safety Valve for Hot Water Vessels',
      'ASME & ISO Factory Certified'
    ],
    specs: [
      { model: 'TPRV-20 (3/4")', kw: 'T&P Relief Valve', cop: '99°C / 7 Bar', tank: '200L - 500L', temp: '99°C' },
      { model: 'TPRV-25 (1")', kw: 'T&P Relief Valve', cop: '99°C / 7 Bar', tank: '1000L+', temp: '99°C' }
    ]
  }
};

function initProductQuickViewModal() {
  // Inject Quick View Modal HTML if not present
  if (!document.getElementById('productQuickViewModal')) {
    const modalHTML = `
      <div class="product-detail-modal-overlay" id="productQuickViewModal">
        <div class="product-detail-modal-card" style="max-width: 840px;">
          <button class="modal-close-btn" id="closeQuickViewModalBtn">&times;</button>
          
          <div style="display: grid; grid-template-columns: 1fr 1.1fr; gap: 2rem; align-items: start;">
            
            <div style="background: #F8FAF8; border: 1px solid var(--border-soft); border-radius: 16px; padding: 1.5rem; text-align: center;">
              <img id="qvModalImg" src="assets/images/products/dhw-monoblock.jpg" alt="Product Image" style="max-height: 280px; width: auto; margin: 0 auto; object-fit: contain;">
            </div>

            <div>
              <span class="grand-product-tag" id="qvModalCategory">AIR SOURCE &bull; DOMESTIC RANGE</span>
              <h2 style="font-size: 1.5rem; font-weight: 900; color: var(--color-primary); margin: 0.25rem 0 0.5rem 0;" id="qvModalTitle">Product Title</h2>
              
              <div class="product-rating-stars" style="margin-bottom: 0.75rem;">
                ★★★★★ <span id="qvModalReviews">4.9 (142 Verified Reviews)</span>
              </div>

              <div class="amazon-price-tag" style="margin: 0.5rem 0 1rem 0;">
                <span id="qvModalPrice">₹ 45,000 - ₹ 85,000</span>
              </div>

              <div style="font-size: 0.82rem; font-weight: 800; color: #10B981; margin-bottom: 0.75rem;">
                ✓ IN STOCK &bull; DIRECT DISPATCH FROM BENGALURU FACTORY
              </div>

              <ul class="product-specs-mini-list" id="qvModalHighlights" style="margin-bottom: 1.25rem;">
                <!-- Populated dynamically -->
              </ul>

              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button id="qvModalQuoteBtn" class="btn-amazon-primary" style="flex: 1;">
                  📋 Request Official Quotation
                </button>
                <a href="tel:+918041231313" class="btn-amazon-secondary" style="flex: 1;">
                  📞 Call Factory
                </a>
              </div>
            </div>

          </div>

          <!-- Spec Table Section -->
          <div style="margin-top: 2rem; border-top: 1.5px solid var(--border-soft); padding-top: 1.5rem;">
            <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--color-primary); margin-bottom: 1rem;">Technical Specifications &amp; Model Lineup</h4>
            <div style="overflow-x: auto;">
              <table class="spec-table" style="width: 100%; border-collapse: collapse; font-size: 0.84rem;">
                <thead>
                  <tr style="background: #F1F5F9; text-align: left;">
                    <th style="padding: 0.6rem 0.8rem;">Model Variant</th>
                    <th style="padding: 0.6rem 0.8rem;">Heating Capacity</th>
                    <th style="padding: 0.6rem 0.8rem;">COP Efficiency</th>
                    <th style="padding: 0.6rem 0.8rem;">Storage / Pool Size</th>
                    <th style="padding: 0.6rem 0.8rem;">Max Temp</th>
                  </tr>
                </thead>
                <tbody id="qvModalSpecBody">
                  <!-- Populated dynamically -->
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const modal = document.getElementById('productQuickViewModal');
  const closeBtn = document.getElementById('closeQuickViewModalBtn');

  function openQuickView(prodId) {
    const data = VINDSOL_PRODUCT_CATALOG[prodId] || VINDSOL_PRODUCT_CATALOG['dhw'];
    
    document.getElementById('qvModalTitle').textContent = data.title;
    document.getElementById('qvModalCategory').innerHTML = data.category;
    document.getElementById('qvModalPrice').textContent = data.price;
    document.getElementById('qvModalImg').src = data.img;
    document.getElementById('qvModalReviews').textContent = data.reviews;

    // Highlights
    const hlEl = document.getElementById('qvModalHighlights');
    hlEl.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');

    // Spec Table
    const specBody = document.getElementById('qvModalSpecBody');
    specBody.innerHTML = data.specs.map(s => `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 0.6rem 0.8rem; font-weight: 800; color: var(--color-primary);">${s.model}</td>
        <td style="padding: 0.6rem 0.8rem;">${s.kw}</td>
        <td style="padding: 0.6rem 0.8rem; color: #10B981; font-weight: 700;">${s.cop}</td>
        <td style="padding: 0.6rem 0.8rem;">${s.tank}</td>
        <td style="padding: 0.6rem 0.8rem;">${s.temp}</td>
      </tr>
    `).join('');

    // Setup Quote Button to open Calculator Modal
    const quoteBtn = document.getElementById('qvModalQuoteBtn');
    if (quoteBtn) {
      quoteBtn.onclick = () => {
        modal.classList.remove('active');
        const calcOverlay = document.getElementById('calcModalOverlay');
        if (calcOverlay) calcOverlay.classList.add('active');
      };
    }

    modal.classList.add('active');
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Bind click listener on all "View Product Details", "View Details & Specs", and Mega Menu links
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-amazon-primary, [data-open-qv]');
    if (btn) {
      const href = btn.getAttribute('href') || '';
      if (href.includes('product-detail.html?id=')) {
        e.preventDefault();
        const id = href.split('id=')[1];
        openQuickView(id);
      }
    }
  });
}
