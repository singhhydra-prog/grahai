import { createClient } from "@supabase/supabase-js"

/* ════════════════════════════════════════════════════════
   ENTITLEMENT CHECKER — Feature-flag based access control

   Per Execution Document Module G (Payments & Entitlements):
   - Subscription tiers: Free, Plus (Graha), Premium (Rishi)
   - One-time purchases: individual reports, compatibility reading
   - Feature flags per tier
   - Plan-aware UI flags

   Tiers & Features:
   ┌──────────┬──────────────────────────────────────────────┐
   │ Free     │ onboarding reveal, daily insight, 1 ask/day, │
   │          │ basic chart summary                           │
   ├──────────┼──────────────────────────────────────────────┤
   │ Plus     │ 30 asks/month, saved history, fuller         │
   │ (Graha)  │ explanations, weekly guidance, career +      │
   │          │ wealth reports                                │
   ├──────────┼──────────────────────────────────────────────┤
   │ Premium  │ unlimited asks, deeper timing, compatibility,│
   │ (Rishi)  │ annual forecast, all premium reports         │
   ├──────────┼──────────────────────────────────────────────┤
   │ One-time │ individual report purchases, PDF export      │
   └──────────┴──────────────────────────────────────────────┘
   ════════════════════════════════════════════════════════ */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

/* ────────────────────────────────────────────────────
   FEATURE FLAGS — What each tier unlocks
   ──────────────────────────────────────────────────── */
export type Feature =
  | "daily_insight"
  | "basic_chart"
  | "ask_question"
  | "saved_history"
  | "fuller_explanations"
  | "weekly_guidance"
  | "deeper_timing"
  | "compatibility"
  | "annual_forecast"
  | "premium_reports"
  | "unlimited_asks"
  | "pdf_export"
  | "report_career"
  | "report_wealth"
  | "report_love"
  | "report_marriage_timing"
  | "report_dasha"
  | "report_annual"
  | "report_kundli_match"

export type PlanTier = "free" | "plus" | "premium"

const TIER_FEATURES: Record<PlanTier, Feature[]> = {
  free: [
    "daily_insight",
    "basic_chart",
    "ask_question",
  ],
  plus: [
    "daily_insight",
    "basic_chart",
    "ask_question",
    "saved_history",
    "fuller_explanations",
    "weekly_guidance",
    "report_career",
    "report_wealth",
    "pdf_export",
  ],
  premium: [
    "daily_insight",
    "basic_chart",
    "ask_question",
    "saved_history",
    "fuller_explanations",
    "weekly_guidance",
    "deeper_timing",
    "compatibility",
    "annual_forecast",
    "premium_reports",
    "unlimited_asks",
    "pdf_export",
    "report_career",
    "report_wealth",
    "report_love",
    "report_marriage_timing",
    "report_dasha",
    "report_annual",
    "report_kundli_match",
  ],
}

// Map report IDs to required features
const REPORT_FEATURE_MAP: Record<string, Feature> = {
  "career-blueprint": "report_career",
  "wealth-growth": "report_wealth",
  "love-compat": "report_love",
  "marriage-timing": "report_marriage_timing",
  "dasha-deep-dive": "report_dasha",
  "annual-forecast": "report_annual",
  "kundli-match": "report_kundli_match",
}

/* ────────────────────────────────────────────────────
   USER ENTITLEMENTS — Full access check result
   ──────────────────────────────────────────────────── */
export interface UserEntitlements {
  tier: PlanTier
  features: Feature[]
  oneTimePurchases: string[]  // product IDs of one-time purchases
  isActive: boolean           // subscription active?
  expiresAt: string | null
}

/* ────────────────────────────────────────────────────
   GET USER ENTITLEMENTS — Full entitlement check
   ──────────────────────────────────────────────────── */
