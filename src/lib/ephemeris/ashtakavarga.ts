/**
 * Ashtakavarga Scoring Engine
 * Implements the complete Ashtakavarga system from BPHS Chapters 66-72
 *
 * Ashtakavarga (8-vargas) is a system of benefic points that determines the strength
 * and favorability of planets in different zodiacal signs and houses. It is one of the
 * most important tools for timing events and assessing planetary strength in Vedic astrology.
 *
 * References:
 * - BPHS Chapter 66: Prashtarakha (Individual Ashtakavarga Tables)
 * - BPHS Chapter 67-68: Sarvashtakavarga (Combined Strength)
 * - BPHS Chapter 69-70: Trikona Shodhana (Reduction Technique)
 * - BPHS Chapter 71-72: Pinda Calculations and Interpretations
 */

import type { NatalChart, PlanetData, PlanetName } from "./types";
import { SIGNS, getSignFromLongitude, getHouseNumber } from "./constants";

// ==========================================
// TYPES & INTERFACES
// ==========================================

/**
 * Individual Ashtakavarga for a single planet
 * Represents the benefic points (bindus) a planet contributes to each sign
 */
export interface PlanetAshtakavarga {
  planet: PlanetName;
  bindus: number[]; // 12 entries (index 0 = Aries, 11 = Pisces)
  totalBindus: number;
  strongSigns: number[]; // Signs with 4+ bindus (favorable strength)
  weakSigns: number[]; // Signs with 0-2 bindus (weak influence)
  reducedBindus?: number[]; // After Trikona Shodhana reduction
}

/**
 * Complete Ashtakavarga Result
 * Contains all 8 individual Ashtakavargas (7 planets + Ascendant)
 * and the combined Sarvashtakavarga
 */
export interface AshtakavargaResult {
  planetAshtakavargas: PlanetAshtakavarga[]; // Sun through Saturn (7 planets)
  ascendantAshtakavarga: number[]; // Ascendant contribution to each sign
  sarvashtakavarga: number[]; // SAV: sum of all 8 vargas (12 entries)
  totalSAV: number; // Total bindus across all signs (should be 337)
  strongHouses: number[]; // Houses with SAV >= 28 (favorable)
  weakHouses: number[]; // Houses with SAV < 25 (challenging)
}

/**
 * Summary and interpretation of Ashtakavarga results
 */
export interface AshtakavargaSummary {
  overallStrength: "strong" | "moderate" | "weak";
  bestHouses: Array<{ house: number; sav: number; interpretation: string }>;
  worstHouses: Array<{ house: number; sav: number; interpretation: string }>;
  planetRankings: Array<{
    planet: PlanetName;
    totalBindus: number;
    strength: string;
  }>;
  transitGuidance: string;
}

// ==========================================
// ASHTAKAVARGA CONTRIBUTION TABLES (BPHS)
// ==========================================

/**
 * Prashtarakha tables from BPHS Chapter 66
 * Maps each of 8 sources (7 planets + Ascendant) to the houses where they contribute bindus
 * for the specific planet's Ashtakavarga.
 *
 * Houses are numbered 1-12. We convert to 0-indexed for array access.
 */
const ASHTAKAVARGA_RULES: Record<string, Record<string, number[]>> = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [3, 6, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12],
    Jupiter: [5, 6, 9, 11],
    Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Ascendant: [3, 4, 6, 10, 11, 12],
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    Jupiter: [1, 4, 7, 8, 10, 11, 12],
    Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Ascendant: [3, 6, 10, 11],
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11],
    Moon: [3, 6, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12],
    Venus: [6, 8, 11, 12],
    Saturn: [1, 4, 7, 8, 9, 10, 11],
    Ascendant: [1, 3, 6, 10, 11],
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12],
    Moon: [2, 4, 6, 8, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    Jupiter: [6, 8, 11, 12],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Ascendant: [1, 2, 4, 6, 8, 10, 11],
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Moon: [2, 5, 7, 9, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12],
    Ascendant: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  Venus: {
    Sun: [8, 11, 12],
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mars: [3, 5, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11],
    Ascendant: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11],
    Moon: [3, 6, 11],
    Mars: [3, 5, 6, 10, 11, 12],
    Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [5, 6, 11, 12],
    Venus: [6, 11, 12],
    Saturn: [3, 5, 6, 11],
    Ascendant: [1, 3, 4, 6, 10, 11],
  },
};

