/**
 * Varga Interpretation Engine - D9 Navamsa & D10 Dasamsa Analysis
 * GrahAI Vedic Astrology Platform
 *
 * BPHS Chapter 6 & 19: Divisional Charts (Vargas) Analysis
 * Comprehensive interpretation of Navamsa (D9) and Dasamsa (D10) charts
 * for dharma path, marriage prospects, and career indicators
 */

import type {
  NatalChart,
  PlanetData,
  PlanetName,
  DivisionalChart,
  DivisionalChartType,
  SignInfo,
} from "./types";

import {
  SIGNS,
  KENDRA_HOUSES,
  TRIKONA_HOUSES,
  DUSTHANA_HOUSES,
  EXALTATION,
  DEBILITATION,
  OWN_SIGNS,
  getHouseNumber,
  getHouseLord,
} from "./constants";

import {
  generateDivisionalChart,
  isVargottama,
  getVargottamaPlanets,
} from "./divisional-charts";

/**
 * Pushkara Navamsa ranges - auspicious Navamsa divisions (3°20' segments)
 * BPHS 19.7: Planets in Pushkara Navamsas gain significant strength
 * Each sign's Pushkara Navamsa is defined by degree range within that sign
 */
const PUSHKARA_NAVAMSA_RANGES: Record<string, { min: number; max: number; navamsaSign: string }> = {
  Aries: { min: 20, max: 23.333, navamsaSign: "Sagittarius" },
  Taurus: { min: 6.667, max: 10, navamsaSign: "Cancer" },
  Gemini: { min: 16.667, max: 20, navamsaSign: "Aquarius" },
  Cancer: { min: 0, max: 3.333, navamsaSign: "Cancer" },
  Leo: { min: 13.333, max: 16.667, navamsaSign: "Sagittarius" },
  Virgo: { min: 23.333, max: 26.667, navamsaSign: "Cancer" },
  Libra: { min: 10, max: 13.333, navamsaSign: "Aquarius" },
  Scorpio: { min: 20, max: 23.333, navamsaSign: "Cancer" },
  Sagittarius: { min: 3.333, max: 6.667, navamsaSign: "Sagittarius" },
  Capricorn: { min: 13.333, max: 16.667, navamsaSign: "Virgo" },
  Aquarius: { min: 23.333, max: 26.667, navamsaSign: "Sagittarius" },
  Pisces: { min: 6.667, max: 10, navamsaSign: "Pisces" },
};

/**
 * Planet dignity types for analysis
 */
type DignityType = "exalted" | "own-sign" | "debilitated" | "neutral";

/**
 * Navamsa Analysis Result Interface
 * BPHS Chapter 19: Navamsa represents the inner nature and spouse characteristics
 */
interface NavamsaAnalysis {
  navamsaLagna: {
    sign: string;
    lord: PlanetName;
    interpretation: string;
  };
  planetDignityShifts: Array<{
    planet: PlanetName;
    d1Sign: string;
    d1Dignity: string;
    d9Sign: string;
    d9Dignity: string;
    shift: "improved" | "maintained" | "deteriorated";
    interpretation: string;
  }>;
  vargottamaPlanets: Array<{
    planet: PlanetName;
    sign: string;
    significance: string;
  }>;
  pushkaraPlanets: Array<{
    planet: PlanetName;
    interpretation: string;
  }>;
  spouseIndicators: {
    seventhSign: string;
    seventhLord: PlanetName;
    seventhLordPlacement: string;
    planetsInSeventh: PlanetName[];
    spouseNature: string;
    marriageProspects: string;
  };
  karakamsha: {
    planet: PlanetName;
    sign: string;
    interpretation: string;
  };
  overallDharmaStrength: "strong" | "moderate" | "weak";
  summary: string;
}

/**
 * Dasamsa Analysis Result Interface
 * BPHS Chapter 6: Dasamsa represents profession, status, and karma
 */
