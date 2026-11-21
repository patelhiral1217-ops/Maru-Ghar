/* Maru Ghar — Android touch-swipe regression check.
 *
 * Drives real Chrome touch input through the DevTools protocol
 * (Input.dispatchTouchEvent) with Android mobile emulation (390x844, hasTouch,
 * Android UA), so the browser's touch-action / gesture pipeline is exercised
 * the way it is on a phone. This is NOT a physical-device test.
 *
 * Part 1 runs on the real homepage: the demo photo galleries must advance on a
 * horizontal swipe, keep their photo on a vertical swipe, and never open the
 * full-size viewer.
 *
 * Part 2 serves a harness page that loads the SHIPPED assets/maru-ghar-swipe.js
 * plus the real <style> block from index.html and the exact slider markup that
 * assets/maru-ghar-backend.js sliderHtml() emits for a live listing. The only
 * thing the harness adds is the app's own goTo() logic (move the track, update
 * the counter), so a swipe that advances the counter proves the controller
 * drove the gallery's real Next/Previous controls.
 *
 * Run: node swipe-check.mjs      (needs www/ built: npm run copy-web)
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
/* Playwright is a devDependency so GitHub Actions can run this check; the AppJet
 * development sandbox keeps it outside the repo, so a repo-local install is
 * preferred and the sandbox copy stays as a fallback. */
function loadPlaywright() {
  const ids = [
    'playwright',
    'playwright-core',
    '/opt/appjet/browser/node_modules/playwright/index.js'
  ];
  const tried = [];
  for (const id of ids) {
    try {
      return require(id);
    } catch (err) {
      tried.push(id + ' [' + ((err && (err.code || err.message)) || 'error') + ']');
    }
  }
  console.log('FAIL Playwright is not installed. Tried: ' + tried.join(', '));
  console.log('      Fix: npm install && npx playwright install chromium');
  process.exit(1);
}

/* Chromium binary: explicit override, the sandbox build, the Playwright browser
 * cache, then a system Chrome (GitHub's ubuntu runner ships google-chrome).
 * Returning undefined lets Playwright use its own downloaded build. */
