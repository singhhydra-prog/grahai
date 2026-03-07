import { createClient } from "@supabase/supabase-js"

/* ────────────────────────────────────────────────────
   AGENT METRICS — Performance tracking per agent/day
   Tracks response times, success rates, token usage
   ──────────────────────────────────────────────────── */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

/* ────────────────────────────────────────────────────
   TRACK AGENT METRICS — Upsert daily metrics row
   ──────────────────────────────────────────────────── */
export async function trackAgentMetrics(
  agentName: string,
  department: string,
  responseTimeMs: number,
  success: boolean
): Promise<void> {
  const sb = getSupabase()
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD

  try {
    // Check if row exists for today
    const { data: existing } = await sb
      .from("agent_metrics")
      .select("id, total_requests, successful_requests, avg_response_time_ms")
      .eq("agent_name", agentName)
      .eq("metric_date", today)
      .single()

    if (existing) {
      // Update existing row with running averages
      const newTotal = (existing.total_requests || 0) + 1
      const newSuccess = (existing.successful_requests || 0) + (success ? 1 : 0)
      const oldAvg = existing.avg_response_time_ms || 0
      const newAvg = Math.round((oldAvg * (newTotal - 1) + responseTimeMs) / newTotal)

      await sb
        .from("agent_metrics")
        .update({
          total_requests: newTotal,
          successful_requests: newSuccess,
          avg_response_time_ms: newAvg,
        })
        .eq("id", existing.id)
    } else {
      // Insert new row for today
      await sb.from("agent_metrics").insert({
        agent_name: agentName,
        department,
        metric_date: today,
        total_requests: 1,
        successful_requests: success ? 1 : 0,
        avg_response_time_ms: Math.round(responseTimeMs),
        avg_satisfaction_score: 0,
        learnings_generated: 0,
        learnings_approved: 0,
        learnings_applied: 0,
        prompt_version: 1,
      })
    }
  } catch (err) {
    // Metrics should never block the main flow
    console.warn("Failed to track agent metrics:", err)
  }
}

/* ────────────────────────────────────────────────────
   UPDATE PROMPT INTERACTION COUNT
   ──────────────────────────────────────────────────── */
export async function incrementPromptInteractions(agentName: string): Promise<void> {
  const sb = getSupabase()

  try {
    const { data } = await sb
      .from("agent_prompt_versions")
      .select("id, total_interactions")
      .eq("agent_name", agentName)
      .eq("is_active", true)
      .single()

    if (data) {
      await sb
        .from("agent_prompt_versions")
        .update({ total_interactions: (data.total_interactions || 0) + 1 })
        .eq("id", data.id)
    }
  } catch (err) {
    console.warn("Failed to increment interactions:", err)
  }
}
