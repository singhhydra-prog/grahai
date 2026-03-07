/* ════════════════════════════════════════════════════════
   GrahAI — Classical Text References Database
   BPHS, Saravali, Phaladeepika, Jataka Parijata

   Every yoga, dosha, and interpretation is backed by
   specific chapter/verse references from classical texts.
   ════════════════════════════════════════════════════════ */

import type { ClassicalReference } from "../ephemeris/types"

// ─── Reference Lookup Maps ─────────────────────────────

/** Yoga references — maps yoga name to classical citation */
export const YOGA_REFERENCES: Record<string, ClassicalReference> = {
  // ── Panch Mahapurush Yogas ──
  "Ruchaka Yoga": {
    source: "BPHS", chapter: 75, verse: 1,
    sanskrit: "कुजे केन्द्रगते स्वोच्चे स्वक्षेत्रे रुचकाभिधः",
    translation: "When Mars is in a Kendra in its own or exalted sign, Ruchaka Yoga is formed. The native will be valorous, famous, and a leader.",
  },
  "Bhadra Yoga": {
    source: "BPHS", chapter: 75, verse: 2,
    sanskrit: "बुधे केन्द्रगते स्वोच्चे स्वक्षेत्रे भद्रसंज्ञकः",
    translation: "When Mercury is in a Kendra in its own or exalted sign, Bhadra Yoga is formed. The native will be learned, eloquent, and prosperous.",
  },
  "Hamsa Yoga": {
    source: "BPHS", chapter: 75, verse: 3,
    sanskrit: "गुरौ केन्द्रगते स्वोच्चे स्वक्षेत्रे हंसनामकः",
    translation: "When Jupiter is in a Kendra in its own or exalted sign, Hamsa Yoga is formed. The native will be righteous, learned, and respected.",
  },
  "Malavya Yoga": {
    source: "BPHS", chapter: 75, verse: 4,
    sanskrit: "शुक्रे केन्द्रगते स्वोच्चे स्वक्षेत्रे मालव्यसंज्ञकः",
    translation: "When Venus is in a Kendra in its own or exalted sign, Malavya Yoga is formed. The native will be prosperous, enjoy luxuries, and be attractive.",
  },
  "Shasha Yoga": {
    source: "BPHS", chapter: 75, verse: 5,
    sanskrit: "शनौ केन्द्रगते स्वोच्चे स्वक्षेत्रे शशनामकः",
    translation: "When Saturn is in a Kendra in its own or exalted sign, Shasha Yoga is formed. The native will be powerful, authoritative, and command many servants.",
  },

  // ── Raj Yogas ──
  "Raj Yoga (Kendra-Trikona)": {
    source: "BPHS", chapter: 41, verse: 13,
    sanskrit: "केन्द्रत्रिकोणाधिपतियोगे राजयोगकारकः",
    translation: "The association of lords of Kendra and Trikona houses forms Raj Yoga, bestowing authority, status, and prosperity.",
  },

  // ── Dhan Yogas ──
  "Dhan Yoga": {
    source: "BPHS", chapter: 41, verse: 28,
    translation: "When lords of the 2nd, 5th, 9th, or 11th houses associate by conjunction, aspect, or exchange, Dhan Yoga (wealth combination) is formed.",
  },

  // ── Gajakesari Yoga ──
  "Gajakesari Yoga": {
    source: "Phaladeepika", chapter: 6, verse: 1,
    sanskrit: "चन्द्रात्केन्द्रे बृहस्पतिर्गजकेसरिसंज्ञकः",
    translation: "When Jupiter is in a Kendra from the Moon, Gajakesari Yoga is formed. The native will be wealthy, intelligent, virtuous, and famous.",
  },

  // ── Budhaditya Yoga ──
  "Budhaditya Yoga": {
    source: "Saravali", chapter: 15, verse: 2,
    translation: "When the Sun and Mercury are conjunct (and Mercury is not combust), Budhaditya Yoga is formed, giving intelligence, fame, and skill in arts.",
  },

  // ── Chandra-Mangal Yoga ──
  "Chandra-Mangal Yoga": {
    source: "Saravali", chapter: 15, verse: 7,
    translation: "When Mars and Moon are conjunct, Chandra-Mangal Yoga is formed. The native earns through unscrupulous means but accumulates wealth.",
  },

  // ── Adhi Yoga ──
  "Adhi Yoga": {
    source: "BPHS", chapter: 36, verse: 3,
    sanskrit: "चन्द्राद्यत्केन्द्रगैः शुभैरधियोगः प्रकीर्तितः",
    translation: "When benefics (Jupiter, Venus, Mercury) occupy the 6th, 7th, and 8th from Moon, Adhi Yoga is formed, giving the native authority and power.",
  },

  // ── Sunapha Yoga ──
  "Sunapha Yoga": {
    source: "BPHS", chapter: 36, verse: 1,
    translation: "When any planet (except Sun) occupies the 2nd house from Moon, Sunapha Yoga is formed. The native will be self-made, wealthy, and learned.",
  },

  // ── Anapha Yoga ──
  "Anapha Yoga": {
    source: "BPHS", chapter: 36, verse: 2,
    translation: "When any planet (except Sun) occupies the 12th house from Moon, Anapha Yoga is formed. The native will be powerful, healthy, and famous.",
  },

  // ── Vipreet Raj Yogas ──
  "Harsha Yoga": {
    source: "BPHS", chapter: 41, verse: 32,
    translation: "When the 6th lord is placed in the 6th, 8th, or 12th house, Harsha Yoga (a type of Vipreet Raj Yoga) is formed. The native overcomes enemies and enjoys happiness.",
  },
  "Sarala Yoga": {
    source: "BPHS", chapter: 41, verse: 33,
    translation: "When the 8th lord is placed in the 6th, 8th, or 12th house, Sarala Yoga is formed. The native will be long-lived, fearless, and prosperous.",
  },
  "Vimala Yoga": {
    source: "BPHS", chapter: 41, verse: 34,
    translation: "When the 12th lord is placed in the 6th, 8th, or 12th house, Vimala Yoga is formed. The native will be frugal, have a good reputation, and be happy.",
  },

  // ── Neecha Bhanga Raj Yoga ──
  "Neecha Bhanga Raj Yoga": {
    source: "Phaladeepika", chapter: 7, verse: 30,
    translation: "When a debilitated planet's debilitation is cancelled by specific conditions (its dispositor is exalted or in a kendra, the exaltation lord aspects it, etc.), Neecha Bhanga Raj Yoga is formed, transforming weakness into great strength.",
  },

  // ── Parivartana Yoga ──
  "Parivartana Yoga": {
    source: "BPHS", chapter: 41, verse: 36,
    translation: "When two planets exchange signs (each placed in the other's sign), Parivartana Yoga is formed. If between Kendra/Trikona lords, it creates a powerful Raj Yoga.",
  },

  // ── Kemdrum Yoga (inauspicious) ──
  "Kemdrum Yoga": {
    source: "BPHS", chapter: 36, verse: 4,
    sanskrit: "चन्द्रादुभयतो ग्रहैर्विरहिते केमद्रुमः कथ्यते",
    translation: "When there are no planets in the 2nd or 12th from Moon, Kemdrum Yoga is formed. The native may face poverty, hardship, and loneliness despite being born in a good family.",
  },
}

