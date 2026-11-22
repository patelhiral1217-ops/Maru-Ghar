# Maru Ghar — Master Project Status

**Snapshot date:** 21 November 2026
**Repository:** https://github.com/patelhiral1217-ops/Maru-Ghar
**Branch:** `appjet`
**Latest reported application-code commit:** `a54d9527ad1fe5c39c9324a33ed1831296421ccb`
**Latest reported branch HEAD:** `a54d9527ad1fe5c39c9324a33ed1831296421ccb`. See the current-state addendum at the end; older sections are historical baseline notes.
**Firebase project:** `maru-ghar-gandhinagar-8dbe4`
**Purpose of this file:** authoritative handoff so any future session (ChatGPT, AppJet or a human developer) can resume without re-discovering the project.

**Advertisement Manager:** a new feature was added on top of the swipe-fix work and the PR #99 branch state — see **section 14**. It is implemented and locally verified but **not merged and not deployed**.

> This snapshot is documentation only. No application code, Firebase
> configuration, Firestore rules, workflow or test was modified to produce it.

---

## 1. Snapshot identity and verification

| Item | Value |
|---|---|
| Branch | `appjet` |
| Last application-code commit | `2271058bf8cabfb9ed497089212b9da18b7e1fc3` |
| Last application-code short | `2271058` |
| Documentation commits on top | `MASTER-PROJECT-STATUS.md`, `RESTORE-GUIDE.md` — no code change |
| Commits on `appjet` | 163 |
| Commits on `main` | 51 |
| Relationship | `main` **is an ancestor** of `appjet` — history is linear, so a pull request shows only the swipe work |
| Code commits after `2271058` | **0** — every later commit on `appjet` adds documentation only |
| Working tree | clean |

### Latest GitHub Actions results (both green)

Checked against the GitHub API for commit `2271058b`:

| Workflow | Check name | Status | Conclusion |
|---|---|---|---|
| Maru Ghar Quality Checks | `checks` | completed | **success** |
| Validate Maru Ghar changes | `validate` | completed | **success** |

The previous commit `ce04267d` was also green on both workflows.
Documentation-only commits on top of `2271058` run the same two workflows and
change no application code.

> Historical note: both workflows were failing before commit `7e9fdc7`.
> See section 6 for the root cause and the fix.

---

## 2. What Maru Ghar is

A Gujarati-first real-estate marketplace for homes, bungalows, flats, shops,
offices, plots and commercial property — primarily serving Gandhinagar and
Gujarat. It is a static web application (no build step for the site itself)
backed by Firebase, plus Capacitor-based Android packaging and an Electron
desktop build.

### Public pages

| File | Purpose |
|---|---|
| `index.html` | Main site — property search, listings, demo showcase, submission form |
| `admin.html` | Admin panel — approvals, listing management, settings, verification audit |
| `download.html` | Android / desktop download page |
| `privacy.html` | Privacy policy |

### Language support

Gujarati (default), Hindi and English. Selectors, persisted language choice,
`lang` attribute handling and a cached translation scan are all covered by
tests. Owner-entered content is intentionally **not** translated.

### Core feature set

- Property listings with owner submission form (sequential steps, collapsed by default)
- Approval workflow: listings are pending until an admin approves them
- Photo galleries with **bidirectional swipe** (horizontal and vertical), Next/Previous
  controls and photo counters — on both demo and live listings
- Discovery filters: ₹1,000–₹50 crore price range, square-metre filter,
  photo/video filter, saved search, 3-property comparison
- Customer authentication: registration, login, logout, auth-state listener, account data
- Owner property status view (owner-only listing read rule)
- Verification audit: evidence prompt, explicit confirmation, atomic badge + audit write,
  admin-only audit read/create, immutable history
- Maps + WhatsApp sharing: trusted map hosts, hostile URL rejection, Indian mobile
  normalization, invalid-number blocking, safe external WhatsApp launch
- Notifications: retry-idempotent price-drop alerts, wishlist targeting, bounded
  Firestore batches, UID-private access, read-only customer updates, admin FCM registration
