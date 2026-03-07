# Razorpay Integration - Quick Reference Card

## File Locations (Absolute Paths)

### API Routes
- `/sessions/wonderful-gifted-mayer/grahai/src/app/api/payment/create-order/route.ts` - Order creation
- `/sessions/wonderful-gifted-mayer/grahai/src/app/api/payment/verify/route.ts` - Payment verification

### Client Pages
- `/sessions/wonderful-gifted-mayer/grahai/src/app/pricing/checkout/page.tsx` - Checkout UI
- `/sessions/wonderful-gifted-mayer/grahai/src/app/pricing/page.tsx` - Pricing page (updated)

### Documentation
- `/sessions/wonderful-gifted-mayer/grahai/RAZORPAY_SETUP.md` - Full setup guide
- `/sessions/wonderful-gifted-mayer/grahai/RAZORPAY_QUICKSTART.md` - 5-minute guide
- `/sessions/wonderful-gifted-mayer/grahai/INTEGRATION_SUMMARY.md` - Implementation details
- `/sessions/wonderful-gifted-mayer/grahai/.env.example` - Environment template

## Key URLs

- **Pricing Page**: `http://localhost:3000/pricing`
- **Checkout (Graha)**: `http://localhost:3000/pricing/checkout?plan=graha`
- **Checkout (Rishi)**: `http://localhost:3000/pricing/checkout?plan=rishi`
- **Dashboard**: `http://localhost:3000/dashboard`
- **Razorpay Dashboard**: https://dashboard.razorpay.com

## Environment Variables

```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_xxxxxxxxxxxxxx
NEXT_PUBLIC_SUPABASE_URL=https://jkowflffshkebegtabxa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## Payment Plans

| Plan | Price | Plan ID | Route |
|------|-------|---------|-------|
| Nakshatra | Free | - | `/auth/login` |
| Graha | ₹499/month | `graha` | `/pricing/checkout?plan=graha` |
| Rishi | ₹1,499/month | `rishi` | `/pricing/checkout?plan=rishi` |

## API Endpoints

### Create Order
```
POST /api/payment/create-order
Content-Type: application/json

{
  "plan_id": "graha",
  "email": "user@example.com",
  "phone": "+919876543210",
  "name": "User Name"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_xxx",
    "amount": 49900,
    "currency": "INR",
    "status": "created"
  },
  "testMode": false
}
```

### Verify Payment
```
POST /api/payment/verify
Content-Type: application/json
x-plan-id: graha

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "verified": true,
  "message": "Payment verified and subscription updated",
  "user_id": "user_uuid"
}
```

## Test Cards

| Card | Number | CVV | Expiry |
|------|--------|-----|--------|
| Visa | 4111 1111 1111 1111 | Any 3 digits | Any future date |
| Mastercard | 5555 5555 5555 4444 | Any 3 digits | Any future date |

## Common Commands

```bash
# Install dependencies (already done)
npm install razorpay --save

# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Check build
npm run build  # Should complete with no errors
```

## Payment Flow Summary

```
User clicks "Upgrade"
  ↓
Authenticate (auto-redirect to login if needed)
  ↓
Display checkout page with order summary
  ↓
Click "Pay with Razorpay"
  ↓
Create order via /api/payment/create-order
  ↓
Open Razorpay modal
  ↓
User enters payment details
  ↓
Razorpay processes payment
  ↓
Call /api/payment/verify
  ↓
Verify HMAC signature
  ↓
Update Supabase: subscription_tier
  ↓
Redirect to /dashboard?payment=success
```

## Database Schema

**Table:** `profiles`

| Column | Type | Purpose |
|--------|------|---------|
| id | UUID | User ID (primary key) |
| subscription_tier | TEXT | 'free' \| 'graha' \| 'rishi' |
| updated_at | TIMESTAMP | Last update time |

## Styling Classes

- Background: `bg-bg` (#050810)
- Secondary bg: `bg-bg-2` (#0A0F1E)
- Text: `text-text` (#E8E4DB)
- Text dim: `text-text-dim` (#8A8690)
- Accent: `text-gold` or `bg-gold` (#C9A24D)

## Feature Checklist

✓ Order creation with plan validation
✓ HMAC-SHA256 signature verification
✓ Supabase integration
✓ Authentication protection
✓ Test mode support
✓ Razorpay Checkout modal
✓ Dynamic script loading
✓ Pre-filled user data
✓ Error handling
✓ Loading states
✓ Responsive design
✓ Dark theme UI
✓ Gold accents
✓ Success redirect

## Troubleshooting Quick Links

- **Setup Issues**: See RAZORPAY_SETUP.md
- **Quick Start**: See RAZORPAY_QUICKSTART.md
- **Full Details**: See INTEGRATION_SUMMARY.md
- **Razorpay Docs**: https://razorpay.com/docs/
- **Test Mode**: Leave keys blank in .env.local

## Important Notes

1. **Never commit `.env.local`** - It contains secret keys
2. **Use Suspense** - Checkout page uses `useSearchParams` with Suspense
3. **Test mode**: If Razorpay keys are missing, system runs in test mode
4. **Signature verification**: Always verify on server-side, never client-side
5. **Plan ID header**: Passed via `x-plan-id` header to verify route
6. **Subscription tiers**: 'graha' or 'rishi' (no 'premium' naming)

## Contact & Support

- **GrahAI Support**: support@grahai.com
- **Razorpay Support**: https://razorpay.com/contact-us/
- **Documentation**: See .md files in project root

## Implementation Date

March 5, 2026 - Complete and production-ready integration.

---

**Quick Start**: Add Razorpay keys to `.env.local` and test with test cards!
