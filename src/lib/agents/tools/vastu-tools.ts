import { createClient } from "@supabase/supabase-js"
import type { Tool } from "@anthropic-ai/sdk/resources/messages"

/* ────────────────────────────────────────────────────
   VASTU TOOLS — Directional Analysis & Element Balance
   Vastu Acharya's computational capabilities
   ──────────────────────────────────────────────────── */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

/* ────────────────────────────────────────────────────
   VASTU CONSTANTS — Directions, Elements, Deities
   ──────────────────────────────────────────────────── */

// The 8 cardinal + inter-cardinal directions
const DIRECTIONS = [
  "North", "Northeast", "East", "Southeast",
  "South", "Southwest", "West", "Northwest",
] as const

type Direction = (typeof DIRECTIONS)[number]

// Pancha Bhuta — Five Elements mapped to directions
const DIRECTION_ELEMENTS: Record<Direction, string> = {
  North: "Water",
  Northeast: "Water/Ether",
  East: "Air",
  Southeast: "Fire",
  South: "Fire",
  Southwest: "Earth",
  West: "Air/Space",
  Northwest: "Air",
}

// Ruling deities for each direction
const DIRECTION_DEITIES: Record<Direction, string> = {
  North: "Kubera (Lord of Wealth)",
  Northeast: "Ishanya (Lord Shiva)",
  East: "Indra (King of Gods)",
  Southeast: "Agni (Fire God)",
  South: "Yama (Lord of Death)",
  Southwest: "Nairuti (Demon Lord)",
  West: "Varuna (Lord of Water/Oceans)",
  Northwest: "Vayu (Wind God)",
}

// Ruling planets
const DIRECTION_PLANETS: Record<Direction, string> = {
  North: "Mercury",
  Northeast: "Jupiter",
  East: "Sun",
  Southeast: "Venus",
  South: "Mars",
  Southwest: "Rahu",
  West: "Saturn",
  Northwest: "Moon",
}

// Ideal room placements per Vastu Shastra
const IDEAL_ROOM_PLACEMENT: Record<string, { ideal: Direction[]; acceptable: Direction[]; avoid: Direction[] }> = {
  master_bedroom: {
    ideal: ["Southwest"],
    acceptable: ["South", "West"],
    avoid: ["Northeast", "Southeast"],
  },
  kitchen: {
    ideal: ["Southeast"],
    acceptable: ["Northwest", "East"],
    avoid: ["Northeast", "Southwest"],
  },
  pooja_room: {
    ideal: ["Northeast"],
    acceptable: ["East", "North"],
    avoid: ["South", "Southwest", "Southeast"],
  },
  living_room: {
    ideal: ["North", "East", "Northeast"],
    acceptable: ["Northwest"],
    avoid: ["Southwest", "Southeast"],
  },
  children_bedroom: {
    ideal: ["West", "Northwest"],
    acceptable: ["North"],
    avoid: ["Southwest", "Southeast"],
  },
  guest_bedroom: {
    ideal: ["Northwest"],
    acceptable: ["West", "North"],
    avoid: ["Southwest"],
  },
  bathroom: {
    ideal: ["Northwest", "West"],
    acceptable: ["South"],
    avoid: ["Northeast", "East", "Southwest"],
  },
  toilet: {
    ideal: ["Northwest", "West"],
    acceptable: ["South"],
    avoid: ["Northeast", "East", "Southwest"],
  },
  dining_room: {
    ideal: ["West", "East"],
    acceptable: ["North", "South"],
    avoid: ["Southeast"],
  },
  study_room: {
    ideal: ["East", "Northeast", "North"],
    acceptable: ["West"],
    avoid: ["South", "Southwest"],
  },
  staircase: {
    ideal: ["Southwest", "South", "West"],
    acceptable: ["Northwest"],
    avoid: ["Northeast", "North", "East"],
  },
  garden: {
    ideal: ["North", "East", "Northeast"],
    acceptable: ["Northwest"],
    avoid: ["Southwest", "South"],
  },
  garage: {
    ideal: ["Northwest", "Southeast"],
    acceptable: ["Southwest"],
    avoid: ["Northeast"],
  },
  storage: {
    ideal: ["Southwest", "South", "West"],
    acceptable: ["Northwest"],
    avoid: ["Northeast", "East"],
  },
  entrance: {
    ideal: ["North", "East", "Northeast"],
    acceptable: ["Northwest", "West"],
    avoid: ["South", "Southwest", "Southeast"],
  },
}

