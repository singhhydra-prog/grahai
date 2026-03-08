"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { CalendarDays, ArrowRight, TrendingUp, AlertTriangle, Sparkles } from "lucide-react"
import Link from "next/link"

/* ════════════════════════════════════════════════════
   "This Week in the Stars" — Transit Brief
   Animated weekly overview of major planetary transits
   Shows free highlights, paywall for detailed analysis
   ════════════════════════════════════════════════════ */

/* Generate week dates */
function getWeekRange(): { start: string; end: string; days: string[] } {
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - now.getDay() + 1)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const fmt = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toLocaleDateString("en-IN", { weekday: "short" })
  })

  return { start: fmt(monday), end: fmt(sunday), days }
}

/* Static transit data — in production this would come from the ephemeris API */
const TRANSITS = [
  {
    planet: "Sun",
    emoji: "☀️",
    sign: "Pisces",
    sanskrit: "मीन",
    effect: "Spiritual introspection peaks. Ideal for meditation and creative work.",
    intensity: 3,
    type: "positive" as const,
  },
  {
    planet: "Mars",
    emoji: "♂️",
    sign: "Gemini",
    sanskrit: "मिथुन",
    effect: "High energy in communication. Great for negotiations but watch for arguments.",
    intensity: 4,
    type: "mixed" as const,
  },
  {
    planet: "Jupiter",
    emoji: "♃",
    sign: "Taurus",
    sanskrit: "वृषभ",
    effect: "Financial wisdom expands. Investment opportunities align with dharmic values.",
    intensity: 5,
    type: "positive" as const,
  },
  {
    planet: "Venus",
    emoji: "♀️",
    sign: "Aries",
    sanskrit: "मेष",
    effect: "Bold romantic energy. New relationships may spark suddenly.",
    intensity: 3,
    type: "positive" as const,
  },
  {
    planet: "Saturn",
    emoji: "♄",
    sign: "Pisces",
    sanskrit: "मीन",
    effect: "Karmic lessons through spiritual discipline. Structure your inner world.",
    intensity: 4,
    type: "caution" as const,
  },
]

function IntensityBar({ level, type }: { level: number; type: "positive" | "mixed" | "caution" }) {
  const colors = {
    positive: "bg-emerald-400/60",
    mixed: "bg-amber-400/60",
    caution: "bg-red-400/40",
  }
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 w-4 rounded-full transition-all ${
            i < level ? colors[type] : "bg-white/[0.06]"
          }`}
        />
      ))}
    </div>
  )
}

export default function WeeklyTransitBrief() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const week = getWeekRange()

  return (
    <section className="relative py-28 lg:py-36">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-gold/60" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold/50">
              This Week in the Stars
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Cosmic Weather:{" "}
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              {week.start} – {week.end}
            </span>
          </h2>
          <p className="text-text-dim/60 text-sm max-w-lg mx-auto">
            Major planetary transits affecting everyone this week. See how they interact with your chart.
          </p>
        </motion.div>

        {/* Day labels */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="flex justify-between mb-6 px-2"
        >
          {week.days.map((d, i) => {
            const isToday = i === (new Date().getDay() + 6) % 7
            return (
              <span
                key={d}
                className={`text-[10px] font-medium w-10 text-center ${
                  isToday ? "text-gold" : "text-text-dim/30"
                }`}
              >
                {d}
                {isToday && <span className="block w-1 h-1 bg-gold rounded-full mx-auto mt-1" />}
              </span>
            )
          })}
        </motion.div>

        {/* Transit cards */}
        <div className="space-y-3">
          {TRANSITS.map((t, i) => (
            <motion.div
              key={t.planet}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card rounded-xl border border-white/[0.06] p-4 hover:border-white/10 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{t.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white/90">{t.planet}</span>
                    <span className="text-xs text-text-dim/40">in</span>
                    <span className="text-sm font-medium text-white/70">{t.sign}</span>
                    <span className="text-xs text-gold/40 font-hindi">{t.sanskrit}</span>
                    <div className="ml-auto">
                      {t.type === "positive" && <TrendingUp className="w-3.5 h-3.5 text-emerald-400/60" />}
                      {t.type === "mixed" && <Sparkles className="w-3.5 h-3.5 text-amber-400/60" />}
                      {t.type === "caution" && <AlertTriangle className="w-3.5 h-3.5 text-red-400/40" />}
                    </div>
                  </div>
                  <p className="text-xs text-text-dim/50 leading-relaxed mb-2">{t.effect}</p>
                  <IntensityBar level={t.intensity} type={t.type} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-text-dim/40 mb-3">
            These are general transits. Your experience depends on your unique birth chart.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/80 to-emerald-500/80 text-white text-sm font-semibold hover:from-blue-500 hover:to-emerald-500 transition-all"
          >
            See how transits affect YOUR chart
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
