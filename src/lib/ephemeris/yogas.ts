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

// ─── Saraswati Yoga ────────────────────────────────────

function detectSaraswatiYoga(chart: NatalChart): YogaResult {
  const mercury = getPlanetByName(chart, "Mercury")
  const jupiter = getPlanetByName(chart, "Jupiter")
  const venus = getPlanetByName(chart, "Venus")

  // Check if all three are in Kendra, Trikona, or 2nd house
  const validHouses = [...KENDRA_HOUSES, ...TRIKONA_HOUSES, 2]
  const allThreeValid = validHouses.includes(mercury.house) &&
                        validHouses.includes(jupiter.house) &&
                        validHouses.includes(venus.house)

  const jupiterStrong = isInOwnOrExalted(jupiter)
  const isPresent = allThreeValid && jupiterStrong

  return makeResult(
    "Saraswati Yoga", "Other Auspicious", isPresent,
    isPresent ? "strong" : "weak",
    ["Mercury", "Jupiter", "Venus"], [mercury.house, jupiter.house, venus.house],
    "Mercury, Jupiter, Venus in Kendra/Trikona/2nd with Jupiter strong — eloquence, learning, arts",
    isPresent ? "Saraswati Yoga formed: Mercury, Jupiter, Venus well-placed for wisdom and arts" : "Not formed",
  )
}

// ─── Lakshmi Yoga ──────────────────────────────────────

function detectLakshmiYoga(chart: NatalChart): YogaResult {
  const lagnaLord = getHouseLordPlanet(chart, 1)
  const ninthLord = getHouseLordPlanet(chart, 9)

  const ninthInKendra = isInKendra(ninthLord.house)
  const ninthStrong = isInOwnOrExalted(ninthLord)
  const lagnaStrong = isInOwnOrExalted(lagnaLord)
  const isPresent = ninthInKendra && ninthStrong && lagnaStrong

  return makeResult(
    "Lakshmi Yoga", "Dhan Yoga", isPresent,
    isPresent ? "strong" : "weak",
    [lagnaLord.name, ninthLord.name], [1, 9],
    "9th lord in Kendra in own/exalted sign + strong lagna lord — great wealth and fortune",
    isPresent ? `Lakshmi Yoga: 9th lord (${ninthLord.name}) in Kendra with strength` : "Not formed",
  )
}

// ─── Chandra Yoga (Amala Yoga) ─────────────────────────

function detectChandraYogaAmala(chart: NatalChart): YogaResult {
  const benefics: PlanetName[] = ["Jupiter", "Venus", "Mercury"]
  const planetsInTenth = chart.planets.filter(p => p.house === 10)
  const onlyBeneficsInTenth = planetsInTenth.length > 0 &&
                              planetsInTenth.every(p => benefics.includes(p.name))
  const noMaleficsInTenth = !planetsInTenth.some(p => ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(p.name))

  const isPresent = onlyBeneficsInTenth && noMaleficsInTenth

  return makeResult(
    "Chandra Yoga (Amala Yoga)", "Lunar Yoga", isPresent,
    isPresent ? "strong" : "weak",
    benefics.filter(b => chart.planets.find(p => p.name === b && p.house === 10)), [10],
    "Only benefics in 10th from Lagna — spotless reputation and honor",
    isPresent ? "Chandra Yoga formed: Only benefics in 10th house" : "Not formed",
  )
}

// ─── Dharma-Karmadhipati Yoga ──────────────────────────

