# GrahAI Implementation Blueprint

> From philosophy to code. The build plan for making GrahAI personal, source-aware, story-driven, and simple.

---

## Document Map

This blueprint brings together all product specs into an actionable implementation plan. Reference documents:

| Document | What It Defines |
|----------|----------------|
| PRODUCT_PHILOSOPHY.md | The Five Questions, voice, feel, anti-patterns |
| PERSONALIZATION_RULES.md | 5 data layers, rules per surface, anti-patterns |
| SOURCE_REFERENCE_PATTERN.md | Three-layer source model, classical references, confidence indicators |
| STORY_SYSTEM.md | 8 story components, ChartStorySnapshot, cross-surface continuity |
| OUTPUT_VOICE_RULES.md | Four-layer output structure, voice rules, tone calibration |
| EXPLANATION_LAYER_SPEC.md | ExplanationData interface, UI components, migration plan |
| UX_REDESIGN_SPEC.md | Page-by-page UX changes |
| REPORT_STYLE_GUIDE.md | Report structure, writing rules, uniqueness standards |

---

## Section 1: Updated Product Philosophy (Summary)

**Soul:** Calm intelligence for uncertain moments.

**Core experience:** GrahAI tells the user their chart's story — personal, explainable, source-aware, narrative, simple, premium, and emotionally intelligent.

**Five Questions every output must answer:**
1. What does this mean for me personally?
2. Why is GrahAI saying this?
3. What in my chart is this based on?
4. How does this connect to my larger story?
5. What should I understand or do next?

**Measurement:** If you can swap two users' names and the output still reads the same, it has failed.

---

## Section 2: Implementation Notes for Frontend

### New Components to Build

| Component | Purpose | Priority | Complexity |
|-----------|---------|----------|------------|
| `ChartContextBar` | Persistent chart context on every screen | P1 | Low |
| `WhyThisGuidance` | Collapsible explanation block (Layer B) | P1 | Medium |
| `SourceDrawer` enhancement | Add factors, references, calculations | P1 | Medium |
| `ChapterHeader` | Current Mahadasha/Antardasha context on Home | P1 | Low |
| `PersonalizedReportCard` | Report card with chart-specific teaser | P2 | Medium |
| `IdentityNarrative` | Profile tab's "Your Astrological Identity" card | P2 | Medium |
| `ChartExplorer` | Interactive kundli with tap-to-explain | P3 | High |
| `JourneyLog` | Themed history grouping | P3 | High |
| `OnboardingGlimpse` | "Your First Glimpse" after chart generation | P1 | Low |
| `AshtakootBreakdown` | 8-component compatibility breakdown | P2 | High |

### Component Architecture Notes

**ChartContextBar:**
- Reads from cached chart data (localStorage `cosmic-snapshot`)
- Displays: Moon sign, current Mahadasha, one transit highlight
- Variants: compact (Ask tab), standard (Home tab), branded (Reports)
- No API call — pure client state

**WhyThisGuidance:**
- Receives `ExplanationData` as prop
- Default collapsed; expands on tap
- Renders factors as numbered list with strength badges
- "View full sources" link triggers SourceDrawer
- Framer Motion for expand/collapse animation (200ms)

**OnboardingGlimpse:**
- Receives chart data from the generation step
- Computes 3 simple insights from: Moon sign, Ascendant, current Mahadasha
- Displays with staggered fade-in animation
- CTA: "Enter GrahAI" → navigates to Home tab

### State Management Changes

**New: ChartStorySnapshot in user context**

Add to the existing auth/user context:

```typescript
interface ChartStorySnapshot {
  currentChapter: {
    mahadasha: string       // "Venus"
    mahadashaTheme: string  // "relationships, creativity, resources"
    mahadashaEnd: string    // "2041-03-15"
    antardasha: string      // "Mars"
    antardashaTheme: string // "energy, ambition, assertion"
    antardashaEnd: string   // "2027-08-22"
  }
  recurringThemes: Array<{
    theme: string           // "Building tangible value"
    evidence: string        // "Saturn strong in 10th, Mars in 2nd"
  }>
  emotionalPattern: {
    moonSign: string
    moonHouse: number
    style: string           // "Deep, private, intense"
  }
  timingPhase: {
    type: 'expansion' | 'contraction' | 'transition'
    reason: string
    until: string
  }
  activeChange: {
    factor: string          // "Saturn transiting 7th house"
    meaning: string         // "Relationships getting serious"
    until: string
  }
  lesson: string            // "Trust your own authority"
}
```

