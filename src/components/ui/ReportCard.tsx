"use client"

import { motion } from "framer-motion"
import { Lock, ChevronRight } from "lucide-react"

interface ReportCardProps {
  title: string
  subtitle: string
  icon: string
  isFree: boolean
  isPurchased?: boolean
  validity?: string
  onClick?: () => void
  delay?: number
}

export default function ReportCard({
  title,
  subtitle,
  icon,
  isFree,
  isPurchased,
  validity,
  onClick,
  delay = 0,
}: ReportCardProps) {
  const isLocked = !isFree && !isPurchased

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      onClick={onClick}
      className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 text-left
        active:scale-[0.98] transition-transform group"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-bg-elevated flex items-center justify-center text-2xl shrink-0">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text truncate">{title}</h3>
          {isFree && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-success bg-success/10 px-1.5 py-0.5 rounded">
              Free
            </span>
          )}
        </div>
        <p className="text-xs text-text-dim mt-0.5 line-clamp-1">{subtitle}</p>
        {validity && (
          <p className="text-[10px] text-text-dim mt-1">Valid for {validity}</p>
        )}
      </div>

      {/* Action */}
      <div className="shrink-0">
        {isLocked ? (
          <Lock className="w-4 h-4 text-text-dim" />
        ) : (
          <ChevronRight className="w-4 h-4 text-text-dim group-hover:text-magenta transition-colors" />
        )}
      </div>
    </motion.button>
  )
}
