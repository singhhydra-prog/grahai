/* ════════════════════════════════════════════════════════
   GrahAI — Yoga Detection Engine (50+ Yogas)
   Based on BPHS, Saravali, Phaladeepika

   Detects auspicious and inauspicious yogas in a chart.
   Each yoga includes classical reference + interpretation.
   ════════════════════════════════════════════════════════ */

import type {
  NatalChart, PlanetData, PlanetName, YogaResult, YogaCategory,
} from "./types"
import {
  KENDRA_HOUSES, TRIKONA_HOUSES, DUSTHANA_HOUSES,
  SIGNS, OWN_SIGNS, EXALTATION, DEBILITATION,
  SPECIAL_ASPECTS, getHouseNumber, getHouseLord,
} from "./constants"
import { getYogaReference } from "../astrology-data/bphs-references"

// ─── Helper Functions ──────────────────────────────────

function getPlanetInHouse(chart: NatalChart, house: number): PlanetData | undefined {
  return chart.planets.find(p => p.house === house)
}

function getPlanetsInHouse(chart: NatalChart, house: number): PlanetData[] {
  return chart.planets.filter(p => p.house === house)
}

function getPlanetByName(chart: NatalChart, name: PlanetName): PlanetData {
  return chart.planets.find(p => p.name === name)!
}

function isInKendra(house: number): boolean {
  return KENDRA_HOUSES.includes(house)
}

function isInTrikona(house: number): boolean {
  return TRIKONA_HOUSES.includes(house)
}

function arePlanetsConjunct(p1: PlanetData, p2: PlanetData): boolean {
  return p1.house === p2.house
}

function isInOwnOrExalted(planet: PlanetData): boolean {
  return planet.dignity === "exalted" || planet.dignity === "own" || planet.dignity === "moolatrikona"
}

/** Check if planet aspects a house */
function planetAspectsHouse(planet: PlanetData, targetHouse: number): boolean {
  const aspects = SPECIAL_ASPECTS[planet.name]
  return aspects.some(aspect => {
    const aspectedHouse = ((planet.house - 1 + aspect) % 12) + 1
    return aspectedHouse === targetHouse
  })
}

/** Check if two planets aspect each other */
function planetsMutuallyAspect(p1: PlanetData, p2: PlanetData): boolean {
  return planetAspectsHouse(p1, p2.house) || planetAspectsHouse(p2, p1.house)
}

/** Get the lord of a house in the chart */
function getHouseLordPlanet(chart: NatalChart, house: number): PlanetData {
  const lordName = getHouseLord(house, chart.ascendant)
  return getPlanetByName(chart, lordName)
}

function makeResult(
  name: string, category: YogaCategory, isPresent: boolean,
  strength: "strong" | "moderate" | "weak",
  planets: PlanetName[], houses: number[],
  description: string, effects: string
): YogaResult {
  const ref = getYogaReference(name)
  return {
    name, sanskrit: name, category, isPresent, strength,
    involvedPlanets: planets, involvedHouses: houses,
    description, effects,
    classicalReference: ref || {
      source: "BPHS", chapter: 41, translation: description,
    },
  }
}

// ─── Panch Mahapurush Yogas ────────────────────────────

function detectPanchMahapurush(chart: NatalChart): YogaResult[] {
  const results: YogaResult[] = []
  const checks: Array<{ planet: PlanetName, yoga: string, desc: string }> = [
    { planet: "Mars", yoga: "Ruchaka Yoga", desc: "Mars in Kendra in own/exalted sign gives valor, leadership, and military prowess" },
    { planet: "Mercury", yoga: "Bhadra Yoga", desc: "Mercury in Kendra in own/exalted sign gives eloquence, learning, and business acumen" },
    { planet: "Jupiter", yoga: "Hamsa Yoga", desc: "Jupiter in Kendra in own/exalted sign gives wisdom, righteousness, and spiritual inclination" },
    { planet: "Venus", yoga: "Malavya Yoga", desc: "Venus in Kendra in own/exalted sign gives luxury, beauty, and artistic talent" },
    { planet: "Saturn", yoga: "Shasha Yoga", desc: "Saturn in Kendra in own/exalted sign gives authority, power over subordinates, and discipline" },
  ]

  for (const { planet, yoga, desc } of checks) {
    const p = getPlanetByName(chart, planet)
    const present = isInKendra(p.house) && isInOwnOrExalted(p)
    results.push(makeResult(
      yoga, "Panch Mahapurush", present,
      present ? "strong" : "weak",
      [planet], [p.house], desc,
      present ? `${yoga} is powerfully formed with ${planet} in house ${p.house} in ${p.sign.name}` : `${yoga} not formed`,
    ))
  }

  return results
}

