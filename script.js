/* Ginevra Margaglia — continuous, bilingual portfolio. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  const nav = document.getElementById('nav');
  const navBurger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const languageToggle = document.getElementById('languageToggle');
  const sections = [...document.querySelectorAll('.page')];
  const links = [...document.querySelectorAll('.nav-link, .mobile-link')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const italian = window.PORTFOLIO_ITALIAN;
  const normalize = value => value.replace(/\s+/g, ' ').trim();

  // Accessible, compact image galleries; arrows and keyboard both scroll one slide.
  document.querySelectorAll('.project-gallery').forEach(gallery => {
    gallery.tabIndex = 0;
    const slides = [...gallery.querySelectorAll('.gallery-slide')];
    const controls = document.createElement('div');
    controls.className = 'gallery-controls';
    const previous = document.createElement('button');
    previous.type = 'button'; previous.textContent = '←'; previous.setAttribute('aria-label', 'Previous image');
    const next = document.createElement('button');
    next.type = 'button'; next.textContent = '→'; next.setAttribute('aria-label', 'Next image');
    const count = document.createElement('span'); count.className = 'gallery-count';
    controls.append(previous, count, next); gallery.after(controls);
    const index = () => Math.max(0, Math.min(slides.length - 1, Math.round(gallery.scrollLeft / gallery.clientWidth)));
    const update = () => {
      const current = index(); count.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      previous.disabled = current === 0; next.disabled = current === slides.length - 1;
    };
    const move = step => gallery.scrollTo({ left: Math.max(0, Math.min(slides.length - 1, index() + step)) * gallery.clientWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    previous.addEventListener('click', () => move(-1)); next.addEventListener('click', () => move(1));
    gallery.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
      }
    });
    gallery.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', () => { gallery.scrollTo({ left: 0, behavior: 'instant' }); update(); });
    update();
  });
  // Discourage casual saving only on images, leaving text and links usable.
  document.querySelectorAll('img').forEach(image => {
    image.draggable = false;
    image.addEventListener('contextmenu', event => event.preventDefault());
    image.addEventListener('dragstart', event => event.preventDefault());
  });
  document.querySelectorAll('.protected-photo').forEach(photo => {
    photo.addEventListener('contextmenu', event => event.preventDefault());
  });

  // Cache original text nodes, retaining inline emphasis and all image/link elements.
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.parentElement.closest('script, style, #languageToggle')
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  const copy = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const key = normalize(node.nodeValue);
    if (Object.hasOwn(italian, key)) copy.push({ node, original: node.nodeValue, translated: italian[key] });
  }
  const attributes = [];
  document.querySelectorAll('[alt], [aria-label]').forEach(element => {
    ['alt', 'aria-label'].forEach(name => {
      const original = element.getAttribute(name);
      if (Object.hasOwn(italian, original)) attributes.push({ element, name, original, translated: italian[original] });
    });
  });

  function sectionAtScroll() {
    const marker = nav.offsetHeight + window.innerHeight * 0.2;
    return [...sections].reverse().find(section => section.getBoundingClientRect().top <= marker) || sections[0];
  }
  function updateNavigation() {
    nav.classList.toggle('scrolled', window.scrollY > 30);
    const length = document.documentElement.scrollHeight - window.innerHeight;
    document.querySelector('.reading-progress').style.transform = 'scaleX(' + (length > 0 ? window.scrollY / length : 0) + ')';
    const current = sectionAtScroll();
    links.forEach(link => {
      const active = link.dataset.section === current.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  let language = 'en';
  function setLanguage(next, remember = true) {
    const current = sectionAtScroll();
    const offset = window.scrollY - current.offsetTop;
    language = next;
    copy.forEach(({ node, original, translated }) => {
      node.nodeValue = next === 'it'
        ? original.match(/^\s*/)[0] + translated + original.match(/\s*$/)[0]
        : original;
    });
    attributes.forEach(({ element, name, original, translated }) => element.setAttribute(name, next === 'it' ? translated : original));
    document.documentElement.lang = next;
    languageToggle.textContent = next === 'it' ? 'English' : 'Italiano';
    languageToggle.lang = next === 'it' ? 'en' : 'it';
    languageToggle.setAttribute('aria-label', next === 'it' ? 'Read the portfolio in English' : 'Read the portfolio in Italian');
    if (remember) {
      try { localStorage.setItem('portfolio-language', next); } catch { /* Storage may be unavailable. */ }
      const url = new URL(window.location.href);
      url.searchParams.set('lang', next);
      history.replaceState(null, '', url);
      window.scrollTo({ top: current.offsetTop + offset, behavior: 'instant' });
    }
    updateNavigation();
  }
  let savedLanguage;
  try { savedLanguage = localStorage.getItem('portfolio-language'); } catch { /* Default to English. */ }
  const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
  setLanguage((requestedLanguage || savedLanguage) === 'it' ? 'it' : 'en', false);
  languageToggle.addEventListener('click', () => setLanguage(language === 'en' ? 'it' : 'en'));

  function setMenu(open) {
    mobileMenu.classList.toggle('open', open);
    mobileMenu.inert = !open;
    navBurger.classList.toggle('open', open);
    navBurger.setAttribute('aria-expanded', String(open));
  }
  navBurger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
      setMenu(false);
      navBurger.focus();
    }
  });
  links.forEach(link => link.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      setMenu(false);
      const heading = document.querySelector('#' + link.dataset.section + ' h1, #' + link.dataset.section + ' h2');
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) setMenu(false);
    updateNavigation();
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01 });
  document.querySelectorAll('.reveal-up, .reveal-right').forEach(element => revealObserver.observe(element));

  let scrollPending = false;
  window.addEventListener('scroll', () => {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(() => { updateNavigation(); scrollPending = false; });
    }
  }, { passive: true });
  window.addEventListener('hashchange', updateNavigation);
  updateNavigation();

})();
