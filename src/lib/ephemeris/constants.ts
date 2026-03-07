/* ════════════════════════════════════════════════════════
   GrahAI — Vedic Astrology Constants & Reference Tables
   Comprehensive data for Jyotish calculations
   ════════════════════════════════════════════════════════ */

import type {
  PlanetName, GrahaName, ZodiacSign, SignInfo,
  NakshatraInfo, Dignity
} from "./types"

// ─── Swiss Ephemeris Planet IDs ────────────────────────
export const SWEPH_PLANETS: Record<PlanetName, number> = {
  Sun:     0,   // SE_SUN
  Moon:    1,   // SE_MOON
  Mars:    4,   // SE_MARS
  Mercury: 2,   // SE_MERCURY
  Jupiter: 5,   // SE_JUPITER
  Venus:   3,   // SE_VENUS
  Saturn:  6,   // SE_SATURN
  Rahu:   11,   // SE_MEAN_NODE (True Node = 11, Mean = 10)
  Ketu:   -1,   // calculated as Rahu + 180
}

// True Node vs Mean Node: We use True Node (SE_TRUE_NODE = 11)
export const SE_TRUE_NODE = 11

// ─── Ayanamsa ──────────────────────────────────────────
// Lahiri (Chitrapaksha) ayanamsa — most widely used in India
export const AYANAMSA_LAHIRI = 1  // sweph flag: SE_SIDM_LAHIRI

// ─── Planet Sanskrit Names ─────────────────────────────
export const PLANET_SANSKRIT: Record<PlanetName, GrahaName> = {
  Sun: "Surya", Moon: "Chandra", Mars: "Mangal",
  Mercury: "Budha", Jupiter: "Guru", Venus: "Shukra",
  Saturn: "Shani", Rahu: "Rahu", Ketu: "Ketu",
}

// ─── Zodiac Signs (Rashis) ─────────────────────────────
export const SIGNS: SignInfo[] = [
  { name: "Aries",       index: 0,  sanskrit: "Mesha",     lord: "Mars",    element: "Fire",  quality: "Cardinal", gender: "Male"   },
  { name: "Taurus",      index: 1,  sanskrit: "Vrishabha", lord: "Venus",   element: "Earth", quality: "Fixed",    gender: "Female" },
  { name: "Gemini",      index: 2,  sanskrit: "Mithuna",   lord: "Mercury", element: "Air",   quality: "Mutable",  gender: "Male"   },
  { name: "Cancer",      index: 3,  sanskrit: "Karka",     lord: "Moon",    element: "Water", quality: "Cardinal", gender: "Female" },
  { name: "Leo",         index: 4,  sanskrit: "Simha",     lord: "Sun",     element: "Fire",  quality: "Fixed",    gender: "Male"   },
  { name: "Virgo",       index: 5,  sanskrit: "Kanya",     lord: "Mercury", element: "Earth", quality: "Mutable",  gender: "Female" },
  { name: "Libra",       index: 6,  sanskrit: "Tula",      lord: "Venus",   element: "Air",   quality: "Cardinal", gender: "Male"   },
  { name: "Scorpio",     index: 7,  sanskrit: "Vrishchika",lord: "Mars",    element: "Water", quality: "Fixed",    gender: "Female" },
  { name: "Sagittarius", index: 8,  sanskrit: "Dhanu",     lord: "Jupiter", element: "Fire",  quality: "Mutable",  gender: "Male"   },
  { name: "Capricorn",   index: 9,  sanskrit: "Makara",    lord: "Saturn",  element: "Earth", quality: "Cardinal", gender: "Female" },
  { name: "Aquarius",    index: 10, sanskrit: "Kumbha",    lord: "Saturn",  element: "Air",   quality: "Fixed",    gender: "Male"   },
  { name: "Pisces",      index: 11, sanskrit: "Meena",     lord: "Jupiter", element: "Water", quality: "Mutable",  gender: "Female" },
]

// ─── 27 Nakshatras ─────────────────────────────────────
// Each nakshatra spans 13°20' (13.3333°)
export const NAKSHATRA_SPAN = 360 / 27  // 13.3333...

