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
| `src/lib/agents/tools/astrology-tools.ts` | 7 tools: kundli, dasha, yoga, divisional, transit, remedies, report |
| `src/lib/agents/tools/numerology-tools.ts` | 4 tools: life path, name numbers, personal year, save profile |
| `src/lib/agents/tools/tarot-tools.ts` | 3 tools: draw cards, card meaning, save reading |
| `src/lib/agents/tools/vastu-tools.ts` | 3 tools: analyze vastu, remedies, save assessment |
| `src/lib/ethics-guardrails.ts` | Content safety filter (hard blocks + soft transforms) |

## Tool Registry (17 total)

**Astrology (7):** `calculate_kundli`, `get_dasha_periods`, `analyze_yogas`, `get_divisional_chart`, `get_transit_effects`, `get_remedies`, `generate_report`
**Numerology (4):** `calculate_life_path`, `calculate_name_numbers`, `calculate_personal_year`, `save_numerology_profile`
**Tarot (3):** `draw_tarot_cards`, `get_card_meaning`, `save_tarot_reading`
**Vastu (3):** `analyze_vastu`, `get_vastu_remedies`, `save_vastu_assessment`

## How to Add a New Tool

### 1. Define the tool schema

In `src/lib/agents/tools/{vertical}-tools.ts`:

```typescript
import type { Tool } from "@anthropic-ai/sdk/resources/messages"

export const MY_TOOL_DEFINITIONS: Tool[] = [
  {
    name: "my_tool_name",           // snake_case, globally unique
    description: "What this tool does — be specific for Claude",
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
      return await myToolLogic(input as MyToolInput, userId)
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
}

// Add to executeToolCall switch case:
case "my_vertical":
  return await executeMyTool(toolName, toolInput, userId)
```

### 4. Rules

- Tool names: `snake_case`, globally unique across all verticals
- Always return structured JSON (never plain strings)
- Include `userId` parameter for any DB operations
- Handle errors gracefully — return `{ error: "message" }` not throw

## Modifying System Prompts

**NEVER hardcode system prompts** in route.ts. All prompts live in `agent_prompt_versions` table.

```sql
-- Deactivate old version
UPDATE agent_prompt_versions SET is_active = false
WHERE agent_name = 'jyotish_guru' AND is_active = true;

-- Insert new version
INSERT INTO agent_prompt_versions (agent_name, version, system_prompt, is_active)
VALUES ('jyotish_guru', 2, 'Your new prompt here...', true);
```

Cache TTL: 5 minutes. Changes take effect within 5 minutes of DB update.

### Agent Name Mapping

| Vertical | Agent Name | Display Name |
|----------|-----------|--------------|
| astrology | jyotish_guru | Jyotish Guru |
| numerology | anka_vidya | Anka Vidya |
| tarot | tarot_reader | Tarot Reader |
| vastu | vastu_acharya | Vastu Acharya |
| general | ceo_orchestrator | GrahAI |

## Streaming Architecture (SSE)

The chat API returns Server-Sent Events:

| Event | Payload | When |
|-------|---------|------|
| `meta` | `{ conversation_id, vertical, agent_name }` | Start of response |
| `text_delta` | `{ text: "chunk" }` | Each token chunk |
| `tool_start` | `{ tool_name, tool_id, label, icon, description }` | Tool begins |
| `tool_result` | `{ tool_name, tool_id, success }` | Tool completes |
| `message_stop` | `{ conversation_id, agent_name, vertical, tools_used }` | Response done |
| `error` | `{ message }` | Error occurred |

### Tool-Use Loop

When Claude returns `stop_reason: "tool_use"`:
1. Execute the tool server-side
2. Feed result back as `tool_result` message
3. Call Claude again to continue generating
4. Repeat until `stop_reason: "end_turn"`

## Memory System

### Memory Types
- `birth_data` — auto-extracted from user messages (date, time, place)
- `preference` — user preferences noted during conversation
- `reading_history` — completed readings/analyses
- Vertical-specific: `astrological`, `numerological`, `tarot`, `vastu`

### Auto Birth Data Extraction
`extractAndSaveBirthData()` runs fire-and-forget on every message, using regex to detect dates, times, and city names.

### Memory Retrieval
`getRelevantMemories()` fetches top memories by `importance DESC, last_accessed_at DESC`, formats as context block prepended to system prompt.

## Ethics Guardrails

Every AI response passes through `src/lib/ethics-guardrails.ts`:

- **Hard blocks:** Fatalistic doom, medical misinformation, financial manipulation, relationship coercion, caste discrimination
- **Soft transforms:** "you will never" → "current patterns suggest challenges in"
- **Severity:** none, low, medium, high

## Testing Checklist

- [ ] Each vertical detects correctly from user messages
- [ ] System prompts load from DB (check `agent_prompt_versions` has active rows)
- [ ] All 17 tools execute and return structured data
- [ ] Streaming renders token-by-token in chat UI
- [ ] Tool indicators show/hide correctly
- [ ] Conversation history persists
- [ ] Memories save and retrieve
- [ ] Metrics tracked in `agent_metrics`
- [ ] Ethics guardrails block fatalistic predictions
