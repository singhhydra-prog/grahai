"use client"

import { motion } from "framer-motion"
import { Share2, Volume2 } from "lucide-react"

/* ═══════════════════════════════════════════════════
   SCROLL OF DESTINY — Daily cosmic reading
   The first thing users see — inscribes on load
   ═══════════════════════════════════════════════════ */

const DAILY_VERSE = {
  sanskrit: "गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः",
  lines: [
    "Jupiter is in your 10th house today.",
    "Recognition and authority are coming your way.",
    "Speak with confidence — the cosmos is with you.",
  ],
}

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

const inscribeVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(12px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, delay: 0.4 + i * 0.3, ease: EASE },
  }),
}

interface ScrollOfDestinyProps {
  onShare?: () => void
}

export default function ScrollOfDestiny({ onShare }: ScrollOfDestinyProps) {
  return (
    <motion.section
      className="relative mx-4 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Ancient scroll texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-amber-950/10 to-transparent rounded-2xl" />
      <div className="absolute inset-0 border border-gold/10 rounded-2xl" />

      <div className="relative p-6 text-center">
        {/* Label */}
        <motion.p
          className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold/30 mb-4"
          custom={0}
          variants={inscribeVariants}
          initial="hidden"
          animate="visible"
        >
          आज का वचन · Today&apos;s Scroll
        </motion.p>

        {/* Sanskrit verse */}
        <motion.p
          className="font-hindi text-xl font-semibold text-gold/70 mb-5 leading-relaxed"
          custom={1}
          variants={inscribeVariants}
          initial="hidden"
          animate="visible"
        >
          {DAILY_VERSE.sanskrit}
        </motion.p>

        {/* Meaning lines */}
        <div className="space-y-1.5 mb-6">
          {DAILY_VERSE.lines.map((line, i) => (
            <motion.p
              key={i}
              className="text-[15px] text-white/90 font-normal leading-relaxed"
              custom={2 + i}
              variants={inscribeVariants}
              initial="hidden"
              animate="visible"
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Actions */}
        <motion.div
          className="flex items-center justify-center gap-4"
          custom={5}
          variants={inscribeVariants}
          initial="hidden"
          animate="visible"
        >
          <button
            onClick={onShare}
            className="inline-flex items-center gap-2 rounded-full bg-green-600/15 border border-green-500/20 px-4 py-2 text-xs font-semibold text-green-400 hover:bg-green-600/25 transition-all active:scale-95"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share on WhatsApp
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold text-white/50 hover:bg-white/10 transition-all active:scale-95">
            <Volume2 className="h-3.5 w-3.5" />
            Listen
          </button>
        </motion.div>
      </div>
    </motion.section>
  )
}
