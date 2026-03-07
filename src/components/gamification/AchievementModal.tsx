"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trophy, Lock } from "lucide-react"
import { useGamification, type AchievementWithStatus } from "@/contexts/GamificationContext"
import { getRarityColor, getRarityGlow } from "@/lib/gamification/engine"

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "starter", label: "Starter" },
  { key: "milestone", label: "Milestone" },
  { key: "vertical", label: "Vertical" },
  { key: "special", label: "Special" },
  { key: "seasonal", label: "Seasonal" },
]

interface AchievementModalProps {
  show: boolean
  onClose: () => void
}

export function AchievementModal({ show, onClose }: AchievementModalProps) {
  const { achievements } = useGamification()
  const [activeCategory, setActiveCategory] = useState("all")

  const filtered = activeCategory === "all"
    ? achievements
    : achievements.filter(a => a.category === activeCategory)

  const unlocked = achievements.filter(a => a.unlocked).length

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-deep-space/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg max-h-[80vh] rounded-2xl border border-indigo/30 bg-navy-light/95 backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-indigo/20">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-saffron" />
                <h2 className="text-lg font-semibold text-cosmic-white">Achievements</h2>
                <span className="text-sm text-cosmic-white/40">{unlocked}/{achievements.length}</span>
              </div>
              <button onClick={onClose} className="text-cosmic-white/40 hover:text-cosmic-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category tabs */}
            <div className="flex gap-1 p-3 border-b border-indigo/10 overflow-x-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    activeCategory === cat.key
                      ? "bg-saffron/20 text-saffron"
                      : "text-cosmic-white/40 hover:text-cosmic-white/60"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Achievement grid */}
            <div className="p-4 overflow-y-auto max-h-[55vh] grid grid-cols-2 gap-3">
              {filtered.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AchievementCard({ achievement }: { achievement: AchievementWithStatus }) {
  const isLocked = !achievement.unlocked

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isLocked
          ? "border-indigo/20 bg-deep-space/30 opacity-50"
          : `${getRarityGlow(achievement.rarity)} bg-deep-space/50`
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">
          {isLocked ? <Lock className="w-6 h-6 text-cosmic-white/20" /> : achievement.icon_emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isLocked ? "text-cosmic-white/30" : "text-cosmic-white"}`}>
            {achievement.title}
          </p>
          <p className="text-xs text-cosmic-white/40 mt-0.5 line-clamp-2">{achievement.description}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-xs capitalize ${isLocked ? "text-cosmic-white/20" : getRarityColor(achievement.rarity)}`}>
              {achievement.rarity}
            </span>
            <span className="text-xs text-cosmic-white/30">+{achievement.xp_reward} XP</span>
          </div>
          {achievement.unlocked_at && (
            <p className="text-xs text-cosmic-white/20 mt-1">
              {new Date(achievement.unlocked_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
