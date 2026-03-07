---
description: "Develop and modify GrahAI AI agents — system prompts, tool definitions, vertical specialists, memory system, metrics tracking"
allowed-tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
---

# GrahAI Agent Development Skill

## Architecture Overview

GrahAI uses a **28-agent hierarchy** across 5 departments, all stored in Supabase `agent_hierarchy` and `agent_prompt_versions` tables.

```
CEO Orchestrator (routes all queries)
├── Astrology Department (6 agents)
│   └── Jyotish Guru (head) → Chart Calculator, Dasha Analyst, Yoga Expert, Transit Tracker, QA Reviewer
├── Numerology Department (5 agents)
│   └── Anka Vidya (head) → Life Path Calculator, Name Analyst, Cycle Tracker, Prediction Engine
├── Tarot Department (5 agents)
│   └── Tarot Reader (head) → Card Interpreter, Spread Analyst, Energy Reader, Journal Keeper
├── Vastu Department (5 agents)
│   └── Vastu Acharya (head) → Direction Analyst, Element Balancer, Remedy Advisor, Space Planner
└── General Department (6 agents)
    └── CEO Orchestrator → Router, Summarizer, Memory Manager, Feedback Handler, QA Lead
```

## Key Files

| File | Purpose |
|------|---------|
| `src/app/api/chat/route.ts` | Streaming SSE chat API with tool-use loop |
| `src/lib/agents/prompt-loader.ts` | Dynamic prompt loading from DB (5-min cache) |
| `src/lib/agents/memory.ts` | Memory retrieval + birth data extraction |
| `src/lib/agents/metrics.ts` | Agent performance tracking |
| `src/lib/agents/tools/index.ts` | Central tool registry + dispatcher |
| `src/lib/agents/tools/astrology-tools.ts` | Kundli, Dasha, Yoga, chart retrieval tools |
| `src/lib/agents/tools/numerology-tools.ts` | Life path, name numbers, personal year tools |
| `src/lib/agents/tools/tarot-tools.ts` | Card draw, details lookup, reading save tools |
| `src/lib/agents/tools/vastu-tools.ts` | Direction analysis, element balance, assessment tools |

## How to Add a New Tool

### 1. Define the tool schema

Create or edit `src/lib/agents/tools/{vertical}-tools.ts`:

```typescript
import type { Tool } from "@anthropic-ai/sdk/resources/messages"

export const MY_TOOL_DEFINITIONS: Tool[] = [
  {
    name: "my_tool_name",           // snake_case, unique across all verticals
    description: "What this tool does — be specific for Claude to know when to use it",
    input_schema: {
      type: "object" as const,
      properties: {
        param1: { type: "string", description: "..." },
        param2: { type: "number", description: "..." },
      },
      required: ["param1"],
    },
  },
]
```

### 2. Implement the executor

```typescript
export async function executeMyTool(
  toolName: string,
  input: Record<string, unknown>,
  userId?: string
): Promise<unknown> {
  switch (toolName) {
    case "my_tool_name":
      return await myToolLogic(input as { param1: string; param2?: number }, userId)
    default:
      return { error: `Unknown tool: ${toolName}` }
  }
}
```

### 3. Register in tools/index.ts

```typescript
import { MY_TOOL_DEFINITIONS, executeMyTool } from "./my-tools"

// Add to VERTICAL_TOOLS:
const VERTICAL_TOOLS: Record<string, Tool[]> = {
  my_vertical: MY_TOOL_DEFINITIONS,
  // ... existing
}

// Add to executeToolCall switch:
case "my_vertical":
  return await executeMyTool(toolName, toolInput, userId)

// Add to TOOL_DISPLAY_INFO:
my_tool_name: {
  label: "Tool Label",
  icon: "🔧",
  description: "User-facing description shown during execution...",
},
```

## Modifying System Prompts

**NEVER hardcode system prompts** in route.ts. All prompts live in the `agent_prompt_versions` Supabase table.

To update a prompt:
```sql
-- Deactivate old version
UPDATE agent_prompt_versions SET is_active = false WHERE agent_name = 'jyotish_guru' AND is_active = true;

-- Insert new version
INSERT INTO agent_prompt_versions (agent_name, version, system_prompt, is_active)
VALUES ('jyotish_guru', 2, 'Your new prompt here...', true);
```

The `prompt-loader.ts` has a 5-minute TTL cache. Changes take effect within 5 minutes of DB update.

### Agent Name Mapping
| Vertical | Agent Name | Display Name |
|----------|-----------|--------------|
| astrology | jyotish_guru | Jyotish Guru |
| numerology | anka_vidya | Anka Vidya |
| tarot | tarot_reader | Tarot Reader |
| vastu | vastu_acharya | Vastu Acharya |
| general | ceo_orchestrator | GrahAI |

## Streaming Architecture

The chat API uses **Server-Sent Events (SSE)** with these event types:

| Event | Payload | When |
|-------|---------|------|
| `meta` | `{ conversation_id, vertical, agent_name }` | Start of response |
| `text_delta` | `{ text: "chunk" }` | Each ~50 char chunk of response |
| `tool_start` | `{ tool_name, tool_id, label, icon, description }` | Tool execution begins |
| `tool_result` | `{ tool_name, tool_id, success }` | Tool execution completes |
| `message_stop` | `{ conversation_id, agent_name, vertical, tools_used }` | Response complete |
| `error` | `{ message }` | Error occurred |

### Tool-Use Loop
When Claude returns `stop_reason: "tool_use"`, the API:
1. Executes the tool server-side
2. Feeds the result back as a `tool_result` message
3. Calls Claude again to continue generating
4. Repeats until `stop_reason: "end_turn"`

## Memory System

### Memory Types
- `birth_data` — auto-extracted from user messages (date, time, place)
- `preference` — user preferences noted during conversation
- `reading_history` — completed readings/analyses
- `astrological` / `numerological` / `tarot` / `vastu` — vertical-specific facts

### Auto Birth Data Extraction
`extractAndSaveBirthData()` runs fire-and-forget on every message, using regex patterns to detect:
- Date patterns (DD/MM/YYYY, "March 15, 1995", etc.)
- Time patterns (10:30 AM, 22:30, etc.)
- City names (after keywords like "born in", "from", "at")

### Memory Retrieval
`getRelevantMemories()` fetches top memories by `importance DESC, last_accessed_at DESC` and formats them as a context block prepended to the system prompt.

## Testing Checklist
- [ ] Each vertical correctly detects from user message (regex in `detectVertical()`)
- [ ] System prompts load from DB (check `agent_prompt_versions` has active rows)
- [ ] Tool execution works for each vertical (test all 14 tools)
- [ ] Streaming renders token-by-token in chat UI
- [ ] Tool indicators show during execution and disappear after completion
- [ ] Conversation history persists across messages
- [ ] Memories are saved and retrieved for returning users
- [ ] Metrics are tracked in `agent_metrics` table

## TypeScript Patterns

- All tool inputs typed with explicit interfaces
- Use `Record<string, unknown>` for generic tool input, cast inside executor
- Supabase client created per-request (not global) via `getSupabase()`
- Fire-and-forget patterns use `.catch(() => {})` to prevent unhandled rejections
- Model: `claude-sonnet-4-20250514`, max_tokens: 4096
