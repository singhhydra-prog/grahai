"use client"

import { motion } from "framer-motion"
import { Trophy } from "lucide-react"
import { useGamification } from "@/contexts/GamificationContext"
import { getRarityGlow } from "@/lib/gamification/engine"

export function AchievementShowcase() {
  const { achievements } = useGamification()

  // Get top 3 pinned or most recently unlocked
  const unlocked = achievements
    .filter(a => a.unlocked)
    .sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1
      if (!a.is_pinned && b.is_pinned) return 1
      return (b.unlocked_at || "").localeCompare(a.unlocked_at || "")
    })
    .slice(0, 3)

  const totalUnlocked = achievements.filter(a => a.unlocked).length
  const totalAchievements = achievements.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="rounded-2xl border border-indigo/30 bg-navy-light/50 backdrop-blur-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-saffron" />
          <h3 className="text-lg font-semibold text-cosmic-white">Achievements</h3>
        </div>
        <span className="text-sm text-cosmic-white/40">{totalUnlocked}/{totalAchievements}</span>
      </div>

      {unlocked.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-cosmic-white/40 text-sm">No achievements yet</p>
          <p className="text-cosmic-white/30 text-xs mt-1">Start your cosmic journey to unlock badges</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {unlocked.map((achievement, i) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`rounded-xl border p-4 text-center ${getRarityGlow(achievement.rarity)} bg-deep-space/50`}
            >
              <div className="text-3xl mb-2">{achievement.icon_emoji}</div>
              <p className="text-xs font-medium text-cosmic-white truncate">{achievement.title}</p>
              <p className="text-xs text-cosmic-white/30 mt-0.5 capitalize">{achievement.rarity}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