export async function getUserEntitlements(userId: string): Promise<UserEntitlements> {
  const sb = getSupabase()

  // Default to free tier
  let tier: PlanTier = "free"
  let expiresAt: string | null = null

  try {
    // 1. Get subscription tier from profile
    const { data: profile } = await sb
      .from("profiles")
      .select("subscription_tier, plan")
      .eq("id", userId)
      .single()

    if (profile) {
      const planValue = profile.subscription_tier || profile.plan || "free"
      if (planValue === "plus" || planValue === "premium") {
        tier = planValue as PlanTier
      }
    }

    // 2. Check active subscription entitlements (may override profile)
    const { data: activeSubs } = await sb
      .from("entitlements")
      .select("plan, product_id, status, expires_at")
      .eq("user_id", userId)
      .eq("type", "subscription")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)

    if (activeSubs && activeSubs.length > 0) {
      const sub = activeSubs[0]
      if (sub.plan === "premium" || sub.product_id?.includes("premium")) {
        tier = "premium"
      } else if (sub.plan === "plus" || sub.product_id?.includes("plus")) {
        tier = tier === "premium" ? "premium" : "plus"
      }
      expiresAt = sub.expires_at
    }

    // 3. Get one-time purchases
    const { data: purchases } = await sb
      .from("entitlements")
      .select("product_id")
      .eq("user_id", userId)
      .eq("type", "one_time")
      .eq("status", "active")

    const oneTimePurchases = purchases?.map((p) => p.product_id) || []

    // 4. Build feature list
    const tierFeatures = TIER_FEATURES[tier] || TIER_FEATURES.free

    return {
      tier,
      features: tierFeatures,
      oneTimePurchases,
      isActive: tier !== "free",
      expiresAt,
    }
  } catch (err) {
    console.warn("Failed to get entitlements:", err)
    return {
      tier: "free",
      features: TIER_FEATURES.free,
      oneTimePurchases: [],
      isActive: false,
      expiresAt: null,
    }
  }
}

/* ────────────────────────────────────────────────────
   HAS FEATURE — Quick boolean check
   ──────────────────────────────────────────────────── */
export async function hasFeature(userId: string, feature: Feature): Promise<boolean> {
  const entitlements = await getUserEntitlements(userId)
  return entitlements.features.includes(feature)
}

/* ────────────────────────────────────────────────────
   CAN ACCESS REPORT — Check if user can view a report
   ──────────────────────────────────────────────────── */
export async function canAccessReport(
  userId: string,
  reportId: string
): Promise<{ allowed: boolean; reason?: string; requiredTier?: PlanTier }> {
  const entitlements = await getUserEntitlements(userId)

  // Check one-time purchase first
  if (entitlements.oneTimePurchases.includes(reportId)) {
    return { allowed: true }
  }

  // Check feature flag
  const requiredFeature = REPORT_FEATURE_MAP[reportId]
  if (!requiredFeature) {
    // Unknown report — allow by default (might be free)
    return { allowed: true }
  }

  if (entitlements.features.includes(requiredFeature)) {
    return { allowed: true }
  }

  // Determine required tier
  let requiredTier: PlanTier = "premium"
  if (TIER_FEATURES.plus.includes(requiredFeature)) {
    requiredTier = "plus"
  }

  return {
    allowed: false,
    reason: `This report requires ${requiredTier === "plus" ? "Graha" : "Rishi"} plan`,
    requiredTier,
  }
}

/* ────────────────────────────────────────────────────
   SHOULD SHOW UPSELL — Smart upsell timing
   Per Section 14: show after high-intent moments
   ──────────────────────────────────────────────────── */
export function shouldShowUpsell(
  tier: PlanTier,
  context: {
    questionCount?: number
    isFollowUp?: boolean
    followUpType?: string
    hasViewedSource?: boolean
  }
): { show: boolean; trigger?: string } {
  // Never upsell premium users
  if (tier === "premium") return { show: false }

  // High-intent follow-up signals (Section 14)
  const highIntentFollowUps = [
    "tell me more",
    "when does this change",
    "why does this keep repeating",
    "compare me with someone",
    "show full year",
  ]

  if (context.isFollowUp && context.followUpType) {
    const isHighIntent = highIntentFollowUps.some(
      (f) => context.followUpType!.toLowerCase().includes(f)
    )
    if (isHighIntent) {
      return { show: true, trigger: "high_intent_followup" }
    }
  }

  // After 3+ questions in free tier
  if (tier === "free" && (context.questionCount || 0) >= 3) {
    return { show: true, trigger: "question_limit_approaching" }
  }

  // After viewing source (engaged user)
  if (tier === "free" && context.hasViewedSource) {
    return { show: true, trigger: "source_engaged" }
  }

  return { show: false }
}

export { TIER_FEATURES, REPORT_FEATURE_MAP }
