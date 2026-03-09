---
description: "Work with GrahAI's Supabase database — migrations, RLS policies, Edge Functions, table schema reference"
allowed-tools: ["Read", "Write", "Edit", "Bash"]
---

# GrahAI Supabase Operations Skill

## Project Details

| Key | Value |
|-----|-------|
| Project ID | `jkowflffshkebegtabxa` |
| Region | `ap-south-1` (Mumbai) |
| URL | `https://jkowflffshkebegtabxa.supabase.co` |
| Organization | `anbfwkcljgmgejarmsmw` |
| Plan | Free tier (zero-cost constraint) |

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://jkowflffshkebegtabxa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...  (public, safe for client)
SUPABASE_SERVICE_ROLE_KEY=...              (server-only, NEVER expose client-side)
```

**CRITICAL**: Never use `SUPABASE_SERVICE_ROLE_KEY` in client components or browser-accessible code.

## Table Reference (22+ tables)

### Core User Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `profiles` | User profiles (PK = auth.uid()) | `id`, `full_name`, `email`, `avatar_url`, `onboarding_completed` |
| `conversations` | Chat conversations | `id`, `user_id`, `agent_name`, `department`, `vertical`, `status` |
| `messages` | Chat messages | `id`, `conversation_id`, `role`, `content`, `agent_name`, `metadata` |
| `memories` | User memory/context | `id`, `user_id`, `memory_type`, `content`, `importance`, `access_count`, `embedding` |

### Astrology Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `kundlis` | Birth charts | `id`, `user_id`, `birth_date/time/city/lat/lng`, `planets`, `houses`, `nakshatras`, `dashas`, `yogas` (all JSONB) |
| `daily_horoscopes` | Generated horoscopes | `id`, `zodiac_sign`, `date`, `prediction`, `lucky_number/color` |
| `compatibility_reports` | Match analysis | `id`, `user_id`, `partner_name`, `partner_birth_*`, `compatibility_data` |

### Numerology Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `numerology_profiles` | Computed profiles | `id`, `user_id`, `full_name`, `birth_date`, `life_path_number`, `destiny_number`, `soul_urge_number`, `personality_number` |
| `numerology_readings` | Reading history | `id`, `user_id`, `reading_type`, `reading_data`, `insights` |

### Tarot Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `tarot_cards` | 78-card RWS deck | `id`, `name`, `arcana` (CHECK: 'major'/'minor'), `suit` (CHECK: 'wands'/'cups'/'swords'/'pentacles'/NULL), `card_number`, `keywords`, `upright_meaning`, `reversed_meaning`, `element`, `zodiac_sign`, `image_url` |
| `tarot_readings` | Saved readings | `id`, `user_id`, `spread_type`, `question`, `cards_drawn`, `interpretation` |

### Vastu Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `vastu_assessments` | Space analyses | `id`, `user_id`, `property_type`, `entrance_direction`, `rooms`, `overall_score`, `assessment_data`, `remedies` |

### Agent System Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `agent_hierarchy` | 28 agent definitions | `id`, `agent_name`, `display_name`, `role`, `department`, `parent_agent_id`, `vertical`, `capabilities`, `status` |
| `agent_prompt_versions` | Versioned prompts | `id`, `agent_name`, `version`, `system_prompt`, `is_active`, `interactions_count` |
| `agent_metrics` | Daily performance | `id`, `agent_name`, `department`, `date`, `total_requests`, `successful_requests`, `avg_response_time_ms` |
| `agent_learnings` | Agent knowledge base | `id`, `agent_name`, `learning_type`, `content`, `confidence_score` |
| `agent_tasks` | Inter-agent communication | `id`, `conversation_id`, `from_agent`, `to_agent`, `task_type`, `input_data`, `output_data`, `status`, `priority` |

### Business Tables

| Table | Purpose |
|-------|---------|
| `blog_posts` | Blog/content CMS |
| `testimonials` | User testimonials |
| `contact_submissions` | Contact form entries |
| `pricing_plans` | Pricing tiers |
| `subscriptions` | User subscriptions |
| `puja_bookings` | Puja ceremony bookings |

## Important Constraints

### Check Constraints
- `tarot_cards.arcana`: Must be `'major'` or `'minor'` (lowercase!)
- `tarot_cards.suit`: Must be `'wands'`, `'cups'`, `'swords'`, `'pentacles'`, or NULL (for Major Arcana)
- Always query constraints before inserting:
  ```sql
  SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'table_name'::regclass;
  ```

### Critical Rules
- **Table is `profiles`** — NEVER reference `user_profiles` or `user_id`
- Primary key `id` = `auth.uid()` (UUID from Supabase Auth)
- Always check `onboarding_completed` boolean after auth callback

### RLS (Row Level Security)

All tables have RLS enabled. Patterns:
- **User data**: `auth.uid() = user_id` for SELECT/INSERT/UPDATE/DELETE
- **Public read**: `true` for SELECT (blog_posts, pricing_plans, tarot_cards)
- **Service role**: Bypasses RLS (used in API routes via `SUPABASE_SERVICE_ROLE_KEY`)

### Adding RLS to a New Table
```sql
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own data" ON my_table
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own data" ON my_table
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON my_table
  FOR ALL USING (auth.role() = 'service_role');
```

## Creating Migrations

Use the Supabase MCP tool:
```
apply_migration(
  project_id: "jkowflffshkebegtabxa",
  name: "add_my_table",
  query: "CREATE TABLE ..."
)
```

Naming convention: `add_<table>`, `alter_<table>_add_<column>`, `create_<index>`, `seed_<table>`

## Client Patterns

### Server-side (API routes — bypasses RLS)
```typescript
import { createClient } from "@supabase/supabase-js"
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### Server Components (SSR — respects RLS)
```typescript
import { createServerClient } from "@/lib/supabase-server"
const sb = await createServerClient()
```

### Client Components (browser — respects RLS)
```typescript
import { createClient } from "@/lib/supabase"
const sb = createClient()
```

## JSONB Column Patterns

```sql
-- Access nested JSONB
SELECT planets->>'Sun' FROM kundlis WHERE user_id = '...';

-- Filter by JSONB value
SELECT * FROM agent_metrics WHERE metadata->>'vertical' = 'astrology';

-- Update JSONB field
UPDATE kundlis SET planets = planets || '{"Rahu": {"sign": "Aries"}}' WHERE id = '...';
```

## Edge Functions

Deploy via Supabase MCP `deploy_edge_function` tool. Edge Functions run Deno and can access `Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")`.

Currently no Edge Functions deployed — all AI logic runs in Next.js API routes.