export const NAKSHATRAS: NakshatraInfo[] = [
  { index: 0,  name: "Ashwini",       sanskrit: "Ashvini",        lord: "Ketu",    deity: "Ashwini Kumaras", pada: 0, startDegree: 0,           symbol: "Horse head",      shakti: "Healing",           animal: "Horse",    gana: "Deva",     guna: "Rajas"  },
  { index: 1,  name: "Bharani",       sanskrit: "Bharani",        lord: "Venus",   deity: "Yama",            pada: 0, startDegree: 13.3333,     symbol: "Yoni",            shakti: "Removal",           animal: "Elephant", gana: "Manushya", guna: "Rajas"  },
  { index: 2,  name: "Krittika",      sanskrit: "Krittika",       lord: "Sun",     deity: "Agni",            pada: 0, startDegree: 26.6667,     symbol: "Razor/flame",     shakti: "Burning",           animal: "Goat",     gana: "Rakshasa", guna: "Rajas"  },
  { index: 3,  name: "Rohini",        sanskrit: "Rohini",         lord: "Moon",    deity: "Brahma",          pada: 0, startDegree: 40,          symbol: "Chariot/ox cart", shakti: "Growth",            animal: "Serpent",  gana: "Manushya", guna: "Rajas"  },
  { index: 4,  name: "Mrigashira",    sanskrit: "Mrigashirsha",   lord: "Mars",    deity: "Soma",            pada: 0, startDegree: 53.3333,     symbol: "Deer head",       shakti: "Fulfillment",       animal: "Serpent",  gana: "Deva",     guna: "Tamas"  },
  { index: 5,  name: "Ardra",         sanskrit: "Ardra",          lord: "Rahu",    deity: "Rudra",           pada: 0, startDegree: 66.6667,     symbol: "Teardrop",        shakti: "Effort",            animal: "Dog",      gana: "Manushya", guna: "Tamas"  },
  { index: 6,  name: "Punarvasu",     sanskrit: "Punarvasu",      lord: "Jupiter", deity: "Aditi",           pada: 0, startDegree: 80,          symbol: "Bow & quiver",    shakti: "Renewal",           animal: "Cat",      gana: "Deva",     guna: "Tamas"  },
  { index: 7,  name: "Pushya",        sanskrit: "Pushya",         lord: "Saturn",  deity: "Brihaspati",      pada: 0, startDegree: 93.3333,     symbol: "Lotus/arrow",     shakti: "Nourishment",       animal: "Goat",     gana: "Deva",     guna: "Sattva" },
  { index: 8,  name: "Ashlesha",      sanskrit: "Ashlesha",       lord: "Mercury", deity: "Naga",            pada: 0, startDegree: 106.6667,    symbol: "Coiled serpent",  shakti: "Poison",            animal: "Cat",      gana: "Rakshasa", guna: "Sattva" },
  { index: 9,  name: "Magha",         sanskrit: "Magha",          lord: "Ketu",    deity: "Pitris",          pada: 0, startDegree: 120,         symbol: "Throne/palanquin",shakti: "Authority",         animal: "Rat",      gana: "Rakshasa", guna: "Sattva" },
  { index: 10, name: "Purva Phalguni",sanskrit: "Purva Phalguni", lord: "Venus",   deity: "Bhaga",           pada: 0, startDegree: 133.3333,    symbol: "Hammock/bed",     shakti: "Procreation",       animal: "Rat",      gana: "Manushya", guna: "Rajas"  },
  { index: 11, name: "Uttara Phalguni",sanskrit: "Uttara Phalguni",lord: "Sun",    deity: "Aryaman",         pada: 0, startDegree: 146.6667,    symbol: "Bed/legs",        shakti: "Prosperity",        animal: "Cow",      gana: "Manushya", guna: "Rajas"  },
  { index: 12, name: "Hasta",         sanskrit: "Hasta",          lord: "Moon",    deity: "Savitar",         pada: 0, startDegree: 160,         symbol: "Hand/fist",       shakti: "Control",           animal: "Buffalo",  gana: "Deva",     guna: "Rajas"  },
  { index: 13, name: "Chitra",        sanskrit: "Chitra",         lord: "Mars",    deity: "Vishwakarma",     pada: 0, startDegree: 173.3333,    symbol: "Bright jewel",    shakti: "Accumulation",      animal: "Tiger",    gana: "Rakshasa", guna: "Tamas"  },
  { index: 14, name: "Swati",         sanskrit: "Svati",          lord: "Rahu",    deity: "Vayu",            pada: 0, startDegree: 186.6667,    symbol: "Coral/sword",     shakti: "Scattering",        animal: "Buffalo",  gana: "Deva",     guna: "Tamas"  },
  { index: 15, name: "Vishakha",      sanskrit: "Vishakha",       lord: "Jupiter", deity: "Indra-Agni",      pada: 0, startDegree: 200,         symbol: "Triumphal arch",  shakti: "Achievement",       animal: "Tiger",    gana: "Rakshasa", guna: "Tamas"  },
  { index: 16, name: "Anuradha",      sanskrit: "Anuradha",       lord: "Saturn",  deity: "Mitra",           pada: 0, startDegree: 213.3333,    symbol: "Lotus/staff",     shakti: "Worship",           animal: "Deer",     gana: "Deva",     guna: "Sattva" },
  { index: 17, name: "Jyeshtha",      sanskrit: "Jyeshtha",       lord: "Mercury", deity: "Indra",           pada: 0, startDegree: 226.6667,    symbol: "Earring/umbrella",shakti: "Heroism",           animal: "Deer",     gana: "Rakshasa", guna: "Sattva" },
  { index: 18, name: "Mula",          sanskrit: "Mula",           lord: "Ketu",    deity: "Nirriti",         pada: 0, startDegree: 240,         symbol: "Roots/lion tail", shakti: "Destruction",       animal: "Dog",      gana: "Rakshasa", guna: "Sattva" },
  { index: 19, name: "Purva Ashadha", sanskrit: "Purva Ashadha",  lord: "Venus",   deity: "Apas",            pada: 0, startDegree: 253.3333,    symbol: "Elephant tusk",   shakti: "Invigoration",      animal: "Monkey",   gana: "Manushya", guna: "Rajas"  },
  { index: 20, name: "Uttara Ashadha",sanskrit: "Uttara Ashadha", lord: "Sun",     deity: "Vishve Devas",    pada: 0, startDegree: 266.6667,    symbol: "Elephant tusk",   shakti: "Unchallengeable",   animal: "Mongoose", gana: "Manushya", guna: "Rajas"  },
  { index: 21, name: "Shravana",      sanskrit: "Shravana",       lord: "Moon",    deity: "Vishnu",          pada: 0, startDegree: 280,         symbol: "Three footprints",shakti: "Connection",        animal: "Monkey",   gana: "Deva",     guna: "Rajas"  },
  { index: 22, name: "Dhanishtha",    sanskrit: "Dhanishtha",     lord: "Mars",    deity: "Vasus",           pada: 0, startDegree: 293.3333,    symbol: "Drum/flute",      shakti: "Abundance",         animal: "Lion",     gana: "Rakshasa", guna: "Tamas"  },
  { index: 23, name: "Shatabhisha",   sanskrit: "Shatabhisha",    lord: "Rahu",    deity: "Varuna",          pada: 0, startDegree: 306.6667,    symbol: "Empty circle",    shakti: "Healing",           animal: "Horse",    gana: "Rakshasa", guna: "Tamas"  },
  { index: 24, name: "Purva Bhadrapada",sanskrit: "Purva Bhadrapada",lord: "Jupiter",deity: "Aja Ekapada",   pada: 0, startDegree: 320,         symbol: "Sword/two faces", shakti: "Elevation",         animal: "Lion",     gana: "Manushya", guna: "Tamas"  },
  { index: 25, name: "Uttara Bhadrapada",sanskrit: "Uttara Bhadrapada",lord: "Saturn",deity: "Ahir Budhnya", pada: 0, startDegree: 333.3333,    symbol: "Twin/serpent",    shakti: "Cosmic stability",  animal: "Cow",      gana: "Manushya", guna: "Sattva" },
  { index: 26, name: "Revati",        sanskrit: "Revati",         lord: "Mercury", deity: "Pushan",          pada: 0, startDegree: 346.6667,    symbol: "Fish/drum",       shakti: "Nourishment",       animal: "Elephant", gana: "Deva",     guna: "Sattva" },
]