// Entrance direction analysis
const ENTRANCE_ANALYSIS: Record<Direction, { quality: string; score: number; effects: string; remedy?: string }> = {
  North: {
    quality: "Excellent",
    score: 95,
    effects: "Brings wealth, prosperity, and career growth. Ruled by Kubera, the Lord of Wealth.",
  },
  Northeast: {
    quality: "Most Auspicious",
    score: 100,
    effects: "Brings spiritual growth, positive energy, and overall well-being. The most sacred direction in Vastu.",
  },
  East: {
    quality: "Excellent",
    score: 95,
    effects: "Brings health, vitality, social reputation, and growth. Morning sunlight enters the home.",
  },
  Southeast: {
    quality: "Moderate",
    score: 55,
    effects: "Can cause health issues and financial stress if not balanced. Fire element dominance.",
    remedy: "Place a water element near the entrance. Use green or blue colors. Avoid red at the entrance.",
  },
  South: {
    quality: "Unfavorable",
    score: 30,
    effects: "May bring obstacles, legal issues, and health problems. Ruled by Yama (Lord of Death).",
    remedy: "Install a Vastu pyramid or Swastik symbol. Use bright lighting. Place Hanuman image facing South.",
  },
  Southwest: {
    quality: "Inauspicious",
    score: 15,
    effects: "Can cause major financial losses, instability, and relationship issues. Earth element imbalance.",
    remedy: "Use heavy objects, Earth tones. Place a copper Vastu pyramid. Install bright lights at entrance. Consult a Vastu expert for structural remedies.",
  },
  West: {
    quality: "Good",
    score: 70,
    effects: "Moderate prosperity. Good for stability but may slow growth. Evening sunlight enters.",
    remedy: "Use metallic colors and wind chimes. Enhance with proper lighting.",
  },
  Northwest: {
    quality: "Good",
    score: 75,
    effects: "Brings movement, change, and social connections. Good for business contacts.",
    remedy: "Balance air element with proper ventilation. Avoid clutter.",
  },
}

// Property types and their specific considerations
const PROPERTY_TYPE_NOTES: Record<string, string> = {
  apartment: "For apartments, focus on the entrance direction relative to the building and internal layout. External landscape remedies may be limited.",
  house: "Independent houses have maximum potential for Vastu optimization including garden placement, water features, and boundary walls.",
  office: "Office Vastu emphasizes the position of the owner/leader (Southwest), reception (Northeast), and financial area (North).",
  shop: "Shop Vastu focuses on entrance (ideally North or East), cash counter placement (South or Southwest), and display areas.",
  factory: "Factory Vastu requires attention to heavy machinery placement (South/West), raw materials (Southwest), and dispatch (Northwest).",
  plot: "For vacant plots, the shape, slope, road position, and surrounding structures determine Vastu compliance.",
}

/* ────────────────────────────────────────────────────
   TOOL: ANALYZE DIRECTIONS
   ──────────────────────────────────────────────────── */
