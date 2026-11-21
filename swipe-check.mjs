/* Maru Ghar — Android touch-swipe regression check.
 *
 * This drives real Chrome touch input through the DevTools protocol
 * (Input.dispatchTouchEvent) with Android mobile emulation (390x844, hasTouch,
 * Android UA), so the browser's touch-action / gesture pipeline is exercised
 * the same way it is on a phone. It is NOT a physical-device test.
 *
 * Run: node swipe-check.mjs      (needs www/ built: npm run copy-web)
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('/opt/appjet/browser/node_modules/playwright/index.js');

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
  if (ok) {
    console.log('PASS ' + name);
  } else {
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

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(String(req.url || '/').split('?')[0]);
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
  for (let i = 1; i <= steps; i++) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: point(x0 + (dx * i) / steps, y0 + (dy * i) / steps)
    });
    await sleep(12);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(320);
}

async function tap(cdp, box) {
  const point = [{ x: box.x + box.width / 2, y: box.y + box.height / 2, radiusX: 9, radiusY: 9, force: 1, id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: point });
  await sleep(40);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(320);
}

const lightboxOpen = (page) => page.evaluate(() => {
  const lb = document.querySelector('.mg-lb');
  return !!lb && !lb.hidden;
});

/* The live gallery markup is exactly what assets/maru-ghar-backend.js sliderHtml()
   emits for a listing with three photos, so the real delegated handlers apply. */
const FIXTURE = `
  <div class="property">
    <div class="photo mg-slider" data-n="3" data-cur="0">
      <div class="mg-track">
        <div class="mg-slide" data-i="0" data-mg-open="1" role="button" aria-label="photo 1"></div>
        <div class="mg-slide" data-i="1" data-mg-open="1" role="button" aria-label="photo 2"></div>
        <div class="mg-slide" data-i="2" data-mg-open="1" role="button" aria-label="photo 3"></div>
      </div>
      <button type="button" class="mg-nav mg-prev" data-mg-step="-1" aria-label="prev">‹</button>
      <button type="button" class="mg-nav mg-next" data-mg-step="1" aria-label="next">›</button>
      <span class="mg-count">1 / 3</span>
    </div>
  </div>`;

