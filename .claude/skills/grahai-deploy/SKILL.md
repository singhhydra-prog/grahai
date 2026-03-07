---
description: "Build, test, and deploy GrahAI to Vercel — includes build commands, environment variables, and verification steps"
allowed-tools: ["Bash"]
---

# GrahAI Deployment Skill

## Project Info

| Key | Value |
|-----|-------|
| Vercel Project | `singhhydra-3616s-projects/grahai` |
| Production URL | `https://grahai.vercel.app` |
| Framework | Next.js 16 (App Router) |
| Node Version | 18+ |
| Package Manager | npm |

## Build Commands

```bash
# Install dependencies
cd /sessions/wonderful-gifted-mayer/grahai && npm install

# Development server
npm run dev

# Production build (catches TypeScript + lint errors)
npm run build

# Lint check
npm run lint
```

## Environment Variables Checklist

Required in Vercel dashboard (Settings → Environment Variables):

| Variable | Where | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Yes |
| `ANTHROPIC_API_KEY` | Server only | Yes |

**NEVER commit these to git.** They should be in `.env.local` for local dev and in Vercel dashboard for production.

## Deployment

### Automatic (preferred)
Push to main branch → Vercel auto-deploys.

### Manual
```bash
cd /sessions/wonderful-gifted-mayer/grahai

# Deploy to production
npx vercel --prod

# Deploy preview (for testing)
npx vercel
```

## Pre-Deploy Verification

### 1. Build passes
```bash
npm run build
```
Fix any TypeScript or lint errors before deploying.

### 2. Local smoke test
```bash
npm run dev
```
Open `http://localhost:3000` and verify:
- [ ] Landing page loads with cosmic design
- [ ] Auth flow works (login/signup)
- [ ] Chat page loads with vertical selector
- [ ] Sending a message shows streaming response
- [ ] Tool indicators appear during tool execution

### 3. Test each vertical
| Vertical | Test Message | Expected |
|----------|-------------|----------|
| Astrology | "Generate my kundli for March 15, 1995, 10:30 AM, Mumbai" | Tool indicator → `calculate_kundli` → detailed chart response |
| Numerology | "Calculate my life path number, born January 23, 1990" | Tool indicator → `calculate_life_path` → number + meaning |
| Tarot | "Draw a three-card spread about my career" | Tool indicator → `draw_cards` → 3 cards with interpretations |
| Vastu | "Analyze my home with north-facing entrance" | Tool indicator → `analyze_directions` → room analysis + score |

### 4. Verify streaming
- Messages should appear token-by-token (typewriter effect)
- No flash of complete message
- Stop button should work during generation

### 5. Verify database
```sql
-- Check prompts are loaded
SELECT agent_name, version, is_active FROM agent_prompt_versions WHERE is_active = true;

-- Check metrics are being tracked
SELECT * FROM agent_metrics ORDER BY date DESC LIMIT 5;

-- Check tarot cards seeded
SELECT count(*) FROM tarot_cards;
```

## Post-Deploy Verification

After `vercel --prod`:

1. Visit `https://grahai.vercel.app`
2. Verify landing page loads (no blank screen)
3. Check browser console for errors
4. Test one chat message to verify API works
5. Check Vercel Functions logs for any 500 errors

## Common Issues

### Build fails with TypeScript errors
- Run `npm run build` locally first
- Check `tsconfig.json` for strict mode settings
- Ensure all imports exist and types match

### Chat API returns 500
- Check Vercel Functions logs
- Verify `ANTHROPIC_API_KEY` is set in Vercel
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
- Check Supabase dashboard for connection issues

### Streaming not working
- Ensure response headers include `Content-Type: text/event-stream`
- Check browser DevTools Network tab for SSE connection
- Verify client-side `ReadableStream` reader is consuming correctly

### Tools not executing
- Check `getToolsForVertical()` returns tools for the vertical
- Verify tool name matches between definition and TOOL_TO_VERTICAL map
- Check Supabase permissions for tool DB operations

## File Sync to User Workspace

After making changes, sync to the mounted workspace:
```bash
rsync -av --exclude='node_modules' --exclude='.next' --exclude='.env*' \
  /sessions/wonderful-gifted-mayer/grahai/ \
  /sessions/wonderful-gifted-mayer/mnt/AstraAI/grahai/
```
