import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function POST(req: NextRequest) {
  try {
    const { userId, conversationId, rating, vertical } = await req.json()

    if (!userId || rating === undefined || rating === null) {
      return NextResponse.json({ error: "Missing userId or rating" }, { status: 400 })
    }

    // Validate rating is a number between 1 and 5
    const numRating = Number(rating)
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: "Rating must be an integer between 1 and 5" }, { status: 400 })
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

    // Save rating to conversation metadata
    if (conversationId) {
      await sb
        .from("messages")
        .update({ metadata: { satisfaction_rating: rating } })
        .eq("conversation_id", conversationId)
        .eq("role", "assistant")
        .order("created_at", { ascending: false })
        .limit(1)
    }

    // Award bonus XP for rating (5 XP per star, max 25)
    const bonusXP = Math.min(numRating * 5, 25)
    const { data: stats } = await sb
      .from("user_stats")
      .select("total_xp")
      .eq("user_id", userId)
      .single()

    if (stats) {
      await sb
        .from("user_stats")
        .update({
          total_xp: stats.total_xp + bonusXP,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
    }

    return NextResponse.json({
      success: true,
      bonusXP,
      message: `Thank you for your feedback! +${bonusXP} XP`,
    })
  } catch (err) {
    console.error("Rate reading error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
