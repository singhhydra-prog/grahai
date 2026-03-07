/* ════════════════════════════════════════════════════════
   GrahAI — PDF Report Renderer (pdfkit)

   Renders the assembled report data into a professional
   multi-page Kundli PDF document.

   Sections:
   1. Title Page
   2. Planetary Positions Table
   3. Lagna Chart (D1) — North Indian Style
   4. Navamsa Chart (D9) + Dasamsa (D10)
   5. Nakshatra Analysis
   6. Dasha Timeline (20 years)
   7. Yoga Analysis with BPHS References
   8. Dosha Analysis + Severity
   9. House-by-House Interpretation
   10. Remedies (Gemstones, Mantras, Charity)
   11. Summary + Bibliography
   ════════════════════════════════════════════════════════ */

import PDFDocument from "pdfkit"
import type { ReportData, PlanetTableRow, HouseAnalysisRow } from "./kundli-report-generator"

// ─── PDF Configuration ──────────────────────────────────

const COLORS = {
  primary: "#B91C1C",     // Deep red (traditional)
  secondary: "#92400E",   // Warm brown
  accent: "#1E40AF",      // Deep blue
  text: "#1F2937",        // Dark gray
  lightText: "#6B7280",   // Gray
  background: "#FEF3C7",  // Warm cream
  white: "#FFFFFF",
  tableHeader: "#7C2D12", // Dark red-brown
  tableAlt: "#FFF7ED",    // Light orange
  border: "#D97706",      // Amber
}

const FONTS = {
  title: "Helvetica-Bold",
  heading: "Helvetica-Bold",
  body: "Helvetica",
  italic: "Helvetica-Oblique",
}

// ─── Main Render Function ───────────────────────────────

/**
 * Render the complete Kundli PDF report.
 * Returns a Buffer containing the PDF data.
 */
export async function renderKundliPDF(data: ReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      info: {
        Title: `Kundli Report — ${data.name}`,
        Author: "GrahAI — Vedic Astrology Intelligence",
        Subject: "Vedic Birth Chart (Kundli) Analysis",
        Creator: "GrahAI (grahai.vercel.app)",
      },
    })

    doc.on("data", (chunk: Buffer) => chunks.push(chunk))
    doc.on("end", () => resolve(Buffer.concat(chunks)))
    doc.on("error", reject)

    // ── Section 1: Title Page ──
    renderTitlePage(doc, data)

    // ── Section 2: Planet Positions Table ──
    doc.addPage()
    renderPlanetTable(doc, data)

    // ── Section 3: Lagna Chart (D1) ──
    doc.addPage()
    renderChartDiagram(doc, data, "D1")

    // ── Section 4: Navamsa + Dasamsa ──
    doc.addPage()
    renderDivisionalCharts(doc, data)

    // ── Section 5: Nakshatra Analysis ──
    doc.addPage()
    renderNakshatraAnalysis(doc, data)

    // ── Section 6: Dasha Timeline ──
    doc.addPage()
    renderDashaTimeline(doc, data)

    // ── Section 7: Yoga Analysis ──
    doc.addPage()
    renderYogaAnalysis(doc, data)

    // ── Section 8: Dosha Analysis ──
    if (data.doshas.length > 0) {
      doc.addPage()
      renderDoshaAnalysis(doc, data)
    }

    // ── Section 9: House Interpretation ──
    doc.addPage()
    renderHouseAnalysis(doc, data)

    // ── Section 10: Remedies ──
    doc.addPage()
    renderRemedies(doc, data)

    // ── Section 11: Bibliography ──
    doc.addPage()
    renderBibliography(doc, data)

    doc.end()
  })
}

// ─── Section Renderers ──────────────────────────────────

