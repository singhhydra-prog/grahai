# GrahAI — Project Intelligence File

## Identity
GrahAI is an AI-powered Vedic astrology platform covering Astrology, Numerology, Tarot, and Vastu Shastra. The design language is cosmic luxury — deep space backgrounds, saffron-gold accents, glass-morphic surfaces, and subtle 3D elements. Think Apple's design precision meets ancient Indian mysticism.

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript strict mode)
- **Styling:** Tailwind CSS v4 (CSS-based config with `@theme inline`)
- **Backend:** Supabase (Auth, PostgreSQL, Edge Functions, pgvector)
- **Animations:** Framer Motion (page transitions, micro-interactions)
- **3D:** Spline (@splinetool/react-spline, always lazy-loaded)
- **Fonts:** Inter (body/UI), Noto Sans Devanagari (Hindi text)
- **Deployment:** Vercel (auto-deploy, preview branches)
- **AI Models:** All Claude Opus 4.6 via Supabase Edge Functions

## Design System — The Cosmic Language

### Colors (use Tailwind classes, never raw hex)
- `deep-space` #0A0E1A — primary background, never use white/light
- `navy` #121833 / `navy-light` #1A2342 — cards, elevated surfaces
- `saffron` #D4A843 — primary accent, CTAs, active states
- `gold-light` #E8C668 — hover states, highlights
- `indigo` #3B4C9B — borders, secondary elements
- `cosmic-white` #E8E6F0 — text (never pure white #FFFFFF)

### Surface Treatment
- Cards: `rounded-2xl border border-indigo/30 bg-navy-light/50 backdrop-blur-sm`
- Inputs: `rounded-xl border border-indigo/30 bg-deep-space/50`
- Buttons primary: `rounded-xl bg-saffron text-deep-space font-semibold`
- Buttons ghost: `rounded-xl border border-indigo/30 text-cosmic-white/60`
- Glass effect: `bg-navy-light/30 backdrop-blur-xl border border-cosmic-white/10`

### Typography Scale
- Hero heading: `text-5xl md:text-7xl font-bold` + gradient-text class
- Section heading: `text-3xl md:text-4xl font-bold text-cosmic-white`
- Card title: `text-lg font-semibold text-cosmic-white`
- Body: `text-sm text-cosmic-white/60`
- Hindi subtitle: `font-[family-name:var(--font-devanagari)] text-cosmic-white/40`
- Minimum touch target: 44px (h-11)

### Animation Standards
- Page entrance: `fadeInUp` (opacity 0→1, y 20→0, 0.6s ease-out)
- Stagger children: 0.1s delay between items
- Hover states: `transition-all duration-300`
- 3D elements: lazy load with Suspense + branded skeleton loader
- Never use animation on elements below the fold on mobile (performance)

## Code Standards

### Component Architecture
- Server Components by default, `"use client"` only when needed
- All components strictly typed with TypeScript
- Named exports for components, default export for pages
- Co-locate component-specific types in the same file
- Always wrap `useSearchParams()` in `<Suspense>`

### Supabase Rules
- **Table is `profiles`** with primary key `id` (= auth.uid())
- NEVER reference `user_profiles` or `user_id` — those don't exist
- Server-side: use `@supabase/ssr` createServerClient from `supabase-server.ts`
- Middleware: use `supabase-middleware.ts` for session refresh
- Client-side: use browser client from `supabase.ts`
- Always check `onboarding_completed` boolean after auth callback

### File Organization
```
src/
  app/              # Next.js App Router pages
    (marketing)/    # Public pages (landing, pricing, blog)
    (app)/          # Authenticated app pages
    auth/           # Auth pages (login, callback)
  components/
    ui/             # Reusable UI primitives (Button, Card, Input)
    3d/             # Spline 3D components (always lazy-loaded)
    sections/       # Page sections (Hero, Features, CTA)
  lib/              # Utilities, Supabase clients, brand config
```

### Performance Rules
- Images: always use `next/image` with explicit width/height
- Spline: ALWAYS lazy load with `React.lazy()` + Suspense
- Fonts: only Inter + Noto Sans Devanagari (loaded via next/font)
- Bundle: no lodash, no moment.js, prefer native APIs
- CSS: prefer Tailwind utilities, never inline styles

