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

    // Get or create profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "id, name, email, birth_data, preferences, entitlements, question_count_today"
      )
      .eq("id", user.id)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      throw profileError
    }

    // Create profile if doesn't exist
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            name: user.user_metadata?.name || "",
            email: user.email,
            birth_data: {},
            preferences: { language: "en", tone: "calm" },
            question_count_today: 0,
          },
          { onConflict: "id" }
        )
        .select(
          "id, name, email, birth_data, preferences, entitlements, question_count_today"
        )
        .single()

      if (createError) {
        throw createError
      }

      return NextResponse.json({
        profile: newProfile,
        user: {
          id: user.id,
          email: user.email,
        },
      })
    }

    return NextResponse.json({
      profile,
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Profile API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