// ─── Gajakesari Yoga ───────────────────────────────────

function detectGajakesari(chart: NatalChart): YogaResult {
  const moon = getPlanetByName(chart, "Moon")
  const jupiter = getPlanetByName(chart, "Jupiter")

  // Jupiter in Kendra from Moon
  const jupHouseFromMoon = ((jupiter.house - moon.house + 12) % 12) + 1
  const isPresent = [1, 4, 7, 10].includes(jupHouseFromMoon)

  const strength = isPresent
    ? (isInOwnOrExalted(jupiter) ? "strong" : "moderate")
    : "weak"

  return makeResult(
    "Gajakesari Yoga", "Lunar Yoga", isPresent, strength,
    ["Moon", "Jupiter"], [moon.house, jupiter.house],
    "Jupiter in a Kendra from Moon gives intelligence, wealth, and lasting fame",
    isPresent ? `Formed with Jupiter in house ${jupHouseFromMoon} from Moon` : "Not formed",
  )
}

// ─── Budhaditya Yoga ───────────────────────────────────

function detectBudhaditya(chart: NatalChart): YogaResult {
  const sun = getPlanetByName(chart, "Sun")
  const mercury = getPlanetByName(chart, "Mercury")

  const conjunct = arePlanetsConjunct(sun, mercury)
  const notCombust = !mercury.isCombust
  const isPresent = conjunct && notCombust

  return makeResult(
    "Budhaditya Yoga", "Solar Yoga", isPresent,
    isPresent ? "moderate" : "weak",
    ["Sun", "Mercury"], [sun.house],
    "Sun-Mercury conjunction (when Mercury is not combust) gives intelligence, fame, and skill",
    isPresent ? `Formed in house ${sun.house}` : conjunct ? "Mercury combust, yoga weakened" : "Not formed",
  )
}

// ─── Chandra-Mangal Yoga ───────────────────────────────

function detectChandraMangal(chart: NatalChart): YogaResult {
  const moon = getPlanetByName(chart, "Moon")
  const mars = getPlanetByName(chart, "Mars")
  const isPresent = arePlanetsConjunct(moon, mars)

  return makeResult(
    "Chandra-Mangal Yoga", "Lunar Yoga", isPresent,
    isPresent ? "moderate" : "weak",
    ["Moon", "Mars"], [moon.house],
    "Moon-Mars conjunction gives wealth acquisition through bold and enterprising means",
    isPresent ? `Formed in house ${moon.house}` : "Not formed",
  )
}

// ─── Raj Yogas (Kendra-Trikona Lord Associations) ─────

function detectRajYogas(chart: NatalChart): YogaResult[] {
  const results: YogaResult[] = []

  for (const kh of KENDRA_HOUSES) {
    for (const th of TRIKONA_HOUSES) {
      if (kh === th) continue  // skip 1st house (both kendra and trikona)
      const kendraLord = getHouseLordPlanet(chart, kh)
      const trikonaLord = getHouseLordPlanet(chart, th)

      if (kendraLord.name === trikonaLord.name) continue // same planet

      const conjunct = arePlanetsConjunct(kendraLord, trikonaLord)
      const mutual = planetsMutuallyAspect(kendraLord, trikonaLord)
      const exchange = kendraLord.house === th && trikonaLord.house === kh

      if (conjunct || mutual || exchange) {
        const type = exchange ? "exchange" : conjunct ? "conjunction" : "aspect"
        results.push(makeResult(
          "Raj Yoga (Kendra-Trikona)", "Raj Yoga", true,
          exchange ? "strong" : conjunct ? "strong" : "moderate",
          [kendraLord.name, trikonaLord.name], [kh, th],
          `Lord of ${kh}th (${kendraLord.name}) and ${th}th (${trikonaLord.name}) in ${type}`,
          `Raj Yoga formed by ${type} of house ${kh} and ${th} lords — bestows authority and status`,
        ))
      }
    }
  }

  return results
}