- Advertisement slots: present but **hidden by default**; no fake publisher ID is loaded
- OTA update module for the Android app (HTTPS manifest on Firebase Hosting)
- Master admin controls

---

## 3. Repository map

```
.
├── index.html, admin.html, download.html, privacy.html   # the four pages
├── assets/                       # 42 entries: JS modules, CSS, images/
│   ├── maru-ghar-swipe.js        # the bidirectional swipe module (core of PR #99)
│   ├── maru-ghar-backend.js      # data layer
│   ├── maru-ghar-demo-showcase.js
│   ├── maru-ghar-admin-*.js/css  # admin panel modules
│   ├── maru-ghar-i18n*.js        # translation engines
│   └── images/                   # property photos (house, bungalow, flat, shop,
│                                 # office, plot, commercial)
├── www/                          # 10 entries — generated copy served by Capacitor/Firebase
│   └── assets/                   # mirrors of assets/ produced by scripts/copy-web.mjs
├── firebase-config.js            # public Firebase web config (client identifiers only)
├── firebase.json                 # Hosting/Firestore/Functions targets
├── .firebaserc                   # project alias → maru-ghar-gandhinagar-8dbe4
├── firestore.rules               # security rules (12/12 checks pass)
├── firestore.indexes.json        # composite indexes
├── google-services.json          # Android Firebase client config (public client keys only)
├── manifest.webmanifest          # PWA manifest
├── capacitor.config.json         # Android shell configuration
├── functions/                    # Cloud Functions (Node 22)
│   ├── index.js
│   ├── free-notification-worker.js
│   └── package.json
├── desktop/                      # Electron desktop app
│   └── main.cjs                  # BrowserWindow, sandbox + contextIsolation,
│                                 # setWindowOpenHandler, will-navigate guard
├── scripts/
│   ├── copy-web.mjs              # source → www mirroring
│   ├── hosting-preflight.mjs
│   └── maru-ghar-ota.js
├── *.mjs                         # 16 test/verification scripts (see section 5)
├── package.json / package-lock.json
└── .github/workflows/            # 7 workflows (see section 7)
```

### Important: the Android project is not committed

There is **no `android/` directory in the repository**. The Capacitor Android
project is generated at build time inside `.github/workflows/android-apk.yml`.
`capacitor.config.json` is the source of truth for that shell. Any session that
expects to find a pre-generated `android/` folder should run `npx cap add android`
instead.

---

## 4. Complete project history

### Phase 1 — Repository audit (read-only)

Full structural review: branch layout, page inventory, Firebase configuration,
Firestore rules, security posture. No files modified.

### Phase 2 — Deep functional audit

Reviewed every page, button, navigation path, login/registration, listing form,
search filters, city/area selection, admin panel, approval workflow, photo
uploads, Firebase integration, Firestore rules, notifications, maps, WhatsApp
sharing and mobile responsiveness. Reported working / partial / broken features,
security risks and Firebase deployment gaps, clearly separating source-code
inspection from browser- or live-Firebase-verified behaviour.

### Phase 3 — Assets and homepage slider

Added local property photography for every property type, made the homepage
"આપણું સપનું ઘર તથા વ્યવસાય માટે યોગ્ય જગ્યા" slider auto-advance with working
Previous/Next controls, and checked both mobile and desktop layouts.

### Phase 4 — Swipe bug (the core of PR #99)

**Reported bug:** property photo galleries would not swipe left/right on Android.
Earlier attempts using Pointer Events and Touch Events had not solved it.

**Actual root cause:** conflicting gesture handling and CSS `touch-action` values
between the gallery surface, the page scroll container and image dragging. The
fix landed as `assets/maru-ghar-swipe.js` — a single gesture module with correct
`touch-action: pan-y` on slides, pointer capture, propagation control and slider
transform ownership, so horizontal swipe no longer fights vertical page scroll.
Next/Previous buttons and counters were verified to still work and the Next
control is confirmed not to be covered by the slider.

Both demo and live galleries are covered. Vertical navigation is preserved where
it is intentionally supported (admin can choose vertical or horizontal as the
saved photo direction).

### Phase 5 — Rebase onto latest `main`

