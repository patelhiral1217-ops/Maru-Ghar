/* Maru Ghar — one column controller for live listings and the visible demo showcase.
   The 1–4 controls must visibly work even before real listings have been added. */
(function () {
  'use strict';
  const allowed = new Set(['1', '2', '3', '4']);
  let selected = '2';
  let observer = null;
  let scheduled = false;

  function grids() {
    const result = [];
    const live = document.getElementById('properties');
    const demo = document.querySelector('#mgDemoShowcase .mg-demo-grid');
    if (live) result.push(live);
    if (demo && !result.includes(demo)) result.push(demo);
    return result;
  }

  function applyToGrid(grid, cols) {
    grid.dataset.cols = cols;
    grid.style.setProperty('display', 'grid', 'important');
    grid.style.setProperty('grid-template-columns', 'repeat(' + cols + ', minmax(0, 1fr))', 'important');
    grid.style.setProperty('grid-auto-flow', 'row', 'important');
    grid.style.setProperty('grid-auto-columns', 'minmax(0, 1fr)', 'important');
    grid.style.setProperty('gap', cols === '1' ? '16px' : cols === '2' ? '12px' : cols === '3' ? '9px' : '7px', 'important');
    grid.style.setProperty('align-items', 'stretch', 'important');

    Array.from(grid.children).forEach(function (card) {
      const isCard = card.classList && (card.classList.contains('property') || card.classList.contains('mg-demo-card'));
      if (!isCard) return;
      card.style.setProperty('width', 'auto', 'important');
      card.style.setProperty('min-width', '0', 'important');
      card.style.setProperty('max-width', 'none', 'important');
      card.style.setProperty('grid-column', 'auto', 'important');
      card.style.setProperty('justify-self', 'stretch', 'important');
    });
  }

  function applyColumns(value) {
    const cols = String(value);
    if (!allowed.has(cols)) return false;
    const targets = grids();
    if (!targets.length) return false;

    selected = cols;
    targets.forEach(function (grid) { applyToGrid(grid, cols); });

    const switcher = document.getElementById('gridSwitch');
    if (switcher) {
      switcher.querySelectorAll('button[data-cols]').forEach(function (button) {
        const active = button.dataset.cols === cols;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    try { localStorage.setItem('mg_cols', cols); } catch (_) {}
    return true;
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : function (fn) { return setTimeout(fn, 0); };
    raf(function () {
      scheduled = false;
      applyColumns(selected);
    });
  }

  // Watch the page, not only #properties: the demo showcase is inserted dynamically.
  function observePage() {
    if (observer || typeof MutationObserver === 'undefined' || !document.body) return;
    observer = new MutationObserver(scheduleApply);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Public action used by the four visible buttons and regression tests.
  window.mgSetPropertyColumns = applyColumns;

  function initialize() {
    let saved = '2';
    try { saved = localStorage.getItem('mg_cols') || '2'; } catch (_) {}
    applyColumns(allowed.has(saved) ? saved : '2');
    observePage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
  window.addEventListener('pageshow', initialize);
  window.addEventListener('mg-properties-rendered', function () { applyColumns(selected); });
})();
