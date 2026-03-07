import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function POST(req: NextRequest) {
  try {
    const { userId, vertical } = await req.json()

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

    // Determine which counter to increment
    const verticalCountField = `readings_${vertical}` as keyof typeof stats
    const currentVerticalCount = (typeof stats[verticalCountField] === "number" ? stats[verticalCountField] : 0) as number

    // Build update
    const update: Record<string, unknown> = {
      readings_total: stats.readings_total + 1,
      updated_at: new Date().toISOString(),
    }

    // Increment vertical-specific counter
    if (["astrology", "numerology", "tarot", "vastu"].includes(vertical)) {
      update[`readings_${vertical}`] = currentVerticalCount + 1
    }

    // Update favorite vertical
    const verticalCounts: Record<string, number> = {
      astrology: vertical === "astrology" ? currentVerticalCount + 1 : stats.readings_astrology,
      numerology: vertical === "numerology" ? currentVerticalCount + 1 : stats.readings_numerology,
      tarot: vertical === "tarot" ? currentVerticalCount + 1 : stats.readings_tarot,
      vastu: vertical === "vastu" ? currentVerticalCount + 1 : stats.readings_vastu,
    }

    const maxVertical = Object.entries(verticalCounts)
      .sort(([, a], [, b]) => b - a)[0]
    if (maxVertical) {
      update.favorite_vertical = maxVertical[0]
    }

    await sb.from("user_stats").update(update).eq("user_id", userId)

    return NextResponse.json({
      success: true,
      readingsTotal: stats.readings_total + 1,
      verticalCount: currentVerticalCount + 1,
    })
  } catch (err) {
    console.error("Complete reading error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