`appjet` had drifted (28 ahead / 59 behind). It was updated onto
`main@5066dfc` while preserving every newer `main` feature, restoring the
`master-admin-check` test in `package.json`, and restoring the Electron /
electron-builder dependencies plus the desktop build configuration. Conflicts
were resolved without overwriting newer `main` work, `www` was regenerated, and
the full original test suite plus the new swipe tests were run. History is
linear, so the PR shows only the swipe-related work.

### Phase 6 — GitHub Actions failure fix (`7e9fdc7`)

**Both failing checks had a single shared root cause.** `swipe-check.mjs`
hardcoded AppJet sandbox paths:

```js
require('/opt/appjet/browser/node_modules/playwright/index.js')
// plus a fixed Chromium build under /opt/appjet/browser-binaries/
```

Those paths do not exist on GitHub's `ubuntu-latest` runners, so the script
exited with `MODULE_NOT_FOUND`. Because **both** workflows end with `npm test`
(whose final step is `node swipe-check.mjs`), one defect failed both
`Maru Ghar Quality Checks / checks` and `Validate Maru Ghar changes / validate`.
The failure was reproduced locally by hiding `/opt/appjet` with `unshare -m`.

A second, latent defect surfaced during the fix: `package-lock.json` contained
**no `electron` or `electron-builder` entries** despite `package.json` requiring
them, so `npm ci` could never have succeeded.

Fix (5 files, no test weakened or removed):

| File | Change |
|---|---|
| `swipe-check.mjs` | Portable Playwright resolution (`playwright` → `playwright-core` → sandbox fallback) and `chromeExecutable()` trying `MG_CHROME_PATH`, sandbox, ms-playwright cache, system Chrome, then `chromium.executablePath()`; clear error instead of `MODULE_NOT_FOUND` |
| `package.json` | Added devDependency `playwright ^1.65.1` |
| `.github/workflows/quality-checks.yml` | `npm install` + `npx playwright install --with-deps chromium` before `copy-web` |
| `.github/workflows/validate-pr.yml` | Same Chromium install after its `npm install` |
| `package-lock.json` | Regenerated, restoring the missing electron entries |

### Phase 7 — Dependency security fix (`2271058`, current HEAD)

The dependency scan reported **7 blocking HIGH findings**, all in
`electron@39.8.10`:

- `GHSA-9qh4-3jw8-366w`
- `GHSA-gr2m-v5gq-v685`
- `GHSA-hq2x-r82h-9wj4`

These had been **invisible** because the lockfile contained no electron entry at
all. Latest stable Electron was 45.4.1, so the supported window is 43/44/45 and
41/42 are already end-of-life. Electron was raised to `^43.8.12` — the lowest
**supported** release that clears all three advisories (43.4.1+ required).

Desktop configuration was left intact: same `appId`, `productName`, `nsis`
target, `desktop:win` script, `electron-builder 26.18.0` and `desktop/main.cjs`,
which uses only stable `BrowserWindow` / `setWindowOpenHandler` / `will-navigate`
APIs.

Result: dependency scan **0 high/critical** across 299 packages.

---

## 5. Test inventory

`npm test` runs 16 scripts in sequence. All pass at this snapshot.