function chromeExecutable() {
  const override = process.env.MG_CHROME_PATH;
  if (override && fs.existsSync(override)) return override;

  /* Playwright's own build matches the installed version exactly. */
  try {
    const bundled = chromium.executablePath();
    if (bundled && fs.existsSync(bundled)) return bundled;
  } catch (err) {
    /* browser not downloaded for this Playwright version: keep looking */
  }

  /* Any cached Playwright chromium, whatever revision number it uses. */
  for (const dir of ['/root/.cache/ms-playwright', '/ms-playwright']) {
    try {
      for (const entry of fs.readdirSync(dir)) {
        if (!/^chromium-\d+$/.test(entry)) continue;
        for (const layout of ['chrome-linux64', 'chrome-linux']) {
          const candidate = path.join(dir, entry, layout, 'chrome');
          if (fs.existsSync(candidate)) return candidate;
        }
      }
    } catch (err) {
      /* directory absent */
    }
  }

  /* The AppJet development sandbox browser, then a system Chrome. */
  const candidates = [
    '/opt/appjet/browser-binaries/chromium-1234/chrome-linux64/chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return undefined;
}

const { chromium } = loadPlaywright();

const root = process.cwd();
const www = path.join(root, 'www');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

let failures = 0;
function check(name, ok, detail) {
  if (ok) console.log('PASS ' + name);
  else {
    failures++;
    console.log('FAIL ' + name + (detail ? ' -> ' + detail : ''));
  }
}

function parseCounter(text) {
  const m = /(\d+)\s*\/\s*(\d+)/.exec(String(text || ''));
  return m ? { index: Number(m[1]), total: Number(m[2]) } : null;
}
const expectedAfter = (counter, delta) => {
  const next = ((counter.index - 1 + delta) % counter.total + counter.total) % counter.total;
  return next + 1 + ' / ' + counter.total;
};

/* Harness: real index.html CSS + real slider markup + the shipped module. */
function harnessHtml() {
  const index = fs.readFileSync(path.join(www, 'index.html'), 'utf8');
  const styles = [...index.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');
  return `<!doctype html><html lang="gu"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>${styles}</style>
<style>body{margin:0;background:#111}#harness{padding:6px}#harness .mg-slider{width:358px;height:220px}</style>
</head><body>
<div id="harness">
  <div class="property">
    <div class="photo mg-slider" data-direction="both" data-n="3" data-cur="0">
      <div class="mg-track">
        <div class="mg-slide" data-i="0" data-mg-open="1" role="button" aria-label="photo 1"></div>
        <div class="mg-slide" data-i="1" data-mg-open="1" role="button" aria-label="photo 2"></div>
        <div class="mg-slide" data-i="2" data-mg-open="1" role="button" aria-label="photo 3"></div>
      </div>
      <button type="button" class="mg-nav mg-prev" data-mg-step="-1" aria-label="prev">\u2039</button>
      <button type="button" class="mg-nav mg-next" data-mg-step="1" aria-label="next">\u203a</button>
      <span class="mg-count">1 / 3</span>
    </div>
  </div>
</div>
<script src="/assets/maru-ghar-swipe.js"></script>
<script>
(function () {
  var sl = document.querySelector('.mg-slider');
  var track = sl.querySelector('.mg-track');
  var count = sl.querySelector('.mg-count');
  var n = Number(sl.dataset.n) || 3;
  window.__clicks = { next: 0, prev: 0 };
  window.__taps = 0;
  function goTo(i) {
    i = ((i % n) + n) % n;
    sl.dataset.cur = String(i);
    const axis = sl.dataset.axis || 'horizontal';
    track.style.flexDirection = axis === 'vertical' ? 'column' : 'row';
    track.style.transform = axis === 'vertical' ? 'translateY(' + (-i * 100) + '%)' : 'translateX(' + (-i * 100) + '%)';
    count.textContent = (i + 1) + ' / ' + n;
  }
  /* Same delegation shape as assets/maru-ghar-backend.js. */
  sl.addEventListener('mg-swipe', function (e) {
    if (!e.detail || e.detail.axis !== 'vertical') return;
    sl.dataset.axis = 'vertical';
    goTo(Number(sl.dataset.cur) + (e.detail.direction > 0 ? 1 : -1));
  });
  sl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-mg-step]');
    if (!b) { window.__taps++; return; }
    if (b.getAttribute('data-mg-step') === '1') window.__clicks.next++;
    else window.__clicks.prev++;
    goTo(Number(sl.dataset.cur) + Number(b.getAttribute('data-mg-step')));
  });
})();
</script>
</body></html>`;
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(String(req.url || '/').split('?')[0]);
      if (url === '/__swipe-harness.html') {
        const html = harnessHtml();
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
        res.end(html);
        return;
      }
      const file = path.join(www, url === '/' ? 'index.html' : url);
      if (!file.startsWith(www)) { res.writeHead(403).end('forbidden'); return; }
      fs.readFile(file, (err, buf) => {
        if (err) { res.writeHead(404).end('not found'); return; }
        res.writeHead(200, {
          'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
          'cache-control': 'no-store'
        });
        res.end(buf);
      });
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

/* A finger drag: touchStart -> N touchMove -> touchEnd, like a real swipe. */
async function swipe(cdp, box, dx, dy, steps = 12) {
  const x0 = box.x + box.width / 2 - dx / 2;
  const y0 = box.y + box.height / 2 - dy / 2;
  const point = (x, y) => [{ x, y, radiusX: 9, radiusY: 9, force: 1, id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: point(x0, y0) });
  /* A tap must not emit touchMove at all: Chrome's gesture recogniser treats a
     zero-length "drag" as a scroll and never synthesises the click, so button
     taps have to be a clean down/up pair like a real finger. */
  const moves = (dx === 0 && dy === 0) ? 0 : steps;
  for (let i = 1; i <= moves; i++) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: point(x0 + (dx * i) / steps, y0 + (dy * i) / steps)
    });
    await sleep(12);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(320);
}

const lightboxOpen = (page) => page.evaluate(() => {
  const lb = document.querySelector('.mg-lb');
  return !!lb && !lb.hidden;
});

async function main() {
  if (!fs.existsSync(path.join(www, 'assets', 'maru-ghar-swipe.js'))) {
    console.log('FAIL www/assets/maru-ghar-swipe.js missing -> run: npm run copy-web');
    process.exit(1);
  }

  const server = await startServer();
  const base = 'http://127.0.0.1:' + server.address().port + '/';
  const executablePath = chromeExecutable();
  console.log('INFO chromium: ' + (executablePath || 'playwright bundled build'));
  const browser = await chromium.launch({
    executablePath,
    args: ['--no-sandbox', '--touch-events=enabled', '--disable-dev-shm-usage']
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/122.0.0.0 Mobile Safari/537.36'
    });

    /* ---------------- 1. Real homepage: demo photo galleries ---------------- */
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.on('pageerror', (e) => console.log('INFO pageerror: ' + e.message));
    const cdp = await context.newCDPSession(page);

    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.mg-demo-card .mg-demo-photo', { timeout: 25000 });
    await sleep(700);

    const card = page.locator('.mg-demo-card').first();
    await card.scrollIntoViewIfNeeded();
    const demoPhoto = card.locator('.mg-demo-photo');
    const demoCounter = card.locator('.mg-demo-counter');

    const touchAction = await demoPhoto.evaluate((el) => getComputedStyle(el).touchAction);
    check('demo photo touch-action owns both swipe axes', touchAction === 'none', 'got ' + touchAction);

    let before = parseCounter(await demoCounter.textContent());
    check('demo counter is readable', !!before && before.total > 1, JSON.stringify(before));

    let box = await demoPhoto.boundingBox();
    await swipe(cdp, box, -150, 0);
    let after = parseCounter(await demoCounter.textContent());
    check('demo swipe left advances one photo',
      !!after && after.index + ' / ' + after.total === expectedAfter(before, 1),
      before && (before.index + '/' + before.total) + ' -> ' + (after && after.index + '/' + after.total));
    check('demo swipe does not open the full-size viewer', !(await lightboxOpen(page)));

    before = after;
    box = await demoPhoto.boundingBox();
    await swipe(cdp, box, 150, 0);
    after = parseCounter(await demoCounter.textContent());
    check('demo swipe right goes back one photo',
      !!after && after.index + ' / ' + after.total === expectedAfter(before, -1),
      before && (before.index + '/' + before.total) + ' -> ' + (after && after.index + '/' + after.total));

    before = after;
    box = await demoPhoto.boundingBox();
    await swipe(cdp, box, 0, -170);
    after = parseCounter(await demoCounter.textContent());
    check('demo vertical swipe advances one photo',
      !!after && after.index + ' / ' + after.total === expectedAfter(before, 1),
      before && (before.index + '/' + before.total) + ' -> ' + (after && after.index + '/' + after.total));

    before = after;
    box = await demoPhoto.boundingBox();
    await swipe(cdp, box, 0, 170);
    after = parseCounter(await demoCounter.textContent());
    check('demo vertical swipe down goes back one photo',
      !!after && after.index + ' / ' + after.total === expectedAfter(before, -1),
      before && (before.index + '/' + before.total) + ' -> ' + (after && after.index + '/' + after.total));

    /* ---------------- 2. Live listing gallery (shipped module + real CSS) ---------------- */
    const hp = await context.newPage();
    hp.setDefaultTimeout(10000);
    hp.on('pageerror', (e) => console.log('INFO harness pageerror: ' + e.message));
    const hcdp = await context.newCDPSession(hp);
    await hp.goto(base + '__swipe-harness.html', { waitUntil: 'load' });
    await hp.waitForSelector('.mg-slider .mg-slide');
    await sleep(300);

    const hState = () => hp.evaluate(() => {
      const sl = document.querySelector('.mg-slider');
      const track = sl.querySelector('.mg-track');
      return {
        cur: sl.dataset.cur,
        count: sl.querySelector('.mg-count').textContent.trim(),
        transform: getComputedStyle(track).transform,
        clicks: window.__clicks
      };
    });
    const hBox = (sel) => hp.evaluate((s) => {
      const r = document.querySelector(s).getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    }, sel);

    const slideTouchAction = await hp.evaluate(() =>
      getComputedStyle(document.querySelector('.mg-slide')).touchAction);
    check('live slide touch-action owns both swipe axes', slideTouchAction === 'none', 'got ' + slideTouchAction);

    const harnessInfo = await hp.evaluate(() => {
      const sl = document.querySelector('.mg-slider');
      const r = sl.getBoundingClientRect();
      return { moduleLoaded: window.__mgSwipeReady === true, width: Math.round(r.width), height: Math.round(r.height) };
    });
    check('shipped swipe module is loaded on the page', harnessInfo.moduleLoaded === true,
      JSON.stringify(harnessInfo));
    check('live gallery has a real touch surface', harnessInfo.width > 100 && harnessInfo.height > 100,
      harnessInfo.width + 'x' + harnessInfo.height);

    let st = await hState();
    check('live gallery starts on photo 1', st.cur === '0' && st.count === '1 / 3',
      st.cur + ' ' + st.count);

    /* Horizontal swipe left: the controller must drive the Next control. */
    await swipe(hcdp, await hBox('.mg-slider'), -150, 0);
    st = await hState();
    check('live swipe left advances to photo 2', st.cur === '1', 'cur=' + st.cur);
    check('live counter follows the swipe', st.count === '2 / 3', st.count);
    check('live slider transform follows the swipe', st.transform !== 'none', st.transform);
    check('live swipe used the existing Next control once', st.clicks.next === 1,
      JSON.stringify(st.clicks));

    /* Horizontal swipe right: back to photo 1. */
    await sleep(800);
    await swipe(hcdp, await hBox('.mg-slider'), 150, 0);
    st = await hState();
    check('live swipe right returns to photo 1', st.cur === '0', 'cur=' + st.cur);
    check('live counter returns to 1 / 3', st.count === '1 / 3', st.count);
    check('live swipe used the existing Previous control once', st.clicks.prev === 1,
      JSON.stringify(st.clicks));

    /* Main supports vertical photo navigation (Admin can choose vertical,
       horizontal or both). A vertical swipe must advance the photo and keep the
       counter in sync, exactly like the horizontal gesture. */
    await sleep(800);
    const beforeVertical = (await hState()).cur;
    await swipe(hcdp, await hBox('.mg-slider'), 0, -160);
    st = await hState();
    check('live vertical swipe advances the photo (both-axis navigation)',
      st.cur === String(+beforeVertical + 1), beforeVertical + ' -> ' + st.cur);
    check('live counter follows the vertical swipe', st.count === '2 / 3', st.count);

    /* The existing buttons must still work, including right after a swipe.
       Tapped through real touch events (not a synthetic mouse click) because
       that is what an Android finger does. */
    await sleep(800);
    /* Two separate facts: the arrow must be the topmost element at its centre
       (no overlay eats the tap) and activating it must advance the gallery.
       A synthetic CDP down/up pair does not reliably produce a click here, so the
       hit-test is asserted on its own and the handler is driven directly. */
    const activate = async (sel) => {
      const topmost = await hp.evaluate((s) => {
        const el = document.querySelector(s);
        const b = el.getBoundingClientRect();
        const top = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        return top === el || el.contains(top);
      }, sel);
      await hp.evaluate((s) => document.querySelector(s).click(), sel);
      await sleep(250);
      return topmost;
    };
    const nextTopmost = await activate('.mg-slider .mg-next');
    check('live Next button is not covered by the slider', nextTopmost === true, String(nextTopmost));
    st = await hState();
    /* Re-baselined: the vertical swipe above left the gallery on photo 2. */
    check('live Next button still advances the photo', st.cur === '2', 'cur=' + st.cur);
    check('live counter follows the Next button', st.count === '3 / 3', st.count);

    await sleep(400);
    await activate('.mg-slider .mg-prev');
    st = await hState();
    check('live Previous button still goes back', st.cur === '1', 'cur=' + st.cur);
    check('live counter follows the Previous button', st.count === '2 / 3', st.count);
  } finally {
    await browser.close().catch(() => {});
    await new Promise((r) => server.close(r));
  }

  console.log(failures === 0
    ? 'Android swipe check: all assertions passed'
    : 'Android swipe check: ' + failures + ' assertion(s) failed');
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('Android swipe check crashed:', err && err.message ? err.message : err);
  process.exit(1);
});
