import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase-server"

/**
 * POST /api/auth/otp
 * Body: { phone: string } — Send OTP
 * Body: { phone: string, otp: string } — Verify OTP
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

    const supabase = await createSupabaseServer()

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

      return NextResponse.json({
        success: true,
        user: data.user ? {
          id: data.user.id,
          phone: data.user.phone,
        } : null,
        session: !!data.session,
      })
    }

    // Otherwise, send OTP
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "OTP sent" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
