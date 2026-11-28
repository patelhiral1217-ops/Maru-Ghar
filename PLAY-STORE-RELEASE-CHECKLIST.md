# Maru Ghar — Google Play release preparation

## Protection rule
- Do not redesign or edit the customer-facing app UI, styles, navigation, features, Firebase data, Firestore rules, or Hosting as part of Play Store preparation.
- Android packaging and release documentation are maintained separately.
- Run the complete existing `npm test` chain before producing a release build.

## Android release pipeline
- [x] Stable Capacitor application ID: `in.marughar.gandhinagar`
- [x] Existing approved Maru Ghar launcher icon asset identified
- [x] Existing Android CI workflow identified (APK only; test-key fallback is not for Play)
- [x] Source-based privacy/Data Safety audit added in `PLAY-STORE-PRIVACY-AUDIT.md`
- [x] Public account deletion instructions page added at `account-deletion.html` and linked from the privacy policy and store listing draft
- [x] Existing OTA bridge included in the isolated AAB workflow
- [x] Separate manual Google Play AAB workflow added; targets Android 16 / API 36
- [x] Android 16 packaging workflow corrected to use Capacitor 8 (the supported API 36 line) and explicitly create its Android SDK variables file
- [ ] Add permanent Play upload keystore as GitHub Actions secrets (never commit the keystore)
- [ ] Set GitHub Actions repository variable `MARU_PLAY_RELEASE_ENABLED=true` only after all four signing secrets are configured
- [x] Android 16 / API 36 Gradle release-bundle packaging passed in GitHub Actions (12 MB test bundle; not yet signed with the permanent Play upload key)
- [x] Preserve the package-validation AAB as a short-lived GitHub Actions artifact for download/testing
- [ ] Run the manual signed AAB workflow and verify the permanent Play upload signature
- [ ] Test the release build on physical Android devices
- [ ] Confirm versionCode is unique and versionName is correct before first upload

## Required GitHub Actions secrets for the AAB workflow
Create these repository secrets in GitHub:
- `MARU_PLAY_UPLOAD_KEYSTORE_BASE64`: base64-encoded JKS/PKCS12 upload keystore
- `MARU_PLAY_UPLOAD_KEYSTORE_PASSWORD`: keystore password
- `MARU_PLAY_UPLOAD_KEY_ALIAS`: key alias
- `MARU_PLAY_UPLOAD_KEY_PASSWORD`: private-key password
- `MARU_PLAY_RELEASE_ENABLED=true` (repository variable): explicit opt-in to run the signed AAB build job

Keep a secure offline backup of the keystore and passwords. Losing the upload key can delay updates; do not share it in chat or commit it to Git.

## Store listing and policy work still requiring owner confirmation
- [ ] Confirm developer account identity and Play Console access
- [x] Draft Gujarati and English app title, short description, and full description in `PLAY-STORE-STORE-LISTING-DRAFT.md`
- [ ] Owner confirm title, category, contact email, support website, and all feature claims
- [ ] Prepare  phone/tablet screenshots and feature graphic from the real app
- [ ] Resolve privacy policy gaps identified in `PLAY-STORE-PRIVACY-AUDIT.md` (anonymous Firebase UID, verified developer/privacy contact, retention details, Cloudinary deletion credentials)
- [ ] Complete Data safety form accurately from actual data flows
- [ ] Complete content rating questionnaire and target-audience declarations
- [ ] Complete app access instructions for reviewer (admin-only areas must not be falsely represented as public)
- [ ] Complete ads declaration, app access, and permissions declarations as applicable
- [ ] Complete internal testing track and pre-launch report
- [ ] Resolve all Play Console policy or technical warnings before production rollout

## Important
The AAB workflow is manual and does not deploy the website or change Firebase. It intentionally refuses to create a Play upload bundle until a permanent upload key is configured. The app UI source remains untouched.