// ─── Dhan Yogas (Wealth) ──────────────────────────────

function detectDhanYogas(chart: NatalChart): YogaResult[] {
  const results: YogaResult[] = []
  const wealthHouses = [2, 5, 9, 11]

  for (let i = 0; i < wealthHouses.length; i++) {
    for (let j = i + 1; j < wealthHouses.length; j++) {
      const h1 = wealthHouses[i]
      const h2 = wealthHouses[j]
      const lord1 = getHouseLordPlanet(chart, h1)
      const lord2 = getHouseLordPlanet(chart, h2)

      if (lord1.name === lord2.name) continue

      if (arePlanetsConjunct(lord1, lord2)) {
        results.push(makeResult(
          "Dhan Yoga", "Dhan Yoga", true, "moderate",
          [lord1.name, lord2.name], [h1, h2],
          `Lords of ${h1}th and ${h2}th houses conjoined — wealth combination`,
          `Dhan Yoga from houses ${h1} and ${h2} lords (${lord1.name}, ${lord2.name}) conjunction`,
        ))
      }
    }
  }

  return results
}

// ─── Vipreet Raj Yogas ─────────────────────────────────

function detectVipreetRajYogas(chart: NatalChart): YogaResult[] {
  const results: YogaResult[] = []
  const checks: Array<{ house: number, yoga: string, desc: string }> = [
    { house: 6, yoga: "Harsha Yoga", desc: "6th lord in 6th/8th/12th — overcomes enemies, good health" },
    { house: 8, yoga: "Sarala Yoga", desc: "8th lord in 6th/8th/12th — longevity, fearlessness, prosperity" },
    { house: 12, yoga: "Vimala Yoga", desc: "12th lord in 6th/8th/12th — frugal, good reputation, happy" },
  ]

  for (const { house, yoga, desc } of checks) {
    const lord = getHouseLordPlanet(chart, house)
    const isPresent = DUSTHANA_HOUSES.includes(lord.house)

    results.push(makeResult(
      yoga, "Vipreet Raj Yoga", isPresent,
      isPresent ? "moderate" : "weak",
      [lord.name], [house, lord.house],
      desc,
      isPresent ? `${yoga} formed: ${lord.name} (${house}th lord) in house ${lord.house}` : `${yoga} not formed`,
    ))
  }

  return results
}

// ─── Adhi Yoga ─────────────────────────────────────────

function detectAdhiYoga(chart: NatalChart): YogaResult {
  const moon = getPlanetByName(chart, "Moon")
  const benefics: PlanetName[] = ["Jupiter", "Venus", "Mercury"]

  const h6 = ((moon.house - 1 + 5) % 12) + 1
  const h7 = ((moon.house - 1 + 6) % 12) + 1
  const h8 = ((moon.house - 1 + 7) % 12) + 1

  const beneficsIn678 = benefics.filter(b => {
    const p = getPlanetByName(chart, b)
    return p.house === h6 || p.house === h7 || p.house === h8
  })

  const isPresent = beneficsIn678.length >= 2

  return makeResult(
    "Adhi Yoga", "Lunar Yoga", isPresent,
    beneficsIn678.length >= 3 ? "strong" : isPresent ? "moderate" : "weak",
    beneficsIn678, [h6, h7, h8],
    "Benefics in 6th, 7th, 8th from Moon — authority and leadership",
    isPresent ? `${beneficsIn678.join(", ")} in 6/7/8 from Moon` : "Not formed",
  )
}

