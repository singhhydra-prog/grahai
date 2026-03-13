/**
 * Multi-Factor Chart Synthesis Engine — GrahAI
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Comprehensive chart analysis system that synthesizes ALL analysis layers:
 * - Life Domain Scoring (7 major domains across 0-100 scale)
 * - Chart Signature (Element, Modality, Dominant Planet, Chart Pattern)
 * - Timing Synthesis (Dasha-SAV-Yoga-Dosha integration)
 * - Full Chart Synthesis (Executive summary with rankings and insights)
 *
 * References:
 *  - BPHS Chapter 3: House divisions and significances
 *  - BPHS Chapter 66-72: Ashtakavarga and house strength
 *  - BPHS Chapter 46: Dasha system timing
 *  - Classical Jyotish principles on life domains
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  NatalChart,
  PlanetName,
  PlanetData,
  YogaResult,
  DoshaResult,
} from "./types";
import { analyzeChartStrength, type ChartStrengthAnalysis } from "./planet-strength";
import {
  calculateAshtakavarga,
  getAshtakavargaSummary,
  type AshtakavargaResult,
  type AshtakavargaSummary,
} from "./ashtakavarga";
import { analyzeVargas, type VargaInterpretation } from "./varga-interpretation";
import { analyzeDoshaCancellations, type ComprehensiveDoshaAnalysis } from "./dosha-cancellations";
import { getActiveYogas } from "./yogas";
import { getActiveDoshas } from "./doshas";
import { calculateFullDasha } from "./dasha-engine";
import type { DashaAnalysis } from "./types";
import { SIGNS } from "./constants";

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Represents a single life domain assessment with contributing factors and score.
 * Each domain (Career, Wealth, etc.) is scored 0-100 with supporting evidence.
 */
export interface DomainScore {
  /** Numeric score from 0-100 */
  score: number;

  /** Human-readable quality label */
  label: "exceptional" | "strong" | "above_average" | "average" | "below_average" | "weak";

  /** Breakdown of contributing factors with their impact */
  factors: Array<{
    /** Name of the contributing factor */
    name: string;
    /** Numeric contribution to final score (0-100) */
    contribution: number;
    /** Detailed explanation of how this factor affects the domain */
    detail: string;
  }>;

  /** Concise 1-2 sentence interpretation of this domain in the chart */
  summary: string;
}

/**
 * Complete life domain assessment across all 7 major areas.
 * Each domain integrates multiple analysis factors weighted by classical importance.
 */
export interface LifeDomainScores {
  /** Career, Status, Authority, Public Life */
  career: DomainScore;

  /** Wealth, Finance, Prosperity, Material Gains */
  wealth: DomainScore;

  /** Relationships, Marriage, Partnership, Love */
  relationships: DomainScore;

  /** Physical Health, Vitality, Immunity, Longevity */
  health: DomainScore;

  /** Spiritual Growth, Dharma, Purpose, Inner Development */
  spirituality: DomainScore;

  /** Learning, Intellect, Knowledge, Scholarship */
  education: DomainScore;

  /** Overall Fortune, Luck, General Prosperity across all areas */
  overallFortune: DomainScore;
}

/**
 * Chart's dominant theme and visual pattern analysis.
 * Identifies the chart's core nature through element, modality, and pattern recognition.
 */
export interface ChartSignature {
  /** Most prevalent element in chart (Fire, Earth, Air, Water) */
  dominantElement: {
    element: string;
    count: number;
    percentage: number;
  };

  /** Most prevalent modality (Cardinal, Fixed, Mutable) */
  dominantModality: {
    modality: string;
    count: number;
    percentage: number;
  };

  /** Complete element distribution across all planets */
  elementBalance: Array<{
    element: string;
    count: number;
    planets: string[];
  }>;

  /** Complete modality distribution across all planets */
  modalityBalance: Array<{
    modality: string;
    count: number;
    planets: string[];
  }>;

  /** Strongest planet in the chart by composite strength */
  dominantPlanet: {
    planet: string;
    strength: number;
    role: string;
  };

  /** Chart pattern type and interpretation */
  chartPattern: {
    type: string;
    description: string;
  };

  /** Key themes emerging from the chart structure */
  keyThemes: string[];
}

/**
 * Current period timing assessment combining Dasha, SAV, Yogas, and Doshas.
 * Provides actionable guidance for the active Mahadasha and Antardasha periods.
 */
export interface TimingSynthesis {
  /** Current Mahadasha lord analysis */
  currentMahadasha: {
    planet: string;
    strength: string;
    favorableAreas: string[];
    challenges: string[];
  };

  /** Current Antardasha lord analysis */
  currentAntardasha: {
    planet: string;
    strength: string;
    favorableAreas: string[];
    challenges: string[];
  };

  /** Yogas activated by current dasha lords */
  dashaYogaActivation: string[];

  /** Doshas triggered or modulated by current dasha lords */
  dashaDoshaActivation: string[];

  /** Overall period favorability 0-100 */
  periodRating: number;

  /** Overall period quality description */
  periodLabel: string;

  /** Key opportunities to harness in this period */
  keyOpportunities: string[];

  /** Key risks to mitigate in this period */
  keyRisks: string[];

  /** Practical guidance for navigating this period */
  guidance: string;
}

/**
 * Master synthesis combining all analysis layers into one comprehensive assessment.
 * Provides both granular rankings and high-level executive summary.
 */
export interface FullChartSynthesis {
  /** Chart's dominant themes and pattern type */
  chartSignature: ChartSignature;

  /** Scores across all 7 life domains */
  lifeDomainScores: LifeDomainScores;

