"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, Check, Crown, Sparkles, MessageCircle, FileText,
  Heart, Star, Zap, ArrowRight, Shield, BookOpen, TrendingUp, Calendar
} from "lucide-react"

interface PricingOverlayProps {
  isOpen: boolean
  onClose: () => void
  highlightTier?: "plus" | "premium" | null
  trigger?: string  // What triggered the paywall (for analytics)
}

const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: 0,
    period: "",
    description: "Explore your cosmic blueprint",
    color: "text-[#94A3B8]",
    bgColor: "bg-[#111827]",
    borderColor: "border-[#1E293B]",
    features: [
      "Daily personal insight",
      "1 AI question per day",
      "Birth chart overview",
      "Moon sign & nakshatra reveal",
    ],
    limitations: [
      "No detailed reports",
      "No saved history",
      "Limited explanations",
    ],
    cta: "Current Plan",
    disabled: true,
  },
  {
    id: "graha" as const,
    tier: "plus" as const,
    name: "Graha",
    price: 199,
    period: "/month",
    description: "Deeper insights for daily clarity",
    color: "text-[#D4A054]",
    bgColor: "bg-[#D4A054]/5",
    borderColor: "border-[#D4A054]/20",
    badge: "Popular",
    features: [
      "30 AI questions per month",
      "Fuller structured explanations",
      "Career Blueprint report",
      "Wealth & Growth report",
      "Weekly guidance digest",
      "Saved question history",
      "Source-backed reasoning",
    ],
    limitations: [],
    cta: "Start Graha — ₹199/mo",
    disabled: false,
  },
  {
    id: "rishi" as const,
    tier: "premium" as const,
    name: "Rishi",
    price: 499,
    period: "/month",
    description: "Complete Jyotish companion",
    color: "text-purple-400",
    bgColor: "bg-purple-500/5",
    borderColor: "border-purple-500/20",
    badge: "Best Value",
    features: [
      "Unlimited AI questions",
      "All Graha features",
      "Love & Compatibility report",
      "Marriage Timing report",
      "Annual Forecast 2026",
      "Dasha Deep Dive report",
      "Deeper timing analysis",
      "Priority insights",
    ],
    limitations: [],
    cta: "Start Rishi — ₹499/mo",
    disabled: false,
  },
]

const ONE_TIME_PACKS = [
  { id: "kundli-match", label: "Kundli Matching", price: 499, icon: Heart, description: "36 Guna compatibility" },
  { id: "annual-forecast", label: "Annual Forecast", price: 599, icon: Calendar, description: "Month-by-month guidance" },
  { id: "career-blueprint", label: "Career Blueprint", price: 299, icon: TrendingUp, description: "Professional direction" },
  { id: "dasha-deep-dive", label: "Dasha Deep Dive", price: 499, icon: BookOpen, description: "Current period analysis" },
]