function renderTitlePage(doc: PDFKit.PDFDocument, data: ReportData) {
  const pageWidth = doc.page.width - 100

  // Decorative top border
  doc.rect(50, 50, pageWidth, 4).fill(COLORS.primary)

  // Title
  doc.moveDown(4)
  doc.font(FONTS.title).fontSize(32).fillColor(COLORS.primary)
    .text("॥ कुण्डली विश्लेषण ॥", { align: "center" })

  doc.moveDown(0.5)
  doc.font(FONTS.title).fontSize(28).fillColor(COLORS.text)
    .text("Kundli Report", { align: "center" })

  doc.moveDown(0.5)
  doc.font(FONTS.italic).fontSize(14).fillColor(COLORS.lightText)
    .text("Vedic Birth Chart Analysis", { align: "center" })

  // Decorative line
  doc.moveDown(2)
  const lineY = doc.y
  doc.moveTo(150, lineY).lineTo(doc.page.width - 150, lineY)
    .strokeColor(COLORS.border).lineWidth(1).stroke()

  // Birth Details
  doc.moveDown(2)
  doc.font(FONTS.heading).fontSize(18).fillColor(COLORS.secondary)
    .text(data.name, { align: "center" })

  doc.moveDown(1)
  const bd = data.birthDetails
  const birthDate = new Date(bd.date + "T" + (bd.time.length === 5 ? bd.time + ":00" : bd.time))
  const dateStr = birthDate.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  })
  const timeStr = bd.time

  doc.font(FONTS.body).fontSize(13).fillColor(COLORS.text)
  doc.text(`Date of Birth: ${dateStr}`, { align: "center" })
  doc.text(`Time of Birth: ${timeStr}`, { align: "center" })
  doc.text(`Place: ${bd.place}`, { align: "center" })
  doc.text(`Coordinates: ${bd.latitude.toFixed(4)}°N, ${bd.longitude.toFixed(4)}°E`, { align: "center" })
  doc.text(`Timezone: UTC${bd.timezone >= 0 ? "+" : ""}${bd.timezone}`, { align: "center" })

  // Key Highlights
  doc.moveDown(2)
  doc.font(FONTS.heading).fontSize(14).fillColor(COLORS.primary)
    .text("Key Chart Highlights", { align: "center" })

  doc.moveDown(0.5)
  doc.font(FONTS.body).fontSize(11).fillColor(COLORS.text)

  const lagnaSign = data.natalChart.planets.length > 0
    ? `Lagna (Ascendant): ${getSignForHouse(data.natalChart.ascendant)}`
    : "Calculating..."
  const moonSign = data.natalChart.planets.find(p => p.name === "Moon")?.sign.name || "—"
  const sunSign = data.natalChart.planets.find(p => p.name === "Sun")?.sign.name || "—"

  doc.text(lagnaSign, { align: "center" })
  doc.text(`Moon Sign (Rashi): ${moonSign}`, { align: "center" })
  doc.text(`Sun Sign: ${sunSign}`, { align: "center" })
  doc.text(`Janma Nakshatra: ${data.nakshatraAnalysis.name} (Pada ${data.nakshatraAnalysis.pada})`, { align: "center" })
  doc.text(`Yogas Detected: ${data.yogas.length}`, { align: "center" })
  doc.text(`Doshas Detected: ${data.doshas.length}`, { align: "center" })

  if (data.vargottamaPlanets.length > 0) {
    doc.text(`Vargottama Planets: ${data.vargottamaPlanets.join(", ")}`, { align: "center" })
  }

  // Footer
  doc.moveDown(4)
  doc.font(FONTS.italic).fontSize(9).fillColor(COLORS.lightText)
    .text(`Generated by GrahAI — Vedic Astrology Intelligence Platform`, { align: "center" })
  doc.text(`${data.generatedAt.toLocaleDateString("en-IN")} | Swiss Ephemeris Precision | BPHS Classical References`, { align: "center" })

  // Bottom border
  doc.rect(50, doc.page.height - 54, pageWidth, 4).fill(COLORS.primary)
}

