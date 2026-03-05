"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const ease = [0.25, 0.46, 0.45, 0.94] as const

export function BlurReveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 35, filter: "blur(8px)" }}
      transition={{ duration: 0.85, delay, ease }}
      className={className}>{children}</motion.div>
  )
}

export function Reveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}>{children}</motion.div>
  )
}

export function Divider() {
  return (
    <div className="flex items-center gap-4 my-1">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/15" />
      <div className="h-1 w-1 rounded-full bg-gold/20" />
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/15" />
    </div>
  )
}
