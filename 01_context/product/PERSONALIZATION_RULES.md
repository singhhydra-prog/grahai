# GrahAI Personalization Rules

> If you can swap two users' names and the output still reads the same, it has failed.

---

## Core Principle

Every GrahAI output must feel like it was written for one person. Personalization is not decoration — it is the product. A generic astrological statement with a user's name prepended is not personalized. True personalization means the content could only exist because of this specific user's chart, timing, and context.

---

## Personalization Data Layers

Every output draws from up to 5 data layers, used in priority order:

### Layer 1: Birth Chart (Always Available After Onboarding)
The user's natal chart is the foundation. Every output must reference at least one specific chart factor.

| Data Point | What It Personalizes | Example Use |
|-----------|---------------------|-------------|
| Ascendant (Lagna) | Life approach, body type, first impressions | "As a Sagittarius rising, your natural approach is expansive and philosophical..." |
| Moon sign + house | Emotional nature, comfort patterns, inner world | "Your Moon in Scorpio in the 4th house means you process emotions privately and deeply..." |
| Sun sign (Vedic) + house | Core identity, ego expression, vitality | "Sun in Capricorn in your 2nd house connects your identity to building tangible value..." |
| Nakshatra (Moon) | Soul purpose, instinctive patterns, deeper personality | "Born under Jyeshtha nakshatra, you carry a protective, elder-sibling energy..." |
| Planet dignities | Strength/weakness patterns | "Your Venus is debilitated — love doesn't come easily, but the love you build is earned and deep..." |
| House lords + placements | Life area dynamics | "Your 7th lord Mercury sits in the 12th — partnerships may involve distance or spiritual connection..." |
| Yogas detected | Special combinations defining life patterns | "Gaja Kesari Yoga in your chart gives natural wisdom and social respect..." |
| Doshas present | Challenges and their remedies | "Kuja Dosha from Mars in 7th suggests partnership friction — here's the nuance and what helps..." |
| Ashtakavarga scores | House strength indicators | "Your 10th house has 32 bindus — career matters have strong chart support..." |
| Divisional charts (D9, D10) | Marriage depth, career depth | "In your Navamsa, Venus moves to Pisces (exalted) — your deeper marriage potential is strong..." |

### Layer 2: Current Timing (Always Computable)
What is active in the user's chart right now. This makes outputs feel timely, not static.

| Data Point | What It Personalizes | Example Use |
|-----------|---------------------|-------------|
| Mahadasha lord | Current life chapter (7-20 year theme) | "You're in Rahu Mahadasha — this is your chapter of unconventional growth and foreign connections..." |
| Antardasha lord | Current sub-theme (1-3 year focus) | "Within that, Venus Antardasha brings relationships and creativity into focus until August 2027..." |
| Pratyantardasha | Current micro-focus (months) | "This month's Mercury pratyantardasha sharpens communication and commerce..." |
| Current transits | What planets are activating which houses NOW | "Jupiter is transiting your 5th house — creativity and children matters are amplified..." |
| Retrograde status | What's being reviewed or reconsidered | "Venus retrograde through your 7th house this month — old relationship patterns resurface for review..." |

### Layer 3: User's Selected Life Area (When Provided)
What the user cares about right now. This focuses the output.

| Life Area | Chart Focus | Language Focus |
|-----------|------------|----------------|
| Love / Relationships | 7th house, Venus, D9, Moon | Emotional, relational, partnership-oriented |
| Career / Purpose | 10th house, 10th lord, D10, Saturn | Professional, directional, achievement-oriented |
| Money / Wealth | 2nd house, 11th house, Jupiter | Financial, practical, growth-oriented |
| Health / Wellbeing | 6th house, Ascendant lord, Sun | Physical, energy-oriented, self-care |
| Family / Home | 4th house, Moon, Cancer themes | Emotional security, belonging, roots |
| Timing / Decisions | Dasha + transits | Time-specific, action-oriented, windows-focused |
| Spirituality / Growth | 9th house, 12th house, Jupiter, Ketu | Meaning-seeking, philosophical, inner-directed |

### Layer 4: Question Context (Chat Only)
What the user just asked. This shapes the lens.

**Rules:**
- Parse the question for emotional tone (anxious, curious, hopeful, frustrated)
- Identify the implied life area even if not stated ("Will things get better?" → timing + emotional state)
- Match the response depth to the question specificity (vague question → broader guidance; specific question → specific chart analysis)
- Reference the question naturally in the opening ("You asked about career timing — here's what your chart shows...")

### Layer 5: Past Interactions (When Available)
What themes keep appearing. This creates continuity.

**Rules:**
- If the user has asked about love 3+ times, acknowledge the recurring theme
- If a past answer referenced a specific planet or dasha, reference it again for consistency
- If the user saved an insight, it clearly mattered — subsequent outputs can build on it
- Never repeat the same guidance verbatim — evolve it based on transit changes

---

## Personalization Rules by Surface

