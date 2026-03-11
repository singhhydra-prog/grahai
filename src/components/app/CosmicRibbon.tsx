"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

/* ═══════════════════════════════════════════════════
   COSMIC RIBBON — Swipeable timeline of transits
   Horizontal scroll showing past → present → future
   ═══════════════════════════════════════════════════ */

interface TransitEvent {
  date: string
  day: string
  event: string
  isPast?: boolean
  isToday?: boolean
  icon: string
}

const EVENTS: TransitEvent[] = [
  { date: "Mar 8", day: "Sat", event: "Moon entered Taurus", icon: "🌙", isPast: true },
  { date: "Mar 9", day: "Sun", event: "Venus-Jupiter trine", icon: "💎", isPast: true },
  { date: "Mar 10", day: "Mon", event: "Mercury sextile Mars", icon: "💚", isPast: true },
  { date: "Mar 11", day: "Tue", event: "Jupiter in 10th — career peak", icon: "💛", isToday: true },
  { date: "Mar 12", day: "Wed", event: "Sun conjunct Mercury", icon: "☀️" },
  { date: "Mar 13", day: "Thu", event: "Mars enters Gemini", icon: "🔴" },
  { date: "Mar 14", day: "Fri", event: "Full Moon in Virgo", icon: "🌕" },
  { date: "Mar 15", day: "Sat", event: "Saturn aspect on 4th", icon: "🪐" },
  { date: "Mar 16", day: "Sun", event: "Venus enters Taurus", icon: "💎" },
]

export default function CosmicRibbon() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="mt-8">
      {/* Label */}
      <div className="flex items-center gap-2 px-4 mb-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/10" />
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold/30">
          Cosmic Ribbon · समय रेखा
        </p>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/10" />
      </div>

      {/* Scrollable ribbon */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {EVENTS.map((ev, i) => (
          <motion.div
            key={i}
            className={`snap-center shrink-0 w-[140px] rounded-xl border p-3.5 transition-all ${
              ev.isToday
                ? "border-gold/25 bg-gold/[0.06] shadow-lg shadow-gold/[0.05]"
                : ev.isPast
                ? "border-white/[0.03] bg-white/[0.01] opacity-50"
                : "border-white/[0.05] bg-white/[0.02]"
            }`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: ev.isPast ? 0.5 : 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
          >
            {ev.isToday && (
              <div className="text-[8px] font-bold tracking-[0.2em] uppercase text-gold/60 mb-1.5">
                TODAY
              </div>
            )}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-base">{ev.icon}</span>
              <span className="text-[14px] font-bold text-white/80">{ev.date}</span>
            </div>
            <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">{ev.day}</p>
            <p className="text-[12px] text-white/60 leading-snug">{ev.event}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
