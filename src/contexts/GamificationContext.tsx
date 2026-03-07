"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { checkLevelUp, getLevelTitle, calculateXP } from "@/lib/gamification/engine"

/* ────────────────────────────────────────────────────
   GAMIFICATION CONTEXT — Client-side state management
   ──────────────────────────────────────────────────── */

export interface GamificationState {
  // Core stats
  level: number
  totalXP: number
  xpToNextLevel: number
  xpProgress: number
  levelTitle: string

  // Streaks
  dailyStreak: number
  longestStreak: number

  // Reading counts
  readingsTotal: number
  readingsAstrology: number
  readingsNumerology: number
  readingsTarot: number
  readingsVastu: number

  // Achievements
  achievements: AchievementWithStatus[]
  recentUnlocks: AchievementWithStatus[]

  // Loading
  isLoaded: boolean

  // Daily challenge
  dailyChallenge: DailyChallenge | null
}

export interface AchievementWithStatus {
  id: string
  slug: string
  title: string
  description: string
  category: string
  icon_emoji: string
  rarity: string
  xp_reward: number
  unlocked: boolean
  unlocked_at?: string
  is_pinned?: boolean
}

export interface DailyChallenge {
  id: string
  title: string
  description: string
  vertical: string | null
  target_count: number
  bonus_xp: number
  progress: number
  is_completed: boolean
}

interface GamificationActions {
  awardXP: (vertical: string, messageCount?: number) => Promise<{
    xpEarned: number
    leveledUp: boolean
    newLevel?: number
    newAchievements?: AchievementWithStatus[]
  }>
  completeReading: (vertical: string) => Promise<void>
  refreshStats: () => Promise<void>
}

type GamificationContextType = GamificationState & GamificationActions

const defaultState: GamificationState = {
  level: 1,
  totalXP: 0,
  xpToNextLevel: 100,
  xpProgress: 0,
  levelTitle: "Novice",
  dailyStreak: 0,
  longestStreak: 0,
  readingsTotal: 0,
  readingsAstrology: 0,
  readingsNumerology: 0,
  readingsTarot: 0,
  readingsVastu: 0,
  achievements: [],
  recentUnlocks: [],
  isLoaded: false,
  dailyChallenge: null,
}

const GamificationContext = createContext<GamificationContextType>({
  ...defaultState,
  awardXP: async () => ({ xpEarned: 0, leveledUp: false }),
  completeReading: async () => {},
  refreshStats: async () => {},
})

export function useGamification() {
  return useContext(GamificationContext)
}

