import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { getAllSubAgents } from "@/lib/agents/delegation"

/* ════════════════════════════════════════════════════════
   AGENT ANALYTICS API — Returns metrics, delegations,
   conversation stats, and tool usage for the dashboard
   Protected: Only admin users can access this endpoint
   ════════════════════════════════════════════════════════ */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

/* Admin emails allowed to access this dashboard */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "singhhydra@gmail.com").split(",").map(e => e.trim().toLowerCase())

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function GET(req: NextRequest) {
  try {
    /* ── Auth guard: verify user is admin ── */
    const authClient = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll() { /* API route — no writes */ },
      },
    })

    const { data: { user }, error: authError } = await authClient.auth.getUser()
    if (authError || !user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const sb = getSupabase()
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get("days") || "7")
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    // Parallel fetch all dashboard data
    const [
      metricsRes,
      conversationsRes,
      delegationsRes,
      toolUsageRes,
      hierarchyRes,
    ] = await Promise.all([
      // 1. Agent metrics for the period
      sb
        .from("agent_metrics")
        .select("*")
        .gte("metric_date", since)
        .order("metric_date", { ascending: false }),

      // 2. Conversation counts by vertical
      sb
        .from("conversations")
        .select("vertical, status, created_at")
        .gte("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()),

      // 3. Delegation logs from agent_tasks
      sb
        .from("agent_tasks")
        .select("from_agent, to_agent, task_type, status, created_at, input_data")
        .eq("task_type", "delegation")
        .gte("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: false })
        .limit(100),

      // 4. Tool usage from message metadata
      sb
        .from("messages")
        .select("metadata, agent_name, created_at")
        .eq("role", "assistant")
        .not("metadata", "is", null)
        .gte("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: false })
        .limit(500),

      // 5. Agent hierarchy
      sb
        .from("agent_hierarchy")
        .select("agent_name, display_name, role, department, vertical, parent_agent_id, status, capabilities"),
    ])

    // Process metrics into summary
    const metrics = metricsRes.data || []
    const agentSummary: Record<string, {
      total_requests: number
      successful_requests: number
      avg_response_time_ms: number
      days_active: number
    }> = {}

    for (const m of metrics) {
      if (!agentSummary[m.agent_name]) {
        agentSummary[m.agent_name] = {
          total_requests: 0,
          successful_requests: 0,
          avg_response_time_ms: 0,
          days_active: 0,
        }
      }
      const s = agentSummary[m.agent_name]
      s.total_requests += m.total_requests || 0
      s.successful_requests += m.successful_requests || 0
      s.avg_response_time_ms += m.avg_response_time_ms || 0
      s.days_active += 1
    }

    // Calculate averages
    for (const key of Object.keys(agentSummary)) {
      const s = agentSummary[key]
      if (s.days_active > 0) {
        s.avg_response_time_ms = Math.round(s.avg_response_time_ms / s.days_active)
      }
    }

    // Process conversation stats
    const conversations = conversationsRes.data || []
    const verticalCounts: Record<string, number> = {}
    for (const c of conversations) {
      verticalCounts[c.vertical] = (verticalCounts[c.vertical] || 0) + 1
    }

    // Process tool usage from message metadata
    const toolMessages = toolUsageRes.data || []
    const toolCounts: Record<string, number> = {}
    for (const msg of toolMessages) {
      const meta = msg.metadata as Record<string, unknown> | null
      const toolsUsed = (meta?.tools_used as string[]) || []
      for (const tool of toolsUsed) {
        toolCounts[tool] = (toolCounts[tool] || 0) + 1
      }
    }

    // Process delegations
    const delegations = delegationsRes.data || []
    const delegationCounts: Record<string, number> = {}
    for (const d of delegations) {
      const key = `${d.from_agent} → ${d.to_agent}`
      delegationCounts[key] = (delegationCounts[key] || 0) + 1
    }

    // Sub-agent definitions
    const subAgents = getAllSubAgents()

    return NextResponse.json({
      period: { days, since },
      agents: {
        summary: agentSummary,
        hierarchy: hierarchyRes.data || [],
        subAgents,
      },
      conversations: {
        total: conversations.length,
        byVertical: verticalCounts,
      },
      tools: {
        usage: toolCounts,
        totalExecutions: Object.values(toolCounts).reduce((a, b) => a + b, 0),
      },
      delegations: {
        total: delegations.length,
        routes: delegationCounts,
        recent: delegations.slice(0, 20),
      },
      metrics: {
        daily: metrics,
      },
    })
  } catch (err) {
    console.error("Admin agents API error:", err)
    return NextResponse.json(
      { error: "Failed to fetch agent analytics" },
      { status: 500 }
    )
  }
}
