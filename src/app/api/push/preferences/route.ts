/* ════════════════════════════════════════════════════════
   GrahAI — Notification Preferences API

   GET: Retrieve user's notification preferences
   PUT: Update user's notification preferences

   Preferences stored in profiles table:
   - daily_push_enabled: boolean
   - weekly_push_enabled: boolean
   - monthly_push_enabled: boolean
   - daily_email_enabled: boolean

   Auth: Requires Supabase user session
   ════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getSupabase(request: NextRequest) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll() {},
    },
  })
}

export interface NotificationPreferences {
  daily_push_enabled: boolean
  weekly_push_enabled: boolean
  monthly_push_enabled: boolean
  daily_email_enabled: boolean
}

// ─── GET: Retrieve Preferences ─────────────────────────

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase(request)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user preferences from profiles table
    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        daily_push_enabled,
        weekly_push_enabled,
        monthly_push_enabled,
        daily_email_enabled
      `
      )
      .eq("id", user.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // Profile doesn't exist yet, return defaults
        return NextResponse.json({
          preferences: {
            daily_push_enabled: true,
            weekly_push_enabled: true,
            monthly_push_enabled: true,
            daily_email_enabled: true,
          },
        })
      }

      console.error("Profile fetch error:", error)
      return NextResponse.json(
        { error: "Failed to fetch preferences" },
        { status: 500 }
      )
    }

    // Build preferences object (default to true if not set)
    const preferences: NotificationPreferences = {
      daily_push_enabled: profile?.daily_push_enabled ?? true,
      weekly_push_enabled: profile?.weekly_push_enabled ?? true,
      monthly_push_enabled: profile?.monthly_push_enabled ?? true,
      daily_email_enabled: profile?.daily_email_enabled ?? true,
    }

    return NextResponse.json({ preferences })
  } catch (err) {
    console.error("GET preferences error:", err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}

// ─── PUT: Update Preferences ───────────────────────────

export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase(request)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      daily_push_enabled,
      weekly_push_enabled,
      monthly_push_enabled,
      daily_email_enabled,
    } = body

    // Validate input
    if (
      typeof daily_push_enabled !== "boolean" &&
      daily_push_enabled !== undefined &&
      typeof weekly_push_enabled !== "boolean" &&
      weekly_push_enabled !== undefined &&
      typeof monthly_push_enabled !== "boolean" &&
      monthly_push_enabled !== undefined &&
      typeof daily_email_enabled !== "boolean" &&
      daily_email_enabled !== undefined
    ) {
      return NextResponse.json(
        { error: "Invalid preferences format" },
        { status: 400 }
      )
    }

    // Build update object (only include provided fields)
    const updateData: Partial<NotificationPreferences> = {}
    if (typeof daily_push_enabled === "boolean") {
      updateData.daily_push_enabled = daily_push_enabled
    }
    if (typeof weekly_push_enabled === "boolean") {
      updateData.weekly_push_enabled = weekly_push_enabled
    }
    if (typeof monthly_push_enabled === "boolean") {
      updateData.monthly_push_enabled = monthly_push_enabled
    }
    if (typeof daily_email_enabled === "boolean") {
      updateData.daily_email_enabled = daily_email_enabled
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No preferences to update" },
        { status: 400 }
      )
    }

    // Update profile
    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id)
      .select(
        `
        daily_push_enabled,
        weekly_push_enabled,
        monthly_push_enabled,
        daily_email_enabled
      `
      )
      .single()

    if (error) {
      console.error("Profile update error:", error)
      return NextResponse.json(
        { error: "Failed to update preferences" },
        { status: 500 }
      )
    }

    // Return updated preferences
    const preferences: NotificationPreferences = {
      daily_push_enabled: data?.daily_push_enabled ?? true,
      weekly_push_enabled: data?.weekly_push_enabled ?? true,
      monthly_push_enabled: data?.monthly_push_enabled ?? true,
      daily_email_enabled: data?.daily_email_enabled ?? true,
    }

    return NextResponse.json({
      ok: true,
      preferences,
    })
  } catch (err) {
    console.error("PUT preferences error:", err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
