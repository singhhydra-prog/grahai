import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

// Plan configuration
const PLANS = {
  graha: {
    amount: 19900, // ₹199 in paise
    currency: "INR",
    name: "Graha",
    description: "Graha - Comprehensive Vedic Readings"
  },
  rishi: {
    amount: 49900, // ₹499 in paise
    currency: "INR",
    name: "Rishi",
    description: "Rishi - Premium Vedic Consultation"
  }
}

interface CreateOrderRequest {
  plan_id: "graha" | "rishi"
  email: string
  phone: string
  name: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json()

    const { plan_id, email, phone, name } = body

    // Validate plan
    if (!PLANS[plan_id]) {
      return NextResponse.json(
        { error: "Invalid plan ID" },
        { status: 400 }
      )
    }

    const plan = PLANS[plan_id]

    // Check if Razorpay keys are set
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    // If keys are not set, return a mock order for testing
    if (!keyId || !keySecret) {
      const mockOrder = {
        id: `order_test_${Date.now()}`,
        amount: plan.amount,
        amount_paid: 0,
        amount_due: plan.amount,
        currency: plan.currency,
        receipt: `receipt_${Date.now()}`,
        status: "created",
        created_at: Math.floor(Date.now() / 1000),
      }

      return NextResponse.json({
        success: true,
        order: mockOrder,
        testMode: true,
        message: "Running in test mode (Razorpay keys not configured)"
      })
    }

    // Initialize Razorpay client
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    // Create order
    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: plan.currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan_id,
        customer_name: name,
        customer_email: email,
      },
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        amount_paid: order.amount_paid,
        amount_due: order.amount_due,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at,
      },
      testMode: false
    })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    )
  }
}
