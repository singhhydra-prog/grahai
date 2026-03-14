"use client"

import { Flame } from "lucide-react"

/* ════════════════════════════════════════════════════════
   STREAK BADGE — Shows daily usage streak
   Displayed on Home tab for retention
   ════════════════════════════════════════════════════════ */

interface StreakBadgeProps {
  days: number
  compact?: boolean
}

export default function StreakBadge({ days, compact = false }: StreakBadgeProps) {
  if (days < 1) return null

  // Color intensity increases with streak length
  const getColor = () => {
    if (days >= 30) return { flame: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" }
    if (days >= 7) return { flame: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" }
    return { flame: "text-[#D4A054]", bg: "bg-[#D4A054]/10", border: "border-[#D4A054]/20" }
  }

  const colors = getColor()

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
        ${colors.bg} border ${colors.border}`}>
        <Flame className={`w-3 h-3 ${colors.flame}`} />
        <span className={`text-[10px] font-semibold ${colors.flame}`}>{days}</span>
      </span>
    )
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl
      ${colors.bg} border ${colors.border}`}>
      <Flame className={`w-4 h-4 ${colors.flame}`} />
      <div>
        <p className={`text-xs font-semibold ${colors.flame}`}>{days}-day streak</p>
        <p className="text-[10px] text-[#5A6478]">
          {days >= 30 ? "Incredible consistency!" : days >= 7 ? "Keep it going!" : "Building momentum"}
        </p>
      </div>
    </div>
  )
}
