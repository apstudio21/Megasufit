/* ==========================================================================
   Block 2 — Hero inline form
   ========================================================================== */
(function () {
  'use strict';
  const form = document.querySelector('#hero-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.querySelector('[data-hero-form-status]');
    if (status) {
      status.hidden = false;
      form.querySelectorAll('input, button').forEach((el) => (el.disabled = true));
    }
  });
})();
