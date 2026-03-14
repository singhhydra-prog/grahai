"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  glow?: "magenta" | "cyan" | "none"
  delay?: number
}

export default function GlassCard({
  children,
  className = "",
  onClick,
  glow = "none",
  delay = 0,
}: GlassCardProps) {
  const glowClass =
    glow === "magenta"
      ? "glow-magenta"
      : glow === "cyan"
      ? "glow-cyan"
      : ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      onClick={onClick}
      className={`glass-card rounded-2xl p-4 ${glowClass} ${
        onClick ? "cursor-pointer active:scale-[0.98] transition-transform" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  )
}