export function GamificationProvider({ children, userId }: { children: React.ReactNode; userId?: string }) {
  const [state, setState] = useState<GamificationState>(defaultState)
  const cacheTimestamp = useRef<number>(0)
  const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  const refreshStats = useCallback(async () => {
    if (!userId || !supabase) return

    // Check cache TTL
    const now = Date.now()
    if (now - cacheTimestamp.current < CACHE_TTL && state.isLoaded) return
    cacheTimestamp.current = now

    try {
      // Fetch stats, achievements, and daily challenge in parallel
      const [statsRes, achievementsRes, challengeRes] = await Promise.all([
        supabase.from("user_stats").select("*").eq("user_id", userId).single(),
        supabase.from("achievements").select("*"),
        supabase.from("daily_challenges").select("*").eq("date", new Date().toISOString().split("T")[0]).limit(1),
      ])

      const stats = statsRes.data
      const allAchievements = achievementsRes.data || []

      // Get user's unlocked achievements
      const { data: unlocked } = await supabase
        .from("user_achievements")
        .select("achievement_id, unlocked_at, is_pinned")
        .eq("user_id", userId)

      type UnlockedEntry = { achievement_id: string; unlocked_at?: string; is_pinned?: boolean }
      const unlockedMap = new Map<string, UnlockedEntry>(
        (unlocked || []).map((u: UnlockedEntry) => [u.achievement_id, u])
      )

      const achievements: AchievementWithStatus[] = allAchievements.map((a: { id: string; slug: string; title: string; description: string; category: string; icon_emoji: string; rarity: string; xp_reward: number }) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        description: a.description,
        category: a.category,
        icon_emoji: a.icon_emoji,
        rarity: a.rarity,
        xp_reward: a.xp_reward,
        unlocked: unlockedMap.has(a.id),
        unlocked_at: unlockedMap.get(a.id)?.unlocked_at,
        is_pinned: unlockedMap.get(a.id)?.is_pinned,
      }))

      // Daily challenge
      let dailyChallenge: DailyChallenge | null = null
      if (challengeRes.data && challengeRes.data.length > 0) {
        const ch = challengeRes.data[0]
        const { data: progress } = await supabase
          .from("user_challenge_progress")
          .select("progress, is_completed")
          .eq("user_id", userId)
          .eq("challenge_id", ch.id)
          .single()

        dailyChallenge = {
          id: ch.id,
          title: ch.title,
          description: ch.description,
          vertical: ch.vertical,
          target_count: ch.target_count,
          bonus_xp: ch.bonus_xp,
          progress: progress?.progress || 0,
          is_completed: progress?.is_completed || false,
        }
      }

      if (stats) {
        const levelCheck = checkLevelUp(stats.total_xp, stats.current_level)
        setState({
          level: stats.current_level,
          totalXP: stats.total_xp,
          xpToNextLevel: levelCheck.xpToNextLevel,
          xpProgress: levelCheck.xpProgress,
          levelTitle: getLevelTitle(stats.current_level),
          dailyStreak: stats.daily_streak,
          longestStreak: stats.longest_streak,
          readingsTotal: stats.readings_total,
          readingsAstrology: stats.readings_astrology,
          readingsNumerology: stats.readings_numerology,
          readingsTarot: stats.readings_tarot,
          readingsVastu: stats.readings_vastu,
          achievements,
          recentUnlocks: [],
          isLoaded: true,
          dailyChallenge,
        })
      } else {
        // No stats yet — create initial entry
        await supabase.from("user_stats").insert({
          user_id: userId,
          current_level: 1,
          total_xp: 0,
          xp_to_next_level: 100,
          daily_streak: 0,
          longest_streak: 0,
          readings_total: 0,
          readings_astrology: 0,
          readings_numerology: 0,
          readings_tarot: 0,
          readings_vastu: 0,
        })
        setState({ ...defaultState, achievements, isLoaded: true, dailyChallenge })
      }
    } catch (err) {
      console.warn("Failed to load gamification stats:", err)
      setState(s => ({ ...s, isLoaded: true }))
    }
  }, [userId, state.isLoaded, CACHE_TTL])

  // Load on mount
  useEffect(() => {
    if (userId) {
      refreshStats()
    }
  }, [userId, refreshStats])

  const awardXP = useCallback(async (vertical: string, messageCount?: number) => {
    if (!userId || !supabase) return { xpEarned: 0, leveledUp: false }

    try {
      const res = await fetch("/api/gamification/award-xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, vertical, messageCount }),
      })

      const data = await res.json()

      if (data.success) {
        // Optimistic update
        setState(prev => ({
          ...prev,
          totalXP: data.totalXP,
          level: data.newLevel || prev.level,
          xpProgress: data.xpProgress || prev.xpProgress,
          xpToNextLevel: data.xpToNextLevel || prev.xpToNextLevel,
          levelTitle: getLevelTitle(data.newLevel || prev.level),
          recentUnlocks: data.newAchievements || [],
        }))

        // Invalidate cache
        cacheTimestamp.current = 0

        // Dispatch global events for overlays
        if (data.leveledUp && typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("grahai:levelup", { detail: { newLevel: data.newLevel } }))
        }
        if (data.newAchievements?.length > 0 && typeof window !== "undefined") {
          // Show first achievement toast
          window.dispatchEvent(new CustomEvent("grahai:achievement", { detail: data.newAchievements[0] }))
        }

        return {
          xpEarned: data.xpEarned,
          leveledUp: data.leveledUp,
          newLevel: data.newLevel,
          newAchievements: data.newAchievements,
        }
      }
    } catch (err) {
      console.warn("Failed to award XP:", err)
    }

    return { xpEarned: 0, leveledUp: false }
  }, [userId])

  const completeReading = useCallback(async (vertical: string) => {
    if (!userId || !supabase) return

    try {
      await fetch("/api/gamification/complete-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, vertical }),
      })

      // Invalidate cache
      cacheTimestamp.current = 0
    } catch (err) {
      console.warn("Failed to complete reading:", err)
    }
  }, [userId])

  return (
    <GamificationContext.Provider value={{ ...state, awardXP, completeReading, refreshStats }}>
      {children}
    </GamificationContext.Provider>
  )
}
