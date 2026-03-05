import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/* ────────────────────────────────────────────────────
   SUPABASE ADMIN CLIENT (server-side, bypasses RLS)
   ──────────────────────────────────────────────────── */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

/* ────────────────────────────────────────────────────
   VERTICAL ROUTING — CEO Orchestrator logic
   Determines which "department" handles the query
   ──────────────────────────────────────────────────── */
function detectVertical(message: string, requestedVertical: string): string {
  if (requestedVertical && requestedVertical !== "general") return requestedVertical

  const lower = message.toLowerCase()

  // Astrology signals
  if (/\b(kundli|kundali|horoscope|planet|transit|dasha|nakshatra|rashi|zodiac|birth chart|ascendant|lagna|graha|mahadasha|antardasha|yoga|dosha|mangal|saturn|jupiter|rahu|ketu|sun sign|moon sign)\b/.test(lower))
    return "astrology"

  // Numerology signals
  if (/\b(numerology|life path|destiny number|soul urge|karmic|name number|lucky number|pythagorean|chaldean|vibration|birth number)\b/.test(lower))
    return "numerology"

  // Tarot signals
  if (/\b(tarot|card|spread|major arcana|minor arcana|celtic cross|reading|tower|fool|magician|empress|emperor|hierophant|lovers|chariot|strength|hermit|wheel|justice|hanged|death|temperance|devil|star card|moon card|sun card|judgement|world card|wands|cups|swords|pentacles)\b/.test(lower))
    return "tarot"

  // Vastu signals
  if (/\b(vastu|direction|north|south|east|west|entrance|bedroom placement|kitchen vastu|office placement|five elements|feng shui|home energy|space harmony)\b/.test(lower))
    return "vastu"

  return "general"
}

/* ────────────────────────────────────────────────────
   AGENT RESPONSE GENERATOR
   This is the placeholder for the real AI agent calls.
   When Anthropic API is integrated, this will call
   Claude with vertical-specific system prompts from
   the agent_prompt_versions table.
   ──────────────────────────────────────────────────── */
async function generateResponse(
  message: string,
  vertical: string,
  _conversationHistory: { role: string; content: string }[]
): Promise<{ reply: string; agent_name: string }> {

  // TODO: Replace with actual Anthropic API call
  // The flow will be:
  // 1. Fetch system prompt from agent_prompt_versions for the detected vertical
  // 2. Build conversation context from history
  // 3. Call Claude API with the system prompt + conversation
  // 4. Parse response and return

  const agentMap: Record<string, string> = {
    astrology: "Jyotish Guru",
    numerology: "Anka Vidya",
    tarot: "Tarot Reader",
    vastu: "Vastu Acharya",
    general: "GrahAI Guide",
  }

  const agent_name = agentMap[vertical] || "GrahAI Guide"

  // Smart placeholder responses based on vertical and keywords
  const reply = getSmartResponse(message, vertical)

  return { reply, agent_name }
}