| # | Script | Coverage |
|---|---|---|
| 1 | `smoke-check.mjs` | 34 required files, JSON/JS syntax, inline modules, www sync, admin features, security-rule markers |
| 2 | `i18n-check.mjs` | Selectors, persisted language, page `lang`, privacy/download dictionaries, www mirrors |
| 3 | `i18n-coverage-check.mjs` | All extracted static Gujarati UI text translates to Hindi/English |
| 4 | `i18n-dom-regression-check.mjs` | Language switching uses cached text; owner content unchanged |
| 5 | `ui-regression-check.mjs` | Shared dictionaries across all four pages; property panel open/close |
| 6 | `discovery-check.mjs` | ₹1,000–₹50 crore range, sqm filter, collapsed controls, photo/video filter, saved search, comparison |
| 7 | `ads-check.mjs` | Hidden ad slots; no fake publisher ID |
| 8 | `customer-auth-check.mjs` | Registration, login, logout, auth listener, owner status view, owner-only rule, error mappings, `file://` guard |
| 9 | `verification-audit-check.mjs` | Evidence prompt, atomic badge+audit write, admin-only audit access, immutable history |
| 10 | `maps-whatsapp-check.mjs` | Trusted map hosts, hostile URL rejection, Indian mobile normalization, safe external launch |
| 11 | `notifications-audit-check.mjs` | Retry-idempotent price drops, approved-listing guard, wishlist targeting, UID-private access, FCM markers |
| 12 | `final-firestore-rules-check.mjs` | 12/12 rule assertions |
| 13 | `firebase-deploy-preflight.mjs` | Target project, rules/index paths, Node 22 Functions source, privacy guards, required functions |
| 14 | `ota-check.mjs` | 7 OTA assertions (HTTPS manifest, host restriction, apply-at-next-launch, workflow wiring) |
| 15 | `master-admin-check.mjs` | 14/14 master-admin assertions |
| 16 | `swipe-check.mjs` | 25 assertions — demo + live galleries, horizontal and vertical swipe, counters, slider transform, Next/Previous not covered |

`npm run test:swipe` runs only the swipe check.

**What these tests are not:** most are static/source-level checks, not browser E2E
or live-Firebase proof. `swipe-check.mjs` is the one that drives a real Chromium
instance, and even that is automation — not a physical Android device.

---

## 6. Current status: PR #99

| Field | Value |
|---|---|
| Number | **#99** |
| Title | Fix bidirectional property photo swipe on mobile |
| URL | https://github.com/patelhiral1217-ops/Maru-Ghar/pull/99 |
| State | **open** |
| Draft | no |
| Merged | **no** |
| Mergeable | **yes** — `mergeable_state: clean` |
| Head | `appjet` @ `2271058b` |
| Base | `main` |
| Commits in PR | 42 |
| Changed files | 24 |
| Diff | +5,813 / −121 |
| CI | both checks green |

**PR #99 has deliberately not been merged.** Do not merge it without the owner's
explicit approval. Do not deploy.

---

## 7. Workflows

| Workflow | Trigger | Purpose |
|---|---|---|
| `quality-checks.yml` | push / PR | `Maru Ghar Quality Checks` — install, Chromium, `copy-web`, `npm test` |
| `validate-pr.yml` | pull request | `Validate Maru Ghar changes` — same gate for PRs |
| `android-apk.yml` | push / manual | Generates the Capacitor Android project and builds the APK |
| `windows-exe.yml` | push to `main` | Electron NSIS installer build |
| `deploy-firebase.yml` | push / manual | Firebase Hosting + rules deployment |
| `deploy-firebase-manual.yml` | manual | Manual deployment entry point |
| `free-notifications.yml` | scheduled | Free notification worker |

---

## 8. Firebase configuration status

### Present and committed (no secrets)

- `.firebaserc` → `maru-ghar-gandhinagar-8dbe4`
- `firebase.json` → Hosting/Firestore/Functions targets
- `firestore.rules` → 12/12 static assertions pass
- `firestore.indexes.json`
- `firebase-config.js` → public web config (`apiKey`, `authDomain`, `projectId`,
  `storageBucket`, `messagingSenderId`, `appId`) plus public Cloudinary
  `cloudName`/upload presets and ad-slot settings
- `google-services.json` → Android client config (public client identifiers)
- `functions/` → Node 22 Cloud Functions source

These values are **public client identifiers**, which is normal for Firebase web
and Android apps — they are not server secrets. No service-account key, private
key, `.env` file or token is present in this backup.

### Still requiring the owner's Firebase console access

1. **Deploy the current rules** — `firestore.rules` and `firestore.indexes.json`
   must be deployed to `maru-ghar-gandhinagar-8dbe4`; the local preflight does not
   compile or deploy them.
2. **Enable Authentication providers** (Email/Password at minimum) and add the
   production host to Authorized Domains.
3. **Deploy Cloud Functions** — `functions/` has never been verified against the
   live project from here.
4. **Firebase Hosting deploy** — not performed in this task.
5. **FCM** — web push requires a VAPID key and registered service worker in the
   console.
