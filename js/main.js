/* ==========================================================================
   MEGASUFIT — Core JS
   Mobile nav, popup modal (shared across all CTAs), scroll reveal.
   Block-specific JS (calculator, cases carousel, gallery, faq accordion,
   testimonials) lives in separate files loaded alongside this one.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Header: sticky shadow + mobile nav ---------- */
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-locked', isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-locked');
      });
    });
  }

  /* ---------- Popup modal (lead form) ----------
     Any element with [data-open-modal] opens the shared popup.
     Optional data-modal-title / data-modal-context to customise copy. */
  const modal = document.querySelector('#lead-modal');
  const modalTitle = modal ? modal.querySelector('[data-modal-title]') : null;
  const modalContextInput = modal ? modal.querySelector('[data-modal-context]') : null;
  let lastFocusedEl = null;

  function openModal(trigger) {
    if (!modal) return;
    lastFocusedEl = trigger || document.activeElement;

    const title = trigger?.dataset.modalTitle;
    const context = trigger?.dataset.modalContext;

    if (modalTitle) {
      modalTitle.textContent = title || modalTitle.dataset.default || modalTitle.textContent;
    }
    if (modalContextInput) {
      modalContextInput.value = context || '';
    }

    modal.classList.add('is-open');
    document.body.classList.add('nav-locked');
    modal.setAttribute('aria-hidden', 'false');

    const firstField = modal.querySelector('input, textarea, select');
    if (firstField) firstField.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('nav-locked');
    modal.setAttribute('aria-hidden', 'true');
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open-modal]');
    if (opener) {
      e.preventDefault();
      openModal(opener);
      return;
    }
    if (modal && (e.target.closest('[data-close-modal]') || e.target === modal)) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) {
      closeModal();
    }
  });

  const leadForm = document.querySelector('#lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = leadForm.querySelector('[data-form-status]');
      // Netlify Forms handles actual submission via form action/attributes.
      // This is a lightweight UX confirmation for the demo build.
      if (status) {
        status.hidden = false;
        leadForm.querySelectorAll('input, textarea, button').forEach((el) => (el.disabled = true));
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
})();
