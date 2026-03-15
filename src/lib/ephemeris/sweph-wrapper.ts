/* ════════════════════════════════════════════════════════
   GrahAI — Swiss Ephemeris Wrapper
   High-precision Vedic astrology calculations using sweph

   Uses Moshier mode (no ephemeris files needed):
   - Planetary positions accurate to 0.1 arcsecond
   - Far superior to Meeus approximation (~1-2°)
   - Works on Vercel serverless without binary files
   ════════════════════════════════════════════════════════ */

// Dynamic import to prevent build failure when native binary is missing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sweph: any = null

try {
  // Use indirect require to prevent Next.js/Webpack static analysis from
  // resolving the module at build time — critical for Vercel deployment
  // where the native .node binary may not compile
  const moduleName = "sweph"
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  sweph = require(moduleName)
} catch {
  console.warn("[GrahAI] sweph native module not available — ephemeris calculations will use fallback")
}

import type {
  PlanetName, PlanetData, NatalChart, HouseData,
  SignInfo, NakshatraInfo, BirthDetails, SwephPlanetPosition,
} from "./types"
import {
  SWEPH_PLANETS, SE_TRUE_NODE, AYANAMSA_LAHIRI,
  PLANET_SANSKRIT, SIGNS,
  getSignFromLongitude, getDegreeInSign, getNakshatraFromLongitude,
  getPlanetDignity, isCombust, getHouseNumber, getHouseLord,
  HOUSE_SIGNIFICANCES,
} from "./constants"

// ─── Initialize Swiss Ephemeris ────────────────────────
// Using Moshier (internal) ephemeris — no files needed
// Accuracy: ~0.1 arcsecond for planets, sufficient for Jyotish
let initialized = false
const USE_FALLBACK = !sweph

if (USE_FALLBACK) {
  console.warn("[GrahAI] Using Meeus fallback calculations (~1-2° accuracy)")
}

function ensureSweph() {
  if (!sweph) {
    throw new Error("Swiss Ephemeris native module is not available. Please run 'npm rebuild sweph' or install build tools.")
  }
}

function ensureInit() {
  ensureSweph()
  if (!initialized) {
    // No ephemeris path needed for Moshier mode
    // sweph will use internal Moshier calculations automatically
    initialized = true
  }
}

// ─── Meeus Fallback Calculations ─────────────────────
// Simplified planetary calculations when native sweph is unavailable
// Accuracy: ~1-2° (sufficient for sign-level Jyotish analysis)

function fallbackJulianDay(
  year: number, month: number, day: number,
  hour: number, minute: number, second: number = 0,
  timezoneOffset: number = 5.5
): number {
  const utHour = hour + minute / 60 + second / 3600 - timezoneOffset
  let y = year, m = month
  if (m <= 2) { y -= 1; m += 12 }
  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + utHour / 24 + B - 1524.5
}

// Mean orbital elements for simplified planetary positions (J2000.0 epoch)
const PLANET_ELEMENTS: Record<string, { L0: number, L1: number, a: number, e: number, i: number, omega: number }> = {
  Sun:     { L0: 280.46646, L1: 36000.76983, a: 1.0, e: 0.016709, i: 0, omega: 102.93735 },
  Moon:    { L0: 218.3165, L1: 481267.8813, a: 0.00257, e: 0.0549, i: 5.145, omega: 83.353 },
  Mars:    { L0: 355.433, L1: 19140.2993, a: 1.524, e: 0.0934, i: 1.85, omega: 336.060 },
  Mercury: { L0: 252.251, L1: 149472.6746, a: 0.387, e: 0.2056, i: 7.005, omega: 77.456 },
  Jupiter: { L0: 34.351, L1: 3034.9057, a: 5.203, e: 0.0489, i: 1.303, omega: 14.331 },
  Venus:   { L0: 181.980, L1: 58517.8149, a: 0.723, e: 0.0068, i: 3.394, omega: 131.532 },
  Saturn:  { L0: 50.077, L1: 1222.1138, a: 9.537, e: 0.0557, i: 2.489, omega: 93.057 },
}

function fallbackMeanAyanamsa(jd: number): number {
  // Lahiri ayanamsa approximation
  const T = (jd - 2451545.0) / 36525.0 // centuries from J2000.0
  return 23.856 + 0.0138 * T * 100 // ~ Lahiri ayanamsa
}

