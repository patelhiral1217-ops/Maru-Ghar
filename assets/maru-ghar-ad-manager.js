/* Maru Ghar — Advertisement Manager public renderer.
 *
 * Reads enabled advertisements from Firestore and renders them into any
 * element carrying data-mg-ad-manager="<placement>".
 *
 * Deliberate constraints:
 *  - The Firestore query filters only on `enabled == true`. Rules are not
 *    filters, so the start/expiry window is evaluated here instead.
 *  - No touchstart/touchmove/pointerdown listeners and no pointer capture.
 *    Property photo galleries keep full ownership of horizontal gestures.
 *  - Nothing is position:fixed; ads never overlay content.
 *  - Any failure is swallowed: advertising must never break listings.
 */
import { firebaseConfig } from '../firebase-config.js';
import {
  initializeApp,
  getApps,
  getApp
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import {
  AD_COLLECTION,
  AD_MAX_CYCLES,
  isAdLive,
  sortAds
} from './maru-ghar-ad-constants.js';

(() => {
  'use strict';

  const MOUNT_SELECTOR = '[data-mg-ad-manager]';
  const reduceMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** placement -> sorted live ads */
  const byPlacement = new Map();
  /** placement -> { index, cycles, timeout, started } */
  const rotation = new Map();
  /** mounts already populated, so a re-scan does not duplicate work */
  const populated = new WeakSet();
  let started = false;

  function mountPoints() {
    return Array.from(document.querySelectorAll(MOUNT_SELECTOR));
  }

  function buildCard(ad) {
    const card = document.createElement('div');
    card.className = 'mg-adv-card';
    card.setAttribute('data-ad-id', ad.id || '');

    const isVideo = ad.mediaType === 'video';
    const href = String(ad.clickUrl || '').trim();
    const clickable = /^https:\/\//i.test(href);

    let shell;
    if (clickable) {
      const link = document.createElement('a');
      link.className = 'mg-adv-link';
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer nofollow sponsored';
      shell = link;
    } else {
      const box = document.createElement('div');
      box.className = 'mg-adv-link';
      shell = box;
    }

    const media = document.createElement(isVideo ? 'video' : 'img');
    media.className = 'mg-adv-media';
    media.src = ad.url;
    media.draggable = false;
    media.setAttribute('draggable', 'false');

    if (isVideo) {
      media.muted = true;
      media.defaultMuted = true;
      media.loop = true;
      media.playsInline = true;
      media.setAttribute('playsinline', '');
      media.setAttribute('webkit-playsinline', '');
      media.setAttribute('muted', '');
      media.setAttribute('preload', 'metadata');
      media.setAttribute('controls', '');
      media.autoplay = true;
      media.setAttribute('autoplay', '');
    } else {
      media.loading = 'lazy';
      media.decoding = 'async';
      media.alt = String(ad.title || 'જાહેરાત');
    }

    shell.appendChild(media);
    card.appendChild(shell);

    const badge = document.createElement('span');
    badge.className = 'mg-adv-badge';
    badge.textContent = 'જાહેરાત';
    card.appendChild(badge);

    if (ad.title) {
      const title = document.createElement('span');
      title.className = 'mg-adv-title';
      title.textContent = String(ad.title);
      card.appendChild(title);
    }

    if (isVideo) {
      const play = document.createElement('button');
      play.type = 'button';
      play.className = 'mg-adv-play';
      play.setAttribute('aria-label', 'વિડિયો ચલાવો');
      play.textContent = '▶';
      play.hidden = true;
      card.appendChild(play);

      const tryPlay = () => {
        const attempt = media.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt
            .then(() => {
              play.hidden = true;
            })
            .catch(() => {
              // Autoplay blocked by browser policy: offer an explicit control.
              play.hidden = false;
            });
        }
      };

      play.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        play.hidden = true;
        tryPlay();
      });

      // Never let a video swallow the tap that was meant for the link.
      media.addEventListener('click', (event) => {
        if (!clickable) event.stopPropagation();
      });

      media.addEventListener('canplay', tryPlay, { once: true });
      tryPlay();
    }

    return card;
  }

  function paint(placement, mounts) {
    const ads = byPlacement.get(placement) || [];
    if (!ads.length) {
      mounts.forEach((mount) => {
        mount.replaceChildren();
        mount.hidden = true;
      });
      return;
    }

    const state = rotation.get(placement) || { index: 0, cycles: 0, timeout: null };
    rotation.set(placement, state);

    const ad = ads[state.index % ads.length];
    mounts.forEach((mount) => {
      mount.hidden = false;
      mount.replaceChildren(buildCard(ad));
    });
  }

  function stopRotation(placement) {
    const state = rotation.get(placement);
    if (state && state.timeout) {
      clearTimeout(state.timeout);
      state.timeout = null;
    }
  }

  function scheduleNext(placement) {
    const ads = byPlacement.get(placement) || [];
    if (ads.length < 2 || reduceMotion) return;
    if (document.hidden) return;

    const state = rotation.get(placement);
    if (!state) return;

    // Bounded rotation: a busy placement stops instead of flashing forever.
    if (state.cycles >= ads.length * AD_MAX_CYCLES) return;

    stopRotation(placement);
    const current = ads[state.index % ads.length];
    const seconds = Number(current.durationSeconds) > 0 ? Number(current.durationSeconds) : 10;

    state.timeout = setTimeout(() => {
      state.timeout = null;
      if (document.hidden) return;
      state.index = (state.index + 1) % ads.length;
      state.cycles += 1;
      paint(placement, mountPointsFor(placement));
      scheduleNext(placement);
    }, seconds * 1000);
  }

  function mountPointsFor(placement) {
    return mountPoints().filter(
      (el) => el.getAttribute('data-mg-ad-manager') === placement
    );
  }

  function attach() {
    const mounts = mountPoints();
    if (!mounts.length) return;

    const placements = new Set(
      mounts.map((el) => el.getAttribute('data-mg-ad-manager')).filter(Boolean)
    );

    placements.forEach((placement) => {
      const list = mountPointsFor(placement);
      const fresh = list.filter((el) => !populated.has(el));
      if (!fresh.length) return;
      fresh.forEach((el) => populated.add(el));
      paint(placement, fresh);
      if (!rotation.has(placement)) {
        rotation.set(placement, { index: 0, cycles: 0, timeout: null });
      }
      scheduleNext(placement);
    });
  }

  async function load() {
    if (started) return;
    if (!mountPoints().length) return;
    started = true;

    try {
      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const snapshot = await getDocs(
        query(collection(db, AD_COLLECTION), where('enabled', '==', true))
      );

      const now = Date.now();
      const live = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() || {};
        const ad = { ...data, id: docSnap.id };
        if (isAdLive(ad, now)) live.push(ad);
      });

      live.forEach((ad) => {
        const key = String(ad.placement || '');
        if (!byPlacement.has(key)) byPlacement.set(key, []);
        byPlacement.get(key).push(ad);
      });
      byPlacement.forEach((list, key) => byPlacement.set(key, sortAds(list)));

      attach();
    } catch (error) {
      // Advertising is non-essential: never surface an error to the visitor.
      console.warn('[Maru Ghar] advertisements unavailable:', error && error.code ? error.code : error);
    }
  }

  function pauseAllVideos() {
    document.querySelectorAll('.mg-adv-media').forEach((el) => {
      if (el.tagName === 'VIDEO' && !el.paused) {
        try {
          el.pause();
        } catch {
          /* ignore */
        }
      }
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      rotation.forEach((_state, placement) => stopRotation(placement));
      pauseAllVideos();
      return;
    }
    rotation.forEach((_state, placement) => scheduleNext(placement));
  });

  // Pause off-screen videos to protect CPU/battery; rotation timing is unaffected.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const media = entry.target.querySelector('.mg-adv-media');
          if (!media || media.tagName !== 'VIDEO') return;
          if (!entry.isIntersecting && !media.paused) {
            try {
              media.pause();
            } catch {
              /* ignore */
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    const observeMounts = () => {
      mountPoints().forEach((el) => {
        if (!el.dataset.mgAdObserved) {
          el.dataset.mgAdObserved = '1';
          observer.observe(el);
        }
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeMounts, { once: true });
    } else {
      observeMounts();
    }
  }

  // The property-details view is built dynamically, so pick up mounts that
  // appear later (debounced) instead of hard-coding a container id.
  let rescanTimer = null;
  const rescan = () => {
    clearTimeout(rescanTimer);
    rescanTimer = setTimeout(() => {
      if (!started) {
        load();
        return;
      }
      attach();
    }, 250);
  };

  if ('MutationObserver' in window) {
    const domObserver = new MutationObserver(rescan);
    const startObserver = () => domObserver.observe(document.body, { childList: true, subtree: true });
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startObserver, { once: true });
    } else {
      startObserver();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load, { once: true });
  } else {
    load();
  }

  // Exposed for the admin preview and for manual refresh after publishing.
  window.mgAdManager = {
    refresh: () => {
      started = false;
      byPlacement.clear();
      rotation.forEach((_state, placement) => stopRotation(placement));
      rotation.clear();
      load();
    }
  };
})();
