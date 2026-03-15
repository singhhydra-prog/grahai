/* ════════════════════════════════════════════════════════
   GrahAI — Kundli Matching Report Generator (DATA-DRIVEN)

   Generates unique, personalized Kundli Match analysis with actual
   Ashtakoot calculations and specific chart references. No generic text.
   ════════════════════════════════════════════════════════ */

import type { ReportData } from "../kundli-report-generator"
import {
  GeneratedReport,
  ReportSection,
  ReportRemedy,
  PLANET_MANTRAS,
  PLANET_GEMSTONES,
  DIGNITY_LABELS,
  HOUSE_LIFE_AREAS,
} from "./types"

/* ─── Nakshatra Data for Guna Milan ────────────────────── */

interface NakshatraGuna {
  name: string
  index: number
  lord: string
  gana: "Deva" | "Manushya" | "Rakshasa"
  animal: string
  nadi: "Adi" | "Madhya" | "Antya"
}

interface AshtakootScores {
  varna: number
  vashya: number
  tara: number
  yoni: number
  grahaMaitri: number
  gana: number
  bhakoot: number
  nadi: number
  total: number
  maxTotal: number
}

// Nakshatra index mapping (0-26)
const NAKSHATRA_MAP: Record<string, NakshatraGuna> = {
  "Ashwini": { name: "Ashwini", index: 0, lord: "Ketu", gana: "Deva", animal: "Horse", nadi: "Adi" },
  "Bharani": { name: "Bharani", index: 1, lord: "Venus", gana: "Manushya", animal: "Elephant", nadi: "Madhya" },
  "Krittika": { name: "Krittika", index: 2, lord: "Sun", gana: "Rakshasa", animal: "Goat", nadi: "Antya" },
  "Rohini": { name: "Rohini", index: 3, lord: "Moon", gana: "Manushya", animal: "Serpent", nadi: "Adi" },
  "Mrigashira": { name: "Mrigashira", index: 4, lord: "Mars", gana: "Deva", animal: "Serpent", nadi: "Madhya" },
  "Ardra": { name: "Ardra", index: 5, lord: "Rahu", gana: "Manushya", animal: "Dog", nadi: "Antya" },
  "Punarvasu": { name: "Punarvasu", index: 6, lord: "Jupiter", gana: "Deva", animal: "Cat", nadi: "Adi" },
  "Pushya": { name: "Pushya", index: 7, lord: "Saturn", gana: "Deva", animal: "Goat", nadi: "Madhya" },
  "Ashlesha": { name: "Ashlesha", index: 8, lord: "Mercury", gana: "Rakshasa", animal: "Cat", nadi: "Antya" },
  "Magha": { name: "Magha", index: 9, lord: "Ketu", gana: "Rakshasa", animal: "Rat", nadi: "Adi" },
  "Purva Phalguni": { name: "Purva Phalguni", index: 10, lord: "Venus", gana: "Manushya", animal: "Rat", nadi: "Madhya" },
  "Uttara Phalguni": { name: "Uttara Phalguni", index: 11, lord: "Sun", gana: "Manushya", animal: "Cow", nadi: "Antya" },
  "Hasta": { name: "Hasta", index: 12, lord: "Moon", gana: "Deva", animal: "Buffalo", nadi: "Adi" },
  "Chitra": { name: "Chitra", index: 13, lord: "Mars", gana: "Rakshasa", animal: "Tiger", nadi: "Madhya" },
  "Swati": { name: "Swati", index: 14, lord: "Rahu", gana: "Deva", animal: "Buffalo", nadi: "Antya" },
  "Vishakha": { name: "Vishakha", index: 15, lord: "Jupiter", gana: "Rakshasa", animal: "Tiger", nadi: "Adi" },
  "Anuradha": { name: "Anuradha", index: 16, lord: "Saturn", gana: "Deva", animal: "Deer", nadi: "Madhya" },
  "Jyeshtha": { name: "Jyeshtha", index: 17, lord: "Mercury", gana: "Rakshasa", animal: "Deer", nadi: "Antya" },
  "Mula": { name: "Mula", index: 18, lord: "Ketu", gana: "Rakshasa", animal: "Dog", nadi: "Adi" },
  "Purva Ashadha": { name: "Purva Ashadha", index: 19, lord: "Venus", gana: "Manushya", animal: "Monkey", nadi: "Madhya" },
  "Uttara Ashadha": { name: "Uttara Ashadha", index: 20, lord: "Sun", gana: "Manushya", animal: "Mongoose", nadi: "Antya" },
  "Shravana": { name: "Shravana", index: 21, lord: "Moon", gana: "Deva", animal: "Monkey", nadi: "Adi" },
  "Dhanishtha": { name: "Dhanishtha", index: 22, lord: "Mars", gana: "Rakshasa", animal: "Lion", nadi: "Madhya" },
  "Shatabhisha": { name: "Shatabhisha", index: 23, lord: "Rahu", gana: "Rakshasa", animal: "Horse", nadi: "Antya" },
  "Purva Bhadrapada": { name: "Purva Bhadrapada", index: 24, lord: "Jupiter", gana: "Manushya", animal: "Lion", nadi: "Adi" },
  "Uttara Bhadrapada": { name: "Uttara Bhadrapada", index: 25, lord: "Saturn", gana: "Manushya", animal: "Cow", nadi: "Madhya" },
  "Revati": { name: "Revati", index: 26, lord: "Mercury", gana: "Deva", animal: "Elephant", nadi: "Antya" },
}

/* ─── Ashtakoot Compatibility Score ───────────────────── */

interface AshtakootScores {
  varna: number
  vashya: number
  tara: number
  yoni: number
  grahaMaitri: number
  gana: number
  bhakoot: number
  nadi: number
  total: number
  maxTotal: number
}

/* ─── Main Report Generator ──────────────────────────────── */

export function generateKundliMatchReport(
  data: ReportData,
  partnerData?: ReportData
): GeneratedReport {
  const sections: ReportSection[] = []

  if (partnerData) {
    // Section 1: Guna Milan Score (Ashtakoot with partner data)
    sections.push(generateGunaMillanSection(data, partnerData))
  } else {
    // Section 1: Compatibility Profile (standalone)
    sections.push(generateCompatibilityProfileSection(data))
  }

  // Section 2: Mangal Dosha Analysis
  sections.push(generateMangalDoshaSection(data, partnerData))

  // Section 3: Communication & Emotional Patterns
  sections.push(generateCommunicationSection(data, partnerData))

  // Section 4: Long-term Relationship Potential
  sections.push(generateLongTermPotentialSection(data, partnerData))

  // Section 5: Remedies for Harmony
  sections.push(generateRemedialsSection(data, partnerData))

  // Generate remedies
  const remedies = generateMatchRemedies(data, partnerData)

  // Create summary
  const summary = generateSummary(data, partnerData)

  return {
    summary,
    sections,
    remedies,
  }
}

/* ─── Section 1a: Guna Milan (with Partner Data) ─────────── */

function generateGunaMillanSection(data: ReportData, partnerData: ReportData): ReportSection {
  const nativeMoon = data.natalChart.planets.find(p => p.name === "Moon")!
  const partnerMoon = partnerData.natalChart.planets.find(p => p.name === "Moon")!

  const nativeNak = NAKSHATRA_MAP[data.nakshatraAnalysis.name] || getNakshatraFromIndex(data.nakshatraAnalysis.name)
  const partnerNak = NAKSHATRA_MAP[partnerData.nakshatraAnalysis.name] || getNakshatraFromIndex(partnerData.nakshatraAnalysis.name)

  const nativePada = data.nakshatraAnalysis.pada || 1
  const partnerPada = partnerData.nakshatraAnalysis.pada || 1

  const scores = calculateAshtakoot(
    nativeNak,
    partnerNak,
    nativeMoon.sign.name,
    partnerMoon.sign.name,
    data.natalChart
  )

  let content = `**Ashtakoot Guna Milan: Your Compatibility Matrix**\n\n`

  content += `Your Moon is in ${nativeMoon.sign.name} (${data.nakshatraAnalysis.name}, Pada ${nativePada}, ${nativeNak.gana} Gana, Nadi: ${nativeNak.nadi}, Animal: ${nativeNak.animal}). `
  content += `Your partner's Moon is in ${partnerMoon.sign.name} (${partnerData.nakshatraAnalysis.name}, Pada ${partnerPada}, ${partnerNak.gana} Gana, Nadi: ${partnerNak.nadi}, Animal: ${partnerNak.animal}).\n\n`

  content += `**ASHTAKOOT SCORES**\n\n`

  // Varna
  const varnaDesc = explainVarna(scores.varna, nativeMoon.sign.name, partnerMoon.sign.name)
  content += `• **Varna** (Nature Alignment): ${scores.varna}/1\n  ${varnaDesc}\n\n`

  // Vashya
  const vashyaDesc = explainVashya(scores.vashya, nativeMoon.sign.name, partnerMoon.sign.name)
  content += `• **Vashya** (Mutual Magnetism): ${scores.vashya}/2\n  ${vashyaDesc}\n\n`

  // Tara
  const taraDesc = explainTara(scores.tara, nativeNak.index, partnerNak.index, data.nakshatraAnalysis.name, partnerData.nakshatraAnalysis.name)
  content += `• **Tara** (Star Health Sync): ${scores.tara}/3\n  ${taraDesc}\n\n`

  // Yoni
  const yoniDesc = explainYoni(scores.yoni, nativeNak.animal, partnerNak.animal)
  content += `• **Yoni** (Instinctive Harmony): ${scores.yoni}/4\n  ${yoniDesc}\n\n`

  // Graha Maitri
  const maitriDesc = explainGrahaMaitri(scores.grahaMaitri, nativeNak.lord, partnerNak.lord)
  content += `• **Graha Maitri** (Planetary Friendship): ${scores.grahaMaitri}/5\n  ${maitriDesc}\n\n`

  // Gana
  const ganaDesc = explainGana(scores.gana, nativeNak.gana, partnerNak.gana)
  content += `• **Gana** (Temperament Match): ${scores.gana}/6\n  ${ganaDesc}\n\n`

  // Bhakoot
  const bhakootDesc = explainBhakoot(scores.bhakoot, nativeMoon.sign.name, partnerMoon.sign.name)
  content += `• **Bhakoot** (Prosperity Alignment): ${scores.bhakoot}/7\n  ${bhakootDesc}\n\n`

  // Nadi
  const nadiDesc = explainNadi(scores.nadi, nativeNak.nadi, partnerNak.nadi)
  content += `• **Nadi** (Constitutional Match): ${scores.nadi}/8\n  ${nadiDesc}\n\n`

  content += `**TOTAL SCORE: ${scores.total}/${scores.maxTotal} (${Math.round((scores.total / scores.maxTotal) * 100)}%)**\n\n`

  // Interpret total score
  const percentage = (scores.total / scores.maxTotal) * 100
  if (percentage >= 36) {
    content += `**Verdict:** Excellent compatibility. You are highly matched across all dimensions. `
    content += `Your emotional natures, temperaments, and karmic patterns align closely, creating a strong foundation for lifelong partnership.\n`
  } else if (percentage >= 30) {
    content += `**Verdict:** Strong compatibility. Most key dimensions are favorable. `
    content += `Address the lower-scoring areas (identified above) through conscious communication and remedial practices.\n`
  } else if (percentage >= 24) {
    content += `**Verdict:** Moderate compatibility. You have viable partnership potential with meaningful effort. `
    content += `The challenges in specific areas (Nadi, Gana, Yoni) require intentional work and likely benefit from experienced astrological guidance.\n`
  } else if (percentage >= 18) {
    content += `**Verdict:** Challenging compatibility. Significant astrological obstacles exist, particularly in ${identifyWeakAreas(scores)}. `
    content += `This partnership demands strong commitment, professional remedial measures, and conscious collaboration to overcome inherent friction.\n`
  } else {
    content += `**Verdict:** Severe incompatibility in the Ashtakoot framework. `
    content += `Unless both partners are exceptionally committed and willing to pursue intensive remedial practices, marriage carries substantial astrological risk.\n`
  }

  return {
    title: "Ashtakoot Guna Milan",
    content,
  }
}