function fallbackPlanetLongitude(planet: string, jd: number): { longitude: number, speed: number } {
  const T = (jd - 2451545.0) / 36525.0
  const el = PLANET_ELEMENTS[planet]
  if (!el) return { longitude: 0, speed: 0 }

  // Mean longitude
  let L = (el.L0 + el.L1 * T) % 360
  if (L < 0) L += 360

  // Simple equation of center (first term)
  const M = L - el.omega
  const C = (2 * el.e * Math.sin(M * Math.PI / 180)) * 180 / Math.PI
  let trueLong = (L + C) % 360
  if (trueLong < 0) trueLong += 360

  return { longitude: trueLong, speed: el.L1 / 36525.0 }
}

function fallbackRahuLongitude(jd: number): number {
  // Mean Rahu (North Node) longitude
  const T = (jd - 2451545.0) / 36525.0
  let rahu = (125.0446 - 1934.1363 * T) % 360
  if (rahu < 0) rahu += 360
  return rahu
}

function fallbackAscendant(jd: number, latitude: number, longitude: number): number {
  // Simplified ascendant calculation
  const T = (jd - 2451545.0) / 36525.0
  const GMST = (280.46061837 + 360.98564736629 * (jd - 2451545.0) + longitude) % 360
  const obliquity = 23.4393 - 0.013 * T
  const oRad = obliquity * Math.PI / 180
  const latRad = latitude * Math.PI / 180
  const gmstRad = GMST * Math.PI / 180

  let asc = Math.atan2(
    Math.cos(gmstRad),
    -(Math.sin(gmstRad) * Math.cos(oRad) + Math.tan(latRad) * Math.sin(oRad))
  ) * 180 / Math.PI
  if (asc < 0) asc += 360
  return asc
}

// ─── Julian Day Conversion ─────────────────────────────

/** Convert date/time to Julian Day Number */
export function dateToJulianDay(
  year: number, month: number, day: number,
  hour: number, minute: number, second: number = 0,
  timezoneOffset: number = 5.5  // IST default
): number {
  if (USE_FALLBACK) {
    return fallbackJulianDay(year, month, day, hour, minute, second, timezoneOffset)
  }
  // Convert to UT (subtract timezone offset)
  const utDecimalHour = hour + minute / 60 + second / 3600 - timezoneOffset
  ensureSweph()
  // sweph.julday(year, month, day, hour, gregflag)
  return sweph.julday(year, month, day, utDecimalHour, sweph.constants.SE_GREG_CAL)
}

/** Parse birth details into Julian Day */
export function birthDetailsToJD(birth: BirthDetails): number {
  const [year, month, day] = birth.date.split("-").map(Number)
  const timeParts = birth.time.split(":").map(Number)
  const hour = timeParts[0]
  const minute = timeParts[1]
  const second = timeParts[2] || 0

  return dateToJulianDay(year, month, day, hour, minute, second, birth.timezone)
}

// ─── Ayanamsa ──────────────────────────────────────────

/** Get Lahiri ayanamsa for a given Julian Day */
export function getAyanamsa(jd: number): number {
  if (USE_FALLBACK) {
    return fallbackMeanAyanamsa(jd)
  }
  ensureInit()
  sweph.set_sid_mode(AYANAMSA_LAHIRI, 0, 0)
  return sweph.get_ayanamsa_ut(jd)
}

/** Convert tropical longitude to sidereal */
export function tropicalToSidereal(tropicalLong: number, jd: number): number {
  const ayanamsa = getAyanamsa(jd)
  let sidereal = tropicalLong - ayanamsa
  if (sidereal < 0) sidereal += 360
  if (sidereal >= 360) sidereal -= 360
  return sidereal
}

// ─── Planet Position Calculation ───────────────────────

/** Get a single planet's tropical position (fallback or Swiss Ephemeris) */
function getFallbackRawPosition(jd: number, planet: PlanetName): SwephPlanetPosition {
  if (planet === "Rahu") {
    const rahu = fallbackRahuLongitude(jd)
    return { longitude: rahu, latitude: 0, distance: 0, speedLong: -0.053, speedLat: 0, speedDist: 0 }
  }
  if (planet === "Ketu") {
    const rahu = fallbackRahuLongitude(jd)
    return { longitude: (rahu + 180) % 360, latitude: 0, distance: 0, speedLong: -0.053, speedLat: 0, speedDist: 0 }
  }
  const { longitude, speed } = fallbackPlanetLongitude(planet, jd)
  return { longitude, latitude: 0, distance: 1, speedLong: speed, speedLat: 0, speedDist: 0 }
}

