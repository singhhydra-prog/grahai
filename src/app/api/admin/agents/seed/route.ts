import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { AGENT_REGISTRY, getRegistryStats } from "@/lib/agents/registry"

/**
 * POST /api/admin/agents/seed
 * Syncs the full agent registry to the agent_hierarchy table.
 * Upserts all agents — safe to call multiple times.
 */
export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  // Map registry to DB schema
  const rows = AGENT_REGISTRY.map(agent => ({
    agent_name: agent.agent_name,
    display_name: agent.display_name,
    role: agent.role,
    department: agent.department,
    vertical: agent.vertical,
    parent_agent_id: agent.parent_agent,
    status: agent.status,
    capabilities: agent.capabilities,
    description: agent.description,
    metadata: {
      emoji: agent.emoji,
      systemPromptKey: agent.systemPromptKey,
    },
  }))

  // Upsert all agents (keyed on agent_name)
  const { data, error } = await supabase
    .from("agent_hierarchy")
    .upsert(rows, { onConflict: "agent_name" })
    .select("agent_name")

  if (error) {
    // If table doesn't exist, create it first
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      return NextResponse.json({
        error: "agent_hierarchy table not found. Run the migration first.",
        migration: MIGRATION_SQL,
      }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const stats = getRegistryStats()

  return NextResponse.json({
    success: true,
    message: `Synced ${rows.length} agents to database`,
    stats,
    agents_synced: data?.length ?? rows.length,
  })
}

export async function GET() {
  return NextResponse.json({
    stats: getRegistryStats(),
    registry: AGENT_REGISTRY.map(a => ({
      name: a.agent_name,
      display: a.display_name,
      role: a.role,
      department: a.department,
      parent: a.parent_agent,
      status: a.status,
      emoji: a.emoji,
    })),
  })
}

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS agent_hierarchy (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('ceo', 'department_head', 'sub_agent')),
  department text NOT NULL,
  vertical text NOT NULL,
  parent_agent_id text REFERENCES agent_hierarchy(agent_name) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'beta', 'planned')),
  capabilities text[] DEFAULT '{}',
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_hierarchy_department ON agent_hierarchy(department);
CREATE INDEX IF NOT EXISTS idx_agent_hierarchy_parent ON agent_hierarchy(parent_agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_hierarchy_status ON agent_hierarchy(status);
`
