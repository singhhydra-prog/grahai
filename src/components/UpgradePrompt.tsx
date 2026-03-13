"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Sparkles, ArrowRight, Star, Crown, Zap, X } from "lucide-react"
import Link from "next/link"

/* ════════════════════════════════════════════════════════
   UPGRADE PROMPT — Reusable paywall / upsell component

   Variants:
   - "card"    → Original centered card (default)
   - "banner"  → Slim bar with CTA
   - "limit"   → Usage limit reached warning
   ════════════════════════════════════════════════════════ */

interface UpgradePromptProps {
  variant?: "card" | "banner" | "limit"
  feature?: string
  description?: string
  plan?: "plus" | "premium"
  currentTier?: string
  remaining?: number
  limit?: number
  onDismiss?: () => void
  className?: string
}

const PLAN_PRICES: Record<string, string> = {
  plus: "₹199/mo",
  premium: "₹499/mo",
}

export default function UpgradePrompt({
  variant = "card",
  feature = "Premium Features",
  description,
  plan = "plus",
  currentTier = "free",
  remaining,
  limit,
  onDismiss,
  className = "",
}: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false)

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  if (dismissed) return null

  const planName = plan === "premium" ? "Premium" : "Plus"
  const price = PLAN_PRICES[plan] || PLAN_PRICES.plus

  /* ── Usage Limit Reached ── */
  if (variant === "limit") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] to-orange-500/[0.04] p-6 backdrop-blur-sm ${className}`}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Zap className="h-6 w-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-[#E8E4DB] mb-1">
              Daily limit reached
            </h3>
            <p className="text-sm text-[#8A8690] mb-4">
              You&apos;ve used all {limit} messages on your {currentTier} plan today.
              Upgrade to unlock more.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/pricing/checkout?plan=${plan}`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-[#060A14] hover:from-amber-400 hover:to-amber-500 transition-all active:scale-[0.98]"
              >
                <Crown className="h-4 w-4" />
                Upgrade to {planName} — {price}
              </Link>
              <span className="text-xs text-[#8A8690]">
                Resets at midnight
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  /* ── Banner ── */
  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-b border-amber-500/15 px-4 py-2.5 ${className}`}
      >
        <div className="flex items-center justify-center gap-3 text-sm">
          <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
          <span className="text-[#E8E4DB]/80">
            {remaining !== undefined && remaining <= 1
              ? "Last free message today!"
              : `Unlock full ${feature} with ${planName}`}
          </span>
          <Link
            href={`/pricing/checkout?plan=${plan}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/25 px-3 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/25 transition-colors shrink-0"
          >
            Upgrade <ArrowRight className="h-3 w-3" />
          </Link>
          {onDismiss && (
            <button
              onClick={handleDismiss}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/20 hover:text-white/50"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    )
  }

  /* ── Card (default) ── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/[0.08] to-transparent p-8 text-center ${className}`}
    >
      {/* Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-gold/10 blur-[80px]" />

      <div className="relative z-10">
        <div className="mx-auto mb-4 inline-flex rounded-full bg-gold/10 p-3">
          <Lock className="h-6 w-6 text-gold" />
        </div>

        <h3 className="mb-2 text-lg font-bold text-white">
          Unlock {feature}
        </h3>
        <p className="mb-6 text-sm text-white/60 max-w-sm mx-auto">
          {description || `Get full access to ${feature} with the ${planName} plan.`}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/pricing/checkout?plan=${plan}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-gold/90 active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" />
            Upgrade to {planName} {price}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-gold/60 hover:text-gold/80 transition-colors"
          >
            Compare Plans
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className="h-3 w-3 fill-gold/40 text-gold/40" />
          ))}
          <span className="ml-1 text-[11px] text-white/40">Trusted by 50,000+ users</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════
   USAGE COUNTER — Shows remaining messages for free users
   ════════════════════════════════════════════════════════ */
export function UsageCounter({
  remaining,
  limit,
}: {
  remaining: number
  limit: number
  tier?: string
}) {
  if (limit === -1) return null // Unlimited

  const pct = limit > 0 ? Math.round(((limit - remaining) / limit) * 100) : 0
  const isLow = remaining <= 1
  const isEmpty = remaining <= 0

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${
      isEmpty
        ? "bg-red-500/10 border border-red-500/20 text-red-400"
        : isLow
          ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
          : "bg-white/5 border border-white/10 text-[#8A8690]"
    }`}>
      <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isEmpty ? "bg-red-400" : isLow ? "bg-amber-400" : "bg-emerald-400"
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span>
        {isEmpty ? "0" : remaining}/{limit}
      </span>
    </div>
  )
}
