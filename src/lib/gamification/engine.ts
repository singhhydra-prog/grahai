/* ────────────────────────────────────────────────────
   GAMIFICATION ENGINE — XP, Levels, Scoring
   ──────────────────────────────────────────────────── */

// Vertical XP multipliers (some verticals reward more for complexity)
const VERTICAL_MULTIPLIERS: Record<string, number> = {
  astrology: 1.25,   // Most complex calculations
  numerology: 1.1,
  tarot: 1.0,
  vastu: 1.15,
  general: 0.8,
}

// Streak bonus tiers
const STREAK_BONUSES: { minStreak: number; multiplier: number }[] = [
  { minStreak: 30, multiplier: 1.5 },
  { minStreak: 14, multiplier: 1.35 },
  { minStreak: 7, multiplier: 1.25 },
  { minStreak: 3, multiplier: 1.15 },
  { minStreak: 1, multiplier: 1.0 },
]

const BASE_XP = 40
const FIRST_DAILY_BONUS = 20

/**
 * Calculate XP earned for a reading/interaction
 */
export function calculateXP(params: {
  vertical: string
  messageCount?: number
  isFirstDaily?: boolean
  currentStreak?: number
}): number {
  const { vertical, messageCount = 1, isFirstDaily = false, currentStreak = 0 } = params

  const verticalMult = VERTICAL_MULTIPLIERS[vertical] || 1.0
  const streakBonus = STREAK_BONUSES.find(s => currentStreak >= s.minStreak)?.multiplier || 1.0

  // Base XP + message depth bonus (up to 5 messages contribute)
  const depthBonus = Math.min(messageCount, 5) * 5
  let xp = (BASE_XP + depthBonus) * verticalMult * streakBonus

  // First reading of the day bonus
  if (isFirstDaily) {
    xp += FIRST_DAILY_BONUS
  }

  return Math.round(xp)
}

/**
 * Get total XP required to reach a given level
 * Formula: 100 * level^1.15 (progressive scaling)
 */
export function getXPForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.15))
}

/**
 * Check if user has leveled up and compute new state
 */
export function checkLevelUp(totalXP: number, currentLevel: number): {
  leveledUp: boolean
  newLevel: number
  xpToNextLevel: number
  xpProgress: number
} {
  let level = currentLevel
  let xpNeeded = getXPForLevel(level + 1)

  // Check for multiple level-ups
  while (totalXP >= xpNeeded && level < 100) {
    level++
    xpNeeded = getXPForLevel(level + 1)
  }

  const xpForCurrent = getXPForLevel(level)
  const xpForNext = getXPForLevel(level + 1)
  const xpInLevel = totalXP - xpForCurrent
  const xpRange = xpForNext - xpForCurrent

  return {
    leveledUp: level > currentLevel,
    newLevel: level,
    xpToNextLevel: xpForNext - totalXP,
    xpProgress: Math.max(0, Math.min(1, xpInLevel / xpRange)),
  }
}

/**
 * Get the title/rank for a given level
 */
export function getLevelTitle(level: number): string {
  if (level >= 50) return "Cosmic Guru"
  if (level >= 30) return "Celestial Sage"
  if (level >= 20) return "Stellar Master"
  if (level >= 10) return "Cosmic Adept"
  if (level >= 5) return "Rising Star"
  if (level >= 3) return "Seeker"
  return "Novice"
}

/**
 * Get the color class for a rarity tier
 */
export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case "legendary": return "text-yellow-400"
    case "epic": return "text-purple-400"
    case "rare": return "text-blue-400"
    default: return "text-cosmic-white/60"
  }
}

/**
 * Get rarity border glow class
 */
export function getRarityGlow(rarity: string): string {
  switch (rarity) {
    case "legendary": return "border-yellow-400/50 shadow-yellow-400/20"
    case "epic": return "border-purple-400/50 shadow-purple-400/20"
    case "rare": return "border-blue-400/50 shadow-blue-400/20"
    default: return "border-indigo/30"
  }
}
