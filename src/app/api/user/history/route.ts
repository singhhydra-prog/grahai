import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
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

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get last 50 questions from history
    const { data: history, error: historyError } = await supabase
      .from("question_history")
      .select(
        "id, question, answer, topic, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (historyError) {
      throw historyError
    }

    // Transform answer to answer_preview (first 100 chars)
    const transformedHistory = (history || []).map((item) => ({
      id: item.id,
      question: item.question,
      answer_preview: item.answer.substring(0, 100),
      topic: item.topic || null,
      created_at: item.created_at,
    }))

    return NextResponse.json({
      history: transformedHistory,
      count: transformedHistory.length,
    })
  } catch (error) {
    console.error("History GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
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

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { question, answer, topic } = body

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Missing required fields: question, answer" },
        { status: 400 }
      )
    }

    // Save to history
    const { data: saved, error: saveError } = await supabase
      .from("question_history")
      .insert({
        user_id: user.id,
        question,
        answer,
        topic: topic || null,
      })
      .select("id, question, answer, topic, created_at")
      .single()

    if (saveError) {
      throw saveError
    }

    return NextResponse.json(
      {
        success: true,
        data: saved,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("History POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