interface DasamsaAnalysis {
  dasamsaLagna: {
    sign: string;
    lord: PlanetName;
    interpretation: string;
  };
  tenthLordPlacement: {
    planet: PlanetName;
    house: number;
    sign: string;
    interpretation: string;
  };
  strongestCareerPlanet: {
    planet: PlanetName;
    strength: string;
    careerType: string;
  };
  planetsInKendra: Array<{
    planet: PlanetName;
    house: number;
    influence: string;
  }>;
  d10Yogas: Array<{
    name: string;
    planets: PlanetName[];
    effect: string;
  }>;
  careerIndicators: string[];
  primaryCareerDirection: string;
  overallCareerStrength: "strong" | "moderate" | "weak";
  summary: string;
}

/**
 * Combined Varga Interpretation
 */
interface VargaInterpretation {
  navamsa: NavamsaAnalysis;
  dasamsa: DasamsaAnalysis;
  combinedInsights: string[];
}

/**
 * Helper: Get planet dignity in a given sign
 * BPHS 2.5-12: Exaltation, Own Sign, Debilitation classification
 */
function getPlanetDignity(planet: PlanetName, signIndex: number): DignityType {
  if (EXALTATION[planet]?.sign === signIndex) return "exalted";
  if (DEBILITATION[planet]?.sign === signIndex) return "debilitated";
  if (OWN_SIGNS[planet]?.includes(signIndex)) return "own-sign";
  return "neutral";
}

/**
 * Helper: Get spiritual meaning of planet in sign
 */
function getSignalPlanetInterpretation(planet: PlanetName, dignity: DignityType): string {
  const dignityText: Record<DignityType, string> = {
    exalted: "highly elevated and powerful",
    "own-sign": "comfortable and efficient",
    debilitated: "weakened and challenged",
    neutral: "balanced",
  };
  return `${planet} is ${dignityText[dignity]} in this sign`;
}

/**
 * Helper: Check if planet is in Pushkara Navamsa
 * BPHS 19.7: Pushkara Navamsas confer exceptional strength
 */
function isPlanetInPushkara(planet: { name: PlanetName | string; longitude: number; sign: SignInfo; degree: number; house: number }): boolean {
  const signName = planet.sign?.name;
  if (!signName || !PUSHKARA_NAVAMSA_RANGES[signName]) return false;

  const range = PUSHKARA_NAVAMSA_RANGES[signName];
  const degree = planet.degree % 30; // Degree within sign

  return degree >= range.min && degree <= range.max;
}

/**
 * Helper: Calculate planet strength based on house position
 * Kendra (1,4,7,10) = strongest, Trikona (5,9) = good, Dusthana (6,8,12) = weak
 */
function getPlanetStrengthByHouse(house: number): "strong" | "moderate" | "weak" {
  if (KENDRA_HOUSES.includes(house)) return "strong";
  if (TRIKONA_HOUSES.includes(house)) return "moderate";
  return "weak";
}

/**
 * Helper: Get career type based on strongest planet
 * Traditional Vedic associations for career indicators
 */
function getCareerTypeForPlanet(planet: PlanetName): string {
  const careerMap: Record<PlanetName, string> = {
    Sun: "Government, Authority, Administration, Leadership, Public Service",
    Moon: "Public Relations, Nurturing, Real Estate, Finance, Hospitality",
    Mars: "Military, Surgery, Engineering, Martial Arts, Police, Firefighting",
    Mercury: "Communication, Business, Trading, Accounting, Teaching, Technology",
    Jupiter: "Teaching, Law, Advisory, Religion, Philosophy, Expansion, Finance",
    Venus: "Arts, Music, Entertainment, Luxury, Fashion, Beauty, Hospitality",
    Saturn: "Service, Labor, Construction, Agriculture, Discipline, Management",
    Rahu: "Unconventional, Technology, Foreign, Innovation, Speculation",
    Ketu: "Spirituality, Mysticism, Research, Occult, Healing Arts",
  };
  return careerMap[planet];
}

/**
 * Helper: Identify Atmakaraka (soul significator)
 * The planet with highest degrees in any sign represents soul's deepest nature
 * BPHS Chapter 19: Atmakaraka's Navamsa placement = Karakamsha (soul's sign)
 */
