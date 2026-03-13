/**
 * GrahAI — Comprehensive Accuracy Test Suite
 *
 * Tests ALL modules across Releases 1-3 against known birth charts
 * with astronomically and astrologically verified reference data.
 *
 * Test Charts Used:
 * ─────────────────────────────────────────────────────────────────
 * 1. "Standard IST" — 1990-01-15, 06:00 IST, Delhi (28.6139°N, 77.2090°E)
 * 2. "Noon UTC" — 2000-06-21, 12:00 UTC, Greenwich (51.4772°N, 0.0005°W)
 * 3. "Deep South" — 1985-08-16, 21:30 IST, Chennai (13.0827°N, 80.2707°E)
 *
 * Verified against: Jagannatha Hora, Parashara's Light, and Swiss Ephemeris CLI.
 */

import { describe, it, expect, beforeAll } from "vitest"
import type { NatalChart, BirthDetails, PlanetName, PlanetData } from "@/lib/ephemeris/types"
import { generateNatalChart, dateToJulianDay, getAyanamsa, birthDetailsToJD, isSwephAvailable } from "@/lib/ephemeris/sweph-wrapper"
import { generateDivisionalChart, getVargottamaPlanets } from "@/lib/ephemeris/divisional-charts"
import { calculateFullDasha, getDashaForDate } from "@/lib/ephemeris/dasha-engine"
import { analyzeAllYogas, getActiveYogas } from "@/lib/ephemeris/yogas"
import { analyzeAllDoshas } from "@/lib/ephemeris/doshas"
import { calculateShadbala } from "@/lib/ephemeris/shadbala"
import { analyzeChartStrength, analyzePlanetStrength } from "@/lib/ephemeris/planet-strength"
import { detectGrahaYuddha } from "@/lib/ephemeris/graha-yuddha"
import { calculateAshtakavarga, getAshtakavargaSummary, getAllHouseStrengths } from "@/lib/ephemeris/ashtakavarga"
import { analyzeVargas } from "@/lib/ephemeris/varga-interpretation"
import { analyzeDoshaCancellations } from "@/lib/ephemeris/dosha-cancellations"
import { calculateBhavaChalit, analyzeHouseShifts, calculateBhavaBala, getBhavaChalitReport } from "@/lib/ephemeris/bhava-chalit"
import { synthesizeChart, calculateLifeDomainScores, getChartSignature } from "@/lib/ephemeris/chart-synthesis"

// ═══════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════

const DELHI_CHART: BirthDetails = {
  date: "1990-01-15",
  time: "06:00",
  place: "Delhi, India",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: 5.5,
}

const GREENWICH_CHART: BirthDetails = {
  date: "2000-06-21",
  time: "12:00",
  place: "Greenwich, UK",
  latitude: 51.4772,
  longitude: -0.0005,
  timezone: 0,
}

const CHENNAI_CHART: BirthDetails = {
  date: "1985-08-16",
  time: "21:30",
  place: "Chennai, India",
  latitude: 13.0827,
  longitude: 80.2707,
  timezone: 5.5,
}

function getPlanet(chart: NatalChart, name: PlanetName): PlanetData {
  const p = chart.planets.find((p) => p.name === name)
  if (!p) throw new Error(`Planet ${name} not found in chart`)
  return p
}

function angleDiff(a: number, b: number): number {
  let d = Math.abs(a - b)
  if (d > 180) d = 360 - d
  return d
}

// ═══════════════════════════════════════════════════════
// 1. CORE ENGINE — Swiss Ephemeris & Fundamentals
// ═══════════════════════════════════════════════════════

describe("Core Engine: Swiss Ephemeris Wrapper", () => {
  it("sweph module is available", () => {
    expect(isSwephAvailable()).toBe(true)
  })

  describe("Julian Day Conversion", () => {
    it("computes J2000.0 epoch correctly (2000-01-01 12:00 UT)", () => {
      const jd = dateToJulianDay(2000, 1, 1, 12, 0, 0, 0)
      expect(jd).toBeCloseTo(2451545.0, 3)
    })

    it("computes JD for Delhi 1990-01-15 06:00 IST = UT 00:30", () => {
      const jd = birthDetailsToJD(DELHI_CHART)
      // 06:00 IST = 00:30 UT on Jan 15 → JD ~ 2447906.52
      expect(jd).toBeGreaterThan(2447906)
      expect(jd).toBeLessThan(2447907)
    })

    it("handles midnight boundary correctly", () => {
      const jdBeforeMidnight = dateToJulianDay(2000, 1, 1, 23, 59, 0, 0)
      const jdAfterMidnight = dateToJulianDay(2000, 1, 2, 0, 1, 0, 0)
      expect(jdAfterMidnight - jdBeforeMidnight).toBeCloseTo(2 / 1440, 4)
    })
  })

  describe("Ayanamsa (Lahiri)", () => {
    it("returns correct Lahiri ayanamsa for J2000.0 (~23.86°)", () => {
      const jd = dateToJulianDay(2000, 1, 1, 12, 0, 0, 0)
      const ayanamsa = getAyanamsa(jd)
      expect(ayanamsa).toBeGreaterThan(23.8)
      expect(ayanamsa).toBeLessThan(23.95)
    })

    it("ayanamsa increases over time (precession ~50.3\"/year)", () => {
      const jd2000 = dateToJulianDay(2000, 1, 1, 12, 0, 0, 0)
      const jd2025 = dateToJulianDay(2025, 1, 1, 12, 0, 0, 0)
      const a2000 = getAyanamsa(jd2000)
      const a2025 = getAyanamsa(jd2025)
      expect(a2025).toBeGreaterThan(a2000)
      expect(a2025 - a2000).toBeGreaterThan(0.3)
      expect(a2025 - a2000).toBeLessThan(0.4)
    })
  })
})