6. **Storage rules** — confirm bucket rules for photo uploads.
7. **Cloudinary** — upload presets must exist and be unsigned/signed as intended.

---

## 9. Dependency security status

| Metric | Value |
|---|---|
| Packages checked | 299 |
| High / critical | **0** |
| Blocking findings | **0** |
| Moderate (non-blocking) | 2 — `minimatch` 9.0.9 and 10.2.6 (fixed in 11.0.1) |

The two `minimatch` findings come from electron-builder's build-time toolchain,
not shipped application code. Force-pinning `minimatch@11` across those
transitive dependencies risks breaking the Windows installer build, so they were
reported rather than force-pinned.

The scan covers resolved npm dependencies only. It does not prove source-code
security, authorization correctness, or that Firestore rules were deployed.

---

## 10. Completed work

1. Repository audit and deep functional audit of all pages and features.
2. Local property photos for every property type added to `assets/`.
3. Homepage slider auto-advance plus working Previous/Next.
4. Root-caused and fixed Android photo-swipe failure (`assets/maru-ghar-swipe.js`).
5. Preserved vertical photo navigation and admin-selectable swipe direction.
6. Verified Next/Previous buttons and counters on demo and live galleries.
7. Rebased `appjet` onto latest `main` with no feature loss; restored
   `master-admin-check`, Electron deps and desktop build config.
8. Regenerated `www` from source.
9. Fixed both GitHub Actions failures at their shared root cause.
10. Restored the missing electron/electron-builder lockfile entries.
11. Cleared all 7 blocking HIGH dependency advisories via Electron 43.8.12.
12. All 16 test scripts passing; both workflows green.
13. Opened PR #99 (unmerged) for owner review.

---

## 11. Pending work

| # | Item | Owner action needed |
|---|---|---|
| 1 | Merge PR #99 into `main` | Owner approval required — do not merge unilaterally |
| 2 | Deploy Firestore rules + indexes to `maru-ghar-gandhinagar-8dbe4` | Firebase console / CLI credentials |
| 3 | Deploy Cloud Functions | Firebase credentials + billing if required |
| 4 | Firebase Hosting deployment | Firebase credentials |
| 5 | Enable Auth providers + authorized domains | Firebase console |
| 6 | Configure FCM VAPID key | Firebase console |
| 7 | Verify Storage bucket rules for uploads | Firebase console |
| 8 | Build and verify the Electron 43 Windows EXE | `windows-exe.yml` runs only on push to `main`; not yet exercised with Electron 43 |
| 9 | Real Android device swipe test | Physical device — automated Chromium is not equivalent |
| 10 | Optionally resolve the 2 moderate `minimatch` advisories | Risk to the installer build; needs testing |
| 11 | Deploy the updated `firestore.rules` so the new `advertisements` block exists in `maru-ghar-gandhinagar-8dbe4` | Firebase console / CLI credentials. Until then the Advertisement Manager panel cannot read or write ads in production |
| 12 | Review and approve the Advertisement Manager (section 14) | Owner approval — nothing was merged or deployed |

---

## 12. Known limitations of this snapshot

1. Swipe behaviour is verified by automated Chromium automation, **not** a
   physical Android device.
2. The Electron 43 Windows installer was **not** built here — native desktop
   builds are outside this environment, and `windows-exe.yml` only runs on pushes
   to `main`.
3. `android/` is generated in CI; the APK was not rebuilt in this task.
4. Firestore rules were statically checked, not compiled in the emulator or
   deployed to the live project.
5. Firebase, Functions and Hosting were **not** deployed in this task.
6. Most test scripts are static source assertions, not browser E2E.
7. The dependency scan reflects the advisory snapshot at scan time.

---

## 13. Backup contents

`MARU-GHAR-MASTER-BACKUP-21-NOV-2026.zip` contains:

