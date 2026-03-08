/* ════════════════════════════════════════════════════
   GrahAI — Ethics & Guardrails Middleware
   Filters fatalistic, harmful, or manipulative language
   from AI chat responses before they reach the user
   ════════════════════════════════════════════════════ */

export interface GuardrailResult {
  safe: boolean
  filtered: string
  flags: string[]
  severity: "none" | "low" | "medium" | "high"
}

/* ─── Blocked patterns (hard reject) ─── */
const BLOCKED_PATTERNS = [
  // Fatalistic / doom predictions
  /you will (definitely |certainly |surely )?die/i,
  /death (is|will be) (imminent|certain|unavoidable)/i,
  /no hope|hopeless situation|nothing can save/i,
  /you are cursed|black magic on you|evil spirit/i,
  /your life will (end|be destroyed|be ruined)/i,

  // Medical misinformation
  /stop (taking |your )?medication/i,
  /don'?t (go to|see|visit) (a |the )?doctor/i,
  /astrology (can |will )?(cure|heal|treat) (your |the )?/i,
  /gemstone.*(cure|heal|treat).*disease/i,

  // Financial manipulation
  /invest (all|everything) (in|into)/i,
  /guaranteed (return|profit|income)/i,
  /donate.*(remove|fix|cure).*(dosha|curse)/i,
  /pay me|send money|wire transfer/i,

  // Relationship coercion
  /(leave|divorce|abandon) (your |him|her|them)/i,
  /you must marry|forced marriage/i,
  /your (partner|spouse) is (cheating|unfaithful)/i,

  // Caste / discrimination
  /lower caste|untouchable|born inferior/i,
  /bad birth|cursed birth|polluted lineage/i,
]

/* ─── Soft flags (transform language) ─── */
const SOFT_REPLACEMENTS: [RegExp, string][] = [
  // Fatalistic → empowering
  [/you will never/gi, "the current patterns suggest challenges in"],
  [/impossible for you/gi, "this may require extra effort and awareness"],
  [/destined to fail/gi, "facing a growth period that tests resilience"],
  [/doomed to/gi, "navigating a challenging but transformable phase of"],
  [/no escape from/gi, "an opportunity to consciously work through"],
  [/your fate is sealed/gi, "the planetary influences suggest — though remedies can shift the energy"],

  // Absolute → nuanced
  [/you will definitely/gi, "the chart strongly indicates you may"],
  [/this will certainly/gi, "this is likely to"],
  [/guaranteed to/gi, "strongly positioned to"],
  [/there is no doubt/gi, "the indications are strong that"],
  [/100% sure/gi, "highly likely"],
  [/absolutely certain/gi, "strongly suggested by the chart"],

  // Fear-based → educational
  [/mangal dosha will destroy/gi, "Mangal Dosha is a common pattern that benefits from awareness and can be addressed through"],
  [/sade sati will ruin/gi, "Sade Sati is a growth-oriented Saturn transit that brings"],
  [/rahu.{0,10}dangerous/gi, "Rahu's influence brings unconventional energy that requires"],
  [/ketu.{0,10}loss/gi, "Ketu encourages spiritual detachment and may redirect material focus"],
]

/* ─── Mandatory disclaimers by topic ─── */
const DISCLAIMERS: Record<string, string> = {
  health: "Note: Vedic astrology offers lifestyle insights but is not a substitute for professional medical advice. Always consult qualified healthcare providers for health concerns.",
  financial: "Note: Astrological insights highlight favorable periods but do not constitute financial advice. Consult a qualified financial advisor before making investment decisions.",
  legal: "Note: Astrological perspectives are not legal counsel. For legal matters, please consult a qualified legal professional.",
  mental_health: "Note: If you are experiencing emotional distress, please reach out to a mental health professional or helpline. Astrology can complement but never replace professional support.",
}

