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
/* ═══════════════════════════════════════════════════
CUSTOM CURSOR
═══════════════════════════════════════════════════ */

if (cursor && cursorDot) {

```
document.addEventListener('mousemove', function (event) {

  mouseX = event.clientX;
  mouseY = event.clientY;

  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';

});


function animateCursor() {

  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;

  cursor.style.left = curX + 'px';
  cursor.style.top = curY + 'px';

  requestAnimationFrame(animateCursor);

}

animateCursor();


document
  .querySelectorAll('a, button, .project-card, .interactive-image')
  .forEach(function (element) {

    element.addEventListener('mouseenter', function () {

      cursor.classList.add('cursor-large');

    });

    element.addEventListener('mouseleave', function () {

      cursor.classList.remove('cursor-large');
      cursor.classList.remove('cursor-image');

    });

  });


document
  .querySelectorAll('.interactive-image')
  .forEach(function (element) {

    element.addEventListener('mouseenter', function () {

      cursor.classList.remove('cursor-large');
      cursor.classList.add('cursor-image');

    });

  });
```

}

/* ═══════════════════════════════════════════════════
NAVIGATION
═══════════════════════════════════════════════════ */

function showSection(id) {

```
const allPages = document.querySelectorAll('.page');

allPages.forEach(function (page) {

  page.classList.remove('active');

  page.style.display = 'none';

});


const target = document.getElementById(id);

if (!target) return;


target.style.display = 'flex';

/*
  Force browser reflow so the page transition
  always runs cleanly.
*/

target.offsetHeight;

target.classList.add('active');

currentSection = id;


navLinks.forEach(function (link) {

  link.classList.toggle(
    'active',
    link.dataset.section === id
  );

});


mobileMenu.classList.remove('open');
navBurger.classList.remove('open');

document.body.classList.remove('no-scroll');


window.scrollTo({
  top: 0,
  behavior: 'smooth'
});


setTimeout(function () {

  triggerReveals(target);

}, 180);
```

}

navLinks.forEach(function (link) {

```
link.addEventListener('click', function (event) {

  event.preventDefault();

  showSection(link.dataset.section);

});
```

});

mobileLinks.forEach(function (link) {

```
link.addEventListener('click', function (event) {

  event.preventDefault();

  showSection(link.dataset.section);

});
```

});

const navLogo = document.querySelector('.nav-logo');

if (navLogo) {

```
navLogo.addEventListener('click', function (event) {

  event.preventDefault();

  showSection('home');

});
```

}

/*
Buttons that navigate between sections.
*/