  /** Current period assessment and timing guidance */
  timingSynthesis: TimingSynthesis;

  /** All planets ranked by composite strength */
  strengthRankings: Array<{
    planet: string;
    compositeStrength: number;
  }>;

  /** Yoga impact summary */
  yogaImpact: {
    totalYogas: number;
    beneficYogas: number;
    maleficYogas: number;
    netYogaScore: number;
  };

  /** Dosha impact summary */
  doshaImpact: {
    totalDoshas: number;
    effectiveDoshas: number;
    overallAffliction: string;
  };

  /** Ashtakavarga overview */
  ashtakavargaOverview: {
    totalSAV: number;
    strongHouses: number[];
    weakHouses: number[];
  };

  /** Top 5 chart strengths */
  topStrengths: string[];

  /** Top 5 chart challenges */
  topChallenges: string[];

  /** Overall chart quality 0-100 */
  overallChartRating: number;

  /** Overall chart quality label */
  overallLabel: "exceptional" | "strong" | "above_average" | "average" | "below_average" | "weak" | "challenged";

  /** 3-4 sentence holistic interpretation of the entire chart */
  executiveSummary: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Normalize a value to 0-100 scale.
 * @param value - Raw value
 * @param min - Minimum expected value
 * @param max - Maximum expected value
 * @returns Normalized 0-100 score
 */
function normalizeScore(value: number, min: number = 0, max: number = 100): number {
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * 100;
}

/**
 * Get label for a numeric score.
 */
function getScoreLabel(
  score: number
): "exceptional" | "strong" | "above_average" | "average" | "below_average" | "weak" {
  if (score >= 85) return "exceptional";
  if (score >= 70) return "strong";
  if (score >= 55) return "above_average";
  if (score >= 45) return "average";
  if (score >= 30) return "below_average";
  return "weak";
}

/**
 * Find a planet's house position.
 */
function getPlanetHouse(chart: NatalChart, planetName: PlanetName): number {
  const planet = chart.planets.find((p) => p.name === planetName);
  return planet?.house ?? 0;
}

/**
 * Find a planet by name in the chart.
 */
function findPlanet(chart: NatalChart, name: PlanetName): PlanetData | undefined {
  return chart.planets.find((p) => p.name === name);
}

/**
 * Get all planets in a specific house.
 */
function getPlanetsInHouse(chart: NatalChart, house: number): PlanetData[] {
  return chart.planets.filter((p) => p.house === house);
}

/**
 * Get the lord of a specific house.
 */
function getHouseLord(chart: NatalChart, house: number): PlanetName | undefined {
  const houseData = chart.houses.find((h) => h.number === house);
  return houseData?.lord;
}

/**
 * Get strength assessment for a specific planet.
 */
function getPlanetStrength(
  strengthAnalysis: ChartStrengthAnalysis,
  planetName: PlanetName
): number {
  const report = strengthAnalysis.planets.find((p) => p.planet === planetName);
  return report?.compositeStrength.adjusted ?? 0;
}

/**
 * Get element of a sign.
 */
function getSignElement(signIndex: number): string {
  const sign = SIGNS[signIndex];
  return sign?.element ?? "Unknown";
}

/**
 * Get modality of a sign.
 */
function getSignModality(signIndex: number): string {
  const sign = SIGNS[signIndex];
  return sign?.quality ?? "Unknown";
}

/**
 * Get sign name from index.
 */
function getSignName(signIndex: number): string {
  const sign = SIGNS[signIndex];
  return sign?.name ?? "Unknown";
}

// ═══════════════════════════════════════════════════════════════════════════
// LIFE DOMAIN SCORING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate Life Domain Scores — comprehensive assessment across 7 major life areas.
 *
 * Weighting strategy:
 * - Career: 30% D10 strength, 25% 10th SAV, 20% 10th lord strength, 15% career yogas, 10% other
 * - Wealth: 25% Jupiter, 25% 2/11 SAV, 25% dhan yogas, 15% 2/11 lord strength, 10% other
 * - Relationships: 25% Venus, 25% 7th SAV, 20% marriage yogas, 15% 7th lord, 15% dosha cancellations
 * - Health: 25% Ascendant lord, 25% 6th house analysis, 20% Sun/Mars, 15% affliction count, 15% other
 * - Spirituality: 30% 9th SAV, 25% Jupiter, 20% dharma yogas, 15% Navamsa, 10% 12th house
 * - Education: 30% Mercury, 25% 4th/5th SAV, 20% Saraswati yogas, 15% 5th lord, 10% other
 * - Overall: Composite of all above plus SAV, yoga count, and dosha impact
 *
 * @param chart - Natal chart to analyze
 * @returns LifeDomainScores with detailed factor breakdown
 */
export function calculateLifeDomainScores(chart: NatalChart): LifeDomainScores {
  // Gather all necessary analysis data
  const strengthAnalysis = analyzeChartStrength(chart);
  const ashtakavarga = calculateAshtakavarga(chart);
  const activeYogas = getActiveYogas(chart);
  const activeDoshas = getActiveDoshas(chart);
  const doshaAnalysis = analyzeDoshaCancellations(chart);
  const vargaAnalysis = analyzeVargas(chart);

  // Helper: Extract SAV for a specific house
  const getHouseSAV = (house: number): number => {
    if (house < 1 || house > 12) return 0;
    return ashtakavarga.sarvashtakavarga[house - 1] ?? 0;
  };

  // Helper: Count yogas affecting a specific domain
  const countDomainYogas = (keywords: string[]): number => {
    return activeYogas.filter((y) =>
      keywords.some((kw) => y.name.toLowerCase().includes(kw.toLowerCase()))
    ).length;
  };

  // Helper: Count doshas affecting relationships
  const countRelationshipDoshas = (): number => {
    return activeDoshas.filter((d) =>
      ["Mangal Dosha", "Grahan Yoga", "Chandal Yoga"].includes(d.type)
    ).length;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CAREER & STATUS (Karma)
  // ─────────────────────────────────────────────────────────────────────────

  const sun = findPlanet(chart, "Sun");
  const tenthLord = getHouseLord(chart, 10);
  const tenthLordStrength = tenthLord ? getPlanetStrength(strengthAnalysis, tenthLord) : 0;
  const tenthSAV = getHouseSAV(10);
  const careerYogasCount = countDomainYogas(["raj", "career", "panch mahapurush"]);

  const careerScore =
    tenthSAV * 0.25 + // 10th house SAV (25%)
    tenthLordStrength * 0.2 + // 10th lord strength (20%)
    normalizeScore(careerYogasCount * 20, 0, 100) * 0.15 + // Career yogas (15%)
    normalizeScore(sun?.degree ?? 0, 0, 30) * 0.1 + // Sun's placement (10%)
    normalizeScore(getPlanetStrength(strengthAnalysis, "Sun"), 0, 100) * 0.3; // Sun strength (30%)

  const career: DomainScore = {
    score: careerScore,
    label: getScoreLabel(careerScore),
    factors: [
      { name: "10th House SAV", contribution: tenthSAV, detail: `10th house strength: ${tenthSAV}/40 bindus` },
      {
        name: "10th Lord Strength",
        contribution: tenthLordStrength,
        detail: `${tenthLord} strength assessment: ${tenthLordStrength}/100`,
      },
      {
        name: "Career Yogas",
        contribution: careerYogasCount * 20,
        detail: `${careerYogasCount} career-related yogas present`,
      },
      {
        name: "Sun Strength",
        contribution: getPlanetStrength(strengthAnalysis, "Sun"),
        detail: "Sun is primary significator of authority and career",
      },
    ],
    summary: `Career potential is ${careerScore >= 70 ? "strong with clear opportunity" : "moderate, requiring effort to build"} for public recognition and authority.`,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // WEALTH & FINANCE (Artha)
  // ─────────────────────────────────────────────────────────────────────────

  const jupiter = findPlanet(chart, "Jupiter");
  const secondLord = getHouseLord(chart, 2);
  const eleventhLord = getHouseLord(chart, 11);
  const secondSAV = getHouseSAV(2);
  const eleventhSAV = getHouseSAV(11);
  const secondLordStrength = secondLord ? getPlanetStrength(strengthAnalysis, secondLord) : 0;
  const eleventhLordStrength = eleventhLord ? getPlanetStrength(strengthAnalysis, eleventhLord) : 0;
  const jupiterStrength = getPlanetStrength(strengthAnalysis, "Jupiter");
  const wealthYogasCount = countDomainYogas(["dhan", "wealth", "lakshmi"]);

  const wealthScore =
    jupiterStrength * 0.25 + // Jupiter (25%)
    ((secondSAV + eleventhSAV) / 2) * 0.25 + // 2nd/11th SAV (25%)
    normalizeScore(wealthYogasCount * 20, 0, 100) * 0.25 + // Wealth yogas (25%)
    ((secondLordStrength + eleventhLordStrength) / 2) * 0.15 + // 2nd/11th lords (15%)
    normalizeScore(jupiter?.degree ?? 0, 0, 30) * 0.1; // Jupiter placement (10%)

  const wealth: DomainScore = {
    score: wealthScore,
    label: getScoreLabel(wealthScore),
    factors: [
      { name: "Jupiter Strength", contribution: jupiterStrength, detail: `Jupiter (wealth) strength: ${jupiterStrength}/100` },
      { name: "2nd House SAV", contribution: secondSAV, detail: `2nd house strength: ${secondSAV}/40` },
      { name: "11th House SAV", contribution: eleventhSAV, detail: `11th house strength: ${eleventhSAV}/40` },
      { name: "Wealth Yogas", contribution: wealthYogasCount * 20, detail: `${wealthYogasCount} wealth-related yogas` },
    ],
    summary: `Financial prosperity is ${wealthScore >= 65 ? "favorable" : "developing"}, with Jupiter as a key determinant.`,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RELATIONSHIPS & MARRIAGE (Kama)
  // ─────────────────────────────────────────────────────────────────────────

  const venus = findPlanet(chart, "Venus");
  const seventhLord = getHouseLord(chart, 7);
  const seventhSAV = getHouseSAV(7);
  const seventhLordStrength = seventhLord ? getPlanetStrength(strengthAnalysis, seventhLord) : 0;
  const venusStrength = getPlanetStrength(strengthAnalysis, "Venus");
  const marriageYogasCount = countDomainYogas(["marriage", "parivartana"]);
  const relationshipDoshasCount = countRelationshipDoshas();
  const mangalDosha = doshaAnalysis.doshas.find(d => d.doshaType === "Mangal Dosha");
  const doshaReduction = mangalDosha?.isEffectivelyCancelled ? 20 : 0;

  const relationshipScore =
    venusStrength * 0.25 + // Venus (25%)
    seventhSAV * 0.25 + // 7th house SAV (25%)
    normalizeScore(marriageYogasCount * 20, 0, 100) * 0.2 + // Marriage yogas (20%)
    seventhLordStrength * 0.15 + // 7th lord strength (15%)
    normalizeScore(100 - relationshipDoshasCount * 20 + doshaReduction, 0, 100) * 0.15; // Dosha cancellations (15%)

  const relationships: DomainScore = {
    score: relationshipScore,
    label: getScoreLabel(relationshipScore),
    factors: [
      { name: "Venus Strength", contribution: venusStrength, detail: `Venus (relationships) strength: ${venusStrength}/100` },
      { name: "7th House SAV", contribution: seventhSAV, detail: `7th house strength: ${seventhSAV}/40` },
      { name: "Marriage Yogas", contribution: marriageYogasCount * 20, detail: `${marriageYogasCount} partnership yogas` },
      {
        name: "Dosha Status",
        contribution: 100 - relationshipDoshasCount * 20 + doshaReduction,
        detail: `Relationship doshas: ${relationshipDoshasCount}, Cancellations: ${mangalDosha?.isEffectivelyCancelled ? "Yes" : "No"}`,
      },
    ],
    summary: `Relationship potential is ${relationshipScore >= 65 ? "harmonious and stable" : "requires conscious effort"} for meaningful partnership.`,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // HEALTH & VITALITY (Arogya)
  // ─────────────────────────────────────────────────────────────────────────

  const ascendantLord = getHouseLord(chart, 1);
  const ascendantLordStrength = ascendantLord ? getPlanetStrength(strengthAnalysis, ascendantLord) : 0;
  const sunStrength = getPlanetStrength(strengthAnalysis, "Sun");
  const marsStrength = getPlanetStrength(strengthAnalysis, "Mars");
  const sixthSAV = getHouseSAV(6);
  const eighthSAV = getHouseSAV(8);
  const maleficAfflictions = activeDoshas.filter((d) => d.severity === "high").length;

  const healthScore =
    ascendantLordStrength * 0.25 + // Ascendant lord (25%)
    normalizeScore(40 - sixthSAV, 0, 40) * 0.25 + // 6th house (weak is better) (25%)
    sunStrength * 0.2 + // Sun (vitality) (20%)
    marsStrength * 0.15 + // Mars (strength) (15%)
    normalizeScore(100 - maleficAfflictions * 15, 0, 100) * 0.15; // Afflictions (15%)

  const health: DomainScore = {
    score: healthScore,
    label: getScoreLabel(healthScore),
    factors: [
      { name: "Ascendant Lord Strength", contribution: ascendantLordStrength, detail: `Lagna lord strength: ${ascendantLordStrength}/100` },
      { name: "Sun Strength", contribution: sunStrength, detail: `Sun (immunity) strength: ${sunStrength}/100` },
      { name: "Mars Strength", contribution: marsStrength, detail: `Mars (vigor) strength: ${marsStrength}/100` },
      { name: "6th House Status", contribution: Math.max(0, 40 - sixthSAV), detail: `6th house SAV: ${sixthSAV} (lower is better)` },
      { name: "Affliction Level", contribution: 100 - maleficAfflictions * 15, detail: `Severe doshas: ${maleficAfflictions}` },
    ],
    summary: `Health outlook is ${healthScore >= 65 ? "robust with good constitutional strength" : "requires preventive care and lifestyle management"}.`,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SPIRITUALITY & DHARMA
  // ─────────────────────────────────────────────────────────────────────────

  const ninthSAV = getHouseSAV(9);
  const twelfthSAV = getHouseSAV(12);
  const dharmaYogasCount = countDomainYogas(["neecha bhanga", "parivartana", "gaja kesari"]);
  const ninthLord = getHouseLord(chart, 9);
  const ninthLordStrength = ninthLord ? getPlanetStrength(strengthAnalysis, ninthLord) : 0;

  const spiritualityScore =
    ninthSAV * 0.3 + // 9th house SAV (30%)
    jupiterStrength * 0.25 + // Jupiter (25%)
    normalizeScore(dharmaYogasCount * 25, 0, 100) * 0.2 + // Dharma yogas (20%)
    ninthLordStrength * 0.15 + // 9th lord (15%)
    normalizeScore(twelfthSAV, 0, 40) * 0.1; // 12th house (10%)

  const spirituality: DomainScore = {
    score: spiritualityScore,
    label: getScoreLabel(spiritualityScore),
    factors: [
      { name: "9th House SAV", contribution: ninthSAV, detail: `9th house (dharma) strength: ${ninthSAV}/40` },
      { name: "Jupiter Strength", contribution: jupiterStrength, detail: `Jupiter (guru/spirituality) strength: ${jupiterStrength}/100` },
      { name: "Dharma Yogas", contribution: dharmaYogasCount * 25, detail: `${dharmaYogasCount} spiritual/dharma yogas` },
      { name: "12th House", contribution: twelfthSAV, detail: `12th house (liberation) strength: ${twelfthSAV}/40` },
    ],
    summary: `Spiritual inclination is ${spiritualityScore >= 60 ? "well-supported with strong dharmic orientation" : "developing, with potential for growth"}.`,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // EDUCATION & KNOWLEDGE (Vidya)
  // ─────────────────────────────────────────────────────────────────────────

  const mercury = findPlanet(chart, "Mercury");
  const mercuryStrength = getPlanetStrength(strengthAnalysis, "Mercury");
  const fourthSAV = getHouseSAV(4);
  const fifthSAV = getHouseSAV(5);
  const fifthLord = getHouseLord(chart, 5);
  const fifthLordStrength = fifthLord ? getPlanetStrength(strengthAnalysis, fifthLord) : 0;
  const educationYogasCount = countDomainYogas(["saraswati", "budhaditya"]);

  const educationScore =
    mercuryStrength * 0.3 + // Mercury (30%)
    ((fourthSAV + fifthSAV) / 2) * 0.25 + // 4th/5th SAV (25%)
    normalizeScore(educationYogasCount * 25, 0, 100) * 0.2 + // Education yogas (20%)
    fifthLordStrength * 0.15 + // 5th lord (15%)
    normalizeScore(mercury?.degree ?? 0, 0, 30) * 0.1; // Mercury placement (10%)

  const education: DomainScore = {
    score: educationScore,
    label: getScoreLabel(educationScore),
    factors: [
      { name: "Mercury Strength", contribution: mercuryStrength, detail: `Mercury (intellect) strength: ${mercuryStrength}/100` },
      { name: "4th House SAV", contribution: fourthSAV, detail: `4th house (learning) strength: ${fourthSAV}/40` },
      { name: "5th House SAV", contribution: fifthSAV, detail: `5th house (intellect) strength: ${fifthSAV}/40` },
      { name: "Education Yogas", contribution: educationYogasCount * 25, detail: `${educationYogasCount} knowledge yogas` },
    ],
    summary: `Learning potential is ${educationScore >= 65 ? "excellent with strong intellectual capacity" : "developing with dedicated effort"}.`,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // OVERALL FORTUNE (Bhagya)
  // ─────────────────────────────────────────────────────────────────────────

  const totalSAV = ashtakavarga.totalSAV;
  const totalYogas = activeYogas.length;
  const beneficYogasCount = activeYogas.filter((y) => y.category.includes("Raj")).length;
  const doshaAffliction = activeDoshas.filter((d) => d.severity === "high").length;

  const overallScore =
    (careerScore + wealthScore + relationshipScore + healthScore + spiritualityScore + educationScore) / 6 *
    0.6 + // Average of domains (60%)
    normalizeScore(totalSAV, 0, 337) * 0.15 + // Total SAV (15%)
    normalizeScore(totalYogas * 10, 0, 100) * 0.1 + // Yoga count (10%)
    normalizeScore(100 - doshaAffliction * 20, 0, 100) * 0.15; // Dosha impact (15%)

  const overallFortune: DomainScore = {
    score: overallScore,
    label: getScoreLabel(overallScore),
    factors: [
      {
        name: "Domain Average",
        contribution: (careerScore + wealthScore + relationshipScore + healthScore + spiritualityScore + educationScore) / 6,
        detail: "Average across all 7 life domains",
      },
      { name: "Total Ashtakavarga", contribution: normalizeScore(totalSAV, 0, 337), detail: `Total SAV: ${totalSAV}/337` },
      { name: "Yoga Count", contribution: normalizeScore(totalYogas * 10, 0, 100), detail: `${totalYogas} total yogas (${beneficYogasCount} beneficial)` },
      {
        name: "Dosha Impact",
        contribution: 100 - doshaAffliction * 20,
        detail: `${activeDoshas.length} total doshas, ${doshaAffliction} severe`,
      },
    ],
    summary: `Overall life fortune indicates ${overallScore >= 65 ? "significant potential for success and fulfillment" : "a challenging path requiring adaptability and effort"}.`,
  };

  return {
    career,
    wealth,
    relationships,
    health,
    spirituality,
    education,
    overallFortune,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CHART SIGNATURE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extract Chart Signature — dominant themes, elements, modalities, and patterns.
 *
 * @param chart - Natal chart to analyze
 * @returns ChartSignature with element/modality balance and chart pattern
 */
export function getChartSignature(chart: NatalChart): ChartSignature {
  const strengthAnalysis = analyzeChartStrength(chart);

  // ─────────────────────────────────────────────────────────────────────────
  // Element & Modality Analysis
  // ─────────────────────────────────────────────────────────────────────────

  const elementCounts: Record<string, { count: number; planets: string[] }> = {
    Fire: { count: 0, planets: [] },
    Earth: { count: 0, planets: [] },
    Air: { count: 0, planets: [] },
    Water: { count: 0, planets: [] },
  };

  const modalityCounts: Record<string, { count: number; planets: string[] }> = {
    Cardinal: { count: 0, planets: [] },
    Fixed: { count: 0, planets: [] },
    Mutable: { count: 0, planets: [] },
  };

  // Count planets in each element and modality
  for (const planet of chart.planets) {
    const element = planet.sign.element;
    const modality = planet.sign.quality;

    elementCounts[element].count++;
    elementCounts[element].planets.push(planet.name);

    modalityCounts[modality].count++;
    modalityCounts[modality].planets.push(planet.name);
  }

  // Find dominant element and modality
  const elementEntries = Object.entries(elementCounts);
  const dominantElement = elementEntries.reduce(
    (max, [key, data]) => data.count > max.count ? { name: key, count: data.count, planets: data.planets } : max,
    { name: "Fire", count: 0, planets: [] as string[] }
  );

  const modalityEntries = Object.entries(modalityCounts);
  const dominantModality = modalityEntries.reduce(
    (max, [key, data]) => data.count > max.count ? { name: key, count: data.count, planets: data.planets } : max,
    { name: "Cardinal", count: 0, planets: [] as string[] }
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Chart Pattern Detection
  // ─────────────────────────────────────────────────────────────────────────

  // Get planet positions as degrees
  const planetPositions = chart.planets.map((p) => ({
    name: p.name,
    longitude: p.longitude,
  }));

  // Determine chart pattern
  const pattern = detectChartPattern(planetPositions);

  // ─────────────────────────────────────────────────────────────────────────
  // Dominant Planet
  // ─────────────────────────────────────────────────────────────────────────

  const strongestReport = strengthAnalysis.planets.reduce((max, current) =>
    current.compositeStrength.adjusted > max.compositeStrength.adjusted ? current : max
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Key Themes
  // ─────────────────────────────────────────────────────────────────────────

  const keyThemes: string[] = [];

  if (dominantElement.count >= 4) {
    keyThemes.push(`Strong ${dominantElement.name} energy (action, passion, transformation)`);
  }
  if (modalityCounts.Fixed.count >= 4) {
    keyThemes.push("Fixed modality dominance (stability, persistence, resistance to change)");
  }
  if (modalityCounts.Mutable.count >= 4) {
    keyThemes.push("Mutable modality dominance (adaptability, communication, versatility)");
  }
  keyThemes.push(`${strongestReport.planet} is the chart's most influential planet`);
  keyThemes.push(`${pattern.type} pattern indicates ${pattern.description}`);

  return {
    dominantElement: {
      element: dominantElement.name,
      count: dominantElement.count,
      percentage: (dominantElement.count / chart.planets.length) * 100,
    },
    dominantModality: {
      modality: dominantModality.name,
      count: dominantModality.count,
      percentage: (dominantModality.count / chart.planets.length) * 100,
    },
    elementBalance: elementEntries.map(([element, data]) => ({
      element,
      count: data.count,
      planets: data.planets,
    })),
    modalityBalance: modalityEntries.map(([modality, data]) => ({
      modality,
      count: data.count,
      planets: data.planets,
    })),
    dominantPlanet: {
      planet: strongestReport.planet,
      strength: strongestReport.compositeStrength.adjusted,
      role: strongestReport.summary.split(".")[0],
    },
    chartPattern: pattern,
    keyThemes,
  };
}

/**
 * Detect chart pattern type based on planetary distribution.
 * Analyzes the span and grouping of planets across the zodiac.
 */
function detectChartPattern(
  positions: Array<{ name: string; longitude: number }>
): { type: string; description: string } {
  // Normalize longitudes to 0-360
  const normalized = positions.map((p) => ({
    ...p,
    longitude: ((p.longitude % 360) + 360) % 360,
  }));

  // Sort by longitude
  normalized.sort((a, b) => a.longitude - b.longitude);

  if (normalized.length < 4) {
    return { type: "Insufficient Data", description: "Chart has fewer than 4 planets" };
  }

  // Calculate gaps between consecutive planets
  const gaps: number[] = [];
  for (let i = 0; i < normalized.length; i++) {
    const current = normalized[i].longitude;
    const next = normalized[(i + 1) % normalized.length].longitude;
    const gap = next >= current ? next - current : 360 + next - current;
    gaps.push(gap);
  }

  const maxGap = Math.max(...gaps);
  const maxGapIndex = gaps.indexOf(maxGap);
  const minGap = Math.min(...gaps);
  const planetSpan = 360 - maxGap;

  // Bundle: all planets within 120° (4 signs)
  if (planetSpan <= 120) {
    return {
      type: "Bundle",
      description: "All planets concentrated in one quadrant; focused, specialist energy",
    };
  }

  // Splash: planets spread across 8+ signs
  if (gaps.filter((g) => g < 45).length >= 6) {
    return {
      type: "Splash",
      description: "Planets widely distributed; universal interests, versatile talents",
    };
  }

  // Locomotive: planets span 240° with one major gap
  if (planetSpan >= 240 && maxGap >= 120) {
    return {
      type: "Locomotive",
      description: "Purposeful forward motion; self-generating energy and ambition",
    };
  }

  // Seesaw: two distinct groups opposite
  if (maxGap >= 120 && maxGap <= 180) {
    return {
      type: "Seesaw",
      description: "Polarized energy; oscillating between opposing forces and perspectives",
    };
  }

  // Bucket: Bowl with one opposing planet (handle)
  if (planetSpan <= 180 && maxGap >= 120) {
    return {
      type: "Bucket",
      description: "Central group plus one focuser planet; concentrated energy with direction",
    };
  }

  // Bowl: all planets within 180°
  if (planetSpan <= 180) {
    return {
      type: "Bowl",
      description: "Self-contained; subjective perspective, introspective orientation",
    };
  }

  // Splay: irregular groupings
  return {
    type: "Splay",
    description: "Irregular pattern; adaptable, eclectic, non-conformist energy",
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// TIMING SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Synthesize current period assessment combining Dasha + SAV + Yogas + Doshas.
 *
 * @param chart - Natal chart to analyze
 * @returns TimingSynthesis with current period guidance
 */
export function synthesizeCurrentTiming(chart: NatalChart): TimingSynthesis {
  const dashaAnalysis = calculateFullDasha(chart);
  const strengthAnalysis = analyzeChartStrength(chart);
  const ashtakavarga = calculateAshtakavarga(chart);
  const activeYogas = getActiveYogas(chart);
  const activeDoshas = getActiveDoshas(chart);

  const mahadashaPlanet = dashaAnalysis.currentMahadasha.planet;
  const antardashaPlanet = dashaAnalysis.currentAntardasha.planet;

  const mahadashaStrength = getPlanetStrength(strengthAnalysis, mahadashaPlanet);
  const antardashaStrength = getPlanetStrength(strengthAnalysis, antardashaPlanet);

  // ─────────────────────────────────────────────────────────────────────────
  // SAV (Ashtakavarga) Analysis for Dasha Lords
  // ─────────────────────────────────────────────────────────────────────────

  const getPlanetSAVScore = (planet: PlanetName): number => {
    const planetAV = ashtakavarga.planetAshtakavargas.find((pav) => pav.planet === planet);
    return planetAV?.totalBindus ?? 0;
  };

  const mahaSAV = getPlanetSAVScore(mahadashaPlanet);
  const antarSAV = getPlanetSAVScore(antardashaPlanet);

  // ─────────────────────────────────────────────────────────────────────────
  // Yoga Activation
  // ─────────────────────────────────────────────────────────────────────────

  const dashaYogaActivation = activeYogas
    .filter((y) => y.involvedPlanets.includes(mahadashaPlanet) || y.involvedPlanets.includes(antardashaPlanet))
    .map((y) => y.name);

  // ─────────────────────────────────────────────────────────────────────────
  // Dosha Activation
  // ─────────────────────────────────────────────────────────────────────────

  const dashaDoshaActivation = activeDoshas
    .filter((d) => d.involvedPlanets.includes(mahadashaPlanet) || d.involvedPlanets.includes(antardashaPlanet))
    .map((d) => d.type);

  // ─────────────────────────────────────────────────────────────────────────
  // Period Rating Calculation
  // ─────────────────────────────────────────────────────────────────────────

  const periodRating =
    (mahadashaStrength * 0.3 + antardashaStrength * 0.3) + // Dasha lord strength (60%)
    normalizeScore(mahaSAV + antarSAV, 0, 50) * 0.2 + // SAV scores (20%)
    normalizeScore(dashaYogaActivation.length * 10, 0, 100) * 0.1 + // Yoga activation (10%)
    normalizeScore(100 - dashaDoshaActivation.length * 15, 0, 100) * 0.0; // Dosha mitigation (0% for visibility)

  const periodLabel = periodRating >= 70 ? "Very Favorable" : periodRating >= 55 ? "Favorable" : "Mixed";

  // ─────────────────────────────────────────────────────────────────────────
  // Opportunities & Risks
  // ─────────────────────────────────────────────────────────────────────────

  const keyOpportunities: string[] = [];
  const keyRisks: string[] = [];

  if (mahadashaStrength >= 70) {
    keyOpportunities.push(`Leverage ${mahadashaPlanet}'s strong position for major life initiatives`);
  }
  if (antardashaStrength >= 70) {
    keyOpportunities.push(`${antardashaPlanet} energies support detailed work and completion`);
  }
  if (dashaYogaActivation.length > 0) {
    keyOpportunities.push(`Active yogas: ${dashaYogaActivation.join(", ")} amplify favorability`);
  }
  if (mahaSAV >= 35) {
    keyOpportunities.push(`High Ashtakavarga for ${mahadashaPlanet} indicates strong timing`);
  }

  if (mahadashaStrength < 40) {
    keyRisks.push(`${mahadashaPlanet}'s weak placement may create obstacles`);
  }
  if (antardashaStrength < 40) {
    keyRisks.push(`${antardashaPlanet}'s weakness requires careful navigation`);
  }
  if (dashaDoshaActivation.length > 0) {
    keyRisks.push(`Active doshas: ${dashaDoshaActivation.join(", ")} may create challenges`);
  }
  if (mahaSAV < 25) {
    keyRisks.push(`Low Ashtakavarga suggests timing caution for major ventures`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Guidance
  // ─────────────────────────────────────────────────────────────────────────

  const guidance = `During ${mahadashaPlanet}'s Mahadasha with ${antardashaPlanet} Antardasha, ` +
    (periodRating >= 70
      ? `the planetary timing is favorable for growth. Prioritize opportunities in ${dashaYogaActivation.length > 0 ? "activated yoga areas" : "${mahadashaPlanet}'s domains"}. Remain proactive but flexible.`
      : periodRating >= 55
        ? `the period shows mixed signals. Focus on consolidation and careful planning. Avoid overextension.`
        : `careful planning is needed. Focus on strengthening foundations rather than major expansion. Use remedies strategically.`);

  return {
    currentMahadasha: {
      planet: mahadashaPlanet,
      strength: mahadashaStrength >= 70 ? "Strong" : mahadashaStrength >= 40 ? "Moderate" : "Weak",
      favorableAreas: [`${mahadashaPlanet}'s significances`, "House ${findPlanet(chart, mahadashaPlanet)?.house}"],
      challenges: mahadashaStrength < 50 ? [`${mahadashaPlanet} requires careful handling`] : [],
    },
    currentAntardasha: {
      planet: antardashaPlanet,
      strength: antardashaStrength >= 70 ? "Strong" : antardashaStrength >= 40 ? "Moderate" : "Weak",
      favorableAreas: [`${antardashaPlanet}'s significances`, "House ${findPlanet(chart, antardashaPlanet)?.house}"],
      challenges: antardashaStrength < 50 ? [`${antardashaPlanet} requires careful handling`] : [],
    },
    dashaYogaActivation,
    dashaDoshaActivation,
    periodRating: Math.max(0, Math.min(100, periodRating)),
    periodLabel,
    keyOpportunities,
    keyRisks,
    guidance,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// FULL CHART SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Master synthesis function combining all analysis layers.
 *
 * @param chart - Natal chart to analyze
 * @returns FullChartSynthesis with comprehensive assessment
 */
export function synthesizeChart(chart: NatalChart): FullChartSynthesis {
  // Gather all analyses
  const lifeDomainScores = calculateLifeDomainScores(chart);
  const chartSignature = getChartSignature(chart);
  const timingSynthesis = synthesizeCurrentTiming(chart);
  const strengthAnalysis = analyzeChartStrength(chart);
  const ashtakavarga = calculateAshtakavarga(chart);
  const activeYogas = getActiveYogas(chart);
  const activeDoshas = getActiveDoshas(chart);

  // ─────────────────────────────────────────────────────────────────────────
  // Strength Rankings
  // ─────────────────────────────────────────────────────────────────────────

  const strengthRankings = strengthAnalysis.planets
    .map((p) => ({
      planet: p.planet,
      compositeStrength: p.compositeStrength.adjusted,
    }))
    .sort((a, b) => b.compositeStrength - a.compositeStrength);

  // ─────────────────────────────────────────────────────────────────────────
  // Yoga Impact
  // ─────────────────────────────────────────────────────────────────────────

  const beneficYogas = activeYogas.filter(
    (y) => y.category.includes("Raj") || y.category.includes("Panch") || y.category.includes("Dhan")
  );
  const maleficYogas = activeYogas.filter((y) => y.category.includes("Inauspicious") || y.category.includes("Kemdrum"));
  const netYogaScore = beneficYogas.length * 10 - maleficYogas.length * 5;

  // ─────────────────────────────────────────────────────────────────────────
  // Dosha Impact
  // ─────────────────────────────────────────────────────────────────────────

  const severeDoshas = activeDoshas.filter((d) => d.severity === "high");
  const effectiveDoshaCount = activeDoshas.filter((d) => d.isPresent).length;
  const overallAffliction =
    severeDoshas.length === 0
      ? "Minimal"
      : severeDoshas.length === 1
        ? "Moderate"
        : severeDoshas.length === 2
          ? "Significant"
          : "Severe";

  // ─────────────────────────────────────────────────────────────────────────
  // Ashtakavarga Overview
  // ─────────────────────────────────────────────────────────────────────────

  const strongHouses = ashtakavarga.strongHouses;
  const weakHouses = ashtakavarga.weakHouses;

  // ─────────────────────────────────────────────────────────────────────────
  // Top Strengths & Challenges
  // ─────────────────────────────────────────────────────────────────────────

  const domainScores = [
    { name: "Career", score: lifeDomainScores.career.score },
    { name: "Wealth", score: lifeDomainScores.wealth.score },
    { name: "Relationships", score: lifeDomainScores.relationships.score },
    { name: "Health", score: lifeDomainScores.health.score },
    { name: "Spirituality", score: lifeDomainScores.spirituality.score },
    { name: "Education", score: lifeDomainScores.education.score },
  ];

  const topStrengths = domainScores
    .filter((d) => d.score >= 65)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((d) => `${d.name} (${Math.round(d.score)}/100)`);

  if (strengthRankings[0]) topStrengths.push(`${strengthRankings[0].planet} is strongest planet`);
  if (beneficYogas.length > 0) topStrengths.push(`${beneficYogas.length} beneficial yogas present`);

  const topChallenges = domainScores
    .filter((d) => d.score < 45)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5)
    .map((d) => `${d.name} (${Math.round(d.score)}/100)`);

  if (severeDoshas.length > 0) topChallenges.push(`${severeDoshas.length} severe dosha(s) present`);
  if (weakHouses.length > 0) topChallenges.push(`Weak houses: ${weakHouses.join(", ")}`);

  // ─────────────────────────────────────────────────────────────────────────
  // Overall Chart Rating
  // ─────────────────────────────────────────────────────────────────────────

  const domainAverage =
    (lifeDomainScores.career.score +
      lifeDomainScores.wealth.score +
      lifeDomainScores.relationships.score +
      lifeDomainScores.health.score +
      lifeDomainScores.spirituality.score +
      lifeDomainScores.education.score) /
    6;

  const overallChartRating =
    domainAverage * 0.4 + // Domain average (40%)
    normalizeScore(ashtakavarga.totalSAV, 0, 337) * 0.25 + // Total SAV (25%)
    normalizeScore(netYogaScore + 50, 0, 100) * 0.2 + // Yoga net (20%)
    normalizeScore(100 - severeDoshas.length * 15, 0, 100) * 0.15; // Dosha impact (15%)

  const overallLabel =
    overallChartRating >= 85
      ? ("exceptional" as const)
      : overallChartRating >= 70
        ? ("strong" as const)
        : overallChartRating >= 55
          ? ("above_average" as const)
          : overallChartRating >= 45
            ? ("average" as const)
            : overallChartRating >= 30
              ? ("below_average" as const)
              : overallChartRating >= 15
                ? ("weak" as const)
                : ("challenged" as const);

  // ─────────────────────────────────────────────────────────────────────────
  // Executive Summary
  // ─────────────────────────────────────────────────────────────────────────

  const summary =
    `This chart shows ${overallLabel === "exceptional" || overallLabel === "strong" ? "strong" : "developing"} potential across life domains, ` +
    `with ${chartSignature.dominantElement.element} element dominance and ${chartSignature.chartPattern.type} pattern. ` +
    `${strengthRankings[0].planet} is the chart's strongest influence, ` +
    `while ${timingSynthesis.periodLabel.toLowerCase()} timing supports the current period. ` +
    `${beneficYogas.length > 0 ? `${beneficYogas.length} beneficial yogas amplify favorable outcomes.` : "Focus on dosha remediation to unlock full potential."}`;

  return {
    chartSignature,
    lifeDomainScores,
    timingSynthesis,
    strengthRankings,
    yogaImpact: {
      totalYogas: activeYogas.length,
      beneficYogas: beneficYogas.length,
      maleficYogas: maleficYogas.length,
      netYogaScore,
    },
    doshaImpact: {
      totalDoshas: activeDoshas.length,
      effectiveDoshas: effectiveDoshaCount,
      overallAffliction,
    },
    ashtakavargaOverview: {
      totalSAV: ashtakavarga.totalSAV,
      strongHouses,
      weakHouses,
    },
    topStrengths: topStrengths.slice(0, 5),
    topChallenges: topChallenges.slice(0, 5),
    overallChartRating: Math.max(0, Math.min(100, overallChartRating)),
    overallLabel,
    executiveSummary: summary,
  };
}
