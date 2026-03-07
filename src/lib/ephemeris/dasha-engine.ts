/* ════════════════════════════════════════════════════════
   GrahAI — Vimshottari Dasha Engine
   Complete Mahadasha → Antardasha → Pratyantar Dasha

   Based on BPHS Chapter 46 — Dasha calculations
   120-year cycle governed by Moon's nakshatra at birth
   ════════════════════════════════════════════════════════ */

import type {
  PlanetName, GrahaName, DashaPeriod, DashaAnalysis,
  NakshatraInfo, NatalChart,
} from "./types"
import {
  DASHA_YEARS, DASHA_ORDER, TOTAL_DASHA_YEARS,
  NAKSHATRA_SPAN, PLANET_SANSKRIT,
  getNakshatraFromLongitude,
} from "./constants"

// ─── Core Calculation ──────────────────────────────────

/**
 * Calculate the balance of the first Mahadasha at birth.
 *
 * The Moon's position within its nakshatra determines how much
 * of the first Mahadasha lord's period remains at birth.
 *
 * Formula: balance = (remaining° in nakshatra / 13.333°) × lord's years
 */
function calculateDashaBalance(moonLongitude: number): {
  nakshatraLord: PlanetName
  balanceYears: number
  nakshatraInfo: NakshatraInfo
  degreeInNakshatra: number
} {
  const normalized = ((moonLongitude % 360) + 360) % 360
  const nakshatraIndex = Math.floor(normalized / NAKSHATRA_SPAN)
  const degreeInNakshatra = normalized - nakshatraIndex * NAKSHATRA_SPAN
  const remainingDegrees = NAKSHATRA_SPAN - degreeInNakshatra

  const nakshatraInfo = getNakshatraFromLongitude(moonLongitude)
  const nakshatraLord = nakshatraInfo.lord
  const totalYears = DASHA_YEARS[nakshatraLord]
  const balanceYears = (remainingDegrees / NAKSHATRA_SPAN) * totalYears

  return { nakshatraLord, balanceYears, nakshatraInfo, degreeInNakshatra }
}

/**
 * Add fractional years to a date.
 */
function addYearsToDate(date: Date, years: number): Date {
  const ms = years * 365.25 * 24 * 60 * 60 * 1000
  return new Date(date.getTime() + ms)
}

// ─── Mahadasha Calculation ─────────────────────────────

/**
 * Calculate all 9 Mahadasha periods from birth.
 */
function calculateMahadashas(
  birthDate: Date,
  moonLongitude: number
): DashaPeriod[] {
  const { nakshatraLord, balanceYears } = calculateDashaBalance(moonLongitude)

  // Find starting position in DASHA_ORDER
  const startIndex = DASHA_ORDER.indexOf(nakshatraLord)

  const mahadashas: DashaPeriod[] = []
  let currentDate = new Date(birthDate)

  // First Mahadasha has partial years (balance)
  for (let cycle = 0; cycle < 2; cycle++) {
    // We generate 2 full cycles (240 years) to ensure we cover any date
    for (let i = 0; i < 9; i++) {
      const planetIndex = (startIndex + i) % 9
      const planet = DASHA_ORDER[planetIndex]
      const years = (cycle === 0 && i === 0)
        ? balanceYears
        : DASHA_YEARS[planet]

      const startDate = new Date(currentDate)
      const endDate = addYearsToDate(currentDate, years)

      mahadashas.push({
        planet,
        sanskrit: PLANET_SANSKRIT[planet],
        startDate,
        endDate,
        durationYears: years,
        isActive: false,
        level: "mahadasha",
      })

      currentDate = endDate
    }
  }

  return mahadashas
}

// ─── Antardasha (Sub-period) Calculation ───────────────

/**
 * Calculate Antardasha periods within a Mahadasha.
 *
 * Formula: Antardasha duration = (Mahadasha years × Antardasha planet years) / 120
 * Order: starts from the Mahadasha lord itself, then follows DASHA_ORDER
 */
