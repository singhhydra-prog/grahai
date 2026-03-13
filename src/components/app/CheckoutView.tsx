"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { SUPPORT_EMAIL } from "@/lib/constants"
import { ArrowRight, Check, AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface Plan {
  name: string
  nameHi: string
  price: string
  amount: number
  planId: "plus" | "premium"
  features: string[]
  description: string
}

const PLANS: Record<string, Plan> = {
  plus: {
    name: "Plus",
    nameHi: "प्लस",
    price: "₹199",
    amount: 19900,
    planId: "plus",
    description: "For the curious seeker",
    features: [
      "30 questions per month",
      "Full Kundli with Dasha analysis",
      "Nakshatra deep dive",
      "Sanskrit verse references",
      "Tarot 3-card spread",
      "Basic Vastu guidance",
      "Bilingual: Hindi + English",
      "Gemstone recommendations",
    ],
  },
  premium: {
    name: "Premium",
    nameHi: "प्रीमियम",
    price: "₹499",
    amount: 49900,
    planId: "premium",
    description: "Complete cosmic intelligence",
    features: [
      "Unlimited conversations",
      "Full Kundli + Divisional charts",
      "Advanced Dasha predictions",
      "Compatibility analysis",
      "Full 78-card Tarot",
      "Complete Vastu mapping",
      "Monthly transit reports",
      "Priority response speed",
      "Annual prediction reports",
      "Muhurta — auspicious timing",
      "Export to PDF",
    ],
  },
}

interface RazorpayWindow extends Window {
  Razorpay?: any
}

declare global {
  interface Window {
    Razorpay?: any
  }
}

export default function CheckoutView({
  onBack,
  onSuccess,
  planId = "plus",
}: {
  onBack: () => void
  onSuccess: () => void
  planId?: "plus" | "premium"
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testMode, setTestMode] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)

  const plan = PLANS[planId]

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        onBack()
        return
      }

      setUser(user)
      setLoadingAuth(false)
    }

    checkAuth()
  }, [onBack])

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handlePayment = useCallback(async () => {
    if (!user) {
      setError("Please log in first")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create order
      const createOrderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: planId,
          email: user.email || user.user_metadata?.email || "",
          phone: user.phone || "+91",
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        }),
      })

      if (!createOrderResponse.ok) {
        throw new Error("Failed to create payment order")
      }

      const orderData = await createOrderResponse.json()

      if (orderData.testMode) {
        setTestMode(true)
        setError("Running in test mode. Razorpay keys not configured. Mock payment will be processed.")
      }

      const orderId = orderData.order.id

      // Check if Razorpay is available
      if (!window.Razorpay) {
        setError("Razorpay script failed to load. Please try again.")
        setLoading(false)
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "test_key",
        order_id: orderId,
        amount: plan.amount,
        currency: "INR",
        name: "GrahAI",
        description: `${plan.name} Plan - Vedic Astrology Subscription`,
        prefill: {
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#C9A24D",
        },
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-plan-id": planId,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed")
            }

            // Call success callback
            onSuccess()
          } catch (err) {
            setError("Payment verification failed. Please contact support.")
            console.error(err)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user, planId, plan.amount, onSuccess])

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
          <p className="text-sm text-text-dim">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Redirect handled in useEffect
  }

  return (
    <div className="min-h-screen bg-bg pb-16">
      {/* Header with Back Button */}
      <div className="border-b border-white/[0.04] bg-bg-2/30 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-6 py-6 lg:px-10">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-gold/60 hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-text">Complete Your Upgrade</h1>
              <p className="mt-1 text-sm text-text-dim">
                Choose your payment method and unlock premium features
              </p>
            </div>
            <div className="w-12" /> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Plan Details */}
            <div className="rounded-2xl border border-white/[0.04] bg-bg-2/30 p-8 backdrop-blur-sm">
              <h2 className="mb-6 text-lg font-semibold text-text">Order Summary</h2>

              {/* Plan Card */}
              <div className="mb-8 rounded-xl border border-gold/20 bg-gold/[0.03] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-text">{plan.name}</h3>
                    <p className="font-hindi text-sm text-gold/60">
                      {plan.nameHi}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gold">{plan.price}</p>
                    <p className="text-sm text-text-dim/60">/month</p>
                  </div>
                </div>
                <p className="text-sm text-text-dim/70">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="mb-4 text-sm font-semibold text-text-dim uppercase tracking-widest">
                  Includes
                </h3>
                <div className="space-y-3">
                  {plan.features.slice(0, 5).map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="h-4 w-4 mt-0.5 shrink-0 text-gold/50" />
                      <span className="text-sm text-text-dim/70">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 5 && (
                    <button className="text-sm text-gold/60 hover:text-gold transition-colors mt-2">
                      + {plan.features.length - 5} more features
                    </button>
                  )}
                </div>
              </div>

              {/* Billing Info */}
              <div className="border-t border-white/[0.04] pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-dim">Plan price</span>
                  <span className="text-text">{plan.price}/month</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-dim">Billing cycle</span>
                  <span className="text-text">Monthly</span>
                </div>
                <div className="border-t border-white/[0.04] pt-3 flex justify-between">
                  <span className="font-semibold text-text">Amount due today</span>
                  <span className="font-bold text-gold text-lg">{plan.price}</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-text-dim/50 text-center">
              By proceeding, you agree to our subscription terms. You can cancel anytime from your dashboard.
            </p>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-1 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: "100ms" }}>
            <div className="sticky top-8 rounded-2xl border border-white/[0.04] bg-bg-2/30 p-8 backdrop-blur-sm">
              <h3 className="mb-6 text-lg font-semibold text-text">Payment Method</h3>

              {/* Error Message */}
              {error && (
                <div
                  className={`mb-6 rounded-lg p-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                    testMode
                      ? "bg-gold/10 border border-gold/20"
                      : "bg-red/10 border border-red/20"
                  }`}
                >
                  <AlertCircle className={`h-5 w-5 shrink-0 mt-0.5 ${testMode ? "text-gold" : "text-red"}`} />
                  <p className={`text-sm ${testMode ? "text-gold/70" : "text-red/70"}`}>
                    {error}
                  </p>
                </div>
              )}

              {/* User Info */}
              <div className="mb-6 rounded-lg bg-bg p-4 border border-white/[0.04]">
                <div className="text-sm">
                  <p className="text-text-dim/60 mb-1">Paying as</p>
                  <p className="font-semibold text-text">{user.email || user.user_metadata?.email || ""}</p>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gold text-bg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:bg-gold-light active:enabled:scale-[0.98] flex items-center justify-center gap-2 mb-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {plan.price} — Subscribe Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Alternative Text */}
              <p className="text-xs text-text-dim/50 text-center">
                Secure payment powered by Razorpay
              </p>

              {/* Guarantees */}
              <div className="mt-8 space-y-3 pt-8 border-t border-white/[0.04]">
                <div className="flex items-start gap-3 text-xs">
                  <Check className="h-4 w-4 text-gold/50 shrink-0 mt-0.5" />
                  <span className="text-text-dim/70">256-bit SSL encrypted</span>
                </div>
                <div className="flex items-start gap-3 text-xs">
                  <Check className="h-4 w-4 text-gold/50 shrink-0 mt-0.5" />
                  <span className="text-text-dim/70">Cancel anytime, no commitment</span>
                </div>
                <div className="flex items-start gap-3 text-xs">
                  <Check className="h-4 w-4 text-gold/50 shrink-0 mt-0.5" />
                  <span className="text-text-dim/70">Instant access to all features</span>
                </div>
              </div>

              {/* Support */}
              <div className="mt-8 pt-8 border-t border-white/[0.04]">
                <p className="text-xs text-text-dim/60 mb-2">Need help?</p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-sm text-gold/60 hover:text-gold transition-colors"
                >
                  Contact support →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
