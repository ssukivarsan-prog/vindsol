/**
 * VINDSOL - Main UI Interactions & Business Logic Script
 * Manufacturer: Mechzephyr Engineering Pvt. Ltd, Bengaluru
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initScrollReveals();
  initAnimatedCounters();
  initMouseParallax();
  initScrollSpy();
  initProductTabs();
  initSavingsCalculator();
  initQuoteModal();
});

/* -------------------------------------------------------------------------- */
/* 1. Sticky Header Blur on Scroll                                             */
/* -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* -------------------------------------------------------------------------- */
/* 2. Mobile Drawer Menu Toggle                                               */
/* -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('mobile-open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close when clicking nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 3. Intersection Observer Scroll Reveals & Staggered Elements               */
/* -------------------------------------------------------------------------- */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-on-scroll, .stagger-child');
  if (!revealElements.length) return;

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------------------- */
/* 3.1 Animated Number Counters (Count-up from 0 to Target)                  */
/* -------------------------------------------------------------------------- */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.stat-number, [data-count]');
  if (!counterElements.length) return;

  const animateCounter = (el) => {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';

    const rawValue = el.getAttribute('data-count') || el.textContent.trim();
    const numericTarget = parseFloat(rawValue.replace(/[^0-9.]/g, ''));
    if (isNaN(numericTarget)) return;

    const prefix = rawValue.match(/^[^\d]+/)?.[0] || '';
    const suffix = rawValue.match(/[^\d.]+$/)?.[0] || '';
    const isDecimal = rawValue.includes('.');

    const duration = 1200; // ms
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic easing formula: 1 - Math.pow(1 - progress, 3)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = numericTarget * easedProgress;

      const formattedValue = isDecimal ? currentValue.toFixed(1) : Math.floor(currentValue);
      el.textContent = `${prefix}${formattedValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = rawValue; // Ensure exact target string at completion
      }
    }

    requestAnimationFrame(step);
  };

  const observerOptions = { threshold: 0.25 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counterElements.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------------------- */
/* 3.2 Mouse Parallax Effect for Hero Ambient Visual                         */
/* -------------------------------------------------------------------------- */
function initMouseParallax() {
  const ambientVisuals = document.querySelectorAll('.ambient-visual, .hero-interactive-visual');
  if (!ambientVisuals.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const moveX = (clientX - centerX) / 45; // Max ~15px shift
    const moveY = (clientY - centerY) / 45;

    ambientVisuals.forEach(visual => {
      visual.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  }, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* 3.3 Active Section ScrollSpy                                               */
/* -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}` || link.getAttribute('href').endsWith(`#${currentId}`)) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* 4. Product Category Filter Tabs                                             */
/* -------------------------------------------------------------------------- */
function initProductTabs() {
  const tabBtns = document.querySelectorAll('.filter-tabs .tab-btn');
  const productCards = document.querySelectorAll('.product-card');
  if (!tabBtns.length || !productCards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 5. Interactive Energy Savings & Cost Calculator                           */
/* -------------------------------------------------------------------------- */
function initSavingsCalculator() {
  const litresInput = document.getElementById('calcLitres');
  const tariffInput = document.getElementById('calcTariff');
  const deltaInput = document.getElementById('calcDelta');

  const geyserCostEl = document.getElementById('geyserCost');
  const vindsolCostEl = document.getElementById('vindsolCost');
  const savingsAmtEl = document.getElementById('savingsAmount');
  const barGeyser = document.getElementById('barGeyser');
  const barVindsol = document.getElementById('barVindsol');

  if (!litresInput || !tariffInput) return;

  function calculate() {
    const litres = parseFloat(litresInput.value) || 500;
    const tariff = parseFloat(tariffInput.value) || 8.5; // Rs / kWh
    const deltaT = parseFloat(deltaInput ? deltaInput.value : 40) || 40; // °C temp rise (e.g. 15°C to 55°C)

    // Heat energy formula: Q (kWh) = (Litres * 4.186 * deltaT) / 3600
    const dailyKWhRequired = (litres * 4.186 * deltaT) / 3600;

    // Conventional Electric Resistance Geyser efficiency ~ 90% (COP 0.9)
    const geyserDailyKWh = dailyKWhRequired / 0.9;
    const geyserAnnualCost = geyserDailyKWh * 365 * tariff;

    // VINDSOL Air-Source Heat Pump COP ~ 4.25 (Average across operating spectrum)
    const vindsolDailyKWh = dailyKWhRequired / 4.25;
    const vindsolAnnualCost = vindsolDailyKWh * 365 * tariff;

    const annualSavings = geyserAnnualCost - vindsolAnnualCost;

    // Format currency to Indian Rupees
    const formatINR = (val) => '₹' + Math.round(val).toLocaleString('en-IN');

    if (geyserCostEl) geyserCostEl.textContent = formatINR(geyserAnnualCost);
    if (vindsolCostEl) vindsolCostEl.textContent = formatINR(vindsolAnnualCost);
    if (savingsAmtEl) savingsAmtEl.textContent = formatINR(annualSavings);

    // Update comparative bar widths
    if (barGeyser) barGeyser.style.width = '100%';
    if (barVindsol) {
      const pct = Math.max(12, (vindsolAnnualCost / geyserAnnualCost) * 100);
      barVindsol.style.width = `${pct}%`;
    }
  }

  [litresInput, tariffInput, deltaInput].forEach(el => {
    if (el) el.addEventListener('input', calculate);
  });

  calculate();
}

/* -------------------------------------------------------------------------- */
/* 6. Quote / Consultation Modal Form with Client Validation                  */
/* -------------------------------------------------------------------------- */
function initQuoteModal() {
  const modal = document.getElementById('quoteModal');
  const openBtns = document.querySelectorAll('.open-quote-modal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const form = document.getElementById('quoteForm');
  const segmentSelect = document.getElementById('modalSegment');
  const successMsg = document.getElementById('modalSuccessMsg');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const category = btn.getAttribute('data-product-category');
      if (category && segmentSelect) {
        segmentSelect.value = category;
      }
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  // Client-side Form Validation
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const name = form.querySelector('[name="name"]');
      const email = form.querySelector('[name="email"]');
      const phone = form.querySelector('[name="phone"]');
      const message = form.querySelector('[name="message"]');

      // Clear previous error styles
      form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
        input.style.borderColor = 'var(--border-bright)';
      });

      if (!name || name.value.trim().length < 2) {
        if (name) name.style.borderColor = '#ef4444';
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.value.trim())) {
        if (email) email.style.borderColor = '#ef4444';
        isValid = false;
      }

      const phoneRegex = /^[6-9]\d{9}$/; // Indian 10-digit mobile number format
      if (!phone || !phoneRegex.test(phone.value.trim())) {
        if (phone) phone.style.borderColor = '#ef4444';
        isValid = false;
      }

      if (isValid) {
        form.style.display = 'none';
        if (successMsg) {
          successMsg.style.display = 'block';
        }
        setTimeout(() => {
          modal.classList.remove('active');
          form.reset();
          form.style.display = 'flex';
          if (successMsg) successMsg.style.display = 'none';
        }, 4000);
      }
    });
  }
}
