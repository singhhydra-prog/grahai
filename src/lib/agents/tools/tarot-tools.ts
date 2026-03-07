import { createClient } from "@supabase/supabase-js"
import type { Tool } from "@anthropic-ai/sdk/resources/messages"

/* ────────────────────────────────────────────────────
   TAROT TOOLS — Card Drawing & Spread Reading
   Tarot Reader's computational capabilities
   ──────────────────────────────────────────────────── */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

/* ────────────────────────────────────────────────────
   SPREAD POSITION LABELS
   ──────────────────────────────────────────────────── */
const SPREAD_POSITIONS: Record<string, string[]> = {
  single: ["Present Guidance"],
  three_card: ["Past", "Present", "Future"],
  celtic_cross: [
    "Present Situation",
    "Immediate Challenge",
    "Distant Past / Foundation",
    "Recent Past",
    "Best Possible Outcome",
    "Near Future",
    "Your Attitude / Approach",
    "External Influences",
    "Hopes and Fears",
    "Final Outcome",
  ],
}

/* ────────────────────────────────────────────────────
   FALLBACK DECK — Used when DB has no tarot_cards
   Complete 78-card Rider-Waite-Smith deck
   ──────────────────────────────────────────────────── */
const MAJOR_ARCANA = [
  { name: "The Fool", number: 0, keywords_upright: ["new beginnings", "innocence", "spontaneity"], keywords_reversed: ["recklessness", "fear", "risk-taking"], element: "Air" },
  { name: "The Magician", number: 1, keywords_upright: ["manifestation", "willpower", "skill"], keywords_reversed: ["manipulation", "trickery", "wasted talent"], element: "Air" },
  { name: "The High Priestess", number: 2, keywords_upright: ["intuition", "mystery", "inner wisdom"], keywords_reversed: ["secrets", "disconnect from intuition", "withdrawal"], element: "Water" },
  { name: "The Empress", number: 3, keywords_upright: ["abundance", "nurturing", "fertility"], keywords_reversed: ["dependence", "smothering", "creative block"], element: "Earth" },
  { name: "The Emperor", number: 4, keywords_upright: ["authority", "structure", "leadership"], keywords_reversed: ["tyranny", "rigidity", "domination"], element: "Fire" },
  { name: "The Hierophant", number: 5, keywords_upright: ["tradition", "spirituality", "guidance"], keywords_reversed: ["rebellion", "subversion", "new approaches"], element: "Earth" },
  { name: "The Lovers", number: 6, keywords_upright: ["love", "harmony", "choices"], keywords_reversed: ["disharmony", "imbalance", "misalignment"], element: "Air" },
  { name: "The Chariot", number: 7, keywords_upright: ["determination", "willpower", "triumph"], keywords_reversed: ["aggression", "lack of direction", "no control"], element: "Water" },
  { name: "Strength", number: 8, keywords_upright: ["courage", "inner strength", "compassion"], keywords_reversed: ["self-doubt", "weakness", "insecurity"], element: "Fire" },
  { name: "The Hermit", number: 9, keywords_upright: ["introspection", "wisdom", "solitude"], keywords_reversed: ["isolation", "loneliness", "withdrawal"], element: "Earth" },
  { name: "Wheel of Fortune", number: 10, keywords_upright: ["destiny", "turning point", "luck"], keywords_reversed: ["bad luck", "resistance to change", "breaking cycles"], element: "Fire" },
  { name: "Justice", number: 11, keywords_upright: ["fairness", "truth", "karma"], keywords_reversed: ["unfairness", "dishonesty", "lack of accountability"], element: "Air" },
  { name: "The Hanged Man", number: 12, keywords_upright: ["surrender", "new perspective", "letting go"], keywords_reversed: ["delays", "resistance", "stalling"], element: "Water" },
  { name: "Death", number: 13, keywords_upright: ["transformation", "endings", "transition"], keywords_reversed: ["resistance to change", "stagnation", "fear"], element: "Water" },
  { name: "Temperance", number: 14, keywords_upright: ["balance", "moderation", "patience"], keywords_reversed: ["excess", "imbalance", "lack of harmony"], element: "Fire" },
  { name: "The Devil", number: 15, keywords_upright: ["shadow self", "attachment", "materialism"], keywords_reversed: ["release", "freedom", "detachment"], element: "Earth" },
  { name: "The Tower", number: 16, keywords_upright: ["upheaval", "revelation", "awakening"], keywords_reversed: ["avoidance", "fear of change", "delaying disaster"], element: "Fire" },
  { name: "The Star", number: 17, keywords_upright: ["hope", "renewal", "inspiration"], keywords_reversed: ["despair", "disconnection", "lack of faith"], element: "Air" },
  { name: "The Moon", number: 18, keywords_upright: ["illusion", "intuition", "subconscious"], keywords_reversed: ["confusion", "fear", "misinterpretation"], element: "Water" },
  { name: "The Sun", number: 19, keywords_upright: ["joy", "success", "vitality"], keywords_reversed: ["temporary sadness", "lack of clarity", "overly optimistic"], element: "Fire" },
  { name: "Judgement", number: 20, keywords_upright: ["rebirth", "inner calling", "absolution"], keywords_reversed: ["self-doubt", "ignoring the call", "harsh judgment"], element: "Fire" },
  { name: "The World", number: 21, keywords_upright: ["completion", "accomplishment", "wholeness"], keywords_reversed: ["incompletion", "shortcuts", "empty success"], element: "Earth" },
]