function renderPlanetTable(doc: PDFKit.PDFDocument, data: ReportData) {
  renderSectionHeader(doc, "Planetary Positions", "ग्रह स्थिति")

  doc.moveDown(0.5)
  doc.font(FONTS.italic).fontSize(10).fillColor(COLORS.lightText)
    .text("Sidereal (Lahiri Ayanamsa) • Whole Sign House System")

  doc.moveDown(1)

  // Table headers
  const headers = ["Planet", "Sign", "Degree", "Nakshatra", "Pada", "House", "Dignity", "R"]
  const colWidths = [70, 70, 55, 75, 35, 40, 65, 20]
  const startX = 55

  let y = doc.y

  // Header row
  doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 20).fill(COLORS.tableHeader)
  let x = startX
  doc.font(FONTS.heading).fontSize(9).fillColor(COLORS.white)
  for (let i = 0; i < headers.length; i++) {
    doc.text(headers[i], x + 3, y + 5, { width: colWidths[i] - 6, align: "left" })
    x += colWidths[i]
  }

  y += 22

  // Data rows
  doc.font(FONTS.body).fontSize(9)
  for (let row = 0; row < data.planetTable.length; row++) {
    const p = data.planetTable[row]
    const isAlt = row % 2 === 1

    if (isAlt) {
      doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 18).fill(COLORS.tableAlt)
    }

    const dignityColor = getDignityColor(p.dignity)
    x = startX
    doc.fillColor(COLORS.text)

    const values = [
      p.planet, p.sign, p.degree, p.nakshatra,
      String(p.pada), String(p.house), p.dignity,
      p.retrograde ? "R" : "",
    ]

    for (let i = 0; i < values.length; i++) {
      if (i === 6) doc.fillColor(dignityColor)
      else if (i === 7 && p.retrograde) doc.fillColor(COLORS.primary)
      else doc.fillColor(COLORS.text)

      doc.text(values[i], x + 3, y + 4, { width: colWidths[i] - 6, align: "left" })
      x += colWidths[i]
    }

    y += 18
  }

  // Navamsa column note
  doc.moveDown(2)
  doc.font(FONTS.italic).fontSize(9).fillColor(COLORS.lightText)
    .text("R = Retrograde • Dignity based on classical friendship tables (BPHS Ch. 3)")
}

function renderChartDiagram(doc: PDFKit.PDFDocument, data: ReportData, chartType: string) {
  renderSectionHeader(doc, "Lagna Chart (Rashi / D1)", "लग्न कुण्डली")

  doc.moveDown(0.5)
  doc.font(FONTS.italic).fontSize(10).fillColor(COLORS.lightText)
    .text("North Indian Style Diamond Chart")

  doc.moveDown(1)

  // Draw North Indian style chart (diamond/square)
  const centerX = doc.page.width / 2
  const centerY = doc.y + 140
  const size = 120

  // Outer square
  doc.rect(centerX - size, centerY - size, size * 2, size * 2)
    .strokeColor(COLORS.primary).lineWidth(2).stroke()

  // Diagonal lines (creating diamond houses)
  doc.moveTo(centerX - size, centerY - size).lineTo(centerX + size, centerY + size)
    .strokeColor(COLORS.primary).lineWidth(1).stroke()
  doc.moveTo(centerX + size, centerY - size).lineTo(centerX - size, centerY + size)
    .strokeColor(COLORS.primary).lineWidth(1).stroke()

  // Mid lines
  doc.moveTo(centerX, centerY - size).lineTo(centerX, centerY + size)
    .strokeColor(COLORS.primary).lineWidth(0.5).stroke()
  doc.moveTo(centerX - size, centerY).lineTo(centerX + size, centerY)
    .strokeColor(COLORS.primary).lineWidth(0.5).stroke()

  // Place house numbers and planets
  const housePositions = getHousePositionsNorthIndian(centerX, centerY, size)

  doc.font(FONTS.body).fontSize(7).fillColor(COLORS.lightText)
  for (let h = 1; h <= 12; h++) {
    const pos = housePositions[h]
    doc.text(String(h), pos.x - 4, pos.y - 20, { width: 30, align: "left" })

    // Find planets in this house
    const planetsHere = data.planetTable.filter(p => p.house === h)
    if (planetsHere.length > 0) {
      doc.font(FONTS.heading).fontSize(7).fillColor(COLORS.accent)
      const planetStr = planetsHere.map(p => {
        let abbrev = p.planet.substring(0, 2)
        if (p.retrograde) abbrev += "(R)"
        return abbrev
      }).join(" ")
      doc.text(planetStr, pos.x - 15, pos.y - 8, { width: 50, align: "center" })
    }
  }

  // Sign labels around the chart
  doc.font(FONTS.italic).fontSize(8).fillColor(COLORS.secondary)
  for (let h = 1; h <= 12; h++) {
    const signIndex = (Math.floor(data.natalChart.ascendant / 30) + h - 1) % 12
    const signAbbrev = getSignAbbrev(signIndex)
    const pos = housePositions[h]
    doc.text(signAbbrev, pos.x - 10, pos.y + 4, { width: 30, align: "center" })
  }

  // Legend
  doc.y = centerY + size + 30
  doc.font(FONTS.body).fontSize(9).fillColor(COLORS.text)
    .text("Planet abbreviations: Su=Sun, Mo=Moon, Ma=Mars, Me=Mercury, Ju=Jupiter, Ve=Venus, Sa=Saturn, Ra=Rahu, Ke=Ketu", {
      align: "center", width: doc.page.width - 100,
    })
}

