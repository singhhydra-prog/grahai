#!/usr/bin/env npx tsx
/* ════════════════════════════════════════════════════════
   Uniqueness Test — Compares ALL section content across
   3 distinctly different charts for each generator.
   ════════════════════════════════════════════════════════ */

import type { ReportData } from "../src/lib/reports/kundli-report-generator"
import { generateReport, VALID_REPORT_TYPES } from "../src/lib/reports/generators"

// ─── Sign Info Builder ───────────────────────────────────
function sign(name: string) {
  const idx: Record<string, number> = {
    Aries:0,Taurus:1,Gemini:2,Cancer:3,Leo:4,Virgo:5,
    Libra:6,Scorpio:7,Sagittarius:8,Capricorn:9,Aquarius:10,Pisces:11,
  }
  return { name, index: idx[name] ?? 0, sanskrit: name, lord: "Mars", element: "Fire", quality: "Cardinal", gender: "Male" }
}

// ─── Planet Builder ──────────────────────────────────────
function planet(name: string, signName: string, house: number, deg: number, dignity: string, retro = false) {
  return {
    name, sanskrit: name, longitude: deg, latitude: 0, speed: 1,
    retrograde: retro, sign: sign(signName), degree: deg % 30,
    nakshatra: { name: "Rohini", index: 3, lord: "Moon", deity: "Brahma", pada: 1, startDegree: 40, symbol: "Cart", shakti: "Growth", animal: "Snake", gana: "Manushya", guna: "Rajas" },
    house, dignity: dignity as any, isExalted: dignity === "exalted", isDebilitated: dignity === "debilitated", isCombust: false,
  }
}

// ─── House Analysis Builder ──────────────────────────────
function houses(signs: string[], lords: string[], lordPlacements: number[], planetsMap: Record<number, string[]>) {
  return signs.map((s, i) => ({
    house: i + 1, sign: s, lord: lords[i], lordPlacement: lordPlacements[i],
    planetsInHouse: planetsMap[i + 1] || [], significance: "Test",
    interpretation: `House ${i + 1} analysis.`,
  }))
}

// ─── Dasha Analysis Builder ──────────────────────────────
function dashaAn(mdPlanet: string, adPlanet: string, mdStart: string, mdEnd: string, adStart: string, adEnd: string) {
  return {
    system: "Vimshottari" as const, totalYears: 120,
    birthNakshatra: { name: "Rohini", index: 3, lord: "Moon", deity: "Brahma", pada: 1, startDegree: 40, symbol: "Cart", shakti: "Growth", animal: "Snake", gana: "Manushya", guna: "Rajas" },
    moonDegreeInNakshatra: 7, balanceAtBirth: 15,
    mahadashas: [
      { planet: mdPlanet, sanskrit: mdPlanet, startDate: new Date(mdStart), endDate: new Date(mdEnd), durationYears: 17, isActive: true, level: "mahadasha" as const },
    ],
    currentMahadasha: { planet: mdPlanet, sanskrit: mdPlanet, startDate: new Date(mdStart), endDate: new Date(mdEnd), durationYears: 17, isActive: true, level: "mahadasha" as const },
    currentAntardasha: { planet: adPlanet, sanskrit: adPlanet, startDate: new Date(adStart), endDate: new Date(adEnd), durationYears: 3, isActive: true, level: "antardasha" as const },
    currentPratyantar: { planet: "Sun", sanskrit: "Surya", startDate: new Date(adStart), endDate: new Date(adEnd), durationYears: 0.5, isActive: true, level: "pratyantardasha" as const },
  }
}

// ─── Dasha Timeline Builder ──────────────────────────────
function timeline(entries: Array<[string, string, string, string, number]>) {
  return entries.map(([md, ad, start, end, months]) => ({
    mahadasha: md, antardasha: ad, startDate: new Date(start), endDate: new Date(end), durationMonths: months,
  }))
}

