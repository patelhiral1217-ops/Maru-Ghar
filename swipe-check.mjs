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
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const point = [{ x, y, radiusX: 9, radiusY: 9, force: 1, id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: point });
  await sleep(40);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(320);
}

const lightboxOpen = (page) => page.evaluate(() => {
  const lb = document.querySelector('.mg-lb');
  return !!lb && !lb.hidden;
});

/* Touch-tap a control the way a phone does, and report what is on top of it. */
async function tapButton(page, cdp, locator) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) {
    console.log('INFO tap target has no box');
    return;
  }
  const info = await locator.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    const label = (n) => (n ? n.tagName.toLowerCase() + '.' + String(n.className || '').split(' ')[0] : 'none');
    return { target: label(el), topmost: label(hit) };
  });
  console.log('INFO tap ' + info.target + ' -> topmost: ' + info.topmost);
  await tap(cdp, box);
}

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
    await swipe(cdp, box, -150, 0); // swipe left -> next photo
    let after = parseCounter(await demoCounter.textContent());
    check('demo swipe left advances one photo',
      !!after && after.index === ((before.index % before.total) + 1),
      before && (before.index + '/' + before.total) + ' -> ' + (after && after.index + '/' + after.total));

    check('demo swipe does not open the full-size viewer', !(await lightboxOpen(page)));

    before = after;
    box = await demoPhoto.boundingBox();
    await swipe(cdp, box, 150, 0); // swipe right -> previous photo
    after = parseCounter(await demoCounter.textContent());
    check('demo swipe right goes back one photo',
      !!after && after.index + ' / ' + after.total === expectedAfter(before, -1),
      before && (before.index + '/' + before.total) + ' -> ' + (after && after.index + '/' + after.total));

    before = after;
    box = await demoPhoto.boundingBox();
    await swipe(cdp, box, 0, -170); // vertical -> page scroll, not photo change
    after = parseCounter(await demoCounter.textContent());
    check('demo vertical swipe keeps the photo (page scroll preserved)',
      !!after && after.index === before.index,
      before && (before.index + '/' + before.total) + ' -> ' + (after && after.index + '/' + after.total));

    /* ---------- 2. Live property gallery (same markup the renderer emits) ---------- */
    await page.evaluate(() => {
      const grid = document.getElementById('properties');
      if (!grid) return;
      const old = document.getElementById('mgSwipeTestHolder');
      if (old) old.remove();
      const holder = document.createElement('div');
      holder.id = 'mgSwipeTestHolder';
      holder.style.cssText = 'grid-column:1/-1;width:100%;min-width:0';
      holder.innerHTML = `
        <div class="property">
        <div class="photo mg-slider" data-n="3" data-cur="0">
          <div class="mg-track">
            <div class="mg-slide" data-i="0" data-mg-open="1" role="button" data-bg="assets/images/house.jpg"></div>
            <div class="mg-slide" data-i="1" data-mg-open="1" role="button" data-bg="assets/images/flat.jpg"></div>
            <div class="mg-slide" data-i="2" data-mg-open="1" role="button" data-bg="assets/images/shop.jpg"></div>
          </div>
          <button type="button" class="mg-nav mg-prev" data-mg-step="-1" aria-label="પાછળનો">‹</button>
          <button type="button" class="mg-nav mg-next" data-mg-step="1" aria-label="આગળનો">›</button>
          <span class="mg-count">1 / 3</span>
        </div>
        </div>`;
      grid.appendChild(holder);
    });

    const slider = page.locator('#mgSwipeTestHolder .mg-slider');
    check('live gallery fixture is present', (await slider.count()) === 1);
    await slider.scrollIntoViewIfNeeded();

    const layout = await slider.evaluate((el) => {
      const box = (n) => {
        const r = n.getBoundingClientRect();
        return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];
      };
      const next = el.querySelector('.mg-next');
      return {
        sliderPosition: getComputedStyle(el).position,
        slider: box(el),
        next: box(next),
        nextOffsetParent: next.offsetParent ? next.offsetParent.className || next.offsetParent.tagName : 'none',
        gridChildren: document.getElementById('properties').children.length
      };
    });
    console.log('INFO live layout ' + JSON.stringify(layout));

    const slideTouchAction = await slider.locator('.mg-slide').first()
      .evaluate((el) => getComputedStyle(el).touchAction);
    check('live slide touch-action is pan-y', slideTouchAction === 'pan-y', 'got ' + slideTouchAction);

    const count = slider.locator('.mg-count');
    const cur = () => slider.evaluate((el) => el.dataset.cur);

    /* Existing buttons must keep working. */
    await tapButton(page, cdp, slider.locator('.mg-next'));
    check('live Next button advances the photo', (await cur()) === '1', 'cur=' + (await cur()));
    check('live counter follows Next button', (await count.textContent()).trim() === '2 / 3',
      await count.textContent());
    await sleep(200);
    await tapButton(page, cdp, slider.locator('.mg-prev'));
    check('live Previous button goes back', (await cur()) === '0', 'cur=' + (await cur()));
    check('live counter follows Previous button', (await count.textContent()).trim() === '1 / 3',
      await count.textContent());

    /* Horizontal swipes on the live gallery. */
    let liveBox = await slider.locator('.mg-slide').first().boundingBox();
    await swipe(cdp, liveBox, -150, 0);
    check('live swipe left advances to photo 2', (await cur()) === '1', 'cur=' + (await cur()));
    check('live counter updates on swipe', (await count.textContent()).trim() === '2 / 3',
      await count.textContent());
    const trackShift = await slider.locator('.mg-track')
      .evaluate((el) => getComputedStyle(el).transform);
    check('live slider transform follows the swipe', trackShift !== 'none', trackShift);
    check('live swipe does not open the full-size viewer', !(await lightboxOpen(page)));

    await sleep(900); // let the post-swipe click guard expire
    liveBox = await slider.locator('.mg-slide').first().boundingBox();
    await swipe(cdp, liveBox, 150, 0);
    check('live swipe right returns to photo 1', (await cur()) === '0', 'cur=' + (await cur()));
    check('live counter returns to 1 / 3', (await count.textContent()).trim() === '1 / 3',
      await count.textContent());

    /* A tap (no drag) must not be treated as a swipe. */
    await sleep(900);
    liveBox = await slider.locator('.mg-slide').first().boundingBox();
    const curBeforeTap = await cur();
    await tap(cdp, liveBox);
    check('tapping the photo does not change the slide', (await cur()) === curBeforeTap,
      curBeforeTap + ' -> ' + (await cur()));

    /* ---------- 3. Vertical page scrolling still works over a gallery ---------- */
    if (await lightboxOpen(page)) {
      await page.locator('.mg-lb-x').click().catch(() => {});
      await sleep(200);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(200);
    const scrollBefore = await page.evaluate(() => window.scrollY);
    const photoBox = await demoPhoto.boundingBox();
    await swipe(cdp, photoBox, 0, -220);
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