function analyzeDirections(input: {
  entrance_direction: string
  property_type?: string
  rooms?: Array<{ name: string; direction: string }>
}) {
  const entranceDir = normalizeDirection(input.entrance_direction)
  const propertyType = (input.property_type || "house").toLowerCase()
  const rooms = input.rooms || []

  // Entrance analysis
  const entranceInfo = ENTRANCE_ANALYSIS[entranceDir] || ENTRANCE_ANALYSIS.East

  // Room-by-room analysis
  const roomAnalysis = rooms.map((room) => {
    const roomType = normalizeRoomType(room.name)
    const roomDir = normalizeDirection(room.direction)
    const placement = IDEAL_ROOM_PLACEMENT[roomType]

    if (!placement) {
      return {
        room_name: room.name,
        direction: roomDir,
        status: "Unknown",
        score: 50,
        notes: "Room type not recognized for Vastu analysis. General principle: keep heavier activities in South/West, lighter in North/East.",
        remedies: [],
      }
    }

    const isIdeal = placement.ideal.includes(roomDir)
    const isAcceptable = placement.acceptable.includes(roomDir)
    const isAvoid = placement.avoid.includes(roomDir)

    let status: string
    let score: number
    let notes: string
    const remedies: string[] = []

    if (isIdeal) {
      status = "Excellent"
      score = 95
      notes = `${room.name} is ideally placed in the ${roomDir} direction as per Vastu Shastra.`
    } else if (isAcceptable) {
      status = "Acceptable"
      score = 70
      notes = `${room.name} in the ${roomDir} is acceptable. Ideal placement would be ${placement.ideal.join(" or ")}.`
      remedies.push(`Consider enhancing with ${DIRECTION_ELEMENTS[roomDir]} element balancing.`)
    } else if (isAvoid) {
      status = "Defective"
      score = 25
      notes = `${room.name} should NOT be in the ${roomDir} direction. This can cause ${getDefectEffects(roomType, roomDir)}.`
      remedies.push(...getRemedies(roomType, roomDir))
    } else {
      status = "Neutral"
      score = 55
      notes = `${room.name} in the ${roomDir} is neutral. Ideal placement: ${placement.ideal.join(" or ")}.`
    }

    return {
      room_name: room.name,
      direction: roomDir,
      element: DIRECTION_ELEMENTS[roomDir],
      ruling_deity: DIRECTION_DEITIES[roomDir],
      status,
      score,
      notes,
      ideal_directions: placement.ideal,
      remedies,
    }
  })

  // Overall score calculation
  const roomScores = roomAnalysis.map((r) => r.score)
  const entranceScore = entranceInfo.score
  const allScores = [entranceScore, ...roomScores]
  const overallScore = allScores.length > 0
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : entranceScore

  // Overall rating
  let overallRating: string
  if (overallScore >= 85) overallRating = "Excellent Vastu Compliance"
  else if (overallScore >= 70) overallRating = "Good — Minor Corrections Needed"
  else if (overallScore >= 50) overallRating = "Average — Several Improvements Recommended"
  else if (overallScore >= 30) overallRating = "Below Average — Significant Vastu Defects"
  else overallRating = "Poor — Major Vastu Corrections Required"

  return {
    property_type: propertyType,
    property_notes: PROPERTY_TYPE_NOTES[propertyType] || PROPERTY_TYPE_NOTES.house,
    entrance: {
      direction: entranceDir,
      quality: entranceInfo.quality,
      score: entranceInfo.score,
      effects: entranceInfo.effects,
      remedy: entranceInfo.remedy || null,
      ruling_deity: DIRECTION_DEITIES[entranceDir],
      ruling_planet: DIRECTION_PLANETS[entranceDir],
    },
    rooms: roomAnalysis,
    overall_score: overallScore,
    overall_rating: overallRating,
    general_tips: [
      "Keep the Northeast corner clean, open, and clutter-free — it is the most sacred zone.",
      "The center of the home (Brahmasthan) should be open and free of pillars or heavy objects.",
      "Ensure the Southwest is the heaviest part of the home — place master bedroom or heavy furniture here.",
      "Water elements (fountains, aquariums) work best in the North or Northeast.",
      "Avoid mirrors in the bedroom facing the bed.",
      "Kitchen fire (stove) should ideally face East while cooking.",
    ],
  }
}

/* ────────────────────────────────────────────────────
   TOOL: GET ELEMENT BALANCE
   ──────────────────────────────────────────────────── */