/* ─── Section 1b: Compatibility Profile (Standalone) ──────── */

function generateCompatibilityProfileSection(data: ReportData): ReportSection {
  const moonPlanet = data.natalChart.planets.find(p => p.name === "Moon")!
  const moonSign = moonPlanet.sign.name
  const moonNak = NAKSHATRA_MAP[data.nakshatraAnalysis.name] || getNakshatraFromIndex(data.nakshatraAnalysis.name)
  const moonPada = data.nakshatraAnalysis.pada || 1

  const venus = data.natalChart.planets.find(p => p.name === "Venus")!
  const venusSign = venus.sign.name
  const venusHouse = venus.house

  const mercury = data.natalChart.planets.find(p => p.name === "Mercury")!
  const mercurySign = mercury.sign.name

  const house7 = data.houseAnalysis.find(h => h.house === 7)
  const house7Lord = house7?.lord || "unidentified"

  let content = `**YOUR COMPATIBILITY PROFILE**\n\n`

  content += `**Moon Signature: ${moonSign} (${data.nakshatraAnalysis.name} Pada ${moonPada})**\n\n`
  content += `Your Moon in ${moonSign} defines your core emotional nature: you need ${getMoonEmotionalNeeds(moonSign)}. `
  content += `You have Gana: ${moonNak.gana}, Nadi: ${moonNak.nadi}, Yoni animal: ${moonNak.animal}. `
  content += `Your emotional rhythm is set by these coordinates—a compatible partner must resonate with this baseline.\n\n`

  content += `**Ideal Partner Moon Signs for You**\n\n`
  const harmonious = getHarmoniousMoonSigns(moonSign)
  const compatible = getCompatibleMoonSigns(moonSign)
  content += `Harmonious (Most Compatible): ${harmonious.join(", ")}\n`
  content += `Compatible: ${compatible.join(", ")}\n`
  content += `Challenging: Signs opposite to yours create polarity—sometimes magnetic, but requiring extra empathy.\n\n`

  content += `**Nakshatra Compatibility Preferences**\n\n`
  const compatGanas = getCompatibleGanas(moonNak.gana)
  const incompatGanas = getIncompatibleGanas(moonNak.gana)
  content += `Gana: You are ${moonNak.gana} Gana. Seek partners who are ${compatGanas.join(" or ")} Gana. Avoid ${incompatGanas.join(" and ")} if they have Rakshasa.\n`
  content += `Nadi (CRITICAL): Your Nadi is ${moonNak.nadi}. Your partner MUST have a different Nadi (${getNadiDifference(moonNak.nadi)}) for health continuity.\n`
  content += `Yoni Animal: ${moonNak.animal}. Compatible animals: ${getCompatibleAnimals(moonNak.animal).slice(0, 5).join(", ")}.\n\n`

  content += `**Venus in ${venusSign} (House ${venusHouse}): Your Romance & Values**\n\n`
  content += `Your Venus expresses romantic energy through ${venusSign} qualities. You seek partnership that honors these values: ${getVenusRomanticExpression(venusSign)}. `
  content += `A partner's Venus or Moon in compatible signs (${getCompatibleVenusSignsFor(venusSign).slice(0, 4).join(", ")}) will create romantic resonance.\n\n`

  content += `**Communication Style: Mercury in ${mercurySign}**\n\n`
  content += `Your Mercury indicates communication as ${getMercuryCommunicationStyle(mercurySign)}. `
  content += `Partners with Mercury in Air or fellow Mercury-ruled signs can match your intellectual pace. ${mercurySign === "Gemini" || mercurySign === "Virgo" ? "You naturally excel at dialogue." : "You may need to adjust between logic and emotion."}\n\n`

  content += `**House 7 (Marriage): Sign ${house7?.sign || "—"}, Ruled by ${house7Lord}**\n\n`
  if (house7) {
    content += `Your 7th house is in ${house7.sign}, indicating that partnership themes will manifest through ${house7Description(house7.sign)} qualities. `
    if (house7.planetsInHouse.length > 0) {
      content += `Planets in your 7th (${house7.planetsInHouse.join(", ")}) will actively shape marriage timing and quality.\n\n`
    } else {
      content += `Unoccupied, the house's lord (${house7Lord}) determines marriage potential.\n\n`
    }
  }

  content += `**What You Need in a Partner**\n\n`
  content += `• Moon in ${harmonious[0] || "compatible sign"} or one of the harmonious signs above\n`
  content += `• Different Nadi (${getNadiDifference(moonNak.nadi)})\n`
  content += `• ${compatGanas[0]} Gana (ideally) or Manushya\n`
  content += `• Strong 7th house: ensure their 7th house lord is not severely afflicted\n`
  content += `• Avoid Mangal Dosha in both charts simultaneously (unless both have cancellation factors)\n`
  content += `• Venus or Moon in harmonious aspect to your Venus (${venusSign})\n\n`

  content += `When meeting a potential partner, request their birth details to calculate exact Guna Milan scores against this profile.\n`

  return {
    title: "Your Compatibility Profile",
    content,
  }
}

/* ─── Section 2: Mangal Dosha Analysis ─────────────────── */