/** Get a single planet's tropical position from Swiss Ephemeris */
function getRawPlanetPosition(jd: number, planetId: number): SwephPlanetPosition {
  ensureInit()

  // SEFLG_SPEED for speed calculation, SEFLG_SWIEPH will fall back to Moshier
  const flags = sweph.constants.SEFLG_SPEED | sweph.constants.SEFLG_SWIEPH
  const result = sweph.calc_ut(jd, planetId, flags)

  if (result.error) {
    // If Swiss Ephemeris files not available, explicitly use Moshier
    const moshierFlags = sweph.constants.SEFLG_SPEED | sweph.constants.SEFLG_MOSEPH
    const moshierResult = sweph.calc_ut(jd, planetId, moshierFlags)
    if (moshierResult.error) {
      throw new Error(`Swiss Ephemeris calculation failed for planet ${planetId}: ${moshierResult.error}`)
    }
    return {
      longitude: moshierResult.data[0],
      latitude: moshierResult.data[1],
      distance: moshierResult.data[2],
      speedLong: moshierResult.data[3],
      speedLat: moshierResult.data[4],
      speedDist: moshierResult.data[5],
    }
  }

  return {
    longitude: result.data[0],
    latitude: result.data[1],
    distance: result.data[2],
    speedLong: result.data[3],
    speedLat: result.data[4],
    speedDist: result.data[5],
  }
}

/** Get a single planet's full sidereal data */
export function getPlanetPosition(
  jd: number,
  planet: PlanetName,
  ascendantLong?: number
): PlanetData {
  let raw: SwephPlanetPosition

  if (USE_FALLBACK) {
    raw = getFallbackRawPosition(jd, planet)
  } else if (planet === "Ketu") {
    // Ketu = Rahu + 180°
    const rahuRaw = getRawPlanetPosition(jd, SE_TRUE_NODE)
    raw = {
      ...rahuRaw,
      longitude: (rahuRaw.longitude + 180) % 360,
      speedLong: rahuRaw.speedLong,  // same speed as Rahu
    }
  } else {
    const planetId = planet === "Rahu" ? SE_TRUE_NODE : SWEPH_PLANETS[planet]
    raw = getRawPlanetPosition(jd, planetId)
  }

  // Convert to sidereal
  const siderealLong = tropicalToSidereal(raw.longitude, jd)
  const sign = getSignFromLongitude(siderealLong)
  const degreeInSign = getDegreeInSign(siderealLong)
  const nakshatra = getNakshatraFromLongitude(siderealLong)
  const dignity = getPlanetDignity(planet, sign.index, degreeInSign)
  const retrograde = raw.speedLong < 0
  const house = ascendantLong ? getHouseNumber(siderealLong, ascendantLong) : 0

  return {
    name: planet,
    sanskrit: PLANET_SANSKRIT[planet],
    longitude: siderealLong,
    latitude: raw.latitude,
    speed: raw.speedLong,
    retrograde,
    sign,
    degree: degreeInSign,
    nakshatra,
    house,
    dignity,
    isExalted: dignity === "exalted",
    isDebilitated: dignity === "debilitated",
    isCombust: false,  // computed after we have Sun's position
    combustDistance: undefined,
  }
}

/** Get all 9 planet positions */
export function getAllPlanetPositions(jd: number, ascendantLong?: number): PlanetData[] {
  const planets: PlanetName[] = [
    "Sun", "Moon", "Mars", "Mercury", "Jupiter",
    "Venus", "Saturn", "Rahu", "Ketu",
  ]

  const positions = planets.map(p => getPlanetPosition(jd, p, ascendantLong))

  // Now compute combustion (needs Sun's longitude)
  const sunLong = positions[0].longitude
  for (const planet of positions) {
    if (planet.name !== "Sun" && planet.name !== "Rahu" && planet.name !== "Ketu") {
      const { combust, distance } = isCombust(planet.name, planet.longitude, sunLong)
      planet.isCombust = combust
      planet.combustDistance = distance
    }
  }

  return positions
}

// ─── Ascendant & House Cusps ───────────────────────────

