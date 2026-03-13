"use client"

/* ════════════════════════════════════════════════════════
   Daily Insights Page — /daily

   Personalized daily horoscope with Panchang, transits,
   Dasha context, activities, and daily remedy.
   ════════════════════════════════════════════════════════ */

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Sun, Moon, Star, ArrowLeft, RefreshCw, TrendingUp,
  TrendingDown, Minus, BookOpen, Sparkles, Shield,
  CheckCircle, XCircle, Clock, Lock, MessageSquare,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import PanchangWidget from "@/components/astrology/PanchangWidget"

// ─── Types ──────────────────────────────────────────────

interface DailyInsight {
  id: string
  date: string
  headline: string
  overall_trend: "positive" | "mixed" | "challenging"
  panchang: {
    vara: string
    tithi: string
    tithiLord: string
    nakshatra: string
    nakshatraLord: string
    yoga: string
    yogaType: string
    karana: string
    karanaType: string
    sunriseTime: string
    sunsetTime: string
    rahuKaal: string
    gulikaKaal: string
    abhijitMuhurta: string
    specialDay?: string
  }
  moon_transit: {
    sign: string
    house: number
    effect: string
    mood: string
  }
  key_transits: {
    planet: string
    sign: string
    house: number
    effect: string
    trend: "beneficial" | "challenging" | "neutral"
  }[]
  dasha_context: {
    mahadasha: string
    antardasha: string
    interpretation: string
  }
  daily_remedy: {
    type: string
    planet: string
    name: string
    details: string
    classicalRef: string
  }
  bphs_verse: {
    source: string
    chapter: number
    verse: number
    sanskrit: string
    translation: string
    insight: string
  }
  activities: {
    favorable: string[]
    unfavorable: string[]
  }
  sade_sati_active: boolean
  sade_sati_phase?: string
}

// ─── Supabase Client ────────────────────────────────────

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ─── Trend Config ───────────────────────────────────────

const TREND_CONFIG = {
  positive: {
    icon: TrendingUp,
    label: "Favorable Day",
    color: "#4ADE80",
    bg: "bg-green/10",
    border: "border-green/20",
  },
  mixed: {
    icon: Minus,
    label: "Mixed Energies",
    color: "#E2994A",
    bg: "bg-saffron/10",
    border: "border-saffron/20",
  },
  challenging: {
    icon: TrendingDown,
    label: "Challenging Day",
    color: "#E85454",
    bg: "bg-red/10",
    border: "border-red/20",
  },
}

// ─── Component Props ────────────────────────────────

interface DailyViewProps {
  onBack: () => void
  onUpgrade: () => void
  onAskAI: () => void
}

// ─── Component ──────────────────────────────────

