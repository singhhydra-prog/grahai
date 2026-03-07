"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getRarityColor } from "@/lib/gamification/engine"

interface AchievementUnlockProps {
  achievement: {
    title: string
    icon_emoji: string
    rarity: string
    xp_reward: number
  } | null
  show: boolean
  onDismiss: () => void
}

export function AchievementUnlock({ achievement, show, onDismiss }: AchievementUnlockProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onDismiss, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onDismiss])

  return (
    <AnimatePresence>
      {show && achievement && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="fixed top-6 right-6 z-[90]"
          onClick={onDismiss}
        >
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-navy-light/90 border border-saffron/30 backdrop-blur-xl shadow-lg shadow-saffron/10 cursor-pointer">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl"
            >
              {achievement.icon_emoji}
            </motion.div>
            <div>
              <p className="text-xs text-saffron font-medium uppercase tracking-wider">Achievement Unlocked!</p>
              <p className="text-sm font-semibold text-cosmic-white">{achievement.title}</p>
              <p className={`text-xs ${getRarityColor(achievement.rarity)} capitalize`}>
                {achievement.rarity} · +{achievement.xp_reward} XP
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
