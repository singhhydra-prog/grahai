import { createClient } from "@supabase/supabase-js"

/* ────────────────────────────────────────────────────
   STREAK SYSTEM — Daily streaks + activity heatmap
   ──────────────────────────────────────────────────── */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

export interface StreakData {
  dailyStreak: number
  longestStreak: number
  streakIncremented: boolean
  streakReset: boolean
}

/**
 * Update user's daily streak based on last_activity_date
 * Returns updated streak info
 */
export async function updateStreak(userId: string): Promise<StreakData> {
  const sb = getSupabase()

  const { data: stats } = await sb
    .from("user_stats")
    .select("daily_streak, longest_streak, last_activity_date")
    .eq("user_id", userId)
    .single()

  if (!stats) {
    return { dailyStreak: 1, longestStreak: 1, streakIncremented: true, streakReset: false }
  }

  const today = new Date().toISOString().split("T")[0]
  const lastDate = stats.last_activity_date

  // Already active today — no change
  if (lastDate === today) {
    return {
      dailyStreak: stats.daily_streak,
      longestStreak: stats.longest_streak,
      streakIncremented: false,
      streakReset: false,
    }
  }

  // Check if yesterday
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]

  let newStreak: number
  let streakReset = false

  if (lastDate === yesterdayStr) {
    // Consecutive day — increment streak
    newStreak = stats.daily_streak + 1
  } else {
    // Streak broken — reset to 1
    newStreak = 1
    streakReset = stats.daily_streak > 1
  }

  const longestStreak = Math.max(newStreak, stats.longest_streak)

  // Update user_stats
  await sb
    .from("user_stats")
    .update({
      daily_streak: newStreak,
      longest_streak: longestStreak,
      last_activity_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)

  return {
    dailyStreak: newStreak,
    longestStreak,
    streakIncremented: true,
    streakReset,
  }
}

/**
 * Record daily activity in streak_calendar for heatmap
 */
export async function recordDailyActivity(
  userId: string,
  vertical: string,
  xpEarned: number
): Promise<void> {
  const sb = getSupabase()
  const today = new Date().toISOString().split("T")[0]

  // Check if entry exists for today
  const { data: existing } = await sb
    .from("streak_calendar")
    .select("id, verticals_used, xp_earned, readings_count")
    .eq("user_id", userId)
    .eq("date", today)
    .single()

  if (existing) {
    // Update existing entry
    const verticals = existing.verticals_used || []
    if (!verticals.includes(vertical)) {
      verticals.push(vertical)
    }

    await sb
      .from("streak_calendar")
      .update({
        verticals_used: verticals,
        xp_earned: existing.xp_earned + xpEarned,
        readings_count: existing.readings_count + 1,
      })
      .eq("id", existing.id)
  } else {
    // Create new entry
    await sb.from("streak_calendar").insert({
      user_id: userId,
      date: today,
      verticals_used: [vertical],
      xp_earned: xpEarned,
      readings_count: 1,
    })
  }
}

/**
 * Get streak calendar data for heatmap visualization
 */
export async function getStreakCalendar(
  userId: string,
  months: number = 3
): Promise<{ date: string; xp_earned: number; readings_count: number; verticals_used: string[] }[]> {
  const sb = getSupabase()

  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)

  const { data } = await sb
    .from("streak_calendar")
    .select("date, xp_earned, readings_count, verticals_used")
    .eq("user_id", userId)
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: true })

  return data || []
}