function calculateAntardashas(mahadasha: DashaPeriod): DashaPeriod[] {
  const mahaPlanet = mahadasha.planet
  const mahaStartIndex = DASHA_ORDER.indexOf(mahaPlanet)

  const antardashas: DashaPeriod[] = []
  let currentDate = new Date(mahadasha.startDate)

  for (let i = 0; i < 9; i++) {
    const antarPlanet = DASHA_ORDER[(mahaStartIndex + i) % 9]
    const years = (mahadasha.durationYears * DASHA_YEARS[antarPlanet]) / TOTAL_DASHA_YEARS

    const startDate = new Date(currentDate)
    const endDate = addYearsToDate(currentDate, years)

    antardashas.push({
      planet: antarPlanet,
      sanskrit: PLANET_SANSKRIT[antarPlanet],
      startDate,
      endDate,
      durationYears: years,
      isActive: false,
      level: "antardasha",
    })

    currentDate = endDate
  }

  return antardashas
}

// ─── Pratyantar Dasha (Sub-sub-period) Calculation ─────

/**
 * Calculate Pratyantar Dasha periods within an Antardasha.
 *
 * Formula: Pratyantar duration = (Antardasha years × Pratyantar planet years) / 120
 * Order: starts from the Antardasha lord itself
 */
function calculatePratyantars(antardasha: DashaPeriod): DashaPeriod[] {
  const antarPlanet = antardasha.planet
  const antarStartIndex = DASHA_ORDER.indexOf(antarPlanet)

  const pratyantars: DashaPeriod[] = []
  let currentDate = new Date(antardasha.startDate)

  for (let i = 0; i < 9; i++) {
    const pratyPlanet = DASHA_ORDER[(antarStartIndex + i) % 9]
    const years = (antardasha.durationYears * DASHA_YEARS[pratyPlanet]) / TOTAL_DASHA_YEARS

    const startDate = new Date(currentDate)
    const endDate = addYearsToDate(currentDate, years)

    pratyantars.push({
      planet: pratyPlanet,
      sanskrit: PLANET_SANSKRIT[pratyPlanet],
      startDate,
      endDate,
      durationYears: years,
      isActive: false,
      level: "pratyantardasha",
    })

    currentDate = endDate
  }

  return pratyantars
}

// ─── Find Active Period ────────────────────────────────

/**
 * Find the currently active period at any level.
 */
function findActivePeriod(periods: DashaPeriod[], date: Date): DashaPeriod | undefined {
  return periods.find(p =>
    date >= p.startDate && date < p.endDate
  )
}

// ─── Complete Dasha Analysis ───────────────────────────

/**
 * Generate the complete Dasha analysis for a natal chart.
 * Returns Mahadasha + Antardasha + Pratyantar for the entire life,
 * with current active periods marked.
 */
export function calculateFullDasha(natalChart: NatalChart): DashaAnalysis {
  const moonPlanet = natalChart.planets.find(p => p.name === "Moon")!
  const moonLongitude = moonPlanet.longitude
  const birthDate = natalChart.birthDate

  const { nakshatraLord, balanceYears, nakshatraInfo, degreeInNakshatra } =
    calculateDashaBalance(moonLongitude)

  // Calculate all Mahadashas
  const mahadashas = calculateMahadashas(birthDate, moonLongitude)

  // Current date for marking active periods
  const now = new Date()

  // Find current Mahadasha
  const currentMaha = findActivePeriod(mahadashas, now)

  let currentAntar: DashaPeriod | undefined
  let currentPratyantar: DashaPeriod | undefined

  // Build sub-periods for each Mahadasha
  for (const maha of mahadashas) {
    const antardashas = calculateAntardashas(maha)
    maha.subPeriods = antardashas

    if (currentMaha && maha === currentMaha) {
      maha.isActive = true
      currentAntar = findActivePeriod(antardashas, now)

      // Build Pratyantar for each Antardasha in the current Mahadasha
      for (const antar of antardashas) {
        const pratyantars = calculatePratyantars(antar)
        antar.subPeriods = pratyantars

        if (currentAntar && antar === currentAntar) {
          antar.isActive = true
          currentPratyantar = findActivePeriod(pratyantars, now)
          if (currentPratyantar) {
            currentPratyantar.isActive = true
          }
        }
      }
    } else {
      // For non-active Mahadashas, calculate Antardashas but not Pratyantars
      // (to keep data size manageable)
      for (const antar of antardashas) {
        antar.subPeriods = [] // placeholder
      }
    }
  }

  // Ensure we have valid current periods (fallback for edge cases)
  const safeMaha = currentMaha || mahadashas[0]
  const safeAntar = currentAntar || (safeMaha.subPeriods?.[0] as DashaPeriod) || safeMaha
  const safePratyantar = currentPratyantar || (safeAntar.subPeriods?.[0] as DashaPeriod) || safeAntar

  return {
    system: "Vimshottari",
    totalYears: 120,
    birthNakshatra: nakshatraInfo,
    moonDegreeInNakshatra: degreeInNakshatra,
    balanceAtBirth: balanceYears,
    mahadashas,
    currentMahadasha: safeMaha,
    currentAntardasha: safeAntar,
    currentPratyantar: safePratyantar,
  }
}