// ─── Vimshottari Dasha Periods (years) ─────────────────
// Order: Ketu→Venus→Sun→Moon→Mars→Rahu→Jupiter→Saturn→Mercury
export const DASHA_YEARS: Record<PlanetName, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
}

export const DASHA_ORDER: PlanetName[] = [
  "Ketu", "Venus", "Sun", "Moon", "Mars",
  "Rahu", "Jupiter", "Saturn", "Mercury",
]

export const TOTAL_DASHA_YEARS = 120

// ─── Nakshatra → Starting Dasha Lord Mapping ──────────
// Each nakshatra's lord determines the Mahadasha that starts at birth
export const NAKSHATRA_DASHA_LORD: PlanetName[] = [
  "Ketu", "Venus", "Sun",       // Ashwini, Bharani, Krittika
  "Moon", "Mars", "Rahu",       // Rohini, Mrigashira, Ardra
  "Jupiter", "Saturn", "Mercury",// Punarvasu, Pushya, Ashlesha
  "Ketu", "Venus", "Sun",       // Magha, Purva Phalguni, Uttara Phalguni
  "Moon", "Mars", "Rahu",       // Hasta, Chitra, Swati
  "Jupiter", "Saturn", "Mercury",// Vishakha, Anuradha, Jyeshtha
  "Ketu", "Venus", "Sun",       // Mula, Purva Ashadha, Uttara Ashadha
  "Moon", "Mars", "Rahu",       // Shravana, Dhanishtha, Shatabhisha
  "Jupiter", "Saturn", "Mercury",// Purva Bhadrapada, Uttara Bhadrapada, Revati
]

