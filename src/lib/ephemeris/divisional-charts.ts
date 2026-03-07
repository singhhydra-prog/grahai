/* ════════════════════════════════════════════════════════
   GrahAI — Divisional Charts (Varga) Engine
   D1 through D60 based on BPHS Chapter 6

   Each divisional chart maps a planet's natal longitude
   to a new sign based on the divisor formula.
   ════════════════════════════════════════════════════════ */

import type {
  NatalChart, DivisionalChart, DivisionalChartType,
  PlanetName, SignInfo,
} from "./types"
import { SIGNS, getSignFromLongitude, getDegreeInSign, getHouseNumber } from "./constants"

// ─── Chart Metadata ────────────────────────────────────
const CHART_INFO: Record<DivisionalChartType, { name: string, sanskrit: string, purpose: string, divisor: number }> = {
  D1:  { name: "Rashi",         sanskrit: "Rashi",          purpose: "Natal chart — overall life",                           divisor: 1 },
  D2:  { name: "Hora",          sanskrit: "Hora",           purpose: "Wealth and financial prosperity",                      divisor: 2 },
  D3:  { name: "Drekkana",      sanskrit: "Drekkana",       purpose: "Siblings, courage, and co-borns",                     divisor: 3 },
  D4:  { name: "Chaturthamsa",  sanskrit: "Chaturthamsa",   purpose: "Fortune, property, and fixed assets",                 divisor: 4 },
  D7:  { name: "Saptamsha",     sanskrit: "Saptamsha",      purpose: "Children and progeny",                                divisor: 7 },
  D9:  { name: "Navamsa",       sanskrit: "Navamsa",        purpose: "Marriage, dharma, and spiritual potential",            divisor: 9 },
  D10: { name: "Dasamsa",       sanskrit: "Dasamsa",        purpose: "Career, profession, and public standing",             divisor: 10 },
  D12: { name: "Dwadasamsa",    sanskrit: "Dwadasamsa",     purpose: "Parents, lineage, and past life karma",               divisor: 12 },
  D16: { name: "Shodasamsa",    sanskrit: "Shodasamsa",     purpose: "Vehicles, happiness, and comforts",                   divisor: 16 },
  D20: { name: "Vimsamsa",      sanskrit: "Vimsamsa",       purpose: "Spiritual progress and upasana",                      divisor: 20 },
  D24: { name: "Chaturvimsamsa",sanskrit: "Chaturvimsamsa", purpose: "Education, learning, and academic success",           divisor: 24 },
  D27: { name: "Saptavimsamsa", sanskrit: "Saptavimsamsa",  purpose: "Physical strength and stamina",                       divisor: 27 },
  D30: { name: "Trimshamsa",    sanskrit: "Trimshamsa",     purpose: "Misfortunes, diseases, and arishta (afflictions)",    divisor: 30 },
  D40: { name: "Khavedamsa",    sanskrit: "Khavedamsa",     purpose: "Auspicious and inauspicious effects",                 divisor: 40 },
  D45: { name: "Akshavedamsa",  sanskrit: "Akshavedamsa",   purpose: "General well-being and moral character",              divisor: 45 },
  D60: { name: "Shashtiamsa",   sanskrit: "Shashtiamsa",    purpose: "Past life karma — most subtle division",              divisor: 60 },
}

// ─── Divisional Longitude Calculation ──────────────────

/**
 * Calculate the divisional sign for a planet.
 * General formula (for most charts): Take the natal longitude,
 * multiply the degree-within-sign by the divisor, then find
 * which sign that falls in, offset from the natal sign.
 *
 * Special formulas exist for D2 (Hora), D3 (Drekkana), D30 (Trimshamsa).
 */
function getDivisionalSignIndex(
  natalLongitude: number,
  chartType: DivisionalChartType
): number {
  const normalized = ((natalLongitude % 360) + 360) % 360
  const natalSignIndex = Math.floor(normalized / 30)
  const degreeInSign = normalized % 30

  const info = CHART_INFO[chartType]

  switch (chartType) {
    case "D1":
      return natalSignIndex

    case "D2": {
      // Hora: 0-15° in odd signs → Sun (Leo), 15-30° → Moon (Cancer)
      // 0-15° in even signs → Moon (Cancer), 15-30° → Sun (Leo)
      const isOddSign = natalSignIndex % 2 === 0  // 0-indexed: Aries=0 is odd sign
      if (isOddSign) {
        return degreeInSign < 15 ? 4 : 3  // Leo or Cancer
      } else {
        return degreeInSign < 15 ? 3 : 4  // Cancer or Leo
      }
    }

    case "D3": {
      // Drekkana: 0-10° → same sign, 10-20° → 5th from sign, 20-30° → 9th from sign
      if (degreeInSign < 10) return natalSignIndex
      if (degreeInSign < 20) return (natalSignIndex + 4) % 12
      return (natalSignIndex + 8) % 12
    }

    case "D30": {
      // Trimshamsa: Different for odd/even signs, based on BPHS
      // Odd signs: Mars (0-5°), Saturn (5-10°), Jupiter (10-18°), Mercury (18-25°), Venus (25-30°)
      // Even signs: Venus (0-5°), Mercury (5-12°), Jupiter (12-20°), Saturn (20-25°), Mars (25-30°)
      const isOddSign = natalSignIndex % 2 === 0
      if (isOddSign) {
        if (degreeInSign < 5) return 0       // Aries (Mars)
        if (degreeInSign < 10) return 10     // Aquarius (Saturn)
        if (degreeInSign < 18) return 8      // Sagittarius (Jupiter)
        if (degreeInSign < 25) return 2      // Gemini (Mercury)
        return 6                              // Libra (Venus)
      } else {
        if (degreeInSign < 5) return 1       // Taurus (Venus)
        if (degreeInSign < 12) return 5      // Virgo (Mercury)
        if (degreeInSign < 20) return 11     // Pisces (Jupiter)
        if (degreeInSign < 25) return 9      // Capricorn (Saturn)
        return 7                              // Scorpio (Mars)
      }
    }

    default: {
      // General formula for D4, D7, D9, D10, D12, D16, D20, D24, D27, D40, D45, D60
      // Part = floor(degree * divisor / 30)
      // Divisional sign = (natalSign + part) % 12
      const divisor = info.divisor
      const part = Math.floor(degreeInSign * divisor / 30)
      return (natalSignIndex + part) % 12
    }
  }
}

