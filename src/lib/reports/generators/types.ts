/* ════════════════════════════════════════════════════════
   GrahAI — Code-Based Report Generator Types
   Shared types for all report generators
   ════════════════════════════════════════════════════════ */

export interface ReportSection {
  title: string
  content: string
  highlights?: string[]
}

export interface ReportRemedy {
  type: string
  description: string
}

export interface GeneratedReport {
  summary: string
  sections: ReportSection[]
  remedies?: ReportRemedy[]
}

// Planet-to-remedy mapping for Vedic remedies
export const PLANET_MANTRAS: Record<string, { mantra: string; count: string; day: string }> = {
  Sun:     { mantra: "Om Suryaya Namaha", count: "108 times daily", day: "Sunday" },
  Moon:    { mantra: "Om Chandraya Namaha", count: "108 times daily", day: "Monday" },
  Mars:    { mantra: "Om Mangalaya Namaha", count: "108 times daily", day: "Tuesday" },
  Mercury: { mantra: "Om Budhaya Namaha", count: "108 times daily", day: "Wednesday" },
  Jupiter: { mantra: "Om Gurave Namaha", count: "108 times daily", day: "Thursday" },
  Venus:   { mantra: "Om Shukraya Namaha", count: "108 times daily", day: "Friday" },
  Saturn:  { mantra: "Om Shanaishcharaya Namaha", count: "108 times daily", day: "Saturday" },
  Rahu:    { mantra: "Om Rahave Namaha", count: "108 times daily", day: "Saturday" },
  Ketu:    { mantra: "Om Ketave Namaha", count: "108 times daily", day: "Tuesday" },
}

export const PLANET_GEMSTONES: Record<string, { gem: string; metal: string; finger: string }> = {
  Sun:     { gem: "Ruby (Manik)", metal: "Gold", finger: "Ring finger, right hand" },
  Moon:    { gem: "Pearl (Moti)", metal: "Silver", finger: "Little finger, right hand" },
  Mars:    { gem: "Red Coral (Moonga)", metal: "Gold/Copper", finger: "Ring finger, right hand" },
  Mercury: { gem: "Emerald (Panna)", metal: "Gold", finger: "Little finger, right hand" },
  Jupiter: { gem: "Yellow Sapphire (Pukhraj)", metal: "Gold", finger: "Index finger, right hand" },
  Venus:   { gem: "Diamond (Heera) or White Sapphire", metal: "Silver/Platinum", finger: "Ring finger, right hand" },
  Saturn:  { gem: "Blue Sapphire (Neelam)", metal: "Silver/Iron", finger: "Middle finger, right hand" },
  Rahu:    { gem: "Hessonite (Gomed)", metal: "Silver", finger: "Middle finger, right hand" },
  Ketu:    { gem: "Cat's Eye (Lehsunia)", metal: "Silver", finger: "Ring finger, left hand" },
}

export const DIGNITY_LABELS: Record<string, string> = {
  exalted: "exalted (strongest placement)",
  moolatrikona: "in Moolatrikona (very strong)",
  own: "in own sign (strong and comfortable)",
  friendly: "in a friendly sign (well-supported)",
  neutral: "in a neutral sign",
  enemy: "in an enemy sign (challenged)",
  debilitated: "debilitated (weakened placement)",
}

export const HOUSE_LIFE_AREAS: Record<number, string> = {
  1: "self, personality, physical body, and overall life direction",
  2: "wealth, family, speech, food habits, and accumulated resources",
  3: "courage, communication, siblings, short travels, and self-effort",
  4: "home, mother, emotional peace, property, vehicles, and inner happiness",
  5: "intelligence, children, creativity, romance, speculation, and past-life merit",
  6: "health challenges, enemies, debts, service, daily work routine, and competition",
  7: "marriage, partnerships, business associations, and public dealings",
  8: "longevity, transformation, sudden events, inheritance, occult, and hidden matters",
  9: "fortune, higher learning, spirituality, father, long travels, and dharma",
  10: "career, profession, public reputation, authority, and life achievements",
  11: "gains, income, social networks, elder siblings, and fulfillment of desires",
  12: "expenses, losses, foreign lands, spiritual liberation, sleep, and hidden enemies",
}