// ─── House Strengths Builder ─────────────────────────────
function houseStr(savScores: number[]) {
  return savScores.map((sav, i) => ({
    house: i + 1, sav,
    strength: sav >= 30 ? "strong" : sav >= 20 ? "moderate" : "weak",
    meaning: `House ${i + 1} strength.`,
  }))
}

// ─── CHART A: Aries Asc, strong chart ────────────────────
const chartA: ReportData = {
  name: "Chart A", birthDetails: { name: "Chart A", date: new Date("1990-03-15"), time: "06:00", place: "Delhi", latitude: 28.6, longitude: 77.2, timezone: 5.5 },
  generatedAt: new Date(),
  natalChart: {
    name: "Chart A", birthDate: new Date("1990-03-15"), birthTime: "06:00", birthPlace: "Delhi",
    latitude: 28.6, longitude: 77.2, timezone: 5.5, julianDay: 2448000, ayanamsa: 23.7,
    ascendant: 5, ascendantSign: sign("Aries"),
    planets: [
      planet("Sun", "Aries", 1, 10, "exalted"),
      planet("Moon", "Cancer", 4, 100, "own"),
      planet("Mars", "Capricorn", 10, 280, "exalted"),
      planet("Mercury", "Pisces", 12, 350, "debilitated"),
      planet("Jupiter", "Sagittarius", 9, 255, "own"),
      planet("Venus", "Pisces", 12, 345, "exalted"),
      planet("Saturn", "Libra", 7, 195, "exalted"),
      planet("Rahu", "Gemini", 3, 75, "neutral"),
      planet("Ketu", "Sagittarius", 9, 255, "neutral"),
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({ number: i + 1, sign: sign("Aries"), degree: i * 30, lord: "Mars", planets: [], significances: [] })),
    moonSign: sign("Cancer"), sunSign: sign("Aries"), lagna: sign("Aries"), nakshatraLord: "Moon",
  },
  navamsaChart: { type: "D9" as any, name: "D9", sanskrit: "Navamsa", purpose: "Marriage", planets: [
    { name: "Sun", longitude: 90, sign: sign("Cancer"), degree: 0, house: 4 },
    { name: "Moon", longitude: 180, sign: sign("Libra"), degree: 0, house: 7 },
    { name: "Mars", longitude: 0, sign: sign("Aries"), degree: 0, house: 1 },
    { name: "Mercury", longitude: 270, sign: sign("Capricorn"), degree: 0, house: 10 },
    { name: "Jupiter", longitude: 135, sign: sign("Leo"), degree: 15, house: 5 },
    { name: "Venus", longitude: 315, sign: sign("Aquarius"), degree: 15, house: 11 },
    { name: "Saturn", longitude: 225, sign: sign("Scorpio"), degree: 15, house: 8 },
    { name: "Rahu", longitude: 45, sign: sign("Taurus"), degree: 15, house: 2 },
    { name: "Ketu", longitude: 225, sign: sign("Scorpio"), degree: 15, house: 8 },
  ], ascendant: 5, ascendantSign: sign("Aries") },
  dasamsaChart: { type: "D10" as any, name: "D10", sanskrit: "Dasamsa", purpose: "Career", planets: [
    { name: "Sun", longitude: 100, sign: sign("Cancer"), degree: 10, house: 4 },
    { name: "Moon", longitude: 280, sign: sign("Capricorn"), degree: 10, house: 10 },
    { name: "Mars", longitude: 160, sign: sign("Virgo"), degree: 10, house: 6 },
    { name: "Mercury", longitude: 140, sign: sign("Leo"), degree: 20, house: 5 },
    { name: "Jupiter", longitude: 330, sign: sign("Pisces"), degree: 0, house: 12 },
    { name: "Venus", longitude: 90, sign: sign("Cancer"), degree: 0, house: 4 },
    { name: "Saturn", longitude: 310, sign: sign("Aquarius"), degree: 10, house: 11 },
    { name: "Rahu", longitude: 30, sign: sign("Taurus"), degree: 0, house: 2 },
    { name: "Ketu", longitude: 210, sign: sign("Scorpio"), degree: 0, house: 8 },
  ], ascendant: 50, ascendantSign: sign("Taurus") },
  planetTable: [], nakshatraAnalysis: { name: "Ashwini", lord: "Ketu", deity: "Ashwins", pada: 1, characteristics: "Pioneer" },
  dashaAnalysis: dashaAn("Jupiter", "Saturn", "2020-01-01", "2036-01-01", "2025-06-01", "2028-01-01"),
  dashaTimeline: timeline([
    ["Jupiter", "Saturn", "2025-06-01", "2028-01-01", 31],
    ["Jupiter", "Mercury", "2028-01-01", "2030-06-01", 30],
    ["Jupiter", "Ketu", "2030-06-01", "2031-06-01", 12],
    ["Jupiter", "Venus", "2031-06-01", "2034-02-01", 32],
    ["Jupiter", "Sun", "2034-02-01", "2035-01-01", 11],
  ]),
  yogas: [
    { name: "Hamsa Yoga", sanskrit: "Hamsa", category: "Panch Mahapurush" as any, isPresent: true, strength: "strong", involvedPlanets: ["Jupiter"], involvedHouses: [9], description: "Jupiter in Kendra in own sign", effects: "Wisdom, spirituality, and prosperity", classicalReference: { source: "BPHS", chapter: 5, verse: 1 } },
    { name: "Raj Yoga", sanskrit: "Raj", category: "Raj Yoga" as any, isPresent: true, strength: "strong", involvedPlanets: ["Sun", "Jupiter"], involvedHouses: [1, 9], description: "Kendra-Trikona lord conjunction", effects: "Power and authority", classicalReference: { source: "BPHS", chapter: 5, verse: 2 } },
  ],
  doshas: [
    { type: "Mangal Dosha" as any, isPresent: false, severity: "none" as any, involvedPlanets: ["Mars"], involvedHouses: [10], description: "Mars not in dosha houses", effects: "No Mangal Dosha", cancellations: [], classicalReference: { source: "BPHS", chapter: 5, verse: 1 } },
  ],
  houseAnalysis: houses(
    ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"],
    ["Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"],
    [10,12,3,4,1,12,7,10,9,10,7,9],
    { 1: ["Sun"], 4: ["Moon"], 7: ["Saturn"], 9: ["Jupiter","Ketu"], 10: ["Mars"], 12: ["Mercury","Venus"] }
  ),
  remedies: { afflictedPlanets: [], suggestedRemedies: [], doshaRemedies: [] },
  strengthAnalysis: { overall: "Strong", planets: [
    { planet: "Sun", strength: 8, compositeStrength: { adjusted: 8 } },
    { planet: "Jupiter", strength: 9, compositeStrength: { adjusted: 9 } },
    { planet: "Mars", strength: 7, compositeStrength: { adjusted: 7 } },
    { planet: "Saturn", strength: 7, compositeStrength: { adjusted: 7 } },
  ] as any },
  vargottamaPlanets: ["Sun"],
  ashtakavarga: { sav: [28,32,25,30,26,22,35,24,31,33,27,29], bav: [25,28,22,27,23,19,30,21,28,30,24,26], mav: [26,30,23,28,24,20,32,22,29,31,25,27], meav: [24,27,21,26,22,18,29,20,27,29,23,25], mav2: [27,31,24,29,25,21,33,23,30,32,26,28], kuv: [25,29,22,28,23,19,31,21,29,30,24,26], sav_total: 342, bav_total: 303, mav_total: 315, meav_total: 291, mav2_total: 329, kuv_total: 307 },
  ashtakavargaSummary: { sav: "Good", bav: "Good", mav: "Good", meav: "Moderate", mav2: "Excellent", kuv: "Good" },
  houseStrengths: houseStr([28, 32, 25, 30, 26, 22, 35, 24, 31, 33, 27, 29]),
  vargaInterpretation: { navamsa: "Strong", dasamsa: "Good", synthesis: "Powerful chart" },
  doshaCancellations: { doshas: [], cancellations: [] },
  savTransitReport: { transits: [] },
  bhavaChalitReport: { bhavaStrengths: {} },
  chartSynthesis: { overallCharacterization: "Strong chart", majorThemes: [] },
  bibliography: [],
} as any