const SUITS = ["Wands", "Cups", "Swords", "Pentacles"]
const COURT = ["Page", "Knight", "Queen", "King"]
const SUIT_ELEMENTS: Record<string, string> = { Wands: "Fire", Cups: "Water", Swords: "Air", Pentacles: "Earth" }

function generateFullDeck(): Array<{ name: string; arcana: string; suit: string | null; number: number; keywords_upright: string[]; keywords_reversed: string[]; element: string }> {
  const deck: Array<{ name: string; arcana: string; suit: string | null; number: number; keywords_upright: string[]; keywords_reversed: string[]; element: string }> = MAJOR_ARCANA.map(c => ({ ...c, arcana: "Major", suit: null as string | null }))

  for (const suit of SUITS) {
    for (let i = 1; i <= 10; i++) {
      const name = i === 1 ? `Ace of ${suit}` : `${i} of ${suit}`
      deck.push({
        name,
        arcana: "Minor",
        suit,
        number: i,
        keywords_upright: [`${suit.toLowerCase()} energy`, "growth", "potential"],
        keywords_reversed: [`blocked ${suit.toLowerCase()}`, "stagnation", "reversal"],
        element: SUIT_ELEMENTS[suit],
      })
    }
    for (let i = 0; i < COURT.length; i++) {
      deck.push({
        name: `${COURT[i]} of ${suit}`,
        arcana: "Minor",
        suit,
        number: 11 + i,
        keywords_upright: [`${COURT[i].toLowerCase()} qualities`, suit.toLowerCase(), "mastery"],
        keywords_reversed: [`immature ${COURT[i].toLowerCase()}`, "misuse", "blocked"],
        element: SUIT_ELEMENTS[suit],
      })
    }
  }

  return deck
}

/* ────────────────────────────────────────────────────
   CRYPTOGRAPHIC SHUFFLE — True randomness
   ──────────────────────────────────────────────────── */
function cryptoShuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  // Use crypto.getRandomValues for high-quality randomness
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomBytes = new Uint32Array(1)
    crypto.getRandomValues(randomBytes)
    const j = randomBytes[0] % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/* ────────────────────────────────────────────────────
   TOOL: DRAW CARDS
   ──────────────────────────────────────────────────── */
async function drawCards(input: { spread_type: string; question?: string }) {
  const spreadType = input.spread_type || "three_card"
  const positions = SPREAD_POSITIONS[spreadType] || SPREAD_POSITIONS.three_card
  const numCards = positions.length

  // Try loading deck from DB first
  let deck: Array<{ name: string; arcana: string; suit: string | null; keywords_upright: string[]; keywords_reversed: string[]; element: string }>

  try {
    const sb = getSupabase()
    const { data, error } = await sb.from("tarot_cards").select("name, arcana, suit, keywords_upright, keywords_reversed, element").order("id")
    if (!error && data && data.length >= 78) {
      deck = data
    } else {
      deck = generateFullDeck()
    }
  } catch {
    deck = generateFullDeck()
  }

  // Shuffle and draw
  const shuffled = cryptoShuffle(deck)
  const drawnCards = shuffled.slice(0, numCards).map((card, index) => {
    // Determine orientation (50/50 upright/reversed)
    const orientationBytes = new Uint8Array(1)
    crypto.getRandomValues(orientationBytes)
    const isReversed = orientationBytes[0] < 128

    return {
      position: positions[index],
      position_number: index + 1,
      card_name: card.name,
      arcana: card.arcana,
      suit: card.suit,
      element: card.element,
      orientation: isReversed ? "Reversed" : "Upright",
      keywords: isReversed ? card.keywords_reversed : card.keywords_upright,
    }
  })

  return {
    spread_type: spreadType,
    question: input.question || "General guidance",
    total_cards_drawn: numCards,
    cards: drawnCards,
    reading_note: "Cards have been drawn with cryptographic randomness. Interpret each card's imagery and meaning in the context of its position.",
  }
}

