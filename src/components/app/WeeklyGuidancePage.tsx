"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft, Calendar, ChevronRight, Heart, Briefcase,
  Coins, Activity, Star, Clock, Sparkles, CheckCircle,
  AlertTriangle, TrendingUp, TrendingDown, Minus
} from "lucide-react"

/* ── Types ── */
interface WeekDay {
  date: string
  dayName: string
  energy: "high" | "medium" | "low"
  bestFor: string
  avoid: string
}

interface WeeklySection {
  id: string
  title: string
  icon: typeof Heart
  trend: "up" | "stable" | "down"
  summary: string
  bestDay: string
  caution: string
}

interface WeeklyData {
  weekRange: string
  overallTheme: string
  themeDescription: string
  days: WeekDay[]
  sections: WeeklySection[]
  keyDates: { date: string; event: string; significance: string }[]
  weeklyAdvice: string
}

interface WeeklyGuidancePageProps {
  onBack: () => void
}

const ENERGY_CONFIG = {
  high: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "High Energy" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Moderate" },
  low: { bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-400", label: "Low Energy" },
}

const TREND_ICON = {
  up: TrendingUp,
  stable: Minus,
  down: TrendingDown,
}

const TREND_COLOR = {
  up: "text-emerald-400",
  stable: "text-amber-400",
  down: "text-rose-400",
}

export default function WeeklyGuidancePage({ onBack }: WeeklyGuidancePageProps) {
  const [data, setData] = useState<WeeklyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWeeklyData() {
      try {
        const bd = localStorage.getItem("grahai-onboarding-birthdata")
        if (!bd) { setLoading(false); return }
        const birthData = JSON.parse(bd)

        // Fetch daily horoscopes for each day of the week
        const today = new Date()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)

        const weekRange = `${startOfWeek.toLocaleDateString("en-IN", { month: "long", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}`

        // Fetch today's horoscope for the theme, then build week structure
        const res = await fetch("/api/daily-horoscope", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ birthDate: birthData.dateOfBirth, placeOfBirth: birthData.placeOfBirth, offset: 0 }),
        })

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const energyLevels: ("high" | "medium" | "low")[] = ["medium", "high", "high", "medium", "high", "low", "medium"]

        const days: WeekDay[] = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(startOfWeek)
          d.setDate(startOfWeek.getDate() + i)
          return {
            date: `${dayNames[d.getDay()]} ${d.getDate()}`,
            dayName: fullDayNames[d.getDay()],
            energy: energyLevels[i],
            bestFor: i < 3 ? "Planning, goal-setting, creative work" : i < 5 ? "Execution, social events, networking" : "Rest, reflection, family time",
            avoid: i < 3 ? "Impulsive decisions" : i < 5 ? "Overcommitting" : "Work stress",
          }
        })

        let theme = "Week of Steady Progress"
        let themeDesc = "This week brings a balanced mix of energy for work and rest. Plan wisely and act with intention."
        let weeklyAdvice = "Balance action with rest this week. The mid-week days are your power days — use them wisely."

        if (res.ok) {
          const apiData = await res.json()
          theme = `Week of ${apiData.theme?.title?.split(" ").slice(-2).join(" ") || "Steady Progress"}`
          themeDesc = apiData.theme?.whyActive || themeDesc
          weeklyAdvice = apiData.theme?.headline ? `${apiData.theme.headline} Use this energy to guide your week.` : weeklyAdvice
        }

        setData({
          weekRange,
          overallTheme: theme,
          themeDescription: themeDesc,
          days,
          sections: [
            { id: "love", title: "Love & Relationships", icon: Heart, trend: "up", summary: "Relationship energy builds through the week. Mid-week is best for meaningful conversations.", bestDay: "Wednesday", caution: "Avoid difficult conversations on low-energy days." },
            { id: "career", title: "Career & Ambition", icon: Briefcase, trend: "up", summary: "Professional momentum is strong this week. Take initiative early in the week.", bestDay: "Tuesday", caution: "Don't push through fatigue on the weekend." },
            { id: "money", title: "Money & Finances", icon: Coins, trend: "stable", summary: "Financial stability this week — a good time to review plans and budgets.", bestDay: "Thursday", caution: "Avoid impulse purchases mid-week." },
            { id: "health", title: "Health & Wellbeing", icon: Activity, trend: "stable", summary: "Energy fluctuates — channel high-energy days into exercise, rest on low days.", bestDay: "Friday", caution: "Listen to your body on the weekend." },
          ],
          keyDates: [
            { date: days[1]?.date || "Tue", event: "High Energy Day", significance: "Best day for career moves and bold decisions" },
            { date: days[2]?.date || "Wed", event: "Creative Peak", significance: "Express yourself — creativity and romance flourish" },
            { date: days[4]?.date || "Fri", event: "Social Window", significance: "Social connections bring unexpected opportunities" },
          ],
          weeklyAdvice,
        })
      } catch {
        // Fallback
        setData({
          weekRange: "This Week",
          overallTheme: "Week of Steady Growth",
          themeDescription: "A balanced week ahead with good energy for both work and relationships.",
          days: [],
          sections: [
            { id: "love", title: "Love & Relationships", icon: Heart, trend: "stable", summary: "Steady energy for connections.", bestDay: "Wednesday", caution: "Be patient." },
            { id: "career", title: "Career & Ambition", icon: Briefcase, trend: "up", summary: "Good momentum for progress.", bestDay: "Tuesday", caution: "Don't overextend." },
            { id: "money", title: "Money & Finances", icon: Coins, trend: "stable", summary: "Stable outlook.", bestDay: "Thursday", caution: "Stick to your plan." },
            { id: "health", title: "Health & Wellbeing", icon: Activity, trend: "stable", summary: "Balanced energy.", bestDay: "Friday", caution: "Rest when needed." },
          ],
          keyDates: [],
          weeklyAdvice: "Trust the process and take steady steps forward this week.",
        })
      }
      setLoading(false)
    }
    fetchWeeklyData()
  }, [])

  return (
    <div className="min-h-dvh bg-[#0A0E1A] text-[#F1F0F5]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0A0E1A]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#D4A054]" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#F1F0F5]">Weekly Guidance</h1>
            <p className="text-xs text-[#5A6478]">{data?.weekRange || "Loading..."}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Calendar className="w-10 h-10 text-[#D4A054] animate-pulse mb-3" />
          <p className="text-xs text-[#8A8F9E]">Preparing your weekly forecast...</p>
        </div>
      ) : data ? (
        <div className="max-w-lg mx-auto px-4 py-5 space-y-5 pb-12">

          {/* 1. Theme Hero */}
          <div className="rounded-2xl border border-[#D4A054]/20 bg-gradient-to-b from-[#D4A054]/[0.06] to-transparent p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#D4A054]" />
              <span className="text-[10px] text-[#D4A054] font-semibold uppercase tracking-wider">This Week</span>
            </div>
            <h2 className="text-xl font-bold text-[#F1F0F5] mb-2">{data.overallTheme}</h2>
            <p className="text-sm text-[#8A8F9E] leading-relaxed">{data.themeDescription}</p>
          </div>

          {/* 2. Day-by-Day Energy */}
          <div>
            <h3 className="text-sm font-semibold text-[#8A8F9E] uppercase tracking-wider px-1 mb-3">Day-by-Day Energy</h3>
            <div className="space-y-2">
              {data.days.map((day) => {
                const energy = ENERGY_CONFIG[day.energy]
                const isSelected = selectedDay === day.date
                return (
                  <button
                    key={day.date}
                    onClick={() => setSelectedDay(isSelected ? null : day.date)}
                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                      isSelected ? "border-[#D4A054]/30 bg-[#D4A054]/[0.04]" : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${energy.dot}`} />
                        <span className="text-sm font-medium text-[#F1F0F5]">{day.date}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${energy.bg} ${energy.text}`}>
                          {energy.label}
                        </span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 text-[#5A6478] transition-transform ${isSelected ? "rotate-90" : ""}`} />
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 space-y-2 pl-5"
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-[#8A8F9E]"><span className="text-emerald-400 font-medium">Best for:</span> {day.bestFor}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-[#8A8F9E]"><span className="text-rose-400 font-medium">Avoid:</span> {day.avoid}</p>
                        </div>
                      </motion.div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. Life Area Sections */}
          <div>
            <h3 className="text-sm font-semibold text-[#8A8F9E] uppercase tracking-wider px-1 mb-3">Life Area Forecast</h3>
            <div className="space-y-3">
              {data.sections.map((section) => {
                const SectionIcon = section.icon
                const TrendIcon = TREND_ICON[section.trend]
                const trendColor = TREND_COLOR[section.trend]
                return (
                  <div key={section.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#D4A054]/10 flex items-center justify-center">
                          <SectionIcon className="w-4 h-4 text-[#D4A054]" />
                        </div>
                        <span className="text-sm font-semibold text-[#F1F0F5]">{section.title}</span>
                      </div>
                      <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                    </div>
                    <p className="text-xs text-[#8A8F9E] leading-relaxed">{section.summary}</p>
                    <div className="flex items-center gap-4 text-[10px]">
                      <span className="text-emerald-400">
                        <Star className="w-3 h-3 inline mr-0.5" />Best: {section.bestDay}
                      </span>
                      <span className="text-rose-400/70">
                        <AlertTriangle className="w-3 h-3 inline mr-0.5" />{section.caution.slice(0, 50)}...
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 4. Key Dates */}
          <div>
            <h3 className="text-sm font-semibold text-[#8A8F9E] uppercase tracking-wider px-1 mb-3">Key Dates</h3>
            <div className="space-y-2">
              {data.keyDates.map((kd, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-[#D4A054]/10 bg-[#D4A054]/[0.03] p-3">
                  <div className="flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#D4A054]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#D4A054]">{kd.date}</span>
                      <span className="text-xs text-[#F1F0F5] font-medium">{kd.event}</span>
                    </div>
                    <p className="text-xs text-[#8A8F9E] leading-relaxed">{kd.significance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Weekly Advice */}
          <div className="rounded-xl border border-[#D4A054]/20 bg-[#D4A054]/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#D4A054]" />
              <span className="text-xs font-semibold text-[#D4A054]">Your Weekly Takeaway</span>
            </div>
            <p className="text-sm text-[#C5C1D6] leading-relaxed">{data.weeklyAdvice}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
