import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getUserEntitlements } from "@/lib/entitlements/checker"

/* ════════════════════════════════════════════════════════
   ENTITLEMENTS API — V2 with feature flags

   GET  — Returns full entitlement state with features
   ════════════════════════════════════════════════════════ */

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

    // Get full entitlements from checker
    const entitlements = await getUserEntitlements(user.id)

    return NextResponse.json({
      tier: entitlements.tier,
      features: entitlements.features,
      oneTimePurchases: entitlements.oneTimePurchases,
      isActive: entitlements.isActive,
      expiresAt: entitlements.expiresAt,
    })
  } catch (error) {
    console.error("Entitlements API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
