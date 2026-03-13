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

    // Get user's profile to check current plan
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      throw profileError
    }

    const currentPlan = profile?.plan || "free"

    // Get active entitlements
    const { data: entitlements, error: entitlementsError } = await supabase
      .from("entitlements")
      .select("id, type, product_id, status, expires_at, created_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (entitlementsError) {
      throw entitlementsError
    }

    // Separate subscriptions and one-time purchases
    const subscriptions = entitlements?.filter((e) => e.type === "subscription") || []
    const oneTimePurchases = entitlements?.filter((e) => e.type === "one_time") || []

    return NextResponse.json({
      currentPlan,
      subscriptions,
      oneTimePurchases,
      entitlements: entitlements || [],
    })
  } catch (error) {
    console.error("Entitlements API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
