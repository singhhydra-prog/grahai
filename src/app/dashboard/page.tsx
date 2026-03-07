"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Sparkles,
  Sun,
  Moon,
  Star,
  Compass,
  MessageCircle,
  History,
  Settings,
  LogOut,
  ChevronRight,
  Trophy,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  BookOpen,
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

export default function DashboardPage() {
  const router = useRouter()
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
        router.push("/auth/login")
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
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .then(({ count }: { count: number | null }) => {
          if (count) setReportCount(count)
        })

      setLoadingState(false)
    }
    load()
  }, [router])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/")
  }

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
          <Sparkles className="h-8 w-8 animate-pulse text-saffron" />
          <p className="text-sm text-cosmic-white/40">Loading your cosmos...</p>
        </div>
      </main>
    )
  }

  const displayName = profile?.display_name || profile?.full_name?.split(" ")[0] || "Explorer"

  return (
    <main className="min-h-screen bg-deep-space">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass-nav">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-saffron" />
            <span className="font-bold text-cosmic-white">
              Grah<span className="text-saffron">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAchievements(true)}
              className="rounded-lg p-2 text-cosmic-white/40 transition-colors hover:bg-indigo/20 hover:text-saffron"
              title="Achievements"
            >
              <Trophy className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 text-cosmic-white/40 transition-colors hover:bg-indigo/20 hover:text-cosmic-white">
              <History className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 text-cosmic-white/40 transition-colors hover:bg-indigo/20 hover:text-cosmic-white">
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-lg p-2 text-cosmic-white/40 transition-colors hover:bg-error/10 hover:text-error"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

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

        {/* Daily Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <DailyInsightCard />
        </motion.div>

        {/* Quick Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Link href="/chat" className="group block cursor-pointer rounded-2xl border border-indigo/30 bg-navy-light/30 p-6 transition-all hover:border-saffron/30 hover:bg-navy-light/50">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-saffron/10 p-3">
                <MessageCircle className="h-6 w-6 text-saffron" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-cosmic-white">
                  Ask anything about your stars
                </h2>
                <p className="mt-0.5 text-sm text-cosmic-white/40">
                  Chat with our AI for personalized insights across all verticals
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-cosmic-white/20 transition-colors group-hover:text-saffron" />
            </div>
          </Link>
        </motion.div>

        {/* Daily Insight Preview + Reports CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17 }}
          className="mb-8 grid gap-4 sm:grid-cols-2"
        >
          {/* Today's Insight Preview */}
          <Link href="/daily" className="group block">
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
          </Link>

          {/* Reports CTA */}
          <Link href="/reports" className="group block">
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
          </Link>
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
                <Link key={v.id} href={`/chat?v=${v.id}`}>
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
                </Link>
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