// Planet order for processing
const PLANETS: PlanetName[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

// ==========================================
// CALCULATION FUNCTIONS
// ==========================================

/**
 * Get the sign index (0-11) for a planet's longitude
 */
function getSignIndex(longitude: number): number {
  return Math.floor(longitude / 30) % 12;
}

/**
 * Calculate individual Ashtakavarga for a single planet
 * BPHS Chapter 66: Prashtarakha
 *
 * For each planet, determine which houses (signs) from each of 8 sources
 * contribute benefic points (bindus).
 */
function calculatePlanetAshtakavarga(
  planet: PlanetName,
  chart: NatalChart
): PlanetAshtakavarga {
  const bindus = new Array(12).fill(0);

  // Get all source positions and their sign indices
  const sources: Record<string, number> = {};

  // Add planets
  for (const p of PLANETS) {
    const planetData = chart.planets.find((pd) => pd.name === p);
    if (planetData) {
      sources[p] = getSignIndex(planetData.longitude);
    }
  }

  // Add Ascendant
  sources["Ascendant"] = getSignIndex(chart.ascendant);

  // For each source (planet or ascendant)
  for (const [sourceName, sourceSignIndex] of Object.entries(sources)) {
    const rules = ASHTAKAVARGA_RULES[planet]?.[sourceName];
    if (!rules) continue;

    // Rules contain 1-indexed house numbers; convert to 0-indexed signs
    for (const house of rules) {
      const signIndex = (sourceSignIndex + house - 1) % 12;
      bindus[signIndex]++;
    }
  }

  const totalBindus = bindus.reduce((a, b) => a + b, 0);
  const strongSigns = bindus
    .map((b, i) => (b >= 4 ? i : -1))
    .filter((i) => i !== -1);
  const weakSigns = bindus
    .map((b, i) => (b <= 2 ? i : -1))
    .filter((i) => i !== -1);

  return {
    planet,
    bindus,
    totalBindus,
    strongSigns,
    weakSigns,
  };
}

/**
 * Calculate Ascendant Ashtakavarga
 * The Ascendant's contribution to each sign is straightforward:
 * Houses 1-12 from the Ascendant yield 1 bindu each in those signs
 */
function calculateAscendantAshtakavarga(chart: NatalChart): number[] {
  const ascendantSignIndex = getSignIndex(chart.ascendant);
  const bindus = new Array(12).fill(0);

  // The ascendant contributes 1 bindu to signs 1-12 from itself
  for (let i = 0; i < 12; i++) {
    const signIndex = (ascendantSignIndex + i) % 12;
    bindus[signIndex]++;
  }

  return bindus;
}

/**
 * Calculate Sarvashtakavarga (SAV)
 * BPHS Chapter 67: Sum all 8 individual Ashtakavargas to get total strength per sign
 *
 * Total SAV across all 12 signs should equal 337 bindus
 */
function calculateSarvashtakavarga(
  planetAVs: PlanetAshtakavarga[],
  ascendantAV: number[]
): number[] {
  const sav = new Array(12).fill(0);

  // Sum all planet Ashtakavargas
  for (const pav of planetAVs) {
    for (let i = 0; i < 12; i++) {
      sav[i] += pav.bindus[i];
    }
  }

  // Add Ascendant Ashtakavarga
  for (let i = 0; i < 12; i++) {
    sav[i] += ascendantAV[i];
  }

  return sav;
}

/**
 * Apply Trikona Shodhana (reduction technique)
 * BPHS Chapter 69-70: Reduce bindus in sign groups
 *
 * Step 1: For trikona groups (1-5-9, 2-6-10, 3-7-11, 4-8-12),
 * subtract the minimum of the three from each sign
 */
function applyTrikonaShodhana(bindus: number[]): number[] {
  const reduced = [...bindus];

  // Define trikona groups (0-indexed)
  const trikonaGroups = [
    [0, 4, 8], // 1-5-9
    [1, 5, 9], // 2-6-10
    [2, 6, 10], // 3-7-11
    [3, 7, 11], // 4-8-12
  ];

  for (const group of trikonaGroups) {
    const values = group.map((i) => reduced[i]);
    const min = Math.min(...values);

    // Subtract minimum from each in the group
    for (const i of group) {
      reduced[i] -= min;
    }
  }

  return reduced;
}

/**
 * Get house number from sign index
 * In natal astrology, house number = sign index + 1
 */
function getHouseFromSignIndex(signIndex: number): number {
  return signIndex + 1;
}

/**
 * Main Ashtakavarga calculation function
 * BPHS Chapters 66-70: Calculate complete Ashtakavarga system
 */
export function calculateAshtakavarga(chart: NatalChart): AshtakavargaResult {
  // Step 1: Calculate individual Ashtakavargas for all 7 planets
  const planetAVs = PLANETS.map((planet) =>
    calculatePlanetAshtakavarga(planet, chart)
  );

  // Step 2: Calculate Ascendant Ashtakavarga
  const ascendantAV = calculateAscendantAshtakavarga(chart);

  // Step 3: Calculate Sarvashtakavarga (SAV)
  const sav = calculateSarvashtakavarga(planetAVs, ascendantAV);
  const totalSAV = sav.reduce((a, b) => a + b, 0);

  // Step 4: Apply Trikona Shodhana to each planet's Ashtakavarga
  const reducedAVs = planetAVs.map((pav) => ({
    ...pav,
    reducedBindus: applyTrikonaShodhana(pav.bindus),
  }));

  // Step 5: Identify strong and weak houses based on SAV
  const strongHouses = sav
    .map((s, i) => (s >= 28 ? i : -1))
    .filter((i) => i !== -1);
  const weakHouses = sav
    .map((s, i) => (s < 25 ? i : -1))
    .filter((i) => i !== -1);

  return {
    planetAshtakavargas: reducedAVs,
    ascendantAshtakavarga: ascendantAV,
    sarvashtakavarga: sav,
    totalSAV,
    strongHouses,
    weakHouses,
  };
}

// ==========================================
// ANALYSIS & INTERPRETATION FUNCTIONS
// ==========================================

/**
 * Get SAV strength score for a specific sign
 * Signs are 0-indexed (0 = Aries, 11 = Pisces)
 */
export function getSignStrength(
  result: AshtakavargaResult,
  signIndex: number
): number {
  if (signIndex < 0 || signIndex >= 12) return 0;
  return result.sarvashtakavarga[signIndex];
}

/**
 * Get individual planet's bindus in a specific sign
 */
export function getPlanetBindus(
  result: AshtakavargaResult,
  planet: PlanetName,
  signIndex: number
): number {
  if (signIndex < 0 || signIndex >= 12) return 0;
  const pav = result.planetAshtakavargas.find((p) => p.planet === planet);
  return pav ? pav.bindus[signIndex] : 0;
}

/**
 * Get reduced bindus after Trikona Shodhana
 */
export function getReducedPlanetBindus(
  result: AshtakavargaResult,
  planet: PlanetName,
  signIndex: number
): number {
  if (signIndex < 0 || signIndex >= 12) return 0;
  const pav = result.planetAshtakavargas.find((p) => p.planet === planet);
  return pav && pav.reducedBindus ? pav.reducedBindus[signIndex] : 0;
}

/**
 * Interpret SAV strength for a specific house
 * BPHS Chapter 71: Interpretation guidelines
 *
 * SAV Strength Scale:
 * 4-8: Very Weak (inauspicious, avoid important events)
 * 9-16: Weak (neutral/mixed results)
 * 17-25: Moderate (mixed results, proceed with caution)
 * 26-32: Strong (auspicious, favorable for activity)
 * 33+: Very Strong (highly auspicious, excellent for events)
 */
function interpretSAVStrength(sav: number): string {
  if (sav <= 8) return "Very Weak (inauspicious)";
  if (sav <= 16) return "Weak (neutral)";
  if (sav <= 25) return "Moderate (mixed)";
  if (sav <= 32) return "Strong (favorable)";
  return "Very Strong (highly auspicious)";
}

/**
 * Get house meanings and strength interpretation
 * BPHS Chapter 71: House interpretation
 */
function getHouseInterpretation(house: number, sav: number): string {
  const meanings: Record<number, { positive: string; negative: string }> = {
    1: {
      positive: "Self, health, and vitality are strengthened",
      negative: "Physical health and confidence may suffer",
    },
    2: {
      positive: "Wealth accumulation and speech are favorable",
      negative: "Financial losses and speech impediments possible",
    },
    3: {
      positive: "Courage, siblings, and communication thrive",
      negative: "Lacking courage; sibling conflicts likely",
    },
    4: {
      positive: "Home, mother, and happiness are supported",
      negative: "Domestic issues and family discord possible",
    },
    5: {
      positive: "Children, creativity, and intellect flourish",
      negative: "Difficulties with children or creative pursuits",
    },
    6: {
      positive: "Enemies are subdued; health improves",
      negative: "Enemies gain power; health issues arise",
    },
    7: {
      positive: "Marriage and partnerships are favorable",
      negative: "Marital discord and partnership problems",
    },
    8: {
      positive: "Longevity and occult knowledge supported",
      negative: "Health threats; spiritual obstacles arise",
    },
    9: {
      positive: "Luck and dharma are highly favorable",
      negative: "Misfortune and obstacles to dharma",
    },
    10: {
      positive: "Career, status, and achievements excel",
      negative: "Career stagnation and professional setbacks",
    },
    11: {
      positive: "Gains, friendships, and wishes fulfilled",
      negative: "Losses and delay in fulfillment of desires",
    },
    12: {
      positive: "Spiritual pursuits and foreign travel thrive",
      negative: "Losses, expenses, and isolation likely",
    },
  };

  const meaning = meanings[house] || {
    positive: "Favorable outcomes",
    negative: "Challenging outcomes",
  };

  const strength = interpretSAVStrength(sav);
  const interpretation =
    sav >= 26 ? meaning.positive : meaning.negative;

  return `House ${house}: ${interpretation} (SAV: ${sav} - ${strength})`;
}

/**
 * Calculate transit score for timing events
 * BPHS Chapter 72: Use Ashtakavarga for timing
 *
 * This determines if a planet's transit through a sign is favorable
 * based on Ashtakavarga strength and the planet's contributions
 */
export function getTransitScore(
  result: AshtakavargaResult,
  planet: PlanetName,
  signIndex: number
): { score: number; interpretation: string } {
  if (signIndex < 0 || signIndex >= 12) {
    return { score: 0, interpretation: "Invalid sign index" };
  }

  const sav = getSignStrength(result, signIndex);
  const planetBindus = getPlanetBindus(result, planet, signIndex);

  // Transit score combines SAV strength with planet's specific bindus
  const baseScore = sav;
  const planetBonus = planetBindus * 2; // Weight planet contribution higher
  const totalScore = baseScore + planetBonus;

  let interpretation = "";
  if (totalScore >= 40) {
    interpretation = "Excellent timing - highly auspicious for activities";
  } else if (totalScore >= 30) {
    interpretation = "Good timing - favorable for most activities";
  } else if (totalScore >= 20) {
    interpretation = "Moderate timing - proceed cautiously";
  } else if (totalScore >= 10) {
    interpretation = "Weak timing - avoid important decisions";
  } else {
    interpretation = "Very unfavorable - delay important events if possible";
  }

  return {
    score: Math.min(totalScore, 100), // Cap at 100
    interpretation,
  };
}

/**
 * Get strength rating for a planet based on total bindus
 */
function getPlanetStrengthRating(totalBindus: number): string {
  if (totalBindus >= 30) return "Excellent";
  if (totalBindus >= 24) return "Strong";
  if (totalBindus >= 18) return "Moderate";
  if (totalBindus >= 12) return "Weak";
  return "Very Weak";
}

/**
 * Generate comprehensive Ashtakavarga summary
 * BPHS Chapters 71-72: Interpretation and guidance
 */
export function getAshtakavargaSummary(
  result: AshtakavargaResult
): AshtakavargaSummary {
  // Determine overall strength
  const avgSAV = result.totalSAV / 12;
  let overallStrength: "strong" | "moderate" | "weak";

  if (result.strongHouses.length >= 6) {
    overallStrength = "strong";
  } else if (result.weakHouses.length >= 6) {
    overallStrength = "weak";
  } else {
    overallStrength = "moderate";
  }

  // Best houses (3 strongest)
  const bestHouses = result.sarvashtakavarga
    .map((sav, idx) => ({
      house: getHouseFromSignIndex(idx),
      sav,
      interpretation: getHouseInterpretation(
        getHouseFromSignIndex(idx),
        sav
      ),
    }))
    .sort((a, b) => b.sav - a.sav)
    .slice(0, 3);

  // Worst houses (3 weakest)
  const worstHouses = result.sarvashtakavarga
    .map((sav, idx) => ({
      house: getHouseFromSignIndex(idx),
      sav,
      interpretation: getHouseInterpretation(
        getHouseFromSignIndex(idx),
        sav
      ),
    }))
    .sort((a, b) => a.sav - b.sav)
    .slice(0, 3);

  // Planet rankings
  const planetRankings = result.planetAshtakavargas
    .map((pav) => ({
      planet: pav.planet,
      totalBindus: pav.totalBindus,
      strength: getPlanetStrengthRating(pav.totalBindus),
    }))
    .sort((a, b) => b.totalBindus - a.totalBindus);

  // Transit guidance
  const transitGuidance =
    overallStrength === "strong"
      ? "Current Ashtakavarga is very strong. Most lunar transits and planetary periods will be auspicious. Focus on initiating important activities."
      : overallStrength === "weak"
        ? "Current Ashtakavarga is weak. Be cautious with major decisions. Avoid starting new ventures unless planetary periods are strongly supportive."
        : "Current Ashtakavarga is moderate. Selective timing of events based on specific house and transit strength is recommended.";

  return {
    overallStrength,
    bestHouses,
    worstHouses,
    planetRankings,
    transitGuidance,
  };
}

/**
 * Get all strong and weak houses with detailed analysis
 */
export function getAllHouseStrengths(
  result: AshtakavargaResult
): Array<{ house: number; sav: number; strength: string; meaning: string }> {
  return result.sarvashtakavarga.map((sav, signIndex) => ({
    house: getHouseFromSignIndex(signIndex),
    sav,
    strength: interpretSAVStrength(sav),
    meaning: SIGNS[signIndex]?.name || `Sign ${signIndex + 1}`,
  }));
}

/**
 * Export all calculation results for external use
 */
export function exportAshtakavargaData(
  result: AshtakavargaResult
): {
  planets: Array<{
    name: PlanetName;
    bindus: number[];
    totalBindus: number;
    reducedBindus: number[];
  }>;
  sarvashtakavarga: number[];
  totalSAV: number;
  strongHouses: number[];
  weakHouses: number[];
} {
  return {
    planets: result.planetAshtakavargas.map((pav) => ({
      name: pav.planet,
      bindus: pav.bindus,
      totalBindus: pav.totalBindus,
      reducedBindus: pav.reducedBindus || [],
    })),
    sarvashtakavarga: result.sarvashtakavarga,
    totalSAV: result.totalSAV,
    strongHouses: result.strongHouses,
    weakHouses: result.weakHouses,
  };
}
