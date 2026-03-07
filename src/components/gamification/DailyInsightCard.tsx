"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"
import { useGamification } from "@/contexts/GamificationContext"
import Link from "next/link"

const DAILY_PROMPTS: Record<string, { prompt: string; icon: string }> = {
  astrology: { prompt: "Discover what the stars have in store for you today", icon: "🪷" },
  numerology: { prompt: "Unlock your personal day number and its cosmic meaning", icon: "🔢" },
  tarot: { prompt: "Draw a daily guidance card for clarity and insight", icon: "🃏" },
  vastu: { prompt: "Harmonize your space energy for a productive day", icon: "🏛️" },
}

const DEFAULT_PROMPT = { prompt: "Start a cosmic reading to unlock your daily wisdom", icon: "✨" }

export function DailyInsightCard() {
  const { dailyChallenge, dailyStreak } = useGamification()

  // Rotate verticals based on day of week
  const verticals = ["astrology", "numerology", "tarot", "vastu"]
  const todayVertical = verticals[new Date().getDay() % verticals.length]
  const prompt = DAILY_PROMPTS[todayVertical] || DEFAULT_PROMPT

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="rounded-2xl border border-saffron/20 bg-gradient-to-br from-navy-light/80 to-saffron/5 backdrop-blur-sm p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-saffron" />
            <span className="text-xs font-medium text-saffron uppercase tracking-wider">Daily Insight</span>
          </div>

          <p className="text-lg font-semibold text-cosmic-white mb-1">
            {prompt.icon} {prompt.prompt}
          </p>

          {dailyChallenge && !dailyChallenge.is_completed && (
            <div className="mt-3 p-3 rounded-xl bg-deep-space/50 border border-indigo/20">
              <p className="text-sm font-medium text-cosmic-white">{dailyChallenge.title}</p>
              <p className="text-xs text-cosmic-white/40 mt-0.5">{dailyChallenge.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-deep-space/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-saffron rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((dailyChallenge.progress / dailyChallenge.target_count) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-cosmic-white/40">
                  {dailyChallenge.progress}/{dailyChallenge.target_count}
                </span>
                <span className="text-xs text-saffron">+{dailyChallenge.bonus_xp} XP</span>
              </div>
            </div>
          )}

          {dailyChallenge?.is_completed && (
            <div className="mt-3 p-3 rounded-xl bg-saffron/10 border border-saffron/20">
              <p className="text-sm text-saffron font-medium">Challenge completed! Well done.</p>
            </div>
          )}
        </div>

        <Link
          href={`/chat?vertical=${todayVertical}`}
          className="ml-4 flex-shrink-0 w-11 h-11 rounded-xl bg-saffron text-deep-space flex items-center justify-center hover:bg-gold-light transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  )
}
