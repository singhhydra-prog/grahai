import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const redirect = searchParams.get("redirect") || "/app"

  // Handle both OAuth code exchange AND email magic link token
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") // email confirmation, magic link, etc.

  const cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookies) {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.length = 0
          cookiesToSet.push(
            ...cookies.map(({ name, value, options }) => ({
              name,
              value,
              options: options as Record<string, unknown>,
            }))
          )
        },
      },
    }
  )

  let authError = null

  if (code) {
    // OAuth flow (Google, etc.) — exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    authError = error
  } else if (token_hash && type) {
    // Email magic link / OTP confirmation — verify token
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "signup" | "magiclink" | "recovery" | "invite" | "email",
    })
    authError = error
  }

  if (!authError) {
    let redirectPath = redirect

    // Check if user has completed onboarding and link profile
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Try to link birth data from the profile or check onboarding status
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single()

        if (!profileError && profile && !profile.onboarding_completed) {
          redirectPath = "/app"
        }
      }
    } catch {
      // Profile table may not exist — skip check
    }

    // Create redirect response and attach ALL auth cookies
    const response = NextResponse.redirect(`${origin}${redirectPath}`)
    for (const { name, value, options } of cookiesToSet) {
      response.cookies.set(name, value, options)
    }
    return response
  }

  // Auth failed — redirect with error
  console.error("[auth/callback] Auth error:", authError?.message)
  return NextResponse.redirect(`${origin}/app?error=auth_failed&message=${encodeURIComponent(authError?.message || "Unknown error")}`)
}
