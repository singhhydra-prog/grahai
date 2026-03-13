"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, type LucideIcon } from "lucide-react"

/* ════════════════════════════════════════════════════════
   EMPTY STATE — Reusable placeholder for pages with no data
   ════════════════════════════════════════════════════════ */

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
    >
      <div className="mb-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
        <Icon className="h-8 w-8 text-white/20" />
      </div>
      <h3 className="text-lg font-semibold text-[#E8E4DB] mb-2">{title}</h3>
      <p className="text-sm text-[#8A8690] max-w-xs mb-6">{description}</p>
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500/80 to-amber-600/80 px-5 py-2.5 text-sm font-semibold text-[#060A14] hover:from-amber-400 hover:to-amber-500 transition-all active:scale-[0.98]"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500/80 to-amber-600/80 px-5 py-2.5 text-sm font-semibold text-[#060A14] hover:from-amber-400 hover:to-amber-500 transition-all active:scale-[0.98]"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        )
      )}
    </motion.div>
  )
}