document
.querySelectorAll('[data-section]')
.forEach(function (element) {

```
  if (
    element.classList.contains('nav-link') ||
    element.classList.contains('mobile-link') ||
    element.classList.contains('nav-logo')
  ) return;


  element.addEventListener('click', function () {

    showSection(element.dataset.section);

  });

});
```

/* ═══════════════════════════════════════════════════
BURGER
═══════════════════════════════════════════════════ */

if (navBurger) {

```
navBurger.addEventListener('click', function () {

  navBurger.classList.toggle('open');

  mobileMenu.classList.toggle('open');

  document.body.classList.toggle(
    'no-scroll',
    mobileMenu.classList.contains('open')
  );

});
```

}

/* ═══════════════════════════════════════════════════
NAV SCROLL EFFECT
═══════════════════════════════════════════════════ */

window.addEventListener(
'scroll',
function () {

```
  nav.classList.toggle(
    'scrolled',
    window.scrollY > 30
  );

},
{ passive: true }
```

);

/* ═══════════════════════════════════════════════════
REVEAL ANIMATIONS
═══════════════════════════════════════════════════ */

function triggerReveals(container) {

```
const elements = container.querySelectorAll(
  '.reveal-up, .reveal-right'
);

if (!elements.length) return;


const observer = new IntersectionObserver(
  function (entries) {

    entries.forEach(function (entry) {

      if (entry.isIntersecting) {

        entry.target.classList.add('visible');

        observer.unobserve(entry.target);

      }

    });

  },
  {
    threshold: 0.06,
    rootMargin: '0px 0px -35px 0px'
  }
);


elements.forEach(function (element) {

  observer.observe(element);

});


/*
  Trigger elements already visible.
*/

elements.forEach(function (element) {

  const rect = element.getBoundingClientRect();

  if (rect.top < window.innerHeight * 0.94) {

    element.classList.add('visible');

  }

});
```

}

/* ═══════════════════════════════════════════════════
HOME PARALLAX
═══════════════════════════════════════════════════ */

const homeSection = document.getElementById('home');

window.addEventListener(
'scroll',
function () {

```
  if (currentSection !== 'home') return;

  const offset = window.scrollY;

  const bgText = homeSection
    ? homeSection.querySelector('.home-bg-text')
    : null;

  if (bgText) {

    bgText.style.transform =
      `translateY(${offset * 0.3}px)`;

  }

},
{ passive: true }
```

);

/* ═══════════════════════════════════════════════════
INTERACTIVE IMAGE PARALLAX
═══════════════════════════════════════════════════ */

const interactiveImages =
document.querySelectorAll('.interactive-image');

interactiveImages.forEach(function (container) {

```
const image = container.querySelector('img');

if (!image) return;


container.addEventListener(
  'mousemove',
  function (event) {

    /*
      Disable stronger parallax on small screens.
    */

    if (window.innerWidth <= 768) return;


    const rect = container.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) / rect.width - 0.5;

    const y =
      (event.clientY - rect.top) / rect.height - 0.5;


    const moveX = x * 14;
    const moveY = y * 14;


    image.style.transform =
      `scale(1.045) translate(${moveX}px, ${moveY}px)`;

  }
);


container.addEventListener(
  'mouseleave',
  function () {

    image.style.transform = '';

  }
);
```

});

/* ═══════════════════════════════════════════════════
LIGHTBOX
═══════════════════════════════════════════════════ */

const galleryImages =
document.querySelectorAll('[data-lightbox]');

galleryImages.forEach(function (imageCard, index) {

```
imageCard.addEventListener('click', function () {

  const source =
    imageCard.dataset.lightbox;

  const caption =
    imageCard.dataset.caption || '';

  lightboxImage.src = source;

  lightboxImage.alt = caption;

  lightboxCaption.textContent = caption;

  lightboxCounter.textContent =
    String(index + 1).padStart(2, '0');


  lightbox.classList.add('open');

  document.body.classList.add('no-scroll');

});
```

});

function closeLightbox() {

```
lightbox.classList.remove('open');

document.body.classList.remove('no-scroll');

setTimeout(function () {

  lightboxImage.src = '';

}, 400);
```

}

if (lightboxClose) {

```
lightboxClose.addEventListener(
  'click',
  closeLightbox
);
```

}

if (lightbox) {

```
lightbox.addEventListener(
  'click',
  function (event) {

    if (event.target === lightbox) {

      closeLightbox();

    }

  }
);
```

}

document.addEventListener(
'keydown',
function (event) {

```
  if (event.key === 'Escape') {

    closeLightbox();

  }

}
```

);

/* ═══════════════════════════════════════════════════
MAGNETIC BUTTONS
═══════════════════════════════════════════════════ */

const magneticElements =
document.querySelectorAll('.magnetic');

magneticElements.forEach(function (element) {

```
element.addEventListener(
  'mousemove',
  function (event) {

    if (window.innerWidth <= 768) return;


    const rect =
      element.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left -
      rect.width / 2;

    const y =
      event.clientY -
      rect.top -
      rect.height / 2;


    element.style.transform =
      `translate(${x * 0.12}px, ${y * 0.12}px)`;

  }
);


element.addEventListener(
  'mouseleave',
  function () {

    element.style.transform = '';

  }
);
```

});

/* ═══════════════════════════════════════════════════
PROJECT CARD TILT
═══════════════════════════════════════════════════ */

const projectCards =
document.querySelectorAll(
'.project-card:not(.project-card-coming)'
);

projectCards.forEach(function (card) {

```
card.addEventListener(
  'mousemove',
  function (event) {

    if (window.innerWidth <= 900) return;


    const rect =
      card.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
      rect.width -
      0.5;

    const y =
      (event.clientY - rect.top) /
      rect.height -
      0.5;


    const rotateX = y * -2;
    const rotateY = x * 2;


    card.style.transform =
      `perspective(900px)
       translateY(-5px)
       rotateX(${rotateX}deg)
       rotateY(${rotateY}deg)`;

  }
);


card.addEventListener(
  'mouseleave',
  function () {

    card.style.transform = '';

  }
);
```

});

/* ═══════════════════════════════════════════════════
CIRCUS BACKGROUND MOVEMENT
═══════════════════════════════════════════════════ */

const circusSection =
document.getElementById('circus');

const circusWord =
document.querySelector('.circus-bg-word');

if (circusSection && circusWord) {

```
circusSection.addEventListener(
  'mousemove',
  function (event) {

    if (window.innerWidth <= 768) return;


    const rect =
      circusSection.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
      rect.width -
      0.5;

    const y =
      (event.clientY - rect.top) /
      rect.height -
      0.5;


    circusWord.style.transform =
      `translate(
        calc(-50% + ${x * 20}px),
        calc(-50% + ${y * 20}px)
      )`;

  }
);


circusSection.addEventListener(
  'mouseleave',
  function () {

    circusWord.style.transform =
      'translate(-50%, -50%)';

  }
);
```

}

/* ═══════════════════════════════════════════════════
INIT
═══════════════════════════════════════════════════ */

showSection('home');

/*
Hash navigation.
Example:
index.html#portfolio
*/

const hash =
window.location.hash.replace('#', '');

if (
hash &&
document.getElementById(hash)
) {

```
setTimeout(
  function () {

    showSection(hash);

  },
  150
);
```

}

/*
Home reveals immediately.
*/

setTimeout(
function () {

```
  document
    .querySelectorAll(
      '#home .reveal-up, #home .reveal-right'
    )
    .forEach(function (element) {

      element.classList.add('visible');

    });

},
120
```

);

})();
