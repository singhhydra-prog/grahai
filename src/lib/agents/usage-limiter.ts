import { createClient } from "@supabase/supabase-js"

/* ════════════════════════════════════════════════════════
   USAGE LIMITER — Enforces tier-based daily limits

   Free:        1 message/day (3/day for first 3 days)
   Plus:        2 messages/day (~60/month, exceeds 30 promise)
   Premium:     Unlimited

   Also enforces per-vertical limits for free tier:
   - Truncate after 1st message (soft paywall)
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
  shouldTruncate?: boolean
  truncateMessage?: string
}

// Daily message limits per tier
const TIER_LIMITS: Record<string, number> = {
  free: 1,
  plus: 2,
  premium: -1, // unlimited
}

const WELCOME_LIMIT = 3 // For new accounts in first 3 days
const WELCOME_DAYS = 3

// Point after which responses are truncated (soft paywall)
const TRUNCATE_AFTER: Record<string, number> = {
  free: 1, // Truncate after 1st message for free tier
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

  // 1. Get user's subscription tier and created_at
  let tier = "free"
  let createdAt: string | null = null
  try {
    const { data: profile } = await sb
      .from("profiles")
      .select("subscription_tier, created_at")
      .eq("id", userId)
      .single()

    if (profile?.subscription_tier) {
      tier = profile.subscription_tier.toLowerCase()
    }
    createdAt = profile?.created_at || null
  } catch {
    // Default to free tier
  }

  // 2. Calculate effective limit (with welcome period for free tier)
  let effectiveLimit = TIER_LIMITS[tier] ?? TIER_LIMITS.free

  // Check welcome period for free tier
  if (tier === "free" && createdAt) {
    const accountAge = Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (accountAge < WELCOME_DAYS) {
      effectiveLimit = WELCOME_LIMIT
    }
  }

  // 3. Check if unlimited
  if (effectiveLimit === -1) {
    return {
      allowed: true,
      remaining: -1,
      limit: -1,
      tier,
      upgradeNeeded: false,
    }
  }

  // 4. Get today's usage count
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
        remaining: effectiveLimit - 1,
        limit: effectiveLimit,
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

    if (totalUsed >= effectiveLimit) {
      return {
        allowed: false,
        remaining: 0,
        limit: effectiveLimit,
        tier,
        upgradeNeeded: true,
        message: `You've used all ${effectiveLimit} daily messages on your ${tier} plan. Upgrade for more.`,
      }
    }

    // Check if response should be truncated (soft paywall)
    const truncateAfter = TRUNCATE_AFTER[tier]
    const shouldTruncate = truncateAfter !== undefined && totalUsed >= truncateAfter

    return {
      allowed: true,
      remaining: effectiveLimit - totalUsed - 1,
      limit: effectiveLimit,
      tier,
      upgradeNeeded: false,
      shouldTruncate,
      truncateMessage: shouldTruncate
        ? "Upgrade to see the full analysis. Your response has been shortened."
        : undefined,
    }
  } catch {
    // If usage table query fails, allow the message (don't block on infra errors)
    return {
      allowed: true,
      remaining: effectiveLimit,
      limit: effectiveLimit,
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
  let createdAt: string | null = null
  try {
    const { data: profile } = await sb
      .from("profiles")
      .select("subscription_tier, created_at")
      .eq("id", userId)
      .single()
    if (profile?.subscription_tier) tier = profile.subscription_tier.toLowerCase()
    createdAt = profile?.created_at || null
  } catch {}

  // Calculate effective limit with welcome period
  let effectiveLimit = TIER_LIMITS[tier] ?? TIER_LIMITS.free
  if (tier === "free" && createdAt) {
    const accountAge = Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (accountAge < WELCOME_DAYS) {
      effectiveLimit = WELCOME_LIMIT
    }
  }

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
      limit: effectiveLimit,
      totalUsed,
      remaining: effectiveLimit === -1 ? -1 : Math.max(0, effectiveLimit - totalUsed),
    }
  } catch {
    return { tier, today: {}, limit: effectiveLimit, totalUsed: 0, remaining: effectiveLimit }
  }
}