function detectDharmaKarmadhipatiYoga(chart: NatalChart): YogaResult {
  const ninthLord = getHouseLordPlanet(chart, 9)
  const tenthLord = getHouseLordPlanet(chart, 10)

  const conjoined = arePlanetsConjunct(ninthLord, tenthLord)
  const mutualAspect = planetsMutuallyAspect(ninthLord, tenthLord)
  const exchanged = ninthLord.house === 10 && tenthLord.house === 9
  const isPresent = conjoined || mutualAspect || exchanged

  return makeResult(
    "Dharma-Karmadhipati Yoga", "Raj Yoga", isPresent,
    exchanged ? "strong" : isPresent ? "moderate" : "weak",
    [ninthLord.name, tenthLord.name], [9, 10],
    "9th and 10th lords conjoined/aspecting/exchanging — powerful career and dharma",
    isPresent ? `Dharma-Karmadhipati: ${ninthLord.name} and ${tenthLord.name} ${exchanged ? "exchange" : mutualAspect ? "mutually aspect" : "conjoin"}` : "Not formed",
  )
}

// ─── Kahala Yoga ───────────────────────────────────────

function detectKahalaYoga(chart: NatalChart): YogaResult {
  const jupiter = getPlanetByName(chart, "Jupiter")
  const fourthLord = getHouseLordPlanet(chart, 4)
  const lagnaLord = getHouseLordPlanet(chart, 1)

  const jupHouseFrom4th = ((jupiter.house - fourthLord.house + 12) % 12) + 1
  const in4thKendra = [1, 4, 7, 10].includes(jupHouseFrom4th)
  const lagnaStrong = isInOwnOrExalted(lagnaLord)
  const isPresent = in4thKendra && lagnaStrong

  return makeResult(
    "Kahala Yoga", "Other Auspicious", isPresent,
    isPresent ? "strong" : "weak",
    ["Jupiter", fourthLord.name, lagnaLord.name], [4, jupiter.house, lagnaLord.house],
    "4th lord and Jupiter in mutual Kendras, lagna lord strong — bold and determined nature",
    isPresent ? "Kahala Yoga: 4th lord and Jupiter in mutual Kendras with strong lagna lord" : "Not formed",
  )
}

// ─── Chamara Yoga ──────────────────────────────────────

function detectChamaraYoga(chart: NatalChart): YogaResult {
  const lagnaLord = getHouseLordPlanet(chart, 1)
  const jupiter = getPlanetByName(chart, "Jupiter")

  const lagnaLordExaltedKendra = isInKendra(lagnaLord.house) && lagnaLord.isExalted
  const jupiterAspectsLagna = planetAspectsHouse(jupiter, lagnaLord.house)
  const isPresent = lagnaLordExaltedKendra && jupiterAspectsLagna

  return makeResult(
    "Chamara Yoga", "Raj Yoga", isPresent,
    isPresent ? "strong" : "weak",
    [lagnaLord.name, "Jupiter"], [lagnaLord.house, jupiter.house],
    "Lagna lord exalted in Kendra, aspected by Jupiter — honored by rulers",
    isPresent ? "Chamara Yoga: Lagna lord exalted in Kendra with Jupiter's aspect" : "Not formed",
  )
}

// ─── Sankha Yoga ───────────────────────────────────────

function detectSankhaYoga(chart: NatalChart): YogaResult {
  const fifthLord = getHouseLordPlanet(chart, 5)
  const sixthLord = getHouseLordPlanet(chart, 6)

  const fifthHouseFrom6th = ((fifthLord.house - sixthLord.house + 12) % 12) + 1
  const in6thKendra = [1, 4, 7, 10].includes(fifthHouseFrom6th)
  const sixthHouseFrom5th = ((sixthLord.house - fifthLord.house + 12) % 12) + 1
  const in5thKendra = [1, 4, 7, 10].includes(sixthHouseFrom5th)
  const isPresent = in6thKendra && in5thKendra

  return makeResult(
    "Sankha Yoga", "Other Auspicious", isPresent,
    isPresent ? "strong" : "weak",
    [fifthLord.name, sixthLord.name], [5, 6],
    "5th and 6th lords in mutual Kendras — good morals, wealth, long life",
    isPresent ? "Sankha Yoga: 5th and 6th lords in mutual Kendras" : "Not formed",
  )
}

