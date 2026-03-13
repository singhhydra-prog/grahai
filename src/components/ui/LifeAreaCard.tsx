"use client"

import { motion } from "framer-motion"

// ─── Life Area Card ────────────────────────────
// Used in Reports tab to group reports by life area.
// Calm, spacious, no hard sell.

interface LifeAreaCardProps {
  icon: string           // emoji
  lifeArea: string       // "Career", "Love", etc.
  headline: string       // one-line personalized hook
  reportCount: number
  priceFrom?: number
  hasFreeReport?: boolean
  onTap: () => void
  className?: string
}

export default function LifeAreaCard({
  icon,
  lifeArea,
  headline,
  reportCount,
  priceFrom,
  hasFreeReport = false,
  onTap,
  className = "",
}: LifeAreaCardProps) {
  return (
    <motion.button
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full text-left rounded-2xl border border-white/[0.04]
        bg-bg-card/40 p-5 group transition-all duration-300
        hover:border-white/[0.08] hover:bg-bg-card/60
        ${className}
      `}
    >
      {/* Icon + area */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="text-sm font-semibold text-text">{lifeArea}</h3>
          <p className="text-[11px] text-text-dim/60">
            {reportCount} report{reportCount !== 1 ? "s" : ""}
            {hasFreeReport && (
              <span className="ml-1.5 text-green text-[10px]">· 1 free</span>
            )}
          </p>
        </div>
      </div>

      {/* Personalized hook */}
      <p className="text-xs text-text-dim leading-relaxed mb-3">
        {headline}
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        {priceFrom !== undefined && (
          <span className="text-[10px] text-text-dim/50">
            From ₹{priceFrom}
          </span>
        )}
        <span className="text-xs text-gold font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Explore →
        </span>
      </div>
    </motion.button>
  )
}
