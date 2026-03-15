"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Heart, Briefcase, Coins, Activity,
  CheckCircle, AlertTriangle, ThumbsUp, Minus, ThumbsDown,
  Clock, Sparkles, BookOpen, Sun, Moon, Star
} from "lucide-react"
import type { BirthData } from "@/types/app"

/* ── Types ── */
interface LifeArea {
  id: string
  label: string
  icon: typeof Heart
  status: "favourable" | "neutral" | "challenging"
  insight: string
  advice: string
}

interface DailyInsightData {
  theme: { title: string; headline: string; body: string }
  lifeAreas: LifeArea[]
  doList: string[]
  avoidList: string[]
  dasha: { currentPhase: string; daysRemaining: number; howItAffectsToday: string }
  lucky: { number: number; color: string; auspiciousTime: string; rahuKaal: string }
  panchang: { tithi: string; paksha: string; vara: string; nakshatra: string }
  source: string
}

interface DailyInsightPageProps {
  onBack: () => void
}

const STATUS_CONFIG = {
  favourable: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Favourable" },
  neutral: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Neutral" },
  challenging: { bg: "bg-rose-500/10", text: "text-rose-400", label: "Challenging" },
}

export default function DailyInsightPage({ onBack }: DailyInsightPageProps) {
  const [activeArea, setActiveArea] = useState("love")
  const [feedback, setFeedback] = useState<"agree" | "maybe" | "disagree" | null>(null)
  const [data, setData] = useState<DailyInsightData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDailyInsight = useCallback(async () => {
    setLoading(true)
    try {
      const bd = localStorage.getItem("grahai-onboarding-birthdata")
      if (!bd) { setLoading(false); return }
      const birthData: BirthData = JSON.parse(bd)

      const res = await fetch("/api/daily-horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: birthData.dateOfBirth,
          placeOfBirth: birthData.placeOfBirth,
          offset: 0,
          detailed: true,
        }),
      })

      if (res.ok) {
        const apiData = await res.json()
        // Map API response to DailyInsightData format
        setData({
          theme: {
            title: apiData.theme?.title || "Today's Cosmic Guidance",
            headline: apiData.theme?.headline || "Your stars are aligning for a meaningful day.",
            body: apiData.theme?.whyActive || apiData.theme?.headline || "",
          },
          lifeAreas: [
            {
              id: "love", label: "Love", icon: Heart,
              status: getStatus(apiData.categories?.relationship),
              insight: apiData.categories?.relationship || "Relationship energy is active today.",
              advice: "Follow your heart and communicate openly.",
            },
            {
              id: "career", label: "Career", icon: Briefcase,
              status: getStatus(apiData.categories?.career),
              insight: apiData.categories?.career || "Professional matters are steady today.",
              advice: "Focus on what matters most at work.",
            },
            {
              id: "money", label: "Money", icon: Coins,
              status: getStatus(apiData.categories?.wealth),
              insight: apiData.categories?.wealth || "Financial energy is moderate today.",
              advice: "Be mindful with spending and review your plans.",
            },
            {
              id: "health", label: "Health", icon: Activity,
              status: getStatus(apiData.categories?.self),
              insight: apiData.categories?.self || "Your energy levels are balanced today.",
              advice: "Listen to your body and rest when needed.",
            },
          ],
          doList: apiData.theme?.action
            ? [apiData.theme.action, "Follow your intuition on important decisions", "Connect with someone meaningful"]
            : ["Start your day with intention", "Follow your intuition", "Connect with someone meaningful"],
          avoidList: apiData.theme?.caution
            ? [apiData.theme.caution, "Avoid impulsive decisions after sunset", "Don't overcommit your energy"]
            : ["Avoid impulsive decisions", "Don't overcommit your energy", "Skip unnecessary confrontations"],
          dasha: {
            currentPhase: "Current Planetary Period",
            daysRemaining: 0,
            howItAffectsToday: apiData.theme?.whyActive || "Your current planetary period influences today's energies.",
          },
          lucky: {
            number: apiData.lucky?.number || 7,
            color: apiData.lucky?.colour || "Gold",
            auspiciousTime: apiData.timing?.auspiciousTime ? `${apiData.timing.auspiciousTime.start} - ${apiData.timing.auspiciousTime.end}` : "10:00 AM - 12:00 PM",
            rahuKaal: apiData.timing?.rahuKaal ? `${apiData.timing.rahuKaal.start} - ${apiData.timing.rahuKaal.end}` : "1:30 PM - 3:00 PM",
          },
          panchang: {
            tithi: apiData.panchang?.tithi || "Calculating...",
            paksha: apiData.panchang?.paksha || "",
            vara: apiData.panchang?.vara || "",
            nakshatra: apiData.panchang?.nakshatra || "",
          },
          source: apiData.theme?.source?.text || `Based on your birth chart and today's planetary transits for ${birthData.placeOfBirth || "your location"}.`,
        })
      } else {
        setFallbackData()
      }
    } catch {
      setFallbackData()
    }
    setLoading(false)
  }, [])

  function getStatus(text?: string): "favourable" | "neutral" | "challenging" {
    if (!text) return "neutral"
    const lower = text.toLowerCase()
    if (lower.includes("strong") || lower.includes("good") || lower.includes("positive") || lower.includes("favor")) return "favourable"
    if (lower.includes("caution") || lower.includes("challenge") || lower.includes("difficult") || lower.includes("avoid")) return "challenging"
    return "neutral"
  }

  function setFallbackData() {
    setData({
      theme: { title: "Day of Steady Progress", headline: "Your chart shows a day for focus and patience.", body: "Trust the process and take steady steps forward." },
      lifeAreas: [
        { id: "love", label: "Love", icon: Heart, status: "neutral", insight: "Relationships are steady. Focus on understanding.", advice: "Listen more than you speak today." },
        { id: "career", label: "Career", icon: Briefcase, status: "favourable", insight: "Professional energy supports progress.", advice: "Take on challenges with confidence." },
        { id: "money", label: "Money", icon: Coins, status: "neutral", insight: "Finances are stable. Plan ahead.", advice: "Review your financial goals." },
        { id: "health", label: "Health", icon: Activity, status: "favourable", insight: "Good energy for physical activity.", advice: "Move your body and stay hydrated." },
      ],
      doList: ["Set clear priorities for the day", "Express gratitude", "Start something you've been postponing"],
      avoidList: ["Impulsive decisions", "Overcommitting", "Late nights"],
      dasha: { currentPhase: "Current Planetary Period", daysRemaining: 0, howItAffectsToday: "Your current planetary alignment supports steady growth." },
      lucky: { number: 7, color: "Gold", auspiciousTime: "10:00 AM - 12:00 PM", rahuKaal: "1:30 PM - 3:00 PM" },
      panchang: { tithi: "Calculating...", paksha: "", vara: "", nakshatra: "" },
      source: "Based on general transit patterns for today.",
    })
  }

  useEffect(() => {
    fetchDailyInsight()
  }, [fetchDailyInsight])

  const currentArea = data?.lifeAreas.find((a) => a.id === activeArea)

  return (
    <div className="min-h-dvh bg-[#0A0E1A] text-[#F1F0F5]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0A0E1A]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#D4A054]" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#F1F0F5]">Today&apos;s Insight</h1>
            <p className="text-xs text-[#5A6478]">{new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="zodiac-loader mb-4">
            <div className="loader-ring" />
            <div className="loader-ring-inner" />
            <div className="loader-center" />
          </div>
          <p className="text-xs text-[#8A8F9E]">Reading your stars...</p>
        </div>
      ) : data ? (
        <div className="max-w-lg mx-auto px-4 py-5 space-y-5 pb-12">

          {/* 1. Today's Theme */}
          <div className="rounded-2xl border border-[#D4A054]/20 bg-gradient-to-b from-[#D4A054]/[0.06] to-transparent p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#D4A054]" />
              <span className="text-[10px] text-[#D4A054] font-semibold uppercase tracking-wider">Today&apos;s Theme</span>
            </div>
            <h2 className="text-xl font-bold text-[#F1F0F5] mb-2">{data.theme.title}</h2>
            <p className="text-sm text-[#D4A054]/80 leading-relaxed mb-3">{data.theme.headline}</p>
            <p className="text-sm text-[#8A8F9E] leading-relaxed">{data.theme.body}</p>
          </div>

          {/* 2. Life Area Tabs */}
          <div>
            <h3 className="text-sm font-semibold text-[#8A8F9E] uppercase tracking-wider px-1 mb-3">Life Areas</h3>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {data.lifeAreas.map((area) => {
                const AreaIcon = area.icon
                const isActive = activeArea === area.id
                const status = STATUS_CONFIG[area.status]
                return (
                  <button
                    key={area.id}
                    onClick={() => setActiveArea(area.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium
                      whitespace-nowrap transition-all border press-scale ${
                      isActive
                        ? "border-[#D4A054]/40 bg-[#D4A054]/10 text-[#D4A054]"
                        : "border-white/5 bg-white/[0.02] text-[#8A8F9E]"
                    }`}
                  >
                    <AreaIcon className="w-3.5 h-3.5" />
                    {area.label}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Active area content */}
            <AnimatePresence mode="wait">
              {currentArea && (
                <motion.div
                  key={currentArea.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3"
                >
                  <p className="text-sm text-[#C5C1D6] leading-relaxed">{currentArea.insight}</p>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-[#D4A054]/5 border border-[#D4A054]/10">
                    <Sparkles className="w-4 h-4 text-[#D4A054] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[#D4A054]/80 leading-relaxed">{currentArea.advice}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Do / Avoid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Do Today</span>
              </div>
              <div className="space-y-2.5">
                {data.doList.map((item, i) => (
                  <p key={i} className="text-xs text-[#8A8F9E] leading-relaxed pl-4 relative flex items-start gap-2">
                    <span className="status-dot status-favourable inline-block mr-2" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-rose-500/10 bg-rose-500/[0.03] p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Avoid</span>
              </div>
              <div className="space-y-2.5">
                {data.avoidList.map((item, i) => (
                  <p key={i} className="text-xs text-[#8A8F9E] leading-relaxed pl-4 relative flex items-start gap-2">
                    <span className="status-dot status-challenging inline-block mr-2" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Feedback */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
            <p className="text-sm font-medium text-[#F1F0F5] mb-3">Does this feel like you today?</p>
            <div className="flex justify-center gap-4">
              {[
                { id: "agree" as const, icon: ThumbsUp, label: "Agree", color: "emerald" },
                { id: "maybe" as const, icon: Minus, label: "Maybe", color: "amber" },
                { id: "disagree" as const, icon: ThumbsDown, label: "Disagree", color: "rose" },
              ].map((btn) => {
                const BtnIcon = btn.icon
                const isSelected = feedback === btn.id
                return (
                  <button
                    key={btn.id}
                    onClick={() => setFeedback(btn.id)}
                    className={`flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl transition-all border ${
                      isSelected
                        ? `border-${btn.color}-500/30 bg-${btn.color}-500/10`
                        : "border-white/5 bg-white/[0.02] hover:border-white/10"
                    }`}
                  >
                    <BtnIcon className={`w-5 h-5 ${isSelected ? `text-${btn.color}-400` : "text-[#5A6478]"}`} />
                    <span className={`text-[10px] font-medium ${isSelected ? `text-${btn.color}-400` : "text-[#5A6478]"}`}>
                      {btn.label}
                    </span>
                  </button>
                )
              })}
            </div>
            {feedback && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-[#8A8F9E] mt-3"
              >
                Thanks! Your feedback helps us improve your daily guidance.
              </motion.p>
            )}
          </div>

          {/* 5. Dasha Context */}
          <div className="rounded-xl border border-[#D4A054]/10 bg-[#D4A054]/[0.03] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Moon className="w-4 h-4 text-[#D4A054]" />
              <span className="text-xs font-semibold text-[#D4A054] uppercase tracking-wider">Current Dasha Phase</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-[#F1F0F5]">{data.dasha.currentPhase}</p>
              <span className="text-xs text-[#8A8F9E] bg-white/5 px-2 py-1 rounded-full">
                {data.dasha.daysRemaining} days left
              </span>
            </div>
            <div className="dasha-progress mt-2 mb-3">
              <div className="dasha-progress-fill" style={{ width: '65%' }} />
            </div>
            <p className="text-xs text-[#8A8F9E] leading-relaxed">{data.dasha.howItAffectsToday}</p>
          </div>

          {/* 6. Lucky Elements */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <h3 className="text-xs font-semibold text-[#8A8F9E] uppercase tracking-wider mb-3">Lucky Elements</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="lucky-badge flex items-center gap-2.5">
                <Star className="w-4 h-4 text-[#D4A054]" />
                <div>
                  <p className="text-[10px] text-[#5A6478]">Lucky Number</p>
                  <p className="text-sm font-medium text-[#F1F0F5]">{data.lucky.number}</p>
                </div>
              </div>
              <div className="lucky-badge flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0 border border-white/20"
                  style={{
                    backgroundColor: data.lucky.color.toLowerCase() === 'gold'
                      ? '#FFD700'
                      : data.lucky.color.toLowerCase() === 'white'
                      ? '#FFFFFF'
                      : data.lucky.color.toLowerCase() === 'red'
                      ? '#EF4444'
                      : data.lucky.color.toLowerCase() === 'blue'
                      ? '#3B82F6'
                      : data.lucky.color.toLowerCase() === 'green'
                      ? '#10B981'
                      : data.lucky.color.toLowerCase() === 'yellow'
                      ? '#FBBF24'
                      : '#D4A054'
                  }}
                />
                <div>
                  <p className="text-[10px] text-[#5A6478]">Lucky Color</p>
                  <p className="text-sm font-medium text-[#F1F0F5]">{data.lucky.color}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-[10px] text-[#5A6478]">Auspicious Time</p>
                  <p className="text-sm font-medium text-emerald-400">{data.lucky.auspiciousTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <div>
                  <p className="text-[10px] text-[#5A6478]">Rahu Kaal</p>
                  <p className="text-sm font-medium text-rose-400">{data.lucky.rahuKaal}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Panchang */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <h3 className="text-xs font-semibold text-[#8A8F9E] uppercase tracking-wider mb-3">Panchang</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Tithi", value: data.panchang.tithi },
                { label: "Paksha", value: data.panchang.paksha },
                { label: "Vara", value: data.panchang.vara },
                { label: "Nakshatra", value: data.panchang.nakshatra },
              ].map((item) => (
                <div key={item.label} className="panchang-item bg-white/[0.02] rounded-lg px-3 py-2">
                  <p className="panchang-label text-[10px] text-[#5A6478]">{item.label}</p>
                  <p className="panchang-value text-xs font-medium text-[#F1F0F5]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Source */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <BookOpen className="w-4 h-4 text-[#5A6478] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#5A6478] italic leading-relaxed">{data.source}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