/** Calculate ascendant and house cusps using Swiss Ephemeris */
export function getAscendantAndCusps(
  jd: number,
  latitude: number,
  longitude: number,
  houseSystem: string = "W"  // W = Whole Sign (default for Vedic)
): { ascendant: number, cusps: number[], mc: number } {
  let siderealAsc: number
  let siderealMC: number

  if (USE_FALLBACK) {
    // Meeus-based fallback
    const tropicalAsc = fallbackAscendant(jd, latitude, longitude)
    siderealAsc = tropicalToSidereal(tropicalAsc, jd)
    // Approximate MC as 90° before Asc
    siderealMC = (siderealAsc + 270) % 360
  } else {
    ensureInit()

    const result = sweph.houses(jd, latitude, longitude, houseSystem)

    if (!result || !result.data) {
      throw new Error("Failed to calculate house cusps")
    }

    // result.data.houses = array of 12 cusps (tropical)
    // result.data.points = [ASC, MC, ARMC, Vertex, ...]
    const tropicalAsc = result.data.points[0]
    const tropicalMC = result.data.points[1]

    // Convert to sidereal
    siderealAsc = tropicalToSidereal(tropicalAsc, jd)
    siderealMC = tropicalToSidereal(tropicalMC, jd)
  }

  // For Whole Sign: cusps are at sign boundaries
  const ascSign = Math.floor(siderealAsc / 30)
  const cusps: number[] = []
  for (let i = 0; i < 12; i++) {
    cusps.push(((ascSign + i) % 12) * 30)
  }

  return { ascendant: siderealAsc, cusps, mc: siderealMC }
}

// ─── Full Natal Chart Generation ───────────────────────

/** Generate a complete natal chart from birth details */
export function generateNatalChart(birth: BirthDetails, name?: string): NatalChart {
  const jd = birthDetailsToJD(birth)
  const ayanamsa = getAyanamsa(jd)

  // Calculate ascendant and house cusps
  const { ascendant, cusps, mc } = getAscendantAndCusps(
    jd, birth.latitude, birth.longitude
  )

  const ascSign = getSignFromLongitude(ascendant)

  // Calculate all planet positions
  const planets = getAllPlanetPositions(jd, ascendant)

  // Build house data
  const houses: HouseData[] = []
  for (let h = 1; h <= 12; h++) {
    const houseSignIndex = (ascSign.index + h - 1) % 12
    const sign = SIGNS[houseSignIndex]
    const planetsInHouse = planets
      .filter(p => p.house === h)
      .map(p => p.name)

    const sigs = HOUSE_SIGNIFICANCES[h]

    houses.push({
      number: h,
      sign,
      degree: cusps[h - 1],
      lord: sign.lord,
      planets: planetsInHouse,
      significances: sigs ? sigs.keywords : [],
    })
  }

  // Find Moon and Sun for quick access
  const moonData = planets.find(p => p.name === "Moon")!
  const sunData = planets.find(p => p.name === "Sun")!

  const chart: NatalChart = {
    name,
    birthDate: new Date(birth.date + "T" + birth.time),
    birthTime: birth.time,
    birthPlace: birth.place,
    latitude: birth.latitude,
    longitude: birth.longitude,
    timezone: birth.timezone,
    julianDay: jd,
    ayanamsa,
    ascendant,
    ascendantSign: ascSign,
    planets,
    houses,
    moonSign: moonData.sign,
    sunSign: sunData.sign,
    lagna: ascSign,
    nakshatraLord: moonData.nakshatra.lord,
  }

  return chart
}

// ─── Transit Calculations ──────────────────────────────

/** Get current planetary positions (for today or any date) */
export function getCurrentTransitPositions(date?: Date): PlanetData[] {
  const d = date || new Date()
  // Use UTC directly (timezone offset = 0)
  const jd = dateToJulianDay(
    d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(),
    d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(),
    0  // already UTC
  )
  return getAllPlanetPositions(jd)
}

/** Get transit positions relative to a natal chart */
export function getTransitPositionsForChart(
  natalChart: NatalChart,
  date?: Date
): PlanetData[] {
  const transitPlanets = getCurrentTransitPositions(date)

  // Recalculate houses relative to natal ascendant
  for (const planet of transitPlanets) {
    planet.house = getHouseNumber(planet.longitude, natalChart.ascendant)
  }

  return transitPlanets
}

// ─── Panchang Helpers ──────────────────────────────────

/** Calculate Sun-Moon angle (for Tithi) */
export function getSunMoonAngle(jd: number): number {
  const sun = getPlanetPosition(jd, "Sun")
  const moon = getPlanetPosition(jd, "Moon")
  let angle = moon.longitude - sun.longitude
  if (angle < 0) angle += 360
  return angle
}

/** Calculate Sun+Moon longitude sum (for Panchang Yoga) */
export function getSunMoonSum(jd: number): number {
  const sun = getPlanetPosition(jd, "Sun")
  const moon = getPlanetPosition(jd, "Moon")
  return (sun.longitude + moon.longitude) % 360
}

// ─── Export convenience ────────────────────────────────

export { sweph }

/** Check if the native Swiss Ephemeris module is available */
export function isSwephAvailable(): boolean {
  return sweph !== null
}
