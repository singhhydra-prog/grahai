"use client"

import { motion } from "framer-motion"
import { Flame, Star, Zap } from "lucide-react"
import { useGamification } from "@/contexts/GamificationContext"

export function CosmicScoreWidget() {
  const { level, totalXP, xpProgress, xpToNextLevel, dailyStreak, levelTitle, isLoaded } = useGamification()

  if (!isLoaded) {
    return (
      <div className="rounded-2xl border border-indigo/30 bg-navy-light/50 backdrop-blur-sm p-6 animate-pulse">
        <div className="h-20 bg-deep-space/50 rounded-xl" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-2xl border border-indigo/30 bg-navy-light/50 backdrop-blur-sm p-6"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-saffron/20 border border-saffron/30 flex items-center justify-center">
            <Star className="w-6 h-6 text-saffron" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-cosmic-white">Level {level}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-saffron/20 text-saffron font-medium">
                {levelTitle}
              </span>
            </div>
            <p className="text-sm text-cosmic-white/40">{totalXP.toLocaleString()} total XP</p>
          </div>
        </div>

        {/* Streak counter */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-deep-space/50 border border-indigo/20">
          <Flame className={`w-5 h-5 ${dailyStreak >= 3 ? "text-orange-400" : "text-cosmic-white/40"}`} />
          <div className="text-right">
            <p className="text-lg font-bold text-cosmic-white">{dailyStreak}</p>
            <p className="text-xs text-cosmic-white/40">day streak</p>
          </div>
        </div>
      </div>

      {/* XP Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-cosmic-white/40">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-saffron" />
            Next level
          </span>
          <span>{xpToNextLevel} XP to go</span>
        </div>
        <div className="h-3 bg-deep-space/50 rounded-full overflow-hidden border border-indigo/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(xpProgress * 100, 2)}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-saffron to-gold-light"
          />
        </div>
        <div className="flex justify-between text-xs text-cosmic-white/30">
          <span>Level {level}</span>
          <span>Level {level + 1}</span>
        </div>
      </div>
    </motion.div>
  )
}
