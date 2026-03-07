import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
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

    // Get Razorpay keys
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    // Verify signature
    if (keySecret) {
      const message = `${razorpay_order_id}|${razorpay_payment_id}`
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(message)
        .digest("hex")

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json(
          { error: "Payment verification failed", verified: false },
          { status: 400 }
        )
      }
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

    // Extract subscription tier from header (passed from client)
    const planId = request.headers.get("x-plan-id") || "graha"

    // Map plan_id to subscription_tier
    const subscriptionTier = planId === "rishi" ? "rishi" : "graha"

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
