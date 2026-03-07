import { createClient } from "@supabase/supabase-js"
import type { Tool } from "@anthropic-ai/sdk/resources/messages"

/* ────────────────────────────────────────────────────
   NUMEROLOGY TOOLS — Life Path, Name Analysis, Cycles
   Anka Vidya's computational capabilities
   ──────────────────────────────────────────────────── */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

/* ────────────────────────────────────────────────────
   CONSTANTS — Number Systems
   ──────────────────────────────────────────────────── */
const PYTHAGOREAN_MAP: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
}

const CHALDEAN_MAP: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 8, g: 3, h: 5, i: 1,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 7, p: 8, q: 1, r: 2,
  s: 3, t: 4, u: 6, v: 6, w: 6, x: 5, y: 1, z: 7,
}

const VOWELS = new Set(["a", "e", "i", "o", "u"])

const LIFE_PATH_MEANINGS: Record<number, string> = {
  1: "The Leader — Independent, pioneering, ambitious. You are born to lead and innovate. Strong willpower and determination drive you toward original achievements.",
  2: "The Diplomat — Cooperative, sensitive, balanced. You thrive in partnerships and bring harmony to every situation. Natural mediator with deep intuition.",
  3: "The Creative — Expressive, artistic, joyful. Communication is your gift. Whether writing, speaking, or performing, you inspire others with your creativity.",
  4: "The Builder — Practical, disciplined, hardworking. You create lasting structures and systems. Reliability and dedication are your greatest strengths.",
  5: "The Freedom Seeker — Adventurous, versatile, dynamic. Change is your ally. You learn through experience and bring excitement wherever you go.",
  6: "The Nurturer — Responsible, loving, protective. Home and family are central to your purpose. You heal and support those around you naturally.",
  7: "The Seeker — Analytical, introspective, spiritual. Truth and wisdom drive you. Deep thinker with a connection to the metaphysical realm.",
  8: "The Powerhouse — Ambitious, authoritative, material mastery. Business acumen and leadership come naturally. You understand the flow of abundance.",
  9: "The Humanitarian — Compassionate, selfless, wise. Universal love and service define your path. You see the bigger picture and work for collective good.",
  11: "Master Number 11: The Intuitive — Highly spiritual, visionary, inspirational. You channel higher wisdom and illuminate the path for others. Carries the energy of 2 amplified.",
  22: "Master Number 22: The Master Builder — Turns dreams into reality on a grand scale. Combines spiritual insight with practical genius. The most powerful number in numerology.",
  33: "Master Number 33: The Master Teacher — Supreme compassion and healing. Selfless devotion to uplifting humanity. Extremely rare and carries immense spiritual responsibility.",
}

/* ────────────────────────────────────────────────────
   CORE REDUCTION FUNCTION
   ──────────────────────────────────────────────────── */
function reduceToSingleDigit(num: number, preserveMasters: boolean = true): { result: number; steps: string[] } {
  const steps: string[] = []
  let current = num

  while (current > 9) {
    if (preserveMasters && [11, 22, 33].includes(current)) {
      steps.push(`${current} is a Master Number — preserved`)
      break
    }
    const digits = String(current).split("").map(Number)
    const sum = digits.reduce((a, b) => a + b, 0)
    steps.push(`${digits.join(" + ")} = ${sum}`)
    current = sum
  }

  return { result: current, steps }
}

/* ────────────────────────────────────────────────────
   TOOL: CALCULATE LIFE PATH NUMBER
   ──────────────────────────────────────────────────── */
