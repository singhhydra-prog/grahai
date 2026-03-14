import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { updateMemoryThread, detectLifeArea } from "@/lib/agents/memory"
import { trackEvent } from "@/lib/analytics/tracker"

/* ════════════════════════════════════════════════════════
   QUESTION HISTORY API — V2 with source refs & categories

   GET  — Fetch saved question history (with filtering)
   POST — Save a new question with structured answer data
   ════════════════════════════════════════════════════════ */

function createSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle cookie errors silently on server
          }
        },
      },
    }
  )
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createSupabase(cookieStore)

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query params for filtering
    const url = new URL(request.url)
    const category = url.searchParams.get("category")
    const savedOnly = url.searchParams.get("saved") === "true"
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100)

    let query = supabase
      .from("question_history")
      .select("id, question, answer, topic, category, source_refs, saved_flag, vertical, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (category) {
      query = query.eq("category", category)
    }
    if (savedOnly) {
      query = query.eq("saved_flag", true)
    }

    const { data: history, error: historyError } = await query

    if (historyError) throw historyError

    // Transform for client
    const transformedHistory = (history || []).map((item) => ({
      id: item.id,
      question: item.question,
      answer_preview: typeof item.answer === "string" ? item.answer.substring(0, 150) : "",
      topic: item.topic || null,
      category: item.category || null,
      sourceRefs: item.source_refs || [],
      saved: item.saved_flag || false,
      vertical: item.vertical || "astrology",
      created_at: item.created_at,
    }))

    return NextResponse.json({
      history: transformedHistory,
      count: transformedHistory.length,
    })
  } catch (error) {
    console.error("History GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createSupabase(cookieStore)

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { question, answer, topic, category, sourceRefs, vertical, answerJson } = body

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Missing required fields: question, answer" },
        { status: 400 }
      )
    }

    // Auto-detect category from question if not provided
    const detectedCategory = category || detectLifeArea(question) || "general"

    // Save to history with enhanced fields
    const { data: saved, error: saveError } = await supabase
      .from("question_history")
      .insert({
        user_id: user.id,
        question,
        answer,
        topic: topic || null,
        category: detectedCategory,
        answer_json: answerJson || {},
        source_refs: sourceRefs || [],
        vertical: vertical || "astrology",
        saved_flag: false,
      })
      .select("id, question, answer, topic, category, source_refs, created_at")
      .single()

    if (saveError) throw saveError

    // Update memory thread (fire-and-forget — don't block response)
    updateMemoryThread(user.id, question, saved.id).catch(() => {})

    // Track analytics
    trackEvent("question_asked", user.id, {
      category: detectedCategory,
      vertical: vertical || "astrology",
      hasSourceRefs: (sourceRefs || []).length > 0,
    }).catch(() => {})

    return NextResponse.json({ success: true, data: saved }, { status: 201 })
  } catch (error) {
    console.error("History POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/* ────────────────────────────────────────────────────
   PATCH — Toggle saved flag on a question
   ──────────────────────────────────────────────────── */
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createSupabase(cookieStore)

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { questionId, saved } = body

    if (!questionId || typeof saved !== "boolean") {
      return NextResponse.json(
        { error: "Missing questionId or saved boolean" },
        { status: 400 }
      )
    }

    const { error: updateError } = await supabase
      .from("question_history")
      .update({ saved_flag: saved })
      .eq("id", questionId)
      .eq("user_id", user.id)

    if (updateError) throw updateError

    if (saved) {
      trackEvent("question_saved", user.id, { questionId }).catch(() => {})
    }

    return NextResponse.json({ success: true, saved })
  } catch (error) {
    console.error("History PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