function renderDivisionalCharts(doc: PDFKit.PDFDocument, data: ReportData) {
  renderSectionHeader(doc, "Divisional Charts", "वर्ग कुण्डली")

  doc.moveDown(0.5)

  // Navamsa (D9) table
  doc.font(FONTS.heading).fontSize(13).fillColor(COLORS.secondary)
    .text("Navamsa Chart (D9) — Marriage, Dharma, Spiritual Potential")
  doc.moveDown(0.5)

  renderMiniPlanetTable(doc, data.navamsaChart.planets)

  doc.moveDown(1.5)

  // Dasamsa (D10) table
  doc.font(FONTS.heading).fontSize(13).fillColor(COLORS.secondary)
    .text("Dasamsa Chart (D10) — Career, Profession, Public Standing")
  doc.moveDown(0.5)

  renderMiniPlanetTable(doc, data.dasamsaChart.planets)

  // Vargottama note
  if (data.vargottamaPlanets.length > 0) {
    doc.moveDown(1.5)
    doc.font(FONTS.heading).fontSize(11).fillColor(COLORS.primary)
      .text("Vargottama Planets (Same sign in D1 and D9):")
    doc.font(FONTS.body).fontSize(10).fillColor(COLORS.text)
      .text(data.vargottamaPlanets.join(", ") + " — These planets are greatly strengthened.")
  }
}

function renderNakshatraAnalysis(doc: PDFKit.PDFDocument, data: ReportData) {
  renderSectionHeader(doc, "Nakshatra Analysis", "नक्षत्र विश्लेषण")

  doc.moveDown(1)

  const nak = data.nakshatraAnalysis

  doc.font(FONTS.heading).fontSize(16).fillColor(COLORS.secondary)
    .text(`Janma Nakshatra: ${nak.name}`)

  doc.moveDown(0.5)
  doc.font(FONTS.body).fontSize(11).fillColor(COLORS.text)
  doc.text(`Nakshatra Lord: ${nak.lord}`)
  doc.text(`Presiding Deity: ${nak.deity}`)
  doc.text(`Pada: ${nak.pada}`)

  doc.moveDown(1)
  doc.font(FONTS.heading).fontSize(12).fillColor(COLORS.primary)
    .text("Characteristics")
  doc.font(FONTS.body).fontSize(11).fillColor(COLORS.text)
    .text(nak.characteristics)

  // Dasha lord note
  doc.moveDown(1)
  doc.font(FONTS.heading).fontSize(12).fillColor(COLORS.primary)
    .text("Vimshottari Dasha Connection")
  doc.font(FONTS.body).fontSize(11).fillColor(COLORS.text)
    .text(`The Janma Nakshatra lord (${nak.lord}) determines the starting Mahadasha at birth. This planet's strength in your chart significantly influences your overall life trajectory. The balance of ${nak.lord} Mahadasha remaining at birth was ${data.dashaAnalysis.balanceAtBirth.toFixed(2)} years.`)
}

