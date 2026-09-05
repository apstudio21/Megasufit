/* ==========================================================================
   Block 11 — Więcej realizacji (galeria)
   ========================================================================== */
(function () {
  'use strict';

  const grid = document.querySelector('#gallery-grid');
  if (!grid) return;

  const toggleBtn = document.querySelector('#gallery-toggle');
  const lightbox = document.querySelector('#gallery-lightbox');
  const frame = document.querySelector('#lightbox-frame');
  const dotsWrap = document.querySelector('#lightbox-dots');

  let galleryItems = [];
  let activeCard = 0;
  let activeSlide = 0;

  function loadGallery() {
    if (window.__SITE_DATA__ && window.__SITE_DATA__.gallery) {
      return Promise.resolve(window.__SITE_DATA__.gallery);
    }
    return fetch('data/gallery.json').then((res) => res.json()).then((d) => d.items);
  }

  function isVideo(file) {
    return /\.mp4($|\?)/i.test(file || '');
  }

  function cardThumbHTML(item, index) {
    const media = item.media || [];
    const first = media[0] || {};
    const count = media.length;
    let badge = '';
    if (isVideo(first.file)) {
      badge = `<span class="gallery-card__badge"><svg class="is-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>`;
    } else if (count > 1) {
      badge = `<span class="gallery-card__badge"><svg viewBox="0 0 24 24" stroke-width="1.8"><rect x="3" y="3" width="14" height="14" rx="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 21h11a2 2 0 0 0 2-2V8" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${count}</span></span>`;
    }
    const thumb = isVideo(first.file)
      ? `<video src="${first.file}"${first.poster ? ` poster="${first.poster}"` : ''} muted preload="metadata"></video>`
      : `<img src="${first.file}" alt="" loading="lazy" decoding="async">`;

    return `<button type="button" class="gallery-card" data-card="${index}"><div class="gallery-card__inner">${thumb}</div>${badge}</button>`;
  }

  function renderLightboxSlide() {
    const media = galleryItems[activeCard].media || [];
    const item = media[activeSlide];
    frame.innerHTML = isVideo(item.file)
      ? `<video src="${item.file}" controls autoplay playsinline></video>`
      : `<img src="${item.file}" alt="">`;

    dotsWrap.innerHTML = media.length > 1
      ? media.map((_, i) => `<button type="button" class="lightbox__dot${i === activeSlide ? ' is-active' : ''}" data-dot="${i}" aria-label="Zdjęcie ${i + 1}"></button>`).join('')
      : '';

    const prevBtn = document.querySelector('[data-lightbox-prev]');
    const nextBtn = document.querySelector('[data-lightbox-next]');
    prevBtn.hidden = media.length <= 1;
    nextBtn.hidden = media.length <= 1;
  }

  function openLightbox(cardIndex) {
    activeCard = cardIndex;
    activeSlide = 0;
    renderLightboxSlide();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-locked');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-locked');
    frame.innerHTML = '';
  }

  function step(delta) {
    const media = galleryItems[activeCard].media || [];
    activeSlide = (activeSlide + delta + media.length) % media.length;
    renderLightboxSlide();
  }

  loadGallery()
    .then((items) => {
      galleryItems = items;
      grid.innerHTML = items.map(cardThumbHTML).join('');
      grid.removeAttribute('aria-busy');

      if (items.length > 12) {
        toggleBtn.hidden = false;
        toggleBtn.addEventListener('click', () => {
          const isOpen = grid.classList.toggle('is-expanded');
          toggleBtn.textContent = isOpen ? 'Pokaż mniej' : 'Rozwiń więcej';
        });
      }

      grid.addEventListener('click', (e) => {
        const card = e.target.closest('[data-card]');
        if (card) openLightbox(parseInt(card.dataset.card, 10));
      });
    })
    .catch(() => {
      grid.innerHTML = '<p>Nie udało się wczytać galerii. Odśwież stronę.</p>';
    });

  lightbox.addEventListener('click', (e) => {
    if (e.target.closest('[data-lightbox-close]') || e.target === lightbox) closeLightbox();
    if (e.target.closest('[data-lightbox-prev]')) step(-1);
    if (e.target.closest('[data-lightbox-next]')) step(1);
    const dot = e.target.closest('[data-dot]');
    if (dot) { activeSlide = parseInt(dot.dataset.dot, 10); renderLightboxSlide(); }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();
