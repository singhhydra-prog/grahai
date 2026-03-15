# GrahAI Explanation Layer — Technical Spec

> Every insight should have a "why" the user can access. This spec defines how.

---

## Architecture Overview

The explanation layer is a structured data system that accompanies every GrahAI output. It provides the chart factors, classical references, and confidence assessments that justify the guidance shown to the user.

### Data Flow

```
Birth Chart Data
       ↓
  [Generator / AI System]
       ↓
  Output + ExplanationData
       ↓
  [UI Renderer]
       ↓
  Layer A (inline) — always visible
  Layer B (summary) — one tap away
  Layer C (deep)   — in SourceDrawer
```

---

## ExplanationData Interface

```typescript
interface ExplanationData {
  /** Inline context string woven into the output text (Layer A) */
  inlineContext: string

  /** Factors that produced this insight (Layer B) */
  factors: ChartFactor[]

  /** Synthesis: one sentence combining all factors (Layer B closing) */
  synthesis: string

  /** Classical references (Layer C) */
  references: ClassicalReference[]

  /** Numerical data points (Layer C) */
  calculations?: CalculationNote[]
}

interface ChartFactor {
  /** What: planet, yoga, dasha, transit, house lord, etc. */
  type: 'planet' | 'house_lord' | 'yoga' | 'dosha' | 'dasha' | 'transit' | 'aspect' | 'nakshatra' | 'ashtakavarga'

  /** Human-readable label */
  label: string

  /** Plain language explanation of what this factor contributes */
  explanation: string

  /** How strong this signal is */
  strength: 'strong' | 'notable' | 'present' | 'mixed'

  /** Optional: the specific chart data (e.g., "Venus in Pisces in 12th house, exalted") */
  detail?: string
}

interface ClassicalReference {
  /** Text abbreviation: BPHS, PD, SAR, JP, BJ, UJ */
  text: string

  /** Chapter/section/verse if known */
  location?: string

  /** What principle this reference establishes */
  principle: string
}

interface CalculationNote {
  /** What was calculated */
  label: string

  /** The value */
  value: string | number

  /** What it means in plain language */
  interpretation: string
}
```

---

## Where ExplanationData Is Generated

### Code-Based Report Generators

Each `generateXxxSection()` function returns `ExplanationData` alongside the content.

**Change required in `generators/types.ts`:**

```typescript
interface ReportSection {
  title: string
  content: string
  explanation: ExplanationData  // NEW
}

interface GeneratedReport {
  summary: string
  summaryExplanation: ExplanationData  // NEW
  sections: ReportSection[]
  remedies: ReportRemedy[]
  methodology?: ReportMethodology  // NEW — for the report appendix
}

interface ReportMethodology {
  chartsAnalyzed: string[]      // e.g., ["Rashi (D1)", "Navamsa (D9)", "Dasamsa (D10)"]
  systemsUsed: string[]         // e.g., ["Vimshottari Dasha", "Ashtakavarga", "Shadbala"]
  factorsConsidered: number     // total chart factors that fed into the report
  references: ClassicalReference[]
}
```

**Example from career-blueprint generator:**

```typescript
const explanation: ExplanationData = {
  inlineContext: `Your 10th house lord ${tenthLord.name} is ${tenthLord.dignity} in your ${tenthLord.house} house`,
  factors: [
    {
      type: 'house_lord',
      label: `10th House Lord: ${tenthLord.name}`,
      explanation: `Rules your career house (${tenthSign}). Placed in the ${tenthLord.house} house in ${tenthLord.sign}.`,
      strength: tenthLord.dignity === 'exalted' || tenthLord.dignity === 'own' ? 'strong' :
                tenthLord.dignity === 'friendly' ? 'notable' :
                tenthLord.dignity === 'neutral' ? 'present' : 'mixed',
      detail: `${tenthLord.name} in ${tenthLord.sign} in house ${tenthLord.house}, ${tenthLord.dignity} dignity${tenthLord.retrograde ? ', retrograde' : ''}`
    },
    {
      type: 'dasha',
      label: `Current Period: ${mahadasha.lord} Mahadasha`,
      explanation: `Your current life chapter is ruled by ${mahadasha.lord}, influencing your ${mahadasha.houseRuled} house themes.`,
      strength: mahadasha.lord === tenthLord.name ? 'strong' : 'notable',
      detail: `Active from ${mahadasha.start} to ${mahadasha.end}`
    }
  ],
  synthesis: `Career matters are ${strengthLabel} in your chart, with ${tenthLord.name}'s ${tenthLord.dignity} placement shaping a ${careerArchetype} professional style.`,
  references: [
    {
      text: 'BPHS',
      location: 'Ch. 24',
      principle: 'Effects of house lords placed in different houses'
    },
    {
      text: 'PD',
      location: 'Ch. 7',
      principle: 'Interpretation of planets in dignity states'
    }
  ],
  calculations: [
    {
      label: '10th House Ashtakavarga',
      value: ashtakavarga10th,
      interpretation: ashtakavarga10th >= 30 ? 'Above average — strong career support' :
                      ashtakavarga10th >= 25 ? 'Average — steady career path' :
                      'Below average — career requires extra effort'
    }
  ]
}
```

### AI Chat Responses

The AI system prompt instructs Claude to return structured source data alongside the response.

**Addition to system prompt:**

```
When generating the "Why GrahAI Says This" section, structure it as follows:

