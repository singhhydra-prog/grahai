# Razorpay Payment Integration Setup

This document provides a complete guide for setting up and using the Razorpay payment integration for GrahAI.

## Overview

The Razorpay integration handles subscription payments for the Graha (₹499/month) and Rishi (₹1,499/month) plans. The system includes:

- **Server-side order creation** via `/api/payment/create-order`
- **Payment verification** via `/api/payment/verify`
- **Client-side checkout UI** at `/pricing/checkout?plan=graha|rishi`
- **Automatic subscription tier updates** in Supabase after successful payment

## File Structure

```
/src/app/
├── api/payment/
│   ├── create-order/route.ts      # Creates Razorpay order
│   └── verify/route.ts             # Verifies payment signature
├── pricing/
│   ├── page.tsx                    # Updated with payment links
│   └── checkout/page.tsx           # Checkout page (NEW)
└── dashboard/page.tsx              # Shows subscription tier
```

## Environment Variables

Add these to your `.env.local` file:

```env
# Razorpay Keys (get from https://dashboard.razorpay.com/settings/api-keys)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_xxxxxxxxxxxxxx

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://jkowflffshkebegtabxa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Getting Razorpay Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Login with your account
3. Navigate to **Settings → API Keys**
4. Copy your **Key ID** and **Key Secret**
5. For `NEXT_PUBLIC_RAZORPAY_KEY`, use the same as `RAZORPAY_KEY_ID`

## API Routes

### POST `/api/payment/create-order`

Creates a Razorpay order. Called from the checkout page.

**Request Body:**
```json
{
  "plan_id": "graha" | "rishi",
  "email": "user@example.com",
  "phone": "+91xxxxxxxxxxxx",
  "name": "User Name"
}
```

**Response (Success):**
```json
{
  "success": true,
  "order": {
    "id": "order_1234567890",
    "amount": 49900,
    "currency": "INR",
    "status": "created"
  },
  "testMode": false
}
```

**Response (Test Mode - No Keys):**
```json
{
  "success": true,
  "order": {
    "id": "order_test_1234567890",
    "amount": 49900
  },
  "testMode": true,
  "message": "Running in test mode..."
}
```

### POST `/api/payment/verify`

Verifies the payment signature and updates subscription tier in Supabase.

**Request Body:**
```json
{
  "razorpay_order_id": "order_1234567890",
  "razorpay_payment_id": "pay_1234567890",
  "razorpay_signature": "signature_hash"
}
```

**Headers:**
```
x-plan-id: "graha" | "rishi"
```

**Response (Success):**
```json
{
  "success": true,
  "verified": true,
  "message": "Payment verified and subscription updated",
  "user_id": "user-uuid",
  "razorpay_payment_id": "pay_1234567890"
}
```

## Checkout Page

Located at `/pricing/checkout?plan=graha` or `/pricing/checkout?plan=rishi`

### Features

- **Authentication Required**: Redirects to `/auth/login` if not authenticated
- **Plan Display**: Shows plan name, price, features, and billing details
- **Razorpay Modal**: Opens Razorpay Checkout with:
  - Pre-filled user email and name
  - Theme color: #C9A24D (gold)
  - Company name: GrahAI
- **Success Handling**: On successful payment:
  1. Calls `/api/payment/verify` to confirm payment
  2. Updates user's `subscription_tier` in Supabase
  3. Redirects to `/dashboard?payment=success`
- **Error Handling**: Displays error messages and test mode warnings

## Pricing Configuration

Plans are defined in both:

1. **`/src/app/pricing/page.tsx`** - Marketing display
2. **`/src/app/api/payment/create-order/route.ts`** - Payment amounts

Current plans:
- **Graha**: ₹499/month (₹49900 paise)
- **Rishi**: ₹1,499/month (₹149900 paise)

To add or modify plans, update both files.

## Subscription Tiers in Supabase

The `profiles` table stores subscription tiers:

```sql
subscription_tier TEXT -- 'free' | 'graha' | 'rishi'
updated_at TIMESTAMP
```

After payment verification, the user's tier is updated to either `'graha'` or `'rishi'`.

## Testing

### With Razorpay Keys (Production Mode)

1. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env.local`
2. Go to `/pricing` and click upgrade button
3. Click "Pay with Razorpay"
4. In the modal, use [Razorpay test card numbers](https://razorpay.com/docs/payments/payments/test-mode/)
5. Payment will process and redirect to dashboard

### Without Keys (Test Mode)

1. Keep `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` blank
2. Go to `/pricing/checkout?plan=graha`
3. You'll see: "Running in test mode. Razorpay keys not configured."
4. Click "Pay with Razorpay" - modal won't open, but you can test UI
5. No actual payment is charged in test mode

### Test Card Numbers

Use these in Razorpay's test mode:

- **Visa**: 4111 1111 1111 1111
- **Mastercard**: 5555 5555 5555 4444
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## User Flow

1. User visits `/pricing` page
2. Clicks "Upgrade to Graha" or "Upgrade to Rishi"
3. Redirected to `/pricing/checkout?plan=graha|rishi`
4. Checkout page checks if user is authenticated (redirects to login if not)
5. User sees order summary with plan details
6. User clicks "Pay with Razorpay"
7. Razorpay Checkout modal opens
8. User completes payment with card
9. Payment handler calls `/api/payment/verify`
10. Subscription tier is updated in Supabase
11. User is redirected to `/dashboard?payment=success`
12. Dashboard shows updated subscription tier

## Security Considerations

- **Signature Verification**: All payments are verified using HMAC-SHA256
- **Server-Side Verification**: Payment signature is verified on the server, not the client
- **User Authentication**: Checkout page requires user to be logged in
- **SSL Encrypted**: All payments use 256-bit SSL encryption
- **Headers**: Plan ID is passed via secure headers to prevent tampering

## Troubleshooting

### "Razorpay script failed to load"
- Check internet connection
- Verify `window.Razorpay` is available
- Clear browser cache and try again

### "Payment verification failed"
- Check that `RAZORPAY_KEY_SECRET` matches your Razorpay account
- Verify the order ID, payment ID, and signature are correct
- Check server logs for errors

### "User not authenticated"
- User session may have expired
- Try logging out and back in
- Clear cookies and try again

### "Failed to update subscription"
- Check Supabase connection
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check that the `profiles` table exists and has `subscription_tier` column

## Monitoring

### Payment Logs

Check server logs for payment activity:
- Order creation
- Signature verification
- Subscription updates
- Errors

### Razorpay Dashboard

Monitor payments at [Razorpay Dashboard](https://dashboard.razorpay.com):
- View all transactions
- Refund payments
- Manage subscriptions
- Check settlement status

## Support

For issues with:
- **Razorpay**: Contact [Razorpay Support](https://razorpay.com/contact-us/)
- **GrahAI Integration**: Check this file or contact support@grahai.com

## References

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Node.js SDK](https://github.com/razorpay/razorpay-node)
- [Razorpay Checkout](https://razorpay.com/docs/payments/checkout/)
- [Payment Verification](https://razorpay.com/docs/payments/payments/verify-payment-signature/)