function calculateLifePath(input: { birth_date: string }) {
  const dateParts = input.birth_date.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (!dateParts) return { error: "Invalid date format. Please use YYYY-MM-DD." }

  const year = parseInt(dateParts[1])
  const month = parseInt(dateParts[2])
  const day = parseInt(dateParts[3])

  // Reduce each component separately (correct method)
  const monthReduction = reduceToSingleDigit(month)
  const dayReduction = reduceToSingleDigit(day)
  const yearReduction = reduceToSingleDigit(year)

  const sum = monthReduction.result + dayReduction.result + yearReduction.result
  const finalReduction = reduceToSingleDigit(sum)

  const lifePathNumber = finalReduction.result

  const calculationSteps = [
    `Birth Date: ${month}/${day}/${year}`,
    `Month: ${month} → ${monthReduction.result}${monthReduction.steps.length ? ` (${monthReduction.steps.join(", ")})` : ""}`,
    `Day: ${day} → ${dayReduction.result}${dayReduction.steps.length ? ` (${dayReduction.steps.join(", ")})` : ""}`,
    `Year: ${year} → ${yearReduction.result} (${yearReduction.steps.join(", ")})`,
    `Sum: ${monthReduction.result} + ${dayReduction.result} + ${yearReduction.result} = ${sum}`,
    ...finalReduction.steps.map(s => `Final reduction: ${s}`),
    `Life Path Number: ${lifePathNumber}`,
  ]

  return {
    life_path_number: lifePathNumber,
    is_master_number: [11, 22, 33].includes(lifePathNumber),
    calculation_steps: calculationSteps,
    meaning: LIFE_PATH_MEANINGS[lifePathNumber] || "A unique path of personal discovery.",
    compatible_numbers: getCompatibleNumbers(lifePathNumber),
    lucky_colors: getLuckyColors(lifePathNumber),
    ruling_planet: getRulingPlanet(lifePathNumber),
  }
}

/* ────────────────────────────────────────────────────
   TOOL: CALCULATE NAME NUMBERS
   ──────────────────────────────────────────────────── */
function calculateNameNumbers(input: { full_name: string }) {
  const name = input.full_name.toLowerCase().replace(/[^a-z\s]/g, "")
  const letters = name.replace(/\s/g, "").split("")

  if (letters.length === 0) return { error: "Please provide a valid name with alphabetic characters." }

  // Destiny Number (all letters - Pythagorean)
  const allValues = letters.map(l => PYTHAGOREAN_MAP[l] || 0)
  const destinySum = allValues.reduce((a, b) => a + b, 0)
  const destinyReduction = reduceToSingleDigit(destinySum)

  // Soul Urge (vowels only)
  const vowelValues = letters.filter(l => VOWELS.has(l)).map(l => PYTHAGOREAN_MAP[l] || 0)
  const soulSum = vowelValues.reduce((a, b) => a + b, 0)
  const soulReduction = reduceToSingleDigit(soulSum)

  // Personality Number (consonants only)
  const consonantValues = letters.filter(l => !VOWELS.has(l)).map(l => PYTHAGOREAN_MAP[l] || 0)
  const personalitySum = consonantValues.reduce((a, b) => a + b, 0)
  const personalityReduction = reduceToSingleDigit(personalitySum)

  // Chaldean Name Number
  const chaldeanValues = letters.map(l => CHALDEAN_MAP[l] || 0)
  const chaldeanSum = chaldeanValues.reduce((a, b) => a + b, 0)
  const chaldeanReduction = reduceToSingleDigit(chaldeanSum, false)

  // Missing numbers (karmic lessons)
  const presentDigits = new Set(allValues)
  const missingNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !presentDigits.has(n))

  const letterBreakdown = letters.map(l => `${l.toUpperCase()}=${PYTHAGOREAN_MAP[l] || "?"}`).join(", ")

  return {
    name_analyzed: input.full_name,
    pythagorean_system: {
      destiny_number: destinyReduction.result,
      soul_urge_number: soulReduction.result,
      personality_number: personalityReduction.result,
      letter_breakdown: letterBreakdown,
      calculation_steps: [
        `All letters: ${allValues.join(" + ")} = ${destinySum} → ${destinyReduction.result}`,
        `Vowels (${letters.filter(l => VOWELS.has(l)).join(", ")}): ${vowelValues.join(" + ")} = ${soulSum} → ${soulReduction.result}`,
        `Consonants: ${consonantValues.join(" + ")} = ${personalitySum} → ${personalityReduction.result}`,
      ],
    },
    chaldean_system: {
      name_number: chaldeanReduction.result,
      calculation: `Chaldean values: ${chaldeanValues.join(" + ")} = ${chaldeanSum} → ${chaldeanReduction.result}`,
    },
    karmic_lessons: {
      missing_numbers: missingNumbers,
      interpretation: missingNumbers.length > 0
        ? `Missing numbers ${missingNumbers.join(", ")} indicate karmic lessons to develop in this lifetime.`
        : "No missing numbers — a well-rounded karmic profile.",
    },
    meanings: {
      destiny: `Destiny ${destinyReduction.result}: Your life's purpose and the talents you're meant to develop.`,
      soul_urge: `Soul Urge ${soulReduction.result}: Your inner desires, motivations, and what truly drives you.`,
      personality: `Personality ${personalityReduction.result}: How others perceive you and your outward expression.`,
    },
  }
}

