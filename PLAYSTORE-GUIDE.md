# GrahAI — Google Play Store Deployment Guide

## Overview

GrahAI uses **Trusted Web Activity (TWA)** to wrap the PWA into a native Android app.
This produces a tiny ~2MB APK that loads your Vercel-hosted site in a full-screen Chrome
Custom Tab — no browser UI, no code changes.

---

## Prerequisites

1. **GrahAI deployed on Vercel** (or any HTTPS domain)
   - Confirm: `https://YOUR_DOMAIN/manifest.json` loads correctly
   - Confirm: `https://YOUR_DOMAIN/sw.js` registers
2. **Node.js 18+** installed on your machine
3. **Java JDK 11+** (required by Bubblewrap for signing)
4. **Android SDK** (Bubblewrap can install this automatically)
5. **Google Play Developer account** — [$25 one-time fee](https://play.google.com/console/signup)

---

## Step 1: Install Bubblewrap CLI

```bash
npm install -g @nickersoft/bubblewrap
```

Or use npx (no global install):
```bash
npx @nickersoft/bubblewrap --help
```

---

## Step 2: Initialize the TWA Project

From the `grahai/` project root:

```bash
bubblewrap init --manifest="https://YOUR_DOMAIN/manifest.json"
```

**OR** use the pre-configured `twa-manifest.json`:

```bash
bubblewrap init --manifest="twa-manifest.json"
```

Bubblewrap will prompt you for:
- **Domain**: your Vercel domain (e.g., `grahai.vercel.app`)
- **Signing key**: create a new one or use existing
- **Android SDK location**: it can auto-download if not found

> **IMPORTANT**: Save the keystore file and password securely!
> You'll need the SAME key for all future updates.

---

## Step 3: Build the Android App Bundle

```bash
bubblewrap build
```

This generates:
- `app-release-bundle.aab` — Upload this to Play Console
- `app-release-signed.apk` — For testing on device

---

## Step 4: Set Up Digital Asset Links

This proves you own both the domain and the Android app.

### 4a: Get your signing key fingerprint

```bash
keytool -list -v -keystore android.keystore -alias grahai
```

Copy the **SHA-256** fingerprint (looks like: `AB:CD:12:34:...`).

### 4b: Update assetlinks.json

Edit `public/.well-known/assetlinks.json` and replace the placeholder:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.grahai.app",
      "sha256_cert_fingerprints": [
        "AB:CD:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB"
      ]
    }
  }
]
```

### 4c: Deploy and verify

```bash
# Deploy to Vercel
git add . && git commit -m "Add TWA asset links" && git push

# Verify it's accessible
curl https://YOUR_DOMAIN/.well-known/assetlinks.json
```

Google's verification tool: https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://YOUR_DOMAIN&relation=delegate_permission/common.handle_all_urls

---

## Step 5: Test on Android Device

```bash
# Install the APK
adb install app-release-signed.apk
```

Or transfer the APK to your phone and sideload it.

**What to verify:**
- App opens in full-screen (no browser bar)
- Service worker caches properly
- Push notifications work
- All navigation works within the app
- Back button behavior is correct

> If you see a browser URL bar, the assetlinks.json verification failed.
> Double-check the SHA-256 fingerprint and redeploy.

---

## Step 6: Upload to Google Play Console

1. Go to https://play.google.com/console
2. Create a new app:
   - **App name**: GrahAI — Vedic Astrology AI
   - **Default language**: English (India)
   - **App category**: Lifestyle or Education
   - **Free / Paid**: Free (with in-app purchases later)
3. Complete the **Store listing**:
   - **Short description** (80 chars): "AI-powered Vedic astrology — Kundli, Tarot, Numerology & Vastu"
   - **Full description**: Your app pitch
   - **Screenshots**: At least 2 phone screenshots (1080x1920 recommended)
   - **Feature graphic**: 1024x500 PNG
   - **App icon**: 512x512 (auto from manifest)
4. Go to **Release > Production > Create new release**
5. Upload `app-release-bundle.aab`
6. Complete **Content rating** questionnaire
7. Set **Target audience**: 18+
8. Complete **Data safety** section
9. Submit for review

---

## Step 7: Play Store Data Safety Answers

For GrahAI, you'll need to declare:

| Data Type | Collected | Shared | Purpose |
|-----------|-----------|--------|---------|
| Name | Yes | No | App functionality |
| Email | Yes | No | Account management |
| Date of birth | Yes | No | Core functionality (astrology) |
| Location (city) | Yes | No | Core functionality (birth chart) |
| App interactions | Yes | No | Analytics |

---

## Updating the App

When you update the website on Vercel, the TWA app updates automatically — no Play Store
re-submission needed for web content changes.

**Only re-submit to Play Store when:**
- Changing the `twa-manifest.json` config (e.g., new shortcuts)
- Bumping `appVersionCode` and `appVersionName`
- Changing the signing key

```bash
# Bump version in twa-manifest.json, then:
bubblewrap build
# Upload new .aab to Play Console
```

---

## Alternative: PWABuilder (Even Easier)

If Bubblewrap feels complex, use https://www.pwabuilder.com:

1. Enter `https://YOUR_DOMAIN`
2. It scores your PWA readiness
3. Click **Package for stores > Android**
4. Download the generated `.aab`
5. Upload to Play Console

PWABuilder handles signing key generation and assetlinks.json instructions automatically.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Browser bar visible in TWA | assetlinks.json not matching — verify SHA-256 fingerprint |
| App crashes on launch | Check Chrome version on device (need 72+) |
| Service worker not caching | Ensure sw.js is at root, not under /_next/ |
| Push notifications not working | Check `enableNotifications: true` in twa-manifest.json |
| Play Store rejection | Ensure unique content, proper data safety, and content rating |

---

## Custom Domain Recommendation

Before submitting to Play Store, consider setting up a custom domain:

```
grahai.app  or  grahai.in
```

This looks more professional in the Play Store listing and makes the
assetlinks.json setup permanent (Vercel domains can change).

**Vercel custom domain setup:**
1. Buy domain from Namecheap/GoDaddy/Google Domains
2. In Vercel dashboard: Settings > Domains > Add
3. Update DNS records as Vercel instructs
4. Update `twa-manifest.json` host to new domain
5. Update assetlinks.json on new domain
6. Rebuild TWA with `bubblewrap build`
