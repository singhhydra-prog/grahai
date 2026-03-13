"use client"

import { motion } from "framer-motion"

// ─── Empty State Card ──────────────────────────
// Warm, encouraging empty state. Never feels broken.

interface EmptyStateProps {
  icon?: string
  title: string
  body: string
  cta?: { label: string; action: () => void }
  className?: string
}

export default function EmptyState({
  icon = "✦",
  title,
  body,
  cta,
  className = "",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center text-center py-12 px-6 ${className}`}
    >
      <span className="text-3xl mb-4 opacity-40">{icon}</span>
      <h3 className="text-sm font-semibold text-text mb-1.5">{title}</h3>
      <p className="text-xs text-text-dim/60 max-w-[240px] leading-relaxed mb-4">
        {body}
      </p>
      {cta && (
        <button
          onClick={cta.action}
          className="text-xs font-medium text-gold hover:text-gold-light transition-colors"
        >
          {cta.label} →
        </button>
      )}
    </motion.div>
  )
}