// ─── Utility: Get Dasha for a Specific Date ────────────

/**
 * Get the active Mahadasha/Antardasha/Pratyantar for any given date.
 */
export function getDashaForDate(
  natalChart: NatalChart,
  targetDate: Date
): {
  mahadasha: DashaPeriod
  antardasha: DashaPeriod
  pratyantar: DashaPeriod
} | null {
  const moonPlanet = natalChart.planets.find(p => p.name === "Moon")!
  const mahadashas = calculateMahadashas(natalChart.birthDate, moonPlanet.longitude)

  const maha = findActivePeriod(mahadashas, targetDate)
  if (!maha) return null

  const antardashas = calculateAntardashas(maha)
  const antar = findActivePeriod(antardashas, targetDate)
  if (!antar) return null

  const pratyantars = calculatePratyantars(antar)
  const pratyantar = findActivePeriod(pratyantars, targetDate)
  if (!pratyantar) return null

  return { mahadasha: maha, antardasha: antar, pratyantar }
}

// ─── Utility: Get Next N Years of Dasha Timeline ──────

/**
 * Get Mahadasha + Antardasha timeline for the next N years.
 * Useful for reports and display.
 */
export function getDashaTimeline(
  natalChart: NatalChart,
  yearsAhead: number = 20
): Array<{
  mahadasha: PlanetName
  antardasha: PlanetName
  startDate: Date
  endDate: Date
  durationMonths: number
}> {
  const moonPlanet = natalChart.planets.find(p => p.name === "Moon")!
  const mahadashas = calculateMahadashas(natalChart.birthDate, moonPlanet.longitude)

  const now = new Date()
  const cutoff = addYearsToDate(now, yearsAhead)

  const timeline: Array<{
    mahadasha: PlanetName
    antardasha: PlanetName
    startDate: Date
    endDate: Date
    durationMonths: number
  }> = []

  for (const maha of mahadashas) {
    if (maha.endDate < now) continue
    if (maha.startDate > cutoff) break

    const antardashas = calculateAntardashas(maha)
    for (const antar of antardashas) {
      if (antar.endDate < now) continue
      if (antar.startDate > cutoff) break

      const durationMs = antar.endDate.getTime() - antar.startDate.getTime()
      const durationMonths = durationMs / (30.44 * 24 * 60 * 60 * 1000)

      timeline.push({
        mahadasha: maha.planet,
        antardasha: antar.planet,
        startDate: antar.startDate,
        endDate: antar.endDate,
        durationMonths: Math.round(durationMonths * 10) / 10,
      })
    }
  }

  return timeline
}

// ─── Dasha Interpretation Helpers ──────────────────────

/**
 * Get a summary string like "Sun Mahadasha / Moon Antardasha / Mars Pratyantar"
 */
export function getDashaSummary(
  maha: DashaPeriod,
  antar: DashaPeriod,
  pratyantar: DashaPeriod
): string {
  return `${maha.planet} Mahadasha / ${antar.planet} Antardasha / ${pratyantar.planet} Pratyantar Dasha`
}

/**
 * Format Dasha period as readable string.
 */
export function formatDashaPeriod(period: DashaPeriod): string {
  const start = period.startDate.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })
  const end = period.endDate.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })
  const years = Math.floor(period.durationYears)
  const months = Math.round((period.durationYears - years) * 12)

  return `${period.sanskrit} (${period.planet}): ${start} — ${end} (${years}y ${months}m)`
}
