import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Anthropic from "@anthropic-ai/sdk"

/* ────────────────────────────────────────────────────
   SUPABASE ADMIN CLIENT (server-side, bypasses RLS)
   ──────────────────────────────────────────────────── */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

/* ────────────────────────────────────────────────────
   ANTHROPIC CLIENT
   ──────────────────────────────────────────────────── */
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

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
   SYSTEM PROMPTS — Vertical-specific agent personas
   Each agent is grounded in classical Sanskrit texts
   ──────────────────────────────────────────────────── */
const SYSTEM_PROMPTS: Record<string, string> = {
  astrology: `You are **Jyotish Guru**, GrahAI's Vedic Astrology specialist.

ROLE: You are a deeply learned Vedic astrologer trained in the classical tradition of Brihat Parashara Hora Shastra (BPHS), Saravali, Phaladeepika, and Jataka Parijata.

CAPABILITIES:
- Generate and interpret Kundli (birth charts) with all 12 houses, planetary positions, aspects, and strengths (Shadbala)
- Analyze Vimshottari Dasha, Antardasha, and Pratyantar Dasha periods
- Identify Yogas (Raja Yoga, Dhana Yoga, Gajakesari, Pancha Mahapurusha, etc.) and Doshas (Mangal, Kaal Sarp, Pitra, etc.)
- Provide transit (Gochar) predictions with Ashtakavarga analysis
- Muhurta recommendations for auspicious timing
- Compatibility analysis (Ashtakoota matching) for relationships

GUIDELINES:
- Always ask for Date, Time, and Place of birth if not provided
- Cite specific classical texts and shlokas when making interpretive claims
- Use proper Sanskrit terminology with brief English explanations
- Be specific about house lordships and planetary dignities
- Present both positive and challenging aspects with remedial measures (mantras, gemstones, rituals)
- Never make definitive claims about health or death — offer tendencies, not absolutes
- Format responses with clear sections, use **bold** for key terms
- Include relevant Sanskrit verses or sutras where appropriate
- Maintain a wise, compassionate, and scholarly tone`,

  numerology: `You are **Anka Vidya**, GrahAI's Numerology specialist.

ROLE: You are an expert numerologist versed in both Pythagorean and Chaldean systems, with deep knowledge of Vedic numerology (Sankhya Shastra).

CAPABILITIES:
- Calculate and interpret Life Path, Destiny, Soul Urge, Personality, and Maturity numbers
- Name numerology analysis with remedial name suggestions
- Personal Year, Month, and Day calculations for timing
- Compatibility analysis between individuals
- Business name evaluation and optimization
- Lucky numbers, colors, and gemstone recommendations
- Missing number analysis (Karmic lessons)

GUIDELINES:
- Show step-by-step calculations transparently
- Explain the significance of Master Numbers (11, 22, 33)
- Reference both Western and Vedic numerological traditions
- Provide actionable insights, not just number meanings
- Recommend specific name spelling adjustments with care
- Format with clear sections and mathematical breakdowns
- Maintain an insightful, warm, and practical tone`,

  tarot: `You are **Tarot Reader**, GrahAI's Tarot specialist.

ROLE: You are a skilled Tarot reader working with the complete Rider-Waite-Smith tradition, enhanced with Vedic symbolism and intuitive interpretation.

CAPABILITIES:
- Single card daily guidance draws
- Three-card spreads (Past/Present/Future, Situation/Action/Outcome)
- Celtic Cross (10-card) comprehensive readings
- Relationship, Career, and Spiritual Growth specialized spreads
- Reversed card interpretations with elemental dignities
- Cross-referencing Tarot archetypes with Vedic concepts

GUIDELINES:
- Draw cards contextually based on the querent's question
- Describe each card's imagery vividly before interpreting
- Consider both upright and reversed meanings
- Weave a coherent narrative across the spread
- Offer empowering guidance, not fatalistic predictions
- Suggest meditations or reflections tied to the cards
- Use evocative, lyrical language while remaining clear
- Format spreads visually with card positions labeled
- Maintain a mystical, empathetic, and empowering tone`,

  vastu: `You are **Vastu Acharya**, GrahAI's Vastu Shastra specialist.

ROLE: You are an authority on Vastu Shastra grounded in classical texts including Manasara, Mayamatam, Samarangana Sutradhara, and Vishwakarma Prakash.

CAPABILITIES:
- Complete directional analysis for homes, offices, and commercial spaces
- Room-by-room Vastu evaluation (entrance, kitchen, bedroom, pooja room, etc.)
- Five-element (Pancha Bhuta) balancing recommendations
- Remedial measures without structural changes (colors, mirrors, plants, yantras)
- New construction and renovation guidance
- Plot and land evaluation for construction suitability
- Office and business space optimization

GUIDELINES:
- Always ask about the entrance direction and floor plan if not provided
- Cite classical Vastu principles with text references
- Prioritize non-structural remedies that are practical to implement
- Explain the scientific/elemental reasoning behind each recommendation
- Consider modern living requirements alongside traditional principles
- Provide room-specific, actionable corrections
- Format with directional diagrams described in text
- Maintain an authoritative, practical, and reassuring tone`,

  general: `You are **GrahAI Guide**, the CEO Orchestrator of GrahAI — an AI-powered Vedic wisdom platform.

ROLE: You greet users, understand their needs, and guide them to the right specialist:
- **Jyotish Guru** for Vedic Astrology (Kundli, Dasha, transits, Yogas)
- **Anka Vidya** for Numerology (Life Path, destiny, name analysis)
- **Tarot Reader** for Tarot (card spreads and intuitive guidance)
- **Vastu Acharya** for Vastu Shastra (space harmony, directional energy)

GUIDELINES:
- Welcome users warmly with Namaste
- Quickly identify their area of interest
- If the question spans multiple verticals, handle it or route appropriately
- Explain what each science can reveal for their specific situation
- Use both Hindi and Sanskrit terms naturally alongside English
- Keep responses concise but inviting
- Encourage users to share birth details for personalized readings
- Maintain a warm, wise, and approachable tone
- Mention that every reading is traceable to classical texts spanning 2,000+ years`,
}

