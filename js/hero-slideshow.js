/* ==========================================================================
   Block 2 — Hero background slideshow (crossfade between photos)
   ========================================================================== */
(function () {
  'use strict';

  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length < 2) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let index = 0;
  setInterval(() => {
    slides[index].classList.remove('is-active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('is-active');
  }, 6500);
})();