function findAtmakaraka(planets: Array<{ name: PlanetName; degree: number }>): PlanetName {
  let maxDegree = -1;
  let atmakara: PlanetName = "Sun";

  for (const planet of planets) {
    if (planet.degree > maxDegree) {
      maxDegree = planet.degree;
      atmakara = planet.name;
    }
  }

  return atmakara;
}

/**
 * Helper: Get interpretation for Atmakaraka placement
 */
function getAtmakarakaInterpretation(planet: PlanetName, sign: string): string {
  const atmaInterpretations: Record<PlanetName, Record<string, string>> = {
    Sun: {
      default: "Soul seeks self-expression, leadership, and recognition in dharma",
    },
    Moon: {
      default: "Soul seeks emotional fulfillment, family bonds, and inner peace",
    },
    Mars: {
      default: "Soul seeks courage, action, achievement, and conquest of challenges",
    },
    Mercury: {
      default: "Soul seeks knowledge, communication, adaptability, and intellectual growth",
    },
    Jupiter: {
      default: "Soul seeks wisdom, expansion, spiritual growth, and dharmic duty",
    },
    Venus: {
      default: "Soul seeks harmony, beauty, love, and refined pleasures",
    },
    Saturn: {
      default: "Soul seeks discipline, duty, perseverance, and spiritual maturity through hardship",
    },
    Rahu: {
      default: "Soul seeks transformation, unconventional paths, and spiritual liberation",
    },
    Ketu: {
      default: "Soul seeks detachment, spiritual wisdom, and past-life resolution",
    },
  };

  return atmaInterpretations[planet]?.default || "Soul seeks spiritual evolution and dharma fulfillment";
}

/**
 * Analyze D9 (Navamsa) Chart
 * BPHS Chapter 19: Navamsa represents the 9th division of signs
 * Reveals spouse nature, inner dharma, and hidden strengths
 */