// ─── Planetary Dignities ───────────────────────────────
// Exaltation degrees (sidereal)
export const EXALTATION: Record<PlanetName, { sign: number, degree: number }> = {
  Sun:     { sign: 0, degree: 10 },   // Aries 10°
  Moon:    { sign: 1, degree: 3 },     // Taurus 3°
  Mars:    { sign: 9, degree: 28 },    // Capricorn 28°
  Mercury: { sign: 5, degree: 15 },    // Virgo 15°
  Jupiter: { sign: 3, degree: 5 },     // Cancer 5°
  Venus:   { sign: 11, degree: 27 },   // Pisces 27°
  Saturn:  { sign: 6, degree: 20 },    // Libra 20°
  Rahu:    { sign: 1, degree: 20 },    // Taurus 20° (controversial)
  Ketu:    { sign: 7, degree: 20 },    // Scorpio 20° (controversial)
}

// Debilitation = opposite sign of exaltation
export const DEBILITATION: Record<PlanetName, { sign: number, degree: number }> = {
  Sun:     { sign: 6, degree: 10 },    // Libra 10°
  Moon:    { sign: 7, degree: 3 },     // Scorpio 3°
  Mars:    { sign: 3, degree: 28 },    // Cancer 28°
  Mercury: { sign: 11, degree: 15 },   // Pisces 15°
  Jupiter: { sign: 9, degree: 5 },     // Capricorn 5°
  Venus:   { sign: 5, degree: 27 },    // Virgo 27°
  Saturn:  { sign: 0, degree: 20 },    // Aries 20°
  Rahu:    { sign: 7, degree: 20 },    // Scorpio 20°
  Ketu:    { sign: 1, degree: 20 },    // Taurus 20°
}

// Own signs (where planet is lord)
export const OWN_SIGNS: Record<PlanetName, number[]> = {
  Sun:     [4],          // Leo
  Moon:    [3],          // Cancer
  Mars:    [0, 7],       // Aries, Scorpio
  Mercury: [2, 5],       // Gemini, Virgo
  Jupiter: [8, 11],      // Sagittarius, Pisces
  Venus:   [1, 6],       // Taurus, Libra
  Saturn:  [9, 10],      // Capricorn, Aquarius
  Rahu:    [10],         // Aquarius (co-lord, as per some schools)
  Ketu:    [7],          // Scorpio (co-lord, as per some schools)
}

// Moolatrikona signs and degree ranges
export const MOOLATRIKONA: Record<PlanetName, { sign: number, startDeg: number, endDeg: number } | null> = {
  Sun:     { sign: 4, startDeg: 0, endDeg: 20 },   // Leo 0°-20°
  Moon:    { sign: 1, startDeg: 3, endDeg: 30 },    // Taurus 3°-30°
  Mars:    { sign: 0, startDeg: 0, endDeg: 12 },    // Aries 0°-12°
  Mercury: { sign: 5, startDeg: 15, endDeg: 20 },   // Virgo 15°-20°
  Jupiter: { sign: 8, startDeg: 0, endDeg: 10 },    // Sagittarius 0°-10°
  Venus:   { sign: 6, startDeg: 0, endDeg: 15 },    // Libra 0°-15°
  Saturn:  { sign: 10, startDeg: 0, endDeg: 20 },   // Aquarius 0°-20°
  Rahu:    null,
  Ketu:    null,
}