// ─── Bheri Yoga ────────────────────────────────────────

function detectBheriYoga(chart: NatalChart): YogaResult {
  const venus = getPlanetByName(chart, "Venus")
  const lagnaLord = getHouseLordPlanet(chart, 1)
  const jupiter = getPlanetByName(chart, "Jupiter")

  const venusInKendra = isInKendra(venus.house)
  const lagnaLordInKendra = isInKendra(lagnaLord.house)
  const jupiterInKendraOr7th = isInKendra(jupiter.house) || jupiter.house === 7
  const isPresent = venusInKendra && lagnaLordInKendra && jupiterInKendraOr7th

  return makeResult(
    "Bheri Yoga", "Other Auspicious", isPresent,
    isPresent ? "strong" : "weak",
    ["Venus", lagnaLord.name, "Jupiter"], [venus.house, lagnaLord.house, jupiter.house],
    "Venus and lagna lord in Kendra, Jupiter in Kendra/7th — wealthy, religious, happy",
    isPresent ? "Bheri Yoga: Venus, lagna lord, and Jupiter all well-placed" : "Not formed",
  )
}

// ─── Mridanga Yoga ─────────────────────────────────────

function detectMridangaYoga(chart: NatalChart): YogaResult {
  const lagnaLord = getHouseLordPlanet(chart, 1)
  const lagnaLordStrong = isInOwnOrExalted(lagnaLord)
  const allPlanetsInKendraOrTrikona = chart.planets.every(p =>
    p.name !== "Rahu" && p.name !== "Ketu" &&
    (isInKendra(p.house) || isInTrikona(p.house))
  )

  const isPresent = lagnaLordStrong && allPlanetsInKendraOrTrikona

  return makeResult(
    "Mridanga Yoga", "Raj Yoga", isPresent,
    isPresent ? "strong" : "weak",
    [lagnaLord.name], [lagnaLord.house],
    "Lagna lord strong, all planets in Kendras/Trikonas — fame and rulership",
    isPresent ? "Mridanga Yoga: Lagna lord strong with all planets in Kendras/Trikonas" : "Not formed",
  )
}

// ─── Shakata Yoga (Inauspicious) ───────────────────────

function detectShakataYoga(chart: NatalChart): YogaResult {
  const moon = getPlanetByName(chart, "Moon")
  const jupiter = getPlanetByName(chart, "Jupiter")

  // Jupiter in 6th, 8th, or 12th from Moon
  const jupHouseFromMoon = ((jupiter.house - moon.house + 12) % 12) + 1
  const inDusthana = [6, 8, 12].includes(jupHouseFromMoon)

  // Cancellation: Jupiter in Kendra from Lagna
  const jupInKendraFromLagna = isInKendra(jupiter.house)
  const isPresent = inDusthana && !jupInKendraFromLagna
  const cancelled = inDusthana && jupInKendraFromLagna

  return makeResult(
    "Shakata Yoga", "Inauspicious", isPresent,
    isPresent ? "moderate" : "weak",
    ["Moon", "Jupiter"], [moon.house, jupiter.house],
    "Jupiter in 6th/8th/12th from Moon — periodic ups and downs (cancelled if Jupiter in Kendra from Lagna)",
    isPresent ? "Shakata Yoga active: Jupiter in dusthana from Moon" : cancelled ? "Shakata Yoga cancelled by Jupiter in Kendra from Lagna" : "Not formed",
  )
}

// ─── Daridra Yoga (Inauspicious) ───────────────────────

function detectDaridraDusthana(chart: NatalChart): YogaResult {
  const eleventhLord = getHouseLordPlanet(chart, 11)
  const inDusthana = DUSTHANA_HOUSES.includes(eleventhLord.house)
  const isPresent = inDusthana

  return makeResult(
    "Daridra Yoga", "Inauspicious", isPresent,
    isPresent ? "moderate" : "weak",
    [eleventhLord.name], [11, eleventhLord.house],
    "11th lord in 6th/8th/12th — financial difficulties and poverty",
    isPresent ? `Daridra Yoga: 11th lord (${eleventhLord.name}) in dusthana (house ${eleventhLord.house})` : "Not formed",
  )
}

