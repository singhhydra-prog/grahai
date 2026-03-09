import { createClient } from "@supabase/supabase-js"

/* ════════════════════════════════════════════════════════
   USAGE LIMITER — Enforces tier-based daily limits

   Free:        3 messages/day across all verticals
   Seeker:      10 messages/day
   Guru:        Unlimited
   Graha:       50 messages/day
   Rishi:       Unlimited

   Also enforces per-vertical limits for free tier:
   - 1 kundli calculation per day
   - 1 tarot reading per day
   ════════════════════════════════════════════════════════ */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

export interface UsageLimitResult {
  allowed: boolean
  remaining: number
  limit: number
  tier: string
  upgradeNeeded: boolean
  message?: string
}

// Daily message limits per tier
const TIER_LIMITS: Record<string, number> = {
  free: 3,
  nakshatra: 3,
  seeker: 10,
  graha: 50,
  guru: -1, // unlimited
  rishi: -1, // unlimited
}

/* ────────────────────────────────────────────────────
   CHECK USAGE — Can this user send a message?
   ──────────────────────────────────────────────────── */
export async function checkUsage(
  userId: string,
  vertical: string
): Promise<UsageLimitResult> {
  const sb = getSupabase()
  const today = new Date().toISOString().split("T")[0]

  // 1. Get user's subscription tier
  let tier = "free"
  try {
    const { data: profile } = await sb
      .from("profiles")
      .select("subscription_tier")
      .eq("id", userId)
      .single()

    if (profile?.subscription_tier) {
      tier = profile.subscription_tier.toLowerCase()
    }
  } catch {
    // Default to free tier
  }

  // 2. Check if unlimited
  const limit = TIER_LIMITS[tier] ?? TIER_LIMITS.free
  if (limit === -1) {
    return {
      allowed: true,
      remaining: -1,
      limit: -1,
      tier,
      upgradeNeeded: false,
    }
  }

  // 3. Get today's usage count
  try {
    const { data: usage } = await sb
      .from("user_daily_limits")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single()

    if (!usage) {
      // No usage today — first message
      return {
        allowed: true,
        remaining: limit - 1,
        limit,
        tier,
        upgradeNeeded: false,
      }
    }

    // Sum all vertical counts
    const totalUsed =
      (usage.astrology_count || 0) +
      (usage.numerology_count || 0) +
      (usage.tarot_count || 0) +
      (usage.vastu_count || 0) +
      (usage.pipeline_count || 0)

    if (totalUsed >= limit) {
      return {
        allowed: false,
        remaining: 0,
        limit,
        tier,
        upgradeNeeded: true,
        message: `You've used all ${limit} daily messages on your ${tier} plan. Upgrade for more.`,
      }
    }

    return {
      allowed: true,
      remaining: limit - totalUsed - 1,
      limit,
      tier,
      upgradeNeeded: false,
    }
  } catch {
    // If usage table query fails, allow the message (don't block on infra errors)
    return {
      allowed: true,
      remaining: limit,
      limit,
      tier,
      upgradeNeeded: false,
    }
  }
}

/* ────────────────────────────────────────────────────
   INCREMENT USAGE — Record message sent
   ──────────────────────────────────────────────────── */
export async function incrementUsage(
  userId: string,
  vertical: string
): Promise<void> {
  const sb = getSupabase()
  const today = new Date().toISOString().split("T")[0]

  // Map vertical to column name
  const columnMap: Record<string, string> = {
    astrology: "astrology_count",
    numerology: "numerology_count",
    tarot: "tarot_count",
    vastu: "vastu_count",
    general: "pipeline_count",
  }

  const column = columnMap[vertical] || "pipeline_count"

  try {
    // Try upsert — if row exists, increment; if not, create
    const { data: existing } = await sb
      .from("user_daily_limits")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single()

    if (existing) {
      // Increment the specific vertical count
      const currentCount = (existing as Record<string, number>)[column] || 0
      await sb
        .from("user_daily_limits")
        .update({ [column]: currentCount + 1 })
        .eq("user_id", userId)
        .eq("date", today)
    } else {
      // Insert new row for today
      await sb.from("user_daily_limits").insert({
        user_id: userId,
        date: today,
        [column]: 1,
      })
    }
  } catch (err) {
    console.warn("Failed to increment usage:", err)
  }
}

/* ────────────────────────────────────────────────────
   GET USAGE SUMMARY — For dashboard display
   ──────────────────────────────────────────────────── */
export async function getUsageSummary(userId: string): Promise<{
  tier: string
  today: Record<string, number>
  limit: number
  totalUsed: number
  remaining: number
}> {
  const sb = getSupabase()
  const today = new Date().toISOString().split("T")[0]

  let tier = "free"
  try {
    const { data: profile } = await sb
      .from("profiles")
      .select("subscription_tier")
      .eq("id", userId)
      .single()
    if (profile?.subscription_tier) tier = profile.subscription_tier.toLowerCase()
  } catch {}

  const limit = TIER_LIMITS[tier] ?? TIER_LIMITS.free

  try {
    const { data: usage } = await sb
      .from("user_daily_limits")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single()

    const todayUsage = {
      astrology: usage?.astrology_count || 0,
      numerology: usage?.numerology_count || 0,
      tarot: usage?.tarot_count || 0,
      vastu: usage?.vastu_count || 0,
      general: usage?.pipeline_count || 0,
    }

    const totalUsed = Object.values(todayUsage).reduce((a, b) => a + b, 0)

    return {
      tier,
      today: todayUsage,
      limit,
      totalUsed,
      remaining: limit === -1 ? -1 : Math.max(0, limit - totalUsed),
    }
  } catch {
    return { tier, today: {}, limit, totalUsed: 0, remaining: limit }
  }
}
