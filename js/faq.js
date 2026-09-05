/* ==========================================================================
   Block 10 — FAQ
   ========================================================================== */
(function () {
  'use strict';

  const list = document.querySelector('#faq-list');
  if (!list) return;

  function loadFaq() {
    if (window.__SITE_DATA__ && window.__SITE_DATA__.faq) {
      return Promise.resolve(window.__SITE_DATA__.faq);
    }
    return fetch('data/faq.json').then((res) => res.json()).then((d) => d.items);
  }

  function itemHTML(item, i) {
    return `
      <div class="faq-item" id="faq-item-${i}">
        <button type="button" class="faq-item__question" aria-expanded="false" aria-controls="faq-answer-${i}">
          <span>${item.question_pl}</span>
          <span class="faq-item__icon" aria-hidden="true"></span>
        </button>
        <div class="faq-item__answer" id="faq-answer-${i}">
          <p>${item.answer_pl}</p>
        </div>
      </div>`;
  }

  loadFaq()
    .then((items) => {
      list.innerHTML = items.map(itemHTML).join('');
      list.removeAttribute('aria-busy');

      list.querySelectorAll('.faq-item').forEach((item) => {
        const btn = item.querySelector('.faq-item__question');
        const answer = item.querySelector('.faq-item__answer');

        btn.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');

          // close any other open item (single-open accordion)
          list.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
            if (openItem !== item) {
              openItem.classList.remove('is-open');
              openItem.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
              openItem.querySelector('.faq-item__answer').style.maxHeight = null;
            }
          });

          item.classList.toggle('is-open', !isOpen);
          btn.setAttribute('aria-expanded', String(!isOpen));
          answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
        });
      });
    })
    .catch(() => {
      list.innerHTML = '<p>Nie udało się wczytać FAQ. Odśwież stronę.</p>';
    });
})();