/* ────────────────────────────────────────────────────
   TOOL: GET CARD DETAILS
   ──────────────────────────────────────────────────── */
async function getCardDetails(input: { card_name: string }) {
  const sb = getSupabase()

  try {
    const { data, error } = await sb
      .from("tarot_cards")
      .select("*")
      .ilike("name", `%${input.card_name}%`)
      .limit(1)
      .single()

    if (!error && data) {
      return {
        name: data.name,
        arcana: data.arcana,
        suit: data.suit,
        number: data.number,
        element: data.element,
        zodiac_sign: data.zodiac_sign,
        planet: data.planet,
        keywords_upright: data.keywords_upright,
        keywords_reversed: data.keywords_reversed,
        upright_meaning: data.upright_meaning,
        reversed_meaning: data.reversed_meaning,
        description: data.description,
      }
    }
  } catch {
    // fallback
  }

  // Fallback: check generated deck
  const deck = generateFullDeck()
  const card = deck.find(c => c.name.toLowerCase().includes(input.card_name.toLowerCase()))
  if (card) {
    return {
      name: card.name,
      arcana: card.arcana,
      suit: card.suit,
      element: card.element,
      keywords_upright: card.keywords_upright,
      keywords_reversed: card.keywords_reversed,
    }
  }

  return { error: `Card not found: ${input.card_name}` }
}

/* ────────────────────────────────────────────────────
   TOOL: SAVE READING
   ──────────────────────────────────────────────────── */
async function saveReading(input: {
  user_id: string
  spread_type: string
  question: string
  cards: unknown[]
  interpretation: string
}) {
  const sb = getSupabase()
  try {
    await sb.from("tarot_readings").insert({
      user_id: input.user_id,
      spread_type: input.spread_type,
      question: input.question,
      cards_drawn: input.cards,
      interpretation: input.interpretation,
    })
    return { saved: true }
  } catch (err) {
    console.warn("Failed to save tarot reading:", err)
    return { saved: false }
  }
}

/* ────────────────────────────────────────────────────
   TOOL DEFINITIONS
   ──────────────────────────────────────────────────── */
export const TAROT_TOOL_DEFINITIONS: Tool[] = [
  {
    name: "draw_cards",
    description: "Draw tarot cards for a reading. Supports single card, three-card (past/present/future), and celtic cross (10-card) spreads. Cards are shuffled with cryptographic randomness and assigned upright or reversed orientation.",
    input_schema: {
      type: "object" as const,
      properties: {
        spread_type: {
          type: "string",
          description: "Type of spread: 'single', 'three_card', or 'celtic_cross'",
          enum: ["single", "three_card", "celtic_cross"],
        },
        question: { type: "string", description: "The querent's question or area of focus" },
      },
      required: ["spread_type"],
    },
  },
  {
    name: "get_card_details",
    description: "Get detailed information about a specific tarot card including its full meanings, symbolism, element, and zodiac associations.",
    input_schema: {
      type: "object" as const,
      properties: {
        card_name: { type: "string", description: "Name of the card (e.g., 'The Fool', 'Three of Cups', 'Queen of Swords')" },
      },
      required: ["card_name"],
    },
  },
  {
    name: "save_reading",
    description: "Save a completed tarot reading to the database for the user's history.",
    input_schema: {
      type: "object" as const,
      properties: {
        user_id: { type: "string" },
        spread_type: { type: "string" },
        question: { type: "string" },
        cards: { type: "array", description: "Array of drawn card data" },
        interpretation: { type: "string", description: "The complete reading interpretation" },
      },
      required: ["user_id", "spread_type", "question", "cards", "interpretation"],
    },
  },
]

/* ────────────────────────────────────────────────────
   TOOL EXECUTOR
   ──────────────────────────────────────────────────── */
export async function executeTarotTool(
  toolName: string,
  toolInput: Record<string, unknown>,
  userId?: string
): Promise<unknown> {
  switch (toolName) {
    case "draw_cards":
      return drawCards(toolInput as { spread_type: string; question?: string })
    case "get_card_details":
      return getCardDetails(toolInput as { card_name: string })
    case "save_reading":
      return saveReading({ ...toolInput as Parameters<typeof saveReading>[0], user_id: userId || (toolInput as { user_id: string }).user_id })
    default:
      return { error: `Unknown tarot tool: ${toolName}` }
  }
}
