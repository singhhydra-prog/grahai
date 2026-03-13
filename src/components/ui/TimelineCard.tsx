"use client"

import { motion } from "framer-motion"
import type { AstroSource } from "@/types/app"

// ─── Timeline Card ─────────────────────────────
// Vertical timeline item for transits, dasha shifts, etc.

interface TimelineCardProps {
  date: string
  title: string
  body: string
  type?: "transit" | "dasha-shift" | "eclipse" | "retrograde"
  sources?: AstroSource[]
  onSourceTap?: (sources: AstroSource[]) => void
  isLast?: boolean
}

const TYPE_COLORS: Record<string, { dot: string; label: string }> = {
  transit: { dot: "bg-indigo", label: "Transit" },
  "dasha-shift": { dot: "bg-saffron", label: "Dasha Shift" },
  eclipse: { dot: "bg-red", label: "Eclipse" },
  retrograde: { dot: "bg-gold", label: "Retrograde" },
}

export default function TimelineCard({
  date,
  title,
  body,
  type = "transit",
  sources = [],
  onSourceTap,
  isLast = false,
}: TimelineCardProps) {
  const { dot, label } = TYPE_COLORS[type] || TYPE_COLORS.transit

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className={`w-2.5 h-2.5 rounded-full ${dot} ring-2 ring-bg mt-1.5 shrink-0`} />
        {!isLast && <div className="w-px flex-1 bg-white/[0.06] mt-1" />}
      </div>

      {/* Content */}
      <div className="pb-6 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-widest text-text-dim/60 font-medium">
            {date}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-text-dim/40 px-1.5 py-0.5 rounded-full border border-white/[0.04]">
            {label}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-text mb-1">{title}</h4>
        <p className="text-xs text-text-dim leading-relaxed">{body}</p>

        {sources.length > 0 && (
          <button
            onClick={() => onSourceTap?.(sources)}
            className="mt-2 text-[10px] text-text-dim/50 hover:text-gold transition-colors flex items-center gap-1"
          >
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="opacity-50">
              <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {sources[0].system}
            {sources.length > 1 && ` +${sources.length - 1}`}
          </button>
        )}
      </div>
    </motion.div>
  )
}