export function analyzeNavamsa(chart: NatalChart): NavamsaAnalysis {
  const d9Chart = generateDivisionalChart(chart, "D9");

  // 1. Navamsa Lagna Analysis
  const navamsaLagnaSign = d9Chart.ascendantSign;
  const navamsaLagnaLord = navamsaLagnaSign.lord;
  const navamsaLagnaInterpretation = `Navamsa Lagna in ${navamsaLagnaSign.name} (lord: ${navamsaLagnaLord}) reveals dharmic calling and inner nature. This ascendant shows the soul's refined pursuits and spiritual inclination.`;

  // 2. Analyze Planet Dignity Shifts (D1 → D9)
  const dignityShifts = chart.planets
    .filter((p) => p.name !== "Rahu" && p.name !== "Ketu") // Exclude shadow planets in dignity analysis
    .map((d1Planet) => {
      const d9Planet = d9Chart.planets.find((p) => p.name === d1Planet.name);
      if (!d9Planet) return null;

      const d1Dignity = getPlanetDignity(d1Planet.name, d1Planet.sign.index);
      const d9Dignity = getPlanetDignity(d9Planet.name, d9Planet.sign.index);

      // Determine shift: improved = weakness to strength, maintained = same, deteriorated = strength to weakness
      let shift: "improved" | "maintained" | "deteriorated" = "maintained";
      let interpretation = "";

      if (d1Dignity === d9Dignity) {
        shift = "maintained";
        interpretation = `${d1Planet.name}'s ${d1Dignity} status is reinforced in Navamsa, confirming its baseline nature.`;
      } else if (
        (d1Dignity === "debilitated" && d9Dignity !== "debilitated") ||
        (d1Dignity === "neutral" && d9Dignity === "exalted") ||
        (d1Dignity === "neutral" && d9Dignity === "own-sign")
      ) {
        shift = "improved";
        interpretation = `${d1Planet.name} shows hidden strength in Navamsa. Despite outer weakness (${d1Dignity}), inner nature is ${d9Dignity}—indicating latent potential and spiritual growth.`;
      } else if (
        (d1Dignity === "exalted" && d9Dignity === "debilitated") ||
        (d1Dignity === "own-sign" && d9Dignity === "debilitated")
      ) {
        shift = "deteriorated";
        interpretation = `${d1Planet.name} reveals inner weakness in Navamsa. Outer strength (${d1Dignity}) masks actual vulnerability (${d9Dignity})—indicates need for conscious development.`;
      }

      return {
        planet: d1Planet.name,
        d1Sign: d1Planet.sign.name,
        d1Dignity,
        d9Sign: d9Planet.sign.name,
        d9Dignity,
        shift,
        interpretation,
      };
    })
    .filter((x) => x !== null) as NavamsaAnalysis["planetDignityShifts"];

  // 3. Vargottama Planets (same sign in D1 and D9)
  const vargottamaList = getVargottamaPlanets(chart);
  const vargottamaPlanets = vargottamaList.map((planetName) => {
    const d1Planet = chart.planets.find((p) => p.name === planetName);
    const d9Planet = d9Chart.planets.find((p) => p.name === planetName);

    return {
      planet: planetName,
      sign: d1Planet?.sign.name || "",
      significance: `${planetName} in Vargottama (D1 & D9) is exceptionally strong. This planet's qualities are authentic and well-integrated—strength in both body and soul.`,
    };
  });

  // 4. Pushkara Navamsa Planets
  const pushkaraPlanets = d9Chart.planets
    .filter((p) => isPlanetInPushkara(p))
    .map((planet) => ({
      planet: planet.name as PlanetName,
      interpretation: `${planet.name} in Pushkara Navamsa (${PUSHKARA_NAVAMSA_RANGES[planet.sign.name]?.navamsaSign || "auspicious"} division) gains exceptional benefic strength and protective grace.`,
    }));

  // 5. Spouse Indicators (7th House Analysis in D9)
  const seventhHouseNumber = 7;
  const seventhHousePlanets = d9Chart.planets.filter(
    (p) => p.house === seventhHouseNumber
  );
  const seventhLord = getHouseLord(seventhHouseNumber, d9Chart.ascendant);
  const seventhLordPlanet = d9Chart.planets.find((p) => p.name === seventhLord);

  const spouseIndicators = {
    seventhSign: d9Chart.ascendantSign ? SIGNS[(d9Chart.ascendantSign.index + 6) % 12]?.name ?? "Unknown" : "Unknown",
    seventhLord: seventhLord,
    seventhLordPlacement: seventhLordPlanet
      ? `${seventhLord} in ${seventhLordPlanet.sign.name}, House ${seventhLordPlanet.house}`
      : "Unplaced",
    planetsInSeventh: seventhHousePlanets.map((p) => p.name as PlanetName),
    spouseNature: generateSpouseDescription(d9Chart, seventhHouseNumber, seventhLord),
    marriageProspects: generateMarriageProspects(d9Chart, seventhHouseNumber, vargottamaList),
  };

  // 6. Karakamsha (Atmakaraka in Navamsa)
  const atmakara = findAtmakaraka(
    chart.planets.map((p) => ({
      name: p.name,
      degree: p.longitude,
    }))
  );
  const atmakarakaInD9 = d9Chart.planets.find((p) => p.name === atmakara);
  const karakamsha = {
    planet: atmakara,
    sign: atmakarakaInD9?.sign.name || "",
    interpretation: getAtmakarakaInterpretation(atmakara, atmakarakaInD9?.sign.name || "Unknown"),
  };

  // 7. Overall Dharma Strength
  const vargottamaCount = vargottamaList.length;
  const pushkaraCount = pushkaraPlanets.length;
  const improvedCount = dignityShifts.filter((d) => d.shift === "improved").length;
  const deterioratedCount = dignityShifts.filter((d) => d.shift === "deteriorated").length;

  let overallDharmaStrength: "strong" | "moderate" | "weak" = "moderate";
  if (vargottamaCount >= 3 && improvedCount >= 2 && deterioratedCount === 0) {
    overallDharmaStrength = "strong";
  } else if (deterioratedCount >= 2 && improvedCount === 0) {
    overallDharmaStrength = "weak";
  }

  const summary = `Navamsa reveals ${overallDharmaStrength === "strong" ? "a strong" : overallDharmaStrength === "weak" ? "a challenged" : "a balanced"} dharmic foundation. ${vargottamaCount > 0 ? `${vargottamaCount} Vargottama planets confirm authentic strength. ` : ""}Spouse indicated by ${spouseIndicators.seventhSign} 7th sign with ${seventhHousePlanets.length === 0 ? "benefic unafflicted lord" : "occupied house"}. Karakamsha in ${karakamsha.sign} points to soul's deepest aspirations.`;

  return {
    navamsaLagna: {
      sign: navamsaLagnaSign.name,
      lord: navamsaLagnaLord,
      interpretation: navamsaLagnaInterpretation,
    },
    planetDignityShifts: dignityShifts,
    vargottamaPlanets,
    pushkaraPlanets,
    spouseIndicators,
    karakamsha,
    overallDharmaStrength,
    summary,
  };
}

