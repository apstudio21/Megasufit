/* ==========================================================================
   Block 6 — Kalkulator
   ========================================================================== */
(function () {
  'use strict';

  const form = document.querySelector('#calc-form');
  if (!form) return;

  const typeSelect = document.querySelector('#calc-type');
  const areaInput = document.querySelector('#calc-area');
  const resultEl = document.querySelector('#calc-result');
  const fromEl = document.querySelector('#calc-from');
  const toEl = document.querySelector('#calc-to');

  function loadPricing() {
    if (window.__SITE_DATA__ && window.__SITE_DATA__.pricing) {
      return Promise.resolve(window.__SITE_DATA__.pricing);
    }
    return fetch('data/pricing.json').then((res) => res.json());
  }

  // enable/disable quantity inputs alongside their checkbox
  document.querySelectorAll('[data-qty-toggle]').forEach((checkbox) => {
    const qtyInput = document.getElementById(checkbox.dataset.qtyToggle);
    checkbox.addEventListener('change', () => {
      qtyInput.disabled = !checkbox.checked;
      if (!checkbox.checked) qtyInput.value = 0;
      compute();
    });
  });

  let pricing = null;

  loadPricing().then((data) => {
    pricing = data;
    typeSelect.innerHTML = data.ceiling_types
      .map((t, i) => `<option value="${i}">${t.name_pl} — od ${t.price_from} zł/m²</option>`)
      .join('');
    typeSelect.removeAttribute('aria-busy');
    compute();
  });

  function num(el) {
    const v = parseFloat(el.value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function compute() {
    if (!pricing) return;

    const area = num(areaInput);
    const typeIdx = typeSelect.value;
    if (!area || typeIdx === '') {
      fromEl.textContent = '—';
      toEl.textContent = '—';
      return;
    }

    const type = pricing.ceiling_types[typeIdx];
    const calc = pricing.calculator;

    const spotQty = document.querySelector('#calc-spot-on').checked ? num(document.querySelector('#calc-spot-qty')) : 0;
    const ledQty = document.querySelector('#calc-led-on').checked ? num(document.querySelector('#calc-led-qty')) : 0;
    const trackQty = document.querySelector('#calc-track-on').checked ? num(document.querySelector('#calc-track-qty')) : 0;

    const base = area * type.price_from;
    const lighting = spotQty * calc.price_per_spot + ledQty * calc.price_per_led_strip_m + trackQty * calc.price_per_track_m;

    const from = Math.round(base + lighting);
    const to = Math.round(from * calc.range_multiplier);

    resultEl.classList.add('is-updated');
    fromEl.textContent = from.toLocaleString('pl-PL');
    toEl.textContent = to.toLocaleString('pl-PL');
    requestAnimationFrame(() => resultEl.classList.remove('is-updated'));
  }

  form.addEventListener('input', compute);
  form.addEventListener('change', compute);
})();
