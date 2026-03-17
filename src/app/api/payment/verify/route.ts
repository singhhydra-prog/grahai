import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import Razorpay from "razorpay"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

interface VerifyPaymentRequest {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyPaymentRequest = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    // Get Razorpay keys — MUST be configured
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      console.error("CRITICAL: RAZORPAY_KEY_SECRET not configured — cannot verify payments")
      return NextResponse.json(
        { error: "Payment system not configured. Please contact support." },
        { status: 503 }
      )
    }

    // Validate all required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields", verified: false },
        { status: 400 }
      )
    }

    // Verify signature using HMAC-SHA256
    const hmacMessage = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(hmacMessage)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      console.warn("Payment signature mismatch for order:", razorpay_order_id)
      return NextResponse.json(
        { error: "Payment verification failed", verified: false },
        { status: 400 }
      )
    }

    // Get authenticated user
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Server Component — can't set cookies
            }
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      )
    }

    // SECURITY: Look up the plan from Razorpay order, not from client header
    let planId: string | null = null

    const keyId = process.env.RAZORPAY_KEY_ID
    if (keyId) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        })

        const order = await razorpay.orders.fetch(razorpay_order_id)

        // Extract plan_id from order notes
        if (order.notes && typeof order.notes === "object") {
          planId = (order.notes as Record<string, unknown>).plan_id as string | null
        }
      } catch (razorpayError) {
        console.error("Error fetching Razorpay order:", razorpayError)
        // Fall through to header fallback
      }
    }

    // Fallback: if we couldn't get plan from Razorpay, check header (legacy orders)
    if (!planId) {
      const headerPlanId = request.headers.get("x-plan-id")
      if (headerPlanId) {
        console.warn(
          `[SECURITY WARNING] Using plan_id from client header for order ${razorpay_order_id}. ` +
          `This is a fallback for legacy orders. Client provided: ${headerPlanId}`
        )
        planId = headerPlanId
      } else {
        // Default to graha (lowest tier)
        console.warn(
          `[SECURITY WARNING] Could not determine plan for order ${razorpay_order_id}. ` +
          `Defaulting to 'graha' tier.`
        )
        planId = "graha"
      }
    }

    // Map plan_id to subscription_tier
    const subscriptionTier = planId === "rishi" ? "premium" : "plus"

    // Update user's subscription in Supabase
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        subscription_tier: subscriptionTier,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("Database update error:", updateError)
      return NextResponse.json(
        { error: "Failed to update subscription" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Payment verified and subscription updated",
      user_id: user.id,
      razorpay_payment_id,
    })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
