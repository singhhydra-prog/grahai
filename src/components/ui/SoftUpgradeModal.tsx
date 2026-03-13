"use client"

import { motion, AnimatePresence } from "framer-motion"

// ─── Soft Upgrade Modal ────────────────────────
// Gentle, value-first upgrade nudge.
// Shows what they'll unlock, not what they're missing.

interface SoftUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: () => void
  feature: string          // what they tried to access
  unlockItems?: string[]   // what they'd get with upgrade
  plan?: "plus" | "premium"
}

export default function SoftUpgradeModal({
  isOpen,
  onClose,
  onUpgrade,
  feature,
  unlockItems = [],
  plan = "plus",
}: SoftUpgradeModalProps) {
  const planLabel = plan === "premium" ? "Premium" : "Plus"
  const planPrice = plan === "premium" ? "₹499/mo" : "₹199/mo"

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto rounded-3xl border border-white/[0.06] bg-bg-card p-6"
          >
            {/* Warm icon */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gold/10 mb-3">
                <span className="text-xl">✦</span>
              </div>
              <h3 className="text-base font-semibold text-text">
                Unlock {feature}
              </h3>
              <p className="text-xs text-text-dim mt-1.5 leading-relaxed max-w-[260px] mx-auto">
                This insight is part of your {planLabel} experience. Here&apos;s what you&apos;ll get:
              </p>
            </div>

            {/* Unlock items */}
            {unlockItems.length > 0 && (
              <div className="space-y-2 mb-5">
                {unlockItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-text/80">
                    <span className="w-1 h-1 rounded-full bg-gold shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <button
              onClick={onUpgrade}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-bg text-sm font-semibold transition-transform active:scale-[0.98]"
            >
              Try {planLabel} · {planPrice}
            </button>

            {/* Dismiss */}
            <button
              onClick={onClose}
              className="w-full mt-2 py-2 text-xs text-text-dim/50 hover:text-text-dim transition-colors"
            >
              Maybe later
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