/**
 * Helper: Generate spouse nature description from D9 7th house
 */
function generateSpouseDescription(
  d9Chart: DivisionalChart,
  seventhHouse: number,
  seventhLord: PlanetName
): string {
  const seventhSignName = SIGNS[(d9Chart.ascendant + 6) % 12]?.name || "Unknown";
  const seventhSignElement = SIGNS[(d9Chart.ascendant + 6) % 12]?.element || "Unknown";

  const spouseTraits: Record<string, string> = {
    Fire: "passionate, ambitious, independent, energetic",
    Earth: "practical, grounded, responsible, loyal",
    Air: "intellectual, communicative, social, adaptable",
    Water: "emotional, intuitive, nurturing, sensitive",
  };

  const lordTraits: Record<PlanetName, string> = {
    Sun: "dignified, authoritative, proud",
    Moon: "emotional, caring, domestic",
    Mars: "energetic, courageous, direct",
    Mercury: "intelligent, witty, communicative",
    Jupiter: "wise, generous, spiritual",
    Venus: "beautiful, artistic, affectionate",
    Saturn: "reserved, practical, steady",
    Rahu: "unconventional, mysterious, ambitious",
    Ketu: "spiritual, detached, mysterious",
  };

  const elementTraits = spouseTraits[seventhSignElement] || "balanced";
  const lordTraits_str = lordTraits[seventhLord] || "unique";

  return `Spouse has ${elementTraits} qualities (${seventhSignElement} sign). ${seventhLord}'s influence makes them ${lordTraits_str}. Marriage brings both joy and spiritual growth.`;
}

/**
 * Helper: Generate marriage prospects assessment
 */
function generateMarriageProspects(
  d9Chart: DivisionalChart,
  seventhHouse: number,
  vargottamaList: PlanetName[]
): string {
  const seventhPlanets = d9Chart.planets.filter((p) => p.house === seventhHouse);
  const hasVargottamaIn7th = seventhPlanets.some((p) => vargottamaList.includes(p.name as PlanetName));

  let prospect = "Stable marriage prospects with balanced growth.";

  if (seventhPlanets.length === 0) {
    prospect = "Clean 7th house indicates harmonious marriage without complications.";
  } else if (hasVargottamaIn7th) {
    prospect = "Vargottama planet in 7th promises deep soul connection and karmic partnership.";
  } else if (seventhPlanets.some((p) => KENDRA_HOUSES.includes(p.house))) {
    prospect = "Strong 7th house support indicates successful marriage and family life.";
  }

  return prospect;
}

/**
 * Analyze D10 (Dasamsa) Chart
 * BPHS Chapter 6: Dasamsa represents the 10th division, career and professional life
 * Career direction, professional reputation, and achievement potential
 */
