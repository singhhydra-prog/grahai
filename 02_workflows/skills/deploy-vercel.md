# Skill: deploy-vercel

## Trigger
Use this skill when deploying GrahAI to Vercel production or when troubleshooting deployment issues.

## Outcome
Successful production deployment at https://grahai.vercel.app with all features working.

## Dependencies
- Vercel CLI (`npx vercel`)
- `.vercel/` config directory
- `vercel.json` — Build & route configuration
- `next.config.ts` — Next.js build settings
- `.env.local` — Local environment variables (never commit)
- Vercel Dashboard environment variables

## Steps
1. **Pre-deploy checks**:
   - Run `npx tsc --noEmit` — MUST be zero errors
   - Run `npm run build` locally to catch build errors
   - Verify `.env.local` has all required keys (ANTHROPIC_API_KEY, SUPABASE_URL, etc.)
2. **Deploy**: Run `npx vercel --prod`
3. **Post-deploy verification**:
   - Visit https://grahai.vercel.app — check homepage loads
   - Test one report generation via UI
   - Check Vercel Function Logs for errors
4. **Rollback** if needed: `npx vercel rollback`

## Edge Cases
- **sweph binary**: Native C++ binding WILL fail on Vercel — Meeus fallback handles this automatically
- **Build timeout**: If build exceeds 45s, check for heavy imports or large static assets
- **Environment variables**: Must be set in Vercel Dashboard → Settings → Environment Variables (not just .env.local)
- **API routes returning 500**: Check Vercel Function Logs for the specific route
- **CORS issues**: Verify OPTIONS handler exists in affected API routes

## Required Vercel Environment Variables
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_KEY
- ANTHROPIC_API_KEY
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- RESEND_API_KEY
