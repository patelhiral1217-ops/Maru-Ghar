/* Direct, independent controller for the Maru Ghar 1–4 column buttons.
   Each button invokes window.mgSetPropertyColumns directly; no competing click-capture handler. */
(function () {
  'use strict';
  const allowed = new Set(['1', '2', '3', '4']);
  let selected = '2';
  let gridObserver = null;
  let scheduled = false;

  function applyColumns(value) {
    const cols = String(value);
    if (!allowed.has(cols)) return false;
    const grid = document.getElementById('properties');
    if (!grid) return false;

    selected = cols;
    grid.dataset.cols = cols;
    grid.style.setProperty('display', 'grid', 'important');
    grid.style.setProperty('grid-template-columns', 'repeat(' + cols + ', minmax(0, 1fr))', 'important');
    grid.style.setProperty('grid-auto-flow', 'row', 'important');
    grid.style.setProperty('grid-auto-columns', 'minmax(0, 1fr)', 'important');
    grid.style.setProperty('gap', cols === '1' ? '16px' : cols === '2' ? '12px' : cols === '3' ? '9px' : '7px', 'important');
    grid.style.setProperty('align-items', 'stretch', 'important');

    Array.from(grid.children).forEach(function (card) {
      if (card.classList && card.classList.contains('property')) {
        card.style.setProperty('width', 'auto', 'important');
        card.style.setProperty('min-width', '0', 'important');
        card.style.setProperty('max-width', 'none', 'important');
        card.style.setProperty('grid-column', 'auto', 'important');
        card.style.setProperty('justify-self', 'stretch', 'important');
      }
    });

    const switcher = document.getElementById('gridSwitch');
    if (switcher) {
      switcher.querySelectorAll('button[data-cols]').forEach(function (button) {
        const active = button.dataset.cols === cols;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    try { localStorage.setItem('mg_cols', cols); } catch (_) {}

    if (!gridObserver && typeof MutationObserver !== 'undefined') {
      gridObserver = new MutationObserver(function () {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(function () {
          scheduled = false;
          applyColumns(selected);
        });
      });
      gridObserver.observe(grid, { childList: true });
    }
    return true;
  }

  // Public action used by the four real buttons and by regression tests.
  window.mgSetPropertyColumns = applyColumns;

  function initialize() {
    let saved = '2';
    try { saved = localStorage.getItem('mg_cols') || '2'; } catch (_) {}
    applyColumns(allowed.has(saved) ? saved : '2');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
  window.addEventListener('pageshow', initialize);
  window.addEventListener('mg-properties-rendered', function () { applyColumns(selected); });
})();