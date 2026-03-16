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
  stable: "text-[#D4A054]",
  down: "text-rose-400",
}

export default function WeeklyGuidancePage({ onBack }: WeeklyGuidancePageProps) {
  const [data, setData] = useState<WeeklyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWeeklyData() {
      try {
        const bd = localStorage.getItem("grahai-onboarding-birthdata")
        if (!bd) { setLoading(false); return }
        const birthData = JSON.parse(bd)

        const today = new Date()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)

        const weekRange = `${startOfWeek.toLocaleDateString("en-IN", { month: "long", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}`

        // Calculate day offsets from today for each day of the week
        const todayDate = new Date()
        todayDate.setHours(0, 0, 0, 0)
        const startDate = new Date(startOfWeek)
        startDate.setHours(0, 0, 0, 0)

        // Fetch horoscopes for all 7 days in parallel
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const payload = {
          birthDate: birthData.dateOfBirth,
          birthTime: birthData.timeOfBirth,
          placeOfBirth: birthData.placeOfBirth,
          latitude: birthData.latitude,
          longitude: birthData.longitude,
          timezone: birthData.timezone,
          name: birthData.name,
        }

        // Fetch today (offset 0) and up to 6 future days
        const offsets = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(startOfWeek)
          d.setDate(startOfWeek.getDate() + i)
          d.setHours(0, 0, 0, 0)
          return Math.round((d.getTime() - todayDate.getTime()) / 86400000)
        })

        const fetches = offsets.map((off) =>
          off >= 0 && off <= 6
            ? fetch("/api/daily-horoscope", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...payload, offset: off }),
              }).then((r) => (r.ok ? r.json() : null)).catch(() => null)
            : Promise.resolve(null)
        )

        const results = await Promise.all(fetches)

        // Build per-day data from real API responses
        const days: WeekDay[] = results.map((apiData, i) => {
          const d = new Date(startOfWeek)
          d.setDate(startOfWeek.getDate() + i)

          // Derive energy from theme keywords
          let energy: "high" | "medium" | "low" = "medium"
          if (apiData?.theme) {
            const title = (apiData.theme.title || "").toLowerCase()
            if (title.includes("momentum") || title.includes("communication") || title.includes("clarity")) {
              energy = "high"
            } else if (title.includes("inner") || title.includes("steady") || title.includes("persistence")) {
              energy = "low"
            }
          }

          return {
            date: `${dayNames[d.getDay()]} ${d.getDate()}`,
            dayName: fullDayNames[d.getDay()],
            energy,
            bestFor: apiData?.theme?.action || (energy === "high" ? "Important decisions, networking, bold moves" : energy === "low" ? "Rest, reflection, planning ahead" : "Steady progress, routine tasks"),
            avoid: apiData?.theme?.caution || (energy === "high" ? "Overcommitting or spreading too thin" : energy === "low" ? "Forcing outcomes or confrontations" : "Impulsive decisions"),
          }
        })

        // Find the API response for today (or the first successful one)
        const todayIdx = offsets.indexOf(0)
        const todayData = results[todayIdx >= 0 ? todayIdx : 0]

        // Build life area sections from actual category data across the week
        const validResults = results.filter(Boolean)
        const loveTexts = validResults.map((r) => r?.categories?.relationship).filter(Boolean)
        const careerTexts = validResults.map((r) => r?.categories?.career).filter(Boolean)
        const wealthTexts = validResults.map((r) => r?.categories?.wealth).filter(Boolean)
        const selfTexts = validResults.map((r) => r?.categories?.self).filter(Boolean)

        // Determine trends from energy distribution
        const highCount = days.filter((d) => d.energy === "high").length
        const lowCount = days.filter((d) => d.energy === "low").length

        const bestDayForLove = days.find((d) => d.energy === "high")?.dayName || "Wednesday"
        const bestDayForCareer = days.find((d) => d.energy === "high")?.dayName || "Tuesday"
        const bestDayForMoney = days.filter((d) => d.energy !== "low")[2]?.dayName || "Thursday"
        const bestDayForHealth = days.find((d) => d.energy === "low")?.dayName || "Saturday"

        // Build sections with real data
        const sections: WeeklySection[] = [
          {
            id: "love", title: "Love & Relationships", icon: Heart,
            trend: highCount >= 3 ? "up" : highCount >= 2 ? "stable" : "down",
            summary: loveTexts[0] || "Emotional connections evolve this week. Pay attention to how you communicate with those closest to you.",
            bestDay: bestDayForLove,
            caution: loveTexts[1]?.split(". ").slice(-1)[0] || "Avoid heavy conversations on low-energy days.",
          },
          {
            id: "career", title: "Career & Ambition", icon: Briefcase,
            trend: highCount >= 3 ? "up" : "stable",
            summary: careerTexts[0] || "Professional energy is building. Focus your efforts on the high-energy days for maximum impact.",
            bestDay: bestDayForCareer,
            caution: careerTexts[1]?.split(". ").slice(-1)[0] || "Don't push through fatigue — rest days matter.",
          },
          {
            id: "money", title: "Money & Finances", icon: Coins,
            trend: lowCount >= 3 ? "down" : "stable",
            summary: wealthTexts[0] || "Financial awareness is key this week. Review before committing to anything major.",
            bestDay: bestDayForMoney,
            caution: wealthTexts[1]?.split(". ").slice(-1)[0] || "Avoid impulsive purchases or commitments.",
          },
          {
            id: "health", title: "Health & Wellbeing", icon: Activity,
            trend: lowCount <= 1 ? "up" : "stable",
            summary: selfTexts[0] || "Your energy fluctuates this week. Tune into your body and adapt your schedule accordingly.",
            bestDay: bestDayForHealth,
            caution: selfTexts[1]?.split(". ").slice(-1)[0] || "Listen to your body when it asks for rest.",
          },
        ]

        // Find notable days for key dates
        const highDays = days.filter((d) => d.energy === "high")
        const keyDates = highDays.slice(0, 3).map((d, i) => ({
          date: d.date,
          event: i === 0 ? "Peak Energy Day" : i === 1 ? "Creative Window" : "Social Opportunity",
          significance: d.bestFor,
        }))

        // Theme from today's API data
        const theme = todayData?.theme?.title
          ? `Week of ${todayData.theme.title.split(" ").slice(-2).join(" ")}`
          : "Week of Steady Progress"
        const themeDesc = todayData?.theme?.whyActive
          || "Your chart shows a mix of active and reflective energy this week. Time your actions wisely."
        const weeklyAdvice = todayData?.theme?.headline
          ? `${todayData.theme.headline} Use this energy to guide your week.`
          : "Trust the rhythms your chart reveals — act on high days, reflect on quiet ones."

        setData({ weekRange, overallTheme: theme, themeDescription: themeDesc, days, sections, keyDates, weeklyAdvice })
      } catch {
        setError(true)
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
            <p className="text-xs text-[#8892A3]">{data?.weekRange || "Loading..."}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Calendar className="w-10 h-10 text-[#D4A054] animate-pulse mb-3" />
          <p className="text-xs text-[#A0A5B2]">Preparing your weekly forecast...</p>
        </div>
      ) : error || !data ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <AlertTriangle className="w-10 h-10 text-rose-400/60 mb-3" />
          <p className="text-sm font-medium text-[#F1F0F5] mb-1">Unable to Load Weekly Guidance</p>
          <p className="text-xs text-[#8892A3] mb-4">We couldn't generate your weekly forecast. Please check your birth details and try again.</p>
          <button
            onClick={() => { setError(false); setLoading(true); window.location.reload() }}
            className="px-4 py-2 rounded-xl bg-[#D4A054]/10 text-[#D4A054] text-xs font-semibold hover:bg-[#D4A054]/20 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="max-w-lg mx-auto px-4 py-5 space-y-5 pb-12">

          {/* 1. Theme Hero */}
          <div className="rounded-2xl border border-[#D4A054]/20 bg-gradient-to-b from-[#D4A054]/[0.06] to-transparent p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#D4A054]" />
              <span className="text-[10px] text-[#D4A054] font-semibold uppercase tracking-wider">This Week</span>
            </div>
            <h2 className="text-xl font-bold text-[#F1F0F5] mb-2">{data.overallTheme}</h2>
            <p className="text-sm text-[#A0A5B2] leading-relaxed">{data.themeDescription}</p>
          </div>

          {/* 2. Day-by-Day Energy */}
          <div>
            <h3 className="text-sm font-semibold text-[#A0A5B2] uppercase tracking-wider px-1 mb-3">Day-by-Day Energy</h3>
            <div className="space-y-2">
              {data.days.map((day) => {
                const energy = ENERGY_CONFIG[day.energy]
                const isSelected = selectedDay === day.date
                return (
                  <button
                    key={day.date}
                    onClick={() => setSelectedDay(isSelected ? null : day.date)}
                    className={`w-full rounded-xl border p-3 text-left transition-all press-scale ${
                      isSelected ? "border-[#D4A054]/30 bg-[#D4A054]/[0.04]" : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {day.energy === 'high' && <span className="status-dot status-favourable" />}
                        {day.energy === 'medium' && <span className="status-dot status-neutral" />}
                        {day.energy === 'low' && <span className="status-dot status-challenging" />}
                        <span className="text-sm font-medium text-[#F1F0F5]">{day.date}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${energy.bg} ${energy.text}`}>
                          {energy.label}
                        </span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 text-[#8892A3] transition-transform ${isSelected ? "rotate-90" : ""}`} />
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 space-y-2 pl-5"
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-[#A0A5B2]"><span className="text-emerald-400 font-medium">Best for:</span> {day.bestFor}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-[#A0A5B2]"><span className="text-rose-400 font-medium">Avoid:</span> {day.avoid}</p>
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
            <h3 className="text-sm font-semibold text-[#A0A5B2] uppercase tracking-wider px-1 mb-3">Life Area Forecast</h3>
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
                    <p className="text-xs text-[#A0A5B2] leading-relaxed">{section.summary}</p>
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
            <h3 className="text-sm font-semibold text-[#A0A5B2] uppercase tracking-wider px-1 mb-3">Key Dates</h3>
            <div className="timeline-track space-y-2">
              {data.keyDates.map((kd, i) => (
                <div key={i} className={`timeline-node ${i === 0 ? 'active' : ''} flex gap-3 rounded-xl border border-[#D4A054]/10 bg-[#D4A054]/[0.03] p-3`}>
                  <div className="flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#D4A054]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#D4A054]">{kd.date}</span>
                      <span className="text-xs text-[#F1F0F5] font-medium">{kd.event}</span>
                    </div>
                    <p className="text-xs text-[#A0A5B2] leading-relaxed">{kd.significance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Weekly Advice */}
          <div className="insight-card rounded-xl border border-[#D4A054]/20 bg-[#D4A054]/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#D4A054]" />
              <span className="text-xs font-semibold text-[#D4A054]">Your Weekly Takeaway</span>
            </div>
            <p className="text-sm text-[#C5C1D6] leading-relaxed">{data.weeklyAdvice}</p>
          </div>
        </div>
      )}
    </div>
  )
}