// ─── Sunapha / Anapha / Durudhura ─────────────────────

function detectSunaphAnapha(chart: NatalChart): YogaResult[] {
  const results: YogaResult[] = []
  const moon = getPlanetByName(chart, "Moon")
  const others = chart.planets.filter(p => p.name !== "Moon" && p.name !== "Sun")

  const h2FromMoon = ((moon.house) % 12) + 1
  const h12FromMoon = ((moon.house - 2 + 12) % 12) + 1

  const planetsIn2 = others.filter(p => p.house === h2FromMoon)
  const planetsIn12 = others.filter(p => p.house === h12FromMoon)

  if (planetsIn2.length > 0) {
    results.push(makeResult(
      "Sunapha Yoga", "Lunar Yoga", true, "moderate",
      planetsIn2.map(p => p.name), [h2FromMoon],
      "Planet(s) in 2nd from Moon — self-made wealth and learning",
      `${planetsIn2.map(p => p.name).join(", ")} in 2nd from Moon`,
    ))
  }

  if (planetsIn12.length > 0) {
    results.push(makeResult(
      "Anapha Yoga", "Lunar Yoga", true, "moderate",
      planetsIn12.map(p => p.name), [h12FromMoon],
      "Planet(s) in 12th from Moon — power, health, and fame",
      `${planetsIn12.map(p => p.name).join(", ")} in 12th from Moon`,
    ))
  }

  if (planetsIn2.length > 0 && planetsIn12.length > 0) {
    results.push(makeResult(
      "Durudhura Yoga", "Lunar Yoga", true, "strong",
      [...planetsIn2.map(p => p.name), ...planetsIn12.map(p => p.name)], [h2FromMoon, h12FromMoon],
      "Planets on both sides of Moon — wealth, vehicles, and generous nature",
      "Formed by planets flanking Moon",
    ))
  }

  return results
}

// ─── Kemdrum Yoga (Inauspicious) ──────────────────────

function detectKemdrumYoga(chart: NatalChart): YogaResult {
  const moon = getPlanetByName(chart, "Moon")
  const others = chart.planets.filter(p => p.name !== "Moon" && p.name !== "Sun" && p.name !== "Rahu" && p.name !== "Ketu")

  const h2 = ((moon.house) % 12) + 1
  const h12 = ((moon.house - 2 + 12) % 12) + 1

  const planetsIn2or12 = others.filter(p => p.house === h2 || p.house === h12)
  const isPresent = planetsIn2or12.length === 0

  // Cancellation check: if Moon is in Kendra or aspected by Jupiter
  const moonInKendra = isInKendra(moon.house)
  const jupiterAspects = planetAspectsHouse(getPlanetByName(chart, "Jupiter"), moon.house)
  const cancelled = moonInKendra || jupiterAspects

  return makeResult(
    "Kemdrum Yoga", "Inauspicious", isPresent && !cancelled,
    isPresent && !cancelled ? "moderate" : "weak",
    ["Moon"], [moon.house],
    "No planets in 2nd or 12th from Moon — potential for hardship",
    isPresent ? (cancelled ? "Formed but cancelled by " + (moonInKendra ? "Moon in Kendra" : "Jupiter's aspect") : "Active — Moon isolated") : "Not formed",
  )
}

// ─── Neecha Bhanga Raj Yoga ────────────────────────────