/**
 * Calculate the degree within the divisional sign.
 */
function getDivisionalDegree(natalLongitude: number, divisor: number): number {
  const normalized = ((natalLongitude % 360) + 360) % 360
  const degreeInSign = normalized % 30

  // Each division spans 30/divisor degrees in the natal chart
  const divisionSpan = 30 / divisor
  const positionInDivision = degreeInSign % divisionSpan

  // Scale up to 0-30 range
  return (positionInDivision / divisionSpan) * 30
}

// ─── Generate Divisional Chart ─────────────────────────

/**
 * Generate a complete divisional chart from a natal chart.
 */
export function generateDivisionalChart(
  natalChart: NatalChart,
  chartType: DivisionalChartType
): DivisionalChart {
  const info = CHART_INFO[chartType]

  // Calculate ascendant for divisional chart
  const ascDivSignIndex = getDivisionalSignIndex(natalChart.ascendant, chartType)
  const ascDivDegree = getDivisionalDegree(natalChart.ascendant, info.divisor)
  const ascDivLong = ascDivSignIndex * 30 + ascDivDegree
  const ascSign = SIGNS[ascDivSignIndex]

  // Calculate planet positions in divisional chart
  const planets = natalChart.planets.map(planet => {
    const divSignIndex = getDivisionalSignIndex(planet.longitude, chartType)
    const divDegree = getDivisionalDegree(planet.longitude, info.divisor)
    const divLong = divSignIndex * 30 + divDegree
    const house = getHouseNumber(divLong, ascDivLong)

    return {
      name: planet.name,
      longitude: divLong,
      sign: SIGNS[divSignIndex],
      degree: divDegree,
      house,
    }
  })

  return {
    type: chartType,
    name: info.name,
    sanskrit: info.sanskrit,
    purpose: info.purpose,
    planets,
    ascendant: ascDivLong,
    ascendantSign: ascSign,
  }
}

// ─── Generate All Key Divisional Charts ────────────────

/**
 * Generate the most commonly used divisional charts.
 * Returns: D1, D2, D3, D4, D7, D9, D10, D12, D30
 */
export function generateKeyDivisionalCharts(natalChart: NatalChart): DivisionalChart[] {
  const keyCharts: DivisionalChartType[] = [
    "D1", "D2", "D3", "D4", "D7", "D9", "D10", "D12", "D30",
  ]

  return keyCharts.map(type => generateDivisionalChart(natalChart, type))
}

/**
 * Generate ALL 16 divisional charts (Shodashavarga).
 */
export function generateAllDivisionalCharts(natalChart: NatalChart): DivisionalChart[] {
  const allTypes: DivisionalChartType[] = [
    "D1", "D2", "D3", "D4", "D7", "D9", "D10", "D12",
    "D16", "D20", "D24", "D27", "D30", "D40", "D45", "D60",
  ]

  return allTypes.map(type => generateDivisionalChart(natalChart, type))
}

// ─── Vargottama Check ──────────────────────────────────

/**
 * A planet is Vargottama if it occupies the same sign in both
 * the natal (D1) and Navamsa (D9) charts. This greatly strengthens it.
 */
export function isVargottama(natalLongitude: number): boolean {
  const natalSignIndex = Math.floor(((natalLongitude % 360 + 360) % 360) / 30)
  const navamsaSignIndex = getDivisionalSignIndex(natalLongitude, "D9")
  return natalSignIndex === navamsaSignIndex
}

/**
 * Check Vargottama for all planets in the chart.
 */
export function getVargottamaPlanets(natalChart: NatalChart): PlanetName[] {
  return natalChart.planets
    .filter(p => isVargottama(p.longitude))
    .map(p => p.name)
}

// ─── Export chart info for UI ──────────────────────────
export { CHART_INFO }
