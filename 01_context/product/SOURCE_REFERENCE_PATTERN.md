# GrahAI Source & Reference Pattern

> GrahAI earns trust by showing its work — simply, elegantly, without becoming a textbook.

---

## Design Principle

Every significant insight should be traceable. The user should never feel that GrahAI is making things up. But the source layer must be optional, progressive, and non-overwhelming.

The default experience is clarity. The source layer is depth — available for the curious, invisible to those who just want the guidance.

---

## The Three-Layer Source Model

### Layer A: Inline Context (Always Visible)
A natural-language mention of what the insight is based on. Woven into the text itself, not set apart in a special box. The user absorbs it without effort.

**Pattern:** "Based on [chart factor], [plain language interpretation]..."

**Examples:**
- "Based on your Moon in Scorpio, your emotional world runs deep and private..."
- "With Venus transiting your 7th house this week, relationship conversations intensify..."
- "Your Mars Mahadasha (active since 2023) is a chapter of action and assertion in your life..."

**Rules:**
- Every major paragraph in a report or answer must open with or contain an inline chart reference
- Use plain language, not technical notation ("your Venus in Pisces" not "Ve in Pi in H12")
- Reference the specific house meaning ("your 7th house — the space of partnerships")
- If timing is relevant, include dates or durations

### Layer B: "Why This Guidance?" Summary (One Tap Away)
A dedicated section or expandable block that explains the reasoning behind the insight. More detailed than Layer A, but still in plain language.

**Pattern:**

```
Why this guidance?

This reading draws from three factors in your chart:

1. [Planet] in [sign] in your [house] — [plain meaning]
   Strength: [strong/moderate/challenged]

2. [Current dasha/transit] — [what's active now]
   Active until: [date]

3. [Yoga/dosha/aspect] — [what it adds to the picture]

These factors combined suggest [synthesis in one sentence].
```

**Rules:**
- Maximum 3-4 factors per explanation (more becomes overwhelming)
- Each factor gets one line of plain explanation
- Include strength/confidence indicator where appropriate
- End with a synthesis sentence that ties the factors together
- This section should be collapsible/expandable in the UI

### Layer C: Deep Reference (For the Curious)
Classical text citations, technical details, and interpretive methodology. For users who want to verify or learn more.

**Pattern:**

```
Sources & references

• [Classical text], [chapter/section] — [what principle it establishes]
• [Calculation detail] — [e.g., "Ashtakavarga score: 28/337 for 10th house"]
• [Interpretive note] — [why this interpretation was chosen over alternatives]
```

**Rules:**
- Cite real classical texts (BPHS, Phaladeepika, Saravali, Jataka Parijata)
- Include chapter/section numbers where known
- Explain the principle in one line — don't just name the text
- Include numerical data (Ashtakavarga bindus, Shadbala scores) where relevant
- This layer is always optional — never forced on the user
- In UI: accessible via "View sources" link or SourceDrawer component

---

## Classical Sources to Reference

| Abbreviation | Full Title | Primary Use |
|-------------|-----------|-------------|
| BPHS | Brihat Parashara Hora Shastra | Houses, planets, dashas, yogas, remedies |
| PD | Phaladeepika | Planetary effects in houses and signs |
| SAR | Saravali | Detailed planet-in-sign interpretations |
| JP | Jataka Parijata | Advanced yogas and special combinations |
| BJ | Brihat Jataka (Varahamihira) | Classical planet dignity and aspects |
| UJ | Uttara Kalamrita | Dasha effects and timing |
| MJ | Muhurta Jyotish | Timing and electional astrology |

**Rules for citation:**
- Always use the abbreviation + chapter number: "BPHS Ch. 26" not just "ancient texts"
- If verse number is known, include it: "BPHS Ch. 36, Verse 14-17"
- If citing a principle rather than a specific verse: "Following the principle of house-lord placement effects (BPHS Ch. 24)"
- Never fabricate citations — if unsure of exact chapter, cite the text generally: "As described in Phaladeepika's treatment of Venus in houses"

---

## Confidence & Strength Indicators

Not all astrological signals are equally strong. GrahAI should communicate confidence levels without undermining trust.

### Signal Strength Scale

| Level | Label | When to Use | Language Pattern |
|-------|-------|-------------|-----------------|
| Strong | "Clear indication" | Planet in own sign/exalted + dasha activation + supportive transit | "Your chart strongly supports..." / "This is one of the clearer patterns in your chart..." |
| Moderate | "Notable pattern" | Planet in friendly sign + partial timing activation | "Your chart suggests..." / "There is a meaningful pattern here..." |
| Present | "Worth noting" | Planet in neutral position, or factor present but not activated by timing | "Your chart shows this factor..." / "This is present in your chart, though not strongly activated right now..." |
| Mixed | "Complex picture" | Conflicting factors (e.g., exalted planet but in 6th/8th house, or yoga with dosha) | "Your chart shows both support and challenge here..." / "This is nuanced — here's what to understand..." |