**Computation:** Generated from `ReportData` after chart assembly. Call a new function `computeStorySnapshot(reportData)` and cache in localStorage + optionally in Supabase `profiles.story_snapshot`.

**Update frequency:** Recompute when Antardasha changes or every 30 days (whichever comes first).

---

## Section 3: Implementation Notes for Generation Prompts

### AI Chat System Prompt Updates

Add to the Jyotish Guru agent prompt:

```markdown
## PERSONALIZATION RULES

You are speaking to ONE person. Their chart data is injected below.
Every response must reference their specific chart — never generic astrology.

ALWAYS include in your Direct Answer:
- At least one reference to their current Mahadasha/Antardasha
- At least one reference to a specific natal planet placement
- The user's name naturally woven in (not as a prefix)

## STORY CONTINUITY

The user is in their [Mahadasha Lord] chapter — a period of [theme].
Their current sub-chapter is [Antardasha Lord] (until [date]).
Their recurring life themes are: [themes from snapshot].
Their emotional pattern: [Moon description].
What's actively changing: [active change].

Reference at least one of these story elements in every response.
Connect the user's question to their larger narrative.

## SOURCE FORMAT

In the "Why GrahAI Says This" section, use this exact format:

FACTORS:
1. [type]: [Label] — [Explanation]. Strength: [strong/notable/present/mixed]
2. [type]: [Label] — [Explanation]. Strength: [strong/notable/present/mixed]

SYNTHESIS: [One sentence combining the factors]

REFERENCES:
- [Text], [Chapter] — [Principle]

## TONE

- Warm authority, not lecture mode
- Frame challenges as growth, never as fate
- Include timing (dates, not "soon")
- End with something practical
- Never say "the universe wants" or "the stars guarantee"
```

### Daily Insight Cron Updates

The daily insight generator (`/api/cron/daily-insights`) must:

1. Load the user's chart data
2. Compute today's strongest transit interaction with their natal chart
3. Load their `storySnapshot` (or compute if missing)
4. Generate the insight using the transit + snapshot context
5. Return `ExplanationData` alongside the insight content

### Report Generator Updates

Each generator function signature changes:

```typescript
// Before
function generateCareerReport(data: ReportData): GeneratedReport

// After
function generateCareerReport(
  data: ReportData,
  storySnapshot: ChartStorySnapshot
): GeneratedReport
```

Each section must use the `storySnapshot` to:
- Reference the current chapter in at least one section
- Connect to recurring themes in the conclusion
- Tie remedies to the active change

---

## Section 4: QA Checklist — "Personal + Source-Based + Story + Simple"

### For Every Daily Insight

- [ ] Opens with user's current chapter context (Mahadasha + Antardasha)
- [ ] Names today's transit interacting with their natal chart
- [ ] Includes at least 1 specific chart factor (planet + house or sign)
- [ ] Ends with a practical takeaway
- [ ] WhyThisGuidance block is present and populated
- [ ] Language is Grade 8-10 readability
- [ ] No generic horoscope language ("the stars suggest...")
- [ ] Could NOT apply to a user with a different chart

### For Every Chat Answer

- [ ] First sentence references user's chart data
- [ ] At least 2 chart factors named in the explanation
- [ ] At least 1 timing reference (date, duration, or window)
- [ ] "Why GrahAI Says This" section includes FACTORS + SYNTHESIS + REFERENCES format
- [ ] Practical takeaway present
- [ ] Connects to user's current chapter or recurring theme
- [ ] No unexplained claims
- [ ] Tone appropriate for the emotional context of the question

### For Every Report

