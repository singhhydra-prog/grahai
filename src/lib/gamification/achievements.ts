import { createClient } from "@supabase/supabase-js"

/* ────────────────────────────────────────────────────
   ACHIEVEMENT SYSTEM — Check & Unlock Achievements
   ──────────────────────────────────────────────────── */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

export interface UserStats {
  current_level: number
  total_xp: number
  daily_streak: number
  longest_streak: number
  readings_total: number
  readings_astrology: number
  readings_numerology: number
  readings_tarot: number
  readings_vastu: number
}

export interface Achievement {
  id: string
  slug: string
  title: string
  description: string
  category: string
  icon_emoji: string
  rarity: string
  xp_reward: number
  criteria: Record<string, unknown>
}

export interface UnlockedAchievement extends Achievement {
  unlocked_at: string
  is_pinned: boolean
}

/**
 * Check all achievements against current user stats
 * Returns newly unlocked achievements
 */
export async function checkAchievements(
  userId: string,
  stats: UserStats
): Promise<Achievement[]> {
  const sb = getSupabase()

  // Get all achievements
  const { data: allAchievements } = await sb
    .from("achievements")
    .select("*")

  if (!allAchievements) return []

  // Get already unlocked
  const { data: unlocked } = await sb
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId)

  const unlockedIds = new Set((unlocked || []).map(u => u.achievement_id))
  const newlyUnlocked: Achievement[] = []

  for (const achievement of allAchievements) {
    if (unlockedIds.has(achievement.id)) continue

    const criteria = achievement.criteria as Record<string, unknown>
    let earned = false

    switch (criteria.type) {
      case "onboarding_complete":
        // Checked separately during onboarding
        break

      case "level":
        earned = stats.current_level >= (criteria.threshold as number)
        break

      case "streak":
        earned = stats.daily_streak >= (criteria.threshold as number) ||
                 stats.longest_streak >= (criteria.threshold as number)
        break

      case "readings_total":
        earned = stats.readings_total >= (criteria.threshold as number)
        break

      case "readings_astrology":
        earned = stats.readings_astrology >= (criteria.threshold as number)
        break

      case "readings_numerology":
        earned = stats.readings_numerology >= (criteria.threshold as number)
        break

      case "readings_tarot":
        earned = stats.readings_tarot >= (criteria.threshold as number)
        break

      case "readings_vastu":
        earned = stats.readings_vastu >= (criteria.threshold as number)
        break

      case "verticals_explored": {
        const verticalsUsed = [
          stats.readings_astrology > 0,
          stats.readings_numerology > 0,
          stats.readings_tarot > 0,
          stats.readings_vastu > 0,
        ].filter(Boolean).length
        earned = verticalsUsed >= (criteria.threshold as number)
        break
      }

      case "all_verticals_week":
        // This needs streak_calendar check — handled in complete-reading API
        break

      case "messages_sent":
        // Tracked separately via message count
        break

      case "ratings_given":
        // Tracked separately via rating API
        break

      case "seasonal":
        // Checked in complete-reading based on current date
        break
    }

    if (earned) {
      newlyUnlocked.push(achievement)
    }
  }

  // Batch insert newly unlocked
  if (newlyUnlocked.length > 0) {
    const inserts = newlyUnlocked.map(a => ({
      user_id: userId,
      achievement_id: a.id,
      unlocked_at: new Date().toISOString(),
      is_pinned: false,
    }))

    await sb.from("user_achievements").insert(inserts)
  }

  return newlyUnlocked
}

/**
 * Get all achievements with unlock status for a user
 */
export async function getUserAchievements(
  userId: string
): Promise<{ achievement: Achievement; unlocked: boolean; unlocked_at?: string; is_pinned?: boolean }[]> {
  const sb = getSupabase()

  const [{ data: all }, { data: unlocked }] = await Promise.all([
    sb.from("achievements").select("*").order("category"),
    sb.from("user_achievements").select("*").eq("user_id", userId),
  ])

  if (!all) return []

  const unlockedMap = new Map(
    (unlocked || []).map(u => [u.achievement_id, u])
  )

  return all.map(achievement => ({
    achievement,
    unlocked: unlockedMap.has(achievement.id),
    unlocked_at: unlockedMap.get(achievement.id)?.unlocked_at,
    is_pinned: unlockedMap.get(achievement.id)?.is_pinned,
  }))
}

/**
 * Unlock a specific achievement by slug
 */
export async function unlockAchievementBySlug(
  userId: string,
  slug: string
): Promise<Achievement | null> {
  const sb = getSupabase()

  const { data: achievement } = await sb
    .from("achievements")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!achievement) return null

  // Check if already unlocked
  const { data: existing } = await sb
    .from("user_achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_id", achievement.id)
    .limit(1)

  if (existing && existing.length > 0) return null

  await sb.from("user_achievements").insert({
    user_id: userId,
    achievement_id: achievement.id,
    unlocked_at: new Date().toISOString(),
    is_pinned: false,
  })

  return achievement
}
