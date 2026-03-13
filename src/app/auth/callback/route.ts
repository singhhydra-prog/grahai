import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const redirect = searchParams.get("redirect") || "/app"

  if (code) {
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
            // Update request cookies so subsequent getAll() calls see new values
            cookies.forEach(({ name, value }) => request.cookies.set(name, value))
            // Collect for setting on the response
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

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      let redirectPath = redirect

      // Check if user has completed onboarding
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
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
        // Profile table may not exist yet — skip onboarding check
      }

      // Create redirect response and attach ALL auth cookies
      const response = NextResponse.redirect(`${origin}${redirectPath}`)
      for (const { name, value, options } of cookiesToSet) {
        response.cookies.set(name, value, options)
      }
      return response
    }
  }

  return NextResponse.redirect(`${origin}/app?error=auth_failed`)
}