function getSmartResponse(message: string, vertical: string): string {
  const lower = message.toLowerCase()

  if (vertical === "astrology") {
    if (lower.includes("kundli") || lower.includes("birth chart")) {
      return `🪐 **Kundli Analysis**

To generate your complete Kundli, I need your birth details:

• **Date of Birth** — day, month, year
• **Time of Birth** — as precise as possible (even minutes matter)
• **Place of Birth** — city/town name

Once you provide these, I'll compute your:
→ Ascendant (Lagna) and Moon sign
→ Planetary positions across all 12 houses
→ Active Dasha and Antardasha periods
→ Key Yogas (Raja Yoga, Dhana Yoga, Gajakesari, etc.)
→ Any Doshas (Mangal Dosha, Kaal Sarp, Pitra Dosha)

Every calculation uses the Swiss Ephemeris engine for arc-second precision, cross-referenced with Brihat Parashara Hora Shastra.

Please share your birth details to begin. 🙏`
    }

    if (lower.includes("dasha")) {
      return `⏳ **Dasha Period Analysis**

The Vimshottari Dasha system reveals the planetary periods governing your life. Each planet rules for a specific duration:

• Ketu — 7 years
• Venus — 20 years
• Sun — 6 years
• Moon — 10 years
• Mars — 7 years
• Rahu — 18 years
• Jupiter — 16 years
• Saturn — 19 years
• Mercury — 17 years

To determine your current Mahadasha and Antardasha, I need your **exact birth date and time**. The Dasha sequence begins from your Moon's Nakshatra at birth.

Share your birth details and I'll calculate your complete Dasha timeline with predictions for each period.`
    }

    return `🌟 **Vedic Astrology Insight**

Thank you for your question about Vedic astrology. To provide you with a personalized reading grounded in classical texts (BPHS, Saravali), I'll need your birth details:

• Date, time, and place of birth

With these, I can analyze planetary positions, house lordships, Dasha periods, and specific Yogas in your chart. Each finding will be traceable to established Jyotish principles.

What specific aspect of your chart interests you most?`
  }

  if (vertical === "numerology") {
    if (lower.includes("life path")) {
      return `🔢 **Life Path Number Calculation**

Your Life Path number is the most important number in numerology — it reveals your core purpose and the journey you're meant to walk.

**How it's calculated:**
Your complete date of birth is reduced to a single digit (or Master Number: 11, 22, 33).

For example, if born on 15th August 1990:
→ Day: 1+5 = 6
→ Month: 8
→ Year: 1+9+9+0 = 19 → 1+9 = 10 → 1+0 = 1
→ Total: 6+8+1 = 15 → 1+5 = **Life Path 6**

Please share your **full date of birth** and I'll calculate your Life Path number with a complete interpretation including:
→ Core personality traits
→ Life challenges and lessons
→ Career alignments
→ Relationship compatibility
→ Year-ahead forecast`
    }

    return `✨ **Numerology Reading**

Numerology reveals the hidden patterns in numbers that influence your life. Through your birth date and name, we can uncover:

• **Life Path Number** — your core purpose
• **Destiny Number** — what you're meant to achieve
• **Soul Urge Number** — your inner desires
• **Personality Number** — how others perceive you

Please share your **full name** (as on birth certificate) and **date of birth** to begin your personalized numerology reading.`
  }

  if (vertical === "tarot") {
    if (lower.includes("three") || lower.includes("3") || lower.includes("spread")) {
      const cards = [
        { name: "The Star", meaning: "Hope, renewal, and spiritual guidance. The universe is aligning in your favor." },
        { name: "Six of Cups", meaning: "Nostalgia, joy, and reconnection. Past experiences hold wisdom for your present." },
        { name: "Ace of Pentacles", meaning: "New opportunity, prosperity, and manifestation. A tangible beginning awaits." },
      ]

      return `🃏 **Three-Card Tarot Spread**

I've drawn three cards for your reading:

**Past — ${cards[0].name}**
${cards[0].meaning}

**Present — ${cards[1].name}**
${cards[1].meaning}

**Future — ${cards[2].name}**
${cards[2].meaning}

**Overall Reading:**
The cards suggest you're moving through a period of healing and renewal (The Star) into a phase of joyful reconnection with what truly matters (Six of Cups). The path ahead holds a promising new beginning in the material world (Ace of Pentacles) — this could manifest as a new job, financial opportunity, or a project that bears fruit.

Trust the process. The stars are aligned for growth.

Would you like me to do a deeper Celtic Cross spread, or explore a specific area of your life?`
    }

    return `🔮 **Tarot Reading**

I work with the complete 78-card deck — 22 Major Arcana and 56 Minor Arcana — interpreting each card with reversals, positional context, and elemental dignities.

**Available Spreads:**
• **Single Card** — quick daily guidance
• **Three-Card** — past, present, future
• **Celtic Cross** — comprehensive 10-card reading
• **Relationship Spread** — love and compatibility
• **Career Spread** — professional path

What area of your life would you like guidance on? I'll draw the cards and provide a detailed interpretation.`
  }

  if (vertical === "vastu") {
    return `🏠 **Vastu Shastra Consultation**

Vastu Shastra harmonizes your living space with the five elements and cardinal directions. I can help with:

• **Home Analysis** — room-by-room directional assessment
• **Office Vastu** — workspace optimization for success
• **Entrance Evaluation** — the most critical Vastu element
• **Remedies** — corrections without structural changes
• **New Construction** — ideal layouts and orientations

To provide specific guidance, please tell me:
1. What type of space? (home/office/shop)
2. Which direction does your main entrance face?
3. Any specific concerns? (health, finances, relationships)

Each recommendation will be grounded in classical Vastu texts with practical, actionable remedies.`
  }

  // General / unrouted
  return `🙏 **Namaste! Welcome to GrahAI**

I'm your guide across four Vedic sciences:

✦ **Vedic Astrology (ज्योतिष)** — Kundli, Dasha, transits, Yogas
✦ **Numerology (अंकशास्त्र)** — Life Path, destiny, name analysis
✦ **Tarot (टैरो)** — Card spreads and intuitive guidance
✦ **Vastu Shastra (वास्तु)** — Space harmony and directional energy

Each reading is personalized to your birth details and grounded in classical Sanskrit texts spanning 2,000+ years.

**To get started**, you can:
→ Ask me anything about your stars
→ Select a specific science from the dropdown above
→ Share your birth details for a personalized reading

What would you like to explore today?`
}

/* ────────────────────────────────────────────────────
   API ROUTE HANDLER
   ──────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, conversation_id, vertical: requestedVertical, user_id } = body

    if (!message || !user_id) {
      return NextResponse.json({ error: "Missing message or user_id" }, { status: 400 })
    }

    const sb = getSupabase()

    // Detect or confirm vertical
    const vertical = detectVertical(message, requestedVertical)

    // Create or get conversation
    let convId = conversation_id
    if (!convId) {
      const { data: conv, error: convErr } = await sb.from("conversations").insert({
        user_id,
        agent_name: "ceo_orchestrator",
        department: vertical,
        vertical,
        status: "active",
        metadata: { started_at: new Date().toISOString() },
      }).select("id").single()

      if (convErr) {
        console.error("Conv create error:", convErr)
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
      }
      convId = conv.id
    }

    // Save user message
    await sb.from("messages").insert({
      conversation_id: convId,
      role: "user",
      content: message,
      agent_name: null,
      metadata: { vertical },
    })

    // Fetch conversation history for context
    const { data: history } = await sb.from("messages")
      .select("role, content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true })
      .limit(20)

    // Generate response
    const { reply, agent_name } = await generateResponse(
      message,
      vertical,
      history || []
    )

    // Save assistant message
    const { data: savedMsg } = await sb.from("messages").insert({
      conversation_id: convId,
      role: "assistant",
      content: reply,
      agent_name,
      metadata: { vertical, model: "placeholder" },
    }).select("id").single()

    return NextResponse.json({
      reply,
      agent_name,
      conversation_id: convId,
      message_id: savedMsg?.id,
      vertical,
    })
  } catch (err) {
    console.error("Chat API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