// ─── Planetary Friendships (Natural) ───────────────────
// BPHS Chapter 3 — Naisargika Maitri
type FriendshipLevel = "friend" | "neutral" | "enemy"

export const NATURAL_FRIENDSHIPS: Record<PlanetName, Record<PlanetName, FriendshipLevel>> = {
  Sun: {
    Sun: "neutral", Moon: "friend", Mars: "friend", Mercury: "enemy",
    Jupiter: "friend", Venus: "enemy", Saturn: "enemy", Rahu: "enemy", Ketu: "enemy",
  },
  Moon: {
    Sun: "friend", Moon: "neutral", Mars: "neutral", Mercury: "friend",
    Jupiter: "neutral", Venus: "neutral", Saturn: "neutral", Rahu: "enemy", Ketu: "enemy",
  },
  Mars: {
    Sun: "friend", Moon: "friend", Mars: "neutral", Mercury: "enemy",
    Jupiter: "friend", Venus: "neutral", Saturn: "enemy", Rahu: "enemy", Ketu: "neutral",
  },
  Mercury: {
    Sun: "friend", Moon: "enemy", Mars: "neutral", Mercury: "neutral",
    Jupiter: "neutral", Venus: "friend", Saturn: "friend", Rahu: "friend", Ketu: "enemy",
  },
  Jupiter: {
    Sun: "friend", Moon: "friend", Mars: "friend", Mercury: "enemy",
    Jupiter: "neutral", Venus: "enemy", Saturn: "neutral", Rahu: "enemy", Ketu: "neutral",
  },
  Venus: {
    Sun: "enemy", Moon: "neutral", Mars: "neutral", Mercury: "friend",
    Jupiter: "neutral", Venus: "neutral", Saturn: "friend", Rahu: "friend", Ketu: "enemy",
  },
  Saturn: {
    Sun: "enemy", Moon: "enemy", Mars: "enemy", Mercury: "friend",
    Jupiter: "neutral", Venus: "friend", Saturn: "neutral", Rahu: "friend", Ketu: "neutral",
  },
  Rahu: {
    Sun: "enemy", Moon: "enemy", Mars: "enemy", Mercury: "friend",
    Jupiter: "enemy", Venus: "friend", Saturn: "friend", Rahu: "neutral", Ketu: "neutral",
  },
  Ketu: {
    Sun: "enemy", Moon: "enemy", Mars: "friend", Mercury: "enemy",
    Jupiter: "friend", Venus: "enemy", Saturn: "neutral", Rahu: "neutral", Ketu: "neutral",
  },
}

// ─── Combustion Distances (degrees from Sun) ──────────
export const COMBUSTION_DEGREES: Record<PlanetName, number> = {
  Sun: 0,
  Moon: 12,
  Mars: 17,
  Mercury: 14,     // 12° when retrograde
  Jupiter: 11,
  Venus: 10,       // 8° when retrograde
  Saturn: 15,
  Rahu: 0,         // not combust
  Ketu: 0,         // not combust
}

