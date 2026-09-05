/* ==========================================================================
   Block 5 — Dlaczego my: reveal trigger for the compare grid
   ========================================================================== */
(function () {
  'use strict';
  const grid = document.querySelector('#compare-grid');
  if (!grid) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            grid.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(grid);
  } else {
    grid.classList.add('is-visible');
  }
})();
