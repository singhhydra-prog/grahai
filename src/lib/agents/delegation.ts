import { createClient } from "@supabase/supabase-js"

/* ════════════════════════════════════════════════════════
   SUB-AGENT DELEGATION ENGINE

   Routes queries within a vertical to specialized sub-agents.
   Each department head (Jyotish Guru, Anka Vidya, etc.)
   delegates to the best-fit sub-agent for the user's query.

   Sub-agents share the same tools as their parent but have
   specialized system prompts for deeper expertise.
   ════════════════════════════════════════════════════════ */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

/* ────────────────────────────────────────────────────
   SUB-AGENT DEFINITIONS — Who handles what within each vertical
   ──────────────────────────────────────────────────── */

export interface SubAgentRoute {
  subAgent: string
  displayName: string
  patterns: RegExp
  description: string
}

const ASTROLOGY_SUB_AGENTS: SubAgentRoute[] = [
  {
    subAgent: "chart-calculator",
    displayName: "Chart Calculator",
    patterns: /\b(kundli|kundali|birth chart|natal chart|horoscope chart|my chart|ascendant|lagna|planet position|house|bhava)\b/i,
    description: "Generates precise birth charts with Swiss Ephemeris",
  },
  {
    subAgent: "dasha-analyst",
    displayName: "Dasha Analyst",
    patterns: /\b(dasha|mahadasha|antardasha|pratyantardasha|vimshottari|period|timing|when will|which period|dasha balance)\b/i,
    description: "Analyzes Vimshottari Dasha periods and timing",
  },
  {
    subAgent: "yoga-expert",
    displayName: "Yoga Expert",
    patterns: /\b(yoga|raj yoga|dhana yoga|gaja ?kesari|budhaditya|panch mahapurush|neech bhang|vipreet|parivartana|combination|strength)\b/i,
    description: "Detects and interprets 50+ planetary yogas",
  },
  {
    subAgent: "transit-tracker",
    displayName: "Transit Tracker",
    patterns: /\b(transit|gochar|sade ?sati|saturn return|jupiter transit|rahu transit|current|today|now|this month|this year|prediction|forecast)\b/i,
    description: "Analyzes current planetary transits and Sade Sati",
  },
  {
    subAgent: "remedy-advisor",
    displayName: "Remedy Advisor",
    patterns: /\b(remedy|remedies|gemstone|mantra|fasting|charity|rudraksha|yantra|puja|dosha|mangal dosha|kaal sarp|cure|solution|fix|help)\b/i,
    description: "Prescribes personalized Vedic remedies for doshas",
  },
  {
    subAgent: "qa-reviewer",
    displayName: "QA Reviewer",
    patterns: /\b(check|verify|accurate|correct|review|second opinion|validate|compare)\b/i,
    description: "Quality-checks astrological interpretations",
  },
]