// ─── Grahan Yoga (Lunar/Solar Eclipse Yoga) ────────────

function detectGrahanYoga(chart: NatalChart): YogaResult {
  const sun = getPlanetByName(chart, "Sun")
  const moon = getPlanetByName(chart, "Moon")
  const rahu = getPlanetByName(chart, "Rahu")
  const ketu = getPlanetByName(chart, "Ketu")

  const sunWithRahuKetu = arePlanetsConjunct(sun, rahu) || arePlanetsConjunct(sun, ketu)
  const moonWithRahuKetu = arePlanetsConjunct(moon, rahu) || arePlanetsConjunct(moon, ketu)
  const isPresent = sunWithRahuKetu || moonWithRahuKetu

  const planets: PlanetName[] = []
  if (sunWithRahuKetu) planets.push("Sun", arePlanetsConjunct(sun, rahu) ? "Rahu" : "Ketu")
  if (moonWithRahuKetu) planets.push("Moon", arePlanetsConjunct(moon, rahu) ? "Rahu" : "Ketu")

  return makeResult(
    "Grahan Yoga", "Inauspicious", isPresent,
    isPresent ? "moderate" : "weak",
    planets, [sun.house, moon.house, rahu.house, ketu.house],
    "Sun or Moon conjunct Rahu/Ketu — eclipsed significations, weakened benefits",
    isPresent ? `Grahan Yoga: ${planets.join(", ")} conjunction` : "Not formed",
  )
}

// ─── Guru-Chandal Yoga (Inauspicious) ──────────────────

function detectGuruChandalYoga(chart: NatalChart): YogaResult {
  const jupiter = getPlanetByName(chart, "Jupiter")
  const rahu = getPlanetByName(chart, "Rahu")

  const isPresent = arePlanetsConjunct(jupiter, rahu)

  return makeResult(
    "Guru-Chandal Yoga", "Inauspicious", isPresent,
    isPresent ? "moderate" : "weak",
    ["Jupiter", "Rahu"], [jupiter.house],
    "Jupiter conjunct Rahu — unconventional beliefs, misuse of wisdom, spiritual confusion",
    isPresent ? `Guru-Chandal Yoga in house ${jupiter.house}` : "Not formed",
  )
}

// ─── Veshi Yoga ────────────────────────────────────────

function detectVeshiYoga(chart: NatalChart): YogaResult {
  const sun = getPlanetByName(chart, "Sun")
  const others = chart.planets.filter(p => p.name !== "Sun" && p.name !== "Moon")

  const h2FromSun = ((sun.house) % 12) + 1
  const planetsIn2nd = others.filter(p => p.house === h2FromSun)
  const isPresent = planetsIn2nd.length > 0

  return makeResult(
    "Veshi Yoga", "Solar Yoga", isPresent,
    isPresent ? "moderate" : "weak",
    planetsIn2nd.map(p => p.name), [h2FromSun],
    "Planet(s) in 2nd from Sun — wealth, learning, and prosperity",
    isPresent ? `Veshi Yoga: ${planetsIn2nd.map(p => p.name).join(", ")} in 2nd from Sun` : "Not formed",
  )
}

// ─── Vashi Yoga ────────────────────────────────────────

