"use client"

import { Crown, Sparkles } from "lucide-react"

/* ════════════════════════════════════════════════════════
   TIER BADGE — Shows user's current plan tier
   Used in profile area, header, and settings
   ════════════════════════════════════════════════════════ */

interface TierBadgeProps {
  tier: "free" | "plus" | "premium"
  size?: "sm" | "md"
  showLabel?: boolean
}

const TIER_CONFIG = {
  free: {
    label: "Free",
    color: "text-[#5A6478]",
    bg: "bg-[#1E2638]",
    border: "border-[#1E293B]",
    Icon: null,
  },
  plus: {
    label: "Graha",
    color: "text-[#D4A054]",
    bg: "bg-[#D4A054]/10",
    border: "border-[#D4A054]/20",
    Icon: Sparkles,
  },
  premium: {
    label: "Rishi",
    color: "text-[#D4A054]",
    bg: "bg-[#D4A054]/10",
    border: "border-[#D4A054]/20",
    Icon: Crown,
  },
}

export default function TierBadge({ tier, size = "sm", showLabel = true }: TierBadgeProps) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.free

  if (tier === "free" && !showLabel) return null

  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"
  const textSize = size === "sm" ? "text-[9px]" : "text-[10px]"
  const padding = size === "sm" ? "px-1.5 py-0.5" : "px-2 py-1"

  return (
    <span className={`inline-flex items-center gap-1 ${padding} rounded-full
      ${config.bg} border ${config.border} ${config.color} ${textSize} font-semibold`}>
      {config.Icon && <config.Icon className={iconSize} />}
      {showLabel && config.label}
    </span>
  )
}
