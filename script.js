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

  const projects = [...document.querySelectorAll('.project-card')];
  const projectDialog = document.getElementById('projectDialog');
  let projectIndex = 0;
  let returnFocus;
  document.querySelectorAll('.home-name, .section-title').forEach(heading => {
    const inner = document.createElement('span'); inner.className = 'kinetic-type';
    while (heading.firstChild) inner.append(heading.firstChild);
    heading.append(inner);
  });
  projects.forEach((project, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'project-explore';
    button.innerHTML = '<span>Explore project</span><span aria-hidden="true">↗</span>';
    button.setAttribute('aria-haspopup', 'dialog');
    project.querySelector('.project-card-inner').append(button);
    project.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      returnFocus = button; projectIndex = index; populateProject();
      projectDialog.showModal(); document.body.classList.add('dialog-open');
      projectDialog.querySelector('.dialog-close').focus();
    });
  });
  function populateProject() {
    const project = projects[projectIndex];
    const content = projectDialog.querySelector('.dialog-content');
    content.replaceChildren();
    const title = document.createElement('h2'); title.id = 'dialogTitle';
    title.textContent = project.querySelector('h4').textContent; content.append(title);
    const type = project.querySelector('.project-type').cloneNode(true); content.append(type);
    const description = document.createElement('div'); description.className = 'dialog-description';
    project.querySelectorAll('.project-desc').forEach(p => description.append(p.cloneNode(true)));
    content.append(description);
    const gallery = project.querySelector('.project-gallery');
    if (gallery) {
      const images = gallery.cloneNode(true); images.removeAttribute('tabindex'); content.append(images);
      images.querySelectorAll('img').forEach(image => {
        image.loading = 'eager'; image.addEventListener('contextmenu', e => e.preventDefault());
        image.addEventListener('dragstart', e => e.preventDefault());
      });
      images.addEventListener('contextmenu', e => e.preventDefault());
    }
    const link = project.querySelector('.project-link'); if (link) content.append(link.cloneNode(true));
    projectDialog.scrollTop = 0;
  }
  function closeProject() { projectDialog.close(); }
  projectDialog.querySelector('.dialog-close').addEventListener('click', closeProject);
  projectDialog.addEventListener('click', event => {
    if (event.target !== projectDialog) return;
    const rect = projectDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeProject();
  });
  projectDialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); returnFocus?.focus({ preventScroll: true }); });
  projectDialog.querySelector('.previous-project').addEventListener('click', () => { projectIndex = (projectIndex + projects.length - 1) % projects.length; populateProject(); });
  projectDialog.querySelector('.next-project').addEventListener('click', () => { projectIndex = (projectIndex + 1) % projects.length; populateProject(); });

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
    if (!reducedMotion.matches) {
      document.querySelectorAll('.kinetic-type').forEach(text => {
        const rect = text.parentElement.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > innerHeight) return;
        const proximity = Math.max(0, 1 - Math.abs(rect.top + rect.height / 2 - innerHeight * 0.45) / innerHeight);
        text.style.setProperty('--type-scale', String(0.975 + proximity * 0.05));
      });
    }
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
    if (projectDialog.open) populateProject();
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