function renderDashaTimeline(doc: PDFKit.PDFDocument, data: ReportData) {
  renderSectionHeader(doc, "Vimshottari Dasha Timeline", "विंशोत्तरी दशा")

  doc.moveDown(0.5)
  doc.font(FONTS.italic).fontSize(10).fillColor(COLORS.lightText)
    .text("120-year Vimshottari cycle • Based on Moon's Nakshatra at birth (BPHS Chapter 46)")

  // Current active periods
  doc.moveDown(1)
  doc.font(FONTS.heading).fontSize(12).fillColor(COLORS.primary)
    .text("Currently Active:")

  doc.font(FONTS.body).fontSize(11).fillColor(COLORS.text)
  const cm = data.dashaAnalysis.currentMahadasha
  const ca = data.dashaAnalysis.currentAntardasha
  const cp = data.dashaAnalysis.currentPratyantar

  doc.text(`Mahadasha: ${cm.planet} (${cm.sanskrit}) — ${formatDate(cm.startDate)} to ${formatDate(cm.endDate)}`)
  doc.text(`Antardasha: ${ca.planet} (${ca.sanskrit}) — ${formatDate(ca.startDate)} to ${formatDate(ca.endDate)}`)
  doc.text(`Pratyantar: ${cp.planet} (${cp.sanskrit}) — ${formatDate(cp.startDate)} to ${formatDate(cp.endDate)}`)

  // Timeline table (next 20 years)
  doc.moveDown(1)
  doc.font(FONTS.heading).fontSize(12).fillColor(COLORS.primary)
    .text("Next 20 Years — Mahadasha / Antardasha Periods")

  doc.moveDown(0.5)

  const timeline = data.dashaTimeline.slice(0, 30) // Limit to 30 entries
  let y = doc.y

  // Header
  const headers = ["Mahadasha", "Antardasha", "Start", "End", "Duration"]
  const colWidths = [80, 80, 90, 90, 70]
  const startX = 55

  doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 18).fill(COLORS.tableHeader)
  let x = startX
  doc.font(FONTS.heading).fontSize(8).fillColor(COLORS.white)
  headers.forEach((h, i) => {
    doc.text(h, x + 3, y + 4, { width: colWidths[i] - 6 })
    x += colWidths[i]
  })
  y += 20

  doc.font(FONTS.body).fontSize(8)
  for (let i = 0; i < timeline.length; i++) {
    if (y > doc.page.height - 80) {
      doc.addPage()
      y = 60
    }

    const t = timeline[i]
    const isAlt = i % 2 === 1
    if (isAlt) {
      doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 16).fill(COLORS.tableAlt)
    }

    x = startX
    doc.fillColor(COLORS.text)
    const values = [
      t.mahadasha, t.antardasha,
      formatDate(t.startDate), formatDate(t.endDate),
      `${t.durationMonths} months`,
    ]
    values.forEach((v, j) => {
      doc.text(v, x + 3, y + 3, { width: colWidths[j] - 6 })
      x += colWidths[j]
    })
    y += 16
  }
}