export function analyzeDasamsa(chart: NatalChart): DasamsaAnalysis {
  const d10Chart = generateDivisionalChart(chart, "D10");

  // 1. Dasamsa Lagna Analysis
  const dasamsaLagnaSign = d10Chart.ascendantSign;
  const dasamsaLagnaLord = dasamsaLagnaSign.lord;
  const dasamsaLagnaInterpretation = `Dasamsa Lagna in ${dasamsaLagnaSign.name} (lord: ${dasamsaLagnaLord}) determines career calling and professional nature. This sign reflects how you manifest work and public achievements.`;

  // 2. 10th House Lord Placement
  const tenthHouse = 10;
  const tenthLord = getHouseLord(tenthHouse, d10Chart.ascendant);
  const tenthLordPlanet = d10Chart.planets.find((p) => p.name === tenthLord);

  const tenthLordPlacement = {
    planet: tenthLord,
    house: tenthLordPlanet?.house || 0,
    sign: tenthLordPlanet?.sign.name || "Unknown",
    interpretation: tenthLordPlanet
      ? `10th lord ${tenthLord} in ${tenthLordPlanet.sign.name}, House ${tenthLordPlanet.house}: ${generateTenthLordInterpretation(tenthLord, tenthLordPlanet.house, tenthLordPlanet.sign.name)}`
      : "10th lord placement not clearly defined",
  };

  // 3. Strongest Career Planet (most beneficial planet in D10)
  const strongestPlanet = d10Chart.planets
    .filter((p) => !["Rahu", "Ketu"].includes(p.name))
    .reduce(
      (strongest, current) => {
        const currentStrength = calculatePlanetStrengthInD10(current);
        const strongestStrength = calculatePlanetStrengthInD10(strongest);
        return currentStrength > strongestStrength ? current : strongest;
      },
      d10Chart.planets[0]
    );

  const strongestCareerPlanet = {
    planet: strongestPlanet.name as PlanetName,
    strength: getPlanetStrengthByHouse(strongestPlanet.house),
    careerType: getCareerTypeForPlanet(strongestPlanet.name as PlanetName),
  };

  // 4. Planets in Kendra Houses
  const planetsInKendra = d10Chart.planets
    .filter((p) => KENDRA_HOUSES.includes(p.house))
    .map((p) => ({
      planet: p.name as PlanetName,
      house: p.house,
      influence: `${p.name} in Kendra (House ${p.house}) provides powerful career support and professional stability.`,
    }));

  // 5. D10 Yogas (Raj Yogas: Kendra-Trikona lord connections)
  const d10Yogas = findD10Yogas(d10Chart);

  // 6. Career Indicators
  const careerIndicators = generateCareerIndicators(d10Chart, strongestCareerPlanet.planet);

  // 7. Primary Career Direction
  const primaryCareerDirection = `Career direction centered on ${strongestCareerPlanet.careerType.split(",")[0].trim()}. Professional success through leveraging ${strongestCareerPlanet.planet}'s qualities.`;

  // 8. Overall Career Strength
  let overallCareerStrength: "strong" | "moderate" | "weak" = "moderate";
  const kendraCount = planetsInKendra.length;
  const yogaCount = d10Yogas.length;

  if (kendraCount >= 3 && yogaCount >= 1 && getPlanetStrengthByHouse(strongestPlanet.house) === "strong") {
    overallCareerStrength = "strong";
  } else if (kendraCount === 0 && getPlanetStrengthByHouse(strongestPlanet.house) === "weak") {
    overallCareerStrength = "weak";
  }

  const summary = `Dasamsa indicates ${overallCareerStrength} career potential. ${strongestCareerPlanet.planet} is primary career significator. ${kendraCount > 0 ? `${kendraCount} planets in Kendras support professional endeavors. ` : ""}${yogaCount > 0 ? `${yogaCount} Raj Yoga(s) enhance status and achievement. ` : ""}Career success through ${tenthLordInterpretationShort(tenthLord, tenthLordPlanet?.house || 0)}.`;

  return {
    dasamsaLagna: {
      sign: dasamsaLagnaSign.name,
      lord: dasamsaLagnaLord,
      interpretation: dasamsaLagnaInterpretation,
    },
    tenthLordPlacement,
    strongestCareerPlanet,
    planetsInKendra,
    d10Yogas,
    careerIndicators,
    primaryCareerDirection,
    overallCareerStrength,
    summary,
  };
}

