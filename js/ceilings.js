/* ==========================================================================
   Block 4 — Rodzaje sufitów
   Fetches data/pricing.json (edited via Decap CMS) and renders the grid.
   ========================================================================== */
(function () {
  'use strict';

  const grid = document.querySelector('#ceilings-grid');
  if (!grid) return;

  function cardHTML(item) {
    let media;
    if (item.video) {
      media = `<video src="${item.video}" poster="${item.image || ''}" muted loop playsinline autoplay preload="metadata"></video>`;
    } else if (item.image) {
      media = `<img src="${item.image}" alt="${item.name_pl}" loading="lazy" decoding="async">`;
    } else {
      media = `<div class="ceiling-card__placeholder" aria-hidden="true">${item.name_pl.charAt(0)}</div>`;
    }

    return `
      <article class="ceiling-card reveal">
        <div class="ceiling-card__media">${media}</div>
        <div class="ceiling-card__body">
          <h3 class="ceiling-card__name">${item.name_pl}</h3>
          <p class="ceiling-card__desc">${item.desc_pl}</p>
          <p class="ceiling-card__price"><span>od</span><span>${item.price_from}&nbsp;zł/m²</span></p>
        </div>
      </article>`;
  }

  function loadPricing() {
    if (window.__SITE_DATA__ && window.__SITE_DATA__.pricing) {
      return Promise.resolve(window.__SITE_DATA__.pricing);
    }
    return fetch('data/pricing.json').then((res) => res.json());
  }

  loadPricing()
    .then((data) => {
      const types = data.ceiling_types || [];
      grid.innerHTML = types.map(cardHTML).join('');
      grid.removeAttribute('aria-busy');

      // hand the freshly-inserted .reveal cards to the shared observer
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        grid.querySelectorAll('.reveal').forEach((el) => io.observe(el));

        // play/pause the Double Vision clip only while it's actually on screen
        const videoIo = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const video = entry.target;
              if (entry.isIntersecting) video.play().catch(() => {});
              else video.pause();
            });
          },
          { threshold: 0.4 }
        );
        grid.querySelectorAll('video').forEach((el) => videoIo.observe(el));
      } else {
        grid.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      }
    })
    .catch(() => {
      grid.innerHTML = '<p class="ceilings__error">Nie udało się wczytać cennika. Odśwież stronę.</p>';
    });
})();
