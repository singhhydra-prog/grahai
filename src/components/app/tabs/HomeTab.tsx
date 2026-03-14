"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, ArrowRight, Heart, Briefcase, User,
  DollarSign
} from "lucide-react"
import AppHeader from "@/components/ui/AppHeader"
import type { BirthData } from "@/types/app"

interface DailyHoroscope {
  date: string
  dayOffset: number
  panchang: { tithi: string; paksha: string; nakshatra: string; vara: string; varaLord: string }
  timing: { auspiciousTime: { start: string; end: string }; rahuKaal: { start: string; end: string } }
  lucky: { colour: string; number: number }
  categories: { wealth: string; relationship: string; career: string; self: string }
  moonSign: string
  sunSign: string
  place: string
}

interface HomeTabProps {
  onAskQuestion: (question?: string) => void
  onProfileClick: () => void
  onViewReports: () => void
}

const CATEGORY_CARDS: { key: keyof DailyHoroscope["categories"]; label: string; Icon: typeof Heart; color: string }[] = [
  { key: "wealth", label: "Wealth", Icon: DollarSign, color: "text-emerald-400" },
  { key: "relationship", label: "Relationship", Icon: Heart, color: "text-rose-400" },
  { key: "career", label: "Job", Icon: Briefcase, color: "text-amber-400" },
  { key: "self", label: "Self", Icon: User, color: "text-purple-400" },
]