function renderYogaAnalysis(doc: PDFKit.PDFDocument, data: ReportData) {
  renderSectionHeader(doc, "Yoga Analysis", "योग विश्लेषण")

  doc.moveDown(0.5)
  doc.font(FONTS.italic).fontSize(10).fillColor(COLORS.lightText)
    .text("Yogas detected in your chart with classical text references")

  doc.moveDown(1)

  if (data.yogas.length === 0) {
    doc.font(FONTS.body).fontSize(11).fillColor(COLORS.text)
      .text("No major yogas detected in the chart. Minor combinations may exist.")
    return
  }

  for (const yoga of data.yogas) {
    if (doc.y > doc.page.height - 120) doc.addPage()

    doc.font(FONTS.heading).fontSize(12).fillColor(COLORS.secondary)
      .text(`${yoga.name} (${yoga.category})`)

    doc.font(FONTS.body).fontSize(10).fillColor(COLORS.text)
      .text(yoga.description)

    if (yoga.involvedPlanets.length > 0) {
      doc.font(FONTS.italic).fontSize(9).fillColor(COLORS.lightText)
        .text(`Involved Planets: ${yoga.involvedPlanets.join(", ")}`)
    }

    if (yoga.strength) {
      doc.font(FONTS.italic).fontSize(9).fillColor(COLORS.lightText)
        .text(`Strength: ${yoga.strength}`)
    }

    if (yoga.classicalReference) {
      doc.font(FONTS.italic).fontSize(9).fillColor(COLORS.accent)
        .text(`Reference: ${yoga.classicalReference.source} Ch.${yoga.classicalReference.chapter || "—"}, V.${yoga.classicalReference.verse || "—"}`)
    }

    doc.moveDown(0.8)
  }
}

function renderDoshaAnalysis(doc: PDFKit.PDFDocument, data: ReportData) {
  renderSectionHeader(doc, "Dosha Analysis", "दोष विश्लेषण")

  doc.moveDown(1)

  for (const dosha of data.doshas) {
    if (doc.y > doc.page.height - 140) doc.addPage()

    const severityColor = dosha.severity === "high" ? COLORS.primary
      : dosha.severity === "medium" ? COLORS.secondary
      : COLORS.lightText

    doc.font(FONTS.heading).fontSize(13).fillColor(severityColor)
      .text(`${dosha.type} — ${(dosha.severity || "medium").toUpperCase()}`)

    doc.font(FONTS.body).fontSize(10).fillColor(COLORS.text)
      .text(dosha.description)

    if (dosha.remedies && dosha.remedies.length > 0) {
      doc.font(FONTS.heading).fontSize(10).fillColor(COLORS.primary)
        .text("Recommended Remedies:")
      doc.font(FONTS.body).fontSize(9).fillColor(COLORS.text)
      for (const r of dosha.remedies.slice(0, 3)) {
        doc.text(`• ${r}`)
      }
    }

    if (dosha.classicalReference) {
      doc.font(FONTS.italic).fontSize(9).fillColor(COLORS.accent)
        .text(`Reference: ${dosha.classicalReference.source} Ch.${dosha.classicalReference.chapter || "—"}`)
    }

    doc.moveDown(1)
  }
}

function renderHouseAnalysis(doc: PDFKit.PDFDocument, data: ReportData) {
  renderSectionHeader(doc, "House-by-House Analysis", "भाव विश्लेषण")

  doc.moveDown(0.5)

  for (const house of data.houseAnalysis) {
    if (doc.y > doc.page.height - 80) doc.addPage()

    doc.font(FONTS.heading).fontSize(11).fillColor(COLORS.secondary)
      .text(`House ${house.house} — ${house.sign}`)

    doc.font(FONTS.body).fontSize(9).fillColor(COLORS.text)
      .text(house.interpretation)

    doc.font(FONTS.italic).fontSize(8).fillColor(COLORS.lightText)
      .text(`Significations: ${house.significance}`)

    doc.moveDown(0.6)
  }
}