function getElementBalance(input: { directions_used: string[] }) {
  const directions = input.directions_used.map(normalizeDirection)

  // Count element representation
  const elementCount: Record<string, number> = {
    Fire: 0,
    Water: 0,
    Earth: 0,
    Air: 0,
    Ether: 0,
  }

  const directionDetails: Array<{ direction: string; element: string; deity: string; planet: string }> = []

  for (const dir of directions) {
    const element = DIRECTION_ELEMENTS[dir] || "Unknown"
    // Handle compound elements like "Water/Ether"
    const parts = element.split("/")
    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed === "Space") {
        elementCount.Ether = (elementCount.Ether || 0) + 1
      } else if (elementCount[trimmed] !== undefined) {
        elementCount[trimmed]++
      }
    }
    directionDetails.push({
      direction: dir,
      element,
      deity: DIRECTION_DEITIES[dir] || "Unknown",
      planet: DIRECTION_PLANETS[dir] || "Unknown",
    })
  }

  // Analyze balance
  const total = Object.values(elementCount).reduce((a, b) => a + b, 0) || 1
  const distribution = Object.entries(elementCount).map(([element, count]) => ({
    element,
    count,
    percentage: Math.round((count / total) * 100),
  }))

  // Identify imbalances
  const imbalances: Array<{ element: string; status: string; suggestion: string }> = []
  const idealPercentage = 20 // Each of 5 elements should be ~20%

  for (const { element, percentage } of distribution) {
    if (percentage > idealPercentage + 15) {
      imbalances.push({
        element,
        status: "Excess",
        suggestion: getElementExcessRemedy(element),
      })
    } else if (percentage < idealPercentage - 15 && percentage === 0) {
      imbalances.push({
        element,
        status: "Deficient",
        suggestion: getElementDeficiencyRemedy(element),
      })
    }
  }

  // Determine overall element harmony
  const hasExcess = imbalances.some((i) => i.status === "Excess")
  const hasDeficiency = imbalances.some((i) => i.status === "Deficient")
  let harmonyStatus: string
  if (!hasExcess && !hasDeficiency) {
    harmonyStatus = "Balanced — All five elements are well-represented"
  } else if (hasExcess && hasDeficiency) {
    harmonyStatus = "Imbalanced — Some elements are excess while others are missing"
  } else if (hasExcess) {
    harmonyStatus = "Partially Imbalanced — Some elements are overrepresented"
  } else {
    harmonyStatus = "Partially Imbalanced — Some elements are underrepresented"
  }

  return {
    directions_analyzed: directionDetails,
    element_distribution: distribution,
    imbalances,
    harmony_status: harmonyStatus,
    pancha_bhuta_guide: {
      Earth: "Stability, grounding. Enhance with crystals, heavy objects, yellow/brown colors. Direction: Southwest.",
      Water: "Flow, purification. Enhance with water features, aquariums, blue colors. Direction: North/Northeast.",
      Fire: "Energy, transformation. Enhance with candles, lamps, red/orange colors. Direction: Southeast.",
      Air: "Movement, freshness. Enhance with wind chimes, open windows, green colors. Direction: Northwest/East.",
      Ether: "Space, consciousness. Enhance with open spaces, light, white/violet colors. Direction: Center (Brahmasthan).",
    },
    remedies_summary: imbalances.length > 0
      ? imbalances.map((i) => `${i.element} (${i.status}): ${i.suggestion}`).join("\n")
      : "Your space has good elemental balance. Maintain by keeping the Brahmasthan (center) open and clutter-free.",
  }
}

/* ────────────────────────────────────────────────────
   TOOL: SAVE ASSESSMENT
   ──────────────────────────────────────────────────── */
async function saveAssessment(input: {
  user_id: string
  property_type: string
  entrance_direction: string
  rooms: unknown[]
  analysis: unknown
  element_balance: unknown
  overall_score: number
  recommendations: string
}) {
  const sb = getSupabase()
  try {
    await sb.from("vastu_assessments").insert({
      user_id: input.user_id,
      property_type: input.property_type,
      entrance_direction: input.entrance_direction,
      room_details: input.rooms,
      analysis_data: input.analysis,
      element_balance: input.element_balance,
      overall_score: input.overall_score,
      recommendations: input.recommendations,
    })
    return { saved: true }
  } catch (err) {
    console.warn("Failed to save vastu assessment:", err)
    return { saved: false }
  }
}

/* ────────────────────────────────────────────────────
   HELPER FUNCTIONS
   ──────────────────────────────────────────────────── */
function normalizeDirection(dir: string): Direction {
  const normalized = dir.trim().toLowerCase().replace(/[\s-]+/g, "")
  const map: Record<string, Direction> = {
    north: "North", n: "North",
    northeast: "Northeast", ne: "Northeast",
    east: "East", e: "East",
    southeast: "Southeast", se: "Southeast",
    south: "South", s: "South",
    southwest: "Southwest", sw: "Southwest",
    west: "West", w: "West",
    northwest: "Northwest", nw: "Northwest",
  }
  return map[normalized] || "North"
}