/* ────────────────────────────────────────────────────
   TOOL: CALCULATE PERSONAL YEAR
   ──────────────────────────────────────────────────── */
function calculatePersonalYear(input: { birth_date: string; target_date?: string }) {
  const birthParts = input.birth_date.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (!birthParts) return { error: "Invalid birth date format." }

  const birthMonth = parseInt(birthParts[2])
  const birthDay = parseInt(birthParts[3])

  const target = input.target_date ? new Date(input.target_date) : new Date()
  const targetYear = target.getFullYear()
  const targetMonth = target.getMonth() + 1

  // Personal Year = birth month + birth day + current year
  const yearSum = birthMonth + birthDay + targetYear
  const yearReduction = reduceToSingleDigit(yearSum)

  // Personal Month = personal year + current month
  const monthSum = yearReduction.result + targetMonth
  const monthReduction = reduceToSingleDigit(monthSum, false)

  // Personal Day
  const targetDay = target.getDate()
  const daySum = monthReduction.result + targetDay
  const dayReduction = reduceToSingleDigit(daySum, false)

  const personalYearMeanings: Record<number, string> = {
    1: "New beginnings, fresh starts, planting seeds. A year to initiate projects and assert independence.",
    2: "Patience, partnerships, diplomacy. Focus on relationships and cooperation. Things develop slowly.",
    3: "Creativity, self-expression, joy. A social year full of inspiration and communication.",
    4: "Hard work, foundation building, discipline. Put in the effort now for future rewards.",
    5: "Change, freedom, adventure. Expect the unexpected. Travel and new experiences abound.",
    6: "Home, family, responsibility. Focus on loved ones and domestic harmony.",
    7: "Introspection, spirituality, study. A year for inner growth and seeking deeper truths.",
    8: "Power, abundance, material success. Career advancement and financial gains are highlighted.",
    9: "Completion, letting go, humanitarian service. End old cycles to make room for the new.",
  }

  return {
    personal_year: yearReduction.result,
    personal_month: monthReduction.result,
    personal_day: dayReduction.result,
    target_period: `${targetYear}`,
    calculation: [
      `Personal Year: ${birthMonth} + ${birthDay} + ${targetYear} = ${yearSum} → ${yearReduction.result}`,
      `Personal Month: ${yearReduction.result} + ${targetMonth} = ${monthSum} → ${monthReduction.result}`,
      `Personal Day: ${monthReduction.result} + ${targetDay} = ${daySum} → ${dayReduction.result}`,
    ],
    year_meaning: personalYearMeanings[yearReduction.result] || "A unique yearly cycle.",
    advice: `You are in Personal Year ${yearReduction.result}, Month ${monthReduction.result}. Align your actions with this energy for optimal results.`,
  }
}

/* ────────────────────────────────────────────────────
   TOOL: SAVE NUMEROLOGY PROFILE
   ──────────────────────────────────────────────────── */
async function saveNumerologyProfile(input: {
  user_id: string
  full_name: string
  birth_date: string
  life_path: number
  destiny_number: number
  soul_urge: number
  personality_number: number
}) {
  const sb = getSupabase()
  try {
    await sb.from("numerology_profiles").insert({
      user_id: input.user_id,
      full_name: input.full_name,
      birth_date: input.birth_date,
      life_path_number: input.life_path,
      destiny_number: input.destiny_number,
      soul_urge_number: input.soul_urge,
      personality_number: input.personality_number,
    })
    return { saved: true, message: "Numerology profile saved successfully." }
  } catch (err) {
    console.warn("Failed to save numerology profile:", err)
    return { saved: false, message: "Could not save profile, but calculations are valid." }
  }
}

/* ────────────────────────────────────────────────────
   HELPER FUNCTIONS
   ──────────────────────────────────────────────────── */
function getCompatibleNumbers(lifePathNum: number): number[] {
  const compatibility: Record<number, number[]> = {
    1: [1, 3, 5], 2: [2, 4, 8], 3: [1, 3, 5], 4: [2, 4, 8], 5: [1, 3, 5],
    6: [2, 6, 9], 7: [3, 5, 7], 8: [2, 4, 8], 9: [3, 6, 9],
    11: [2, 4, 6], 22: [4, 6, 8], 33: [6, 9, 11],
  }
  return compatibility[lifePathNum] || [1, 5, 7]
}