function renderRemedies(doc: PDFKit.PDFDocument, data: ReportData) {
  renderSectionHeader(doc, "Personalized Remedies", "उपाय")

  doc.moveDown(0.5)
  doc.font(FONTS.italic).fontSize(10).fillColor(COLORS.lightText)
    .text("Based on afflicted planets and detected doshas in your chart")

  doc.moveDown(1)

  // Planet remedies
  if (data.remedies.planetRemedies.length > 0) {
    doc.font(FONTS.heading).fontSize(12).fillColor(COLORS.primary)
      .text("Planet-Based Remedies")
    doc.moveDown(0.5)

    for (const pr of data.remedies.planetRemedies) {
      if (doc.y > doc.page.height - 80) doc.addPage()

      doc.font(FONTS.heading).fontSize(10).fillColor(COLORS.secondary)
        .text(`${pr.planet} (${pr.reason})`)
      doc.font(FONTS.body).fontSize(9).fillColor(COLORS.text)
        .text(`Gemstone: ${pr.gemstone}`)
        .text(`Mantra: ${pr.mantra}`)
        .text(`Recommendation: ${pr.primaryRemedy}`)
      doc.moveDown(0.5)
    }
  }

  // Dosha remedies
  if (data.remedies.doshaRemedies.length > 0) {
    doc.moveDown(0.5)
    doc.font(FONTS.heading).fontSize(12).fillColor(COLORS.primary)
      .text("Dosha-Specific Remedies")
    doc.moveDown(0.5)

    for (const dr of data.remedies.doshaRemedies) {
      if (doc.y > doc.page.height - 80) doc.addPage()

      doc.font(FONTS.heading).fontSize(10).fillColor(COLORS.secondary)
        .text(`${dr.dosha} (${dr.severity})`)
      doc.font(FONTS.body).fontSize(9).fillColor(COLORS.text)
        .text(`Primary Ritual: ${dr.primaryRitual}`)
        .text(`Mantra: ${dr.mantra}`)
      doc.moveDown(0.5)
    }
  }

  // General guidance
  doc.moveDown(1)
  doc.font(FONTS.heading).fontSize(11).fillColor(COLORS.primary)
    .text("General Guidance")
  doc.font(FONTS.body).fontSize(9).fillColor(COLORS.text)
  for (const g of data.remedies.generalGuidance) {
    doc.text(`• ${g}`)
  }
}

function renderBibliography(doc: PDFKit.PDFDocument, data: ReportData) {
  renderSectionHeader(doc, "Classical References", "शास्त्रीय सन्दर्भ")

  doc.moveDown(0.5)
  doc.font(FONTS.italic).fontSize(10).fillColor(COLORS.lightText)
    .text("All interpretations in this report are backed by classical Jyotish texts")

  doc.moveDown(1)

  for (const ref of data.bibliography) {
    doc.font(FONTS.body).fontSize(10).fillColor(COLORS.text)
      .text(`• ${ref.source}, Chapter ${ref.chapter} — ${ref.topic}`)
  }

  doc.moveDown(2)
  doc.font(FONTS.heading).fontSize(11).fillColor(COLORS.secondary)
    .text("Primary Sources Referenced:")

  doc.font(FONTS.body).fontSize(10).fillColor(COLORS.text)
  doc.text("1. Brihat Parashara Hora Shastra (BPHS) — Maharishi Parashara")
  doc.text("2. Saravali — Kalyana Varma")
  doc.text("3. Phaladeepika — Mantreshwara")
  doc.text("4. Jataka Parijata — Vaidyanatha Dikshita")

  // Disclaimer
  doc.moveDown(3)
  doc.font(FONTS.italic).fontSize(8).fillColor(COLORS.lightText)
    .text("Disclaimer: This report is for educational and informational purposes only. Vedic astrology is a traditional knowledge system and should not replace professional medical, legal, or financial advice. Consult qualified practitioners for gemstone recommendations.", {
      align: "center", width: doc.page.width - 100,
    })

  doc.moveDown(1)
  doc.font(FONTS.heading).fontSize(10).fillColor(COLORS.primary)
    .text("Generated by GrahAI — grahai.vercel.app", { align: "center" })
  doc.font(FONTS.body).fontSize(8).fillColor(COLORS.lightText)
    .text(`Report generated on ${data.generatedAt.toLocaleDateString("en-IN")} using Swiss Ephemeris precision calculations`, { align: "center" })
}