/** Dosha references */
export const DOSHA_REFERENCES: Record<string, ClassicalReference> = {
  "Mangal Dosha": {
    source: "BPHS", chapter: 77, verse: 30,
    sanskrit: "लग्ने व्यये च पाताले जामित्रे चाष्टमे कुजे। कन्या भर्तृविनाशाय भर्ता कन्याविनाशकृत्",
    translation: "When Mars occupies the 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna, Moon, or Venus, Mangal Dosha (Kuja Dosha) is formed, bringing challenges in married life.",
  },
  "Kaal Sarp Dosha": {
    source: "Jataka Parijata", chapter: 14, verse: 12,
    translation: "When all seven planets are hemmed between Rahu and Ketu, Kaal Sarp Yoga (Dosha) is formed. The native faces obstacles, delays, and struggles that require sustained effort to overcome.",
  },
  "Pitra Dosha": {
    source: "BPHS", chapter: 80, verse: 45,
    translation: "When the Sun is afflicted by Saturn or Rahu in the 9th house, or the 9th lord is weakened, Pitra Dosha manifests. The native may face ancestral karmic debts affecting family prosperity.",
  },
  "Sade Sati": {
    source: "Phaladeepika", chapter: 26, verse: 10,
    translation: "When Saturn transits through the 12th, 1st, and 2nd houses from the natal Moon (a period of approximately 7.5 years), the native undergoes Sade Sati, a testing period of transformation.",
  },
  "Chandal Yoga": {
    source: "Saravali", chapter: 33, verse: 5,
    translation: "When Jupiter conjoins Rahu or Ketu, Guru-Chandal Yoga is formed. The native may have unconventional beliefs, face issues with teachers, or gain wisdom through unorthodox means.",
  },
  "Grahan Yoga": {
    source: "BPHS", chapter: 80, verse: 55,
    translation: "When the Sun or Moon is conjoined with Rahu or Ketu, Grahan Yoga (eclipse combination) is formed. The luminaries' significations are eclipsed, affecting vitality or emotional well-being.",
  },
  "Shakat Yoga": {
    source: "Phaladeepika", chapter: 6, verse: 5,
    translation: "When Jupiter is in the 6th or 8th from Moon, Shakat Yoga is formed. The native's fortune rises and falls repeatedly like a wheel (shakat).",
  },
}