## What NOT To Do
- ❌ White or light backgrounds anywhere — we live in deep space
- ❌ Pure white text (#FFFFFF) — use cosmic-white (#E8E6F0)
- ❌ Default Next.js blue/black theme colors
- ❌ Generic sans-serif — always specify Inter
- ❌ Unstyled HTML elements (raw buttons, inputs, selects)
- ❌ `user_profiles` table or `user_id` column (use `profiles` / `id`)
- ❌ Spline components without lazy loading
- ❌ useSearchParams without Suspense boundary
- ❌ Inline styles or CSS modules (Tailwind only)
- ❌ Importing full icon libraries (tree-shake from lucide-react)
- ❌ Any external cost — all services must be free tier
- ❌ localStorage/sessionStorage in components (use React state)
- ❌ Emojis in production UI (use custom icons or Lucide)

## The Four Verticals
1. **Vedic Astrology** (ज्योतिष) — Kundli, Dasha, Transit, Compatibility
2. **Numerology** (अंकशास्त्र) — Life Path, Name Number, Predictions
3. **Tarot** (टैरो) — Card readings, Spreads, Interpretations
4. **Vastu Shastra** (वास्तु) — Space analysis, Remedies, Compass

## Brand Voice
- Authoritative but accessible
- Blend English + Hindi naturally
- Never dismissive of traditional knowledge
- Scientific framing of ancient wisdom
- Premium but not exclusive

---

## Agent System Architecture

### 28-Agent Hierarchy
GrahAI operates a **CEO Orchestrator** pattern with 5 departments and 28 total agents, all registered in `agent_hierarchy` and `agent_prompt_versions` tables.

The CEO Orchestrator (`detectVertical()` in `route.ts`) uses regex to route incoming messages to the correct vertical specialist. Each vertical has a department head agent with domain tools.

### Communication Flow
```
User Message → CEO Orchestrator (regex routing)
  → Vertical Detection (astrology/numerology/tarot/vastu/general)
  → Load System Prompt (from agent_prompt_versions, 5-min cache)
  → Inject Memory Context (from memories table)
  → Anthropic API (claude-sonnet-4, streaming, with tools)
  → Tool Execution Loop (if tool_use returned)
  → Stream Response (SSE text_delta events)
  → Save to DB + Track Metrics (fire-and-forget)
```

### Streaming API (SSE)
The chat API (`src/app/api/chat/route.ts`) returns `text/event-stream` with events: `meta`, `text_delta`, `tool_start`, `tool_result`, `message_stop`, `error`. The client reads via `ReadableStream` reader and renders token-by-token.

### Tool-Use Pattern
When Claude's response includes a `tool_use` block, the server: executes the tool → sends result back to Claude → Claude continues generating → repeat until `stop_reason: "end_turn"`.

## Agent Development Standards

### Adding a New Tool
1. Define tool schema in `src/lib/agents/tools/{vertical}-tools.ts`
2. Implement executor function in the same file
3. Register in `src/lib/agents/tools/index.ts` (VERTICAL_TOOLS + switch case + TOOL_DISPLAY_INFO)
4. Tool names: `snake_case`, unique across all verticals
5. Always return structured JSON from tools (not plain strings)

### Modifying System Prompts
NEVER hardcode prompts — update via `agent_prompt_versions` table. Prompts are cached 5 minutes in `prompt-loader.ts`. Fallback prompts exist for DB outages.

### Memory System
- Auto birth data extraction on every message (fire-and-forget)
- Memory types: `birth_data`, `preference`, `reading_history`, vertical-specific
- Retrieved by importance DESC, injected into system prompt context
- Stored in `memories` table with optional vector embeddings

### Metrics Tracking
Every response tracks: agent name, vertical, response time, success/failure in `agent_metrics` (daily aggregation). Prompt interaction counts tracked in `agent_prompt_versions.interactions_count`.

### Development Workflow
Use Claude Code skills in `.claude/skills/`:
- `grahai-agents/` — Agent architecture, tool development, prompt management
- `grahai-supabase/` — Database operations, migrations, RLS policies
- `grahai-deploy/` — Build, test, deploy to Vercel

## File Organization (Updated)
```
src/
  app/
    (marketing)/        # Public pages (landing, pricing, blog)
    (app)/              # Authenticated app pages
    auth/               # Auth pages (login, callback)
    chat/               # Chat interface (streaming + tool indicators)
    api/chat/           # Streaming SSE chat API with tool-use
  components/
    ui/                 # Reusable UI primitives
    chat/               # ToolIndicator, MarkdownRenderer
    3d/                 # Spline 3D components
    sections/           # Page sections
  lib/
    agents/             # Agent system core
      prompt-loader.ts  # Dynamic prompt loading (DB + cache)
      memory.ts         # Memory retrieval + birth data extraction
      metrics.ts        # Agent performance tracking
      tools/            # Vertical tool definitions + executors
        index.ts        # Central registry + dispatcher
        astrology-tools.ts
        numerology-tools.ts
        tarot-tools.ts
        vastu-tools.ts
    supabase.ts         # Client-side Supabase
    supabase-server.ts  # Server-side Supabase (SSR)
.claude/
  skills/               # Claude Code development skills
    grahai-agents/
    grahai-supabase/
    grahai-deploy/
```

## API Patterns

### Streaming SSE Response
```typescript
return new Response(stream, {
  headers: {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  },
})
```

### SSE Event Format
```typescript
function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
}
```

### Supabase Server Client (API Routes)
```typescript
import { createClient } from "@supabase/supabase-js"
const sb = createClient(supabaseUrl, supabaseServiceKey) // Bypasses RLS
```

## Testing Checklist
- [ ] `npm run build` passes with zero errors
- [ ] Each vertical detects correctly from user messages
- [ ] System prompts load from `agent_prompt_versions` (not hardcoded)
- [ ] All 14 tools execute correctly and return structured data
- [ ] Streaming renders token-by-token (no flash of complete text)
- [ ] Tool indicators show/hide correctly during execution
- [ ] Conversation history persists across messages
- [ ] Memories save and retrieve for returning users
- [ ] Metrics tracked in `agent_metrics` table
- [ ] Deployed to Vercel with all env vars set