**Rules:**
- Never say "guaranteed" or "certain" — astrology is interpretation, not prophecy
- Always acknowledge when factors conflict
- When a signal is weak, don't hide it — contextualize it: "This pattern exists in your chart but isn't strongly activated right now. It may become more relevant when [timing condition]."
- When a signal is strong, name why: "This is particularly strong because [planet] is in its own sign AND your current Mahadasha activates the same house."

---

## Applied to Each Output Type

### Daily Insights

**Layer A (inline):** Opening sentence references today's transit + user's natal chart interaction.
**Layer B (why this guidance?):** Below the main insight, collapsible. Names 1-2 transit factors + current dasha.
**Layer C (sources):** Available via "View source" button in SourceDrawer. Shows transit data + classical principle.

**Example:**
> **Today's Focus: Clear Communication**
>
> Mercury enters your 3rd house today — the space in your chart connected to how you think and speak. During your current Jupiter Antardasha, there's natural support for learning and meaningful exchange. *(Layer A)*
>
> ▸ Why this guidance?
> Mercury transiting Pisces enters your natal 3rd house (Aquarius rising). Your Jupiter Antardasha (active until Nov 2027) rules your 2nd and 11th houses, supporting speech and gains through communication. Combined: today is particularly supportive for important conversations. *(Layer B)*
>
> ▸ View sources
> Transit: Mercury ingress Pisces, March 15 2026. Principle: BPHS Ch. 65 on transit effects through houses. Jupiter Antardasha effect: UJ, Section on Jupiter sub-period. *(Layer C)*

### Chat Answers

**Layer A:** Woven into the Direct Answer and Why sections of the 7-section format.
**Layer B:** Presented as the "Why GrahAI Says This" section (already exists in format).
**Layer C:** Available via SourceDrawer tap from the answer.

**Enhancement:** The existing "Why GrahAI Says This" section should include at least one classical text reference and one specific chart factor. Currently it's often vague — tighten it.

### Reports

**Layer A:** Every section opens with a chart-specific statement.
**Layer B:** Each major section includes a "Based on" summary box listing the 2-3 factors analyzed.
**Layer C:** Report ends with a "Methodology & Sources" appendix listing all classical texts referenced, calculations performed, and divisional charts consulted.

### Compatibility Results

**Layer A:** Each dimension (emotional, mental, physical, etc.) opens with both partners' relevant chart factors.
**Layer B:** Ashtakoot score breakdown with plain-language explanation of each component.
**Layer C:** Full Guna matching table with classical scoring system reference (BPHS Ch. 70-71 on compatibility).

---

## UI Implementation

### SourceDrawer Component (Existing — Enhance)

Current state: Shows `principle` + `reference` + `context` fields.

**Enhance to include:**
- **Chart factors:** List of specific natal/transit factors (planet, sign, house, dignity)
- **Classical reference:** Text + chapter + one-line explanation of the principle
- **Strength indicator:** Visual badge (Strong / Notable / Present / Mixed)
- **Calculation note:** Ashtakavarga score, Shadbala value, or other numerical data when relevant

### "Why this guidance?" Block (New Component)

A collapsible block that appears below any major insight. Default: collapsed. Tap to expand.

**Design:**
- Subtle "Why this guidance?" text link with chevron
- Expands to show 2-4 numbered factors with plain explanations
- Ends with synthesis sentence
- "View full sources" link at bottom opens SourceDrawer

### Source Badge (New Component)

A small inline badge that appears next to chart-specific claims. Shows strength level.

**Design:**
- Small pill: "Based on your chart" (tappable → expands to Layer B)
- Color-coded: Gold (strong), Silver (notable), Gray (present), Amber (mixed)

---

## What This Changes in Generation

### For Code-Based Report Generators
- Each `generateXxxSection()` function must return a `sources` array alongside the content
- Source format: `{ factor: string, explanation: string, reference?: string, strength: 'strong' | 'notable' | 'present' | 'mixed' }`
- The UI renderer consumes this to build Layer B and Layer C

### For AI Chat Prompts
- The system prompt must instruct Claude to include chart factors and classical references in the "Why GrahAI Says This" section
- Format: "Cite at least one classical text (BPHS, PD, SAR, JP, BJ) with chapter when known"
- Include: "Name the specific chart factor (planet, house, sign, dasha) that leads to this conclusion"

### For Daily Insight Generation
- The insight generator must include the transit + natal interaction that drives the day's theme
- The cron job output must include a `source` object with `{ transit, natalFactor, principle, reference }`