- the complete tracked repository at `2271058` (166 tracked files), plus this file and `RESTORE-GUIDE.md`
- all four pages, `www/`, `assets/` including `assets/images/`, and the admin panel
- Firebase config, `firestore.rules`, `firestore.indexes.json`, `firebase.json`
- `functions/`, `desktop/` (Electron), `capacitor.config.json` and `google-services.json`
- all 17 test scripts and every configuration file
- the Advertisement Manager: `assets/maru-ghar-ad-constants.js`, `maru-ghar-ad-manager.js`, `maru-ghar-ad-manager.css`, `maru-ghar-ad-manager-admin.js`, `maru-ghar-ad-manager-admin.css` and `ads-manager-check.mjs`
- the full `.git` history, so the repository can be restored with complete history
- `MASTER-PROJECT-STATUS.md` (this file) and `RESTORE-GUIDE.md`

Deliberately excluded: `node_modules/` (15 MB of installable dependencies —
restore with `npm ci`), and any file that would contain a secret (none exist in
the repository).

---

## 14. Advertisement Manager (added 21 November 2026)

**Status: implemented and verified locally. NOT merged into `main`. NOT deployed.**

The user's instruction for this feature was explicit: preserve every existing
feature and the PR #99 work, and do not merge or deploy. Both were respected —
no pull request was created or merged and no Firebase/Hosting deployment ran.

### 14.1 Where it lives

| File | Role |
|---|---|
| `assets/maru-ghar-ad-constants.js` | Shared contract: 7 placements, 5/10/15/30/60 s presets, 3–300 s bounds, size/type limits, and the pure helpers `parseAdDuration`, `validateAdMedia`, `isSafeClickUrl`, `isAdLive`, `sortAds`, `toMillis`, `localInputToDate`, `dateToLocalInput` |
| `assets/maru-ghar-ad-manager-admin.js` | Admin panel controller: Cloudinary upload, create/edit/delete/replace, preview, enable/disable |
| `assets/maru-ghar-ad-manager.js` | Public renderer: reads live ads, rotates them, mounts them in the selected placements |
| `assets/maru-ghar-ad-manager.css` | Public styles (`touch-action: pan-y`, inline flow, responsive, reduced-motion) |
| `assets/maru-ghar-ad-manager-admin.css` | Admin panel styles |
| `admin.html` | New `#mgAdManagerPanel` section inside the existing `#adminMain` dashboard |
| `index.html` | Five ad mount points plus the module/style tags |
| `firestore.rules` | New `advertisements` block (section 14 of the rules file) |
| `scripts/copy-web.mjs` | Ships the five new assets into `www/` |
| `ads-manager-check.mjs` | 174 assertions covering this feature |
| `package.json` | `ads-manager-check.mjs` appended to the existing `npm test` chain |

### 14.2 Requirements coverage

| # | Requirement | How it is met |
|---|---|---|
| 1 | Image ads (JPG/PNG/WebP) | Cloudinary upload, MIME checked against a whitelist, 8 MB cap |
| 2 | Video ads (MP4) | Same path with the video preset, 25 MB cap |
| 3 | Placement selection | 7 predefined placements: homepage top, homepage middle, between listings, search results, property details, city page, offers/schemes |
| 4 | Independent duration | `durationSeconds` is stored per advertisement |
| 5 | Custom duration | 5/10/15/30/60 s presets plus a custom field, clamped to 3–300 s and rounded to whole seconds |
| 6 | Start and expiry dates | `startAt` / `expiryAt` timestamps, validated so expiry is after start |
| 7 | Enable/disable | `enabled` flag, also enforced by the Firestore rules |
| 8 | Priority and order | `priority` then `order`, applied by `sortAds` |
| 9 | Optional click-through URL | `clickUrl`, accepted only for `http(s)`; `javascript:`/`data:` rejected |
| 10 | Preview before publishing | In-panel preview of the selected media with its placement and duration |
| 11 | Edit / delete / replace | Firestore `updateDoc` / `deleteDoc`, plus file replacement |
| 12 | Mobile and desktop | Responsive CSS; a `position: fixed` overlay is explicitly forbidden |
| 13 | Video autoplay muted + fallback | `muted playsinline controls`; a rejected `play()` falls back to visible controls instead of a silent failure |
| 14 | Never blocks photo swipes | The renderer registers **no** touch/pointer listeners and the CSS uses `touch-action: pan-y`, so the property galleries keep full ownership of horizontal gestures |
| 15 | Existing architecture, no secrets | Cloudinary unsigned presets and Firebase, matching the project; no credential is written into source |

