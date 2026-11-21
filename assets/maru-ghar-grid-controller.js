/* Maru Ghar — responsive two-direction property layout.
   Listing cards wrap into vertical rows; photo galleries inside each card keep
   their own horizontal swipe. The 1–2 controls choose the number of columns. */
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
    // Cards now wrap into rows so long listings grow down the page instead
    // of becoming one endless horizontal strip. Photo strips remain swipeable.
    grid.style.setProperty('display', 'grid', 'important');
    grid.style.setProperty('grid-template-columns', 'repeat(' + cols + ', minmax(0, 1fr))', 'important');
    grid.style.setProperty('grid-auto-flow', 'row', 'important');
    grid.style.setProperty('grid-auto-rows', 'auto', 'important');
    grid.style.setProperty('width', '100%', 'important');
    grid.style.setProperty('min-width', '0', 'important');
    grid.style.setProperty('max-width', '100%', 'important');
    grid.style.setProperty('overflow-x', 'visible', 'important');
    grid.style.setProperty('overflow-y', 'visible', 'important');
    grid.style.setProperty('overscroll-behavior', 'auto', 'important');
    grid.style.setProperty('gap', cols === '1' ? '14px' : '12px', 'important');
    grid.style.setProperty('align-items', 'stretch', 'important');
    grid.style.setProperty('padding-bottom', '10px', 'important');
    grid.style.setProperty('box-sizing', 'border-box', 'important');

    Array.from(grid.children).forEach(function (card) {
      const isCard = card.classList && (card.classList.contains('property') || card.classList.contains('mg-demo-card'));
      if (!isCard) return;
      card.style.setProperty('box-sizing', 'border-box', 'important');
      card.style.setProperty('width', '100%', 'important');
      card.style.setProperty('min-width', '0', 'important');
      card.style.setProperty('max-width', '100%', 'important');
      card.style.setProperty('flex', 'initial', 'important');
      card.style.setProperty('scroll-snap-align', 'none', 'important');
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

  // Observe dynamic listings: newly added cards are automatically placed in rows.
  function observePage() {
    if (observer || typeof MutationObserver === 'undefined' || !document.body) return;
    observer = new MutationObserver(scheduleApply);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Public action used by the visible 1–2 controls and regression tests.
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