function generateMangalDoshaSection(data: ReportData, partnerData?: ReportData): ReportSection {
  const marsPlanet = data.natalChart.planets.find(p => p.name === "Mars")!
  const marsSign = marsPlanet.sign.name
  const marsHouse = marsPlanet.house
  const marsNakshatra = marsPlanet.nakshatra?.name || "unknown"
  const marsRetrograde = marsPlanet.retrograde ? " (retrograde)" : ""

  const mangalDosha = data.doshas.find(d => d.type === "Mangal Dosha")
  const partnerMangal = partnerData ? partnerData.doshas.find(d => d.type === "Mangal Dosha") : undefined
  const partnerMars = partnerData ? partnerData.natalChart.planets.find(p => p.name === "Mars") : undefined

  let content = `**MARS & MARRIAGE COMPATIBILITY**\n\n`

  content += `Your Mars is in the ${getOrdinal(marsHouse)} house, ${marsSign}, ${marsNakshatra}${marsRetrograde}.\n\n`

  const doshicHouses = [2, 7, 8, 12]
  const hasMangalDosha = doshicHouses.includes(marsHouse)

  if (hasMangalDosha) {
    content += `**MANGAL DOSHA PRESENT**\n\n`

    content += `Mars in house ${marsHouse} is traditionally considered inauspicious for marriage. `

    if (marsHouse === 7) {
      content += `Mars directly in the marriage house (7th) creates friction in the partnership itself. This is the most severe Mangal Dosha placement, as it affects both partners' satisfaction and harmony.\n\n`
    } else if (marsHouse === 8) {
      content += `Mars in the 8th house affects intimacy, longevity, and transformation in marriage. Partners may face sudden changes or intense power dynamics requiring conscious navigation.\n\n`
    } else if (marsHouse === 2) {
      content += `Mars in the 2nd house (family, wealth) creates friction over finances and family integration. Disagreements about shared resources or in-law dynamics are likely.\n\n`
    } else if (marsHouse === 12) {
      content += `Mars in the 12th house (losses, spiritual matters) can create hidden tensions or expenses in marriage, though this is the mildest form of Mangal Dosha.\n\n`
    }

    content += `**Cancellation Factors**\n\n`
    const cancellations = checkMangalCancellations(data)
    if (cancellations.length > 0) {
      content += `Your Dosha is MITIGATED by:\n`
      for (const factor of cancellations) {
        content += `• ${factor}\n`
      }
      content += `\nWith these cancellations, the Dosha's severity is reduced. A partner with Mangal Dosha or strong 7th house strength can still create harmony.\n\n`
    } else {
      content += `NO CANCELLATION FACTORS present. The Dosha is ACTIVE.\n\n`
      content += `**Partner Requirement:** Seek a partner who ALSO has Mangal Dosha in the same house (2, 7, 8, or 12) to balance Mars energies, OR a partner with exceptionally strong 7th house lordship, strong Venus, and Jupiter support.\n\n`
    }
  } else {
    content += `**NO MANGAL DOSHA**\n\n`
    content += `Mars is in house ${marsHouse}, which is not traditionally doshic for marriage. `
    if ([1, 4, 5, 9, 10, 11].includes(marsHouse)) {
      content += `This placement is actually favorable or neutral for marriage.\n\n`
    } else {
      content += `While not classically doshic, Mars's influence on partnership is moderated by its sign strength and aspects.\n\n`
    }
  }

  if (partnerData && partnerMars) {
    content += `**PARTNER'S MARS: ${getOrdinal(partnerMars.house)} house, ${partnerMars.sign.name}**\n\n`

    if (hasMangalDosha && partnerMangal) {
      const partnerDoshicHouses = [2, 7, 8, 12]
      if (partnerDoshicHouses.includes(partnerMars.house)) {
        content += `Both charts have Mangal Dosha. This is actually FAVORABLE for compatibility—both understand Mars energy, and neither partner bears the Dosha alone.\n\n`
      } else {
        content += `Your partner does not have Mangal Dosha. This creates imbalance; Mars energy from you may cause tension for a partner unprepared for it.\n\n`
      }
    } else if (hasMangalDosha && !partnerMangal) {
      content += `Your partner has NO Mangal Dosha. Your Mars affliction must be offset by exceptional 7th house strength and Venus placement in your partner's chart.\n\n`
    }
  }

  content += `**Mars Sign & Nature**\n\n`
  content += `Mars in ${marsSign} expresses aggression and passion through ${getMarsSignCharacter(marsSign)} qualities. `
  content += `In marriage, this translates to ${getMarsMarriageDynamics(marsSign)}. A partner who appreciates or matches this energy will thrive; one who conflicts with it will struggle.\n`

  return {
    title: "Mars & Marriage Compatibility",
    content,
  }
}

/* ─── Section 3: Communication & Emotional Patterns ────── */

function generateCommunicationSection(data: ReportData, partnerData?: ReportData): ReportSection {
  const mercury = data.natalChart.planets.find(p => p.name === "Mercury")!
  const mercurySign = mercury.sign.name
  const mercuryHouse = mercury.house
  const mercuryDignity = mercury.dignity || "unclear"

  const moon = data.natalChart.planets.find(p => p.name === "Moon")!
  const moonSign = moon.sign.name
  const moonHouse = moon.house

  const partnerMercury = partnerData ? partnerData.natalChart.planets.find(p => p.name === "Mercury") : undefined
  const partnerMoon = partnerData ? partnerData.natalChart.planets.find(p => p.name === "Moon") : undefined

  let content = `**COMMUNICATION & EMOTIONAL PATTERNS**\n\n`

  content += `**Your Mercury: ${mercurySign} (House ${mercuryHouse}, ${mercuryDignity})**\n\n`
  content += `Your communication style is: ${getMercuryCommunicationStyle(mercurySign)}. `

  if (mercurySign === "Gemini" || mercurySign === "Virgo") {
    content += `As Mercury's natural sign, you think and speak analytically. You excel at dialogue, debate, and intellectual exchange. You need a partner who can keep pace intellectually.\n\n`
  } else if (mercurySign === "Aries" || mercurySign === "Scorpio") {
    content += `You communicate with intensity and directness. You don't filter or soften your words, which can feel harsh to emotionally sensitive partners. Conscious gentleness improves harmony.\n\n`
  } else if (mercurySign === "Cancer" || mercurySign === "Pisces") {
    content += `Your communication is emotional and intuitive. You speak from feeling, not logic. Partners who hear "between the lines" will understand you; literal thinkers may misinterpret your words.\n\n`
  } else if (mercurySign === "Leo") {
    content += `You speak with authority and confidence. You need admiration and validation for your ideas. Partners should respect your perspective to keep communication flowing.\n\n`
  } else if (mercurySign === "Sagittarius") {
    content += `You communicate with enthusiasm and broad strokes. You may miss details; partners detail-oriented can complement you well.\n\n`
  } else if (mercurySign === "Capricorn") {
    content += `You communicate cautiously, preferring formal and structured dialogue. You need time to open up emotionally; a patient partner won't rush you.\n\n`
  } else {
    content += `Your communication adapts based on your partner's style. You can code-switch between logic and emotion.\n\n`
  }

  content += `**Your Moon: ${moonSign} (House ${moonHouse})**\n\n`
  content += `Your emotional landscape: ${describeMoonSignNeeds(moonSign)}. `
  content += `You need a partner who provides ${getMoonEmotionalNeeds(moonSign)} to feel safe and secure. `
  content += `Without these, you withdraw or become reactive. This is NON-NEGOTIABLE for marriage satisfaction.\n\n`

  if (partnerData && partnerMercury && partnerMoon) {
    content += `**COMMUNICATION COMPATIBILITY WITH YOUR PARTNER**\n\n`

    const mercuryDistance = calculateSignDistance(mercurySign, partnerMercury.sign.name)
    content += `Your Mercury (${mercurySign}) to Partner's Mercury (${partnerMercury.sign.name}):\n`
    if (mercuryDistance <= 2 || mercuryDistance === 11) {
      content += `Harmonious (${mercuryDistance}-sign distance). You both communicate in similar ways. Dialogue flows easily.\n\n`
    } else if (mercuryDistance === 3 || mercuryDistance === 4 || mercuryDistance === 9) {
      content += `Compatible (${mercuryDistance}-sign distance). One is more analytical, the other more intuitive, but you complement each other.\n\n`
    } else if (mercuryDistance === 6) {
      content += `Opposite (${mercuryDistance}-sign distance). You see things differently. One is logical, the other emotional. Requires translating for each other.\n\n`
    } else {
      content += `Challenging (${mercuryDistance}-sign distance). You may talk past each other. Intentional listening is critical.\n\n`
    }

    const moonDistance = calculateSignDistance(moonSign, partnerMoon.sign.name)
    content += `Your Moon (${moonSign}) to Partner's Moon (${partnerMoon.sign.name}):\n`
    if (moonDistance <= 2 || moonDistance === 11) {
      content += `Harmonious (${moonDistance}-sign distance). You intuitively understand each other's emotional needs. This is a deep advantage for marriage.\n\n`
    } else if (moonDistance === 3 || moonDistance === 4 || moonDistance === 9) {
      content += `Compatible (${moonDistance}-sign distance). You have different emotional styles but can adapt to each other with effort.\n\n`
    } else if (moonDistance === 6) {
      content += `Opposite (${moonDistance}-sign distance). Your emotional needs are polarized. One seeks intensity, the other calm; one needs independence, the other togetherness. Both must actively honor the other's style.\n\n`
    } else {
      content += `Challenging (${moonDistance}-sign distance). Emotional patterns clash. One feels hurt while the other doesn't understand why. Requires explicit communication about feelings.\n\n`
    }
  }

  content += `**How You Work Together**\n\n`
  content += `Emotional intimacy (Moon) and intellectual understanding (Mercury) must BOTH be present. `
  content += `If Mercury is harmonious but Moon is not, you communicate well but feel emotionally disconnected. `
  content += `If Moon is harmonious but Mercury clashes, you feel close but misunderstand each other's words. `
  content += `Seek a partner where at least one is harmonious—ideally both.\n`

  return {
    title: "Communication & Emotional Patterns",
    content,
  }
}

/* ─── Section 4: Long-term Relationship Potential ────────── */