### 14.3 Display behaviour

- Only `enabled == true` documents are queried, and the start/expiry window is
  evaluated on the client. The rules deliberately contain **no** `request.time`
  comparison in the read rule: rules are not filters, so a date comparison there
  would reject the whole list query.
- Multiple ads in one placement rotate by `priority`/`order`, and rotation stops
  after 3 cycles so the page is not turned into a slideshow.
- Rotation pauses when the tab is hidden or the slot leaves the viewport.
- Expired or disabled ads are never rendered.

### 14.4 Verification actually performed

- `node ads-manager-check.mjs` → **PASS, 174 assertions**.
- `npm test` → **PASS**, all 17 chained checks, including every pre-existing
  check (smoke, i18n structure/coverage/DOM, UI regression, discovery, AdSense
  slots, customer auth, verification audit, maps/WhatsApp, notifications,
  Firestore rules 12/12, Firebase preflight, OTA, master-admin 14/14 and the
  Android swipe suite).
- `www/` was regenerated with `node scripts/copy-web.mjs`.

### 14.5 Limitations of this feature's verification

1. Not exercised against live Firestore or Cloudinary, and no ad was uploaded —
   that needs the deployed rules and real admin credentials.
2. Not tested on a physical Android device; gesture isolation is proven by the
   automated Chromium swipe suite.
3. The `advertisements` rules block is only deployed when the owner deploys
   `firestore.rules` (pending work item 11).
4. The feature is present on `appjet` only; `main` and PR #99 are untouched.


---

## 15. Current-state addendum — 21 November 2026, 20:17 IST

This section supersedes older commit counts, feature-status statements and
backup references above wherever they conflict.

### Live GitHub state checked during handoff

- Repository: `patelhiral1217-ops/Maru-Ghar`
- Branch: `appjet`
- Latest reported HEAD: `a54d9527ad1fe5c39c9324a33ed1831296421ccb`
- GitHub compare API: `appjet` is **63 commits ahead and 0 behind** `main`.
- The merge base is the current `main` tip `5066dfc3077c560402a0a15b7b966b38a59afc89`.
- PR #99 is still the existing open PR from `appjet` into `main`; it is
  unmerged. Its scope now includes the Advertisement Manager as well as swipe
  work. Do not assume the PR description has been updated.
- GitHub Actions for HEAD `a54d9527`: both latest PR workflows completed with
  conclusion `success`: Quality Checks run `44915091402` and Validate run
  `44915091335`.

### Advertisement Manager — current reported implementation

The feature is reported complete on `appjet`: 7 placements; JPG/PNG/WebP
images up to 8 MB; MP4 videos up to 25 MB; per-ad duration presets plus custom
3–300 seconds; start/expiry window; enabled flag; priority/order; optional
HTTP(S) click URL; admin preview/edit/delete/replace; responsive layout;
muted video playback with controls/fallback; rotation capped at three cycles;
visibility/IntersectionObserver pausing. It registers no touch/pointer
listeners, preserving the property-photo swipe handlers.

The reported feature test passed 174 assertions and `npm test` passed all 17
chained checks, including the Android-emulated swipe suite (26 assertions).
These are reported automated checks, not a physical-device or live-service
verification.

### Current outstanding owner/deployment steps

1. Review and merge PR #99 only after owner approval.
2. Deploy updated `firestore.rules` to Firebase project
   `maru-ghar-gandhinagar-8dbe4`; until then production Firestore does not have
   the new `advertisements` rules.
3. Confirm Cloudinary unsigned upload presets and test a real admin image/video
   upload against live services.
4. Deploy Firebase Hosting only after merge and approval.
5. Test on a physical Android phone and verify the actual deployed website.
6. Rebuild a fresh Master Backup ZIP from this exact HEAD, then verify ZIP
   integrity and SHA-256. The previously supplied 21-Nov backup is an older
   snapshot and must not be represented as containing commit `a54d9527`.

No PR merge, Firestore deployment, Hosting deployment, or fresh backup archive
was performed as part of this status update.


---

## 16. Current-state audit addendum — 22 November 2026, 09:09 IST

