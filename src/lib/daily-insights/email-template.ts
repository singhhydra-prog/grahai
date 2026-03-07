/* ════════════════════════════════════════════════════════
   GrahAI — Daily Insight Email Template

   Produces an HTML email for the daily personalized
   horoscope. Designed for Resend delivery.
   ════════════════════════════════════════════════════════ */

import type { DailyInsight } from "./insight-generator"

// ─── Colors ─────────────────────────────────────────────

const COLORS = {
  primary: "#8B1A1A",      // deep red
  secondary: "#5C4033",    // warm brown
  accent: "#1A3A5C",       // deep blue
  gold: "#C8A951",         // gold
  cream: "#FFF8F0",        // warm cream
  white: "#FFFFFF",
  textDark: "#2D2D2D",
  textLight: "#666666",
  green: "#2E7D32",
  red: "#C62828",
  orange: "#E65100",
}

// ─── Trend Badge ────────────────────────────────────────

function getTrendBadge(trend: string): { color: string, label: string, emoji: string } {
  switch (trend) {
    case "favorable":
      return { color: COLORS.green, label: "Favorable", emoji: "✨" }
    case "challenging":
      return { color: COLORS.red, label: "Challenging", emoji: "⚡" }
    default:
      return { color: COLORS.orange, label: "Mixed", emoji: "☯" }
  }
}

// ─── Main Template ──────────────────────────────────────

