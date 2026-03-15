# Razorpay Integration - Quick Start Guide

Get the Razorpay payment system up and running in 5 minutes.

## 1. Install Dependencies ✓ (Already Done)

```bash
npm install razorpay --save
```

## 2. Get Razorpay Keys

1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up or login
3. Go to **Settings** → **API Keys**
4. Copy your:
   - **Key ID** (starts with `rzp_live_` or `rzp_test_`)
   - **Key Secret** (keep this private!)

## 3. Add Environment Variables

Update `.env.local`:

```env
# Add these three lines
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_xxxxxxxxxx
```

## 4. Test the Integration

### Option A: Test Mode (No Keys Required)
1. Don't set Razorpay keys in `.env.local`
2. Run: `npm run dev`
3. Go to: `http://localhost:3000/pricing`
4. Click "Upgrade to Graha"
5. You'll see test mode warning but can test the UI

### Option B: Production Mode (With Keys)
1. Set all three Razorpay keys in `.env.local`
2. Run: `npm run dev`
3. Go to: `http://localhost:3000/pricing`
4. Click "Upgrade to Graha"
5. Use [test card numbers](#test-cards):
   - **Card**: `4111 1111 1111 1111`
   - **CVV**: `123` (any 3 digits)
   - **Expiry**: `12/25` (any future date)
6. Complete payment
7. Check Supabase - your subscription_tier should be updated to `graha`!

## Test Cards

Use these for testing payments:

### Visa
- Number: `4111 1111 1111 1111`
- CVV: `123` (any 3 digits)
- Expiry: `12/25` (any future date)

### Mastercard
- Number: `5555 5555 5555 4444`
- CVV: `123` (any 3 digits)
- Expiry: `12/25` (any future date)

## Verify It Works

After successful payment:

1. **Check Dashboard**: You should be redirected to `/dashboard?payment=success`
2. **Check Supabase**:
   ```sql
   SELECT id, email, subscription_tier FROM profiles WHERE id = '...';
   ```
   Should show `subscription_tier` as `'graha'` or `'rishi'`
3. **Check Razorpay Dashboard**: Payment should appear in transaction list

## File Locations

| File | Purpose |
|------|---------|
| `/src/app/api/payment/create-order/route.ts` | Create Razorpay order |
| `/src/app/api/payment/verify/route.ts` | Verify payment & update subscription |
| `/src/app/pricing/checkout/page.tsx` | Checkout UI |
| `/src/app/pricing/page.tsx` | Pricing page (with updated links) |

## Troubleshooting

### "Razorpay script failed to load"
- Check internet connection
- Clear browser cache
- Reload page

### "User not authenticated"
- Log out completely
- Go to `/pricing` and log back in
- Try upgrade again

### "Payment verification failed"
- Check that `RAZORPAY_KEY_SECRET` is correct
- Verify keys match your Razorpay account
- Check server logs for errors

### Keys are not working
- Double-check keys are copied exactly (no extra spaces)
- Make sure you're using **Key ID** and **Key Secret**, not something else
- Try restarting the dev server after changing `.env.local`

## Build & Deploy

### Local Development
```bash
npm run dev
# Navigate to http://localhost:3000/pricing
```

### Build for Production
```bash
npm run build
npm run start
```

### Deploy to Vercel
1. Commit changes to git
2. Push to GitHub
3. Vercel auto-deploys
4. Add environment variables in Vercel dashboard:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `NEXT_PUBLIC_RAZORPAY_KEY`

## API Endpoints

### Create Order
```bash
POST /api/payment/create-order
Content-Type: application/json

{
  "plan_id": "graha",
  "email": "user@example.com",
  "phone": "+919876543210",
  "name": "John Doe"
}
```

### Verify Payment
```bash
POST /api/payment/verify
Content-Type: application/json
x-plan-id: graha

{
  "razorpay_order_id": "order_...",
  "razorpay_payment_id": "pay_...",
  "razorpay_signature": "signature_hash"
}
```

## Documentation

- **Full Setup Guide**: See `RAZORPAY_SETUP.md`
- **Integration Summary**: See `INTEGRATION_SUMMARY.md`
- **Razorpay Docs**: https://razorpay.com/docs/

## Common Use Cases

### Check Current Subscription
```typescript
const { data } = await supabase
  .from('profiles')
  .select('subscription_tier')
  .eq('id', userId)
  .single()

console.log(data.subscription_tier) // 'free' | 'graha' | 'rishi'
```

### Show Upgrade Button (Conditionally)
```typescript
if (subscription_tier === 'free') {
  // Show "Upgrade to Graha" button
}
```

### Redirect to Checkout
```typescript
router.push(`/pricing/checkout?plan=graha`)
```

## Support

- **Questions**: Check `RAZORPAY_SETUP.md`
- **Bugs**: Check server logs and browser console
- **Razorpay**: https://razorpay.com/contact-us/

## Next Steps

- [ ] Add Razorpay keys to `.env.local`
- [ ] Test with test cards
- [ ] Verify Supabase updates
- [ ] Monitor transactions in Razorpay dashboard
- [ ] Plan go-live with production keys

---

**Ready to go!** You have everything you need. Just add your Razorpay keys and start accepting payments. 🚀
