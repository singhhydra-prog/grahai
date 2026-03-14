import { createClient } from "@supabase/supabase-js"

/* ════════════════════════════════════════════════════════
   MEMORY SYSTEM — V2 with Thread Tracking

   Supports:
   - Basic memory retrieval & persistence (unchanged)
   - Memory thread tracking (recurring life themes)
   - Life-area tagging for continuity cards
   - Pattern detection across conversations
   - Context injection into AI prompts

   Per Execution Document Module E (User Memory Layer)
   ════════════════════════════════════════════════════════ */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Memory types map to verticals
const VERTICAL_MEMORY_TYPES: Record<string, string[]> = {
  astrology: ["birth_data", "astrology_reading", "kundli", "preference"],
  numerology: ["birth_data", "numerology_profile", "name_data", "preference"],
  tarot: ["tarot_reading", "preference", "life_context"],
  vastu: ["vastu_assessment", "property_data", "preference"],
  general: ["birth_data", "preference", "life_context"],
}

// Life area keywords for auto-tagging threads
const LIFE_AREA_KEYWORDS: Record<string, string[]> = {
  love: ["relationship", "partner", "marriage", "love", "dating", "spouse", "compatibility", "breakup", "romance"],
  career: ["career", "job", "work", "promotion", "business", "salary", "profession", "interview", "resign"],
  health: ["health", "illness", "disease", "medical", "surgery", "wellness", "mental health", "anxiety", "stress"],
  family: ["family", "parent", "child", "mother", "father", "sibling", "son", "daughter", "home"],
  wealth: ["money", "wealth", "investment", "property", "finance", "debt", "savings", "income", "loss"],
  education: ["education", "study", "exam", "college", "university", "degree", "course", "learning"],
  spiritual: ["spiritual", "karma", "meditation", "mantra", "remedy", "temple", "prayer", "puja"],
}

/* ────────────────────────────────────────────────────
   GET RELEVANT MEMORIES — Retrieves user context
   ──────────────────────────────────────────────────── */
export async function getRelevantMemories(
  userId: string,
  vertical: string,
  limit: number = 5
): Promise<string> {
  const sb = getSupabase()
  const memoryTypes = VERTICAL_MEMORY_TYPES[vertical] || VERTICAL_MEMORY_TYPES.general

  try {
    // Fetch memories and active threads in parallel
    const [memoriesResult, threadsResult] = await Promise.all([
      sb
        .from("memories")
        .select("id, memory_type, content, importance, created_at")
        .eq("user_id", userId)
        .in("memory_type", memoryTypes)
        .order("importance", { ascending: false })
        .order("last_accessed_at", { ascending: false, nullsFirst: false })
        .limit(limit),
      sb
        .from("memory_threads")
        .select("theme, life_area, intensity_score, summary, occurrence_count, last_seen_at")
        .eq("user_id", userId)
        .order("intensity_score", { ascending: false })
        .limit(3),
    ])

    const memories = memoriesResult.data
    const threads = threadsResult.data

    const hasMemories = memories && memories.length > 0
    const hasThreads = threads && threads.length > 0

    if (!hasMemories && !hasThreads) {
      return ""
    }

    const contextParts: string[] = []

    // Format memories
    if (hasMemories) {
      const memoryIds = memories.map((m) => m.id)
      // Update access counts (fire-and-forget)
      Promise.resolve(
        sb.from("memories")
          .update({
            access_count: 1,
            last_accessed_at: new Date().toISOString(),
          })
          .in("id", memoryIds)
      ).catch(() => {})

      const contextLines = memories.map((m) => {
        const typeLabel = m.memory_type.replace(/_/g, " ")
        return `- [${typeLabel}] ${m.content}`
      })
      contextParts.push(`KNOWN FACTS:\n${contextLines.join("\n")}`)
    }

    // Format active threads (recurring themes)
    if (hasThreads) {
      const threadLines = threads.map((t) => {
        const area = t.life_area ? ` (${t.life_area})` : ""
        const freq = t.occurrence_count > 2 ? " [recurring]" : ""
        return `- ${t.theme}${area}${freq}: ${t.summary || "Active concern"}`
      })
      contextParts.push(`RECURRING THEMES:\n${threadLines.join("\n")}`)
    }

    return `\n\n--- USER CONTEXT (from previous interactions) ---\n${contextParts.join("\n\n")}\n--- END USER CONTEXT ---\n\nUse this context to personalize your response. Reference known details and recurring themes naturally. If a user keeps asking about the same life area, acknowledge the continuity.`
  } catch (err) {
    console.warn("Failed to fetch memories:", err)
    return ""
  }
}

/* ────────────────────────────────────────────────────
   SAVE MEMORY — Persist significant user data
   ──────────────────────────────────────────────────── */
export async function saveMemory(
  userId: string,
  memoryType: string,
  content: string,
  importance: number = 0.5,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  const sb = getSupabase()

  try {
    await sb.from("memories").insert({
      user_id: userId,
      memory_type: memoryType,
      content,
      importance,
      metadata,
      access_count: 0,
      last_accessed_at: null,
    })
  } catch (err) {
    console.warn("Failed to save memory:", err)
  }
}

/* ────────────────────────────────────────────────────
   DETECT LIFE AREA — Auto-tag from question text
   ──────────────────────────────────────────────────── */
