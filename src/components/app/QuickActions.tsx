"use client"

import { motion } from "framer-motion"
import Link from "next/link"

/* ═══════════════════════════════════════════════════
   QUICK ACTIONS — Feature lotus grid
   8 tappable action items styled as lotus petals
   ═══════════════════════════════════════════════════ */

const ACTIONS = [
  { icon: "🃏", label: "Tarot", href: "/tarot", color: "#A78BFA" },
  { icon: "🔢", label: "Numerology", href: "/numerology", color: "#60A5FA" },
  { icon: "🏠", label: "Vastu", href: "/vastu", color: "#34D399" },
  { icon: "💕", label: "Match", href: "/compatibility", color: "#F472B6" },
  { icon: "📅", label: "Muhurta", href: "/muhurta", color: "#FBBF24" },
  { icon: "📊", label: "Reports", href: "/reports", color: "#FB923C" },
  { icon: "💎", label: "Remedies", href: "/remedies", color: "#2DD4BF" },
  { icon: "❓", label: "Prashna", href: "/prashna", color: "#818CF8" },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

export default function QuickActions() {
  return (
    <section className="mt-8 px-4">
      {/* Label */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/10" />
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold/30">
          Quick Actions · त्वरित सेवाएं
        </p>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/10" />
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-4 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {ACTIONS.map((action) => (
          <motion.div key={action.label} variants={itemVariants}>
            <Link
              href={action.href}
              className="flex flex-col items-center gap-2 py-3 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all active:scale-90"
            >
              {/* Icon with glow ring */}
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-md opacity-20"
                  style={{ background: action.color }}
                />
                <div
                  className="relative w-10 h-10 rounded-full flex items-center justify-center border"
                  style={{ borderColor: `${action.color}25`, background: `${action.color}08` }}
                >
                  <span className="text-lg">{action.icon}</span>
                </div>
              </div>
              <span className="text-[12px] font-semibold text-white/70">{action.label}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
