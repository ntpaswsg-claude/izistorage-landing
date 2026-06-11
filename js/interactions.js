/* interactions.js — IZI Storage v2
   Nav scroll, mobile menu, reveal, FAQ, optional fields
*/
(function () {
  'use strict';

  /* --- NAV SCROLL --- */
  const nav = document.getElementById('site-nav');
  const scrollProgress = document.getElementById('scroll-progress');

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    // Progress bar
    if (scrollProgress) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      scrollProgress.style.width = pct + '%';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- MOBILE MENU --- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('nav-mobile');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobileNav.setAttribute('aria-hidden', String(open));
      mobileNav.style.display = open ? 'none' : 'block';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNav.style.display = 'none';
      });
    });
  }

  /* --- SMOOTH SCROLL LINKS --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = nav ? nav.offsetHeight : 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    });
  });

  /* --- REVEAL ON SCROLL (Intersection Observer) --- */
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .stagger-children'
  );

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* --- OPTIONAL FORM FIELDS TOGGLE --- */
  const optBtn = document.getElementById('toggle-optional');
  const optFields = document.getElementById('optional-fields');

  if (optBtn && optFields) {
    optBtn.addEventListener('click', function () {
      const open = optBtn.getAttribute('aria-expanded') === 'true';
      optBtn.setAttribute('aria-expanded', String(!open));
      optFields.setAttribute('aria-hidden', String(open));
      optBtn.textContent = open
        ? '+ Datos adicionales (opcionales)'
        : '− Datos adicionales (opcionales)';
    });
  }

  /* --- NAV HEIGHT CSS VAR --- */
  function setNavHeight() {
    if (nav) {
      document.documentElement.style.setProperty(
        '--nav-height',
        nav.offsetHeight + 'px'
      );
    }
  }
  setNavHeight();
  window.addEventListener('resize', setNavHeight, { passive: true });

}());
