# Pre-Deploy Checklist

Run through this checklist before every `npx vercel --prod`:

- [ ] `npx tsc --noEmit` — zero TypeScript errors
- [ ] `npm run build` — successful local build
- [ ] `npx vitest` — all tests pass (if tests exist for changed code)
- [ ] No `.env.local` secrets in committed code
- [ ] Vercel environment variables are set for any new env vars
- [ ] If report generators changed: `npx tsx test-uniqueness.ts` shows <40% generic
- [ ] If UI changed: visually check on mobile (320px) and desktop
- [ ] If payment flow changed: test with Razorpay test mode
- [ ] If auth flow changed: test login/logout/OTP
- [ ] Git commit with descriptive message