export default function DailyView({ onBack, onUpgrade, onAskAI }: DailyViewProps) {
  const [insight, setInsight] = useState<DailyInsight | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [userTier, setUserTier] = useState<string>("free")

  const fetchInsight = useCallback(async () => {
    try {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return
      }

      // Check subscription tier
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single()
      if (profile?.subscription_tier) {
        setUserTier(profile.subscription_tier)
      }

      const today = new Date().toISOString().split("T")[0]

      const { data, error: fetchError } = await supabase
        .from("daily_insights")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError
      }

      if (data) {
        setInsight(data as DailyInsight)
      } else {
        setError("no_insight")
      }
    } catch (err) {
      console.error("Failed to fetch daily insight:", err)
      setError("fetch_failed")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInsight()
  }, [fetchInsight])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Get user's primary kundli
      const { data: kundli } = await supabase
        .from("kundlis")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("is_primary", true)
        .single()

      if (!kundli) {
        setError("no_kundli")
        return
      }

      // Trigger manual generation
      const res = await fetch("/api/cron/daily-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: session.user.id,
          kundliId: kundli.id,
        }),
      })

      if (res.ok) {
        await fetchInsight()
      }
    } catch (err) {
      console.error("Refresh failed:", err)
    } finally {
      setRefreshing(false)
    }
  }

  // ─── Loading State ──────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sun className="w-8 h-8 text-gold" />
        </motion.div>
      </div>
    )
  }

  // ─── Error / No Insight State ──────────────────────

  if (error || !insight) {
    return (
      <div className="min-h-screen bg-bg">
        <nav className="sticky top-0 z-50 glass-nav h-16 flex items-center px-6">
          <button onClick={onBack} className="flex items-center gap-2 text-text-dim hover:text-text transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
        </nav>
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <Moon className="w-12 h-12 text-gold/30 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-text mb-2">
            {error === "no_kundli"
              ? "No Birth Chart Found"
              : "Today's Insight Not Ready Yet"
            }
          </h2>
          <p className="text-sm text-text-dim mb-6">
            {error === "no_kundli"
              ? "Save your birth details in the chat to receive personalized daily insights."
              : "Your daily horoscope will be generated at 6:00 AM IST. You can also generate it now."
            }
          </p>
          <div className="flex gap-3 justify-center">
            {error !== "no_kundli" && (
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 rounded-xl bg-saffron/15 text-saffron text-sm font-medium hover:bg-saffron/25 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Generate Now
              </button>
            )}
            <button
              onClick={onAskAI}
              className="px-4 py-2 rounded-xl bg-gold/15 text-gold text-sm font-medium hover:bg-gold/25 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Ask Jyotish Guru
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Main Insight View ─────────────────────────────

  const trend = TREND_CONFIG[insight.overall_trend] || TREND_CONFIG.mixed
  const TrendIcon = trend.icon
  const isFreeUser = !userTier || userTier === "free" || userTier === "nakshatra"

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Custom back header */}
      <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-white/[0.06] transition-colors">
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </button>
        <h1 className="text-lg font-bold text-white">Daily Insights</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="ml-auto text-text-dim hover:text-text transition-colors disabled:opacity-50"
          title="Refresh insights"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-text-dim uppercase tracking-wider mb-1">
            {new Date(insight.date).toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-xl font-bold text-text mb-3">
            {insight.headline}
          </h1>

          {/* Trend Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${trend.bg} border ${trend.border}`}>
            <TrendIcon className="w-4 h-4" style={{ color: trend.color }} />
            <span className="text-xs font-medium" style={{ color: trend.color }}>
              {trend.label}
            </span>
          </div>
        </motion.div>

        {/* Sade Sati Alert */}
        {insight.sade_sati_active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-indigo/20 bg-indigo/5 p-4 flex items-start gap-3"
          >
            <Shield className="w-5 h-5 text-indigo flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-text">
                Sade Sati Active — {insight.sade_sati_phase} Phase
              </p>
              <p className="text-xs text-text-dim mt-1">
                Saturn is transiting near your natal Moon. Extra patience and discipline recommended.
              </p>
            </div>
          </motion.div>
        )}

        {/* Panchang */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PanchangWidget
            panchang={insight.panchang}
            date={insight.date}
          />
        </motion.div>

        {/* Moon Transit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-indigo/15 bg-bg-card/60 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Moon className="w-4 h-4 text-[#C8D8E4]" />
            <h3 className="text-sm font-semibold text-text">
              Moon Transit{" "}
              <span className="font-normal opacity-50" style={{ fontFamily: "var(--font-devanagari)" }}>
                चन्द्र गोचर
              </span>
            </h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-text">
              Moon in <span className="text-gold-light font-medium">{insight.moon_transit.sign}</span>
              {" "}— House {insight.moon_transit.house}
            </p>
            <p className="text-xs text-text-dim">{insight.moon_transit.effect}</p>
            <p className="text-xs text-text-dim/70">
              Emotional Tone: <span className="text-text/80">{insight.moon_transit.mood}</span>
            </p>
          </div>
        </motion.div>

        {/* Key Transits */}
        {insight.key_transits && insight.key_transits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-gold" />
              Key Planetary Transits
            </h3>
            <div className="space-y-2">
              {insight.key_transits.map((transit, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-3 ${
                    transit.trend === "beneficial"
                      ? "border-green/15 bg-green/5"
                      : transit.trend === "challenging"
                      ? "border-red/15 bg-red/5"
                      : "border-indigo/15 bg-bg-card/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-text">
                      {transit.planet} in {transit.sign}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      transit.trend === "beneficial"
                        ? "bg-green/15 text-green"
                        : transit.trend === "challenging"
                        ? "bg-red/15 text-red"
                        : "bg-indigo/15 text-text-dim"
                    }`}>
                      House {transit.house}
                    </span>
                  </div>
                  <p className="text-xs text-text-dim">{transit.effect}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Dasha Context — premium gated */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="relative rounded-xl border border-saffron/15 bg-saffron/5 p-4"
        >
          {isFreeUser && (
            <div className="absolute inset-0 z-10 rounded-xl backdrop-blur-sm bg-bg/60 flex flex-col items-center justify-center text-center p-4">
              <Lock className="w-5 h-5 text-gold/60 mb-2" />
              <p className="text-xs text-text-dim mb-2">Dasha analysis is a premium feature</p>
              <button onClick={onUpgrade} className="text-xs font-semibold text-gold hover:text-gold-light transition-colors">
                Upgrade to unlock
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-saffron" />
            <h3 className="text-sm font-semibold text-text">
              Current Dasha Period
            </h3>
          </div>
          <p className="text-sm text-text mb-1">
            <span className="text-gold-light font-medium">{insight.dasha_context.mahadasha}</span>
            {" "}Mahadasha / {" "}
            <span className="text-saffron font-medium">{insight.dasha_context.antardasha}</span>
            {" "}Antardasha
          </p>
          <p className="text-xs text-text-dim">{insight.dasha_context.interpretation}</p>
        </motion.div>

        {/* Activities */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          {/* Favorable */}
          <div className="rounded-xl border border-green/15 bg-green/5 p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <CheckCircle className="w-4 h-4 text-green" />
              <h4 className="text-xs font-semibold text-green uppercase tracking-wider">
                Favorable
              </h4>
            </div>
            <ul className="space-y-1.5">
              {(insight.activities.favorable || []).map((item, i) => (
                <li key={i} className="text-xs text-text/80 flex items-start gap-1.5">
                  <span className="text-green mt-0.5">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Unfavorable */}
          <div className="rounded-xl border border-red/15 bg-red/5 p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <XCircle className="w-4 h-4 text-red" />
              <h4 className="text-xs font-semibold text-red uppercase tracking-wider">
                Avoid
              </h4>
            </div>
            <ul className="space-y-1.5">
              {(insight.activities.unfavorable || []).map((item, i) => (
                <li key={i} className="text-xs text-text/80 flex items-start gap-1.5">
                  <span className="text-red mt-0.5">-</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Daily Remedy — premium gated */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="relative rounded-xl border border-gold/20 bg-gold/5 p-4"
        >
          {isFreeUser && (
            <div className="absolute inset-0 z-10 rounded-xl backdrop-blur-sm bg-bg/60 flex flex-col items-center justify-center text-center p-4">
              <Lock className="w-5 h-5 text-gold/60 mb-2" />
              <p className="text-xs text-text-dim mb-2">Personalized remedies require premium</p>
              <button onClick={onUpgrade} className="text-xs font-semibold text-gold hover:text-gold-light transition-colors">
                Upgrade to unlock
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold" />
            <h3 className="text-sm font-semibold text-text">
              Today&apos;s Remedy
            </h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/15 text-gold font-medium">
              {insight.daily_remedy.type}
            </span>
          </div>
          <p className="text-sm font-medium text-gold-light mb-1">
            {insight.daily_remedy.name}
          </p>
          <p className="text-xs text-text-dim mb-2">{insight.daily_remedy.details}</p>
          {insight.daily_remedy.classicalRef && (
            <p className="text-[10px] text-gold/50 italic flex items-start gap-1">
              <BookOpen className="w-3 h-3 mt-0.5 flex-shrink-0" />
              {insight.daily_remedy.classicalRef}
            </p>
          )}
        </motion.div>

        {/* BPHS Verse of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-indigo/15 bg-bg-card/60 p-5 text-center"
        >
          <BookOpen className="w-5 h-5 text-gold/40 mx-auto mb-3" />
          <p
            className="text-sm text-gold-light/80 mb-2 leading-relaxed"
            style={{ fontFamily: "var(--font-devanagari)" }}
          >
            {insight.bphs_verse.sanskrit}
          </p>
          <p className="text-xs text-text/70 italic mb-3">
            &ldquo;{insight.bphs_verse.translation}&rdquo;
          </p>
          <p className="text-xs text-text-dim mb-1">{insight.bphs_verse.insight}</p>
          <p className="text-[10px] text-text-dim/50">
            — {insight.bphs_verse.source}, Ch. {insight.bphs_verse.chapter}, v. {insight.bphs_verse.verse}
          </p>
        </motion.div>

        {/* CTA — Upgrade for free users, chat for premium */}
        {isFreeUser ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-gold/20 bg-gold/5 p-6 text-center"
          >
            <h3 className="text-sm font-semibold text-text mb-2">Unlock Full Daily Insights</h3>
            <p className="text-xs text-text-dim mb-4">
              Unlock Dasha analysis, personalized remedies, BPHS wisdom verses, and unlimited daily AI consultations.
            </p>
            <button
              onClick={onUpgrade}
              className="px-6 py-2.5 rounded-xl bg-gold/15 text-gold text-sm font-medium hover:bg-gold/25 transition-colors"
            >
              Upgrade Now
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-4"
          >
            <button
              onClick={onAskAI}
              className="px-6 py-2.5 rounded-xl bg-saffron/15 text-saffron text-sm font-medium hover:bg-saffron/25 transition-colors"
            >
              Ask Jyotish Guru for Detailed Analysis
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