const NUMEROLOGY_SUB_AGENTS: SubAgentRoute[] = [
  {
    subAgent: "life-path-calculator",
    displayName: "Life Path Calculator",
    patterns: /\b(life path|birth number|birthday|born on|birth date number|core number|master number)\b/i,
    description: "Calculates core numerology numbers from birth date",
  },
  {
    subAgent: "name-analyst",
    displayName: "Name Analyst",
    patterns: /\b(name|destiny number|expression|soul urge|personality number|heart's desire|name change|spelling|letters)\b/i,
    description: "Analyzes name vibrations and letter values",
  },
  {
    subAgent: "cycle-tracker",
    displayName: "Cycle Tracker",
    patterns: /\b(personal year|personal month|cycle|pinnacle|challenge|period|forecast|year ahead|this year|annual)\b/i,
    description: "Tracks personal year/month/day cycles",
  },
  {
    subAgent: "prediction-engine",
    displayName: "Prediction Engine",
    patterns: /\b(predict|future|compatibility|match|lucky|auspicious|favorable|best day|best time)\b/i,
    description: "Generates predictions based on number patterns",
  },
]

const TAROT_SUB_AGENTS: SubAgentRoute[] = [
  {
    subAgent: "card-interpreter",
    displayName: "Card Interpreter",
    patterns: /\b(meaning|interpret|significance|symbolism|what does .* mean|upright|reversed|card meaning)\b/i,
    description: "Provides deep card-by-card interpretations",
  },
  {
    subAgent: "spread-analyst",
    displayName: "Spread Analyst",
    patterns: /\b(spread|celtic cross|three card|past present future|reading|draw|pull|layout|position)\b/i,
    description: "Designs and interprets card spreads",
  },
  {
    subAgent: "energy-reader",
    displayName: "Energy Reader",
    patterns: /\b(energy|feeling|intuition|guidance|spirit|message|channel|sense|vibe|aura)\b/i,
    description: "Channels intuitive energy readings from cards",
  },
  {
    subAgent: "journal-keeper",
    displayName: "Journal Keeper",
    patterns: /\b(journal|save|record|history|past reading|previous|log|diary)\b/i,
    description: "Manages tarot reading history and patterns",
  },
]

const VASTU_SUB_AGENTS: SubAgentRoute[] = [
  {
    subAgent: "direction-analyst",
    displayName: "Direction Analyst",
    patterns: /\b(direction|facing|entrance|north|south|east|west|northeast|southeast|compass|orientation)\b/i,
    description: "Analyzes directional compliance and energy flow",
  },
  {
    subAgent: "element-balancer",
    displayName: "Element Balancer",
    patterns: /\b(element|fire|water|earth|air|space|pancha bhuta|balance|energy|flow|harmony)\b/i,
    description: "Evaluates and balances the five elements",
  },
  {
    subAgent: "vastu-remedy-advisor",
    displayName: "Remedy Advisor",
    patterns: /\b(remedy|remedies|cure|correction|fix|improve|enhance|mirror|crystal|plant|color)\b/i,
    description: "Prescribes non-structural Vastu corrections",
  },
  {
    subAgent: "space-planner",
    displayName: "Space Planner",
    patterns: /\b(room|bedroom|kitchen|bathroom|office|living room|study|pooja|temple|plan|layout|placement|furniture)\b/i,
    description: "Plans room placement and furniture arrangement",
  },
]

const GENERAL_SUB_AGENTS: SubAgentRoute[] = [
  {
    subAgent: "router",
    displayName: "Router",
    patterns: /\b(help|what can you|how do|tell me about|services|features|options)\b/i,
    description: "Routes queries to the right department",
  },
  {
    subAgent: "summarizer",
    displayName: "Summarizer",
    patterns: /\b(summary|summarize|overview|brief|quick|short|recap|highlights)\b/i,
    description: "Summarizes readings and analysis results",
  },
  {
    subAgent: "memory-manager",
    displayName: "Memory Manager",
    patterns: /\b(remember|forget|saved|profile|my data|update|change my|edit my)\b/i,
    description: "Manages user preferences and stored data",
  },
  {
    subAgent: "feedback-handler",
    displayName: "Feedback Handler",
    patterns: /\b(feedback|complaint|wrong|inaccurate|bad|improve|suggestion|issue)\b/i,
    description: "Handles user feedback and quality issues",
  },
]

/* ────────────────────────────────────────────────────
   VERTICAL → SUB-AGENT MAP
   ──────────────────────────────────────────────────── */

const VERTICAL_SUB_AGENTS: Record<string, SubAgentRoute[]> = {
  astrology: ASTROLOGY_SUB_AGENTS,
  numerology: NUMEROLOGY_SUB_AGENTS,
  tarot: TAROT_SUB_AGENTS,
  vastu: VASTU_SUB_AGENTS,
  general: GENERAL_SUB_AGENTS,
}

/* ────────────────────────────────────────────────────
   DETECT SUB-AGENT — Pattern-match within a vertical
   Returns sub-agent name or null (falls back to head)
   ──────────────────────────────────────────────────── */

export function detectSubAgent(vertical: string, message: string): SubAgentRoute | null {
  const subAgents = VERTICAL_SUB_AGENTS[vertical]
  if (!subAgents) return null

  // Score each sub-agent by number of pattern matches
  let bestMatch: SubAgentRoute | null = null
  let bestScore = 0

  for (const route of subAgents) {
    const matches = message.match(route.patterns)
    if (matches && matches.length > bestScore) {
      bestScore = matches.length
      bestMatch = route
    }
  }

  return bestMatch
}

/* ────────────────────────────────────────────────────
   GET SUB-AGENT PROMPT — Load from DB or generate
   Sub-agent prompts augment the parent's prompt
   ──────────────────────────────────────────────────── */

// Cache for sub-agent prompt augments
const subAgentPromptCache = new Map<string, { prompt: string; loadedAt: number }>()
const SUB_CACHE_TTL_MS = 5 * 60 * 1000

export async function getSubAgentPromptAugment(
  vertical: string,
  subAgent: SubAgentRoute
): Promise<string> {
  const cacheKey = `${vertical}:${subAgent.subAgent}`
  const cached = subAgentPromptCache.get(cacheKey)
  if (cached && Date.now() - cached.loadedAt < SUB_CACHE_TTL_MS) {
    return cached.prompt
  }

  // Try loading from agent_prompt_versions
  try {
    const sb = getSupabase()
    const { data } = await sb
      .from("agent_prompt_versions")
      .select("system_prompt")
      .eq("agent_name", subAgent.subAgent)
      .eq("is_active", true)
      .single()

    if (data?.system_prompt) {
      subAgentPromptCache.set(cacheKey, { prompt: data.system_prompt, loadedAt: Date.now() })
      return data.system_prompt
    }
  } catch {
    // DB lookup failed, use generated augment
  }

  // Generate a contextual augment from the sub-agent definition
  const augment = `\n\n--- SUB-SPECIALIST FOCUS ---
You are currently operating as the **${subAgent.displayName}** specialist within your department.
Focus Area: ${subAgent.description}
Prioritize this specialty in your analysis while maintaining access to all your department's capabilities.
If the query requires broader analysis beyond your specialty, provide comprehensive coverage.`

  subAgentPromptCache.set(cacheKey, { prompt: augment, loadedAt: Date.now() })
  return augment
}

/* ────────────────────────────────────────────────────
   LOG DELEGATION — Record in agent_tasks table
   ──────────────────────────────────────────────────── */

export async function logDelegation(
  conversationId: string,
  fromAgent: string,
  toAgent: string,
  vertical: string,
  message: string
): Promise<void> {
  try {
    const sb = getSupabase()
    await sb.from("agent_tasks").insert({
      conversation_id: conversationId,
      from_agent: fromAgent,
      to_agent: toAgent,
      task_type: "delegation",
      input_data: { message: message.slice(0, 500), vertical },
      status: "completed",
      priority: 3,  // 1=critical, 2=high, 3=normal, 4=low
    })
  } catch (err) {
    console.warn("Failed to log delegation:", err)
  }
}

/* ────────────────────────────────────────────────────
   GET ALL SUB-AGENTS — For dashboard display
   ──────────────────────────────────────────────────── */

export function getAllSubAgents(): Record<string, SubAgentRoute[]> {
  return VERTICAL_SUB_AGENTS
}

export function getSubAgentsForVertical(vertical: string): SubAgentRoute[] {
  return VERTICAL_SUB_AGENTS[vertical] || []
}
