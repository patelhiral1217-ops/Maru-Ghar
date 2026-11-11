/* Maru Ghar Delight Layer — premium feel without breaking existing flows.
   Additive only. Safe if DOM nodes are missing. */
(function () {
  'use strict';
  if (window.__mgDelight) return;
  window.__mgDelight = true;

  var tr = function (s) {
    try { return (window.mgTranslate && window.mgTranslate(s)) || s; } catch (e) { return s; }
  };

  /* ---------- CSS injection ---------- */
  var css = [
    '/* === Maru Ghar Delight === */',
    ':root{--mg-d-radius:18px;--mg-d-shadow:0 10px 28px rgba(16,23,34,.12);--mg-d-gold:#e6bd62;--mg-d-ink:#101722;}',

    /* Toast */
    '#mgToastHost{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:99999;display:flex;flex-direction:column;gap:8px;width:min(92vw,380px);pointer-events:none}',
    '.mg-toast{pointer-events:auto;background:linear-gradient(145deg,#1b2635,#101722);color:#f7f0e1;border:1px solid rgba(230,189,98,.45);border-radius:14px;padding:12px 16px;font-size:14px;line-height:1.45;box-shadow:0 12px 32px rgba(0,0,0,.35);opacity:0;transform:translateY(12px);transition:opacity .28s ease,transform .28s ease}',
    '.mg-toast.show{opacity:1;transform:translateY(0)}',
    '.mg-toast.ok{border-color:rgba(70,180,120,.55)}',
    '.mg-toast.err{border-color:rgba(220,80,70,.55)}',

    /* Sticky search feel on scroll */
    'body.mg-scrolled .searchbox{box-shadow:0 10px 30px rgba(16,23,34,.18)!important;border-color:rgba(230,189,98,.35)!important}',

    /* Property cards — calmer premium */
    '#properties{gap:18px!important}',
    '#properties .property{border-radius:var(--mg-d-radius)!important;overflow:hidden;transition:transform .2s ease,box-shadow .2s ease!important}',
    '#properties .property:hover{transform:translateY(-4px)!important;box-shadow:0 16px 36px rgba(16,23,34,.16)!important}',
    '#properties .property .price{font-size:22px!important;font-weight:900!important;letter-spacing:.2px;color:#c9a227!important}',
    '#properties .property-foot .btn{min-height:48px!important;font-size:15px!important;font-weight:800!important;border-radius:12px!important;letter-spacing:.2px}',
    '#properties .mg-tools button{min-height:40px;border-radius:10px;transition:transform .15s ease,background .15s ease}',
    '#properties .mg-tools button:active{transform:scale(.94)}',
    '#properties .mg-fav.on{animation:mgHeart .45s ease}',
    '@keyframes mgHeart{0%{transform:scale(1)}35%{transform:scale(1.35)}70%{transform:scale(.92)}100%{transform:scale(1)}}',

    /* Skeleton */
    '.mg-skel{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;padding:8px 0 20px}',
    '.mg-skel-card{height:320px;border-radius:18px;background:linear-gradient(90deg,#e8e0d0 25%,#f5efe3 37%,#e8e0d0 63%);background-size:400% 100%;animation:mgShimmer 1.25s ease infinite}',
    '@keyframes mgShimmer{0%{background-position:100% 0}100%{background-position:0 0}}',

    /* Empty state */
    '.mg-empty{text-align:center;padding:36px 18px;border-radius:18px;background:linear-gradient(160deg,#fffdf8,#f3ead7);border:1px dashed #cbb98a;margin:12px 0 24px}',
    '.mg-empty .emoji{font-size:42px;line-height:1;margin-bottom:8px}',
    '.mg-empty h3{margin:0 0 8px;font-size:18px;color:#1b2430}',
    '.mg-empty p{margin:0;color:#5b6572;line-height:1.6;font-size:14px}',

    /* Trust strip under hero / near search */
    '.mg-trust{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:14px 0 6px}',
    '.mg-trust span{display:inline-flex;align-items:center;gap:6px;background:rgba(255,253,248,.92);border:1px solid #e2d3b0;color:#3a4553;border-radius:999px;padding:7px 12px;font-size:12px;font-weight:700;box-shadow:0 2px 8px rgba(16,23,34,.06)}',

    /* Category chips scroll snap */
    '.cats{scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}',
    '.cats::-webkit-scrollbar{display:none}',
    '.cats .cat{scroll-snap-align:start;white-space:nowrap}',

    /* Contact reveal soft highlight */
    '.mg-contact-pulse{animation:mgPulse 1.2s ease 1}',
    '@keyframes mgPulse{0%{box-shadow:0 0 0 0 rgba(230,189,98,.55)}70%{box-shadow:0 0 0 12px rgba(230,189,98,0)}100%{box-shadow:0 0 0 0 rgba(230,189,98,0)}}',

    /* Reduce motion */
    '@media (prefers-reduced-motion:reduce){.mg-skel-card,#properties .property,.mg-toast,#properties .mg-fav.on{animation:none!important;transition:none!important}}',

    /* Mobile comfort */
    '#mgTopBtn:active{transform:scale(.94)}',
    '@media (max-width:640px){',
    '#mgToastHost{bottom:calc(14px + env(safe-area-inset-bottom,0px))}',
    '#properties .property-foot .btn{min-height:50px!important;font-size:16px!important}',
    '.mg-trust span{font-size:11px;padding:6px 10px}',
    '}'
  ].join('\n');

  var style = document.createElement('style');
  style.id = 'mg-delight-css';
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- Toast ---------- */
  function ensureHost() {
    var h = document.getElementById('mgToastHost');
    if (h) return h;
    h = document.createElement('div');
    h.id = 'mgToastHost';
    h.setAttribute('aria-live', 'polite');
    document.body.appendChild(h);
    return h;
  }
  window.mgToast = function (msg, kind) {
    var host = ensureHost();
    var t = document.createElement('div');
    t.className = 'mg-toast' + (kind === 'err' ? ' err' : kind === 'ok' ? ' ok' : '');
    t.textContent = tr(String(msg || ''));
    host.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 300);
    }, 3200);
  };

  /* ---------- Trust strip ---------- */
  function addTrust() {
    if (document.getElementById('mgTrust')) return;
    var search = document.querySelector('.searchbox');
    if (!search || !search.parentNode) return;
    var row = document.createElement('div');
    row.id = 'mgTrust';
    row.className = 'mg-trust';
    row.innerHTML =
      '<span>✅ ' + tr('વેરિફાઇડ લિસ્ટિંગ') + '</span>' +
      '<span>🔒 ' + tr('માલિકનો નંબર સુરક્ષિત') + '</span>' +
      '<span>🌐 ' + tr('આખું ગુજરાત') + '</span>' +
      '<span>🆓 ' + tr('મફત શોધ') + '</span>';
    search.parentNode.insertBefore(row, search.nextSibling);
  }

  /* ---------- Skeleton while first load ---------- */
  function showSkeleton() {
    var grid = document.getElementById('properties');
    if (!grid || grid.querySelector('.property') || document.getElementById('mgSkel')) return;
    var sk = document.createElement('div');
    sk.id = 'mgSkel';
    sk.className = 'mg-skel';
    sk.setAttribute('aria-hidden', 'true');
    sk.innerHTML = '<div class="mg-skel-card"></div><div class="mg-skel-card"></div><div class="mg-skel-card"></div>';
    grid.appendChild(sk);
  }
  function hideSkeleton() {
    var sk = document.getElementById('mgSkel');
    if (sk) sk.remove();
  }

  /* ---------- Empty state when filters hide all ---------- */
  function ensureEmpty() {
    var grid = document.getElementById('properties');
    if (!grid) return;
    var empty = document.getElementById('mgEmpty');
    var visible = grid.querySelectorAll('.property:not(.hidden)');
    var hasAny = grid.querySelectorAll('.property').length > 0;
    if (hasAny && visible.length === 0) {
      if (!empty) {
        empty = document.createElement('div');
        empty.id = 'mgEmpty';
        empty.className = 'mg-empty';
        empty.innerHTML = '<div class="emoji">🏠</div><h3>' + tr('આ ફિલ્ટરમાં પ્રોપર્ટી નથી') + '</h3><p>' + tr('બીજું શહેર, ભાવ અથવા પ્રકાર અજમાવો — અથવા ફિલ્ટર રીસેટ કરો.') + '</p>';
        grid.parentNode.insertBefore(empty, grid.nextSibling);
      }
      empty.style.display = '';
    } else if (empty) {
      empty.style.display = 'none';
    }
  }

  /* ---------- Scroll class for search elevation ---------- */
  function onScroll() {
    document.body.classList.toggle('mg-scrolled', window.scrollY > 40);
  }

  /* ---------- Fav bounce + contact pulse hooks ---------- */
  function wireClicks() {
    document.addEventListener('click', function (e) {
      var fav = e.target.closest && e.target.closest('.mg-fav');
      if (fav) {
        setTimeout(function () {
          if (fav.classList.contains('on')) {
            try { window.mgToast && window.mgToast(tr('મનપસંદમાં ઉમેર્યું'), 'ok'); } catch (err) {}
          }
        }, 50);
      }
      var contact = e.target.closest && e.target.closest('[data-act="contact"]');
      if (contact) {
        contact.classList.add('mg-contact-pulse');
        setTimeout(function () { contact.classList.remove('mg-contact-pulse'); }, 1300);
      }
    }, true);
  }

  /* ---------- Patch filterProps to refresh empty state ---------- */
  function patchFilter() {
    if (typeof window.filterProps !== 'function') return;
    var orig = window.filterProps;
    window.filterProps = function () {
      var r = orig.apply(this, arguments);
      try { ensureEmpty(); } catch (e) {}
      return r;
    };
  }

  /* ---------- Observe grid for skeleton removal ---------- */
  function watchGrid() {
    var grid = document.getElementById('properties');
    if (!grid || !window.MutationObserver) return;
    var mo = new MutationObserver(function () {
      if (grid.querySelector('.property')) hideSkeleton();
      ensureEmpty();
      styleLoadMore();
    });
    mo.observe(grid, { childList: true, subtree: false });
  }



  /* ---------- Fast search: debounce + Enter jumps to results ---------- */
  function wireSearchSpeed() {
    var q = document.getElementById('query');
    if (!q || q.dataset.mgFast) return;
    q.dataset.mgFast = '1';
    var t = null;
    q.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        if (typeof window.filterProps === 'function') window.filterProps();
      }, 120);
    });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (typeof window.filterProps === 'function') window.filterProps();
        var list = document.getElementById('listings');
        if (list) list.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    // Purpose/type change also scroll gently to results (first time feel)
    ['purpose', 'type', 'cityFilter'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || el.dataset.mgScroll) return;
      el.dataset.mgScroll = '1';
      el.addEventListener('change', function () {
        setTimeout(function () {
          var list = document.getElementById('listings');
          if (list && window.scrollY < (list.offsetTop - 80)) {
            list.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50);
      });
    });
  }

  /* ---------- Back to top (mobile friendly) ---------- */
  function addBackTop() {
    if (document.getElementById('mgTopBtn')) return;
    var btn = document.createElement('button');
    btn.id = 'mgTopBtn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Top');
    btn.textContent = '↑';
    btn.style.cssText = 'position:fixed;right:14px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:99990;width:46px;height:46px;border-radius:50%;border:1px solid rgba(230,189,98,.5);background:linear-gradient(145deg,#1b2635,#101722);color:#f2ca68;font-size:20px;font-weight:800;box-shadow:0 8px 20px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:opacity .2s;cursor:pointer';
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);
    window.addEventListener('scroll', function () {
      var show = window.scrollY > 500;
      btn.style.opacity = show ? '1' : '0';
      btn.style.pointerEvents = show ? 'auto' : 'none';
    }, { passive: true });
  }

  /* ---------- Instant feedback on category chips ---------- */
  function wireCats() {
    var cats = document.querySelector('.cats');
    if (!cats || cats.dataset.mgFast) return;
    cats.dataset.mgFast = '1';
    cats.addEventListener('click', function () {
      // filterProps already runs from existing handlers; just ensure empty state updates
      setTimeout(function () { try { ensureEmpty(); } catch (e) {} }, 0);
    });
  }

  /* ---------- Make "Load more" always easy to find ---------- */
  function styleLoadMore() {
    var more = document.getElementById('loadMoreListings');
    if (!more || more.dataset.mgStyled) return;
    more.dataset.mgStyled = '1';
    more.style.minHeight = '48px';
    more.style.fontWeight = '800';
    more.style.borderRadius = '12px';
    more.style.margin = '8px auto 20px';
    more.style.display = more.hidden ? 'none' : 'block';
    more.style.width = 'min(100%, 320px)';
  }

  /* ---------- Soft offline banner ---------- */
  function wireOnline() {
    function sync() {
      var existing = document.getElementById('mgOffline');
      if (!navigator.onLine) {
        if (!existing) {
          existing = document.createElement('div');
          existing.id = 'mgOffline';
          existing.setAttribute('role', 'status');
          existing.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99998;background:#7a1f1f;color:#fff;text-align:center;padding:8px 12px;font-size:13px;font-weight:700';
          existing.textContent = tr('ઇન્ટરનેટ નથી — કેટલીક વિગતો અટકી શકે');
          document.body.appendChild(existing);
        }
      } else if (existing) {
        existing.remove();
        try { window.mgToast && window.mgToast(tr('ઇન્ટરનેટ પાછું આવ્યું'), 'ok'); } catch (e) {}
      }
    }
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    sync();
  }

  function init() {
    addTrust();
    showSkeleton();
    wireClicks();
    patchFilter();
    watchGrid();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    wireSearchSpeed();
    addBackTop();
    wireCats();
    styleLoadMore();
    wireOnline();
    // If listings already present (cache), drop skeleton quickly
    setTimeout(function () {
      var grid = document.getElementById('properties');
      if (grid && grid.querySelector('.property')) hideSkeleton();
      // If still empty after 8s with no cards, hide skeleton (error/empty handled elsewhere)
      setTimeout(hideSkeleton, 8000);
    }, 400);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