This addendum supersedes conflicting statements in sections 6–15 above.

### Authoritative branch and merged work
- Active production/source branch: `main`.
- PR #99 (bidirectional photo swipe + Advertisement Manager) was merged on
  21 November 2026 at 14:51 UTC; merge commit:
  `95502140e3c4fcc5064d005a61073d980c21e9c8`.
- The earlier statement that PR #99 was still open/unmerged is obsolete.
- Latest audited main HEAD at this snapshot: `117c38ca8a70c6b9ba2fe414189c16406a6b6553`.
- Firebase project: `maru-ghar-gandhinagar-8dbe4`.

### Verified GitHub Actions on main
- Quality Checks run `44983683923`: **success** on `117c38ca`.
- Firebase Hosting Deploy run `44983683931`: **success** on `117c38ca`.
- The Hosting job rebuilt `www/` from the root source, deployed Hosting, compiled and
  deployed Firestore rules, and deployed Firestore indexes. Cloud Functions deployment
  was skipped because no Functions source had changed.
- The Android APK run `44983683943` was still **in progress** at snapshot time.
  Earlier run `44982631291` succeeded on `853c4878`; it produced a test APK
  signed with a generated debug key because a permanent release signing keystore
  was not available. It is not a Play Store production-signed APK.
- Latest public site:
  https://maru-ghar-gandhinagar-8dbe4.web.app/
- GitHub Actions:
  https://github.com/patelhiral1217-ops/Maru-Ghar/actions

### Latest code changes in this audit
- Removed the older duplicate header-photo rotation script that competed with the
  newer hard-fix controller. The retained controller advances loaded header images
  every 3 seconds. Regression assertion passed in Quality Checks run
  `44983683923`.
- Kept the main demo search integration: five built-in Gandhinagar sample records
  are present; demo records are labelled and use local category-photo assets
  (`assets/images/`) where configured.
- Kept the search scroll-restoration code and its source-level regression assertion.
- The deployed Hosting version includes the above source because the successful
  Hosting job rebuilt `www/` from root files.

### Automated checks actually observed passing
The latest Quality Checks log reported passes for: smoke/file integrity; Gujarati,
Hindi and English structure/coverage/DOM speed; demo/grid/settings regression;
two-direction property layout; mobile search source regression; Admin-selected
photo direction; bidirectional swipe; Android Pointer Events swipe; vertical
scroll + horizontal photo gesture separation; demo property search source check;
discovery filters/compare; ads and Advertisement Manager (174 assertions);
customer-auth static audit; verification audit; maps/WhatsApp; notification audit;
Firestore rules static checks (12/12); Firebase deploy preflight; OTA checks;
Master Admin checks (14/14); and Chromium swipe assertions for demo/live galleries.

### Still NOT proven by these checks
1. The search-scroll test is a source/regression assertion, not a complete live
   mobile search journey. The user's reported page-jump issue remains pending
   confirmation on a physical Android phone.
2. Five Gandhinagar demo records and their local photo mappings are present in
   source; the actual live phone display of all five cards still needs visual
   confirmation.
3. Header rotation has one controller and passes its code-level regression check;
   visual rotation on the user's phone still needs confirmation.
4. Swipe tests run in automated Chromium emulating Android gestures, not on the
   owner's physical phone.
5. Customer registration/login, owner listing upload, actual Cloudinary photo/video
   upload, Admin approve/reject/delete, and customer contact must still be exercised
   against the live Firebase project with real test accounts.
6. Cloudinary preset names `marughar_images` and `marughar_videos` exist in source
   configuration; their actual dashboard existence, unsigned-upload permissions,
   and file limits have not been verified from the Cloudinary console.
7. Firebase Authentication provider settings and authorized domains, FCM/VAPID
   configuration, and any required deployed Functions behavior still need live
   console/service verification.
8. The APK produced without the permanent signing secrets is a test/debug-signed
   build, not a release-ready Play Store package.

**Completion rule:** do not mark Maru Ghar fully complete until the above live
service and physical-device checks are completed. A passing CI run is not equivalent
to a complete mobile/Firebase end-to-end acceptance test.