// ─── CHART B: Libra Asc, challenged chart ────────────────
const chartB: ReportData = {
  name: "Chart B", birthDetails: { name: "Chart B", date: new Date("1978-08-22"), time: "22:15", place: "Mumbai", latitude: 19.07, longitude: 72.87, timezone: 5.5 },
  generatedAt: new Date(),
  natalChart: {
    name: "Chart B", birthDate: new Date("1978-08-22"), birthTime: "22:15", birthPlace: "Mumbai",
    latitude: 19.07, longitude: 72.87, timezone: 5.5, julianDay: 2443700, ayanamsa: 23.5,
    ascendant: 185, ascendantSign: sign("Libra"),
    planets: [
      planet("Sun", "Libra", 1, 185, "debilitated"),
      planet("Moon", "Scorpio", 2, 220, "enemy"),
      planet("Mars", "Cancer", 10, 100, "debilitated"),
      planet("Mercury", "Virgo", 12, 165, "moolatrikona"),
      planet("Jupiter", "Cancer", 10, 105, "exalted"),
      planet("Venus", "Leo", 11, 140, "enemy"),
      planet("Saturn", "Leo", 11, 145, "enemy"),
      planet("Rahu", "Virgo", 12, 170, "neutral"),
      planet("Ketu", "Pisces", 6, 350, "neutral"),
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({ number: i + 1, sign: sign("Libra"), degree: (185 + i * 30) % 360, lord: "Venus", planets: [], significances: [] })),
    moonSign: sign("Scorpio"), sunSign: sign("Libra"), lagna: sign("Libra"), nakshatraLord: "Mars",
  },
  navamsaChart: { type: "D9" as any, name: "D9", sanskrit: "Navamsa", purpose: "Marriage", planets: [
    { name: "Sun", longitude: 225, sign: sign("Scorpio"), degree: 15, house: 2 },
    { name: "Moon", longitude: 60, sign: sign("Gemini"), degree: 0, house: 9 },
    { name: "Mars", longitude: 180, sign: sign("Libra"), degree: 0, house: 1 },
    { name: "Mercury", longitude: 45, sign: sign("Taurus"), degree: 15, house: 8 },
    { name: "Jupiter", longitude: 225, sign: sign("Scorpio"), degree: 15, house: 2 },
    { name: "Venus", longitude: 0, sign: sign("Aries"), degree: 0, house: 7 },
    { name: "Saturn", longitude: 15, sign: sign("Aries"), degree: 15, house: 7 },
    { name: "Rahu", longitude: 150, sign: sign("Virgo"), degree: 0, house: 12 },
    { name: "Ketu", longitude: 330, sign: sign("Pisces"), degree: 0, house: 6 },
  ], ascendant: 185, ascendantSign: sign("Libra") },
  dasamsaChart: { type: "D10" as any, name: "D10", sanskrit: "Dasamsa", purpose: "Career", planets: [
    { name: "Sun", longitude: 210, sign: sign("Libra"), degree: 0, house: 1 },
    { name: "Moon", longitude: 320, sign: sign("Aquarius"), degree: 20, house: 5 },
    { name: "Mars", longitude: 280, sign: sign("Capricorn"), degree: 10, house: 4 },
    { name: "Mercury", longitude: 10, sign: sign("Aries"), degree: 10, house: 7 },
    { name: "Jupiter", longitude: 330, sign: sign("Pisces"), degree: 0, house: 6 },
    { name: "Venus", longitude: 120, sign: sign("Leo"), degree: 0, house: 11 },
    { name: "Saturn", longitude: 90, sign: sign("Cancer"), degree: 0, house: 10 },
    { name: "Rahu", longitude: 340, sign: sign("Pisces"), degree: 10, house: 6 },
    { name: "Ketu", longitude: 160, sign: sign("Virgo"), degree: 10, house: 12 },
  ], ascendant: 210, ascendantSign: sign("Libra") },
  planetTable: [], nakshatraAnalysis: { name: "Anuradha", lord: "Saturn", deity: "Mitra", pada: 2, characteristics: "Devoted" },
  dashaAnalysis: dashaAn("Saturn", "Mars", "2018-03-01", "2037-03-01", "2025-01-01", "2026-02-15"),
  dashaTimeline: timeline([
    ["Saturn", "Mars", "2025-01-01", "2026-02-15", 13],
    ["Saturn", "Rahu", "2026-02-15", "2028-12-01", 34],
    ["Saturn", "Jupiter", "2028-12-01", "2031-06-01", 30],
    ["Saturn", "Sun", "2031-06-01", "2032-06-01", 12],
    ["Saturn", "Moon", "2032-06-01", "2034-01-01", 19],
  ]),
  yogas: [
    { name: "Gajakesari Yoga", sanskrit: "Gajakesari", category: "Dhan Yoga" as any, isPresent: true, strength: "moderate", involvedPlanets: ["Jupiter", "Moon"], involvedHouses: [10, 2], description: "Jupiter in Kendra from Moon", effects: "Wealth and popularity", classicalReference: { source: "BPHS", chapter: 5, verse: 3 } },
    { name: "Neecha Bhanga Raj Yoga", sanskrit: "Neecha Bhanga", category: "Raj Yoga" as any, isPresent: true, strength: "moderate", involvedPlanets: ["Mars", "Jupiter"], involvedHouses: [10], description: "Debilitation cancelled by Jupiter", effects: "Rise after struggles", classicalReference: { source: "BPHS", chapter: 5, verse: 4 } },
  ],
  doshas: [
    { type: "Mangal Dosha" as any, isPresent: true, severity: "high" as any, involvedPlanets: ["Mars"], involvedHouses: [10], description: "Mars in 10th house", effects: "Marriage challenges", cancellations: [], classicalReference: { source: "BPHS", chapter: 5, verse: 1 } },
    { type: "Sade Sati" as any, isPresent: true, severity: "medium" as any, involvedPlanets: ["Saturn"], involvedHouses: [2], description: "Saturn transiting Moon sign", effects: "Testing period", cancellations: [], classicalReference: { source: "BPHS", chapter: 5, verse: 2 } },
  ],
  houseAnalysis: houses(
    ["Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces","Aries","Taurus","Gemini","Cancer","Leo","Virgo"],
    ["Venus","Mars","Jupiter","Saturn","Saturn","Jupiter","Mars","Venus","Mercury","Moon","Sun","Mercury"],
    [11,10,10,11,11,6,10,11,12,10,1,12],
    { 1: ["Sun"], 2: ["Moon"], 6: ["Ketu"], 10: ["Mars","Jupiter"], 11: ["Venus","Saturn"], 12: ["Mercury","Rahu"] }
  ),
  remedies: { afflictedPlanets: ["Sun","Mars","Venus","Saturn"], suggestedRemedies: [], doshaRemedies: [] },
  strengthAnalysis: { overall: "Moderate", planets: [
    { planet: "Sun", strength: 3, compositeStrength: { adjusted: 3 } },
    { planet: "Jupiter", strength: 8, compositeStrength: { adjusted: 8 } },
    { planet: "Mercury", strength: 7, compositeStrength: { adjusted: 7 } },
    { planet: "Saturn", strength: 4, compositeStrength: { adjusted: 4 } },
  ] as any },
  vargottamaPlanets: [],
  ashtakavarga: { sav: [20,18,30,22,28,25,19,32,24,21,33,26], bav: [17,15,27,19,25,22,16,29,21,18,30,23], mav: [18,16,28,20,26,23,17,30,22,19,31,24], meav: [16,14,26,18,24,21,15,28,20,17,29,22], mav2: [19,17,29,21,27,24,18,31,23,20,32,25], kuv: [17,15,27,19,25,22,16,29,21,18,30,23], sav_total: 298, bav_total: 262, mav_total: 274, meav_total: 250, mav2_total: 286, kuv_total: 262 },
  ashtakavargaSummary: { sav: "Moderate", bav: "Moderate", mav: "Moderate", meav: "Weak", mav2: "Good", kuv: "Moderate" },
  houseStrengths: houseStr([20, 18, 30, 22, 28, 25, 19, 32, 24, 21, 33, 26]),
  vargaInterpretation: { navamsa: "Moderate", dasamsa: "Moderate", synthesis: "Challenged chart with hidden strengths" },
  doshaCancellations: { doshas: [{ doshaType: "Mangal Dosha", isEffectivelyCancelled: false, interpretation: "Mars debilitated in 10th not cancelled" }], cancellations: [] },
  savTransitReport: { transits: [] },
  bhavaChalitReport: { bhavaStrengths: {} },
  chartSynthesis: { overallCharacterization: "Challenged but resilient", majorThemes: [] },
  bibliography: [],
} as any