function normalizeRoomType(name: string): string {
  const lower = name.toLowerCase().replace(/[\s_-]+/g, "_")
  const aliases: Record<string, string> = {
    bedroom: "master_bedroom",
    master_bedroom: "master_bedroom",
    main_bedroom: "master_bedroom",
    kitchen: "kitchen",
    cooking: "kitchen",
    pooja: "pooja_room",
    pooja_room: "pooja_room",
    prayer_room: "pooja_room",
    temple: "pooja_room",
    mandir: "pooja_room",
    living: "living_room",
    living_room: "living_room",
    drawing_room: "living_room",
    hall: "living_room",
    children: "children_bedroom",
    children_bedroom: "children_bedroom",
    kids_room: "children_bedroom",
    child_bedroom: "children_bedroom",
    guest: "guest_bedroom",
    guest_bedroom: "guest_bedroom",
    guest_room: "guest_bedroom",
    bathroom: "bathroom",
    washroom: "bathroom",
    toilet: "toilet",
    restroom: "toilet",
    dining: "dining_room",
    dining_room: "dining_room",
    study: "study_room",
    study_room: "study_room",
    office: "study_room",
    home_office: "study_room",
    staircase: "staircase",
    stairs: "staircase",
    garden: "garden",
    lawn: "garden",
    balcony: "garden",
    terrace: "garden",
    garage: "garage",
    parking: "garage",
    storage: "storage",
    store_room: "storage",
    entrance: "entrance",
    main_door: "entrance",
    main_entrance: "entrance",
    door: "entrance",
  }
  return aliases[lower] || lower
}

function getDefectEffects(roomType: string, direction: Direction): string {
  const effects: Record<string, Record<string, string>> = {
    kitchen: {
      Northeast: "spiritual energy depletion and health issues",
      Southwest: "financial stress and digestive problems",
    },
    master_bedroom: {
      Northeast: "disturbed sleep and spiritual restlessness",
      Southeast: "arguments between couples, fire-related risks",
    },
    pooja_room: {
      South: "negative spiritual energy and obstacles in prayers",
      Southwest: "heavy, stagnant spiritual energy",
      Southeast: "excess fire element disrupting meditation",
    },
    bathroom: {
      Northeast: "wealth drain and negative energy accumulation",
      East: "health deterioration and blocked opportunities",
      Southwest: "instability and heavy negative energy",
    },
  }
  return effects[roomType]?.[direction] || "imbalanced energy flow and potential obstacles"
}

function getRemedies(roomType: string, direction: Direction): string[] {
  const common = [
    `Consider relocating ${roomType.replace(/_/g, " ")} to ${IDEAL_ROOM_PLACEMENT[roomType]?.ideal.join(" or ") || "a more favorable direction"} if structurally possible.`,
  ]

  // Direction-specific remedies
  if (direction === "Northeast") {
    common.push("Keep this area extremely clean and well-lit.")
    common.push("Place a small water feature or Tulsi plant here.")
  } else if (direction === "Southwest") {
    common.push("Place heavy furniture or stones in this zone to ground the energy.")
    common.push("Use earthy colors (yellow, brown, beige) in this area.")
  } else if (direction === "Southeast") {
    common.push("Balance fire energy with cooling elements — light blue colors, water bowl.")
    common.push("Avoid storing flammable materials in excess here.")
  }

  // Room-specific remedies
  if (roomType === "kitchen" && direction === "Northeast") {
    common.push("If kitchen cannot be moved, ensure the cooking stove faces East.")
    common.push("Place a Vastu salt bowl in the Northeast corner of the kitchen.")
  }
  if (roomType === "bathroom" && direction === "Northeast") {
    common.push("Keep the bathroom door always closed.")
    common.push("Place a Vastu pyramid on the outer wall of the bathroom.")
    common.push("Use sea salt in the bathroom regularly for energy cleansing.")
  }

  return common
}

function getElementExcessRemedy(element: string): string {
  const remedies: Record<string, string> = {
    Fire: "Reduce fire intensity with water elements (small fountain, blue decor). Avoid excess red/orange colors. Add indoor plants.",
    Water: "Balance with Earth elements (crystals, pottery). Ensure proper drainage. Reduce blue tones, add warm yellows.",
    Earth: "Lighten with Air elements (wind chimes, open windows). Add movement and flow. Use lighter colors.",
    Air: "Ground with Earth elements (heavy furniture, stone sculptures). Close excessive openings. Use warm, earthy tones.",
    Ether: "Fill empty spaces mindfully. Add furniture and functional items. Use soft, warm lighting.",
  }
  return remedies[element] || "Balance by enhancing the deficient elements."
}