- [ ] Summary includes ascendant, primary chart factor, current dasha
- [ ] Every section opens with a chart-specific reference
- [ ] At least 2 chart factors per section
- [ ] Dignity-driven language (exalted ≠ debilitated tone)
- [ ] Timing section includes specific date windows
- [ ] Remedies explain WHY this remedy matches this chart imbalance
- [ ] Methodology appendix lists charts, systems, and references
- [ ] Uniqueness: >65% unique in cross-profile comparison
- [ ] No section could be reassigned to a different chart unchanged

### For Every Compatibility Result

- [ ] Both partners' chart factors named in each dimension
- [ ] Ashtakoot breakdown shows all 8 components with explanations
- [ ] Narrative headline describes the relationship dynamic
- [ ] Guidance section names what to nurture AND what to navigate
- [ ] Sources cited for scoring methodology

### For UI/UX

- [ ] ChartContextBar visible on every main screen
- [ ] WhyThisGuidance present below every major insight
- [ ] SourceDrawer accessible from every output
- [ ] Cross-navigation works (insight → ask, report → ask, etc.)
- [ ] Onboarding "First Glimpse" shows 3 chart-specific insights
- [ ] Report cards show personalized teaser, not just generic description
- [ ] Profile tab shows Identity Narrative, not just data fields

---

## Section 5: Priority Roadmap

### Phase 1: Foundation (Week 1-2)
**Goal:** Core personalization infrastructure. Everything builds on this.

| Task | Files Changed | Effort |
|------|--------------|--------|
| Create `computeStorySnapshot()` function | New: `src/lib/story/snapshot.ts` | Medium |
| Add `ChartStorySnapshot` to user context | `src/lib/auth/` or context provider | Low |
| Create `ChartContextBar` component | New: `src/components/ui/ChartContextBar.tsx` | Low |
| Add ChartContextBar to all 5 tabs | Tab components | Low |
| Create `WhyThisGuidance` component | New: `src/components/ui/WhyThisGuidance.tsx` | Medium |
| Update `ExplanationData` types | `src/lib/reports/generators/types.ts` | Low |
| Add "First Glimpse" to onboarding | `src/components/app/OnboardingFlow.tsx` | Medium |

**Milestone:** User sees their chart context everywhere. Story snapshot is computed and cached.

### Phase 2: Report Quality (Week 3-4)
**Goal:** Reports feel personal, sourced, and story-connected.

| Task | Files Changed | Effort |
|------|--------------|--------|
| Add `ExplanationData` to career-blueprint generator | `src/lib/reports/generators/career-blueprint.ts` | Medium |
| Add `ExplanationData` to love-compat generator | `src/lib/reports/generators/love-compat.ts` | Medium |
| Add `ExplanationData` to annual-forecast generator | `src/lib/reports/generators/annual-forecast.ts` | Medium |
| Add story snapshot context to all generators | All 7 generator files | Medium |
| Add Methodology appendix to report output | `types.ts` + generators | Medium |
| Wire WhyThisGuidance into report detail view | Report detail component | Low |
| Enhance SourceDrawer with factors/references | `src/components/ui/SourceDrawer.tsx` | Medium |
| Improve uniqueness for weak generators (love-compat, kundli-match, wealth-growth) | 3 generator files | High |

**Milestone:** Reports pass the full QA checklist. Uniqueness >65% for all 7 types.

### Phase 3: Chat Intelligence (Week 5-6)
**Goal:** Chat answers feel like a conversation with someone who knows your chart story.

| Task | Files Changed | Effort |
|------|--------------|--------|
| Update Jyotish Guru system prompt with personalization rules | Supabase `agent_prompts` + fallback | Medium |
| Inject `storySnapshot` into chat API context | `src/app/api/chat/route.ts` | Medium |
| Add structured source parser for AI responses | `src/components/app/tabs/AskTab.tsx` | Medium |
| Add smart suggested questions (chart-aware) | AskTab | Medium |
| Add chart context bar above input | AskTab | Low |
| Wire WhyThisGuidance into chat responses | AskTab | Low |
| Add follow-up intelligence (narrative-building follow-ups) | AskTab | Medium |

**Milestone:** Chat answers reference the user's chart story. Sources are structured and parseable.

