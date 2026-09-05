/* ==========================================================================
   Block 7 — Realizacje (kejsy)
   Fetches data/cases.json (edited via Decap CMS) and renders the blocks.
   ========================================================================== */
(function () {
  'use strict';

  const list = document.querySelector('#cases-list');
  if (!list) return;

  function loadCases() {
    if (window.__SITE_DATA__ && window.__SITE_DATA__.cases) {
      return Promise.resolve(window.__SITE_DATA__.cases);
    }
    return fetch('data/cases.json').then((res) => res.json()).then((d) => d.items);
  }

  function isVideo(file) {
    return /\.mp4($|\?)/i.test(file);
  }

  function tagsHTML(tags) {
    if (!tags) return '';
    const labels = [tags.location, tags.area, tags.ceiling_type].filter(Boolean);
    if (!labels.length) return '';
    return `<div class="case-block__tags">${labels.map((l) => `<span class="case-block__tag">${l}</span>`).join('')}</div>`;
  }

  function slideHTML(item, i) {
    if (isVideo(item.file)) {
      const poster = item.poster ? ` poster="${item.poster}"` : '';
      return `<div class="case-carousel__slide"><video src="${item.file}"${poster} muted loop playsinline preload="none" controls></video></div>`;
    }
    return `<div class="case-carousel__slide"><img src="${item.file}" alt="" loading="lazy" decoding="async"></div>`;
  }

  function caseHTML(item, index) {
    const media = item.media || [];
    const isReverse = index % 2 === 1;
    const reverseClass = isReverse ? ' case-block--reverse' : '';
    const dots = media.length > 1
      ? `<div class="case-carousel__dots">${media.map((_, i) => `<button class="case-carousel__dot${i === 0 ? ' is-active' : ''}" data-dot="${i}" aria-label="Zdjęcie ${i + 1}"></button>`).join('')}</div>`
      : '';
    const nav = media.length > 1
      ? `<button class="case-carousel__nav case-carousel__nav--prev" data-prev aria-label="Poprzednie zdjęcie"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
         <button class="case-carousel__nav case-carousel__nav--next" data-next aria-label="Następne zdjęcie"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`
      : '';

    const mediaBlock = `
        <div class="case-block__media">
          ${tagsHTML(item.tags)}
          <div class="case-carousel" data-carousel>
            <div class="case-carousel__track">${media.map(slideHTML).join('')}</div>
            ${nav}
            ${dots}
          </div>
        </div>`;

    const bodyBlock = `
        <div class="case-block__body">
          <p>${item.text_pl || ''}</p>
        </div>`;

    // Reversed rows swap physical DOM order (not just CSS order) — avoids a
    // Chromium grid auto-placement/order quirk that could collapse the
    // media column to zero width in combination with aspect-ratio.
    const blocks = isReverse ? bodyBlock + mediaBlock : mediaBlock + bodyBlock;

    return `<article class="case-block${reverseClass} reveal">${blocks}</article>`;
  }

  function initCarousel(el) {
    const track = el.querySelector('.case-carousel__track');
    const slides = el.querySelectorAll('.case-carousel__slide');
    const dots = el.querySelectorAll('.case-carousel__dot');
    let index = 0;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
    }

    el.querySelector('[data-prev]')?.addEventListener('click', () => goTo(index - 1));
    el.querySelector('[data-next]')?.addEventListener('click', () => goTo(index + 1));
    dots.forEach((d) => d.addEventListener('click', () => goTo(parseInt(d.dataset.dot, 10))));
  }

  loadCases()
    .then((items) => {
      list.innerHTML = items.map(caseHTML).join('');
      list.removeAttribute('aria-busy');
      list.querySelectorAll('[data-carousel]').forEach(initCarousel);

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
          { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
        );
        list.querySelectorAll('.reveal').forEach((el) => io.observe(el));
      } else {
        list.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      }
    })
    .catch(() => {
      list.innerHTML = '<p>Nie udało się wczytać realizacji. Odśwież stronę.</p>';
    });
})();