/* ─── Topic detection for disclaimers ─── */
function detectTopics(text: string): string[] {
  const lower = text.toLowerCase()
  const topics: string[] = []
  if (/health|disease|illness|medic|doctor|cure|symptom|diagnos/i.test(lower)) topics.push("health")
  if (/invest|stock|trading|financial|money.*advice|loan|debt/i.test(lower)) topics.push("financial")
  if (/court|legal|lawsuit|police|criminal|arrest/i.test(lower)) topics.push("legal")
  if (/depress|anxiety|suicid|self.?harm|panic|trauma/i.test(lower)) topics.push("mental_health")
  return topics
}

/* ─── Main guardrail function ─── */
export function applyGuardrails(text: string): GuardrailResult {
  const flags: string[] = []
  let severity: GuardrailResult["severity"] = "none"

  // Check for blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      flags.push(`Blocked: ${pattern.source}`)
      severity = "high"
    }
  }

  // If hard blocked, return safe response
  if (severity === "high") {
    return {
      safe: false,
      filtered: "I appreciate your question. However, I want to provide you with empowering and constructive guidance based on classical Vedic texts. Let me reframe this in a way that respects the wisdom tradition while being helpful to your situation. Could you rephrase your question so I can offer the most constructive insight?",
      flags,
      severity,
    }
  }

  // Apply soft replacements
  let filtered = text
  for (const [pattern, replacement] of SOFT_REPLACEMENTS) {
    if (pattern.test(filtered)) {
      filtered = filtered.replace(pattern, replacement)
      flags.push(`Softened: ${pattern.source}`)
      if (severity === "none") severity = "low"
    }
  }

  // Add disclaimers where needed
  const topics = detectTopics(filtered)
  const disclaimersToAdd = topics
    .filter((t) => DISCLAIMERS[t])
    .map((t) => DISCLAIMERS[t])

  if (disclaimersToAdd.length > 0) {
    filtered = filtered.trimEnd() + "\n\n---\n" + disclaimersToAdd.join("\n\n")
    if (severity === "none") severity = "low"
    flags.push(`Disclaimers: ${topics.join(", ")}`)
  }

  return {
    safe: true,
    filtered,
    flags,
    severity,
  }
}

/* ─── Input sanitizer for user questions ─── */
export function sanitizeUserInput(input: string): { clean: string; warning?: string } {
  const clean = input
    .replace(/<[^>]*>/g, "") // Strip HTML
    .replace(/[^\w\s.,?!'"()@#$%&*+-;:।।\u0900-\u097F]/g, "") // Allow Hindi chars
    .trim()
    .slice(0, 2000) // Max length

  // Check for prompt injection attempts
  const injectionPatterns = [
    /ignore (previous |all )?instructions/i,
    /you are now/i,
    /system prompt/i,
    /act as|pretend to be/i,
    /jailbreak|bypass|override/i,
  ]

  for (const pattern of injectionPatterns) {
    if (pattern.test(clean)) {
      return {
        clean: clean.replace(pattern, "[filtered]"),
        warning: "Some content was filtered for security.",
      }
    }
  }

  return { clean }
}

/* ─── Response quality scoring ─── */
export function scoreResponseQuality(response: string): {
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 100

  // Check for Sanskrit/classical references
  if (!/[\u0900-\u097F]/.test(response) && !/BPHS|Parashara|Jataka|Phaladeepika|Saravali/i.test(response)) {
    score -= 15
    feedback.push("Missing classical text references")
  }

  // Check for empowering language
  if (/you must|you should always|never do/i.test(response)) {
    score -= 10
    feedback.push("Overly prescriptive language detected")
  }

  // Check for actionable advice
  if (!/suggest|consider|may benefit|practice|try/i.test(response)) {
    score -= 10
    feedback.push("Missing actionable suggestions")
  }

  // Check response length
  if (response.length < 100) {
    score -= 20
    feedback.push("Response too brief for meaningful guidance")
  }

  return { score: Math.max(0, score), feedback }
}
