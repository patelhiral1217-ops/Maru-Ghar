/* Maru Ghar — reliable horizontal photo swipe for Android Chrome / Android WebView.
 *
 * Why this file exists (root cause of the old Android swipe failure):
 *  1. The old galleries decided the swipe only on `touchend`. Android Chrome fires
 *     `touchcancel` (never `touchend`) as soon as the browser claims the gesture for
 *     scrolling, so the swipe was silently dropped.
 *  2. `touch-action: pan-y` was set on `.mg-track` / `.mg-demo-photo`, but the element
 *     actually touched is `.mg-slide` / the demo `<img>`, whose `touch-action` was
 *     `auto`. Chrome could therefore hand the horizontal gesture to the ancestor
 *     scroll-snap container and cancel the touch stream.
 *  3. After a swipe Android still fires a `click`; `.mg-slide` carries
 *     `data-mg-open="1"`, so the full-size viewer opened and masked the slide change.
 *
 * This controller uses Pointer Events with pointer capture, a direction lock and
 * pointercancel recovery, and it suppresses the click that follows a real drag.
 * It never moves the slider itself: it triggers the existing controls, so photo
 * counters, lazy background loading and video pausing keep working unchanged.
 */
(function () {
  'use strict';
  if (window.__mgSwipeReady) return;
  window.__mgSwipeReady = true;

  var LOCK_PX = 10;       // movement before we decide the axis
  var COMMIT_PX = 42;     // minimum distance to change the photo
  var COMMIT_RATIO = 0.14; // ...or this share of the gallery width
  var FLICK_VELOCITY = 0.35; // px per ms, for short fast swipes
  var CLICK_GUARD_MS = 700;

  var active = null;
  var suppress = null;

  function closest(el, sel) {
    while (el && el.nodeType === 1) {
      if (el.matches(sel)) return el;
      el = el.parentElement;
    }
    return null;
  }

  /* Only the photo galleries are swipe surfaces. Everything else keeps native scrolling. */
  function surfaceFor(target) {
    if (!target || target.nodeType !== 1) return null;
    if (closest(target, 'video')) return null; // a video keeps its own controls
    var track = closest(target, '.mg-track');
    if (track) {
      var slider = closest(track, '.mg-slider');
      if (slider && slider.querySelector('[data-mg-step]')) {
        return {
          host: slider,
          kind: 'live',
          el: track,
          /* Admin photo-direction setting: vertical, horizontal or both. */
          dir: slider.getAttribute('data-direction') || 'both'
        };
      }
      return null;
    }
    var stage = closest(target, '.mg-lb-stage');
    if (stage) {
      var box = closest(stage, '.mg-lb');
      return box ? { host: box, kind: 'lightbox', el: stage } : null;
    }
    var photo = closest(target, '.mg-demo-photo');
    if (photo) {
      var card = closest(photo, '.mg-demo-card');
      if (card) return { host: card, kind: 'demo', el: photo };
    }
    return null;
  }

  /* Which axes a surface owns. The full-size viewer is horizontal-only; a live
     slider follows the Admin photo-direction setting; the demo showcase keeps
     main's both-axis navigation. */
  function axesFor(surface) {
    if (surface.kind === 'lightbox') return { h: true, v: false };
    if (surface.kind === 'live') {
      if (surface.dir === 'vertical') return { h: false, v: true };
      if (surface.dir === 'horizontal') return { h: true, v: false };
      return { h: true, v: true };
    }
    return { h: true, v: true };
  }

  /* Reuse the existing controls so counters and media state stay in sync. */
  function step(surface, dir, axis) {
    if (surface.kind === 'live') {
      if (axis === 2) { surface.host.dispatchEvent(new CustomEvent('mg-swipe', { bubbles: true, detail: { direction: dir, axis: 'vertical' } })); return; }
      var btn = surface.host.querySelector('[data-mg-step="' + dir + '"]');
      if (btn) btn.click();
      return;
    }
    if (surface.kind === 'lightbox') {
      var nav = surface.host.querySelector('[data-lb="' + dir + '"]');
      if (nav) nav.click();
      return;
    }
    surface.el.dispatchEvent(new CustomEvent('mg-swipe', {
      bubbles: true,
      detail: { direction: dir }
    }));
  }

  function committed(dx, dt, width) {
    var dist = Math.abs(dx);
    if (dist >= COMMIT_PX) return true;
    if (dist >= width * COMMIT_RATIO) return true;
    return dist >= 18 && dist / dt >= FLICK_VELOCITY;
  }

  function onDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    /* A gesture can end without pointerup/pointercancel ever reaching us: Android
       WebView drops them when the touched node is replaced mid-gesture, and the
       gallery counter re-render does exactly that. Without this reset a single
       lost gesture would block every later swipe on the page. A new primary
       pointer is always a new gesture; a second finger must not disturb the
       one already running. */
    if (active) {
      if (!e.isPrimary) return;
      active = null;
    }
    var surface = surfaceFor(e.target);
    /* Demo cards use the dedicated Touch Events path below on Android; do not
       start a second, competing Pointer Events gesture for the same finger. */
    if (!surface || surface.kind === 'demo') return;
    active = {
      surface: surface,
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      x: e.clientX,
      y: e.clientY,
      t0: Date.now(),
      axis: 0
    };
    /* No setPointerCapture() anywhere in this module, on purpose. The move/up
       listeners already live on `document` (capture phase), so the whole page
       feeds the gesture without it. Capturing instead retargets later events to
       the captured element: on Android WebView a dropped pointerup then left the
       capture in place for good, which silently killed every tap on the
       gallery's own Next/Previous buttons afterwards. */
  }

  function onMove(e) {
    if (!active || e.pointerId !== active.id) return;
    var dx = e.clientX - active.x0;
    var dy = e.clientY - active.y0;
    active.x = e.clientX;
    active.y = e.clientY;
    if (!active.axis) {
      var allowed = axesFor(active.surface);
      if (Math.abs(dx) >= LOCK_PX && Math.abs(dx) >= Math.abs(dy) * 1.1) {
        active.axis = allowed.h ? 1 : -1; // 1 = horizontal gesture
      } else if (Math.abs(dy) >= LOCK_PX && Math.abs(dy) >= Math.abs(dx) * 1.1) {
        active.axis = allowed.v ? 2 : -1; // 2 = vertical gesture, -1 = leave to the page
      }
    }
    /* A drag must not start a native image drag or text selection. */
    if (active.axis > 0 && e.cancelable && e.pointerType === 'mouse') e.preventDefault();
  }

  function finish(e, cancelled) {
    if (!active || (e && e.pointerId !== active.id)) return;
    var a = active;
    active = null;
    /* Some Android WebViews send pointercancel even after a clear horizontal drag.
       Keep that already-classified horizontal swipe; vertical cancellation remains
       native page scrolling and must never change the demo photo. */
    if ((cancelled && a.axis !== 1 && a.axis !== 2) || (a.axis !== 1 && a.axis !== 2)) return;
    var delta = a.axis === 1 ? a.x - a.x0 : a.y - a.y0;
    var dt = Math.max(1, Date.now() - a.t0);
    var box = a.surface.el.getBoundingClientRect();
    var span = (a.axis === 1 ? box.width : box.height) || 1;
    if (!committed(delta, dt, span)) return;
    step(a.surface, delta < 0 ? 1 : -1, a.axis); // advance first, so the button click is not swallowed
    suppress = { el: a.surface.host, until: Date.now() + CLICK_GUARD_MS };
  }

  if (window.PointerEvent) {
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('pointermove', onMove, true);
    document.addEventListener('pointerup', function (e) { finish(e, false); }, true);
    document.addEventListener('pointercancel', function (e) { finish(e, true); }, true);
  } else {
    /* Fallback for old WebViews without Pointer Events. */
    var t = null;
    document.addEventListener('touchstart', function (e) {
      if (t || !e.touches.length) return;
      var surface = surfaceFor(e.target);
      if (!surface) return;
      t = {
        surface: surface,
        x0: e.touches[0].clientX,
        y0: e.touches[0].clientY,
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        t0: Date.now(),
        axis: 0
      };
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      if (!t || !e.touches.length) return;
      var dx = e.touches[0].clientX - t.x0;
      var dy = e.touches[0].clientY - t.y0;
      t.x = e.touches[0].clientX;
      t.y = e.touches[0].clientY;
      if (!t.axis) {
        var allowed = axesFor(t.surface);
        if (Math.abs(dx) >= LOCK_PX && Math.abs(dx) >= Math.abs(dy) * 1.1) t.axis = allowed.h ? 1 : -1;
        else if (Math.abs(dy) >= LOCK_PX && Math.abs(dy) >= Math.abs(dx) * 1.1) t.axis = allowed.v ? 2 : -1;
      }
      if (t.axis > 0 && e.cancelable) e.preventDefault();
    }, { passive: false });
    var endTouch = function (cancelled) {
      if (!t) return;
      var a = t;
      t = null;
      if (cancelled || (a.axis !== 1 && a.axis !== 2)) return;
      var delta = a.axis === 1 ? a.x - a.x0 : a.y - a.y0;
      var dt = Math.max(1, Date.now() - a.t0);
      var box = a.surface.el.getBoundingClientRect();
      var span = (a.axis === 1 ? box.width : box.height) || 1;
      if (!committed(delta, dt, span)) return;
      step(a.surface, delta < 0 ? 1 : -1);
      suppress = { el: a.surface.host, until: Date.now() + CLICK_GUARD_MS };
    };
    document.addEventListener('touchend', function () { endTouch(false); }, { passive: true });
    document.addEventListener('touchcancel', function () { endTouch(true); }, { passive: true });
  }

  /* Android demo-card fallback: use the native touch stream directly even on
     browsers that also expose Pointer Events. Some WebViews cancel pointer streams
     before pointerup; Touch Events still provide the completed finger coordinates.
     Only demo cards are handled here, so live galleries and page scrolling retain
     their existing behavior. */
  var demoTouch = null;
  document.addEventListener('touchstart', function (e) {
    if (demoTouch || !e.touches || e.touches.length !== 1) return;
    var surface = surfaceFor(e.target);
    if (!surface || surface.kind !== 'demo') return;
    var t = e.touches[0];
    demoTouch = { surface: surface, x0: t.clientX, y0: t.clientY,
      x: t.clientX, y: t.clientY, t0: Date.now(), axis: 0 };
  }, { capture: true, passive: true });
  document.addEventListener('touchmove', function (e) {
    if (!demoTouch || !e.touches || !e.touches.length) return;
    var t = e.touches[0], dx = t.clientX - demoTouch.x0, dy = t.clientY - demoTouch.y0;
    demoTouch.x = t.clientX; demoTouch.y = t.clientY;
    if (!demoTouch.axis) {
      if (Math.abs(dx) >= LOCK_PX && Math.abs(dx) >= Math.abs(dy) * 1.1) demoTouch.axis = 1;
      else if (Math.abs(dy) >= LOCK_PX && Math.abs(dy) >= Math.abs(dx) * 1.1) demoTouch.axis = 2;
    }
    if (demoTouch.axis > 0 && e.cancelable) e.preventDefault();
  }, { capture: true, passive: false });
  function finishDemoTouch(e) {
    if (!demoTouch) return;
    var a = demoTouch; demoTouch = null;
    if (a.axis !== 1 && a.axis !== 2) return;
    var t = e && e.changedTouches && e.changedTouches[0];
    if (t) { a.x = t.clientX; a.y = t.clientY; }
    var delta = a.axis === 1 ? a.x - a.x0 : a.y - a.y0, dt = Math.max(1, Date.now() - a.t0);
    var box = a.surface.el.getBoundingClientRect();
    var span = (a.axis === 1 ? box.width : box.height) || 1;
    if (!committed(delta, dt, span)) return;
    step(a.surface, delta < 0 ? 1 : -1, a.axis);
    suppress = { el: a.surface.host, until: Date.now() + CLICK_GUARD_MS };
  }
  document.addEventListener('touchend', finishDemoTouch, { capture: true, passive: true });
  document.addEventListener('touchcancel', finishDemoTouch, { capture: true, passive: true });

  /* A swipe must not also count as a tap (which would open the full-size viewer).
     The gallery's own controls are always allowed through, so a quick Next/Previous
     tap straight after a swipe is never swallowed. */
  document.addEventListener('click', function (e) {
    if (!suppress) return;
    if (Date.now() > suppress.until) { suppress = null; return; }
    if (closest(e.target, '[data-mg-step],[data-lb]')) return;
    if (suppress.el && suppress.el.contains(e.target)) {
      e.preventDefault();
      e.stopPropagation();
      suppress = null;
    }
  }, true);

  /* Keep the page from rubber-banding sideways while a gallery is being swiped. */
  function markContainers() {
    var nodes = document.querySelectorAll('.mg-slider, #mgDemoShowcase .mg-demo-grid, .mg-lb');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].style.setProperty('overscroll-behavior-x', 'contain');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markContainers, { once: true });
  } else {
    markContainers();
  }
  window.addEventListener('mg-properties-rendered', markContainers);
  window.addEventListener('pageshow', markContainers);
})();
