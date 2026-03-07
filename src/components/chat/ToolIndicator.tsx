"use client"

import { motion } from "framer-motion"

/* ────────────────────────────────────────────────────
   TOOL INDICATOR — Shows during agent tool execution
   Animated indicator with tool-specific icon + description
   ──────────────────────────────────────────────────── */

interface ToolIndicatorProps {
  toolName: string
  label: string
  icon: string
  description: string
  isComplete?: boolean
}

export default function ToolIndicator({ label, icon, description, isComplete }: ToolIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-3 rounded-xl border border-amber-500/10 bg-amber-500/[0.04] px-4 py-2.5"
    >
      {/* Icon */}
      <span className="text-lg">{icon}</span>

      {/* Label + description */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-amber-400/90">{label}</p>
        <p className="text-[11px] text-white/30 truncate">{description}</p>
      </div>

      {/* Spinner / Check */}
      {isComplete ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20"
        >
          <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      ) : (
        <div className="relative h-5 w-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="h-5 w-5 rounded-full border-2 border-amber-500/20 border-t-amber-400"
          />
        </div>
      )}
    </motion.div>
  )
}