export function renderDailyInsightEmail(insight: DailyInsight): string {
  const trend = getTrendBadge(insight.overallTrend)

  const formattedDate = new Date(insight.date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Daily Cosmic Insight — GrahAI</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.cream};font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background-color:${COLORS.white};">

    <!-- Header -->
    <tr>
      <td style="background:linear-gradient(135deg,${COLORS.primary},${COLORS.accent});padding:30px 24px;text-align:center;">
        <h1 style="color:${COLORS.gold};font-size:28px;margin:0 0 4px 0;letter-spacing:2px;">ग्रह AI</h1>
        <p style="color:${COLORS.cream};font-size:12px;margin:0;letter-spacing:1px;">GRAHAI — YOUR COSMIC GUIDE</p>
      </td>
    </tr>

    <!-- Greeting & Headline -->
    <tr>
      <td style="padding:24px 24px 12px;">
        <p style="color:${COLORS.textLight};font-size:13px;margin:0 0 6px;">${formattedDate}</p>
        <h2 style="color:${COLORS.primary};font-size:18px;margin:0 0 8px;">Namaste ${insight.name} 🙏</h2>
        <p style="color:${COLORS.textDark};font-size:15px;line-height:1.5;margin:0;">
          ${insight.headline}
        </p>
      </td>
    </tr>

    <!-- Overall Trend Badge -->
    <tr>
      <td style="padding:12px 24px;">
        <table role="presentation" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background-color:${trend.color};color:white;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:bold;">
              ${trend.emoji} Today's Energy: ${trend.label}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Panchang Section -->
    <tr>
      <td style="padding:16px 24px;">
        <h3 style="color:${COLORS.accent};font-size:15px;margin:0 0 10px;border-bottom:1px solid ${COLORS.gold};padding-bottom:6px;">
          📅 Today's Panchang
        </h3>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;color:${COLORS.textDark};">
          <tr>
            <td style="padding:4px 0;width:35%;color:${COLORS.textLight};">Tithi</td>
            <td style="padding:4px 0;font-weight:bold;">${insight.panchang.tithi}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:${COLORS.textLight};">Nakshatra</td>
            <td style="padding:4px 0;font-weight:bold;">${insight.panchang.nakshatra}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:${COLORS.textLight};">Yoga</td>
            <td style="padding:4px 0;">${insight.panchang.yoga}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:${COLORS.textLight};">Karana</td>
            <td style="padding:4px 0;">${insight.panchang.karana}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:${COLORS.textLight};">Rahu Kaal</td>
            <td style="padding:4px 0;color:${COLORS.red};font-weight:bold;">${insight.panchang.rahuKaal}</td>
          </tr>
          ${insight.panchang.auspicious.length > 0 ? `
          <tr>
            <td style="padding:4px 0;color:${COLORS.textLight};">Auspicious</td>
            <td style="padding:4px 0;color:${COLORS.gold};font-weight:bold;">${insight.panchang.auspicious.join(", ")}</td>
          </tr>` : ""}
        </table>
      </td>
    </tr>

    <!-- Moon Transit -->
    <tr>
      <td style="padding:16px 24px;">
        <h3 style="color:${COLORS.accent};font-size:15px;margin:0 0 10px;border-bottom:1px solid ${COLORS.gold};padding-bottom:6px;">
          🌙 Moon Transit
        </h3>
        <p style="font-size:13px;color:${COLORS.textDark};line-height:1.5;margin:0;">
          Moon is in <strong>${insight.moonTransit.currentSign}</strong> (${insight.moonTransit.nakshatra}),
          transiting your <strong>${getOrdinal(insight.moonTransit.houseFromMoon)} house</strong> from Moon.
        </p>
        <p style="font-size:13px;color:${COLORS.secondary};line-height:1.5;margin:6px 0 0;">
          ${insight.moonTransit.effect}
        </p>
      </td>
    </tr>

    <!-- Key Transits -->
    <tr>
      <td style="padding:16px 24px;">
        <h3 style="color:${COLORS.accent};font-size:15px;margin:0 0 10px;border-bottom:1px solid ${COLORS.gold};padding-bottom:6px;">
          🪐 Key Planetary Transits
        </h3>
        ${insight.keyTransits.map(t => `
        <div style="margin-bottom:10px;padding:10px 12px;background-color:${t.isBenefic ? "#F1F8F1" : "#FFF5F5"};border-left:3px solid ${t.isBenefic ? COLORS.green : COLORS.red};border-radius:4px;">
          <p style="font-size:13px;margin:0;color:${COLORS.textDark};">
            <strong>${t.planet}</strong> in ${t.sign} — ${getOrdinal(t.houseFromMoon)} house from Moon
            <span style="color:${t.isBenefic ? COLORS.green : COLORS.red};font-size:11px;"> (${t.isBenefic ? "✓ Benefic" : "⚠ Caution"})</span>
          </p>
        </div>
        `).join("")}
      </td>
    </tr>

    ${insight.sadeSatiActive ? `
    <!-- Sade Sati Alert -->
    <tr>
      <td style="padding:16px 24px;">
        <div style="background-color:#FFF3E0;border:1px solid ${COLORS.orange};border-radius:8px;padding:14px;">
          <h4 style="color:${COLORS.orange};font-size:14px;margin:0 0 6px;">⚡ Sade Sati Active — ${capitalize(insight.sadeSatiPhase || "")} Phase</h4>
          <p style="font-size:12px;color:${COLORS.textDark};line-height:1.5;margin:0;">
            ${insight.sadeSatiAdvice || "Practice patience and discipline during this karmic period."}
          </p>
        </div>
      </td>
    </tr>` : ""}

    <!-- Dasha Context -->
    <tr>
      <td style="padding:16px 24px;">
        <h3 style="color:${COLORS.accent};font-size:15px;margin:0 0 10px;border-bottom:1px solid ${COLORS.gold};padding-bottom:6px;">
          🔄 Active Dasha Period
        </h3>
        <p style="font-size:13px;color:${COLORS.textDark};margin:0 0 4px;">
          <strong>${insight.dashaContext.mahadasha}</strong> Mahadasha →
          <strong>${insight.dashaContext.antardasha}</strong> Antardasha
        </p>
        <p style="font-size:12px;color:${COLORS.secondary};line-height:1.5;margin:4px 0 0;">
          ${insight.dashaContext.interpretation}
        </p>
      </td>
    </tr>

    <!-- Activities -->
    <tr>
      <td style="padding:16px 24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td width="50%" valign="top" style="padding-right:8px;">
              <h4 style="color:${COLORS.green};font-size:13px;margin:0 0 6px;">✅ Favorable</h4>
              ${insight.activities.favorable.map(a => `
              <p style="font-size:12px;color:${COLORS.textDark};margin:0 0 4px;">• ${a}</p>
              `).join("")}
            </td>
            <td width="50%" valign="top" style="padding-left:8px;">
              <h4 style="color:${COLORS.red};font-size:13px;margin:0 0 6px;">⚠️ Avoid</h4>
              ${insight.activities.unfavorable.map(a => `
              <p style="font-size:12px;color:${COLORS.textDark};margin:0 0 4px;">• ${a}</p>
              `).join("")}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Daily Remedy -->
    <tr>
      <td style="padding:16px 24px;">
        <div style="background-color:${COLORS.cream};border:1px solid ${COLORS.gold};border-radius:8px;padding:14px;">
          <h4 style="color:${COLORS.primary};font-size:14px;margin:0 0 6px;">💎 Today's Remedy (${insight.dailyRemedy.planet})</h4>
          <p style="font-size:13px;color:${COLORS.textDark};line-height:1.5;margin:0 0 4px;">
            ${insight.dailyRemedy.remedy}
          </p>
          <p style="font-size:11px;color:${COLORS.textLight};margin:0;font-style:italic;">
            ${insight.dailyRemedy.reason}
          </p>
        </div>
      </td>
    </tr>

    <!-- BPHS Verse -->
    <tr>
      <td style="padding:16px 24px;">
        <div style="background-color:#F5F0FF;border-left:3px solid ${COLORS.accent};padding:12px 14px;border-radius:4px;">
          <p style="font-size:11px;color:${COLORS.textLight};margin:0 0 4px;">
            📖 ${insight.bphsVerse.source} Chapter ${insight.bphsVerse.chapter} — ${insight.bphsVerse.topic}
          </p>
          <p style="font-size:13px;color:${COLORS.textDark};line-height:1.5;margin:0;font-style:italic;">
            "${insight.bphsVerse.insight}"
          </p>
        </div>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding:20px 24px;text-align:center;">
        <a href="https://grahai.vercel.app/daily" style="display:inline-block;background-color:${COLORS.primary};color:${COLORS.white};text-decoration:none;padding:12px 32px;border-radius:6px;font-size:14px;font-weight:bold;letter-spacing:0.5px;">
          View Full Daily Insight →
        </a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color:${COLORS.accent};padding:20px 24px;text-align:center;">
        <p style="color:${COLORS.gold};font-size:14px;margin:0 0 4px;">ग्रह AI — GrahAI</p>
        <p style="color:${COLORS.cream};font-size:11px;margin:0 0 8px;opacity:0.8;">
          Personalized Vedic Astrology Intelligence
        </p>
        <p style="color:${COLORS.cream};font-size:10px;margin:0;opacity:0.6;">
          This insight is generated using Swiss Ephemeris calculations and classical Vedic references (BPHS, Saravali, Phaladeepika).
          For life-changing decisions, always consult a qualified Jyotish practitioner.
        </p>
        <p style="color:${COLORS.cream};font-size:10px;margin:8px 0 0;opacity:0.5;">
          <a href="https://grahai.vercel.app/settings" style="color:${COLORS.cream};">Manage email preferences</a>
        </p>
      </td>
    </tr>

  </table>
</body>
</html>`
}

// ─── Plain Text Version ─────────────────────────────────

export function renderDailyInsightPlainText(insight: DailyInsight): string {
  return `
GrahAI — Daily Cosmic Insight
${insight.date}
================================

Namaste ${insight.name}!

${insight.headline}

📅 PANCHANG
Tithi: ${insight.panchang.tithi}
Nakshatra: ${insight.panchang.nakshatra}
Yoga: ${insight.panchang.yoga}
Karana: ${insight.panchang.karana}
Rahu Kaal: ${insight.panchang.rahuKaal}
${insight.panchang.auspicious.length > 0 ? `Auspicious: ${insight.panchang.auspicious.join(", ")}` : ""}

🌙 MOON TRANSIT
Moon in ${insight.moonTransit.currentSign} (${insight.moonTransit.nakshatra})
${getOrdinal(insight.moonTransit.houseFromMoon)} house from Moon
${insight.moonTransit.effect}

🪐 KEY TRANSITS
${insight.keyTransits.map(t =>
  `${t.planet} in ${t.sign} — ${getOrdinal(t.houseFromMoon)} house (${t.isBenefic ? "Benefic" : "Caution"})`
).join("\n")}

${insight.sadeSatiActive ? `⚡ SADE SATI: ${capitalize(insight.sadeSatiPhase || "")} Phase Active\n${insight.sadeSatiAdvice}\n` : ""}

🔄 ACTIVE DASHA
${insight.dashaContext.mahadasha} → ${insight.dashaContext.antardasha}
${insight.dashaContext.interpretation}

✅ FAVORABLE: ${insight.activities.favorable.join(", ")}
⚠️ AVOID: ${insight.activities.unfavorable.join(", ")}

💎 TODAY'S REMEDY (${insight.dailyRemedy.planet})
${insight.dailyRemedy.remedy}

📖 VERSE OF THE DAY
${insight.bphsVerse.source} Ch.${insight.bphsVerse.chapter}: ${insight.bphsVerse.topic}
"${insight.bphsVerse.insight}"

---
View full insight: https://grahai.vercel.app/daily
GrahAI — Personalized Vedic Astrology Intelligence
`.trim()
}

// ─── Helpers ────────────────────────────────────────────

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