export default function HomeTab({ onAskQuestion, onProfileClick, onViewReports }: HomeTabProps) {
  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null)
  const [dayOffset, setDayOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [birthData, setBirthData] = useState<BirthData | null>(null)

  useEffect(() => {
    try {
      const name = localStorage.getItem("userNameForGreeting")
      if (name) setUserName(name)
      const bd = localStorage.getItem("grahai-onboarding-birthdata")
      if (bd) setBirthData(JSON.parse(bd))
    } catch {}
  }, [])

  const fetchHoroscope = useCallback(async (offset: number) => {
    if (!birthData?.dateOfBirth) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/daily-horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: birthData.dateOfBirth,
          placeOfBirth: birthData.placeOfBirth,
          offset,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setHoroscope(data)
      }
    } catch {}
    setLoading(false)
  }, [birthData])

  useEffect(() => {
    if (birthData) fetchHoroscope(dayOffset)
  }, [birthData, dayOffset, fetchHoroscope])

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const todayLabel = `Today (${months[today.getMonth()]} ${today.getDate()})`
  const tomorrowLabel = `Tomorrow (${months[tomorrow.getMonth()]} ${tomorrow.getDate()})`

  return (
    <div className="min-h-full pb-24">
      <AppHeader onProfileClick={onProfileClick} subtitle="Your daily guidance" />

      <div className="px-5 pt-2">
        {/* ═══ Daily Horoscope Header with animated text ═══ */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold animated-gradient-text-gold">Daily Horoscope</h2>
            {userName && (
              <p className="text-[11px] text-[#5A6478] text-visible">Personalized for {userName}</p>
            )}
          </div>
          {horoscope?.panchang && (
            <div className="text-right glass-inner rounded-lg px-3 py-1.5">
              <p className="text-[10px] text-[#94A3B8]">{horoscope.panchang.tithi} &middot; {horoscope.panchang.paksha}</p>
              <p className="text-[10px] text-[#5A6478]">{horoscope.panchang.vara}</p>
            </div>
          )}
        </div>

        {/* ═══ Today / Tomorrow Toggle — elastic pills ═══ */}
        <div className="flex items-center gap-2 mb-5 glass-inner rounded-2xl p-1">
          <button
            onClick={() => setDayOffset(0)}
            className={`flex-1 py-2.5 text-xs font-medium tab-pill ${
              dayOffset === 0 ? "tab-pill-active" : "text-[#5A6478]"
            }`}
          >
            {todayLabel}
          </button>
          <button
            onClick={() => setDayOffset(1)}
            className={`flex-1 py-2.5 text-xs font-medium tab-pill ${
              dayOffset === 1 ? "tab-pill-active" : "text-[#5A6478]"
            }`}
          >
            {tomorrowLabel}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-16">
            <div className="zodiac-loader mb-4">
              <div className="loader-ring" />
              <div className="loader-ring-inner" />
              <div className="loader-center" />
            </div>
            <p className="text-xs text-[#94A3B8] text-visible animated-gradient-text-gold">Reading your chart...</p>
          </div>
        ) : horoscope ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={dayOffset}
              initial={{ opacity: 0, x: dayOffset === 1 ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dayOffset === 1 ? -20 : 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* ═══ Lucky Elements ═══ */}
              <div className="glass-card p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-[#94A3B8] text-visible">
                    Lucky elements based on {userName}&apos;s birth details
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-inner rounded-xl p-3 text-center">
                    <p className="text-[10px] text-[#5A6478] mb-1">Lucky Colour</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 rounded-full shadow-lg" style={{
                        backgroundColor: horoscope.lucky.colour.toLowerCase() === "white" ? "#f0f0f0" :
                          horoscope.lucky.colour.toLowerCase() === "red" ? "#ef4444" :
                          horoscope.lucky.colour.toLowerCase() === "green" ? "#22c55e" :
                          horoscope.lucky.colour.toLowerCase() === "gold" ? "#D4A054" :
                          horoscope.lucky.colour.toLowerCase() === "yellow" ? "#eab308" :
                          horoscope.lucky.colour.toLowerCase() === "blue" ? "#3b82f6" :
                          horoscope.lucky.colour.toLowerCase() === "black" ? "#1a1a1a" :
                          horoscope.lucky.colour.toLowerCase()
                      }} />
                      <p className="text-sm font-semibold text-[#F1F0F5] text-visible">{horoscope.lucky.colour}</p>
                    </div>
                  </div>
                  <div className="glass-inner rounded-xl p-3 text-center">
                    <p className="text-[10px] text-[#5A6478] mb-1">Lucky Number</p>
                    <p className="text-sm font-semibold text-[#F1F0F5] text-visible">{horoscope.lucky.number}</p>
                  </div>
                </div>
              </div>

              {/* ═══ Timing Section ═══ */}
              <div className="glass-card p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-[#94A3B8] text-visible">
                    Time period at {horoscope.place}
                  </p>
                </div>
                <div className="space-y-2.5">
                  <div className="glass-inner rounded-xl p-3 text-center">
                    <p className="text-[10px] text-[#5A6478] mb-1">Auspicious Time</p>
                    <p className="text-sm font-semibold text-[#F1F0F5] text-visible">
                      {horoscope.timing.auspiciousTime.start} to {horoscope.timing.auspiciousTime.end}
                    </p>
                  </div>
                  <div className="glass-inner rounded-xl p-3 text-center">
                    <p className="text-[10px] text-[#5A6478] mb-1">Rahu Kaal</p>
                    <p className="text-sm font-semibold text-rose-400/80 text-visible">
                      {horoscope.timing.rahuKaal.start} to {horoscope.timing.rahuKaal.end}
                    </p>
                  </div>
                </div>
              </div>

              {/* ═══ Category Cards ═══ */}
              {CATEGORY_CARDS.map((cat, i) => (
                <motion.div
                  key={cat.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="glass-card card-lift p-4 mb-3"
                >
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <div className={`w-7 h-7 rounded-full bg-[#1E2638]/80 flex items-center justify-center`}>
                      <cat.Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                    </div>
                    <span className="text-sm font-semibold text-[#F1F0F5] text-visible">{cat.label}</span>
                  </div>
                  <p className="text-sm text-[#94A3B8] leading-relaxed relative z-10 text-visible">
                    {horoscope.categories[cat.key]}
                  </p>
                </motion.div>
              ))}

              {/* ═══ Ask Shortcut ═══ */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => onAskQuestion()}
                className="w-full flex items-center gap-3 glass-card-hero gold-shimmer
                  px-4 py-3.5 mb-5 hover:border-[#D4A054]/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#D4A054]/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#D4A054]" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-[#F1F0F5]">Ask about anything</p>
                  <p className="text-[11px] text-[#5A6478]">Love, work, timing, emotions...</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#D4A054]" />
              </motion.button>

              {/* ═══ Premium Depth ═══ */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={onViewReports}
                className="w-full glass-card p-4 text-left
                  hover:border-[#D4A054]/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#D4A054] mb-0.5">Unlock deeper insights</p>
                    <p className="text-xs text-[#5A6478]">Career blueprints, timing reports, compatibility</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#D4A054]" />
                </div>
              </motion.button>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-[#5A6478]">Complete onboarding to see your daily horoscope</p>
          </div>
        )}
      </div>
    </div>
  )
}
