/* ==========================================================================
   Block 9 — Opinie
   ========================================================================== */
(function () {
  'use strict';

  const grid = document.querySelector('#testimonials-grid');
  if (!grid) return;

  const extra = document.querySelector('#testimonials-extra');
  const toggleBtn = document.querySelector('#testimonials-toggle');

  function loadTestimonials() {
    if (window.__SITE_DATA__ && window.__SITE_DATA__.testimonials) {
      return Promise.resolve(window.__SITE_DATA__.testimonials);
    }
    return fetch('data/testimonials.json').then((res) => res.json()).then((d) => d.items);
  }

  function starsHTML(rating) {
    let out = '';
    for (let i = 0; i < 5; i++) {
      const filled = i < rating;
      out += `<svg viewBox="0 0 20 20"${filled ? '' : ' style="fill:var(--color-border)"'}><path d="M10 1.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8L10 14.7l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8L10 1.5z"/></svg>`;
    }
    return out;
  }

  function avatarHTML(item) {
    if (item.avatar) {
      return `<img class="testimonial-card__avatar" src="${item.avatar}" alt="${item.author}">`;
    }
    return `<div class="testimonial-card__avatar" aria-hidden="true">${(item.author || '?').charAt(0)}</div>`;
  }

  function cardHTML(item) {
    const meta = [item.date_label, item.profile_meta].filter(Boolean).join(' · ');
    return `
      <article class="testimonial-card reveal">
        <div class="testimonial-card__head">
          ${avatarHTML(item)}
          <div>
            <div class="testimonial-card__author">${item.author}</div>
            ${meta ? `<div class="testimonial-card__meta">${meta}</div>` : ''}
          </div>
        </div>
        <div class="testimonial-card__stars">${starsHTML(item.rating || 5)}</div>
        <p class="testimonial-card__text">${item.text_pl}</p>
      </article>`;
  }

  function observeReveal(container) {
    if (!('IntersectionObserver' in window)) {
      container.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    container.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  loadTestimonials()
    .then((items) => {
      const featured = items.filter((t) => t.featured);
      const rest = items.filter((t) => !t.featured);
      const shown = featured.length ? featured : items.slice(0, 6);
      const hidden = featured.length ? rest : items.slice(6);

      grid.innerHTML = shown.map(cardHTML).join('');
      grid.removeAttribute('aria-busy');
      observeReveal(grid);

      if (hidden.length) {
        extra.innerHTML = hidden.map(cardHTML).join('');
        toggleBtn.hidden = false;
        toggleBtn.addEventListener('click', () => {
          const isOpen = extra.classList.toggle('is-open');
          if (isOpen) observeReveal(extra);
          toggleBtn.textContent = isOpen ? 'Pokaż mniej' : 'Pokaż więcej opinii';
        });
      }
    })
    .catch(() => {
      grid.innerHTML = '<p>Nie udało się wczytać opinii. Odśwież stronę.</p>';
    });
})();
