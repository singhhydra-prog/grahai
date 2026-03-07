import { createClient } from "@supabase/supabase-js"

/* ────────────────────────────────────────────────────
   MEMORY SYSTEM — Context injection from memories table
   Supports retrieval and persistence of user memories
   ──────────────────────────────────────────────────── */

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
    const { data: memories, error } = await sb
      .from("memories")
      .select("id, memory_type, content, importance, created_at")
      .eq("user_id", userId)
      .in("memory_type", memoryTypes)
      .order("importance", { ascending: false })
      .order("last_accessed_at", { ascending: false, nullsFirst: false })
      .limit(limit)

    if (error || !memories || memories.length === 0) {
      return ""
    }

    // Update access counts (fire-and-forget)
    const memoryIds = memories.map((m) => m.id)
    Promise.resolve(
      sb.from("memories")
        .update({
          access_count: 1,
          last_accessed_at: new Date().toISOString(),
        })
        .in("id", memoryIds)
    ).catch(() => {})

    // Format memories as context block
    const contextLines = memories.map((m) => {
      const typeLabel = m.memory_type.replace(/_/g, " ")
      return `- [${typeLabel}] ${m.content}`
    })

    return `\n\n--- USER CONTEXT (from previous interactions) ---\n${contextLines.join("\n")}\n--- END USER CONTEXT ---\n\nUse this context to personalize your response. Reference known details naturally.`
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
