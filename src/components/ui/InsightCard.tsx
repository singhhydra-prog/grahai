"use client"

import { motion } from "framer-motion"
import type { AstroSource } from "@/types/app"

// ─── Premium Insight Card ──────────────────────
// The core content unit across GrahAI.
// Shows a personalized insight with visible sources.

interface InsightCardProps {
  title: string
  body: string
  sources?: AstroSource[]
  category?: "transit" | "dasha" | "natal" | "remedy"
  urgency?: "high" | "medium" | "low"
  cta?: { label: string; action: () => void }
  onSourceTap?: (sources: AstroSource[]) => void
  className?: string
  compact?: boolean
}

const CATEGORY_ACCENT: Record<string, string> = {
  transit: "border-l-indigo",
  dasha: "border-l-saffron",
  natal: "border-l-gold",
  remedy: "border-l-green",
}

const URGENCY_DOT: Record<string, string> = {
  high: "bg-red",
  medium: "bg-saffron",
  low: "bg-green",
}

export default function InsightCard({
  title,
  body,
  sources = [],
  category = "natal",
  urgency,
  cta,
  onSourceTap,
  className = "",
  compact = false,
}: InsightCardProps) {
  const accentClass = CATEGORY_ACCENT[category] || "border-l-gold"

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className={`
        relative rounded-2xl border border-white/[0.04] bg-bg-card/60
        backdrop-blur-sm border-l-2 ${accentClass}
        ${compact ? "p-4" : "p-5"}
        ${className}
      `}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className={`text-text font-semibold leading-tight ${compact ? "text-sm" : "text-base"}`}>
          {urgency && (
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${URGENCY_DOT[urgency]} mr-2 relative top-[-1px]`} />
          )}
          {title}
        </h3>
      </div>

      {/* Body */}
      <p className={`text-text-dim leading-relaxed ${compact ? "text-xs" : "text-sm"}`}>
        {body}
      </p>

      {/* Source pills + CTA row */}
      {(sources.length > 0 || cta) && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
          {/* Source pills */}
          {sources.length > 0 && (
            <button
              onClick={() => onSourceTap?.(sources)}
              className="flex items-center gap-1.5 text-[11px] text-text-dim/70 hover:text-gold transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="opacity-50">
                <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>
                {sources[0].system}
                {sources.length > 1 && ` +${sources.length - 1}`}
              </span>
            </button>
          )}

          {/* CTA */}
          {cta && (
            <button
              onClick={cta.action}
              className="text-xs font-medium text-gold hover:text-gold-light transition-colors"
            >
              {cta.label} →
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
