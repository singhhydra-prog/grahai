import type { Tool } from "@anthropic-ai/sdk/resources/messages"

import { ASTROLOGY_TOOL_DEFINITIONS, executeAstrologyTool } from "./astrology-tools"
import { NUMEROLOGY_TOOL_DEFINITIONS, executeNumerologyTool } from "./numerology-tools"
import { TAROT_TOOL_DEFINITIONS, executeTarotTool } from "./tarot-tools"
import { VASTU_TOOL_DEFINITIONS, executeVastuTool } from "./vastu-tools"

/* ────────────────────────────────────────────────────
   TOOL REGISTRY — Maps verticals to their tools
   Central dispatcher for all agent tool execution
   ──────────────────────────────────────────────────── */

// Map vertical names to their tool definitions
const VERTICAL_TOOLS: Record<string, Tool[]> = {
  astrology: ASTROLOGY_TOOL_DEFINITIONS,
  numerology: NUMEROLOGY_TOOL_DEFINITIONS,
  tarot: TAROT_TOOL_DEFINITIONS,
  vastu: VASTU_TOOL_DEFINITIONS,
  general: [], // CEO Orchestrator has no tools — it routes to specialists
}

// Map tool names to their vertical for reverse lookup
const TOOL_TO_VERTICAL: Record<string, string> = {}
for (const [vertical, tools] of Object.entries(VERTICAL_TOOLS)) {
  for (const tool of tools) {
    TOOL_TO_VERTICAL[tool.name] = vertical
  }
}

/* ────────────────────────────────────────────────────
   GET TOOLS FOR VERTICAL
   Returns Anthropic Tool[] for a given vertical
   ──────────────────────────────────────────────────── */
export function getToolsForVertical(vertical: string): Tool[] {
  return VERTICAL_TOOLS[vertical] || []
}

/* ────────────────────────────────────────────────────
   GET ALL TOOL NAMES
   Returns flat list of all registered tool names
   ──────────────────────────────────────────────────── */
export function getAllToolNames(): string[] {
  return Object.keys(TOOL_TO_VERTICAL)
}

/* ────────────────────────────────────────────────────
   EXECUTE TOOL CALL
   Central dispatcher — routes to correct vertical executor
   ──────────────────────────────────────────────────── */
export async function executeToolCall(
  toolName: string,
  toolInput: Record<string, unknown>,
  userId?: string
): Promise<unknown> {
  const vertical = TOOL_TO_VERTICAL[toolName]

  if (!vertical) {
    return { error: `Unknown tool: ${toolName}. Available tools: ${getAllToolNames().join(", ")}` }
  }

  try {
    switch (vertical) {
      case "astrology":
        return await executeAstrologyTool(toolName, toolInput, userId)
      case "numerology":
        return await executeNumerologyTool(toolName, toolInput, userId)
      case "tarot":
        return await executeTarotTool(toolName, toolInput, userId)
      case "vastu":
        return await executeVastuTool(toolName, toolInput, userId)
      default:
        return { error: `No executor for vertical: ${vertical}` }
    }
  } catch (err) {
    console.error(`Tool execution error [${toolName}]:`, err)
    return {
      error: `Tool execution failed: ${toolName}`,
      message: err instanceof Error ? err.message : "Unknown error",
    }
  }
}

/* ────────────────────────────────────────────────────
   TOOL METADATA — For UI indicators
   Maps tool names to user-friendly descriptions + icons
   ──────────────────────────────────────────────────── */
export const TOOL_DISPLAY_INFO: Record<string, { label: string; icon: string; description: string }> = {
  // Astrology
  calculate_kundli: {
    label: "Kundli Calculation",
    icon: "📊",
    description: "Computing planetary positions using Swiss Ephemeris...",
  },
  get_dasha_periods: {
    label: "Dasha Analysis",
    icon: "🔄",
    description: "Calculating Vimshottari Dasha periods (Maha + Antar)...",
  },
  analyze_yogas: {
    label: "Yoga Analysis",
    icon: "✨",
    description: "Detecting planetary yogas with BPHS references...",
  },
  get_divisional_chart: {
    label: "Divisional Chart",
    icon: "🔮",
    description: "Generating divisional chart (Varga)...",
  },
  get_transit_effects: {
    label: "Transit Analysis",
    icon: "🪐",
    description: "Analyzing current planetary transits (Gochar)...",
  },
  get_remedies: {
    label: "Remedies",
    icon: "💎",
    description: "Generating personalized Vedic remedies...",
  },
  generate_report: {
    label: "PDF Report",
    icon: "📄",
    description: "Generating professional Kundli PDF report...",
  },
  get_daily_insight: {
    label: "Daily Insight",
    icon: "🌅",
    description: "Computing today's personalized horoscope...",
  },
  get_panchang: {
    label: "Panchang",
    icon: "📅",
    description: "Calculating today's Panchang (Hindu calendar)...",
  },
  get_user_kundli: {
    label: "Chart Retrieval",
    icon: "📋",
    description: "Retrieving your saved birth chart...",
  },

  // Numerology
  calculate_life_path: {
    label: "Life Path Calculation",
    icon: "🔢",
    description: "Computing your Life Path Number...",
  },
  calculate_name_numbers: {
    label: "Name Analysis",
    icon: "📝",
    description: "Analyzing name vibrations and numbers...",
  },
  calculate_personal_year: {
    label: "Personal Year Cycle",
    icon: "📅",
    description: "Calculating your current cycle...",
  },
  save_numerology_profile: {
    label: "Saving Profile",
    icon: "💾",
    description: "Saving your numerology profile...",
  },

  // Tarot
  draw_cards: {
    label: "Card Draw",
    icon: "🃏",
    description: "Shuffling and drawing from the deck...",
  },
  get_card_details: {
    label: "Card Lookup",
    icon: "🔍",
    description: "Retrieving card meanings and symbolism...",
  },
  save_reading: {
    label: "Saving Reading",
    icon: "💾",
    description: "Saving your tarot reading...",
  },

  // Vastu
  analyze_directions: {
    label: "Directional Analysis",
    icon: "🧭",
    description: "Analyzing Vastu compliance of your space...",
  },
  get_element_balance: {
    label: "Element Balance",
    icon: "🌍",
    description: "Evaluating Pancha Bhuta element balance...",
  },
  save_vastu_assessment: {
    label: "Saving Assessment",
    icon: "💾",
    description: "Saving your Vastu assessment...",
  },
}

/* ────────────────────────────────────────────────────
   RE-EXPORTS — For convenience
   ──────────────────────────────────────────────────── */
export { ASTROLOGY_TOOL_DEFINITIONS } from "./astrology-tools"
export { NUMEROLOGY_TOOL_DEFINITIONS } from "./numerology-tools"
export { TAROT_TOOL_DEFINITIONS } from "./tarot-tools"
export { VASTU_TOOL_DEFINITIONS } from "./vastu-tools"