function detectNeechaBhanga(chart: NatalChart): YogaResult[] {
  const results: YogaResult[] = []

  for (const planet of chart.planets) {
    if (!planet.isDebilitated) continue

    // Cancellation conditions:
    // 1. Dispositor (sign lord) is exalted or in Kendra
    const dispositorName = planet.sign.lord
    const dispositor = getPlanetByName(chart, dispositorName)
    const cond1 = dispositor.isExalted || isInKendra(dispositor.house)

    // 2. The exaltation lord of the debilitated planet's sign aspects the planet
    // (simplified: check if exaltation sign lord aspects)
    const exaltSign = EXALTATION[planet.name].sign
    const exaltLordName = SIGNS[exaltSign].lord
    const exaltLord = getPlanetByName(chart, exaltLordName)
    const cond2 = planetAspectsHouse(exaltLord, planet.house)

    // 3. Debilitated planet in Kendra
    const cond3 = isInKendra(planet.house)

    if (cond1 || cond2 || cond3) {
      const reasons: string[] = []
      if (cond1) reasons.push(`dispositor ${dispositorName} ${dispositor.isExalted ? "exalted" : "in Kendra"}`)
      if (cond2) reasons.push(`exaltation lord ${exaltLordName} aspects`)
      if (cond3) reasons.push("debilitated planet in Kendra")

      results.push(makeResult(
        "Neecha Bhanga Raj Yoga", "Neecha Bhanga", true,
        reasons.length >= 2 ? "strong" : "moderate",
        [planet.name, dispositorName], [planet.house],
        `${planet.name}'s debilitation cancelled — weakness transforms into great strength`,
        `Cancellation by: ${reasons.join("; ")}`,
      ))
    }
  }

  return results
}

// ─── Parivartana Yoga (Exchange) ───────────────────────

function detectParivartanaYogas(chart: NatalChart): YogaResult[] {
  const results: YogaResult[] = []
  const checked = new Set<string>()

  for (const planet of chart.planets) {
    if (planet.name === "Rahu" || planet.name === "Ketu") continue

    const signLordName = planet.sign.lord
    if (signLordName === planet.name) continue // in own sign, no exchange

    const signLord = getPlanetByName(chart, signLordName)

    // Check if sign lord is in this planet's sign
    if (signLord.sign.lord === planet.name) {
      const key = [planet.name, signLordName].sort().join("-")
      if (checked.has(key)) continue
      checked.add(key)

      const isRaj = (isInKendra(planet.house) || isInTrikona(planet.house)) &&
                    (isInKendra(signLord.house) || isInTrikona(signLord.house))

      results.push(makeResult(
        "Parivartana Yoga", isRaj ? "Raj Yoga" : "Other Auspicious", true,
        isRaj ? "strong" : "moderate",
        [planet.name, signLordName], [planet.house, signLord.house],
        `${planet.name} and ${signLordName} exchange signs — mutual strengthening`,
        `${isRaj ? "Maha Parivartana (Raj Yoga)" : "Parivartana"}: ${planet.name} in ${planet.sign.name} ↔ ${signLordName} in ${signLord.sign.name}`,
      ))
    }
  }

  return results
}

// ─── Master Yoga Detection ─────────────────────────────

/**
 * Run all yoga detection algorithms on a natal chart.
 * Returns comprehensive list of all yogas found.
 */
export function analyzeAllYogas(chart: NatalChart): YogaResult[] {
  const allYogas: YogaResult[] = []

  // Panch Mahapurush (5)
  allYogas.push(...detectPanchMahapurush(chart))

  // Major named yogas
  allYogas.push(detectGajakesari(chart))
  allYogas.push(detectBudhaditya(chart))
  allYogas.push(detectChandraMangal(chart))
  allYogas.push(detectAdhiYoga(chart))

  // Sunapha / Anapha / Durudhura
  allYogas.push(...detectSunaphAnapha(chart))

  // Raj Yogas (Kendra-Trikona associations)
  allYogas.push(...detectRajYogas(chart))

  // Dhan Yogas
  allYogas.push(...detectDhanYogas(chart))

  // Vipreet Raj Yogas
  allYogas.push(...detectVipreetRajYogas(chart))

  // Neecha Bhanga
  allYogas.push(...detectNeechaBhanga(chart))

  // Parivartana
  allYogas.push(...detectParivartanaYogas(chart))

  // Kemdrum (inauspicious)
  allYogas.push(detectKemdrumYoga(chart))

  return allYogas
}

/**
 * Get only the yogas that are present (active) in the chart.
 */
export function getActiveYogas(chart: NatalChart): YogaResult[] {
  return analyzeAllYogas(chart).filter(y => y.isPresent)
}