// ─── Shared Helpers ─────────────────────────────────────

function renderSectionHeader(doc: PDFKit.PDFDocument, title: string, sanskrit: string) {
  doc.font(FONTS.title).fontSize(20).fillColor(COLORS.primary)
    .text(title)
  doc.font(FONTS.italic).fontSize(12).fillColor(COLORS.secondary)
    .text(sanskrit)
  const y = doc.y + 3
  doc.moveTo(50, y).lineTo(doc.page.width - 50, y)
    .strokeColor(COLORS.border).lineWidth(1).stroke()
  doc.y = y + 5
}

function renderMiniPlanetTable(
  doc: PDFKit.PDFDocument,
  planets: Array<{ name: string, sign: { name: string }, degree: number, house: number }>
) {
  const headers = ["Planet", "Sign", "Degree", "House"]
  const colWidths = [80, 80, 70, 50]
  const startX = 80
  let y = doc.y

  // Header
  doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 16).fill(COLORS.tableHeader)
  let x = startX
  doc.font(FONTS.heading).fontSize(8).fillColor(COLORS.white)
  headers.forEach((h, i) => {
    doc.text(h, x + 3, y + 4, { width: colWidths[i] - 6 })
    x += colWidths[i]
  })
  y += 18

  doc.font(FONTS.body).fontSize(8)
  for (let i = 0; i < planets.length; i++) {
    const p = planets[i]
    if (i % 2 === 1) {
      doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 14).fill(COLORS.tableAlt)
    }
    x = startX
    doc.fillColor(COLORS.text)
    const vals = [p.name, p.sign.name, `${Math.floor(p.degree)}° ${Math.floor((p.degree % 1) * 60)}'`, String(p.house)]
    vals.forEach((v, j) => {
      doc.text(v, x + 3, y + 3, { width: colWidths[j] - 6 })
      x += colWidths[j]
    })
    y += 14
  }

  doc.y = y + 5
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function getDignityColor(dignity: string): string {
  switch (dignity) {
    case "exalted": return "#059669"
    case "own": case "moolatrikona": return "#0D9488"
    case "friendly": return "#2563EB"
    case "neutral": return COLORS.text
    case "enemy": return "#D97706"
    case "debilitated": return COLORS.primary
    default: return COLORS.text
  }
}

function getSignForHouse(ascendant: number): string {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ]
  return signs[Math.floor(((ascendant % 360 + 360) % 360) / 30)]
}

function getSignAbbrev(index: number): string {
  const abbrevs = ["Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"]
  return abbrevs[index % 12]
}

function getHousePositionsNorthIndian(cx: number, cy: number, size: number): Record<number, { x: number, y: number }> {
  // Approximate positions for 12 houses in North Indian diamond style
  const s = size * 0.45
  return {
    1:  { x: cx, y: cy - s * 1.4 },      // Top center (Lagna)
    2:  { x: cx - s * 1.2, y: cy - s },   // Upper left
    3:  { x: cx - s * 1.6, y: cy - s * 0.2 }, // Left upper
    4:  { x: cx - s * 1.2, y: cy + s * 0.3 }, // Left center
    5:  { x: cx - s * 1.6, y: cy + s },   // Left lower
    6:  { x: cx - s * 1.2, y: cy + s * 1.4 }, // Lower left
    7:  { x: cx, y: cy + s * 1.4 },       // Bottom center
    8:  { x: cx + s * 1.2, y: cy + s * 1.4 }, // Lower right
    9:  { x: cx + s * 1.6, y: cy + s },   // Right lower
    10: { x: cx + s * 1.2, y: cy + s * 0.3 }, // Right center
    11: { x: cx + s * 1.6, y: cy - s * 0.2 }, // Right upper
    12: { x: cx + s * 1.2, y: cy - s },   // Upper right
  }
}
