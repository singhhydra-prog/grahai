---
description: "Build, test, and deploy GrahAI to Vercel — includes build verification, sweph handling, environment variables, and deployment procedures"
allowed-tools: ["Read", "Write", "Edit", "Bash"]
---

# GrahAI Deployment Skill

## Quick Reference

| Key | Value |
|-----|-------|
| Production URL | https://grahai.vercel.app |
| Vercel Project | singhhydra-3616s-projects/grahai |
| Repository | https://github.com/singhhydra-prog/grahai.git |
| Framework | Next.js 16 (App Router) |
| Pages | 35 (as of March 2026) |
| User local path | `C:\Users\vijas\OneDrive\Desktop\AstraAI\grahai` |

## Pre-Build Checklist

Before running `npm run build`, verify these critical items:

1. **sweph is in `optionalDependencies`** (NOT `dependencies`) in `package.json`
2. **`.npmrc`** contains `optional=true`
3. **`next.config.ts`** has `serverExternalPackages: ["sweph", "pdfkit"]`
4. **`sweph-wrapper.ts`** uses indirect `require()`:
   ```typescript
   const moduleName = "sweph"
   sweph = require(moduleName)  // NOT: import sweph from "sweph"
   ```
5. **No TypeScript errors:** `npx tsc --noEmit` passes

## Build Command

```bash
npm run build
```

Expected: 35 pages generated, zero errors, ~45 second build time.

## Deploy to Vercel

### Manual Deploy (Recommended)

From user's local machine (PowerShell):
```powershell
cd "C:\Users\vijas\OneDrive\Desktop\AstraAI\grahai"
git add -A && git commit -m "description"
npx vercel --prod
```

### If Vercel CLI Auth Fails

```powershell
npx vercel logout
npx vercel login --github
npx vercel --prod
```

### Git Push + Auto Deploy

If GitHub auto-deploy is connected (verify at Vercel dashboard → Settings → Git):
```powershell
git push origin main
```

Note: Auto-deploy may be disconnected. If pages are stale after push, use manual deploy.

## Environment Variables (Vercel Dashboard)

All must be set in Vercel project settings:

| Variable | Scope | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Yes |
| `ANTHROPIC_API_KEY` | Server only | Yes |
| `RESEND_API_KEY` | Server only | Yes |
| `RAZORPAY_KEY_ID` | Server only | Yes |
| `RAZORPAY_KEY_SECRET` | Server only | Yes |

**CRITICAL:** Never expose `SUPABASE_SERVICE_ROLE_KEY` or `ANTHROPIC_API_KEY` in client code or `NEXT_PUBLIC_*` variables.

## Post-Deploy Verification

Verify all critical pages return HTTP 200:

```bash
for page in "" kundli horoscope compatibility astrologer chat dashboard pricing blog about contact; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://grahai.vercel.app/$page")
  echo "$page: $STATUS"
done
```

All should return 200.

## Known Deployment Pitfalls

### 1. sweph Native Module Failure
**Symptom:** Build fails with C++ compilation errors or "Cannot find module 'sweph'"
**Root Cause:** Vercel serverless cannot compile native C++ modules
**Fix:** sweph in `optionalDependencies`, `.npmrc` `optional=true`, indirect require in wrapper

### 2. Stale Deployment (Pages 404)
**Symptom:** Code changes don't appear, product pages return 404
**Fix:** Deploy manually with `npx vercel --prod`. Check deployment timestamp in Vercel dashboard.

### 3. Environment Variable Missing
**Symptom:** API routes return 500, chat doesn't respond
**Fix:** Verify all env vars in Vercel project settings → Environment Variables

### 4. PDFKit Bundle Error
**Symptom:** Build error related to PDFKit or font files
**Fix:** Ensure `serverExternalPackages` includes `"pdfkit"` in `next.config.ts`

### 5. Vercel CLI Token Expired
**Symptom:** "The specified token is not valid" error
**Fix:** `npx vercel logout` → `npx vercel login --github`

## Rollback

```powershell
npx vercel ls                    # List recent deployments
npx vercel promote <deploy-url>  # Promote previous working deployment
```

## Cron Jobs

Configured in `vercel.json`:
- `/api/cron/daily-insights` — runs daily at 5:00 AM UTC
