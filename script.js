/* ══════════════════════════════════════════════════════
   GINEVRA MARGAGLIA — script.js
══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── CUSTOM CURSOR ──────────────────────────────────
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let mouseX = -100, mouseY = -100;
  let curX = -100, curY = -100;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // ── NAVIGATION ─────────────────────────────────────
  const nav         = document.getElementById('nav');
  const navLinks    = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const ctaBtn      = document.querySelector('.cta-btn');
  const navBurger   = document.getElementById('navBurger');
  const mobileMenu  = document.getElementById('mobileMenu');

  let currentSection = 'home';

  function showSection(id) {
    const all = document.querySelectorAll('.page');
    all.forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });

    const target = document.getElementById(id);
    if (!target) return;

    target.style.display = 'flex';
    // Force reflow
    target.offsetHeight;
    target.classList.add('active');

    currentSection = id;

    // Update nav link states
    navLinks.forEach(l => {
      l.classList.toggle('active', l.dataset.section === id);
    });

    // Close mobile menu
    mobileMenu.classList.remove('open');
    navBurger.classList.remove('open');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger reveal animations after transition
    setTimeout(() => triggerReveals(target), 200);
  }

  // Attach nav link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });

  // CTA button
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => showSection(ctaBtn.dataset.section));
  }

  // Burger toggle
  navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // ── NAV SCROLL EFFECT ──────────────────────────────
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  // ── REVEAL ON SCROLL ───────────────────────────────
  function triggerReveals(container) {
    const els = container.querySelectorAll('.reveal-up, .reveal-right');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));

    // Immediately trigger anything already in view
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.add('visible');
      }
    });
  }

  // ── INIT ───────────────────────────────────────────
  // Show home on load
  showSection('home');

  // Handle hash
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    setTimeout(() => showSection(hash), 100);
  }

  // ── SUBTLE PARALLAX ON HOME ────────────────────────
  const homeSection = document.getElementById('home');
  window.addEventListener('scroll', () => {
    if (currentSection !== 'home') return;
    const offset = window.scrollY;
    const bgText = homeSection.querySelector('.home-bg-text');
    if (bgText) bgText.style.transform = `translateY(${offset * 0.3}px)`;
  }, { passive: true });

  // ── HOVER LIFT on project cards ────────────────────
  document.querySelectorAll('.project-card:not(.project-card-coming)').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
      card.style.transition = 'transform 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // ── STAGGER home reveals immediately ───────────────
  setTimeout(() => {
    document.querySelectorAll('#home .reveal-up, #home .reveal-right').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);

})();