// ─── CHART C: Capricorn Asc, mixed chart ─────────────────
const chartC: ReportData = {
  name: "Chart C", birthDetails: { name: "Chart C", date: new Date("2001-12-05"), time: "14:45", place: "Chennai", latitude: 13.08, longitude: 80.27, timezone: 5.5 },
  generatedAt: new Date(),
  natalChart: {
    name: "Chart C", birthDate: new Date("2001-12-05"), birthTime: "14:45", birthPlace: "Chennai",
    latitude: 13.08, longitude: 80.27, timezone: 5.5, julianDay: 2452250, ayanamsa: 23.9,
    ascendant: 275, ascendantSign: sign("Capricorn"),
    planets: [
      planet("Sun", "Scorpio", 11, 225, "friendly"),
      planet("Moon", "Taurus", 5, 45, "exalted"),
      planet("Mars", "Aquarius", 2, 310, "neutral"),
      planet("Mercury", "Sagittarius", 12, 255, "neutral", true),
      planet("Jupiter", "Gemini", 6, 75, "enemy"),
      planet("Venus", "Capricorn", 1, 280, "friendly"),
      planet("Saturn", "Taurus", 5, 50, "friendly"),
      planet("Rahu", "Taurus", 5, 40, "neutral"),
      planet("Ketu", "Scorpio", 11, 220, "neutral"),
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({ number: i + 1, sign: sign("Capricorn"), degree: (275 + i * 30) % 360, lord: "Saturn", planets: [], significances: [] })),
    moonSign: sign("Taurus"), sunSign: sign("Scorpio"), lagna: sign("Capricorn"), nakshatraLord: "Moon",
  },
  navamsaChart: { type: "D9" as any, name: "D9", sanskrit: "Navamsa", purpose: "Marriage", planets: [
    { name: "Sun", longitude: 315, sign: sign("Aquarius"), degree: 15, house: 2 },
    { name: "Moon", longitude: 135, sign: sign("Leo"), degree: 15, house: 8 },
    { name: "Mars", longitude: 70, sign: sign("Gemini"), degree: 10, house: 6 },
    { name: "Mercury", longitude: 255, sign: sign("Sagittarius"), degree: 15, house: 12 },
    { name: "Jupiter", longitude: 315, sign: sign("Aquarius"), degree: 15, house: 2 },
    { name: "Venus", longitude: 160, sign: sign("Virgo"), degree: 10, house: 9 },
    { name: "Saturn", longitude: 90, sign: sign("Cancer"), degree: 0, house: 7 },
    { name: "Rahu", longitude: 0, sign: sign("Aries"), degree: 0, house: 4 },
    { name: "Ketu", longitude: 180, sign: sign("Libra"), degree: 0, house: 10 },
  ], ascendant: 275, ascendantSign: sign("Capricorn") },
  dasamsaChart: { type: "D10" as any, name: "D10", sanskrit: "Dasamsa", purpose: "Career", planets: [
    { name: "Sun", longitude: 330, sign: sign("Pisces"), degree: 0, house: 3 },
    { name: "Moon", longitude: 90, sign: sign("Cancer"), degree: 0, house: 7 },
    { name: "Mars", longitude: 260, sign: sign("Sagittarius"), degree: 20, house: 12 },
    { name: "Mercury", longitude: 190, sign: sign("Libra"), degree: 10, house: 10 },
    { name: "Jupiter", longitude: 30, sign: sign("Taurus"), degree: 0, house: 5 },
    { name: "Venus", longitude: 80, sign: sign("Gemini"), degree: 20, house: 6 },
    { name: "Saturn", longitude: 140, sign: sign("Leo"), degree: 20, house: 8 },
    { name: "Rahu", longitude: 40, sign: sign("Taurus"), degree: 10, house: 5 },
    { name: "Ketu", longitude: 220, sign: sign("Scorpio"), degree: 10, house: 11 },
  ], ascendant: 310, ascendantSign: sign("Aquarius") },
  planetTable: [], nakshatraAnalysis: { name: "Rohini", lord: "Moon", deity: "Brahma", pada: 3, characteristics: "Creative" },
  dashaAnalysis: dashaAn("Venus", "Jupiter", "2022-05-01", "2042-05-01", "2025-03-01", "2027-11-01"),
  dashaTimeline: timeline([
    ["Venus", "Jupiter", "2025-03-01", "2027-11-01", 32],
    ["Venus", "Saturn", "2027-11-01", "2031-01-01", 38],
    ["Venus", "Mercury", "2031-01-01", "2033-11-01", 34],
    ["Venus", "Ketu", "2033-11-01", "2035-01-01", 14],
    ["Venus", "Sun", "2035-01-01", "2036-01-01", 12],
  ]),
  yogas: [
    { name: "Dhan Yoga", sanskrit: "Dhan", category: "Dhan Yoga" as any, isPresent: true, strength: "strong", involvedPlanets: ["Venus", "Saturn"], involvedHouses: [1, 5], description: "Lagna lord with 5th lord", effects: "Financial prosperity", classicalReference: { source: "BPHS", chapter: 5, verse: 5 } },
  ],
  doshas: [
    { type: "Kaal Sarp Dosha" as any, isPresent: true, severity: "medium" as any, involvedPlanets: ["Rahu", "Ketu"], involvedHouses: [5, 11], description: "All planets between Rahu-Ketu axis", effects: "Intense karmic focus", cancellations: [], classicalReference: { source: "BPHS", chapter: 5, verse: 3 } },
  ],
  houseAnalysis: houses(
    ["Capricorn","Aquarius","Pisces","Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius"],
    ["Saturn","Saturn","Jupiter","Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter"],
    [5,2,6,2,5,12,5,11,12,1,11,6],
    { 1: ["Venus"], 2: ["Mars"], 5: ["Moon","Saturn","Rahu"], 6: ["Jupiter"], 11: ["Sun","Ketu"], 12: ["Mercury"] }
  ),
  remedies: { afflictedPlanets: ["Jupiter","Mercury"], suggestedRemedies: [], doshaRemedies: [] },
  strengthAnalysis: { overall: "Moderate", planets: [
    { planet: "Moon", strength: 8, compositeStrength: { adjusted: 8 } },
    { planet: "Venus", strength: 6, compositeStrength: { adjusted: 6 } },
    { planet: "Saturn", strength: 5, compositeStrength: { adjusted: 5 } },
    { planet: "Jupiter", strength: 3, compositeStrength: { adjusted: 3 } },
  ] as any },
  vargottamaPlanets: ["Mercury"],
  ashtakavarga: { sav: [25,28,22,33,35,18,27,24,30,31,20,26], bav: [22,25,19,30,32,15,24,21,27,28,17,23], mav: [23,26,20,31,33,16,25,22,28,29,18,24], meav: [21,24,18,29,31,14,23,20,26,27,16,22], mav2: [24,27,21,32,34,17,26,23,29,30,19,25], kuv: [22,25,19,30,32,15,24,21,27,28,17,23], sav_total: 319, bav_total: 283, mav_total: 295, meav_total: 271, mav2_total: 307, kuv_total: 283 },
  ashtakavargaSummary: { sav: "Good", bav: "Moderate", mav: "Good", meav: "Moderate", mav2: "Good", kuv: "Moderate" },
  houseStrengths: houseStr([25, 28, 22, 33, 35, 18, 27, 24, 30, 31, 20, 26]),
  vargaInterpretation: { navamsa: "Moderate", dasamsa: "Good", synthesis: "Mixed chart with financial strengths" },
  doshaCancellations: { doshas: [], cancellations: [] },
  savTransitReport: { transits: [] },
  bhavaChalitReport: { bhavaStrengths: {} },
  chartSynthesis: { overallCharacterization: "Mixed chart with creative potential", majorThemes: [] },
  bibliography: [],
} as any