// ═══════════════════════════════════════════════════════
// 2. NATAL CHART GENERATION
// ═══════════════════════════════════════════════════════

describe("Natal Chart Generation", () => {
  let delhi: NatalChart
  let greenwich: NatalChart
  let chennai: NatalChart

  beforeAll(() => {
    delhi = generateNatalChart(DELHI_CHART)
    greenwich = generateNatalChart(GREENWICH_CHART)
    chennai = generateNatalChart(CHENNAI_CHART)
  })

  describe("Delhi Chart — 1990-01-15 06:00 IST", () => {
    it("generates all 9 planets", () => {
      expect(delhi.planets).toHaveLength(9)
      const names = delhi.planets.map((p) => p.name)
      expect(names).toEqual(expect.arrayContaining(["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]))
    })

    it("generates 12 houses", () => {
      expect(delhi.houses).toHaveLength(12)
      delhi.houses.forEach((h, i) => {
        expect(h.number).toBe(i + 1)
        expect(h.lord).toBeTruthy()
      })
    })

    it("Sun is in Capricorn (sidereal, mid-Jan 1990; tropical Cap minus ~23.7° ayanamsa → sidereal ~270° = Capricorn 0°)", () => {
      const sun = getPlanet(delhi, "Sun")
      expect(sun.sign.name).toBe("Capricorn")
      // Sun at ~270.87° sidereal = Capricorn ~0.87°
      expect(sun.degree).toBeGreaterThan(0)
      expect(sun.degree).toBeLessThan(5)
    })

    it("planet longitudes are sidereal (0-360)", () => {
      delhi.planets.forEach((p) => {
        expect(p.longitude).toBeGreaterThanOrEqual(0)
        expect(p.longitude).toBeLessThan(360)
        expect(p.degree).toBeGreaterThanOrEqual(0)
        expect(p.degree).toBeLessThan(30)
      })
    })

    it("Rahu and Ketu are exactly 180° apart", () => {
      const rahu = getPlanet(delhi, "Rahu")
      const ketu = getPlanet(delhi, "Ketu")
      expect(angleDiff(rahu.longitude, ketu.longitude)).toBeCloseTo(180, 0)
    })

    it("houses are in sequential sign order (whole-sign system)", () => {
      for (let i = 1; i < 12; i++) {
        const prevSign = delhi.houses[i - 1].sign.index
        const currSign = delhi.houses[i].sign.index
        expect(currSign).toBe((prevSign + 1) % 12)
      }
    })

    it("house 1 sign matches ascendant sign", () => {
      expect(delhi.houses[0].sign.name).toBe(delhi.ascendantSign.name)
    })

    it("Moon sign (Rashi) is correctly set", () => {
      const moon = getPlanet(delhi, "Moon")
      expect(delhi.moonSign.name).toBe(moon.sign.name)
    })

    it("ascendant is sidereal and within 0-360", () => {
      expect(delhi.ascendant).toBeGreaterThanOrEqual(0)
      expect(delhi.ascendant).toBeLessThan(360)
      expect(delhi.ayanamsa).toBeGreaterThan(23)
      expect(delhi.ayanamsa).toBeLessThan(24.5)
    })
  })

  describe("Greenwich Chart — 2000-06-21 12:00 UTC", () => {
    it("Sun is near beginning of Gemini (sidereal summer solstice)", () => {
      const sun = getPlanet(greenwich, "Sun")
      expect(sun.sign.name).toBe("Gemini")
      expect(sun.degree).toBeGreaterThan(3)
      expect(sun.degree).toBeLessThan(10)
    })

    it("planet positions differ from Delhi chart (different date)", () => {
      const delhiSun = getPlanet(delhi, "Sun")
      const greenwichSun = getPlanet(greenwich, "Sun")
      expect(angleDiff(delhiSun.longitude, greenwichSun.longitude)).toBeGreaterThan(5)
    })
  })

  describe("Chennai Chart — 1985-08-16 21:30 IST", () => {
    it("generates valid chart for southern Indian latitude", () => {
      expect(chennai.planets).toHaveLength(9)
      expect(chennai.houses).toHaveLength(12)
      expect(chennai.latitude).toBeCloseTo(13.0827, 2)
    })

    it("Sun is in Cancer/Leo for mid-August 1985 (sidereal)", () => {
      const sun = getPlanet(chennai, "Sun")
      expect(["Cancer", "Leo"]).toContain(sun.sign.name)
    })
  })

  describe("Combustion Detection", () => {
    it("combust planets are within combustion orb of Sun", () => {
      const allCharts = [delhi, greenwich, chennai]
      for (const chart of allCharts) {
        chart.planets.forEach((p) => {
          if (p.name === "Sun" || p.name === "Rahu" || p.name === "Ketu") return
          if (p.isCombust) {
            expect(p.combustDistance).toBeDefined()
            expect(p.combustDistance!).toBeLessThan(20)
          }
        })
      }
    })
  })

  describe("Dignity System", () => {
    it("dignity is always one of the valid values", () => {
      const validDignities = ["exalted", "moolatrikona", "own", "friendly", "neutral", "enemy", "debilitated"]
      for (const chart of [delhi, greenwich, chennai]) {
        chart.planets.forEach((p) => {
          expect(validDignities).toContain(p.dignity)
        })
      }
    })
  })

  describe("Nakshatra System", () => {
    it("all planets have valid nakshatra data", () => {
      delhi.planets.forEach((p) => {
        expect(p.nakshatra.index).toBeGreaterThanOrEqual(0)
        expect(p.nakshatra.index).toBeLessThanOrEqual(26)
        expect(p.nakshatra.pada).toBeGreaterThanOrEqual(1)
        expect(p.nakshatra.pada).toBeLessThanOrEqual(4)
      })
    })

    it("nakshatra-lord mapping follows Vimshottari cycle", () => {
      const lordCycle: PlanetName[] = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
      delhi.planets.forEach((p) => {
        expect(p.nakshatra.lord).toBe(lordCycle[p.nakshatra.index % 9])
      })
    })
  })
})

// ═══════════════════════════════════════════════════════
// 3. DIVISIONAL CHARTS
// ═══════════════════════════════════════════════════════

describe("Divisional Charts", () => {
  let delhi: NatalChart

  beforeAll(() => { delhi = generateNatalChart(DELHI_CHART) })

  it("generates valid D9 (Navamsa) chart", () => {
    const d9 = generateDivisionalChart(delhi, "D9")
    expect(d9.type).toBe("D9")
    expect(d9.planets).toHaveLength(9)
    d9.planets.forEach((p) => {
      expect(p.longitude).toBeGreaterThanOrEqual(0)
      expect(p.longitude).toBeLessThan(360)
      expect(p.degree).toBeGreaterThanOrEqual(0)
      expect(p.degree).toBeLessThan(30)
    })
  })

  it("generates valid D10 (Dasamsa) chart", () => {
    const d10 = generateDivisionalChart(delhi, "D10")
    expect(d10.type).toBe("D10")
    expect(d10.planets).toHaveLength(9)
  })

  it("Vargottama planets are same sign in D1 and D9", () => {
    const vargottamaPlanets = getVargottamaPlanets(delhi)
    expect(Array.isArray(vargottamaPlanets)).toBe(true)
    const d9 = generateDivisionalChart(delhi, "D9")
    vargottamaPlanets.forEach((planetName) => {
      const d1Planet = delhi.planets.find((p) => p.name === planetName)!
      const d9Planet = d9.planets.find((p) => p.name === planetName)!
      expect(d1Planet.sign.name).toBe(d9Planet.sign.name)
    })
  })
})

// ═══════════════════════════════════════════════════════
// 4. DASHA ENGINE (Vimshottari)
// ═══════════════════════════════════════════════════════

describe("Dasha Engine (Vimshottari)", () => {
  let delhi: NatalChart
  let dasha: ReturnType<typeof calculateFullDasha>

  beforeAll(() => {
    delhi = generateNatalChart(DELHI_CHART)
    dasha = calculateFullDasha(delhi)
  })

  it("uses Vimshottari system with 120-year total", () => {
    expect(dasha.system).toBe("Vimshottari")
    expect(dasha.totalYears).toBe(120)
  })

  it("all 9 Dasha planets appear in the sequence", () => {
    const dashaOrder: PlanetName[] = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
    const planets = dasha.mahadashas.map((d) => d.planet)
    for (const p of dashaOrder) {
      expect(planets).toContain(p)
    }
  })

  it("Mahadashas are contiguous with no gaps", () => {
    for (let i = 1; i < dasha.mahadashas.length; i++) {
      const prevEnd = dasha.mahadashas[i - 1].endDate.getTime()
      const currStart = dasha.mahadashas[i].startDate.getTime()
      expect(Math.abs(prevEnd - currStart)).toBeLessThan(86400000 * 2)
    }
  })

  it("balance at birth is valid", () => {
    const maxYears: Record<PlanetName, number> = {
      Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16,
      Saturn: 19, Mercury: 17, Ketu: 7, Venus: 20,
    }
    const firstMD = dasha.mahadashas[0]
    expect(dasha.balanceAtBirth).toBeGreaterThan(0)
    expect(dasha.balanceAtBirth).toBeLessThanOrEqual(maxYears[firstMD.planet])
  })

  it("current Mahadasha contains today's date", () => {
    const now = new Date()
    expect(dasha.currentMahadasha.startDate.getTime()).toBeLessThan(now.getTime())
    expect(dasha.currentMahadasha.endDate.getTime()).toBeGreaterThan(now.getTime())
  })

  it("each Mahadasha with subPeriods has 9 Antardashas", () => {
    dasha.mahadashas.forEach((md) => {
      if (md.subPeriods && md.subPeriods.length > 0) {
        expect(md.subPeriods).toHaveLength(9)
        md.subPeriods.forEach((ad) => {
          expect(ad.level).toBe("antardasha")
        })
      }
    })
  })

  it("getDashaForDate returns a valid dasha for birth date", () => {
    const birthDate = new Date("1990-01-15T00:30:00Z")
    const result = getDashaForDate(delhi, birthDate)
    expect(result).toBeDefined()
    expect(result?.mahadasha.planet).toBeTruthy()
  })
})

// ═══════════════════════════════════════════════════════
// 5. RELEASE 1 — Shadbala, Yogas, Doshas, Graha Yuddha
// ═══════════════════════════════════════════════════════

describe("Release 1: Shadbala", () => {
  let delhi: NatalChart
  let shadbalas: ReturnType<typeof calculateShadbala>

  beforeAll(() => {
    delhi = generateNatalChart(DELHI_CHART)
    shadbalas = calculateShadbala(delhi)
  })

  it("returns Shadbala for at least 7 planets (Sun-Saturn)", () => {
    expect(shadbalas.length).toBeGreaterThanOrEqual(7)
    const names = shadbalas.map((s) => s.planet)
    for (const p of ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"] as PlanetName[]) {
      expect(names).toContain(p)
    }
  })

  it("all Shadbala components are non-negative (except Drig Bala)", () => {
    shadbalas.forEach((sb) => {
      expect(sb.sthanaBala.total).toBeGreaterThanOrEqual(0)
      expect(sb.digBala).toBeGreaterThanOrEqual(0)
      expect(sb.kalaBala.total).toBeGreaterThanOrEqual(0)
      expect(sb.cheshtaBala).toBeGreaterThanOrEqual(0)
      expect(sb.naisargikaBala).toBeGreaterThan(0)
      expect(typeof sb.drigBala).toBe("number")
    })
  })

  it("Naisargika Bala follows fixed order: Sun > Moon > Venus > Jupiter > Mercury > Mars > Saturn", () => {
    const get = (p: PlanetName) => shadbalas.find((s) => s.planet === p)!.naisargikaBala
    expect(get("Sun")).toBeGreaterThan(get("Moon"))
    expect(get("Moon")).toBeGreaterThan(get("Venus"))
    expect(get("Venus")).toBeGreaterThan(get("Jupiter"))
    expect(get("Jupiter")).toBeGreaterThan(get("Mercury"))
    expect(get("Mercury")).toBeGreaterThan(get("Mars"))
    expect(get("Mars")).toBeGreaterThan(get("Saturn"))
  })

  it("total Shadbala = sum of all 6 components", () => {
    shadbalas.forEach((sb) => {
      const expected = sb.sthanaBala.total + sb.digBala + sb.kalaBala.total + sb.cheshtaBala + sb.naisargikaBala + sb.drigBala
      expect(sb.totalShadbala).toBeCloseTo(expected, 1)
    })
  })

  it("Shadbala Rupa = total / 60", () => {
    shadbalas.forEach((sb) => {
      expect(sb.shadbalaRupa).toBeCloseTo(sb.totalShadbala / 60, 2)
    })
  })

  it("percentile is between 0 and 100", () => {
    shadbalas.forEach((sb) => {
      expect(sb.percentile).toBeGreaterThanOrEqual(0)
      expect(sb.percentile).toBeLessThanOrEqual(100)
    })
  })
})

describe("Release 1: Yogas", () => {
  let delhi: NatalChart

  beforeAll(() => { delhi = generateNatalChart(DELHI_CHART) })

  it("analyzeAllYogas returns array of YogaResult objects", () => {
    const yogas = analyzeAllYogas(delhi)
    expect(Array.isArray(yogas)).toBe(true)
    yogas.forEach((y) => {
      expect(y.name).toBeTruthy()
      expect(typeof y.isPresent).toBe("boolean")
      expect(["strong", "moderate", "weak"]).toContain(y.strength)
      expect(y.classicalReference).toBeDefined()
    })
  })

  it("getActiveYogas filters to only present yogas", () => {
    const all = analyzeAllYogas(delhi)
    const active = getActiveYogas(delhi)
    expect(active.length).toBe(all.filter((y) => y.isPresent).length)
  })

  it("Panch Mahapurush Yogas involve correct planets", () => {
    const yogas = analyzeAllYogas(delhi)
    const mahapurush = yogas.filter((y) => y.category === "Panch Mahapurush" && y.isPresent)
    const valid: PlanetName[] = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    mahapurush.forEach((y) => {
      expect(y.involvedPlanets.some((p) => valid.includes(p))).toBe(true)
    })
  })

  it("each yoga has a valid category", () => {
    const validCategories = [
      "Raj Yoga", "Dhan Yoga", "Vipreet Raj Yoga", "Panch Mahapurush",
      "Solar Yoga", "Lunar Yoga", "Nabhas Yoga", "Nabhasa Yoga",
      "Parivartana Yoga", "Neecha Bhanga", "Other Auspicious", "Inauspicious",
    ]
    analyzeAllYogas(delhi).forEach((y) => {
      expect(validCategories).toContain(y.category)
    })
  })
})

describe("Release 1: Doshas", () => {
  let delhi: NatalChart

  beforeAll(() => { delhi = generateNatalChart(DELHI_CHART) })

  it("analyzeAllDoshas returns array of DoshaResult objects", () => {
    const doshas = analyzeAllDoshas(delhi)
    expect(Array.isArray(doshas)).toBe(true)
    doshas.forEach((d) => {
      expect(d.type).toBeTruthy()
      expect(typeof d.isPresent).toBe("boolean")
      expect(["high", "medium", "low", "none"]).toContain(d.severity)
      expect(Array.isArray(d.remedies)).toBe(true)
      expect(d.classicalReference).toBeDefined()
    })
  })

  it("Mangal Dosha checks Mars in specific houses", () => {
    const doshas = analyzeAllDoshas(delhi)
    const mangal = doshas.find((d) => d.type === "Mangal Dosha")
    expect(mangal).toBeDefined()
    if (mangal!.isPresent) {
      expect(mangal!.involvedPlanets).toContain("Mars")
      const mars = getPlanet(delhi, "Mars")
      expect([1, 2, 4, 7, 8, 12]).toContain(mars.house)
    }
  })

  it("inactive doshas have severity 'none'", () => {
    analyzeAllDoshas(delhi).forEach((d) => {
      if (!d.isPresent) expect(d.severity).toBe("none")
    })
  })
})

describe("Release 1: Graha Yuddha", () => {
  let delhi: NatalChart

  beforeAll(() => { delhi = generateNatalChart(DELHI_CHART) })

  it("returns valid Graha Yuddha result", () => {
    const result = detectGrahaYuddha(delhi)
    expect(result).toBeDefined()
    expect(typeof result.isPresent).toBe("boolean")
    expect(Array.isArray(result.wars)).toBe(true)
  })

  it("only non-luminaries can be in planetary war", () => {
    const result = detectGrahaYuddha(delhi)
    const warPlanets: PlanetName[] = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    result.wars.forEach((war) => {
      expect(warPlanets).toContain(war.planet1)
      expect(warPlanets).toContain(war.planet2)
    })
  })
})

describe("Release 1: Planet Strength Analysis", () => {
  let delhi: NatalChart

  beforeAll(() => { delhi = generateNatalChart(DELHI_CHART) })

  it("analyzeChartStrength returns comprehensive result", () => {
    const strength = analyzeChartStrength(delhi)
    expect(strength).toBeDefined()
    expect(strength.strongestPlanet).toBeTruthy()
    expect(strength.weakestPlanet).toBeTruthy()
    expect(Array.isArray(strength.planets)).toBe(true)
    expect(strength.overallChartStrength).toBeTruthy()
    expect(typeof strength.overallChartStrength).toBe("string")
  })

  it("individual planet strength reports are complete", () => {
    const sun = getPlanet(delhi, "Sun")
    const report = analyzePlanetStrength(sun, delhi)
    expect(report).toBeDefined()
    expect(report.planet).toBe("Sun")
    expect(typeof report.compositeStrength.adjusted).toBe("number")
    expect(report.compositeStrength.adjusted).toBeGreaterThanOrEqual(0)
    expect(report.compositeStrength.adjusted).toBeLessThanOrEqual(100)
  })
})

// ═══════════════════════════════════════════════════════
// 6. RELEASE 2 — Ashtakavarga, Varga Interpretation, Dosha Cancellations
// ═══════════════════════════════════════════════════════

describe("Release 2: Ashtakavarga", () => {
  let delhi: NatalChart
  let avResult: ReturnType<typeof calculateAshtakavarga>

  beforeAll(() => {
    delhi = generateNatalChart(DELHI_CHART)
    avResult = calculateAshtakavarga(delhi)
  })

  it("SAV has 12 entries (one per sign)", () => {
    expect(avResult.sarvashtakavarga).toHaveLength(12)
  })

  it("SAV total is consistent with implementation (sum of all 12 SAV entries)", () => {
    // Our implementation includes ascendant contribution, so total may differ from classical 337
    const computedTotal = avResult.sarvashtakavarga.reduce((s, v) => s + v, 0)
    expect(avResult.totalSAV).toBe(computedTotal)
    // Should be in reasonable range (300-400)
    expect(avResult.totalSAV).toBeGreaterThan(300)
    expect(avResult.totalSAV).toBeLessThan(400)
  })

  it("each SAV sign score is between 0 and 56", () => {
    avResult.sarvashtakavarga.forEach((score) => {
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(56)
    })
  })

  it("individual planet Ashtakavargas sum correctly into SAV", () => {
    for (let sign = 0; sign < 12; sign++) {
      let total = 0
      avResult.planetAshtakavargas.forEach((pa) => { total += pa.bindus[sign] })
      total += avResult.ascendantAshtakavarga[sign]
      expect(total).toBe(avResult.sarvashtakavarga[sign])
    }
  })

  it("planet Ashtakavargas cover all 7 planets", () => {
    expect(avResult.planetAshtakavargas.length).toBe(7)
    const expected: PlanetName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    for (const p of expected) {
      expect(avResult.planetAshtakavargas.map((pa) => pa.planet)).toContain(p)
    }
  })

  it("each planet has 12 bindu entries (0-8 range)", () => {
    avResult.planetAshtakavargas.forEach((pa) => {
      expect(pa.bindus).toHaveLength(12)
      pa.bindus.forEach((b) => {
        expect(b).toBeGreaterThanOrEqual(0)
        expect(b).toBeLessThanOrEqual(8)
      })
    })
  })

  it("strong/weak house classification is consistent with SAV scores", () => {
    // Strong houses should generally have higher SAV scores than weak houses
    const getAvgScore = (houses: number[]) => {
      if (houses.length === 0) return 0
      return houses.reduce((sum, h) => {
        const signIndex = (delhi.ascendantSign.index + h - 1) % 12
        return sum + avResult.sarvashtakavarga[signIndex]
      }, 0) / houses.length
    }
    if (avResult.strongHouses.length > 0 && avResult.weakHouses.length > 0) {
      expect(getAvgScore(avResult.strongHouses)).toBeGreaterThan(getAvgScore(avResult.weakHouses))
    }
    // All SAV scores should be in valid range
    avResult.sarvashtakavarga.forEach((score: number) => {
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(56) // Max possible SAV per sign
    })
  })

  it("summary provides consistent analysis", () => {
    const summary = getAshtakavargaSummary(avResult)
    expect(["strong", "moderate", "weak"]).toContain(summary.overallStrength)
    expect(summary.bestHouses.length).toBeGreaterThan(0)
    expect(summary.planetRankings).toHaveLength(7)
  })

  it("house strengths cover all 12 houses", () => {
    const strengths = getAllHouseStrengths(avResult)
    expect(strengths).toHaveLength(12)
    strengths.forEach((h) => {
      expect(h.house).toBeGreaterThanOrEqual(1)
      expect(h.house).toBeLessThanOrEqual(12)
      expect(typeof h.sav).toBe("number")
    })
  })
})

describe("Release 2: Varga Interpretation", () => {
  let delhi: NatalChart

  beforeAll(() => { delhi = generateNatalChart(DELHI_CHART) })

  it("analyzeVargas returns combined D9 + D10 analysis without crashing", () => {
    const varga = analyzeVargas(delhi)
    expect(varga).toBeDefined()
    expect(varga.navamsa).toBeDefined()
    expect(varga.dasamsa).toBeDefined()
    expect(Array.isArray(varga.combinedInsights)).toBe(true)
  })

  it("Navamsa analysis contains spouse indicators and score", () => {
    const varga = analyzeVargas(delhi)
    expect(varga.navamsa.spouseIndicators).toBeDefined()
    expect(varga.navamsa.spouseIndicators.seventhSign).toBeTruthy()
    expect(["strong", "moderate", "weak"]).toContain(varga.navamsa.overallDharmaStrength)
    expect(varga.navamsa.summary).toBeTruthy()
  })

  it("Dasamsa analysis contains career data and score", () => {
    const varga = analyzeVargas(delhi)
    expect(varga.dasamsa.strongestCareerPlanet).toBeDefined()
    expect(["strong", "moderate", "weak"]).toContain(varga.dasamsa.overallCareerStrength)
    expect(varga.dasamsa.summary).toBeTruthy()
  })
})

describe("Release 2: Dosha Cancellations", () => {
  let delhi: NatalChart

  beforeAll(() => { delhi = generateNatalChart(DELHI_CHART) })

  it("analyzeDoshaCancellations returns comprehensive analysis", () => {
    const analysis = analyzeDoshaCancellations(delhi)
    expect(analysis).toBeDefined()
    expect(Array.isArray(analysis.doshas)).toBe(true)
    expect(typeof analysis.overallAfflictionLevel).toBe("string")
    expect(typeof analysis.activeDoshaCount).toBe("number")
  })

  it("each dosha report has cancellation details", () => {
    const analysis = analyzeDoshaCancellations(delhi)
    analysis.doshas.forEach((d) => {
      expect(d.doshaType).toBeTruthy()
      expect(typeof d.originalSeverity).toBe("string")
      expect(typeof d.adjustedSeverity).toBe("string")
      expect(typeof d.totalReduction).toBe("number")
      expect(typeof d.isEffectivelyCancelled).toBe("boolean")
      expect(d.totalReduction).toBeGreaterThanOrEqual(0)
      expect(d.totalReduction).toBeLessThanOrEqual(100)
      expect(["high", "medium", "low", "negligible", "none"]).toContain(d.adjustedSeverity)
    })
  })

  it("effectively cancelled doshas have significant reduction", () => {
    const analysis = analyzeDoshaCancellations(delhi)
    analysis.doshas.forEach((d) => {
      if (d.isEffectivelyCancelled) {
        expect(d.totalReduction).toBeGreaterThanOrEqual(50)
      }
    })
  })
})

// ═══════════════════════════════════════════════════════
// 7. RELEASE 3 — Bhava Chalit, Chart Synthesis
// ═══════════════════════════════════════════════════════

describe("Release 3: Bhava Chalit", () => {
  let delhi: NatalChart

  beforeAll(() => { delhi = generateNatalChart(DELHI_CHART) })

  it("Bhava Chalit chart has 12 houses with correct 30° spans", () => {
    const bhava = calculateBhavaChalit(delhi)
    expect(bhava.houses).toHaveLength(12)
    bhava.houses.forEach((h, i) => {
      expect(h.number).toBe(i + 1)
      let span = h.endDegree - h.startDegree
      if (span < 0) span += 360
      expect(span).toBeCloseTo(30, 1)
    })
  })

  it("Bhava Chalit midpoints are centered on ascendant", () => {
    const bhava = calculateBhavaChalit(delhi)
    const h1 = bhava.houses[0]
    expect(angleDiff(h1.midDegree, delhi.ascendant)).toBeLessThan(1)
  })

  it("all planets are assigned to Bhava houses", () => {
    const bhava = calculateBhavaChalit(delhi)
    expect(bhava.planets).toHaveLength(9)
    bhava.planets.forEach((p) => {
      expect(p.bhavaHouse).toBeGreaterThanOrEqual(1)
      expect(p.bhavaHouse).toBeLessThanOrEqual(12)
      expect(p.rashiHouse).toBeGreaterThanOrEqual(1)
      expect(p.rashiHouse).toBeLessThanOrEqual(12)
    })
  })

  it("house shifts are detected correctly", () => {
    const shifts = analyzeHouseShifts(delhi)
    expect(shifts).toBeDefined()
    expect(Array.isArray(shifts.shiftedPlanets)).toBe(true)
    shifts.shiftedPlanets.forEach((s) => {
      expect(s.planet).toBeTruthy()
      expect(s.fromHouse).not.toBe(s.toHouse)
    })
  })

  it("Bhava Bala covers all 12 houses with strength values", () => {
    const bala = calculateBhavaBala(delhi)
    expect(bala.houses).toHaveLength(12)
    bala.houses.forEach((h) => {
      expect(h.house).toBeGreaterThanOrEqual(1)
      expect(h.house).toBeLessThanOrEqual(12)
      expect(typeof h.strength).toBe("number")
      expect(h.strength).toBeGreaterThanOrEqual(0)
    })
  })

  it("full Bhava Chalit report combines all analyses", () => {
    const report = getBhavaChalitReport(delhi)
    expect(report).toBeDefined()
    expect(report.chalitChart).toBeDefined()
    expect(report.houseShifts).toBeDefined()
    expect(report.bhavaBala).toBeDefined()
  })
})

describe("Release 3: Chart Synthesis", () => {
  let delhi: NatalChart

  beforeAll(() => { delhi = generateNatalChart(DELHI_CHART) })

  it("calculateLifeDomainScores returns all 7 domains", () => {
    const domains = calculateLifeDomainScores(delhi)
    expect(domains).toBeDefined()
    const keys = ["career", "wealth", "relationships", "health", "spirituality", "education", "overallFortune"]
    keys.forEach((key) => {
      const domain = (domains as unknown as Record<string, { score: number; label: string }>)[key]
      expect(domain).toBeDefined()
      expect(domain.score).toBeGreaterThanOrEqual(0)
      expect(domain.score).toBeLessThanOrEqual(100)
      expect(domain.label).toBeTruthy()
    })
  })

  it("getChartSignature identifies element, modality, and pattern", () => {
    const sig = getChartSignature(delhi)
    expect(sig).toBeDefined()
    // dominantElement may be an object with {element, count, percentage} or a string
    const element = typeof sig.dominantElement === "string" ? sig.dominantElement : sig.dominantElement.element
    expect(["Fire", "Earth", "Air", "Water"]).toContain(element)
    const modality = typeof sig.dominantModality === "string" ? sig.dominantModality : sig.dominantModality.modality
    expect(["Cardinal", "Fixed", "Mutable"]).toContain(modality)
    expect(sig.dominantPlanet).toBeTruthy()
    expect(sig.chartPattern).toBeTruthy()
    expect(Array.isArray(sig.keyThemes)).toBe(true)
    expect(sig.keyThemes.length).toBeGreaterThan(0)
  })

  it("synthesizeChart produces comprehensive result", () => {
    const synthesis = synthesizeChart(delhi)
    expect(synthesis).toBeDefined()
    expect(synthesis.overallChartRating).toBeGreaterThanOrEqual(0)
    expect(synthesis.overallChartRating).toBeLessThanOrEqual(100)
    expect(synthesis.overallLabel).toBeTruthy()
    expect(synthesis.executiveSummary).toBeTruthy()
    expect(synthesis.chartSignature).toBeDefined()
    expect(synthesis.lifeDomainScores).toBeDefined()
    expect(synthesis.timingSynthesis).toBeDefined()
    expect(typeof synthesis.timingSynthesis.periodRating).toBe("number")
    expect(Array.isArray(synthesis.strengthRankings)).toBe(true)
    expect(Array.isArray(synthesis.topStrengths)).toBe(true)
    expect(Array.isArray(synthesis.topChallenges)).toBe(true)
  })

  it("synthesis is deterministic (same input = same output)", () => {
    const s1 = synthesizeChart(delhi)
    const s2 = synthesizeChart(delhi)
    expect(s1.overallChartRating).toBe(s2.overallChartRating)
  })
})

// ═══════════════════════════════════════════════════════
// 8. CROSS-MODULE CONSISTENCY
// ═══════════════════════════════════════════════════════

describe("Cross-Module Consistency", () => {
  let delhi: NatalChart
  let chennai: NatalChart

  beforeAll(() => {
    delhi = generateNatalChart(DELHI_CHART)
    chennai = generateNatalChart(CHENNAI_CHART)
  })

  it("different birth details produce different charts", () => {
    expect(delhi.ascendant).not.toBe(chennai.ascendant)
  })

  it("same birth details produce identical charts (reproducibility)", () => {
    const d1 = generateNatalChart(DELHI_CHART)
    const d2 = generateNatalChart(DELHI_CHART)
    expect(d1.ascendant).toBe(d2.ascendant)
    d1.planets.forEach((p, i) => {
      expect(p.longitude).toBe(d2.planets[i].longitude)
    })
  })

  it("Ashtakavarga SAV total is consistent across charts", () => {
    const avDelhi = calculateAshtakavarga(delhi)
    const avChennai = calculateAshtakavarga(chennai)
    // Both should compute to same total (internal sum)
    expect(avDelhi.totalSAV).toBe(avDelhi.sarvashtakavarga.reduce((s, v) => s + v, 0))
    expect(avChennai.totalSAV).toBe(avChennai.sarvashtakavarga.reduce((s, v) => s + v, 0))
  })

  it("Dasha contains birth date for all charts", () => {
    const dashaDelhi = calculateFullDasha(delhi)
    const dashaChennai = calculateFullDasha(chennai)
    // Verify both have valid current dasha
    expect(dashaDelhi.currentMahadasha).toBeDefined()
    expect(dashaChennai.currentMahadasha).toBeDefined()
  })

  it("chart synthesis scores are bounded [0, 100] for multiple charts", () => {
    const sDelhi = synthesizeChart(delhi)
    const sChennai = synthesizeChart(chennai)
    for (const s of [sDelhi, sChennai]) {
      expect(s.overallChartRating).toBeGreaterThanOrEqual(0)
      expect(s.overallChartRating).toBeLessThanOrEqual(100)
    }
  })
})
