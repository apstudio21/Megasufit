/* ==========================================================================
   Block 8 — Proces współpracy: reveal trigger + precise connector line
   ========================================================================== */
(function () {
  'use strict';
  const steps = document.querySelector('#process-steps');
  const line = document.querySelector('.process__line');
  if (!steps) return;

  function positionLine() {
    if (!line || window.innerWidth <= 900) return;
    const nums = steps.querySelectorAll('.process__num');
    if (nums.length < 2) return;
    const containerRect = steps.getBoundingClientRect();
    const first = nums[0].getBoundingClientRect();
    const last = nums[nums.length - 1].getBoundingClientRect();
    const firstCenter = first.left + first.width / 2 - containerRect.left;
    const lastCenter = last.left + last.width / 2 - containerRect.left;
    line.style.left = firstCenter + 'px';
    line.style.width = (lastCenter - firstCenter) + 'px';
  }

  positionLine();
  window.addEventListener('resize', positionLine);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(steps);
  } else {
    steps.classList.add('is-visible');
  }
})();