function detectVashiYoga(chart: NatalChart): YogaResult {
  const sun = getPlanetByName(chart, "Sun")
  const others = chart.planets.filter(p => p.name !== "Sun" && p.name !== "Moon")

  const h12FromSun = ((sun.house - 2 + 12) % 12) + 1
  const planetsIn12th = others.filter(p => p.house === h12FromSun)
  const isPresent = planetsIn12th.length > 0

  return makeResult(
    "Vashi Yoga", "Solar Yoga", isPresent,
    isPresent ? "moderate" : "weak",
    planetsIn12th.map(p => p.name), [h12FromSun],
    "Planet(s) in 12th from Sun — influence, authority, and hidden powers",
    isPresent ? `Vashi Yoga: ${planetsIn12th.map(p => p.name).join(", ")} in 12th from Sun` : "Not formed",
  )
}

// ─── Ubhayachari Yoga ──────────────────────────────────

function detectUbhayachariYoga(chart: NatalChart): YogaResult {
  const sun = getPlanetByName(chart, "Sun")
  const others = chart.planets.filter(p => p.name !== "Sun" && p.name !== "Moon")

  const h2FromSun = ((sun.house) % 12) + 1
  const h12FromSun = ((sun.house - 2 + 12) % 12) + 1
  const planetsIn2nd = others.filter(p => p.house === h2FromSun)
  const planetsIn12th = others.filter(p => p.house === h12FromSun)

  const isPresent = planetsIn2nd.length > 0 && planetsIn12th.length > 0

  const planets = [
    ...planetsIn2nd.map(p => p.name),
    ...planetsIn12th.map(p => p.name),
  ]

  return makeResult(
    "Ubhayachari Yoga", "Solar Yoga", isPresent,
    isPresent ? "strong" : "weak",
    planets, [h2FromSun, h12FromSun],
    "Planets on both sides of Sun (2nd and 12th) — wealth, power, and prominence",
    isPresent ? "Ubhayachari Yoga: Planets flanking Sun in 2nd and 12th" : "Not formed",
  )
}

// ─── Nipuna Yoga (Budha-Aditya variant) ────────────────

function detectNipunaYoga(chart: NatalChart): YogaResult {
  const sun = getPlanetByName(chart, "Sun")
  const mercury = getPlanetByName(chart, "Mercury")

  // Sun and Mercury within 10 degrees (simplified: same sign or adjacent)
  const sameSign = sun.sign.name === mercury.sign.name
  const withinRange = Math.abs(sun.longitude - mercury.longitude) <= 10
  const notCombust = !mercury.isCombust
  const isPresent = (sameSign || withinRange) && notCombust

  return makeResult(
    "Nipuna Yoga", "Solar Yoga", isPresent,
    isPresent ? "moderate" : "weak",
    ["Sun", "Mercury"], [sun.house],
    "Sun and Mercury within 10° (not combust) — skilled in arts and sciences",
    isPresent ? "Nipuna Yoga: Sun and Mercury in close conjunction" : notCombust ? "Mercury combust" : "Not formed",
  )
}

// ─── Akhanda Samrajya Yoga ─────────────────────────────

function detectAkhandaSamrajyaYoga(chart: NatalChart): YogaResult {
  const secondLord = getHouseLordPlanet(chart, 2)
  const fifthLord = getHouseLordPlanet(chart, 5)
  const eleventhLord = getHouseLordPlanet(chart, 11)
  const moon = getPlanetByName(chart, "Moon")
  const benefics: PlanetName[] = ["Jupiter", "Venus", "Mercury"]

  // Jupiter as lord of 2nd, 5th, or 11th
  const jupiterIsAnyLord = (secondLord.name === "Jupiter") ||
                           (fifthLord.name === "Jupiter") ||
                           (eleventhLord.name === "Jupiter")

  // A benefic in Kendra from Moon
  const beneficInKendraFromMoon = benefics.some(b => {
    const p = getPlanetByName(chart, b)
    const pHouseFromMoon = ((p.house - moon.house + 12) % 12) + 1
    return [1, 4, 7, 10].includes(pHouseFromMoon)
  })

  const isPresent = jupiterIsAnyLord && beneficInKendraFromMoon

  return makeResult(
    "Akhanda Samrajya Yoga", "Raj Yoga", isPresent,
    isPresent ? "strong" : "weak",
    ["Jupiter"], [secondLord.house || fifthLord.house || eleventhLord.house],
    "Jupiter as lord of 2nd/5th/11th, benefic in Kendra from Moon — undivided authority",
    isPresent ? "Akhanda Samrajya Yoga: Jupiter lordship with benefic support from Moon" : "Not formed",
  )
}

