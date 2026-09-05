/* ==========================================================================
   Block 12 — Finalne CTA form
   ========================================================================== */
(function () {
  'use strict';
  const form = document.querySelector('#final-cta-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.querySelector('[data-final-cta-status]');
    if (status) {
      status.hidden = false;
      form.querySelectorAll('input, textarea, button').forEach((el) => (el.disabled = true));
    }
  });
})();