FACTORS:
1. [Chart factor type]: [Label] — [Explanation]. Strength: [strong/notable/present/mixed]
2. [Chart factor type]: [Label] — [Explanation]. Strength: [strong/notable/present/mixed]

SYNTHESIS: [One sentence combining all factors]

REFERENCES:
- [Text abbreviation], [Chapter/Section] — [Principle]

The client will parse this structure into the explanation layer UI.
```

**Parser enhancement in `AskTab.tsx`:**
Add parsing for the structured FACTORS/SYNTHESIS/REFERENCES format from the "Why GrahAI Says This" section. Convert to `ExplanationData` object for the SourceDrawer.

### Daily Insight Generator

The cron job that generates daily insights must include an `ExplanationData` object in its output.

**Change required in daily insight API response:**

```typescript
interface DailyInsight {
  theme: string
  headline: string
  content: string
  categories: CategoryBreakdown[]
  action: string
  caution: string
  explanation: ExplanationData  // NEW
}
```

---

## UI Components

### Layer A: Inline Context (No New Component)
The `inlineContext` string from `ExplanationData` is already woven into the output text by the generator. No separate UI component needed — it's part of the prose.

### Layer B: WhyThisGuidance Component (New)

```typescript
interface WhyThisGuidanceProps {
  factors: ChartFactor[]
  synthesis: string
  defaultExpanded?: boolean
}
```

**Behavior:**
- Default: collapsed, showing "Why this guidance?" text with down chevron
- Tap: expands to show numbered factors with strength badges
- Each factor: one line of explanation + strength pill (gold/silver/gray/amber)
- Bottom: synthesis sentence in slightly emphasized text
- "View full sources" link → opens SourceDrawer

**Design:**
- Background: subtle glass-morphic panel (#0F172A with slight opacity)
- Text: cosmic-white (#E8E6F0) for explanations, saffron (#D4A843) for labels
- Strength pills: small rounded badges with color coding
- Chevron animation: 200ms rotation

### Layer C: SourceDrawer Enhancement

**Current state:** Shows `principle`, `reference`, `context` fields.

**Enhance to show:**
- **Chart Factors section:** All `factors` from ExplanationData with full detail strings
- **Classical References section:** All `references` with text + location + principle
- **Calculations section:** All `calculations` with value + interpretation
- **Strength summary:** Overall confidence assessment based on factor strengths

---

## Strength Aggregation Logic

When multiple factors contribute to an insight, aggregate their strength:

```typescript
function aggregateStrength(factors: ChartFactor[]): OverallStrength {
  const scores = { strong: 3, notable: 2, present: 1, mixed: 0 }
  const total = factors.reduce((sum, f) => sum + scores[f.strength], 0)
  const avg = total / factors.length

  if (avg >= 2.5) return 'strong'    // Mostly strong factors
  if (avg >= 1.5) return 'notable'   // Mix of strong and moderate
  if (avg >= 0.5) return 'present'   // Mostly present or moderate
  return 'mixed'                      // Conflicting or weak factors
}
```

This aggregated strength appears as the overall confidence badge in the SourceDrawer.

---

## Migration Plan

### Phase 1: Add ExplanationData to Report Generators
- Update `types.ts` with new interfaces
- Add `explanation` property to each `ReportSection` generated
- Start with career-blueprint and love-compat (most used reports)
- Render in report detail view

### Phase 2: Add WhyThisGuidance Component
- Build the collapsible component
- Integrate below daily insights
- Integrate below chat answers

### Phase 3: Enhance SourceDrawer
- Add Chart Factors, References, and Calculations sections
- Update existing SourceDrawer calls to pass enhanced data

### Phase 4: Add to AI Chat
- Update system prompt with structured source format
- Add parser for FACTORS/SYNTHESIS/REFERENCES
- Wire to WhyThisGuidance + SourceDrawer

### Phase 5: Add to Daily Insights
- Update cron generator to produce ExplanationData
- Wire to WhyThisGuidance in HomeTab
