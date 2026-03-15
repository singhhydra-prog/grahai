"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, ArrowRight, Heart, Briefcase, Zap,
  BookOpen, MessageCircle, ChevronRight,
  CheckCircle, AlertTriangle, Calendar, ExternalLink, Bookmark, Clock
} from "lucide-react"
import AppHeader from "@/components/ui/AppHeader"
import SourceDrawer from "@/components/ui/SourceDrawer"
import { useLanguage } from "@/lib/LanguageContext"
import type { BirthData } from "@/types/app"

interface ThemeData {
  title: string
  headline: string
  action: string
  caution: string
  whyActive: string
  source: { principle: string; text: string; reference: string }
}

interface DailyHoroscope {
  date: string
  dayOffset: number
  theme: ThemeData
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

export default function HomeTab({ onAskQuestion, onProfileClick, onViewReports }: HomeTabProps) {
  const { t } = useLanguage()

  const LIFE_AREA_CARDS: {
    key: "relationship" | "career" | "self"
    label: string
    subtitle: string
    Icon: typeof Heart
    color: string
    bgColor: string
  }[] = [
    { key: "relationship", label: t.home.loveCard, subtitle: t.ask.topicLove, Icon: Heart, color: "text-rose-400", bgColor: "bg-rose-500/10" },
    { key: "career", label: t.home.careerCard, subtitle: t.ask.topicCareer, Icon: Briefcase, color: "text-amber-400", bgColor: "bg-amber-500/10" },
    { key: "self", label: t.home.energyCard, subtitle: t.ask.topicHealth, Icon: Zap, color: "text-[#D4A054]", bgColor: "bg-[#D4A054]/10" },
  ]

  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null)
  const [dayOffset, setDayOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [birthData, setBirthData] = useState<BirthData | null>(null)
  const [sourceDrawerOpen, setSourceDrawerOpen] = useState(false)
  const [activeSource, setActiveSource] = useState<ThemeData["source"] | null>(null)
  const [sourceContext, setSourceContext] = useState("")

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
          birthTime: birthData.timeOfBirth,
          placeOfBirth: birthData.placeOfBirth,
          latitude: birthData.latitude,
          longitude: birthData.longitude,
          timezone: birthData.timezone,
          name: birthData.name,
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

  const openSource = (source: ThemeData["source"], context: string) => {
    setActiveSource(source)
    setSourceContext(context)
    setSourceDrawerOpen(true)
  }

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const todayLabel = `${t.common.today} (${months[today.getMonth()]} ${today.getDate()})`
  const tomorrowLabel = `${t.common.tomorrow} (${months[tomorrow.getMonth()]} ${tomorrow.getDate()})`

  return (
    <div className="min-h-full pb-24">
      <AppHeader onProfileClick={onProfileClick} subtitle={t.home.todayGuidance} />

      <div className="px-5 pt-2">
        {/* ═══ Day Toggle ═══ */}
        <div className="flex items-center gap-2 mb-5 glass-inner rounded-2xl p-1">
          <button
            onClick={() => setDayOffset(0)}
            className={`flex-1 py-2.5 text-xs font-medium tab-pill ${
              dayOffset === 0 ? "tab-pill-active" : "text-[#8892A3]"
            }`}
          >
            {todayLabel}
          </button>
          <button
            onClick={() => setDayOffset(1)}
            className={`flex-1 py-2.5 text-xs font-medium tab-pill ${
              dayOffset === 1 ? "tab-pill-active" : "text-[#8892A3]"
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
            <p
              className="text-xs font-medium"
              style={{
                background: "linear-gradient(270deg, #E8C278, #D4A054, #F59E0B, #E8C278)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradient-text-flow 4s ease-in-out infinite",
              }}
            >{t.onboarding.readingChart}</p>
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
              {/* ═══ 1. Today for You — Hero Theme ═══ */}
              <div className="glass-card-hero gold-shimmer p-5 mb-4">
                {/* Panchang badge */}
                {horoscope.panchang && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[10px] text-[#ACB8C4] bg-[#1E2638] px-2 py-0.5 rounded-full">
                      {horoscope.panchang.tithi} &middot; {horoscope.panchang.paksha}
                    </span>
                    <span className="text-[10px] text-[#8892A3] bg-[#1E2638] px-2 py-0.5 rounded-full">
                      {horoscope.panchang.vara}
                    </span>
                  </div>
                )}

                {/* Theme title */}
                <h2
                  className="text-xl font-bold mb-2"
                  style={{
                    background: "linear-gradient(270deg, #E8C278, #D4A054, #F59E0B, #E8C278, #D4A054)",
                    backgroundSize: "300% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "gradient-text-flow 4s ease-in-out infinite",
                  }}
                >
                  {horoscope.theme?.title || t.home.todayGuidance}
                </h2>

                {/* One-line summary */}
                <p className="text-sm text-[#ACB8C4] leading-relaxed mb-4">
                  {horoscope.theme?.headline || t.common.loading}
                </p>

                {/* Action + Caution */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider mb-0.5">{t.ask.whatToDo}</p>
                      <p className="text-xs text-[#ACB8C4] leading-relaxed">{horoscope.theme?.action}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-amber-400 uppercase tracking-wider mb-0.5">{t.ask.whatToAvoid}</p>
                      <p className="text-xs text-[#ACB8C4] leading-relaxed">{horoscope.theme?.caution}</p>
                    </div>
                  </div>
                </div>

                {/* Ask Why + View Source buttons */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => onAskQuestion(`Why is "${horoscope.theme?.title}" my theme today?`)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                      bg-[#D4A054]/10 border border-[#D4A054]/20 text-xs font-medium text-[#D4A054]
                      hover:bg-[#D4A054]/15 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {t.home.askQuestion}
                  </button>
                  <button
                    onClick={() => horoscope.theme?.source && openSource(horoscope.theme.source, horoscope.theme.headline)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                      bg-[#1E2638] border border-[#1E293B] text-xs font-medium text-[#ACB8C4]
                      hover:border-[#D4A054]/20 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {t.home.sourcesTitle}
                  </button>
                </div>

                {/* Read full insight link */}
                <button
                  onClick={() => window.open("/daily", "_blank")}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-[#D4A054]/70 font-medium
                    hover:text-[#D4A054] transition-colors"
                >
                  View full daily insight <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* ═══ 2. Why This Is Active ═══ */}
              {horoscope.theme?.whyActive && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-4 mb-4"
                >
                  <p className="text-[10px] font-semibold text-[#8892A3] uppercase tracking-[0.08em] mb-2">
                    {t.ask.whyShowingUp}
                  </p>
                  <p className="text-xs text-[#ACB8C4] leading-relaxed">
                    {horoscope.theme.whyActive}
                  </p>
                </motion.div>
              )}

              {/* ═══ 3. Love / Career / Energy Cards ═══ */}
              {LIFE_AREA_CARDS.map((card, i) => (
                <motion.div
                  key={card.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + 0.05 * i }}
                  className="glass-card card-lift press-scale p-4 mb-3"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`w-8 h-8 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                      <card.Icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-[#F1F0F5]">{card.label}</span>
                      <p className="text-[10px] text-[#8892A3]">{card.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#ACB8C4] leading-relaxed mb-3">
                    {horoscope.categories[card.key]}
                  </p>
                  <button
                    onClick={() => onAskQuestion(`Tell me more about my ${card.label.toLowerCase()} today`)}
                    className="flex items-center gap-1.5 text-[11px] text-[#D4A054] font-medium
                      hover:text-[#E8C278] transition-colors"
                  >
                    {t.home.askQuestion} <ChevronRight className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}

              {/* ═══ Section Divider ═══ */}
              <div className="section-divider mb-4" />

              {/* ═══ 4. Weekly Guidance Card ═══ */}
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => window.open("/weekly", "_blank")}
                className="w-full glass-card-hero p-4 mb-4 text-left hover:border-[#D4A054]/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4A054]/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[#D4A054]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#F1F0F5] mb-0.5">Your Week Ahead</p>
                    <p className="text-[11px] text-[#8892A3] line-clamp-1">Day-by-day energy map and guidance for this week</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <ExternalLink className="w-3.5 h-3.5 text-[#D4A054]" />
                  </div>
                </div>
              </motion.button>

              {/* ═══ 5. Quick Actions Row ═══ */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="grid grid-cols-3 gap-2.5 mb-4"
              >
                <button
                  onClick={() => onAskQuestion()}
                  className="glass-card press-scale card-lift-3d p-3 flex flex-col items-center gap-2 hover:border-[#D4A054]/20 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#D4A054]/10 flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5 text-[#D4A054]" />
                  </div>
                  <span className="text-[11px] font-medium text-[#F1F0F5]">{t.nav.ask}</span>
                </button>
                <button
                  onClick={() => onViewReports()}
                  className="glass-card press-scale card-lift-3d p-3 flex flex-col items-center gap-2 hover:border-[#D4A054]/20 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#D4A054]/10 flex items-center justify-center">
                    <BookOpen className="w-4.5 h-4.5 text-[#D4A054]" />
                  </div>
                  <span className="text-[11px] font-medium text-[#F1F0F5]">{t.nav.reports}</span>
                </button>
                <button
                  onClick={() => onAskQuestion("Check my compatibility with my partner")}
                  className="glass-card press-scale card-lift-3d p-3 flex flex-col items-center gap-2 hover:border-[#D4A054]/20 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
                    <Heart className="w-4.5 h-4.5 text-rose-400" />
                  </div>
                  <span className="text-[11px] font-medium text-[#F1F0F5]">{t.nav.compatibility}</span>
                </button>
              </motion.div>

              {/* ═══ 5. Ask GrahAI Prompt ═══ */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => onAskQuestion()}
                className="w-full flex items-center gap-3 glass-card-hero gold-shimmer
                  px-4 py-4 mb-4 hover:border-[#D4A054]/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#D4A054]/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#D4A054]" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-[#F1F0F5]">{t.ask.title}</p>
                  <p className="text-[11px] text-[#8892A3]">{t.ask.placeholder}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#D4A054]" />
              </motion.button>

              {/* ═══ 6. Lucky Elements (badge layout) ═══ */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mb-4"
              >
                <p className="text-[10px] font-semibold text-[#8892A3] uppercase tracking-[0.08em] px-1 mb-2">
                  Lucky Elements
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {/* Lucky Color Badge */}
                  <div className="lucky-badge glass-card p-3 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center shadow-lg" style={{
                      backgroundColor: horoscope.lucky.colour.toLowerCase() === "white" ? "#f0f0f0" :
                        horoscope.lucky.colour.toLowerCase() === "red" ? "#ef4444" :
                        horoscope.lucky.colour.toLowerCase() === "green" ? "#22c55e" :
                        horoscope.lucky.colour.toLowerCase() === "gold" ? "#D4A054" :
                        horoscope.lucky.colour.toLowerCase() === "yellow" ? "#eab308" :
                        horoscope.lucky.colour.toLowerCase() === "blue" ? "#3b82f6" :
                        horoscope.lucky.colour.toLowerCase() === "black" ? "#1a1a1a" :
                        horoscope.lucky.colour.toLowerCase()
                    }} />
                    <p className="text-[9px] text-[#8892A3] mb-1 uppercase font-semibold tracking-wider">{t.home.luckyColors}</p>
                    <span className="text-xs font-bold text-[#F1F0F5]">{horoscope.lucky.colour}</span>
                  </div>

                  {/* Lucky Number Badge */}
                  <div className="lucky-badge glass-card p-3 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center bg-[#D4A054]/20 border border-[#D4A054]/30">
                      <span className="text-sm font-bold text-[#D4A054]">{horoscope.lucky.number}</span>
                    </div>
                    <p className="text-[9px] text-[#8892A3] mb-1 uppercase font-semibold tracking-wider">{t.home.luckyNumbers}</p>
                    <span className="text-xs font-bold text-[#F1F0F5]">#{horoscope.lucky.number}</span>
                  </div>

                  {/* Auspicious Time Badge */}
                  <div className="lucky-badge glass-card p-3 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center bg-emerald-500/20 border border-emerald-500/30">
                      <Clock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-[9px] text-[#8892A3] mb-1 uppercase font-semibold tracking-wider">Auspicious</p>
                    <span className="text-xs font-bold text-emerald-400">{horoscope.timing.auspiciousTime.start}</span>
                  </div>
                </div>
              </motion.div>

              {/* ═══ 7. Saved Library ═══ */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.47 }}
                onClick={() => window.open("/library", "_blank")}
                className="w-full glass-card p-4 mb-4 text-left hover:border-[#D4A054]/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
                    <Bookmark className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#F1F0F5]">Your Library</p>
                    <p className="text-[10px] text-[#8892A3]">Saved answers, reports, and compatibility results</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8892A3]" />
                </div>
              </motion.button>

              {/* ═══ 8. Premium Depth ═══ */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onViewReports}
                className="w-full glass-card p-4 text-left mb-4
                  hover:border-[#D4A054]/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#D4A054] mb-0.5">{t.profile.upgradePremium}</p>
                    <p className="text-xs text-[#8892A3]">{t.profile.upgradeDesc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#D4A054]" />
                </div>
              </motion.button>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-[#8892A3]">{t.home.todayGuidance}</p>
          </div>
        )}
      </div>

      {/* Source Drawer */}
      <SourceDrawer
        isOpen={sourceDrawerOpen}
        onClose={() => setSourceDrawerOpen(false)}
        source={activeSource}
        context={sourceContext}
      />
    </div>
  )
}