function generateLongTermPotentialSection(data: ReportData, partnerData?: ReportData): ReportSection {
  const navamsa = data.navamsaChart
  const house7 = data.houseAnalysis.find(h => h.house === 7)
  const venus = data.natalChart.planets.find(p => p.name === "Venus")!
  const venusSign = venus.sign.name
  const venusHouse = venus.house

  const currentMaha = data.dashaAnalysis?.currentMahadasha || "unknown"
  const currentAnta = data.dashaAnalysis?.currentAntardasha || "unknown"

  const partnerNavamsa = partnerData ? partnerData.navamsaChart : undefined
  const partnerHouse7 = partnerData ? partnerData.houseAnalysis.find(h => h.house === 7) : undefined
  const partnerVenus = partnerData ? partnerData.natalChart.planets.find(p => p.name === "Venus") : undefined

  let content = `**LONG-TERM COMPATIBILITY & MARRIAGE TIMING**\n\n`

  content += `**Venus in ${venusSign} (House ${venusHouse}): Romance & Commitment**\n\n`
  content += `Venus governs your romantic desires and marriage satisfaction. `
  content += `Venus in ${venusSign} shows you value ${getVenusRomanticExpression(venusSign)} in partnership. `
  content += `${venusHouse === 7 ? "Remarkably, Venus in the 7th house is the single strongest indicator of marriage happiness and partner satisfaction." : "In house " + venusHouse + ", Venus's marriage influence is moderated by that house's themes."}\n\n`

  content += `**7th House (Marriage): ${house7?.sign || "—"}, Ruled by ${house7?.lord || "—"}**\n\n`
  if (house7) {
    content += `Your 7th house is in ${house7.sign}. Marriage will manifest through ${house7Description(house7.sign)} qualities. `
    if (house7.planetsInHouse && house7.planetsInHouse.length > 0) {
      content += `Planets in your 7th (${house7.planetsInHouse.join(", ")}) actively shape when and how marriage occurs:\n`
      for (const planet of house7.planetsInHouse) {
        content += `• ${planet} in the 7th: ${explainPlanetInHouse7(planet)}\n`
      }
      content += `\n`
    } else {
      content += `No planets in the 7th; the house's lord (${house7.lord}) determines marriage outcomes based on its placement in your chart.\n\n`
    }
  }

  content += `**Navamsa (D9) — Marriage's Spiritual Foundation**\n\n`
  if (navamsa && navamsa.planets) {
    const navamsaMoon = navamsa.planets.find(p => p.name === "Moon")
    const navamsaVenus = navamsa.planets.find(p => p.name === "Venus")

    if (navamsaMoon) {
      content += `Your Navamsa Moon is in ${navamsaMoon.sign.name}. The D9 chart reveals the karmic and spiritual dimension of your marriage. `
      content += `A well-placed Navamsa Moon indicates deep emotional satisfaction in partnership.\n`
    }
    if (navamsaVenus) {
      content += `Navamsa Venus is in ${navamsaVenus.sign.name}. This shows the permanence of romantic attraction over years.\n\n`
    }
  }

  content += `**Dasha Timing: Marriage Windows**\n\n`
  content += `You are currently in ${currentMaha} Mahadasha (${currentAnta} Antardasha).\n\n`

  const dashaTimeline = data.dashaTimeline.slice(0, 8)
  content += `Upcoming periods (Marriage most likely during Venus, 7th House Lord, or favorable Jupiter Mahadashas):\n\n`
  for (const period of dashaTimeline) {
    const startYear = new Date(period.startDate).getFullYear()
    content += `• **${period.mahadasha} (${startYear}+)**: ${describeDashaForMarriage(period.mahadasha, house7?.lord)}\n`
  }
  content += `\nMarriage may occur when Venus or 7th house lordship dominates your Dasha cycle. If in such a period now, partnership opportunities are heightened.\n\n`

  if (partnerData) {
    content += `**PARTNER'S TIMING**\n\n`
    content += `Your partner is in ${partnerData.dashaAnalysis?.currentMahadasha || "unknown"} Mahadasha. `
    content += `For marriage success, both should be in FAVORABLE periods (Venus, Jupiter, benefic lords). `
    content += `If one is in Saturn or Mars while the other is in Venus, the marriage begins under unequal cosmic support—requiring extra effort.\n\n`

    if (partnerHouse7) {
      content += `Their 7th house is in ${partnerHouse7.sign}. Combined with your 7th in ${house7?.sign || "—"}, this creates the marriage dynamic between you both.\n\n`
    }

    if (partnerVenus) {
      content += `Their Venus is in ${partnerVenus.sign.name}. Your Venus (${venusSign}) and their Venus form the romantic axis. `
      const venusDistance = calculateSignDistance(venusSign, partnerVenus.sign.name)
      if (venusDistance <= 2 || venusDistance === 11) {
        content += `They're harmonious—you both seek similar romantic expressions.\n\n`
      } else if (venusDistance === 6) {
        content += `They're opposite—complementary desires, but both must appreciate the other's style.\n\n`
      } else {
        content += `They're at ${venusDistance}-sign distance—different romantic needs requiring negotiation.\n\n`
      }
    }
  }

  content += `**Long-Term Durability**\n\n`
  content += `Lasting marriage requires three foundations: (1) compatible emotional/intellectual (Moon/Mercury synastry), (2) healthy Venus/7th house positions (marriage satisfaction), and (3) favorable Dasha timing (external support). `
  content += `If all three align, marriage is durable. If one is weak, consciously strengthen through communication and remedies. If two are weak, professional guidance is essential.\n`

  return {
    title: "Long-term Compatibility & Marriage Timing",
    content,
  }
}

/* ─── Section 5: Remedies for Harmony ─────────────────── */

function generateRemedialsSection(data: ReportData, partnerData?: ReportData): ReportSection {
  let content = `**Remedies for Marriage Harmony**\n\n`

  content += `Vedic astrology offers time-tested remedies to strengthen marriage and mitigate incompatibilities. These are not religious obligations but tools for aligning consciousness with cosmic harmony.\n\n`

  content += `**Mangal Dosha Remedies**\n\n`
  const mangal = data.doshas.find(d => d.type === "Mangal Dosha")
  if (mangal) {
    content += `**Mars Mantra:** Recite "Om Mangalaya Namaha" 108 times on Tuesdays (Mars's day). This invokes Mars's protective and passionate energy for marriage.\n\n`
    content += `**Mars Gemstone:** Wear Red Coral (Moonga) in gold on the ring finger of the right hand. Consult an astrologer for proper wearing procedure and positive timing.\n\n`
    content += `**Ritual:** Perform Mars Puja on Tuesdays or during auspicious Muhurtas. Offer red flowers and food items ruled by Mars (spicy items, red lentils).\n\n`
  } else {
    content += `Your chart does not have Mangal Dosha, so Mars remedies are not essential. However, strengthening Mars through activities (sports, exercise, courage-building) supports passionate and vital partnership.\n\n`
  }

  content += `**Venus Strengthening (Love & Affection)**\n\n`
  const venus = data.natalChart.planets.find(p => p.name === "Venus")!
  content += `**Venus Mantra:** Recite "Om Shukraya Namaha" 108 times on Fridays. This enhances love, harmony, and attraction.\n\n`
  content += `**Venus Gemstone:** Diamond or White Sapphire (Pukhraj or Heera) worn in silver or platinum on the ring finger strengthens romantic expression and mutual love.\n\n`
  content += `**Venus Ritual:** Wear white and light colors on Fridays. Offer white flowers and sweets to Venus. Cultivate appreciation for beauty, art, and music.\n\n`

  content += `**Mercury Strengthening (Communication)**\n\n`
  content += `**Mercury Mantra:** Recite "Om Budhaya Namaha" 108 times on Wednesdays for clear, harmonious communication.\n\n`
  content += `**Mercury Gemstone:** Emerald (Panna) in gold on the little finger enhances intellectual understanding and mental clarity in relationships.\n\n`
  content += `**Mercury Ritual:** Engage in writing, reading, and honest conversation. Journaling feelings and sharing thoughts with your partner strengthens Mercury.\n\n`

  content += `**Moon Strengthening (Emotional Security)**\n\n`
  content += `**Moon Mantra:** Recite "Om Chandraya Namaha" 108 times on Mondays for emotional peace and nurturing energy.\n\n`
  content += `**Moon Gemstone:** Pearl (Moti) in silver on the little finger calms the mind and promotes emotional stability in marriage.\n\n`
  content += `**Moon Ritual:** Observe Moonfast days (new and full moons) with meditation or simple fasting. Spend quiet time with your partner; honor emotional intimacy.\n\n`

  content += `**Universal Marriage Remedies**\n\n`
  content += `• **Spiritual Practice:** Regular meditation, yoga, and pranayama attune both partners to higher consciousness, transcending ego conflicts.\n\n`
  content += `• **Charities:** Donate to marriage-related charities (wedding funds for poor families, marriage counseling services) to invoke blessings on your own marriage.\n\n`
  content += `• **Rudra Abhisheka:** Perform or sponsor a Rudra Abhisheka (Shiva ritual) for marriage stability and divine blessing.\n\n`
  content += `• **Conscious Communication:** The most powerful remedy is clear, loving, and honest dialogue. Astrology guides timing and understanding; your commitment creates reality.\n\n`

  content += `All remedies work best when combined with conscious effort to understand and support your partner. Astrological tools illuminate the path; your choices walk it.\n`

  return {
    title: "Remedies for Harmony",
    content,
  }
}

/* ─── Summary ─────────────────────────────────────────── */

function generateSummary(data: ReportData, partnerData?: ReportData): string {
  if (partnerData) {
    const nativeNak = data.nakshatraAnalysis.name
    const partnerNak = partnerData.nakshatraAnalysis.name
    return (
      `This Kundli Match Report analyzes the compatibility between ${data.name} (${nativeNak} Nakshatra) ` +
      `and ${partnerData.name} (${partnerNak} Nakshatra) using Ashtakoot Guna Milan and classical Jyotish principles. ` +
      `The report evaluates eight dimensions of compatibility, analyzes Mangal Dosha, communication patterns, ` +
      `long-term relationship support through Navamsa and Dasha periods, and provides Vedic remedies to strengthen harmony. ` +
      `All analysis is derived entirely from calculated birth chart data with no AI involvement.`
    )
  }

  return (
    `This Kundli Compatibility Profile describes ${data.name}'s marriage potential based on Moon sign, Nakshatra, ` +
    `Venus placement, and House 7 analysis. It identifies the qualities and compatibility factors to seek in a partner, ` +
    `evaluates Mangal Dosha and communication style, and provides remedies to strengthen marriage prospects. ` +
    `When a partner's chart becomes available, detailed Ashtakoot Guna Milan analysis can be performed. ` +
    `All analysis is derived entirely from calculated birth chart data with no AI involvement.`
  )
}

/* ─── Helper: Ashtakoot Calculation ───────────────────── */

