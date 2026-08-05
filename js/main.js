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
});

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
/* 3. Interactive Energy Savings & ROI Calculator                             */
/* -------------------------------------------------------------------------- */
function initSavingsCalculator() {
  const peopleInput = document.getElementById('calcPeople');
  const heaterSelect = document.getElementById('calcHeaterType');
  const litresInput = document.getElementById('calcLitres');
  const tariffInput = document.getElementById('calcTariff');
  const submitBtn = document.getElementById('calcModalApplyBtn');

  const monthlySavingsEl = document.getElementById('monthlySavingsVal');
  const yearlySavingsEl = document.getElementById('yearlySavingsVal');
  const co2El = document.getElementById('co2ReductionVal');
  const paybackEl = document.getElementById('paybackPeriodVal');

  if (!litresInput || !tariffInput) return;

  function calculate() {
    const people = parseFloat(peopleInput ? peopleInput.value : 4) || 4;
    const litres = parseFloat(litresInput.value) || (people * 50);
    const tariff = parseFloat(tariffInput.value) || 8.00; // Rs / kWh
    const heaterType = heaterSelect ? heaterSelect.value : 'geyser';

    // Temp rise: 15°C ambient air to 55°C water = 40°C rise
    const deltaT = 40;

    // Daily Thermal Energy needed Q (kWh) = (Litres * 4.186 * 40) / 3600
    const dailyKWhRequired = (litres * 4.186 * deltaT) / 3600;

    // Conventional Efficiency COP
    let conventionalCOP = 0.9; // Electric Geyser
    if (heaterType === 'boiler') conventionalCOP = 0.7;
    if (heaterType === 'solar') conventionalCOP = 1.5;

    const geyserDailyKWh = dailyKWhRequired / conventionalCOP;
    const geyserAnnualCost = geyserDailyKWh * 365 * tariff;

    // VINDSOL Air-Source Heat Pump COP ~ 4.25
    const vindsolDailyKWh = dailyKWhRequired / 4.25;
    const vindsolAnnualCost = vindsolDailyKWh * 365 * tariff;

    const yearlySavings = Math.max(0, geyserAnnualCost - vindsolAnnualCost);
    const monthlySavings = yearlySavings / 12;

    // CO2 reduction: ~0.82 kg CO2 per kWh saved in India grid
    const kwhSavedPerYear = (geyserDailyKWh - vindsolDailyKWh) * 365;
    const co2Tonnes = (kwhSavedPerYear * 0.82) / 1000;

    // Estimated Payback (Average heat pump system cost ~ Rs 75,000 for residential)
    const estPrice = litres > 1000 ? 220000 : 78000;
    const paybackYears = Math.max(1.2, (estPrice / yearlySavings)).toFixed(1);

    // Format currency to Indian Rupees
    const formatINR = (val) => '₹ ' + Math.round(val).toLocaleString('en-IN');

    if (monthlySavingsEl) monthlySavingsEl.textContent = formatINR(monthlySavings);
    if (yearlySavingsEl) yearlySavingsEl.textContent = formatINR(yearlySavings);
    if (co2El) co2El.textContent = `${co2Tonnes.toFixed(1)} Tonnes`;
    if (paybackEl) paybackEl.textContent = `${paybackYears} Years`;
  }

  [peopleInput, heaterSelect, litresInput, tariffInput].forEach(el => {
    if (el) {
      el.addEventListener('input', calculate);
      el.addEventListener('change', calculate);
    }
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calculate();
      const overlay = document.getElementById('calcModalOverlay');
      if (overlay) overlay.classList.remove('active');
    });
  }

  calculate();
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