// ─── House Significances (Bhava) ───────────────────────
export const HOUSE_SIGNIFICANCES: Record<number, {
  name: string
  sanskrit: string
  category: string
  keywords: string[]
}> = {
  1:  { name: "First House",    sanskrit: "Lagna/Tanu",     category: "Kendra/Trikona", keywords: ["Self", "Personality", "Physical body", "Health", "Appearance", "Character"] },
  2:  { name: "Second House",   sanskrit: "Dhana",          category: "Maraka",         keywords: ["Wealth", "Family", "Speech", "Food", "Face", "Right eye", "Values"] },
  3:  { name: "Third House",    sanskrit: "Sahaja",         category: "Upachaya",       keywords: ["Siblings", "Courage", "Communication", "Short travel", "Efforts", "Arms/hands"] },
  4:  { name: "Fourth House",   sanskrit: "Sukha/Bandhu",   category: "Kendra",         keywords: ["Mother", "Home", "Property", "Education", "Vehicles", "Happiness", "Heart"] },
  5:  { name: "Fifth House",    sanskrit: "Putra",          category: "Trikona",        keywords: ["Children", "Intelligence", "Creativity", "Romance", "Speculation", "Past merit"] },
  6:  { name: "Sixth House",    sanskrit: "Ripu/Shatru",    category: "Dusthana",       keywords: ["Enemies", "Disease", "Debts", "Service", "Litigation", "Maternal uncle"] },
  7:  { name: "Seventh House",  sanskrit: "Kalatra",        category: "Kendra/Maraka",  keywords: ["Spouse", "Partnership", "Business", "Foreign travel", "Public dealing"] },
  8:  { name: "Eighth House",   sanskrit: "Ayu/Mrityu",     category: "Dusthana",       keywords: ["Longevity", "Death", "Transformation", "Occult", "Inheritance", "Sudden events"] },
  9:  { name: "Ninth House",    sanskrit: "Dharma/Bhagya",  category: "Trikona",        keywords: ["Father", "Fortune", "Religion", "Higher learning", "Long travel", "Guru"] },
  10: { name: "Tenth House",    sanskrit: "Karma",          category: "Kendra/Upachaya",keywords: ["Career", "Status", "Authority", "Government", "Fame", "Actions"] },
  11: { name: "Eleventh House", sanskrit: "Labha",          category: "Upachaya",       keywords: ["Gains", "Income", "Friends", "Aspirations", "Elder siblings", "Networks"] },
  12: { name: "Twelfth House",  sanskrit: "Vyaya",          category: "Dusthana",       keywords: ["Loss", "Expenses", "Foreign lands", "Isolation", "Spirituality", "Liberation"] },
}

// ─── Kendra / Trikona / Dusthana Classifications ──────
export const KENDRA_HOUSES = [1, 4, 7, 10]       // Angular houses
export const TRIKONA_HOUSES = [1, 5, 9]           // Trinal houses
export const DUSTHANA_HOUSES = [6, 8, 12]         // Evil houses
export const UPACHAYA_HOUSES = [3, 6, 10, 11]     // Growth houses
export const MARAKA_HOUSES = [2, 7]               // Death-inflicting houses
export const TRIK_HOUSES = [6, 8, 12]             // Same as Dusthana

// ─── Aspect Rules (Drishti) ────────────────────────────
// All planets aspect 7th house from themselves
// Special aspects:
export const SPECIAL_ASPECTS: Record<PlanetName, number[]> = {
  Sun:     [7],
  Moon:    [7],
  Mars:    [4, 7, 8],         // 4th, 7th, 8th house aspect
  Mercury: [7],
  Jupiter: [5, 7, 9],         // 5th, 7th, 9th house aspect
  Venus:   [7],
  Saturn:  [3, 7, 10],        // 3rd, 7th, 10th house aspect
  Rahu:    [5, 7, 9],         // Same as Jupiter (as per some texts)
  Ketu:    [5, 7, 9],         // Same as Jupiter (as per some texts)
}

// ─── Planetary Karaka (Significator) ───────────────────
// BPHS Chapter 32 — Chara Karakas use degree-based ranking
// These are Sthira (fixed) Karakas
export const STHIRA_KARAKA: Record<PlanetName, string[]> = {
  Sun:     ["Atma (soul)", "Father", "Authority", "Government"],
  Moon:    ["Manas (mind)", "Mother", "Emotions", "Public"],
  Mars:    ["Courage", "Brothers", "Land", "Energy"],
  Mercury: ["Intelligence", "Speech", "Education", "Commerce"],
  Jupiter: ["Wisdom", "Children", "Wealth", "Dharma", "Guru"],
  Venus:   ["Spouse", "Love", "Arts", "Luxury", "Vehicles"],
  Saturn:  ["Longevity", "Discipline", "Service", "Sorrow"],
  Rahu:    ["Foreign", "Obsession", "Illusion", "Technology"],
  Ketu:    ["Moksha", "Spirituality", "Past karma", "Detachment"],
}

// ─── Panchang: Tithi Names ─────────────────────────────
export const TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya",
]

// Tithi lords
export const TITHI_LORDS: PlanetName[] = [
  "Sun", "Moon", "Mars", "Mercury", "Jupiter",
  "Venus", "Saturn", "Rahu", "Sun", "Moon",
  "Mars", "Mercury", "Jupiter", "Venus", "Saturn",
]

// ─── Panchang: Yoga Names (27 yogas) ──────────────────
export const PANCHANG_YOGAS = [
  "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
  "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda",
  "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
  "Indra", "Vaidhriti",
]