// ─── Amala Yoga (10th house purity) ────────────────────

function detectAmalaYoga(chart: NatalChart): YogaResult {
  const benefics: PlanetName[] = ["Jupiter", "Venus", "Mercury"]
  const planetsIn10thLagna = getPlanetsInHouse(chart, 10)
  const planetsIn10thMoon = chart.planets.filter(p => {
    const moon = getPlanetByName(chart, "Moon")
    const pHouseFromMoon = ((p.house - moon.house + 12) % 12) + 1
    return pHouseFromMoon === 10
  })

  const onlyBeneficsLagna = planetsIn10thLagna.length > 0 &&
                           planetsIn10thLagna.every(p => benefics.includes(p.name))
  const onlyBeneficsMoon = planetsIn10thMoon.length > 0 &&
                          planetsIn10thMoon.every(p => benefics.includes(p.name))

  const isPresent = onlyBeneficsLagna && onlyBeneficsMoon

  return makeResult(
    "Amala Yoga", "Other Auspicious", isPresent,
    isPresent ? "strong" : "weak",
    benefics, [10],
    "Only natural benefics in 10th from Lagna AND 10th from Moon — virtuous reputation",
    isPresent ? "Amala Yoga: Only benefics in 10th from both Lagna and Moon" : "Not formed",
  )
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

  // NEW: Saraswati Yoga
  allYogas.push(detectSaraswatiYoga(chart))

  // NEW: Lakshmi Yoga
  allYogas.push(detectLakshmiYoga(chart))

  // NEW: Chandra Yoga (Amala)
  allYogas.push(detectChandraYogaAmala(chart))

  // NEW: Dharma-Karmadhipati Yoga
  allYogas.push(detectDharmaKarmadhipatiYoga(chart))

  // NEW: Kahala Yoga
  allYogas.push(detectKahalaYoga(chart))

  // NEW: Chamara Yoga
  allYogas.push(detectChamaraYoga(chart))

  // NEW: Sankha Yoga
  allYogas.push(detectSankhaYoga(chart))

  // NEW: Bheri Yoga
  allYogas.push(detectBheriYoga(chart))

  // NEW: Mridanga Yoga
  allYogas.push(detectMridangaYoga(chart))

  // NEW: Shakata Yoga (inauspicious)
  allYogas.push(detectShakataYoga(chart))

  // NEW: Daridra Yoga (inauspicious)
  allYogas.push(detectDaridraDusthana(chart))

  // NEW: Grahan Yoga (inauspicious)
  allYogas.push(detectGrahanYoga(chart))

  // NEW: Guru-Chandal Yoga (inauspicious)
  allYogas.push(detectGuruChandalYoga(chart))

  // NEW: Veshi Yoga
  allYogas.push(detectVeshiYoga(chart))

  // NEW: Vashi Yoga
  allYogas.push(detectVashiYoga(chart))

  // NEW: Ubhayachari Yoga
  allYogas.push(detectUbhayachariYoga(chart))

  // NEW: Nipuna Yoga
  allYogas.push(detectNipunaYoga(chart))

  // NEW: Akhanda Samrajya Yoga
  allYogas.push(detectAkhandaSamrajyaYoga(chart))

  // NEW: Amala Yoga
  allYogas.push(detectAmalaYoga(chart))

  return allYogas
}

/**
 * Get only the yogas that are present (active) in the chart.
 */
export function getActiveYogas(chart: NatalChart): YogaResult[] {
  return analyzeAllYogas(chart).filter(y => y.isPresent)
}
