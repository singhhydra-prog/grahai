import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { checkLevelUp, getLevelTitle } from "@/lib/gamification/engine"
import { getUserAchievements } from "@/lib/gamification/achievements"
import { getStreakCalendar } from "@/lib/gamification/streaks"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
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

    // Fetch all data in parallel
    const [statsRes, achievements, calendar, challengeRes] = await Promise.all([
      sb.from("user_stats").select("*").eq("user_id", userId).single(),
      getUserAchievements(userId),
      getStreakCalendar(userId, 3),
      sb.from("daily_challenges").select("*").eq("date", new Date().toISOString().split("T")[0]).limit(1),
    ])

    const stats = statsRes.data

    if (!stats) {
      return NextResponse.json({ error: "User stats not found" }, { status: 404 })
    }

    const levelResult = checkLevelUp(stats.total_xp, stats.current_level)

    // Daily challenge progress
    let dailyChallenge = null
    if (challengeRes.data && challengeRes.data.length > 0) {
      const ch = challengeRes.data[0]
      const { data: progress } = await sb
        .from("user_challenge_progress")
        .select("progress, is_completed")
        .eq("user_id", userId)
        .eq("challenge_id", ch.id)
        .single()

      dailyChallenge = {
        ...ch,
        progress: progress?.progress || 0,
        is_completed: progress?.is_completed || false,
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        level: stats.current_level,
        totalXP: stats.total_xp,
        xpToNextLevel: levelResult.xpToNextLevel,
        xpProgress: levelResult.xpProgress,
        levelTitle: getLevelTitle(stats.current_level),
        dailyStreak: stats.daily_streak,
        longestStreak: stats.longest_streak,
        readingsTotal: stats.readings_total,
        readingsAstrology: stats.readings_astrology,
        readingsNumerology: stats.readings_numerology,
        readingsTarot: stats.readings_tarot,
        readingsVastu: stats.readings_vastu,
        favoriteVertical: stats.favorite_vertical,
      },
      achievements,
      calendar,
      dailyChallenge,
    })
  } catch (err) {
    console.error("Stats error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
