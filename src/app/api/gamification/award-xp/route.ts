import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { calculateXP, checkLevelUp } from "@/lib/gamification/engine"
import { checkAchievements } from "@/lib/gamification/achievements"
import { updateStreak, recordDailyActivity } from "@/lib/gamification/streaks"

export async function POST(req: NextRequest) {
  try {
    const { userId, vertical, messageCount } = await req.json()

    if (!userId || !vertical) {
      return NextResponse.json({ error: "Missing userId or vertical" }, { status: 400 })
    }

    const sb = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll() },
          setAll() { },
        },
      }
    )

    // Get current stats
    const { data: stats } = await sb
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (!stats) {
      return NextResponse.json({ error: "User stats not found" }, { status: 404 })
    }

    // Update streak
    const streakData = await updateStreak(userId)

    // Check if first reading today
    const today = new Date().toISOString().split("T")[0]
    const isFirstDaily = stats.last_activity_date !== today

    // Calculate XP
    const xpEarned = calculateXP({
      vertical,
      messageCount: messageCount || 1,
      isFirstDaily,
      currentStreak: streakData.dailyStreak,
    })

    const newTotalXP = stats.total_xp + xpEarned

    // Check level up
    const levelResult = checkLevelUp(newTotalXP, stats.current_level)

    // Update stats
    await sb
      .from("user_stats")
      .update({
        total_xp: newTotalXP,
        current_level: levelResult.newLevel,
        xp_to_next_level: levelResult.xpToNextLevel,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)

    // Record daily activity (fire-and-forget)
    recordDailyActivity(userId, vertical, xpEarned).catch(() => {})

    // Check achievements
    const updatedStats = {
      ...stats,
      total_xp: newTotalXP,
      current_level: levelResult.newLevel,
      daily_streak: streakData.dailyStreak,
      longest_streak: streakData.longestStreak,
    }
    const newAchievements = await checkAchievements(userId, updatedStats)

    // Add achievement XP
    let bonusXP = 0
    for (const achievement of newAchievements) {
      bonusXP += achievement.xp_reward
    }

    if (bonusXP > 0) {
      await sb
        .from("user_stats")
        .update({ total_xp: newTotalXP + bonusXP })
        .eq("user_id", userId)
    }

    return NextResponse.json({
      success: true,
      xpEarned: xpEarned + bonusXP,
      totalXP: newTotalXP + bonusXP,
      leveledUp: levelResult.leveledUp,
      newLevel: levelResult.newLevel,
      xpProgress: levelResult.xpProgress,
      xpToNextLevel: levelResult.xpToNextLevel,
      streak: streakData.dailyStreak,
      newAchievements: newAchievements.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        icon_emoji: a.icon_emoji,
        rarity: a.rarity,
        xp_reward: a.xp_reward,
      })),
    })
  } catch (err) {
    console.error("Award XP error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
