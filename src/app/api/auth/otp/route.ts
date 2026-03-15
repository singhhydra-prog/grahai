import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

/**
 * POST /api/auth/otp
 * Body: { phone: string } — Send OTP
 * Body: { phone: string, otp: string } — Verify OTP
 *
 * Uses its own Supabase client (not the shared createSupabaseServer)
 * so auth cookies are properly set on the NextResponse object.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, otp } = body

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    // Normalize phone: ensure +91 prefix for Indian numbers
    const normalizedPhone = phone.startsWith("+") ? phone : `+91${phone.replace(/^0+/, "")}`

    // Collect cookies that Supabase wants to set so we can attach them to the response
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

    // If OTP is provided, verify it
    if (otp) {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: normalizedPhone,
        token: otp,
        type: "sms",
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      // Build response and attach all auth cookies
      const response = NextResponse.json({
        success: true,
        user: data.user ? {
          id: data.user.id,
          phone: data.user.phone,
        } : null,
        session: !!data.session,
      })

      for (const { name, value, options } of cookiesToSet) {
        response.cookies.set(name, value, options)
      }

      return response
    }

    // Otherwise, send OTP
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Build response and attach any cookies (e.g. PKCE code verifier)
    const response = NextResponse.json({ success: true, message: "OTP sent" })
    for (const { name, value, options } of cookiesToSet) {
      response.cookies.set(name, value, options)
    }

    return response
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
