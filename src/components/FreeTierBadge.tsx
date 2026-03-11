"use client"

import { Zap } from "lucide-react"

interface FreeTierBadgeProps {
  remaining: number
  feature: string
}

export default function FreeTierBadge({ remaining, feature }: FreeTierBadgeProps) {
  if (remaining > 10) return null

  const urgent = remaining <= 1

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ${
      urgent
        ? "bg-red-500/10 border border-red-500/20 text-red-400"
        : "bg-gold/10 border border-gold/20 text-gold/70"
    }`}>
      <Zap className="h-3 w-3" />
      {remaining === 0
        ? `Free ${feature} used up`
        : `${remaining} free ${feature} left`
      }
    </div>
  )
}
