# MARU GHAR — Owner setup guide for Google Play release

This guide is for the repository owner. It does not change the app UI, app features, Firebase data, Firebase rules, or Hosting.

## 1. Create the Google Play Console account

Open https://play.google.com/console/signup using the Google Account that should permanently own MARU GHAR.

- You must be at least 18.
- Google currently lists a US$25 one-time registration fee for a full-distribution Play Console developer account.
- Choose Personal only if the account is owned by you as an individual. Choose Organization only if the app is legally owned by an organization and you can provide the required organization verification (including D-U-N-S where applicable).
- Use your legal name/address and working contact details. Google may ask for government ID and payment verification.
- Keep ownership of this account with the app owner; do not share the Google password.

Official instructions:
- https://support.google.com/googleplay/android-developer/answer/6112435
- https://support.google.com/googleplay/android-developer/answer/13628312

Important: newly created personal developer accounts generally need a closed test with at least 12 testers opted in continuously for 14 days before applying for production access. Confirm the requirement shown in your own Play Console dashboard:
https://support.google.com/googleplay/android-developer/answer/14151465

## 2. Create the permanent upload keystore on your own computer

Use a trusted Windows computer. Install Android Studio / a compatible JDK (Java keytool is included with the JDK). Open PowerShell in a private folder that is NOT inside the Git repository.

Run:

```powershell
keytool -genkeypair -v -keystore maru-ghar-upload.jks -alias maru-ghar-upload -keyalg RSA -keysize 2048 -validity 10000
```

- Enter a strong unique keystore password when prompted.
- Set the key password to the same value when prompted, to match the current release workflow's signing command.
- Record the alias exactly as `maru-ghar-upload`.
- Keep two encrypted/offline backups of the `.jks` file and its passwords in separate secure places.
- NEVER commit the `.jks` file, put it in Google Drive public links, or send it in chat/email.

Export the public certificate (this is not the private key):

```powershell
keytool -export -rfc -keystore .\maru-ghar-upload.jks -alias maru-ghar-upload -file .\maru-ghar-upload-cert.pem
```

Keep the certificate ready for the Play Console upload-key registration step if requested. The private `.jks` and passwords must remain secret.

## 3. Add four GitHub Actions repository secrets

Open:
https://github.com/patelhiral1217-ops/Maru-Ghar/settings/secrets/actions

Choose **New repository secret** and add these exact names:

1. `MARU_PLAY_UPLOAD_KEYSTORE_BASE64` — Base64 text of the complete `.jks` file.
2. `MARU_PLAY_UPLOAD_KEYSTORE_PASSWORD` — keystore password.
3. `MARU_PLAY_UPLOAD_KEY_ALIAS` — `maru-ghar-upload`.
4. `MARU_PLAY_UPLOAD_KEY_PASSWORD` — key password.

To create the Base64 text in PowerShell (run from the folder containing the JKS):

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes(".\maru-ghar-upload.jks")) | Set-Clipboard
```

Paste the clipboard contents directly into the GitHub secret value field. Do not paste it into this chat, a GitHub file, issue, pull request, or commit.

After all four secrets exist, add the repository variable:
- Open https://github.com/patelhiral1217-ops/Maru-Ghar/settings/variables/actions
- Add variable name `MARU_PLAY_RELEASE_ENABLED`
- Set value to `true`

Do not enable this variable until the keystore and all four secrets have been checked. The workflow will then run the signed AAB job. It verifies the AAB signature and stores the signed artifact as `maru-ghar-google-play-aab`.

## 4. Test on the real Android phone

After the signed AAB is built:
- Download the signed artifact from the GitHub Actions run.
- Use Play Console Internal testing to distribute the AAB to your own device (preferred for Play signing flow), or use a compatible bundle installer for a local smoke test.
- Check app launch, login, property search/listing, image/video upload, owner contact/WhatsApp, language switching, notifications/permissions, back navigation, and account deletion.
- Record any issue with a screenshot and steps to reproduce. Do not change the live app to fix a test-only problem without owner approval.

## 5. Store listing images and details

Use genuine screenshots captured from the actual restored app on a real device. Do not use mock screens or invent features.

Required asset targets shown by Play Console:
- App icon: 512 x 512 PNG.
- Feature graphic: 1024 x 500 PNG or JPEG.
- Phone screenshots: capture actual app screens at supported phone dimensions; upload the number and format accepted by the current Play Console form.

The listing draft is in `PLAY-STORE-STORE-LISTING-DRAFT.md`. Before publishing, owner must confirm:
- Public developer/app support email and support phone (if published).
- Whether the app contains ads or paid features.
- Target audience and content rating answers.
- Countries/regions for distribution.
- Every feature statement matches the actual release build.

## 6. Privacy, Data Safety, and Cloudinary deletion

Do not guess Data Safety answers. Complete them only after verifying actual data flows in the release build, including Firebase Authentication/Firestore/Storage, Cloudinary uploads, analytics/crash reporting, notifications, and any third-party SDKs.

The account-deletion URL is:
https://maru-ghar-gandhinagar-8dbe4.web.app/account-deletion.html

Before declaring deletion compliant, verify end-to-end that:
- A user can request account deletion in the app (if account creation is available).
- The public deletion webpage works without requiring the user to reinstall the app.
- Firebase Auth account and associated user/profile/listing data are deleted or retained only where legally justified and disclosed.
- Cloudinary assets belonging to the user are deleted using a trusted server-side deletion process and authenticated API credentials. Never expose Cloudinary API secret in app code or GitHub public files.
- Any retention exceptions and timelines are accurately disclosed.

Official policy:
https://support.google.com/googleplay/android-developer/answer/13327111

## 7. Release safety

- Keep the release work on `play-store-prep` until checks are complete.
- Do not merge PR #102 or deploy Firebase Hosting without the owner's explicit approval.
- Never send private key material, passwords, government ID, or payment details in ChatGPT.
