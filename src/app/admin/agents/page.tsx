"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  Bot,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Wrench,
  MessageSquare,
  Network,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Star,
  Compass,
  Sparkles,
} from "lucide-react"

/* ════════════════════════════════════════════════════════
   AGENT ANALYTICS DASHBOARD
   Real-time monitoring for all 28 GrahAI agents
   ════════════════════════════════════════════════════════ */

interface AgentSummary {
  total_requests: number
  successful_requests: number
  avg_response_time_ms: number
  days_active: number
}

interface DelegationEntry {
  from_agent: string
  to_agent: string
  task_type: string
  status: string
  created_at: string
  input_data: { message?: string; vertical?: string }
}

interface HierarchyAgent {
  agent_name: string
  display_name: string
  role: string
  department: string
  vertical: string
  parent_agent_id: string | null
  status: string
  capabilities: string[] | null
}

interface SubAgentRoute {
  subAgent: string
  displayName: string
  description: string
}

interface DailyMetric {
  agent_name: string
  department: string
  metric_date: string
  total_requests: number
  successful_requests: number
  avg_response_time_ms: number
}

interface DashboardData {
  period: { days: number; since: string }
  agents: {
    summary: Record<string, AgentSummary>
    hierarchy: HierarchyAgent[]
    subAgents: Record<string, SubAgentRoute[]>
  }
  conversations: {
    total: number
    byVertical: Record<string, number>
  }
  tools: {
    usage: Record<string, number>
    totalExecutions: number
  }
  delegations: {
    total: number
    routes: Record<string, number>
    recent: DelegationEntry[]
  }
  metrics: {
    daily: DailyMetric[]
  }
}

const VERTICAL_ICONS: Record<string, typeof Sun> = {
  astrology: Sun,
  numerology: BarChart3,
  tarot: Star,
  vastu: Compass,
  general: Sparkles,
}

const VERTICAL_COLORS: Record<string, string> = {
  astrology: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  numerology: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
  tarot: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
  vastu: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
  general: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
}

const VERTICAL_TEXT: Record<string, string> = {
  astrology: "text-amber-400",
  numerology: "text-purple-400",
  tarot: "text-indigo-400",
  vastu: "text-emerald-400",
  general: "text-rose-400",
}