export default function PricingOverlay({ isOpen, onClose, highlightTier }: PricingOverlayProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(highlightTier === "premium" ? "rishi" : "graha")
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<"plans" | "packs">("plans")

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") return
    setLoading(true)

    try {
      const userData = localStorage.getItem("grahai-onboarding-birthdata")
      const parsed = userData ? JSON.parse(userData) : {}

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: planId === "rishi" ? "rishi" : "graha",
          email: parsed.email || "",
          phone: parsed.phone || "",
          name: parsed.name || "User",
        }),
      })

      const data = await res.json()

      if (data.success && data.order) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = typeof window !== "undefined" ? (window as any) : null
        if (win && win.Razorpay) {
          const RazorpayConstructor = win.Razorpay as new (opts: Record<string, unknown>) => { open: () => void }
          const rzp = new RazorpayConstructor({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
            amount: data.order.amount,
            currency: data.order.currency,
            name: "GrahAI",
            description: `${planId === "rishi" ? "Rishi" : "Graha"} Plan`,
            order_id: data.order.id,
            handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
              await fetch("/api/payment/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-plan-id": planId === "rishi" ? "premium" : "plus",
                },
                body: JSON.stringify(response),
              })
              localStorage.setItem("grahai-subscription-tier", planId === "rishi" ? "premium" : "plus")
              onClose()
              window.location.reload()
            },
            theme: { color: "#D4A054" },
          })
          rzp.open()
        } else {
          if (data.testMode) {
            alert("Payment system is in test mode. In production, Razorpay checkout would open here.")
          }
        }
      }
    } catch (err) {
      console.error("Payment error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Track paywall view
  // useEffect(() => {
  //   if (isOpen) trackClientEvent("paywall_viewed", { trigger, highlightTier })
  // }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-[#0A0E1A] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <button onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#1E2638] border border-[#1E293B] flex items-center justify-center">
              <X className="w-4 h-4 text-[#5A6478]" />
            </button>
            <h1 className="text-base font-semibold text-[#F1F0F5]">Choose Your Plan</h1>
            <div className="w-10" />
          </div>

          {/* Tagline */}
          <div className="text-center px-5 pt-2 pb-4">
            <Crown className="w-8 h-8 text-[#D4A054] mx-auto mb-2" />
            <p className="text-sm text-[#94A3B8]">Source-backed guidance, deeper clarity</p>
          </div>

          {/* Plans / Packs toggle */}
          <div className="flex gap-2 mx-5 mb-5">
            <button onClick={() => setTab("plans")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
                tab === "plans" ? "bg-[#D4A054]/15 text-[#D4A054] border border-[#D4A054]/30" : "bg-[#111827] text-[#5A6478] border border-[#1E293B]"
              }`}>Monthly Plans</button>
            <button onClick={() => setTab("packs")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
                tab === "packs" ? "bg-[#D4A054]/15 text-[#D4A054] border border-[#D4A054]/30" : "bg-[#111827] text-[#5A6478] border border-[#1E293B]"
              }`}>One-Time Reports</button>
          </div>

          <div className="px-5 pb-32">
            {tab === "plans" ? (
              <div className="space-y-4">
                {PLANS.map((plan, i) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => !plan.disabled && setSelectedPlan(plan.id)}
                    className={`relative rounded-2xl p-5 border transition-all cursor-pointer ${
                      selectedPlan === plan.id && !plan.disabled
                        ? `${plan.bgColor} ${plan.borderColor}`
                        : "bg-[#111827] border-[#1E293B]"
                    }`}
                  >
                    {plan.badge && (
                      <span className={`absolute -top-2.5 right-4 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        plan.id === "graha" ? "bg-[#D4A054] text-[#0A0E1A]" : "bg-purple-500 text-white"
                      }`}>{plan.badge}</span>
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className={`text-lg font-bold ${plan.color}`}>{plan.name}</h3>
                        <p className="text-xs text-[#5A6478]">{plan.description}</p>
                      </div>
                      <div className="text-right">
                        {plan.price === 0 ? (
                          <p className="text-lg font-bold text-[#F1F0F5]">Free</p>
                        ) : (
                          <>
                            <p className="text-lg font-bold text-[#F1F0F5]">₹{plan.price}</p>
                            <p className="text-[10px] text-[#5A6478]">{plan.period}</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {plan.features.map((f) => (
                        <div key={f} className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="text-xs text-[#94A3B8]">{f}</span>
                        </div>
                      ))}
                      {plan.limitations.map((l) => (
                        <div key={l} className="flex items-center gap-2">
                          <X className="w-3 h-3 text-[#5A6478] shrink-0" />
                          <span className="text-xs text-[#5A6478]">{l}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* Value props */}
                <div className="flex items-center justify-center gap-4 pt-4">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-[#5A6478]">Secure via Razorpay</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-[#D4A054]" />
                    <span className="text-[10px] text-[#5A6478]">Cancel Anytime</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span className="text-[10px] text-[#5A6478]">BPHS-sourced</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-[#5A6478] mb-2">
                  Buy individual reports. No subscription needed.
                </p>
                {ONE_TIME_PACKS.map((pack, i) => (
                  <motion.button
                    key={pack.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="w-full flex items-center justify-between bg-[#111827] border border-[#1E293B] rounded-xl px-4 py-3.5
                      hover:border-[#D4A054]/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D4A054]/10 flex items-center justify-center">
                        <pack.icon className="w-4 h-4 text-[#D4A054]" />
                      </div>
                      <div className="text-left">
                        <span className="text-sm text-[#F1F0F5] block">{pack.label}</span>
                        <span className="text-[10px] text-[#5A6478]">{pack.description}</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#D4A054]">₹{pack.price}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Sticky CTA */}
          <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4
            bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/95 to-transparent">
            {tab === "plans" && selectedPlan !== "free" && (
              <button
                onClick={() => handleSubscribe(selectedPlan)}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-semibold text-sm btn-primary
                  flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#0A0E1A]/30 border-t-[#0A0E1A] rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    {PLANS.find(p => p.id === selectedPlan)?.cta || "Subscribe"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