/**
 * Helper: Calculate planet strength score in D10
 */
function calculatePlanetStrengthInD10(planet: { name: PlanetName | string; longitude: number; sign: SignInfo; degree: number; house: number }): number {
  let strength = 0;

  // House strength
  if (KENDRA_HOUSES.includes(planet.house)) strength += 4;
  else if (TRIKONA_HOUSES.includes(planet.house)) strength += 2;
  else if (DUSTHANA_HOUSES.includes(planet.house)) strength -= 1;

  // Dignity strength
  const dignity = getPlanetDignity(planet.name as PlanetName, planet.sign.index);
  if (dignity === "exalted") strength += 3;
  else if (dignity === "own-sign") strength += 2;
  else if (dignity === "debilitated") strength -= 2;

  return strength;
}

/**
 * Helper: Generate 10th lord interpretation
 */
function generateTenthLordInterpretation(
  planet: PlanetName,
  house: number,
  sign: string
): string {
  if (KENDRA_HOUSES.includes(house)) {
    return `Powerful placement indicating career success and public recognition through ${planet}'s qualities.`;
  } else if (TRIKONA_HOUSES.includes(house)) {
    return `Favorable placement supporting career growth and professional achievements.`;
  } else if (DUSTHANA_HOUSES.includes(house)) {
    return `Challenged placement requiring conscious effort for career success.`;
  }
  return `Career direction influenced by ${planet} in ${sign}.`;
}

/**
 * Helper: Short 10th lord interpretation for summary
 */
function tenthLordInterpretationShort(planet: PlanetName, house: number): string {
  if (KENDRA_HOUSES.includes(house)) return `strong ${planet}`;
  if (TRIKONA_HOUSES.includes(house)) return `favorable ${planet}`;
  return `${planet} alignment`;
}

/**
 * Helper: Find D10 Yogas (Raj Yogas)
 * Raj Yoga = Kendra lord + Trikona lord connection
 */
function findD10Yogas(d10Chart: DivisionalChart): DasamsaAnalysis["d10Yogas"] {
  const yogas: DasamsaAnalysis["d10Yogas"] = [];

  // Check for Gaj Kesari Yoga (Jupiter + Moon connection)
  const jupiter = d10Chart.planets.find((p) => p.name === "Jupiter");
  const moon = d10Chart.planets.find((p) => p.name === "Moon");

  if (jupiter && moon) {
    if (KENDRA_HOUSES.includes(jupiter.house) && TRIKONA_HOUSES.includes(moon.house)) {
      yogas.push({
        name: "Gaj Kesari Yoga",
        planets: ["Jupiter", "Moon"],
        effect: "Enhanced wisdom and public recognition in career.",
      });
    }
  }

  // Check for strong Raj Yoga (10th lord in Kendra/Trikona)
  const tenthLord = getHouseLord(10, d10Chart.ascendant);
  const tenthLordPlanet = d10Chart.planets.find((p) => p.name === tenthLord);

  if (tenthLordPlanet) {
    if (KENDRA_HOUSES.includes(tenthLordPlanet.house)) {
      yogas.push({
        name: `${tenthLord} Raj Yoga`,
        planets: [tenthLord],
        effect: `Strong career success through ${tenthLord}'s yogic influence in Kendra house.`,
      });
    } else if (TRIKONA_HOUSES.includes(tenthLordPlanet.house)) {
      yogas.push({
        name: `${tenthLord} Trikona Yoga`,
        planets: [tenthLord],
        effect: `Beneficial career growth through ${tenthLord}'s placement in auspicious Trikona.`,
      });
    }
  }

  return yogas;
}

/**
 * Helper: Generate career indicators
 */
