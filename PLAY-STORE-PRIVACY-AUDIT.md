# MARU GHAR — Google Play privacy and release audit

Audit source: the `restore-live-app` source branch. This is a source-code review, not a live Firebase/Cloudinary console audit. No app UI, CSS, public pages, Firebase rules, data, or Hosting files were changed.

## 1. Data flows found in source

- Firebase Authentication is used. The public listing backend calls `signInAnonymously()`; customer account flows use Firebase Auth. Anonymous visitors therefore still receive a Firebase UID even when no name, phone, or email is requested.
- Firestore stores property listing data, owner name, owner phone in private `listingContacts` records, customer profile/favorites/notifications, and enquiries.
- Cloudinary is configured for image and video uploads. The public unsigned preset names are present in `firebase-config.js`; confirm the live preset restrictions and retention settings in Cloudinary.
- Firebase Cloud Messaging is used for admin new-listing alerts. Admin device registration tokens are stored in Firestore `adminTokens`.
- Google AdSense configuration is currently blank in source. No Analytics or Crashlytics SDK was found in the reviewed config files. Re-check all dependencies and production runtime before declaring no ads/analytics.
- The reviewed web code uses external map/WhatsApp/call links. The reviewed Android packaging workflow adds notification permission. No use of device GPS was found in the reviewed core backend, but perform a complete permission and runtime scan before final declarations.

## 2. Data Safety form — draft categories to verify

Likely relevant based on source:
- Personal information: name, email address, phone number.
- Photos and videos: property images/videos uploaded by owners.
- App activity / other user-generated content: favorites, enquiries, notifications, property details, and submitted listing descriptions.
- Device or other identifiers: Firebase Auth UID for anonymous and registered users; admin FCM registration token.
- Location: property location/map link submitted as listing content is not the same as collecting the visitor's device GPS location. Do not declare device location unless a full app/SDK scan finds it.

Do not submit this draft as final. Confirm each data type, purpose, optional/required status, sharing, encryption, retention, and deletion behavior against live Firebase, Cloudinary, and every included SDK. Google states the developer is responsible for the accuracy and completeness of Data safety declarations.

## 3. Privacy policy findings

The existing `privacy.html` is served as a public page and already describes Firebase/Firestore, Cloudinary, owner contact privacy, customer accounts, favorites, enquiries, notifications, and an account deletion mechanism.

Items to fix or confirm before submission:
- The policy currently says ordinary visitors are not asked for identifying details, but it does not explain anonymous Firebase authentication / pseudonymous UID processing.
- Add a developer identity and privacy contact email or other durable privacy contact mechanism. The page currently lists phone numbers only; owner must confirm the legal developer name and contact details.
- Add a clear retention schedule or explain the actual criteria for retaining/deleting listings, enquiries, logs, backups, and uploaded media. Do not invent retention periods.
- Confirm the Cloudinary account deletion API credentials are configured. The customer account deletion function removes Firestore records and Auth user, but Cloudinary media deletion is best-effort and is skipped when server credentials are absent.
- Clarify that the admin account cannot self-delete using the customer deletion control, and that admin moderation/audit records may be retained where legally/operationally necessary.
- Re-check the policy translations in Gujarati, Hindi, and English before publication.

## 4. Android packaging observations

- Capacitor application ID in source: `in.marughar.gandhinagar`. Verify it is available and registered in Play Console before the first upload; package IDs cannot be casually changed after publishing.
- Existing Android APK workflow targets API 35 and can use a debug signing key. That output is TEST-only and must never be uploaded as a Play production bundle.
- The separate Play AAB workflow targets Android 16 / API 36 and requires a dedicated upload keystore through GitHub Actions secrets.
- The AAB workflow must be run from a branch where GitHub Actions exposes the workflow. The workflow is not considered validated until the run completes and the signed AAB is verified.
- Version code must be unique and increment for every Play upload. Confirm the first versionCode with the Play Console state before producing the release bundle.
- Test Android 16 edge-to-edge behavior and notification permission prompt on real devices. Keep any required adjustments inside the native wrapper only; do not redesign the web app.

## 5. Owner / Play Console tasks that cannot be truthfully completed from source code

- Confirm Play Console developer account and account type (personal or organization).
- Confirm package ID is unused / app not already registered.
- Provide verified public support/privacy contact details and developer identity.
- Create the Play Console app record, accept Play App Signing, and complete developer verification.
- Configure a permanent upload key securely. Never commit the keystore or passwords to Git.
- Supply a reviewer test account and clear access instructions for gated features, without exposing the production admin password.
- Complete content rating, target audience, ads declaration, app access, Data safety, and other App content declarations.
- Capture genuine app screenshots and feature graphic from the restored app; do not fabricate screens.
- Complete internal/closed testing and review any pre-launch report before production.

## 6. Protected scope

This audit and Play packaging work must not edit the customer-facing `index.html`, `admin.html`, CSS, app JavaScript, Firebase config, Firestore rules, property data, or Hosting configuration. The Play build is isolated to GitHub Actions and release documentation.
