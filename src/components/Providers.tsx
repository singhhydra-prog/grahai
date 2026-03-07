"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js"
import { GamificationProvider } from "@/contexts/GamificationContext"
import { LevelUpCelebration } from "@/components/gamification/LevelUpCelebration"
import { AchievementUnlock } from "@/components/gamification/AchievementUnlock"

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => {
      if (user) setUserId(user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUserId(session?.user?.id || undefined)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <GamificationProvider userId={userId}>
      {children}
      <GamificationOverlays />
    </GamificationProvider>
  )
}

/**
 * Global gamification overlays — level-up celebration + achievement toasts.
 * These listen to gamification events from the context.
 */
function GamificationOverlays() {
  // These are managed at the app level via custom events
  const [levelUp, setLevelUp] = useState<{ show: boolean; level: number }>({ show: false, level: 1 })
  const [achievementUnlock, setAchievementUnlock] = useState<{
    show: boolean
    achievement: { title: string; icon_emoji: string; rarity: string; xp_reward: number } | null
  }>({ show: false, achievement: null })

  useEffect(() => {
    function handleLevelUp(e: CustomEvent) {
      setLevelUp({ show: true, level: e.detail.newLevel })
    }
    function handleAchievement(e: CustomEvent) {
      setAchievementUnlock({ show: true, achievement: e.detail })
    }

    window.addEventListener("grahai:levelup", handleLevelUp as EventListener)
    window.addEventListener("grahai:achievement", handleAchievement as EventListener)

    return () => {
      window.removeEventListener("grahai:levelup", handleLevelUp as EventListener)
      window.removeEventListener("grahai:achievement", handleAchievement as EventListener)
    }
  }, [])

  return (
    <>
      <LevelUpCelebration
        show={levelUp.show}
        newLevel={levelUp.level}
        onComplete={() => setLevelUp({ show: false, level: levelUp.level })}
      />
      <AchievementUnlock
        show={achievementUnlock.show}
        achievement={achievementUnlock.achievement}
        onDismiss={() => setAchievementUnlock({ show: false, achievement: null })}
      />
    </>
  )
}