// ─── Sentence Comparison ─────────────────────────────────
function splitSentences(text: string): string[] {
  return text
    .replace(/\*\*/g, "")
    .replace(/•/g, "")
    .split(/(?<=[.!?:;])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15) // skip tiny fragments
}

function countIdentical(a: string[], b: string[]): number {
  let count = 0
  for (const s of a) {
    if (b.includes(s)) count++
  }
  return count
}

// ─── Main Test ───────────────────────────────────────────
console.log("═══════════════════════════════════════════════════")
console.log("   Report Generator Uniqueness Test")
console.log("═══════════════════════════════════════════════════\n")
console.log("Charts:")
console.log("  A: Aries Asc, Sun exalted, Jupiter MD, strong")
console.log("  B: Libra Asc, Sun debilitated, Saturn MD, challenged")
console.log("  C: Capricorn Asc, Moon exalted, Venus MD, mixed\n")

for (const reportType of VALID_REPORT_TYPES) {
  try {
    const rA = generateReport(reportType, chartA, reportType === "kundli-match" ? chartB : undefined)
    const rB = generateReport(reportType, chartB, reportType === "kundli-match" ? chartC : undefined)
    const rC = generateReport(reportType, chartC, reportType === "kundli-match" ? chartA : undefined)

    // Combine ALL text: summary + all section contents
    const textA = [rA.summary, ...rA.sections.map(s => s.content)].join(" ")
    const textB = [rB.summary, ...rB.sections.map(s => s.content)].join(" ")
    const textC = [rC.summary, ...rC.sections.map(s => s.content)].join(" ")

    const sentA = splitSentences(textA)
    const sentB = splitSentences(textB)
    const sentC = splitSentences(textC)

    const idAB = countIdentical(sentA, sentB)
    const idAC = countIdentical(sentA, sentC)
    const idBC = countIdentical(sentB, sentC)

    const avgIdentical = (idAB + idAC + idBC) / 3
    const avgTotal = (sentA.length + sentB.length + sentC.length) / 3
    const genericPct = avgTotal > 0 ? ((avgIdentical / avgTotal) * 100).toFixed(1) : "0.0"
    const uniquePct = (100 - parseFloat(genericPct)).toFixed(1)

    const icon = parseFloat(genericPct) <= 20 ? "✅" : parseFloat(genericPct) <= 35 ? "⚠️" : "❌"

    console.log(`${icon} ${reportType.padEnd(20)} | ${genericPct}% generic | ${uniquePct}% unique | ~${Math.round(avgTotal)} sentences`)

    // Show sample identical sentences
    if (parseFloat(genericPct) > 20) {
      const sharedAB = sentA.filter(s => sentB.includes(s)).slice(0, 3)
      if (sharedAB.length > 0) {
        console.log(`   Sample shared: "${sharedAB[0].substring(0, 80)}..."`)
      }
    }
  } catch (err: any) {
    console.log(`❌ ${reportType.padEnd(20)} | ERROR: ${err.message}`)
  }
}

console.log("\n═══════════════════════════════════════════════════")
console.log("Target: ≤20% generic content per generator")
console.log("═══════════════════════════════════════════════════")
