"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

// ═══════════════════════════════════════════════════
// PLAN DATA
// ═══════════════════════════════════════════════════

const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: "Free",
    period: "",
    tagline: "Start your journey",
    features: [
      "Onboarding chart reveal",
      "1 question per day",
      "Basic daily insight",
      "Chart summary",
    ],
    cta: "Current Plan",
    disabled: true,
  },
  {
    id: "plus" as const,
    name: "Plus",
    price: "₹199",
    period: "/month",
    tagline: "For the curious seeker",
    popular: true,
    features: [
      "10 questions per day",
      "Full source explanations",
      "Saved question history",
      "Weekly guidance email",
      "1 free report per month",
    ],
    cta: "Start Plus",
    disabled: false,
  },
  {
    id: "premium" as const,
    name: "Premium",
    price: "₹499",
    period: "/month",
    tagline: "Complete cosmic intelligence",
    features: [
      "Unlimited questions",
      "All reports included",
      "Compatibility analysis",
      "Annual forecast",
      "Family profiles (up to 5)",
      "Priority AI responses",
    ],
    cta: "Go Premium",
    disabled: false,
  },
]

// ═══════════════════════════════════════════════════
// PRICING MODAL (Screen 12 — Value-first Paywall)
// ═══════════════════════════════════════════════════

export default function PricingModal({ onClose }: { onClose: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState<string>("plus")

  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-5 py-3 bg-bg/90 backdrop-blur-xl border-b border-white/[0.04]">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-5 h-5 text-text-dim/50" />
        </button>
        <p className="text-[10px] uppercase tracking-[0.15em] text-text-dim/40 font-medium">Plans</p>
        <div className="w-9" />
      </div>

      <div className="mx-auto max-w-lg px-5 pb-24">
        {/* Value proposition */}
        <section className="pt-8 pb-6 text-center">
          <h2 className="text-lg font-semibold text-text mb-2">Get more from your chart</h2>
          <p className="text-xs text-text-dim/60 leading-relaxed max-w-xs mx-auto">
            Every feature unlocks deeper understanding of your birth chart — calculated from classical Vedic texts, not generic content.
          </p>
        </section>

        {/* Plan cards */}
        <section className="space-y-4">
          {PLANS.map((plan, i) => {
            const isSelected = selectedPlan === plan.id
            return (
              <motion.button
                key={plan.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                onClick={() => !plan.disabled && setSelectedPlan(plan.id)}
                className={`w-full text-left rounded-2xl border p-5 transition-all ${
                  plan.popular && isSelected
                    ? "border-gold/30 bg-gold/[0.04]"
                    : isSelected
                    ? "border-white/[0.08] bg-white/[0.03]"
                    : "border-white/[0.04] bg-bg-card/40"
                } ${plan.disabled ? "opacity-60" : ""}`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <span className="inline-block text-[9px] uppercase tracking-[0.15em] text-gold font-semibold bg-gold/10 px-2 py-0.5 rounded-full mb-3">
                    Most popular
                  </span>
                )}

                {/* Name + price row */}
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-text">{plan.name}</h3>
                    <p className="text-[11px] text-text-dim/50 mt-0.5">{plan.tagline}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-text">{plan.price}</span>
                    {plan.period && (
                      <span className="text-[11px] text-text-dim/40">{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mt-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gold/60" />
                      <span className="text-xs text-text-dim/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.button>
            )
          })}
        </section>

        {/* CTA */}
        {selectedPlan !== "free" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <button
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 font-semibold text-bg transition-all hover:bg-gold/90 active:scale-[0.98]"
            >
              {PLANS.find(p => p.id === selectedPlan)?.cta}
            </button>
            <p className="text-center text-[10px] text-text-dim/30 mt-3">
              Cancel anytime · No lock-in · Billed monthly
            </p>
          </motion.div>
        )}

        {/* Philosophy note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-[11px] text-text-dim/40 leading-relaxed max-w-xs mx-auto">
            We only suggest upgrades after you&apos;ve felt personal value from GrahAI. Your trust matters more than our revenue.
          </p>
        </motion.div>
      </div>
    </main>
  )
}