### Phase 4: Home & Daily (Week 7-8)
**Goal:** Home tab feels like opening a personal reading every day.

| Task | Files Changed | Effort |
|------|--------------|--------|
| Add ChapterHeader to HomeTab | HomeTab.tsx | Low |
| Update daily insight generation to include ExplanationData | `/api/cron/daily-insights` | Medium |
| Add "What's Changing" card to HomeTab | HomeTab.tsx | Medium |
| Add personalized report recommendation to HomeTab | HomeTab.tsx | Medium |
| Reframe category cards with chart-specific labels | HomeTab.tsx | Low |
| Remove lucky color/number, move panchang to collapsible | HomeTab.tsx | Low |
| Wire WhyThisGuidance into daily insight | HomeTab.tsx | Low |

**Milestone:** Home tab answers "what does my chart say about my life right now?"

### Phase 5: Compatibility & Profile (Week 9-10)
**Goal:** Compatibility is real. Profile tells the user who they are astrologically.

| Task | Files Changed | Effort |
|------|--------------|--------|
| Wire real Ashtakoot calculation to CompatibilityTab | CompatibilityTab.tsx + new engine function | High |
| Build AshtakootBreakdown component | New component | High |
| Add relationship profile context before partner input | CompatibilityTab.tsx | Medium |
| Build IdentityNarrative card for ProfileTab | ProfileTab.tsx | Medium |
| Add "Chart at a Glance" (yogas, doshas, strengths) | ProfileTab.tsx | Medium |
| Add interactive chart explorer (tap-to-explain) | KundliChart component | High |
| Reframe history as "Journey Log" with theme grouping | History components | Medium |

**Milestone:** Compatibility uses real calculations. Profile feels like an astrological identity card.

### Phase 6: Polish & Trust (Week 11-12)
**Goal:** Premium feel, trust elements, cross-surface coherence.

| Task | Files Changed | Effort |
|------|--------------|--------|
| Redesign PricingOverlay with value-first framing | PricingOverlay.tsx | Medium |
| Add chart-specific teasers to report cards | ReportsTab.tsx | Medium |
| Add disclaimer banner to report headers and daily insights | Components | Low |
| Reorganize FAQ around user concerns | FAQPage.tsx | Low |
| Add Quick Help floating button across app | Layout component | Low |
| Cross-surface navigation audit (insight→ask, report→ask, etc.) | Multiple components | Medium |
| Full QA pass against all checklists | — | High |

**Milestone:** Product passes the full "Personal + Source-Based + Story + Simple" QA checklist end-to-end.

---

## Section 6: What NOT to Build

| Temptation | Why Skip It | Instead |
|-----------|------------|---------|
| AI-generated images per user | Expensive, slow, low value per impression | Use consistent cosmic design language |
| Gamification system (XP, levels, badges beyond streaks) | Undermines premium calm feel | Focus on depth, not engagement tricks |
| Social features (share charts, community) | Distraction from core personal value | Enable WhatsApp sharing of compatibility results only |
| Multiple languages at launch | Fragmenting effort before product-market fit | English first, Hindi as Phase 7+ |
| Custom chart interpretations by human astrologers | Different product entirely (Astrotalk model) | Double down on code-based + AI-assisted model |
| Detailed past-life readings | Not chart-based, unfounded | Stick to Rahu/Ketu karmic themes from the actual chart |

---

## Section 7: Success Criteria

The product rewrite is successful when:

1. **A user's first 3 minutes** include seeing something chart-specific about themselves (onboarding "First Glimpse")
2. **Every daily insight** references their current dasha period and a specific natal chart factor
3. **Every chat answer** opens with their chart data, not a general astrology lesson
4. **Every report** passes >65% uniqueness and includes a Methodology appendix
5. **The compatibility tab** shows real Ashtakoot calculations with explanations
6. **The profile tab** describes who the user is astrologically, not just what data they entered
7. **Any random output** can be tested against the Five Questions and pass all five
8. **A non-astrology user** can read any output and understand the main point
9. **A returning user** feels the guidance connects to what they've seen before
10. **The overall feeling** is calm, premium, personal — never salesy, generic, or fear-based