export default function AgentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [days, setDays] = useState(7)
  const [expandedVertical, setExpandedVertical] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "tools" | "delegations" | "hierarchy">("overview")

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/agents?days=${days}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Activity className="w-8 h-8 text-amber-400" />
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white/70">{error}</p>
          <button onClick={fetchData} className="mt-4 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const totalRequests = Object.values(data.agents.summary).reduce((a, b) => a + b.total_requests, 0)
  const totalSuccess = Object.values(data.agents.summary).reduce((a, b) => a + b.successful_requests, 0)
  const successRate = totalRequests > 0 ? Math.round((totalSuccess / totalRequests) * 100) : 0
  const avgResponseTime = totalRequests > 0
    ? Math.round(Object.values(data.agents.summary).reduce((a, b) => a + b.avg_response_time_ms * b.total_requests, 0) / totalRequests)
    : 0

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-7 h-7 text-amber-400" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Agent Command Center
              </h1>
              <p className="text-xs text-white/40">28 agents • {data.period.days}-day window</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Period selector */}
            <div className="flex bg-white/5 rounded-lg p-1 gap-1">
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-3 py-1.5 text-xs rounded-md transition ${
                    days === d
                      ? "bg-amber-500/20 text-amber-400"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>

            <button
              onClick={fetchData}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-white/60 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard
            label="Total Requests"
            value={totalRequests.toLocaleString()}
            icon={<MessageSquare className="w-5 h-5" />}
            color="text-blue-400"
            bgColor="from-blue-500/10 to-blue-500/5"
          />
          <KPICard
            label="Success Rate"
            value={`${successRate}%`}
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="text-emerald-400"
            bgColor="from-emerald-500/10 to-emerald-500/5"
          />
          <KPICard
            label="Avg Response"
            value={`${(avgResponseTime / 1000).toFixed(1)}s`}
            icon={<Clock className="w-5 h-5" />}
            color="text-amber-400"
            bgColor="from-amber-500/10 to-amber-500/5"
          />
          <KPICard
            label="Delegations"
            value={data.delegations.total.toLocaleString()}
            icon={<Network className="w-5 h-5" />}
            color="text-purple-400"
            bgColor="from-purple-500/10 to-purple-500/5"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-white/10 pb-px">
          {(["overview", "tools", "delegations", "hierarchy"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition ${
                activeTab === tab
                  ? "bg-white/10 text-white border-b-2 border-amber-400"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Conversations by Vertical */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {["astrology", "numerology", "tarot", "vastu", "general"].map((v) => {
                  const Icon = VERTICAL_ICONS[v] || Sparkles
                  const count = data.conversations.byVertical[v] || 0
                  const pct = data.conversations.total > 0
                    ? Math.round((count / data.conversations.total) * 100)
                    : 0

                  return (
                    <motion.div
                      key={v}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setExpandedVertical(expandedVertical === v ? null : v)}
                      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 cursor-pointer transition-all ${VERTICAL_COLORS[v]}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Icon className={`w-5 h-5 ${VERTICAL_TEXT[v]}`} />
                        {expandedVertical === v ? (
                          <ChevronUp className="w-4 h-4 text-white/40" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-white/40" />
                        )}
                      </div>
                      <p className="text-2xl font-bold text-white">{count}</p>
                      <p className="text-xs text-white/50 capitalize">{v}</p>
                      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${VERTICAL_COLORS[v].split("border")[0]}`}
                          style={{ width: `${pct}%`, minWidth: count > 0 ? "4px" : "0" }}
                        />
                      </div>
                      <p className="text-[10px] text-white/30 mt-1">{pct}% of total</p>

                      {/* Expanded sub-agents */}
                      <AnimatePresence>
                        {expandedVertical === v && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 border-t border-white/10 pt-3 space-y-2"
                          >
                            {(data.agents.subAgents[v] || []).map((sa) => (
                              <div key={sa.subAgent} className="flex items-center gap-2 text-xs">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                                <span className="text-white/60">{sa.displayName}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>

              {/* Agent Performance Table */}
              <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white/80">Agent Performance</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-white/40 text-xs uppercase tracking-wider">
                        <th className="text-left px-5 py-3">Agent</th>
                        <th className="text-right px-5 py-3">Requests</th>
                        <th className="text-right px-5 py-3">Success</th>
                        <th className="text-right px-5 py-3">Avg Time</th>
                        <th className="text-right px-5 py-3">Days Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(data.agents.summary)
                        .sort(([, a], [, b]) => b.total_requests - a.total_requests)
                        .map(([agent, stats]) => {
                          const rate = stats.total_requests > 0
                            ? Math.round((stats.successful_requests / stats.total_requests) * 100)
                            : 0
                          return (
                            <tr key={agent} className="border-t border-white/5 hover:bg-white/5 transition">
                              <td className="px-5 py-3 font-medium text-white/80">{agent}</td>
                              <td className="px-5 py-3 text-right text-white/60">{stats.total_requests}</td>
                              <td className="px-5 py-3 text-right">
                                <span className={rate >= 90 ? "text-emerald-400" : rate >= 70 ? "text-amber-400" : "text-red-400"}>
                                  {rate}%
                                </span>
                              </td>
                              <td className="px-5 py-3 text-right text-white/60">
                                {(stats.avg_response_time_ms / 1000).toFixed(1)}s
                              </td>
                              <td className="px-5 py-3 text-right text-white/40">{stats.days_active}</td>
                            </tr>
                          )
                        })}
                      {Object.keys(data.agents.summary).length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center text-white/30">
                            No agent metrics recorded yet. Start chatting to generate data.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "tools" && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="bg-white/5 rounded-xl border border-white/10 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white/80">
                    Tool Usage ({data.tools.totalExecutions} total executions)
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(data.tools.usage)
                    .sort(([, a], [, b]) => b - a)
                    .map(([tool, count]) => {
                      const maxCount = Math.max(...Object.values(data.tools.usage), 1)
                      const pct = Math.round((count / maxCount) * 100)
                      return (
                        <div key={tool} className="flex items-center gap-3">
                          <div className="w-40 text-xs text-white/60 truncate font-mono">{tool}</div>
                          <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="h-full rounded-full bg-gradient-to-r from-amber-500/40 to-orange-500/40"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white/50">
                              {count}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  {Object.keys(data.tools.usage).length === 0 && (
                    <p className="text-white/30 text-sm col-span-2 text-center py-6">
                      No tool executions recorded yet.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "delegations" && (
            <motion.div
              key="delegations"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Delegation Routes Summary */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Network className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-semibold text-white/80">Delegation Routes</h3>
                </div>
                <div className="space-y-2">
                  {Object.entries(data.delegations.routes)
                    .sort(([, a], [, b]) => b - a)
                    .map(([route, count]) => (
                      <div key={route} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-2 text-sm text-white/70 flex-1">
                          <span>{route.split(" → ")[0]}</span>
                          <ArrowRight className="w-3 h-3 text-amber-400/60" />
                          <span className="text-amber-400/80">{route.split(" → ")[1]}</span>
                        </div>
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/50">
                          {count}x
                        </span>
                      </div>
                    ))}
                  {Object.keys(data.delegations.routes).length === 0 && (
                    <p className="text-white/30 text-sm text-center py-6">
                      No delegations recorded yet. Sub-agents will appear here once queries are routed.
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Delegations */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-5">
                <h3 className="text-sm font-semibold text-white/80 mb-4">Recent Delegations</h3>
                <div className="space-y-3">
                  {data.delegations.recent.map((d, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                      <div className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-purple-400/60" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <span>{d.from_agent}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span className="text-purple-400/80">{d.to_agent}</span>
                          <span className="ml-auto">{new Date(d.created_at).toLocaleString()}</span>
                        </div>
                        {d.input_data?.message && (
                          <p className="text-xs text-white/30 mt-1 truncate">{d.input_data.message}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {data.delegations.recent.length === 0 && (
                    <p className="text-white/30 text-sm text-center py-6">No recent delegations.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "hierarchy" && (
            <motion.div
              key="hierarchy"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {["general", "astrology", "numerology", "tarot", "vastu"].map((vertical) => {
                const Icon = VERTICAL_ICONS[vertical] || Sparkles
                const agents = (data.agents.hierarchy || []).filter(
                  (a) => a.vertical === vertical || a.department === vertical
                )
                const subAgents = data.agents.subAgents[vertical] || []

                return (
                  <div
                    key={vertical}
                    className={`rounded-xl border bg-gradient-to-br p-5 ${VERTICAL_COLORS[vertical]}`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Icon className={`w-5 h-5 ${VERTICAL_TEXT[vertical]}`} />
                      <h3 className={`text-sm font-bold uppercase tracking-wider ${VERTICAL_TEXT[vertical]}`}>
                        {vertical} Department
                      </h3>
                      <span className="text-[10px] text-white/30 bg-white/10 px-2 py-0.5 rounded-full ml-auto">
                        {agents.length} in DB + {subAgents.length} sub-agents
                      </span>
                    </div>

                    {/* DB Agents */}
                    {agents.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {agents.map((a) => (
                          <div key={a.agent_name} className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-white/5">
                            <Bot className="w-3.5 h-3.5 text-white/40" />
                            <span className="text-sm text-white/70">{a.display_name || a.agent_name}</span>
                            <span className="text-[10px] text-white/30 font-mono">{a.role}</span>
                            <span className={`text-[10px] ml-auto px-1.5 py-0.5 rounded ${
                              a.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/30"
                            }`}>
                              {a.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sub-agents */}
                    {subAgents.length > 0 && (
                      <div className="border-t border-white/10 pt-3 space-y-2">
                        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Sub-Agent Delegation Routes</p>
                        {subAgents.map((sa) => (
                          <div key={sa.subAgent} className="flex items-start gap-3 py-1.5 px-3 rounded-lg bg-white/5">
                            <Zap className="w-3 h-3 text-amber-400/50 mt-0.5" />
                            <div>
                              <span className="text-xs text-white/60">{sa.displayName}</span>
                              <p className="text-[10px] text-white/30">{sa.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {agents.length === 0 && subAgents.length === 0 && (
                      <p className="text-xs text-white/30">No agents registered for this department.</p>
                    )}
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────
   KPI CARD — Reusable stat card component
   ──────────────────────────────────────────────────── */
function KPICard({
  label,
  value,
  icon,
  color,
  bgColor,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: string
  bgColor: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-xl border border-white/10 bg-gradient-to-br ${bgColor} p-4`}
    >
      <div className={`mb-2 ${color}`}>{icon}</div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/40">{label}</p>
    </motion.div>
  )
}