function calculateAshtakoot(
  nativeNak: NakshatraGuna,
  partnerNak: NakshatraGuna,
  nativeMoonSign: string,
  partnerMoonSign: string,
  natalChart: any
): AshtakootScores {
  // 1. Varna (1 point max)
  const varnaScore = calculateVarna(nativeMoonSign, partnerMoonSign)

  // 2. Vashya (2 points max)
  const vashyaScore = calculateVashya(nativeMoonSign, partnerMoonSign)

  // 3. Tara (3 points max)
  const taraScore = calculateTara(nativeNak.index, partnerNak.index)

  // 4. Yoni (4 points max)
  const yoniScore = calculateYoni(nativeNak.animal, partnerNak.animal)

  // 5. Graha Maitri (5 points max)
  const maitriScore = calculateGrahaMaitri(nativeNak.lord, partnerNak.lord)

  // 6. Gana (6 points max)
  const ganaScore = calculateGana(nativeNak.gana, partnerNak.gana)

  // 7. Bhakoot (7 points max)
  const bhakootScore = calculateBhakoot(nativeMoonSign, partnerMoonSign)

  // 8. Nadi (8 points max) — MOST IMPORTANT
  const nadiScore = calculateNadi(nativeNak.nadi, partnerNak.nadi)

  const total = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore
  const maxTotal = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8

  return {
    varna: varnaScore,
    vashya: vashyaScore,
    tara: taraScore,
    yoni: yoniScore,
    grahaMaitri: maitriScore,
    gana: ganaScore,
    bhakoot: bhakootScore,
    nadi: nadiScore,
    total,
    maxTotal,
  }
}

function calculateVarna(nativeMoonSign: string, partnerMoonSign: string): number {
  // Varna based on Moon sign element/caste
  // Brahmin (Fire), Kshatriya (Earth), Vaishya (Air), Shudra (Water)
  const varnaMap: Record<string, string> = {
    "Aries": "Brahmin", "Leo": "Brahmin", "Sagittarius": "Brahmin",
    "Taurus": "Kshatriya", "Virgo": "Kshatriya", "Capricorn": "Kshatriya",
    "Gemini": "Vaishya", "Libra": "Vaishya", "Aquarius": "Vaishya",
    "Cancer": "Shudra", "Scorpio": "Shudra", "Pisces": "Shudra",
  }

  return varnaMap[nativeMoonSign] === varnaMap[partnerMoonSign] ? 0 : 1
}

function calculateVashya(nativeMoonSign: string, partnerMoonSign: string): number {
  // Vashya: mutual control/dominance
  // Human: Gemini, Virgo, Libra
  // Quadruped: Aries, Taurus, Leo, Sagittarius
  // Water: Cancer, Scorpio, Pisces
  // Insect: Virgo (special)
  // Wild: Scorpio (special)

  const vashyaMap: Record<string, string> = {
    "Gemini": "Human", "Virgo": "Human", "Libra": "Human",
    "Aries": "Quadruped", "Taurus": "Quadruped", "Leo": "Quadruped", "Sagittarius": "Quadruped",
    "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water",
  }

  const nativeVashya = vashyaMap[nativeMoonSign] || "Neutral"
  const partnerVashya = vashyaMap[partnerMoonSign] || "Neutral"

  // Same Vashya = less compatible, different = more compatible
  if (nativeVashya === partnerVashya) {
    // Check for special relationships
    if ((nativeMoonSign === "Leo" && partnerMoonSign === "Pisces") ||
        (nativeMoonSign === "Pisces" && partnerMoonSign === "Leo")) return 2
    if ((nativeMoonSign === "Aries" && partnerMoonSign === "Cancer") ||
        (nativeMoonSign === "Cancer" && partnerMoonSign === "Aries")) return 2
    return 0 // Same vashya, low compatibility
  }

  return 2 // Different vashya, high compatibility
}

function calculateTara(nativeIndex: number, partnerIndex: number): number {
  // Tara: Based on lunar day counting
  // Distance between nakshatras in lunar calendar
  const diff = Math.abs(partnerIndex - nativeIndex)
  const distance = Math.min(diff, 27 - diff)

  // Tara values based on distance
  if (distance === 2 || distance === 5 || distance === 7 || distance === 10 || distance === 12 || distance === 15 || distance === 17 || distance === 20 || distance === 22 || distance === 25) return 3
  if (distance === 1 || distance === 4 || distance === 9 || distance === 13 || distance === 16 || distance === 21) return 2
  return 0
}

function calculateYoni(nativeAnimal: string, partnerAnimal: string): number {
  // Yoni compatibility based on animal types
  const yoniMatrices: Record<string, Record<string, number>> = {
    Horse: { Horse: 0, Elephant: 4, Sheep: 0, Serpent: 1, Dog: 0, Cat: 3, Buffalo: 2, Tiger: 0, Rat: 3, Mongoose: 1, Lion: 2, Monkey: 3, Cow: 2, Deer: 4, Goat: 0 },
    Elephant: { Horse: 4, Elephant: 0, Sheep: 1, Serpent: 2, Dog: 0, Cat: 0, Buffalo: 4, Tiger: 2, Rat: 0, Mongoose: 3, Lion: 0, Monkey: 0, Cow: 4, Deer: 1, Goat: 2 },
    Sheep: { Horse: 0, Elephant: 1, Sheep: 0, Serpent: 3, Dog: 1, Cat: 0, Buffalo: 0, Tiger: 2, Rat: 1, Mongoose: 4, Lion: 0, Monkey: 2, Cow: 4, Deer: 0, Goat: 4 },
    Serpent: { Horse: 1, Elephant: 2, Sheep: 3, Serpent: 0, Dog: 4, Cat: 3, Buffalo: 1, Tiger: 3, Rat: 2, Mongoose: 0, Lion: 2, Monkey: 1, Cow: 0, Deer: 2, Goat: 3 },
    Dog: { Horse: 0, Elephant: 0, Sheep: 1, Serpent: 4, Dog: 0, Cat: 0, Buffalo: 2, Tiger: 3, Rat: 0, Mongoose: 3, Lion: 1, Monkey: 0, Cow: 3, Deer: 4, Goat: 2 },
    Cat: { Horse: 3, Elephant: 0, Sheep: 0, Serpent: 3, Dog: 0, Cat: 0, Buffalo: 0, Tiger: 4, Rat: 0, Mongoose: 2, Lion: 2, Monkey: 0, Cow: 1, Deer: 0, Goat: 1 },
    Buffalo: { Horse: 2, Elephant: 4, Sheep: 0, Serpent: 1, Dog: 2, Cat: 0, Buffalo: 0, Tiger: 2, Rat: 0, Mongoose: 1, Lion: 0, Monkey: 2, Cow: 3, Deer: 0, Goat: 1 },
    Tiger: { Horse: 0, Elephant: 2, Sheep: 2, Serpent: 3, Dog: 3, Cat: 4, Buffalo: 2, Tiger: 0, Rat: 1, Mongoose: 2, Lion: 1, Monkey: 3, Cow: 0, Deer: 3, Goat: 0 },
    Rat: { Horse: 3, Elephant: 0, Sheep: 1, Serpent: 2, Dog: 0, Cat: 0, Buffalo: 0, Tiger: 1, Rat: 0, Mongoose: 4, Lion: 3, Monkey: 1, Cow: 0, Deer: 2, Goat: 1 },
    Mongoose: { Horse: 1, Elephant: 3, Sheep: 4, Serpent: 0, Dog: 3, Cat: 2, Buffalo: 1, Tiger: 2, Rat: 4, Mongoose: 0, Lion: 2, Monkey: 1, Cow: 2, Deer: 4, Goat: 3 },
    Lion: { Horse: 2, Elephant: 0, Sheep: 0, Serpent: 2, Dog: 1, Cat: 2, Buffalo: 0, Tiger: 1, Rat: 3, Mongoose: 2, Lion: 0, Monkey: 4, Cow: 3, Deer: 0, Goat: 3 },
    Monkey: { Horse: 3, Elephant: 0, Sheep: 2, Serpent: 1, Dog: 0, Cat: 0, Buffalo: 2, Tiger: 3, Rat: 1, Mongoose: 1, Lion: 4, Monkey: 0, Cow: 2, Deer: 1, Goat: 0 },
    Cow: { Horse: 2, Elephant: 4, Sheep: 4, Serpent: 0, Dog: 3, Cat: 1, Buffalo: 3, Tiger: 0, Rat: 0, Mongoose: 2, Lion: 3, Monkey: 2, Cow: 0, Deer: 1, Goat: 3 },
    Deer: { Horse: 4, Elephant: 1, Sheep: 0, Serpent: 2, Dog: 4, Cat: 0, Buffalo: 0, Tiger: 3, Rat: 2, Mongoose: 4, Lion: 0, Monkey: 1, Cow: 1, Deer: 0, Goat: 0 },
    Goat: { Horse: 0, Elephant: 2, Sheep: 4, Serpent: 3, Dog: 2, Cat: 1, Buffalo: 1, Tiger: 0, Rat: 1, Mongoose: 3, Lion: 3, Monkey: 0, Cow: 3, Deer: 0, Goat: 0 },
  }

  return yoniMatrices[nativeAnimal]?.[partnerAnimal] ?? 2
}