/** House interpretation references */
export const HOUSE_REFERENCES: Record<number, ClassicalReference> = {
  1: { source: "BPHS", chapter: 11, verse: 1, translation: "The 1st house (Lagna) represents the body, appearance, health, character, dignity, and the self. It is the most important house in a horoscope." },
  2: { source: "BPHS", chapter: 11, verse: 5, translation: "The 2nd house governs wealth, family, speech, food habits, right eye, face, and accumulated resources." },
  3: { source: "BPHS", chapter: 11, verse: 8, translation: "The 3rd house rules younger siblings, courage, communication, short travels, arms and shoulders, and mental determination." },
  4: { source: "BPHS", chapter: 11, verse: 11, translation: "The 4th house governs mother, home, property, vehicles, education, emotional happiness, and the heart." },
  5: { source: "BPHS", chapter: 11, verse: 14, translation: "The 5th house rules children, intelligence, creativity, romance, speculation, past life merit (Poorva Punya), and mantras." },
  6: { source: "BPHS", chapter: 11, verse: 17, translation: "The 6th house governs enemies, diseases, debts, litigation, service, maternal uncle, and daily routines." },
  7: { source: "BPHS", chapter: 11, verse: 20, translation: "The 7th house rules spouse, marriage, partnerships, business, public dealing, and foreign travel." },
  8: { source: "BPHS", chapter: 11, verse: 23, translation: "The 8th house governs longevity, death, transformation, inheritance, occult sciences, chronic diseases, and sudden events." },
  9: { source: "BPHS", chapter: 11, verse: 26, translation: "The 9th house rules father, fortune, religion, higher education, long journeys, guru, and dharma." },
  10: { source: "BPHS", chapter: 11, verse: 29, translation: "The 10th house governs career, profession, status, authority, government, fame, and one's actions in the world." },
  11: { source: "BPHS", chapter: 11, verse: 32, translation: "The 11th house rules gains, income, profits, friends, elder siblings, aspirations, and social networks." },
  12: { source: "BPHS", chapter: 11, verse: 35, translation: "The 12th house governs losses, expenses, foreign lands, isolation, spiritual liberation (moksha), and the subconscious." },
}

/** Planet references */
export const PLANET_REFERENCES: Record<string, ClassicalReference> = {
  Sun: { source: "BPHS", chapter: 3, verse: 23, translation: "The Sun represents the soul (Atma), father, government, authority, vitality, bones, heart, right eye, and self-confidence." },
  Moon: { source: "BPHS", chapter: 3, verse: 24, translation: "The Moon represents the mind (Manas), mother, emotions, fluids, blood, left eye, public image, and mental peace." },
  Mars: { source: "BPHS", chapter: 3, verse: 25, translation: "Mars represents energy, courage, siblings, property, blood, muscles, surgery, and martial ability." },
  Mercury: { source: "BPHS", chapter: 3, verse: 26, translation: "Mercury represents intelligence, speech, education, commerce, communication, nervous system, and analytical ability." },
  Jupiter: { source: "BPHS", chapter: 3, verse: 27, translation: "Jupiter represents wisdom, children, wealth, dharma, guru, liver, expansion, and divine grace." },
  Venus: { source: "BPHS", chapter: 3, verse: 28, translation: "Venus represents love, marriage, arts, luxury, beauty, reproductive system, vehicles, and worldly pleasures." },
  Saturn: { source: "BPHS", chapter: 3, verse: 29, translation: "Saturn represents discipline, longevity, karma, service, sorrow, delay, bones, teeth, and perseverance." },
  Rahu: { source: "BPHS", chapter: 3, verse: 30, translation: "Rahu represents foreign influences, obsession, illusion, technology, outcaste, paternal grandfather, and sudden events." },
  Ketu: { source: "BPHS", chapter: 3, verse: 31, translation: "Ketu represents spirituality, moksha, past karma, detachment, psychic abilities, maternal grandfather, and occult wisdom." },
}

// ─── Utility: Get Reference ────────────────────────────

export function getYogaReference(yogaName: string): ClassicalReference | undefined {
  return YOGA_REFERENCES[yogaName]
}

export function getDoshaReference(doshaType: string): ClassicalReference | undefined {
  return DOSHA_REFERENCES[doshaType]
}

export function getHouseReference(houseNumber: number): ClassicalReference | undefined {
  return HOUSE_REFERENCES[houseNumber]
}

export function getPlanetReference(planetName: string): ClassicalReference | undefined {
  return PLANET_REFERENCES[planetName]
}