### Daily Insights

**Minimum personalization:**
- Open with user's current Mahadasha + today's strongest transit to their chart
- Name at least one natal planet being activated by today's sky
- Connect today's theme to the user's current life chapter (not just the zodiac sign)

**What to avoid:**
- Sun-sign-only horoscopes ("Aries today...")
- Generic planetary transit descriptions that apply to everyone
- Copy-pasted panchang information without chart connection

**Example transformation:**

*Before (generic):* "Mercury enters Gemini today. Communication improves. Good day for meetings."

*After (personalized):* "Mercury enters your 7th house today — the space in your chart connected to partnerships. During your current Venus Antardasha, this activates stronger one-on-one conversations. If you've been meaning to have a meaningful talk with a partner or close collaborator, today's alignment between Mercury's transit and your Venus sub-period supports it. This is based on Mercury's natural friendship with Venus and their combined influence on your 7th house."

### Report Generation

**Minimum personalization:**
- Every section must reference at least 2 specific chart factors (planet + house, or planet + dignity, or yoga + dasha)
- The opening summary must include the user's ascendant, relevant house lord, and current dasha context
- Remedies must be specific to the user's chart imbalance (not generic "wear gemstone" lists)

**What to avoid:**
- Sections that describe a planet generically without placing it in the user's house
- Remedy lists that don't explain why this remedy matches this chart
- Transitions that could apply to anyone ("let us now explore your career potential")

**Personalization depth by section:**

| Report Section | Must Include |
|---------------|-------------|
| Summary/Overview | Ascendant, relevant house lord + dignity, current dasha, 1 key yoga or dosha |
| Main Analysis | Planet in sign + house + dignity, interactions with other planets, nakshatra influence |
| Timing/Forecast | Current Mahadasha + Antardasha, relevant transits, specific date windows |
| Remedies | Why this remedy (tied to specific chart weakness), how long, what to watch for |
| Deeper Reference | Classical source for at least 1 major claim, strength/confidence indicator |

### Chat Answers

**Minimum personalization:**
- First sentence must reference the user's chart ("Based on your Venus in the 7th house..." or "With your current Mars Mahadasha...")
- If the question has been asked before, acknowledge it ("You've explored this theme before — here's what's changed since...")
- The practical suggestion must be specific to their timing ("The next 3 weeks, while Mercury transits your 10th, are good for...")

**What to avoid:**
- Answers that could come from a generic astrology FAQ
- Starting with "In Vedic astrology, [general principle]..." before getting to the user's chart
- Suggestions that aren't tied to specific timing windows

### Compatibility Outputs

**Minimum personalization:**
- Both users' charts must be referenced with specific placements
- Ashtakoot scoring must be broken into the 8 individual components with explanations
- Synastry aspects (how one person's planets interact with the other's houses) must be described
- The narrative must describe the relationship dynamic, not just score components

**What to avoid:**
- Score-only outputs without narrative explanation
- Generic "you are compatible" statements without chart evidence
- Describing one person's chart without reference to how the other person's chart interacts

### Home Recommendations

**Minimum personalization:**
- "Recommended for you" must be based on current dasha + active transits
- Report suggestions must tie to what's most activated in the chart right now
- Quick actions should prioritize the user's most-asked-about life area

**Logic:**
- If user is in Venus dasha/antardasha → prioritize love/compatibility content
- If Jupiter transits user's 10th → recommend career report
- If Saturn transits user's 7th → surface relationship timing content
- If user has asked about money 3+ times → promote wealth report

---

## Anti-Patterns (Never Do This)

| Pattern | Why It Fails | Fix |
|---------|-------------|-----|
| "Dear [Name], the stars suggest..." | Name-insertion is not personalization | Lead with a chart-specific fact about the user |
| "People with your Moon sign tend to..." | Population-level statement, not personal | "Your Moon in Scorpio in the 4th house means you specifically..." |
| "This is a good time for new beginnings" | Could apply to anyone on any day | "Jupiter transiting your 1st house for the next 4 months creates a window for..." |
| "Wear a Blue Sapphire for Saturn" | Generic remedy without chart justification | "Your Saturn is debilitated in the 7th — Blue Sapphire can stabilize this, but start with a trial period because..." |
| "Your chart shows strong career potential" | Vague, unjustified positive statement | "Your 10th lord Mars is in its own sign in the 10th — career matters have natural strength, especially in leadership or technical roles..." |

---

## Implementation Priority

1. **Layer 1 (birth chart):** Must be present in every output. Non-negotiable.
2. **Layer 2 (timing):** Must be present in daily insights, chat answers, and timing-related reports. High priority.
3. **Layer 3 (life area):** Must be used when available. Medium priority — depends on UI surfacing life area selection.
4. **Layer 4 (question context):** Chat-only. Already partially implemented. Medium priority.
5. **Layer 5 (past interactions):** Lowest priority to implement. Requires memory/history system. Build after layers 1-4 are solid.