function calculateGrahaMaitri(nativeLord: string, partnerLord: string): number {
  // Planetary friendship matrix
  const friendship: Record<string, Record<string, number>> = {
    Sun: { Sun: 5, Moon: 3, Mars: 5, Mercury: 3, Jupiter: 5, Venus: 0, Saturn: 0, Rahu: 3, Ketu: 3 },
    Moon: { Sun: 3, Moon: 5, Mars: 3, Mercury: 3, Jupiter: 3, Venus: 5, Saturn: 0, Rahu: 0, Ketu: 0 },
    Mars: { Sun: 5, Moon: 3, Mars: 5, Mercury: 3, Jupiter: 5, Venus: 0, Saturn: 0, Rahu: 3, Ketu: 5 },
    Mercury: { Sun: 3, Moon: 3, Mars: 3, Mercury: 5, Jupiter: 5, Venus: 5, Saturn: 3, Rahu: 3, Ketu: 3 },
    Jupiter: { Sun: 5, Moon: 3, Mars: 5, Mercury: 5, Jupiter: 5, Venus: 3, Saturn: 3, Rahu: 0, Ketu: 0 },
    Venus: { Sun: 0, Moon: 5, Mars: 0, Mercury: 5, Jupiter: 3, Venus: 5, Saturn: 5, Rahu: 5, Ketu: 3 },
    Saturn: { Sun: 0, Moon: 0, Mars: 0, Mercury: 3, Jupiter: 3, Venus: 5, Saturn: 5, Rahu: 5, Ketu: 5 },
    Rahu: { Sun: 3, Moon: 0, Mars: 3, Mercury: 3, Jupiter: 0, Venus: 5, Saturn: 5, Rahu: 5, Ketu: 3 },
    Ketu: { Sun: 3, Moon: 0, Mars: 5, Mercury: 3, Jupiter: 0, Venus: 3, Saturn: 5, Rahu: 3, Ketu: 5 },
  }

  return friendship[nativeLord]?.[partnerLord] ?? 2
}

function calculateGana(nativeGana: string, partnerGana: string): number {
  // Gana compatibility
  if (nativeGana === partnerGana) return 6 // Same gana
  if ((nativeGana === "Deva" && partnerGana === "Manushya") ||
      (nativeGana === "Manushya" && partnerGana === "Deva")) return 4 // Deva-Manushya compatible
  if ((nativeGana === "Manushya" && partnerGana === "Rakshasa") ||
      (nativeGana === "Rakshasa" && partnerGana === "Manushya")) return 4
  return 0 // Deva-Rakshasa conflict
}

function calculateBhakoot(nativeMoonSign: string, partnerMoonSign: string): number {
  // Bhakoot based on sign distance
  const signIndex: Record<string, number> = {
    "Aries": 0, "Taurus": 1, "Gemini": 2, "Cancer": 3, "Leo": 4, "Virgo": 5,
    "Libra": 6, "Scorpio": 7, "Sagittarius": 8, "Capricorn": 9, "Aquarius": 10, "Pisces": 11,
  }

  const diff = Math.abs((signIndex[nativeMoonSign] || 0) - (signIndex[partnerMoonSign] || 0))
  const distance = Math.min(diff, 12 - diff)

  // Bhakoot scores
  if (distance === 0) return 0
  if (distance === 2 || distance === 3 || distance === 5 || distance === 6 || distance === 10 || distance === 11) return 7
  if (distance === 1 || distance === 4) return 6
  return 5
}

function calculateNadi(nativeNadi: string, partnerNadi: string): number {
  // Nadi — MOST CRITICAL
  // Different Nadi = 8 points (excellent)
  // Same Nadi = 0 points (dosha, requires careful consideration)

  if (nativeNadi === partnerNadi) {
    return 0 // Same Nadi — critical incompatibility
  }

  return 8 // Different Nadi — excellent compatibility
}

/* ─── Helper: Mangal Dosha Cancellations ───────────────── */

function checkMangalCancellations(data: ReportData): string[] {
  const factors: string[] = []
  const mars = data.natalChart.planets.find(p => p.name === "Mars")!
  const moonSign = data.natalChart.planets.find(p => p.name === "Moon")!.sign.name

  // Cancellation 1: Mars exalted or own sign
  if (mars.dignity === "exalted" || mars.dignity === "own") {
    factors.push("Mars is exalted or in own sign, mitigating Dosha severity")
  }

  // Cancellation 2: Mars in 2nd house with benefic aspect
  if (mars.house === 2) {
    factors.push("Mars in 2nd house (less severe than 7th/8th); benefic influence reduces effects")
  }

  // Cancellation 3: Aspect from benefics
  const beneficAspects = ["Jupiter", "Venus", "Mercury"]
  const hasAspect = beneficAspects.some(b => {
    const planet = data.natalChart.planets.find(p => p.name === b)
    return planet && isAspecting(planet, mars)
  })

  if (hasAspect) {
    factors.push("Benefic planets (Jupiter/Venus) aspect Mars, providing protective influence")
  }

  // Cancellation 4: Jupiter in 7th or moon's sign
  const jupiter = data.natalChart.planets.find(p => p.name === "Jupiter")!
  if (jupiter.house === 7 || jupiter.sign.name === moonSign) {
    factors.push("Jupiter's presence in 7th house or Moon's sign provides blessings and protection")
  }

  return factors
}

function isAspecting(planet1: any, planet2: any): boolean {
  const diff = Math.abs(planet1.degree - planet2.degree)
  const angularDiff = diff > 180 ? 360 - diff : diff
  return angularDiff < 10 // Simplified aspect check
}

/* ─── Helper: Moon Sign Descriptions ────────────────────── */

function describeMoonSignEmotions(sign: string): string {
  const desc: Record<string, string> = {
    "Aries": "courage, independence, and passionate emotional expression",
    "Taurus": "stability, comfort, sensory pleasure, and steady affection",
    "Gemini": "intellectual stimulation, variety, and light emotional exchange",
    "Cancer": "deep emotional nurturing, family connection, and security",
    "Leo": "admiration, creative expression, and grand romantic gestures",
    "Virgo": "practical care, service to loved ones, and clear communication",
    "Libra": "harmony, balance, partnership, and aesthetic beauty",
    "Scorpio": "depth, transformation, intense loyalty, and hidden desires",
    "Sagittarius": "optimism, freedom, adventure, and philosophical growth",
    "Capricorn": "commitment, responsibility, respect, and quiet devotion",
    "Aquarius": "friendship, intellectual connection, and unconventional bonds",
    "Pisces": "compassion, spiritual connection, and intuitive understanding",
  }
  return desc[sign] || "emotional connection and understanding"
}

function describeMoonSignNeeds(sign: string): string {
  const needs: Record<string, string> = {
    "Aries": "independence, excitement, and passionate pursuit",
    "Taurus": "comfort, loyalty, physical affection, and financial security",
    "Gemini": "conversation, mental engagement, and intellectual peers",
    "Cancer": "emotional safety, family focus, and consistent nurturing",
    "Leo": "recognition, admiration, creative partnership, and confidence",
    "Virgo": "practical support, order, health consciousness, and reliability",
    "Libra": "partnership, beauty, social harmony, and balanced interaction",
    "Scorpio": "depth, honesty, intense connection, and shared transformation",
    "Sagittarius": "freedom, adventure, growth, and philosophical alignment",
    "Capricorn": "respect, commitment, responsibility, and enduring devotion",
    "Aquarius": "intellectual friendship, freedom, and unconventional acceptance",
    "Pisces": "spiritual connection, compassion, intuitive understanding, and gentleness",
  }
  return needs[sign] || "emotional understanding and security"
}

/* ═══════════════════════════════════════════════════════
   DATA-DRIVEN HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════ */

/* ─── Ashtakoot Explanation Helpers ──────────────────── */

function explainVarna(score: number, nativeMoonSign: string, partnerMoonSign: string): string {
  const varnaMap: Record<string, string> = {
    "Aries": "Brahmin", "Leo": "Brahmin", "Sagittarius": "Brahmin",
    "Taurus": "Kshatriya", "Virgo": "Kshatriya", "Capricorn": "Kshatriya",
    "Gemini": "Vaishya", "Libra": "Vaishya", "Aquarius": "Vaishya",
    "Cancer": "Shudra", "Scorpio": "Shudra", "Pisces": "Shudra",
  }
  const nativeVarna = varnaMap[nativeMoonSign]
  const partnerVarna = varnaMap[partnerMoonSign]

  if (score === 1) {
    return `Different Varnas (${nativeVarna} and ${partnerVarna}). Perfect: the partner uplifts your spiritual growth.`
  }
  return `Same Varna (both ${nativeVarna}). Requires conscious spiritual development; you share the same nature but may lack growth impetus.`
}

function explainVashya(score: number, nativeMoonSign: string, partnerMoonSign: string): string {
  const vashyaMap: Record<string, string> = {
    "Gemini": "Human", "Virgo": "Human", "Libra": "Human",
    "Aries": "Quadruped", "Taurus": "Quadruped", "Leo": "Quadruped", "Sagittarius": "Quadruped",
    "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water",
  }
  const nativeVashya = vashyaMap[nativeMoonSign] || "Neutral"
  const partnerVashya = vashyaMap[partnerMoonSign] || "Neutral"

  if (score === 2) {
    return `Different categories (${nativeVashya} and ${partnerVashya}). Strong mutual attraction and dynamic control.`
  } else if (score === 1) {
    return `Special compatible pairing despite same category. Mutual respect with adjustments.`
  }
  return `Same category (both ${nativeVashya}). Weak attraction; less magnetism between you.`
}

function explainTara(score: number, nativeIndex: number, partnerIndex: number, nativeName: string, partnerName: string): string {
  const diff = Math.abs(partnerIndex - nativeIndex)
  const distance = Math.min(diff, 27 - diff)

  if (score === 3) {
    return `${nativeName} to ${partnerName} is ${distance} nakshatras apart. Excellent health synchronicity; your life cycles align.`
  } else if (score === 2) {
    return `${nativeName} to ${partnerName} is ${distance} nakshatras apart. Good compatibility; minor adjustment periods.`
  }
  return `${nativeName} to ${partnerName} is ${distance} nakshatras apart. Health timing differs; monitor wellness during stressful periods.`
}