function getLuckyColors(num: number): string[] {
  const colors: Record<number, string[]> = {
    1: ["Red", "Gold", "Orange"], 2: ["White", "Silver", "Light Green"],
    3: ["Yellow", "Purple", "Mauve"], 4: ["Blue", "Grey", "Indigo"],
    5: ["Light Grey", "White", "Silver"], 6: ["Pink", "Blue", "Green"],
    7: ["White", "Light Yellow", "Light Green"], 8: ["Dark Grey", "Black", "Purple"],
    9: ["Red", "Crimson", "Pink"], 11: ["Silver", "White", "Violet"],
    22: ["Gold", "Coral", "Cream"], 33: ["Turquoise", "Silver", "Green"],
  }
  return colors[num] || ["Blue", "White"]
}

function getRulingPlanet(num: number): string {
  const planets: Record<number, string> = {
    1: "Sun (Surya)", 2: "Moon (Chandra)", 3: "Jupiter (Guru)",
    4: "Rahu (North Node)", 5: "Mercury (Budha)", 6: "Venus (Shukra)",
    7: "Ketu (South Node)", 8: "Saturn (Shani)", 9: "Mars (Mangal)",
    11: "Moon/Neptune", 22: "Rahu/Uranus", 33: "Jupiter/Neptune",
  }
  return planets[num] || "Mixed influences"
}

/* ────────────────────────────────────────────────────
   TOOL DEFINITIONS
   ──────────────────────────────────────────────────── */
export const NUMEROLOGY_TOOL_DEFINITIONS: Tool[] = [
  {
    name: "calculate_life_path",
    description: "Calculate the Life Path number from a birth date. The Life Path is the most important number in numerology, revealing your life's purpose and the lessons you'll learn.",
    input_schema: {
      type: "object" as const,
      properties: {
        birth_date: { type: "string", description: "Birth date in YYYY-MM-DD format" },
      },
      required: ["birth_date"],
    },
  },
  {
    name: "calculate_name_numbers",
    description: "Analyze a name using both Pythagorean and Chaldean numerology systems. Calculates Destiny, Soul Urge, and Personality numbers, plus identifies karmic lessons from missing numbers.",
    input_schema: {
      type: "object" as const,
      properties: {
        full_name: { type: "string", description: "Full name as on birth certificate" },
      },
      required: ["full_name"],
    },
  },
  {
    name: "calculate_personal_year",
    description: "Calculate the current Personal Year, Month, and Day cycles. These cycles reveal the energy and themes of the current period.",
    input_schema: {
      type: "object" as const,
      properties: {
        birth_date: { type: "string", description: "Birth date in YYYY-MM-DD format" },
        target_date: { type: "string", description: "Optional: specific date to calculate for (YYYY-MM-DD). Defaults to today." },
      },
      required: ["birth_date"],
    },
  },
  {
    name: "save_numerology_profile",
    description: "Save a computed numerology profile to the database for future reference.",
    input_schema: {
      type: "object" as const,
      properties: {
        user_id: { type: "string" },
        full_name: { type: "string" },
        birth_date: { type: "string" },
        life_path: { type: "number" },
        destiny_number: { type: "number" },
        soul_urge: { type: "number" },
        personality_number: { type: "number" },
      },
      required: ["user_id", "full_name", "birth_date", "life_path", "destiny_number", "soul_urge", "personality_number"],
    },
  },
]

/* ────────────────────────────────────────────────────
   TOOL EXECUTOR
   ──────────────────────────────────────────────────── */
export async function executeNumerologyTool(
  toolName: string,
  toolInput: Record<string, unknown>,
  userId?: string
): Promise<unknown> {
  switch (toolName) {
    case "calculate_life_path":
      return calculateLifePath(toolInput as { birth_date: string })
    case "calculate_name_numbers":
      return calculateNameNumbers(toolInput as { full_name: string })
    case "calculate_personal_year":
      return calculatePersonalYear(toolInput as { birth_date: string; target_date?: string })
    case "save_numerology_profile":
      return saveNumerologyProfile({ ...toolInput as Parameters<typeof saveNumerologyProfile>[0], user_id: userId || (toolInput as { user_id: string }).user_id })
    default:
      return { error: `Unknown numerology tool: ${toolName}` }
  }
}