function getElementDeficiencyRemedy(element: string): string {
  const remedies: Record<string, string> = {
    Fire: "Add candles, diyas, or a fireplace in the Southeast. Use warm lighting. Introduce red/orange accents.",
    Water: "Place a water feature or aquarium in the North/Northeast. Use blue decor. Add rounded shapes.",
    Earth: "Add crystals, clay pots, or stone elements in the Southwest. Use yellow/brown colors. Display earthenware.",
    Air: "Improve ventilation in the East/Northwest. Add wind chimes. Use light curtains. Keep windows open.",
    Ether: "Create open space in the center (Brahmasthan). Remove clutter. Use white/violet tones. Add skylight if possible.",
  }
  return remedies[element] || "Introduce this element through appropriate colors, materials, and placement."
}

/* ────────────────────────────────────────────────────
   TOOL DEFINITIONS
   ──────────────────────────────────────────────────── */
export const VASTU_TOOL_DEFINITIONS: Tool[] = [
  {
    name: "analyze_directions",
    description:
      "Analyze a property's Vastu compliance based on entrance direction and room placements. Evaluates each room against ideal Vastu positions and provides a comprehensive assessment with scores and remedies.",
    input_schema: {
      type: "object" as const,
      properties: {
        entrance_direction: {
          type: "string",
          description: "The main entrance direction (e.g., 'North', 'Northeast', 'East', 'SE')",
        },
        property_type: {
          type: "string",
          description: "Type of property: 'house', 'apartment', 'office', 'shop', 'factory', 'plot'",
          enum: ["house", "apartment", "office", "shop", "factory", "plot"],
        },
        rooms: {
          type: "array",
          description: "Array of rooms with their directions",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Room name (e.g., 'kitchen', 'master bedroom', 'pooja room')" },
              direction: { type: "string", description: "Direction where the room is located" },
            },
            required: ["name", "direction"],
          },
        },
      },
      required: ["entrance_direction"],
    },
  },
  {
    name: "get_element_balance",
    description:
      "Analyze the Pancha Bhuta (five element) balance in a space based on which directions are occupied. Returns element distribution, imbalances, and balancing remedies.",
    input_schema: {
      type: "object" as const,
      properties: {
        directions_used: {
          type: "array",
          description: "Array of directions that have rooms or significant features (e.g., ['North', 'East', 'Southeast', 'Southwest'])",
          items: { type: "string" },
        },
      },
      required: ["directions_used"],
    },
  },
  {
    name: "save_vastu_assessment",
    description: "Save a completed Vastu assessment to the database for the user's records.",
    input_schema: {
      type: "object" as const,
      properties: {
        user_id: { type: "string" },
        property_type: { type: "string" },
        entrance_direction: { type: "string" },
        rooms: { type: "array", description: "Room layout data" },
        analysis: { type: "object", description: "Complete analysis results" },
        element_balance: { type: "object", description: "Element balance data" },
        overall_score: { type: "number", description: "Overall Vastu score (0-100)" },
        recommendations: { type: "string", description: "Summary of recommendations" },
      },
      required: ["user_id", "property_type", "entrance_direction", "overall_score", "recommendations"],
    },
  },
]

/* ────────────────────────────────────────────────────
   TOOL EXECUTOR
   ──────────────────────────────────────────────────── */
export async function executeVastuTool(
  toolName: string,
  toolInput: Record<string, unknown>,
  userId?: string
): Promise<unknown> {
  switch (toolName) {
    case "analyze_directions":
      return analyzeDirections(
        toolInput as { entrance_direction: string; property_type?: string; rooms?: Array<{ name: string; direction: string }> }
      )
    case "get_element_balance":
      return getElementBalance(toolInput as { directions_used: string[] })
    case "save_vastu_assessment":
      return saveAssessment({
        ...(toolInput as Parameters<typeof saveAssessment>[0]),
        user_id: userId || (toolInput as { user_id: string }).user_id,
      })
    default:
      return { error: `Unknown vastu tool: ${toolName}` }
  }
}