function explainYoni(score: number, nativeAnimal: string, partnerAnimal: string): string {
  if (score === 4) {
    return `${nativeAnimal} and ${partnerAnimal}: Excellent instinctive compatibility. Natural physical and sexual harmony.`
  } else if (score >= 2) {
    return `${nativeAnimal} and ${partnerAnimal}: Compatible with adjustment. Instinctive differences require communication.`
  }
  return `${nativeAnimal} and ${partnerAnimal}: Low compatibility. Significant instinctive and sexual differences; requires patience and understanding.`
}

function explainGrahaMaitri(score: number, nativeLord: string, partnerLord: string): string {
  if (score === 5) {
    return `${nativeLord} and ${partnerLord} are natural friends. Maximum planetary support for harmony.`
  } else if (score >= 3) {
    return `${nativeLord} and ${partnerLord} have favorable relationship. Good planetary cooperation.`
  }
  return `${nativeLord} and ${partnerLord} are less friendly or neutral. Planetary cooperation is weak; requires conscious effort.`
}

function explainGana(score: number, nativeGana: string, partnerGana: string): string {
  if (score === 6) {
    return `Both ${nativeGana} Gana. Perfect temperamental match; you behave and react similarly.`
  } else if (score >= 4) {
    return `${nativeGana} and ${partnerGana} Gana (compatible pairing). Good behavioral harmony with minor adjustments.`
  }
  return `${nativeGana} and ${partnerGana} Gana (incompatible). Temperament clashes; one is peaceful while the other is aggressive/passionate.`
}

function explainBhakoot(score: number, nativeMoonSign: string, partnerMoonSign: string): string {
  const signIndex: Record<string, number> = {
    "Aries": 0, "Taurus": 1, "Gemini": 2, "Cancer": 3, "Leo": 4, "Virgo": 5,
    "Libra": 6, "Scorpio": 7, "Sagittarius": 8, "Capricorn": 9, "Aquarius": 10, "Pisces": 11,
  }
  const diff = Math.abs((signIndex[nativeMoonSign] || 0) - (signIndex[partnerMoonSign] || 0))
  const distance = Math.min(diff, 12 - diff)

  if (score === 7) {
    return `${nativeMoonSign} to ${partnerMoonSign} (${distance} signs apart). Exceptional prosperity alignment; mutual wealth creation.`
  } else if (score >= 5) {
    return `${nativeMoonSign} to ${partnerMoonSign} (${distance} signs apart). Good financial prospects; favorable for shared goals.`
  }
  return `${nativeMoonSign} to ${partnerMoonSign} (${distance} signs apart). Variable fortune; financial planning and mutual support required.`
}

function explainNadi(score: number, nativeNadi: string, partnerNadi: string): string {
  if (score === 8) {
    return `${nativeNadi} (you) and ${partnerNadi} (partner). Different Nadis—EXCELLENT for health and nervous system continuity. Highly auspicious.`
  }
  return `Both ${nativeNadi} Nadi. CRITICAL: Same Nadi indicates severe health incompatibility. Traditional texts warn against this pairing; medical consultation and strong remedies essential.`
}

function identifyWeakAreas(scores: AshtakootScores): string {
  const weak = []
  if (scores.nadi === 0) weak.push("Nadi")
  if (scores.gana < 4) weak.push("Gana")
  if (scores.yoni < 2) weak.push("Yoni")
  if (scores.bhakoot < 5) weak.push("Bhakoot")
  return weak.join(", ")
}

/* ─── Moon Sign Compatibility Helpers ────────────────── */

function getHarmoniousMoonSigns(moonSign: string): string[] {
  const harmoniousMaps: Record<string, string[]> = {
    "Aries": ["Aries", "Leo", "Sagittarius", "Gemini", "Aquarius"],
    "Taurus": ["Taurus", "Virgo", "Capricorn", "Cancer", "Pisces"],
    "Gemini": ["Gemini", "Libra", "Aquarius", "Aries", "Leo"],
    "Cancer": ["Cancer", "Scorpio", "Pisces", "Taurus", "Virgo"],
    "Leo": ["Leo", "Sagittarius", "Aries", "Gemini", "Libra"],
    "Virgo": ["Virgo", "Capricorn", "Taurus", "Cancer", "Scorpio"],
    "Libra": ["Libra", "Aquarius", "Gemini", "Leo", "Sagittarius"],
    "Scorpio": ["Scorpio", "Pisces", "Cancer", "Virgo", "Capricorn"],
    "Sagittarius": ["Sagittarius", "Aries", "Leo", "Libra", "Aquarius"],
    "Capricorn": ["Capricorn", "Taurus", "Virgo", "Scorpio", "Pisces"],
    "Aquarius": ["Aquarius", "Gemini", "Libra", "Aries", "Sagittarius"],
    "Pisces": ["Pisces", "Cancer", "Scorpio", "Taurus", "Capricorn"],
  }
  return harmoniousMaps[moonSign] || []
}

function getCompatibleMoonSigns(moonSign: string): string[] {
  const compatible: Record<string, string[]> = {
    "Aries": ["Sagittarius", "Leo"],
    "Taurus": ["Capricorn", "Virgo"],
    "Gemini": ["Libra", "Aquarius"],
    "Cancer": ["Pisces", "Scorpio"],
    "Leo": ["Sagittarius", "Aries"],
    "Virgo": ["Capricorn", "Taurus"],
    "Libra": ["Aquarius", "Gemini"],
    "Scorpio": ["Pisces", "Cancer"],
    "Sagittarius": ["Aries", "Leo"],
    "Capricorn": ["Taurus", "Virgo"],
    "Aquarius": ["Gemini", "Libra"],
    "Pisces": ["Cancer", "Scorpio"],
  }
  return compatible[moonSign] || []
}

function getMoonEmotionalNeeds(sign: string): string {
  const needs: Record<string, string> = {
    "Aries": "independence, excitement, and passionate pursuit",
    "Taurus": "comfort, loyalty, physical affection, and financial security",
    "Gemini": "conversation, mental engagement, and intellectual peers",
    "Cancer": "emotional safety, family focus, and consistent nurturing",
    "Leo": "recognition, admiration, creative partnership, and confidence",
    "Virgo": "practical support, order, health consciousness, and reliability",
    "Libra": "partnership, beauty, social harmony, and balanced interaction",
    "Scorpio": "depth, honesty, intense connection, and shared transformation",
    "Sagittarius": "freedom, adventure, growth, and philosophical alignment",
    "Capricorn": "respect, commitment, responsibility, and enduring devotion",
    "Aquarius": "intellectual friendship, freedom, and unconventional acceptance",
    "Pisces": "spiritual connection, compassion, intuitive understanding, and gentleness",
  }
  return needs[sign] || "emotional understanding and security"
}

function getCompatibleGanas(gana: string): string[] {
  if (gana === "Deva") return ["Deva", "Manushya"]
  if (gana === "Manushya") return ["Manushya", "Deva"]
  return ["Rakshasa", "Manushya"]
}

function getIncompatibleGanas(gana: string): string[] {
  if (gana === "Deva") return ["Rakshasa"]
  if (gana === "Rakshasa") return ["Deva"]
  return []
}

function getNadiDifference(nadi: string): string {
  if (nadi === "Adi") return "Madhya or Antya"
  if (nadi === "Madhya") return "Adi or Antya"
  return "Adi or Madhya"
}

function getCompatibleAnimals(animal: string): string[] {
  const yoniMatrices: Record<string, string[]> = {
    "Horse": ["Elephant", "Cat", "Mongoose", "Buffalo", "Lion", "Cow", "Deer"],
    "Elephant": ["Horse", "Buffalo", "Cow", "Mongoose"],
    "Sheep": ["Serpent", "Mongoose", "Cow", "Goat"],
    "Serpent": ["Dog", "Tiger", "Cat"],
    "Dog": ["Serpent", "Tiger", "Lion", "Deer"],
    "Cat": ["Horse", "Serpent", "Tiger"],
    "Buffalo": ["Horse", "Elephant", "Tiger", "Cow"],
    "Tiger": ["Dog", "Cat", "Serpent", "Monkey", "Deer"],
    "Rat": ["Mongoose", "Lion", "Monkey"],
    "Mongoose": ["Elephant", "Sheep", "Dog", "Cow", "Deer"],
    "Lion": ["Monkey", "Rat", "Cow", "Lion", "Goat"],
    "Monkey": ["Lion", "Tiger"],
    "Cow": ["Horse", "Elephant", "Sheep", "Buffalo", "Lion", "Mongoose"],
    "Deer": ["Horse", "Dog", "Mongoose", "Goat"],
    "Goat": ["Sheep", "Serpent", "Goat", "Cow"],
  }
  return yoniMatrices[animal] || []
}

function getVenusRomanticExpression(sign: string): string {
  const venus: Record<string, string> = {
    "Aries": "passionate, energetic, and direct romantic expression; you initiate and pursue",
    "Taurus": "sensual, loyal, and physically affectionate; you value lasting commitment",
    "Gemini": "flirtatious, intellectual, and verbal; you need mental connection and stimulation",
    "Cancer": "deeply emotional, nurturing, and family-oriented; you seek emotional security in love",
    "Leo": "grand, confident, generous romance; you want admiration and creative partnership",
    "Virgo": "devoted, practical, and service-oriented; you show love through care and reliability",
    "Libra": "balanced, aesthetic, and partnership-focused; you value harmony and beauty in love",
    "Scorpio": "intense, transformative, and intimate; you seek depth and truth in connection",
    "Sagittarius": "adventurous, optimistic, and freedom-loving; you need growth and exploration together",
    "Capricorn": "committed, responsible, respectful; you build love through enduring devotion",
    "Aquarius": "unconventional, intellectually engaged, and friendship-based; you need independence in partnership",
    "Pisces": "romantic, spiritual, compassionate; you seek soulmate connection and mutual transcendence",
  }
  return venus[sign] || "romantic connection and shared values"
}