export function detectLifeArea(text: string): string | null {
  const lower = text.toLowerCase()
  let bestArea: string | null = null
  let bestScore = 0

  for (const [area, keywords] of Object.entries(LIFE_AREA_KEYWORDS)) {
    const score = keywords.filter((kw) => lower.includes(kw)).length
    if (score > bestScore) {
      bestScore = score
      bestArea = area
    }
  }

  return bestArea
}

/* ────────────────────────────────────────────────────
   UPDATE MEMORY THREAD — Track recurring themes
   Creates or updates a thread for a life-area topic
   ──────────────────────────────────────────────────── */
export async function updateMemoryThread(
  userId: string,
  question: string,
  questionId?: string
): Promise<void> {
  const sb = getSupabase()
  const lifeArea = detectLifeArea(question)
  if (!lifeArea) return

  // Generate a normalized theme from the question
  const theme = generateTheme(question, lifeArea)

  try {
    // Check if a similar thread exists
    const { data: existing } = await sb
      .from("memory_threads")
      .select("id, occurrence_count, related_questions, intensity_score")
      .eq("user_id", userId)
      .eq("life_area", lifeArea)
      .order("last_seen_at", { ascending: false })
      .limit(1)

    if (existing && existing.length > 0) {
      const thread = existing[0]
      const relatedQuestions = thread.related_questions || []
      if (questionId) relatedQuestions.push(questionId)

      // Increase intensity with each occurrence (capped at 1.0)
      const newIntensity = Math.min(1.0, thread.intensity_score + 0.1)

      await sb
        .from("memory_threads")
        .update({
          occurrence_count: thread.occurrence_count + 1,
          intensity_score: newIntensity,
          last_seen_at: new Date().toISOString(),
          related_questions: relatedQuestions.slice(-10), // Keep last 10
          summary: `User has asked about ${lifeArea} ${thread.occurrence_count + 1} times. Latest: "${question.substring(0, 100)}"`,
        })
        .eq("id", thread.id)
    } else {
      // Create new thread
      await sb.from("memory_threads").insert({
        user_id: userId,
        theme,
        life_area: lifeArea,
        intensity_score: 0.3,
        occurrence_count: 1,
        related_questions: questionId ? [questionId] : [],
        summary: `User asked about ${lifeArea}: "${question.substring(0, 100)}"`,
      })
    }
  } catch (err) {
    console.warn("Failed to update memory thread:", err)
  }
}

/* ────────────────────────────────────────────────────
   GET ACTIVE THREADS — For continuity cards on Home
   ──────────────────────────────────────────────────── */
export async function getActiveThreads(
  userId: string,
  limit: number = 3
): Promise<Array<{
  theme: string
  lifeArea: string
  intensity: number
  occurrences: number
  summary: string
  lastSeen: string
}>> {
  const sb = getSupabase()

  try {
    const { data: threads } = await sb
      .from("memory_threads")
      .select("theme, life_area, intensity_score, occurrence_count, summary, last_seen_at")
      .eq("user_id", userId)
      .gte("intensity_score", 0.2) // Only meaningful threads
      .order("intensity_score", { ascending: false })
      .limit(limit)

    if (!threads || threads.length === 0) return []

    return threads.map((t) => ({
      theme: t.theme,
      lifeArea: t.life_area || "general",
      intensity: t.intensity_score,
      occurrences: t.occurrence_count,
      summary: t.summary || "",
      lastSeen: t.last_seen_at,
    }))
  } catch {
    return []
  }
}

/* ────────────────────────────────────────────────────
   EXTRACT & SAVE BIRTH DATA — Auto-extract from messages
   ──────────────────────────────────────────────────── */
export async function extractAndSaveBirthData(
  userId: string,
  message: string,
  vertical: string
): Promise<void> {
  // Simple heuristic: if message contains date-like patterns + time + place
  const hasDate = /\b(\d{1,2}[\s/-]\w{3,}[\s/-]\d{4}|\d{4}[\s/-]\d{1,2}[\s/-]\d{1,2}|\w+ \d{1,2},? \d{4})\b/i.test(message)
  const hasTime = /\b(\d{1,2}:\d{2}\s*(am|pm)?)\b/i.test(message)
  const hasPlace = /\b(born in|birth place|born at|from|in)\s+([A-Z][a-z]+(\s[A-Z][a-z]+)*)/i.test(message)

  if (hasDate || hasTime || hasPlace) {
    // Check if we already have birth data for this user
    const sb = getSupabase()
    const { data: existing } = await sb
      .from("memories")
      .select("id")
      .eq("user_id", userId)
      .eq("memory_type", "birth_data")
      .limit(1)

    if (!existing || existing.length === 0) {
      await saveMemory(
        userId,
        "birth_data",
        `User provided birth-related information: "${message.substring(0, 200)}"`,
        0.9, // High importance
        { vertical, auto_extracted: true }
      )
    }
  }
}

/* ────────────────────────────────────────────────────
   HELPER: Generate theme label from question
   ──────────────────────────────────────────────────── */
function generateTheme(question: string, lifeArea: string): string {
  const themeMap: Record<string, string> = {
    love: "Relationship clarity",
    career: "Career direction",
    health: "Health & wellness",
    family: "Family dynamics",
    wealth: "Financial growth",
    education: "Academic progress",
    spiritual: "Spiritual journey",
  }
  return themeMap[lifeArea] || `${lifeArea.charAt(0).toUpperCase() + lifeArea.slice(1)} guidance`
}