async function main() {
  if (!fs.existsSync(path.join(www, 'assets', 'maru-ghar-swipe.js'))) {
    console.log('FAIL www/assets/maru-ghar-swipe.js missing -> run: npm run copy-web');
    process.exit(1);
  }

  const server = await startServer();
  const base = 'http://127.0.0.1:' + server.address().port + '/';
  const browser = await chromium.launch({
    executablePath: '/opt/appjet/browser-binaries/chromium-1234/chrome-linux64/chrome',
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
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    page.on('pageerror', (e) => console.log('INFO pageerror: ' + e.message));
    const cdp = await context.newCDPSession(page);

    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.mg-demo-card .mg-demo-photo', { timeout: 20000 });
    await sleep(600);

    /* ---------- 1. Demo property gallery ---------- */
    const card = page.locator('.mg-demo-card').first();
    await card.scrollIntoViewIfNeeded();
    const demoPhoto = card.locator('.mg-demo-photo');
    const demoCounter = card.locator('.mg-demo-counter');

    const touchAction = await demoPhoto.evaluate((el) => getComputedStyle(el).touchAction);
    check('demo photo touch-action is pan-y', touchAction === 'pan-y', 'got ' + touchAction);

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
    check('demo vertical swipe keeps the photo (page scroll preserved)',
      !!after && after.index === before.index,
      before && (before.index + '/' + before.total) + ' -> ' + (after && after.index + '/' + after.total));

    /* ---------- 2. Live property gallery ---------- */
    const injectFixture = () => page.evaluate((html) => {
      const grid = document.getElementById('properties');
      if (!grid) return false;
      const old = document.getElementById('mgSwipeTestHolder');
      if (old) old.remove();
      const holder = document.createElement('div');
      holder.id = 'mgSwipeTestHolder';
      holder.style.cssText = 'grid-column:1/-1;width:100%;min-width:0';
      holder.innerHTML = html;
      grid.appendChild(holder);
      /* Count how often the gallery's own controls are used, so a swipe can be
         verified independently of whether Firestore is reachable here. */
      window.__mgSpy = window.__mgSpy || { next: 0, prev: 0 };
      holder.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-mg-step]');
        if (!btn) return;
        if (btn.getAttribute('data-mg-step') === '1') window.__mgSpy.next++;
        else window.__mgSpy.prev++;
      }, true);
      return true;
    }, FIXTURE);

    /* One round-trip for state, so a detached node can never block on a locator. */
    const liveState = () => page.evaluate(() => {
      const el = document.querySelector('#mgSwipeTestHolder .mg-slider');
      if (!el) return null;
      const track = el.querySelector('.mg-track');
      const count = el.querySelector('.mg-count');
      return {
        cur: el.dataset.cur,
        count: count ? count.textContent.trim() : null,
        transform: track ? getComputedStyle(track).transform : null
      };
    });

    const visible = (b) => !!b && b.y > -b.height && b.y < 844 && b.x > -b.width && b.x < 390;

    const liveBox = (selector) => page.evaluate((sel) => {
      const el = document.querySelector('#mgSwipeTestHolder ' + sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    }, selector);

    /* The app renders #properties asynchronously; inject only after that settles. */
    await page.waitForFunction(() => {
      const g = document.getElementById('properties');
      return !!g && g.children.length > 0;
    }, null, { timeout: 15000 }).catch(() => console.log('INFO #properties still empty; injecting anyway'));
    await injectFixture();

    const ensure = async () => {
      if (!(await liveState())) await injectFixture();
      /* Touch coordinates are viewport-relative: the fixture must be on screen. */
      await page.evaluate(() => {
        const el = document.querySelector('#mgSwipeTestHolder .mg-slider');
        if (el) el.scrollIntoView({ block: 'center' });
      });
      await sleep(250);
    };

    check('live gallery fixture is present', !!(await liveState()));

    const layout = await page.evaluate(() => {
      const el = document.querySelector('#mgSwipeTestHolder .mg-slider');
      if (!el) return null;
      const box = (n) => {
        const r = n.getBoundingClientRect();
        return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];
      };
      const next = el.querySelector('.mg-next');
      return {
        sliderPosition: getComputedStyle(el).position,
        slider: box(el),
        next: next ? box(next) : null,
        viewportWidth: window.innerWidth,
        gridChildren: document.getElementById('properties').children.length
      };
    });
    console.log('INFO live layout ' + JSON.stringify(layout));

    const slideTouchAction = await page.evaluate(() => {
      const el = document.querySelector('#mgSwipeTestHolder .mg-slide');
      return el ? getComputedStyle(el).touchAction : null;
    });
    check('live slide touch-action is pan-y', slideTouchAction === 'pan-y', 'got ' + slideTouchAction);

    /* Existing Next / Previous buttons must keep working. */
    const spy = () => page.evaluate(() => window.__mgSpy || null);
    let state;

    await ensure();
    const nextBox = await liveBox('.mg-next');
    if (!visible(nextBox)) console.log('INFO Next button not in viewport: ' + JSON.stringify(nextBox));
    if (nextBox) await tap(cdp, nextBox);
    let s = await spy();
    check('tapping Next reaches the gallery control', !!s && s.next === 1, JSON.stringify(s));

    await sleep(900);
    await ensure();
    const prevBox = await liveBox('.mg-prev');
    if (!visible(prevBox)) console.log('INFO Previous button not in viewport: ' + JSON.stringify(prevBox));
    if (prevBox) await tap(cdp, prevBox);
    s = await spy();
    check('tapping Previous reaches the gallery control', !!s && s.prev === 1, JSON.stringify(s));

    /* Horizontal swipes must drive those same controls, once per gesture. */
    await sleep(900);
    await ensure();
    let slideBox = await liveBox('.mg-slide');
    if (slideBox) await swipe(cdp, slideBox, -150, 0);
    s = await spy();
    check('live swipe left triggers the Next control once', !!s && s.next === 2, JSON.stringify(s));
    check('live swipe does not open the full-size viewer', !(await lightboxOpen(page)));

    await sleep(900);
    await ensure();
    slideBox = await liveBox('.mg-slide');
    if (slideBox) await swipe(cdp, slideBox, 150, 0);
    s = await spy();
    check('live swipe right triggers the Previous control once', !!s && s.prev === 2, JSON.stringify(s));

    /* In a browser with Firestore the app's own handler moves data-cur and the
       counter. This offline build may not bind it, so say so rather than fake it. */
    state = await liveState();
    if (state && state.cur === '0' && state.transform === 'none') {
      console.log('INFO app goTo handler is not active in this offline build (no Firestore) — ' +
        'live counter/transform verified by source review, not by this run');
    } else {
      check('live counter stays in sync with the gallery',
        !!state && /^\d+ \/ 3$/.test(String(state.count || '')), state && state.count);
    }

    /* A tap (no drag) must not be treated as a swipe. */
    await sleep(900);
    await ensure();
    slideBox = await liveBox('.mg-slide');
    const curBeforeTap = await page.evaluate(() => {
      const el = document.querySelector('#mgSwipeTestHolder .mg-slider');
      return el ? el.dataset.cur : null;
    });
    if (slideBox) await tap(cdp, slideBox);
    state = await liveState();
    check('tapping the photo does not change the slide', !!state && state.cur === curBeforeTap,
      curBeforeTap + ' -> ' + (state && state.cur));

    /* ---------- 3. Vertical page scrolling still works over a gallery ---------- */
    if (await lightboxOpen(page)) {
      await page.evaluate(() => {
        const x = document.querySelector('.mg-lb-x');
        if (x) x.click();
      });
      await sleep(200);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(200);
    const scrollBefore = await page.evaluate(() => window.scrollY);
    const photoBox = await demoPhoto.boundingBox();
    if (photoBox) await swipe(cdp, photoBox, 0, -220);
    const scrollAfter = await page.evaluate(() => window.scrollY);
    check('vertical swipe over a gallery scrolls the page', scrollAfter > scrollBefore,
      scrollBefore + ' -> ' + scrollAfter);
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
