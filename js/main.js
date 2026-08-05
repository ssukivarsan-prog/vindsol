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
