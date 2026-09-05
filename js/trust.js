/* ==========================================================================
   Block 3 — Count-up animation for trust numbers
   Triggers once when the stats row scrolls into view.
   ========================================================================== */
(function () {
  'use strict';

  const nums = document.querySelectorAll('.trust__stat-num [data-count]');
  if (!nums.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    if (prefersReduced || !('requestAnimationFrame' in window)) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1100;
    let start = null;

    function step(ts) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const container = document.querySelector('.trust__stats');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            nums.forEach(animateCount);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(container);
  } else {
    nums.forEach(animateCount);
  }
})();