// ─── Panchang: Karana Names (11 karanas) ──────────────
export const KARANAS = {
  fixed: ["Kimstughna", "Shakuni", "Chatushpada", "Nagava"],
  moving: ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"],
}

// ─── Day Lords ─────────────────────────────────────────
export const DAY_LORDS: Record<number, { name: string, sanskrit: string, lord: PlanetName }> = {
  0: { name: "Sunday",    sanskrit: "Ravivara",    lord: "Sun" },
  1: { name: "Monday",    sanskrit: "Somavara",    lord: "Moon" },
  2: { name: "Tuesday",   sanskrit: "Mangalavara", lord: "Mars" },
  3: { name: "Wednesday", sanskrit: "Budhavara",   lord: "Mercury" },
  4: { name: "Thursday",  sanskrit: "Guruvara",    lord: "Jupiter" },
  5: { name: "Friday",    sanskrit: "Shukravara",  lord: "Venus" },
  6: { name: "Saturday",  sanskrit: "Shanivara",   lord: "Saturn" },
}

// ─── Utility Functions ─────────────────────────────────

/** Get sign info from sidereal longitude (0-360) */
export function getSignFromLongitude(longitude: number): SignInfo {
  const normalized = ((longitude % 360) + 360) % 360
  const signIndex = Math.floor(normalized / 30)
  return SIGNS[signIndex]
}

/** Get degree within sign (0-30) from absolute longitude */
export function getDegreeInSign(longitude: number): number {
  const normalized = ((longitude % 360) + 360) % 360
  return normalized % 30
}

/** Get nakshatra info from sidereal longitude */
export function getNakshatraFromLongitude(longitude: number): NakshatraInfo {
  const normalized = ((longitude % 360) + 360) % 360
  const nakshatraIndex = Math.floor(normalized / NAKSHATRA_SPAN)
  const degreeInNakshatra = normalized - nakshatraIndex * NAKSHATRA_SPAN
  const pada = Math.floor(degreeInNakshatra / (NAKSHATRA_SPAN / 4)) + 1

  return { ...NAKSHATRAS[nakshatraIndex], pada }
}

/** Determine planet's dignity in a given sign */
export function getPlanetDignity(planet: PlanetName, signIndex: number, degreeInSign: number): Dignity {
  // Check exaltation
  const exalt = EXALTATION[planet]
  if (exalt.sign === signIndex) return "exalted"

  // Check debilitation
  const debil = DEBILITATION[planet]
  if (debil.sign === signIndex) return "debilitated"

  // Check Moolatrikona
  const moola = MOOLATRIKONA[planet]
  if (moola && moola.sign === signIndex && degreeInSign >= moola.startDeg && degreeInSign <= moola.endDeg) {
    return "moolatrikona"
  }

  // Check own sign
  if (OWN_SIGNS[planet].includes(signIndex)) return "own"

  // Check friendship with sign lord
  const signLord = SIGNS[signIndex].lord
  if (signLord === planet) return "own"

  const friendship = NATURAL_FRIENDSHIPS[planet][signLord]
  if (friendship === "friend") return "friendly"
  if (friendship === "enemy") return "enemy"

  return "neutral"
}

/** Check if planet is combust (too close to Sun) */
export function isCombust(planet: PlanetName, planetLong: number, sunLong: number): { combust: boolean, distance: number } {
  if (planet === "Sun" || planet === "Rahu" || planet === "Ketu") {
    return { combust: false, distance: 0 }
  }
  let distance = Math.abs(planetLong - sunLong)
  if (distance > 180) distance = 360 - distance
  const threshold = COMBUSTION_DEGREES[planet]
  return { combust: distance < threshold, distance }
}

/** Get house number for a given longitude, using ascendant as 1st house cusp (Whole Sign) */
export function getHouseNumber(longitude: number, ascendantLongitude: number): number {
  const ascSign = Math.floor(((ascendantLongitude % 360) + 360) % 360 / 30)
  const planetSign = Math.floor(((longitude % 360) + 360) % 360 / 30)
  return ((planetSign - ascSign + 12) % 12) + 1
}

/** Get sign lord for a house number given the ascendant */
export function getHouseLord(houseNumber: number, ascendantLongitude: number): PlanetName {
  const ascSign = Math.floor(((ascendantLongitude % 360) + 360) % 360 / 30)
  const houseSign = (ascSign + houseNumber - 1) % 12
  return SIGNS[houseSign].lord
}
