"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import {
  Sparkles,
  Sun,
  Moon,
  Star,
  Compass,
  MessageCircle,
  ArrowLeft,
  Trophy,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Heart,
  Loader2,
  ChevronRight,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { useGamification } from "@/contexts/GamificationContext"
import { CosmicScoreWidget } from "@/components/gamification/CosmicScoreWidget"
import { DailyInsightCard } from "@/components/gamification/DailyInsightCard"
import { StreakCalendar } from "@/components/gamification/StreakCalendar"
import { AchievementShowcase } from "@/components/gamification/AchievementShowcase"
import { AchievementModal } from "@/components/gamification/AchievementModal"

interface UserProfile {
  full_name: string
  display_name: string
  interests: string[]
  subscription_tier: string
  birth_date: string | null
}

interface DailyInsightPreview {
  headline: string
  overall_trend: "positive" | "mixed" | "challenging"
  panchang: { vara: string; tithi: string; nakshatra: string; specialDay?: string }
  dasha_context: { mahadasha: string; antardasha: string }
}

const TREND_ICONS = {
  positive: TrendingUp,
  mixed: Minus,
  challenging: TrendingDown,
}

const TREND_STYLES = {
  positive: { color: "text-green", bg: "bg-green/10" },
  mixed: { color: "text-saffron", bg: "bg-saffron/10" },
  challenging: { color: "text-red", bg: "bg-red/10" },
}

const XP_MULTIPLIERS: Record<string, string> = {
  astrology: "1.25x",
  numerology: "1.1x",
  tarot: "1.0x",
  vastu: "1.15x",
}

const VERTICALS = [
  {
    id: "astrology",
    name: "Vedic Astrology",
    nameHi: "ज्योतिष",
    icon: Sun,
    color: "from-saffron/20 to-saffron/5",
    border: "border-saffron/20",
    iconColor: "text-saffron",
    desc: "Kundli, Dasha, transits",
    emoji: "♈",
  },
  {
    id: "numerology",
    name: "Numerology",
    nameHi: "अंकशास्त्र",
    icon: Star,
    color: "from-mint/20 to-mint/5",
    border: "border-mint/20",
    iconColor: "text-mint",
    desc: "Life path, destiny numbers",
    emoji: "🔢",
  },
  {
    id: "tarot",
    name: "Tarot Reading",
    nameHi: "टैरो",
    icon: Moon,
    color: "from-[#7B68EE]/20 to-[#7B68EE]/5",
    border: "border-[#7B68EE]/20",
    iconColor: "text-[#7B68EE]",
    desc: "Card spreads & guidance",
    emoji: "🃏",
  },
  {
    id: "vastu",
    name: "Vastu Shastra",
    nameHi: "वास्तु",
    icon: Compass,
    color: "from-gold-light/20 to-gold-light/5",
    border: "border-gold-light/20",
    iconColor: "text-gold-light",
    desc: "Space harmony analysis",
    emoji: "🏠",
  },
]

function getReadingCount(gamification: ReturnType<typeof useGamification>, verticalId: string): number {
  switch (verticalId) {
    case "astrology": return gamification.readingsAstrology
    case "numerology": return gamification.readingsNumerology
    case "tarot": return gamification.readingsTarot
    case "vastu": return gamification.readingsVastu
    default: return 0
  }
}

