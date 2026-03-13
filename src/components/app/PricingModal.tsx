"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X, ChevronRight } from "lucide-react"

/* ────────────────────────────────────────────────────
   PRICING PLANS
   ──────────────────────────────────────────────────── */
const plans = [
  {
    id: "free",
    name: "Free",
    price: "Free",
    description: "Start your journey",
    popular: false,
    current: true,
    features: [
      "Onboarding reveal",
      "Daily insight",
      "1 question/day or 3 welcome questions",
      "Basic chart summary",
    ],
    cta: "Current Plan",
    ctaDisabled: true,
  },
  {
    id: "plus",
    name: "Plus",
    price: "₹199",
    period: "/month",
    description: "For the curious seeker",
    popular: true,
    current: false,
    features: [
      "More questions (10/day)",
      "Full home dashboard",
      "Saved history",
      "Weekly guidance email",
      "Full source explanations",
    ],
    cta: "Start Plus",
    ctaDisabled: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹499",
    period: "/month",
    description: "Complete cosmic intelligence",
    popular: false,
    current: false,
    features: [
      "Unlimited ask",
      "Compatibility reports",
      "Annual forecast",
      "Deep timing analysis",
      "Family profiles (up to 5)",
      "Advanced reports",
    ],
    cta: "Go Premium",
    ctaDisabled: false,
  },
]

const oneTimePurchases = [
  {
    id: "kundli-export",
    name: "PDF Kundli Export",
    price: "₹149",
    description: "Export your complete Kundli",
  },
  {
    id: "compatibility-deepdive",
    name: "Compatibility Deep-Dive",
    price: "₹249",
    description: "Detailed partner analysis",
  },
  {
    id: "annual-forecast",
    name: "Annual Forecast 2026",
    price: "₹399",
    description: "Year-long predictions",
  },
  {
    id: "live-consult",
    name: "Live Jyotishi Consult",
    price: "₹999",
    description: "30-min expert session",
  },
  {
    id: "remedies-pack",
    name: "Remedies Pack",
    price: "₹149",
    description: "Personalized remedies",
  },
]

/* ════════════════════════════════════════════════════
   PRICING MODAL
   ════════════════════════════════════════════════════ */
export default function PricingModal({ onClose }: { onClose: () => void }) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition((e.target as HTMLDivElement).scrollLeft)
  }

  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-[#060A14]">
      {/* ═══ HEADER ═══ */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#060A14]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>
        <h1 className="text-lg font-bold text-white">Choose Your Plan</h1>
        <div className="w-9" />
      </div>

      {/* ═══ PLANS SECTION ═══ */}
      <section className="px-6 py-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3 mb-16">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className={`relative flex flex-col rounded-2xl border p-8 lg:p-10 transition-all duration-500 ${
                    plan.popular
                      ? "border-amber-400/20 bg-white/[0.03] shadow-lg shadow-amber-400/[0.05]"
                      : "border-white/[0.04] bg-white/[0.03] hover:border-white/[0.08]"
                  }`}
                >
                  {/* Most Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 px-4 py-1.5 text-[10px] font-semibold tracking-widest uppercase text-amber-400">
                        ⭐ Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-white/60 mb-6">{plan.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-amber-400">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-sm text-white/50">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex-1 mb-8">
                    <div className="space-y-3">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <Check className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
                          <span className="text-sm text-white/70">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    disabled={plan.ctaDisabled}
                    className={`flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all active:scale-[0.98] ${
                      plan.current
                        ? "bg-white/[0.05] text-white/60 cursor-default border border-white/[0.1]"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/30 cursor-pointer"
                    }`}
                  >
                    {plan.cta}
                    {!plan.ctaDisabled && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Monetization Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-16"
          >
            <p className="text-xs text-white/40 leading-relaxed">
              We only suggest upgrades after you've felt personal value
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ ONE-TIME PURCHASES ═══ */}
      <section className="px-6 py-12 lg:py-16 border-t border-white/[0.04]">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-2">One-Time Purchases</h2>
            <p className="text-sm text-white/60">Enhance your readings with specialized reports</p>
          </motion.div>

          {/* Horizontal Scroll Cards */}
          <div
            onScroll={handleScroll}
            className="overflow-x-auto pb-4 -mx-6 px-6 scroll-smooth"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="flex gap-4 min-w-min">
              {oneTimePurchases.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex-shrink-0 w-80"
                >
                  <div className="rounded-xl border border-white/[0.04] bg-white/[0.03] p-6 hover:border-white/[0.08] transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-white/50 mt-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-amber-400">
                        {product.price}
                      </span>
                      <button className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
                        <ChevronRight className="h-4 w-4 text-amber-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          {scrollPosition < 100 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mt-6"
            >
              <p className="text-xs text-white/40">Scroll to see more →</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Extra padding for mobile */}
      <div className="h-12" />
    </main>
  )
}