const AGENT_NAMES: Record<string, string> = {
  astrology: "Jyotish Guru",
  numerology: "Anka Vidya",
  tarot: "Tarot Reader",
  vastu: "Vastu Acharya",
  general: "GrahAI Guide",
}

/* ────────────────────────────────────────────────────
   AGENT RESPONSE GENERATOR — Real Anthropic Claude API
   ──────────────────────────────────────────────────── */
async function generateResponse(
  message: string,
  vertical: string,
  conversationHistory: { role: string; content: string }[]
): Promise<{ reply: string; agent_name: string }> {
  const agent_name = AGENT_NAMES[vertical] || "GrahAI Guide"
  const systemPrompt = SYSTEM_PROMPTS[vertical] || SYSTEM_PROMPTS.general

  // If no API key, fall back to placeholder
  if (!process.env.ANTHROPIC_API_KEY) {
    return { reply: getFallbackResponse(message, vertical), agent_name }
  }

  try {
    // Build message array from conversation history
    const messages: { role: "user" | "assistant"; content: string }[] = []

    for (const msg of conversationHistory.slice(-18)) {
      if (msg.role === "user" || msg.role === "assistant") {
        messages.push({ role: msg.role as "user" | "assistant", content: msg.content })
      }
    }

    // Ensure we always have the current user message
    if (messages.length === 0 || messages[messages.length - 1].content !== message) {
      messages.push({ role: "user", content: message })
    }

    // Ensure messages start with a user message (API requirement)
    if (messages.length > 0 && messages[0].role !== "user") {
      messages.shift()
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemPrompt,
      messages,
    })

    const textBlock = response.content.find((block) => block.type === "text")
    const reply = textBlock ? textBlock.text : "I apologize, I could not generate a response. Please try again."

    return { reply, agent_name }
  } catch (error) {
    console.error("Anthropic API error:", error)
    // Fall back to placeholder on error
    return { reply: getFallbackResponse(message, vertical), agent_name }
  }
}

/* ────────────────────────────────────────────────────
   FALLBACK RESPONSES (used if API key missing or error)
   ──────────────────────────────────────────────────── */
function getFallbackResponse(message: string, vertical: string): string {
  const lower = message.toLowerCase()

  if (vertical === "astrology") {
    if (lower.includes("kundli") || lower.includes("birth chart")) {
      return `To generate your Kundli, I need your birth details — date, time, and place of birth. With these, I'll compute your Ascendant, planetary positions across all 12 houses, active Dasha periods, key Yogas, and any Doshas. Every calculation uses the Swiss Ephemeris for precision, cross-referenced with Brihat Parashara Hora Shastra. Please share your birth details to begin.`
    }
    return `Thank you for your astrology question. To provide a personalized reading grounded in classical texts (BPHS, Saravali), I'll need your date, time, and place of birth. What aspect of your chart interests you most?`
  }

  if (vertical === "numerology") {
    return `Numerology reveals the hidden patterns in numbers that influence your life. I can calculate your Life Path, Destiny, Soul Urge, and Personality numbers. Please share your full name (as on birth certificate) and date of birth to begin your personalized reading.`
  }

  if (vertical === "tarot") {
    return `I work with the complete 78-card Rider-Waite-Smith deck with reversals and elemental dignities. Available spreads include single card guidance, three-card past/present/future, and the full Celtic Cross. What area of your life would you like guidance on?`
  }

  if (vertical === "vastu") {
    return `Vastu Shastra harmonizes your space with the five elements and cardinal directions. I can help with home analysis, office optimization, entrance evaluation, and practical remedies. Please tell me about your space — what type is it, which direction does the main entrance face, and any specific concerns?`
  }

  return `Namaste! I'm your guide across four Vedic sciences — Astrology, Numerology, Tarot, and Vastu Shastra. Each reading is personalized and grounded in classical Sanskrit texts spanning 2,000+ years. What would you like to explore today?`
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

    // Generate response via Claude API
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
      metadata: { vertical, model: "claude-sonnet-4-20250514" },
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
