/* Maru Ghar — horizontal swipe controller for live listings and the visible demo showcase.
   The 1–2 controls set how many property cards are visible side by side. */
(function () {
  'use strict';
  const allowed = new Set(['1', '2']);
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
    // Keep all property cards in one horizontal track. Native touch scrolling lets
    // the user swipe left/right without interfering with normal page scrolling.
    grid.style.setProperty('display', 'flex', 'important');
    grid.style.setProperty('flex-flow', 'row nowrap', 'important');
    grid.style.setProperty('overflow-x', 'auto', 'important');
    grid.style.setProperty('overflow-y', 'hidden', 'important');
    grid.style.setProperty('-webkit-overflow-scrolling', 'touch', 'important');
    grid.style.setProperty('scroll-snap-type', 'x mandatory', 'important');
    grid.style.setProperty('overscroll-behavior-x', 'contain', 'important');
    grid.style.setProperty('gap', cols === '1' ? '14px' : '12px', 'important');
    grid.style.setProperty('align-items', 'stretch', 'important');
    grid.style.setProperty('padding-bottom', '10px', 'important');
    grid.style.setProperty('scrollbar-width', 'thin', 'important');

    Array.from(grid.children).forEach(function (card) {
      const isCard = card.classList && (card.classList.contains('property') || card.classList.contains('mg-demo-card'));
      if (!isCard) return;
      card.style.setProperty('flex', cols === '1' ? '0 0 86%' : '0 0 calc(50% - 6px)', 'important');
      card.style.setProperty('width', cols === '1' ? '86%' : 'calc(50% - 6px)', 'important');
      card.style.setProperty('min-width', '0', 'important');
      card.style.setProperty('max-width', 'none', 'important');
      card.style.setProperty('scroll-snap-align', 'start', 'important');
      card.style.setProperty('scroll-snap-stop', 'normal', 'important');
      card.style.setProperty('align-self', 'stretch', 'important');
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
