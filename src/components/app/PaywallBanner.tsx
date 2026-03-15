"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Lock, Sparkles, ArrowRight, X } from "lucide-react"
import { useLanguage } from "@/lib/LanguageContext"

/* ════════════════════════════════════════════════════════
   SMART PAYWALL BANNER — Contextual upgrade prompt

   Appears at strategic moments per Section 14:
   - After daily question limit hit
   - After high-intent follow-ups ("tell me more", "why now?")
   - After viewing source drawer (engaged user)
   - After 3+ questions in free tier

   Does NOT appear:
   - Before first real answer
   - Before instant reveal
   - After low-confidence answer
   - Immediately after install
   ════════════════════════════════════════════════════════ */

interface PaywallBannerProps {
  isVisible: boolean
  onClose: () => void
  onUpgrade: () => void
  trigger: "limit_reached" | "high_intent" | "source_engaged" | "report_locked" | "general"
  tier?: "plus" | "premium"
}

export default function PaywallBanner({ isVisible, onClose, onUpgrade, trigger, tier }: PaywallBannerProps) {
  const { t } = useLanguage()

  const TRIGGER_MESSAGES: Record<string, { title: string; subtitle: string }> = {
    limit_reached: {
      title: t.paywall.triggerLimitTitle || "You've used today's free question",
      subtitle: t.paywall.triggerLimitDesc || "Upgrade to keep asking — your chart has more to tell you.",
    },
    high_intent: {
      title: t.paywall.triggerIntentTitle || "Want the deeper analysis?",
      subtitle: t.paywall.triggerIntentDesc || "Graha members get fuller explanations with timing and remedies.",
    },
    source_engaged: {
      title: t.paywall.triggerSourceTitle || "You're digging deep — we love that",
      subtitle: t.paywall.triggerSourceDesc || "Unlock fuller source-backed reasoning and unlimited asks.",
    },
    report_locked: {
      title: t.paywall.triggerReportTitle || "This report maps to a real life outcome",
      subtitle: t.paywall.triggerReportDesc || "Unlock detailed, chart-specific guidance for what matters most.",
    },
    general: {
      title: t.paywall.triggerGeneralTitle || "Unlock the full GrahAI experience",
      subtitle: t.paywall.triggerGeneralDesc || "Deeper clarity, more questions, premium reports.",
    },
  }
  const message = TRIGGER_MESSAGES[trigger] || TRIGGER_MESSAGES.general
  const tierLabel = tier === "premium" ? (t.pricing.rishi || "Rishi") : (t.pricing.graha || "Graha")
  const tierPrice = tier === "premium" ? "₹499" : "₹199"

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="mx-4 mb-4"
        >
          <div className="relative bg-gradient-to-br from-[#111827] to-[#0D1220]
            border border-[#D4A054]/20 rounded-2xl p-4 overflow-hidden">
            {/* Subtle gold shimmer */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4A054]/5 rounded-full blur-2xl" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#1E2638]
                flex items-center justify-center"
            >
              <X className="w-3 h-3 text-[#8892A3]" />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4A054]/10 flex items-center justify-center shrink-0">
                {trigger === "limit_reached" ? (
                  <Lock className="w-4 h-4 text-[#D4A054]" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#D4A054]" />
                )}
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-sm font-semibold text-[#F1F0F5] mb-0.5">
                  {message.title}
                </h3>
                <p className="text-xs text-[#ACB8C4] leading-relaxed mb-3">
                  {message.subtitle}
                </p>

                <button
                  onClick={onUpgrade}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
                    bg-[#D4A054]/15 border border-[#D4A054]/30
                    text-xs font-semibold text-[#D4A054]
                    hover:bg-[#D4A054]/20 transition-colors"
                >
                  {t.paywall.tryPlan || `Try ${tierLabel} — ${tierPrice}/mo`}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
