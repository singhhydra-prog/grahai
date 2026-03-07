"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

type TransitionVariant = "standard" | "cosmic" | "quick"

const ease = [0.22, 1, 0.36, 1] as const

const variants = {
  standard: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.5, ease },
  },
  cosmic: {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(4px)" },
    transition: { duration: 0.6, ease },
  },
  quick: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { duration: 0.3, ease },
  },
} as const

interface PageTransitionProps {
  children: ReactNode
  variant?: TransitionVariant
  className?: string
}

export function PageTransition({
  children,
  variant = "standard",
  className = "",
}: PageTransitionProps) {
  const v = variants[variant]

  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={v.transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}