function getCompatibleVenusSignsFor(venusSign: string): string[] {
  const compatible: Record<string, string[]> = {
    "Aries": ["Leo", "Sagittarius", "Gemini", "Aquarius"],
    "Taurus": ["Capricorn", "Virgo", "Cancer", "Pisces"],
    "Gemini": ["Aquarius", "Libra", "Aries", "Leo"],
    "Cancer": ["Pisces", "Scorpio", "Taurus", "Virgo"],
    "Leo": ["Aries", "Sagittarius", "Libra", "Gemini"],
    "Virgo": ["Capricorn", "Taurus", "Scorpio", "Cancer"],
    "Libra": ["Aquarius", "Gemini", "Sagittarius", "Leo"],
    "Scorpio": ["Cancer", "Pisces", "Capricorn", "Virgo"],
    "Sagittarius": ["Aries", "Leo", "Libra", "Aquarius"],
    "Capricorn": ["Taurus", "Virgo", "Pisces", "Scorpio"],
    "Aquarius": ["Gemini", "Libra", "Aries", "Sagittarius"],
    "Pisces": ["Cancer", "Scorpio", "Taurus", "Capricorn"],
  }
  return compatible[venusSign] || []
}

function getMercuryCommunicationStyle(sign: string): string {
  const mercury: Record<string, string> = {
    "Aries": "direct, passionate, and assertive",
    "Taurus": "steady, practical, and grounded",
    "Gemini": "articulate, curious, and quick-witted",
    "Cancer": "intuitive, emotional, and protective",
    "Leo": "confident, authoritative, and expressive",
    "Virgo": "precise, analytical, and detail-oriented",
    "Libra": "diplomatic, balanced, and socially adept",
    "Scorpio": "intense, probing, and investigative",
    "Sagittarius": "enthusiastic, expansive, and big-picture",
    "Capricorn": "cautious, formal, and measured",
    "Aquarius": "innovative, abstract, and unconventional",
    "Pisces": "intuitive, artistic, and emotionally perceptive",
  }
  return mercury[sign] || "adaptive and context-aware"
}

function getMarsSignCharacter(sign: string): string {
  const mars: Record<string, string> = {
    "Aries": "bold, impulsive, and fearless",
    "Taurus": "stubborn, determined, and steady",
    "Gemini": "argumentative, restless, and strategic",
    "Cancer": "defensive, emotional, and moody",
    "Leo": "proud, aggressive, and dominant",
    "Virgo": "critical, perfectionist, and analytical",
    "Libra": "diplomatic, indecisive, and conflicted",
    "Scorpio": "secretive, intense, and vengeful",
    "Sagittarius": "impulsive, adventurous, and reckless",
    "Capricorn": "strategic, controlling, and ambitious",
    "Aquarius": "rebellious, disruptive, and idealistic",
    "Pisces": "passive-aggressive, escapist, and subtle",
  }
  return mars[sign] || "complex and context-dependent"
}

function getMarsMarriageDynamics(sign: string): string {
  const dynamics: Record<string, string> = {
    "Aries": "intense passion, direct confrontation, quick resolution",
    "Taurus": "possessiveness, sexual appetite, financial control",
    "Gemini": "verbal sparring, intellectual debate, restlessness",
    "Cancer": "emotional volatility, defensiveness, family-centeredness",
    "Leo": "dominance-seeking, grand displays, pride conflicts",
    "Virgo": "criticism, perfectionism, nervous tension",
    "Libra": "avoidance of conflict, passive-aggression, indecision",
    "Scorpio": "power struggles, sexual intensity, secrecy",
    "Sagittarius": "wanderlust, carelessness, philosophical conflict",
    "Capricorn": "control, coldness, ambition-driven dynamics",
    "Aquarius": "rebellion, detachment, need for freedom",
    "Pisces": "confusion, escapism, martyr complex",
  }
  return dynamics[sign] || "complex partnership dynamics"
}

function house7Description(sign: string): string {
  const h7: Record<string, string> = {
    "Aries": "passionate, direct, and energetic partnership",
    "Taurus": "stable, sensual, and devoted marriage",
    "Gemini": "intellectual, communicative, and mentally stimulating partnership",
    "Cancer": "emotional, nurturing, and family-integrated marriage",
    "Leo": "proud, creative, and admiration-based partnership",
    "Virgo": "practical, service-oriented, and health-conscious marriage",
    "Libra": "harmonious, aesthetic, and socially valued partnership",
    "Scorpio": "intense, transformative, and passionate marriage",
    "Sagittarius": "adventurous, philosophical, and growth-oriented partnership",
    "Capricorn": "committed, responsible, and enduring marriage",
    "Aquarius": "unconventional, intellectual, and freedom-respecting partnership",
    "Pisces": "spiritual, romantic, and spiritually merged marriage",
  }
  return h7[sign] || "unique partnership dynamics"
}

function explainPlanetInHouse7(planet: string): string {
  const h7planets: Record<string, string> = {
    "Sun": "Early marriage; strong ego needs in partnership; dominance issues",
    "Moon": "Emotional marriage; early union; moody partnership dynamics",
    "Mercury": "Intellectual partnership; good communication; possibility of multiple partners",
    "Venus": "Highly favorable for marriage; strong attraction and satisfaction",
    "Mars": "Passion and conflict; intense but potentially turbulent marriage",
    "Jupiter": "Fortunate marriage; large families; generous partnership",
    "Saturn": "Delayed marriage; serious, devoted partnership; age-gap relationships",
    "Rahu": "Unconventional partnership; foreign spouse or unusual marriage",
    "Ketu": "Spiritual partnership; detachment in marriage; past-life connections",
  }
  return h7planets[planet] || "undefined"
}

function describeDashaForMarriage(mahadasha: string, lord7: string | undefined): string {
  if (mahadasha.toLowerCase().includes("venus")) {
    return "Venus Mahadasha is optimal for marriage. Romance, attraction, and partnership are heightened."
  }
  if (lord7 && mahadasha.toLowerCase().includes(lord7.toLowerCase())) {
    return "This is the 7th house lord's Mahadasha. Marriage opportunity is strong."
  }
  if (mahadasha.toLowerCase().includes("jupiter")) {
    return "Jupiter Mahadasha brings expansion and good fortune to marriage."
  }
  if (mahadasha.toLowerCase().includes("saturn")) {
    return "Saturn Mahadasha can delay marriage or require a committed, mature approach."
  }
  if (mahadasha.toLowerCase().includes("mars")) {
    return "Mars Mahadasha brings passion but requires careful partner selection."
  }
  return "Dasha influence on marriage depends on planetary relationships."
}

/* ─── Helper: Ordinal Numbers ──────────────────────────── */

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/* ─── Helper: Sign Distance ────────────────────────────── */

function calculateSignDistance(sign1: string, sign2: string): number {
  const signIndex: Record<string, number> = {
    "Aries": 0, "Taurus": 1, "Gemini": 2, "Cancer": 3, "Leo": 4, "Virgo": 5,
    "Libra": 6, "Scorpio": 7, "Sagittarius": 8, "Capricorn": 9, "Aquarius": 10, "Pisces": 11,
  }
  const diff = Math.abs((signIndex[sign1] || 0) - (signIndex[sign2] || 0))
  return Math.min(diff, 12 - diff)
}

/* ─── Helper: Get Nakshatra from Index ─────────────────── */

function getNakshatraFromIndex(name: string): NakshatraGuna {
  // Fallback if nakshatra not found in map
  return {
    name,
    index: 0,
    lord: "Unknown",
    gana: "Manushya",
    animal: "Unknown",
    nadi: "Adi",
  }
}

/* ─── Helper: Generate Marriage Remedies ──────────────── */

function generateMatchRemedies(data: ReportData, partnerData?: ReportData): ReportRemedy[] {
  const remedies: ReportRemedy[] = []

  // Mangal Dosha remedies
  const mangal = data.doshas.find(d => d.type === "Mangal Dosha")
  if (mangal) {
    remedies.push({
      type: "Mars Mantra",
      description: PLANET_MANTRAS.Mars.mantra + ` — Recite ${PLANET_MANTRAS.Mars.count} on ${PLANET_MANTRAS.Mars.day}`,
    })
    remedies.push({
      type: "Mars Gemstone",
      description: PLANET_GEMSTONES.Mars.gem + ` set in ${PLANET_GEMSTONES.Mars.metal}, worn on ${PLANET_GEMSTONES.Mars.finger}`,
    })
  }

  // Venus strengthening
  remedies.push({
    type: "Venus Mantra",
    description: PLANET_MANTRAS.Venus.mantra + ` — Recite ${PLANET_MANTRAS.Venus.count} on ${PLANET_MANTRAS.Venus.day}`,
  })

  remedies.push({
    type: "Mercury for Communication",
    description: PLANET_MANTRAS.Mercury.mantra + ` — Recite ${PLANET_MANTRAS.Mercury.count} on ${PLANET_MANTRAS.Mercury.day} for clear partnership dialogue`,
  })

  remedies.push({
    type: "Moon for Emotional Harmony",
    description: PLANET_MANTRAS.Moon.mantra + ` — Recite ${PLANET_MANTRAS.Moon.count} on ${PLANET_MANTRAS.Moon.day} for emotional security`,
  })

  remedies.push({
    type: "Spiritual Practice",
    description: "Regular meditation, yoga, and conscious breathing (pranayama) to align both partners with higher consciousness and transcend ego-based conflicts",
  })

  remedies.push({
    type: "Charitable Acts",
    description: "Donate to marriage-related causes or sponsor marriage ceremonies for those in need, creating positive karmic cycles for your own partnership",
  })

  return remedies
}