export default function DashboardView({ onBack, onAskAI, onUpgrade }: { onBack: () => void; onAskAI: () => void; onUpgrade: () => void }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loadingState, setLoadingState] = useState(true)
  const [showAchievements, setShowAchievements] = useState(false)
  const [todayInsight, setTodayInsight] = useState<DailyInsightPreview | null>(null)
  const [reportCount, setReportCount] = useState(0)
  const gamification = useGamification()

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        onBack()
        return
      }
      setUser(user)

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileData) setProfile(profileData)

      // Fetch today's insight preview (non-blocking)
      const today = new Date().toISOString().split("T")[0]
      supabase
        .from("daily_insights")
        .select("headline, overall_trend, panchang, dasha_context")
        .eq("user_id", user.id)
        .eq("date", today)
        .single()
        .then(({ data }: { data: DailyInsightPreview | null }) => {
          if (data) setTodayInsight(data)
        })

      // Fetch report count (non-blocking)
      supabase
        .from("reports")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .then(({ count }: { count: number | null }) => {
          if (count) setReportCount(count)
        })

      setLoadingState(false)
    }
    load()
  }, [onBack])

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  if (loadingState) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-deep-space">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-saffron" />
          <p className="text-sm text-cosmic-white/40">Loading your cosmos...</p>
        </div>
      </main>
    )
  }

  const displayName = profile?.display_name || profile?.full_name?.split(" ")[0] || "Explorer"

  return (
    <main className="min-h-screen bg-deep-space">
      {/* Sticky Back Header */}
      <div className="sticky top-0 z-50 glass-nav border-b border-white/[0.04]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-cosmic-white/60 transition-colors hover:text-cosmic-white"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAchievements(true)}
              className="rounded-lg p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center text-cosmic-white/40 transition-colors hover:bg-indigo/20 hover:text-saffron"
              title="Achievements"
              aria-label="View achievements"
            >
              <Trophy className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-white">
            {getGreeting()},{" "}
            <span className="gold-text">{displayName}</span>
          </h1>
          <p className="mt-1 text-white/40">
            The stars are aligned — what would you like to explore today?
          </p>
        </motion.div>

        {/* Cosmic Score Widget — XP bar, level, streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <CosmicScoreWidget />
        </motion.div>

        {/* Your Plan Section */}
        {profile?.subscription_tier === "free" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mb-8"
          >
            <div className="rounded-2xl border border-saffron/20 bg-gradient-to-r from-saffron/10 to-saffron/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">
                    You're on the <span className="text-saffron">Free Plan</span>
                  </h2>
                  <p className="text-sm text-white/60">
                    Unlock unlimited readings and premium features
                  </p>
                </div>
                <button
                  onClick={onUpgrade}
                  className="px-6 py-2.5 rounded-lg bg-saffron text-bg font-semibold hover:bg-saffron-light transition-colors whitespace-nowrap"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Daily Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <DailyInsightCard />
        </motion.div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-cosmic-white">
            Quick Actions
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Chat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.13 }}
            >
              <button onClick={onAskAI} className="group w-full block cursor-pointer rounded-xl border border-indigo/30 bg-navy-light/30 p-4 transition-all hover:border-saffron/30 hover:bg-navy-light/50 text-left">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-saffron/10 p-2">
                    <MessageCircle className="h-5 w-5 text-saffron" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-cosmic-white text-sm">
                      Chat
                    </h3>
                    <p className="text-xs text-cosmic-white/40">
                      Ask AI anything
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-cosmic-white/20 transition-colors group-hover:text-saffron" />
                </div>
              </button>
            </motion.div>

            {/* Kundli */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
            >
              <button onClick={onBack} className="group w-full block cursor-pointer rounded-xl border border-indigo/30 bg-navy-light/30 p-4 transition-all hover:border-saffron/30 hover:bg-navy-light/50 text-left">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-mint/10 p-2">
                    <Sun className="h-5 w-5 text-mint" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-cosmic-white text-sm">
                      Kundli
                    </h3>
                    <p className="text-xs text-cosmic-white/40">
                      Your birth chart
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-cosmic-white/20 transition-colors group-hover:text-saffron" />
                </div>
              </button>
            </motion.div>

            {/* Horoscope */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <button onClick={onBack} className="group w-full block cursor-pointer rounded-xl border border-indigo/30 bg-navy-light/30 p-4 transition-all hover:border-saffron/30 hover:bg-navy-light/50 text-left">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gold/10 p-2">
                    <Moon className="h-5 w-5 text-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-cosmic-white text-sm">
                      Horoscope
                    </h3>
                    <p className="text-xs text-cosmic-white/40">
                      Daily forecast
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-cosmic-white/20 transition-colors group-hover:text-saffron" />
                </div>
              </button>
            </motion.div>

            {/* Compatibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
            >
              <button onClick={onBack} className="group w-full block cursor-pointer rounded-xl border border-indigo/30 bg-navy-light/30 p-4 transition-all hover:border-saffron/30 hover:bg-navy-light/50 text-left">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-rose/10 p-2">
                    <Heart className="h-5 w-5 text-rose" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-cosmic-white text-sm">
                      Compatibility
                    </h3>
                    <p className="text-xs text-cosmic-white/40">
                      Relationship match
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-cosmic-white/20 transition-colors group-hover:text-saffron" />
                </div>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Daily Insight Preview + Reports CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17 }}
          className="mb-8 grid gap-4 sm:grid-cols-2"
        >
          {/* Today's Insight Preview */}
          <button onClick={onBack} className="group block w-full text-left">
            <div className="h-full rounded-2xl border border-indigo/20 bg-gradient-to-br from-gold/5 to-transparent p-5 transition-all hover:border-gold/30 hover:bg-gold/5">
              {todayInsight ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gold" />
                      <span className="text-xs font-semibold text-cosmic-white/60 uppercase tracking-wider">
                        Today&apos;s Insight
                      </span>
                    </div>
                    {(() => {
                      const TIcon = TREND_ICONS[todayInsight.overall_trend] || Minus
                      const style = TREND_STYLES[todayInsight.overall_trend] || TREND_STYLES.mixed
                      return (
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${style.bg}`}>
                          <TIcon className={`h-3 w-3 ${style.color}`} />
                          <span className={`text-[10px] font-medium ${style.color} capitalize`}>
                            {todayInsight.overall_trend}
                          </span>
                        </div>
                      )
                    })()}
                  </div>
                  <p className="text-sm font-medium text-cosmic-white mb-2 line-clamp-2">
                    {todayInsight.headline}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-cosmic-white/40">
                    <span>{todayInsight.panchang?.vara}</span>
                    <span>·</span>
                    <span>{todayInsight.panchang?.tithi}</span>
                    <span>·</span>
                    <span>{todayInsight.dasha_context?.mahadasha} Dasha</span>
                  </div>
                  {todayInsight.panchang?.specialDay && (
                    <div className="mt-2 flex items-center gap-1">
                      <Star className="h-3 w-3 text-saffron" />
                      <span className="text-[10px] text-saffron font-medium">
                        {todayInsight.panchang.specialDay}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-gold/40" />
                    <span className="text-xs font-semibold text-cosmic-white/40 uppercase tracking-wider">
                      Daily Insight
                    </span>
                  </div>
                  <p className="text-sm text-cosmic-white/40 mb-1">
                    Your personalized horoscope
                  </p>
                  <p className="text-xs text-cosmic-white/25">
                    Generated daily at 6:00 AM IST
                  </p>
                </>
              )}
              <div className="mt-3 flex items-center gap-1 text-xs text-gold/60 group-hover:text-gold transition-colors">
                View Full Insight <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </button>

          {/* Reports CTA */}
          <button onClick={onBack} className="group block w-full text-left">
            <div className="h-full rounded-2xl border border-indigo/20 bg-gradient-to-br from-saffron/5 to-transparent p-5 transition-all hover:border-saffron/30 hover:bg-saffron/5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-saffron" />
                <span className="text-xs font-semibold text-cosmic-white/60 uppercase tracking-wider">
                  Kundli Reports
                </span>
              </div>
              <p className="text-sm font-medium text-cosmic-white mb-1">
                Professional PDF Analysis
              </p>
              <p className="text-xs text-cosmic-white/40 mb-2">
                12+ page report with charts, Dasha timeline, yogas, doshas, and BPHS references
              </p>
              <div className="flex items-center gap-3">
                {reportCount > 0 && (
                  <span className="text-[10px] text-cosmic-white/25">
                    {reportCount} report{reportCount !== 1 ? "s" : ""} generated
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-saffron/60 group-hover:text-saffron transition-colors">
                {reportCount > 0 ? "View Reports" : "Generate Report"} <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </button>
        </motion.div>

        {/* Verticals Grid — with XP multiplier + reading count */}
        <div className="mb-8">
          <h2 className="mb-5 text-lg font-semibold text-cosmic-white">
            Explore Readings
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VERTICALS.map((v, i) => {
              const Icon = v.icon
              const isInterested = profile?.interests?.includes(v.id)
              const readingCount = getReadingCount(gamification, v.id)
              const multiplier = XP_MULTIPLIERS[v.id]
              return (
                <button key={v.id} onClick={onAskAI} className="w-full text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className={`group cursor-pointer rounded-2xl border ${v.border} bg-gradient-to-br ${v.color} p-6 transition-all hover:scale-[1.03]`}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <span className="text-3xl">{v.emoji}</span>
                      <div className="flex flex-col items-end gap-1">
                        {isInterested && (
                          <span className="rounded-full bg-saffron/20 px-2 py-0.5 text-[10px] font-medium text-saffron">
                            Your pick
                          </span>
                        )}
                        {multiplier && (
                          <span className="rounded-full bg-mint/10 px-2 py-0.5 text-[10px] font-medium text-mint/80">
                            {multiplier} XP
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold text-cosmic-white">{v.name}</h3>
                    <p className="font-hindi text-xs text-saffron/50">
                      {v.nameHi}
                    </p>
                    <p className="mt-2 text-sm text-cosmic-white/40">{v.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs font-medium text-saffron/60 transition-colors group-hover:text-saffron">
                        Start Reading
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                      {readingCount > 0 && (
                        <span className="text-[10px] text-cosmic-white/25">
                          {readingCount} reading{readingCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Streak Calendar — activity heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <h2 className="mb-5 text-lg font-semibold text-cosmic-white">
            Activity
          </h2>
          <StreakCalendar />
        </motion.div>

        {/* Achievement Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-cosmic-white">
              Achievements
            </h2>
            <button
              onClick={() => setShowAchievements(true)}
              className="text-xs text-saffron/60 hover:text-saffron transition-colors"
            >
              View All
            </button>
          </div>
          <AchievementShowcase />
        </motion.div>
      </div>

      {/* Achievement Modal */}
      <AchievementModal show={showAchievements} onClose={() => setShowAchievements(false)} />
    </main>
  )
}