function generateCareerIndicators(d10Chart: DivisionalChart, strongestPlanet: PlanetName): string[] {
  const indicators: string[] = [];

  // Check for planets in 10th house
  const tenthPlanets = d10Chart.planets.filter((p) => p.house === 10);
  if (tenthPlanets.length > 0) {
    indicators.push(`Direct career support from ${tenthPlanets.map((p) => p.name).join(", ")} in 10th house`);
  }

  // Check Lagna strength
  const lagnaLord = d10Chart.ascendantSign.lord;
  const lagnaLordPlanet = d10Chart.planets.find((p) => p.name === lagnaLord);
  if (lagnaLordPlanet && KENDRA_HOUSES.includes(lagnaLordPlanet.house)) {
    indicators.push(`Strong Lagna lord ${lagnaLord} energizes professional image`);
  }

  // Primary planet indicator
  indicators.push(`${strongestPlanet} drives primary career focus and professional excellence`);

  // Check for benefics in career houses
  const benefics = ["Jupiter", "Venus"];
  const beneficsInCareerHouses = d10Chart.planets.filter(
    (p) => benefics.includes(p.name) && KENDRA_HOUSES.includes(p.house)
  );
  if (beneficsInCareerHouses.length > 0) {
    indicators.push(`Benefic support from ${beneficsInCareerHouses.map((p) => p.name).join(", ")}`);
  }

  return indicators.slice(0, 4); // Return max 4 indicators
}

/**
 * Comprehensive Varga Analysis - D9 & D10 Combined
 * BPHS Chapter 6 & 19: Integrated interpretation of multiple divisional charts
 */
export function analyzeVargas(chart: NatalChart): VargaInterpretation {
  const navamsaAnalysis = analyzeNavamsa(chart);
  const dasamsaAnalysis = analyzeDasamsa(chart);

  // Generate combined insights
  const combinedInsights: string[] = [];

  // Insight 1: Dharma-Karma alignment
  if (navamsaAnalysis.overallDharmaStrength === "strong" && dasamsaAnalysis.overallCareerStrength === "strong") {
    combinedInsights.push(
      "Strong dharma-karma alignment: Inner spiritual nature supports outer professional achievements. Life path and career are harmoniously integrated."
    );
  } else if (
    navamsaAnalysis.overallDharmaStrength === "weak" ||
    dasamsaAnalysis.overallCareerStrength === "weak"
  ) {
    combinedInsights.push(
      "Dharma-karma misalignment detected: Address inner spiritual development to manifest outer success. Integration work needed."
    );
  } else {
    combinedInsights.push("Dharma-karma moderately balanced: Growth potential exists through conscious alignment of values and career.");
  }

  // Insight 2: Vargottama planets bridging D1-D9-D10
  const vargottamaNames = navamsaAnalysis.vargottamaPlanets.map((v) => v.planet);
  if (vargottamaNames.length > 0) {
    combinedInsights.push(
      `${vargottamaNames.join(", ")} as Vargottama planet(s) authentic strength flows across all charts—both inner character and outer achievement aligned.`
    );
  }

  // Insight 3: Marriage-Career dynamics
  const spouseElement = (navamsaAnalysis.spouseIndicators.seventhSign ?? "Unknown").split(" ")[0];
  const careerPlanet = dasamsaAnalysis.strongestCareerPlanet?.planet ?? "Jupiter";
  combinedInsights.push(
    `Marriage and career: Spouse (${navamsaAnalysis.spouseIndicators.seventhSign} influence) complements career focus on ${careerPlanet}. Partnership supports professional growth.`
  );

  // Insight 4: Atmakaraka-Career integration
  combinedInsights.push(
    `Soul Purpose (${navamsaAnalysis.karakamsha.planet}) and Professional Focus (${careerPlanet}) can align for fulfilling life work when consciously integrated.`
  );

  return {
    navamsa: navamsaAnalysis,
    dasamsa: dasamsaAnalysis,
    combinedInsights,
  };
}

// Export types
export type { NavamsaAnalysis, DasamsaAnalysis, VargaInterpretation };
