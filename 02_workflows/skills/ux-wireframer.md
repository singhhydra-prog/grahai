# Skill: UX Wireframer

## Trigger
When planning a new page, feature, or complete redesign of an existing page.

## Outcome
A detailed wireframe description (not visual; textual) including component tree, data flow diagram, state management plan, and API dependencies.

## Context Files
Read first:
- `01_context/product/1_APP_MAP.md` — Route structure and feature locations
- `01_context/product/3_USER_FLOWS.md` — User journeys (guest → onboarding → paid)
- `03_docs/design/DESIGN_TOKENS.md` — Cosmic luxury tokens, component patterns

## Checklist Enforcement
Before marking any UX work complete → run `02_workflows/checklists/ux-review.md`.
**Work is not complete until every item passes.**

## Steps
1. **Parse the feature spec**: Identify success criteria, user goals, and entry/exit points
2. **Check APP_MAP.md**: Is this a new route or a sub-route of existing page?
3. **Map user flow**: Trace this feature within existing flows in USER_FLOWS.md; identify handoff points
4. **Search COMPONENT_LIBRARY.md**: List all existing components that can be reused (Button, Card, Modal, AstroChart, PriceCard, etc.)
5. **Design component tree**: Sketch hierarchy (e.g., `Page > Container > Section > Card > Form > Input + Button`)
6. **Plan state management**:
   - Which data lives in React context (e.g., user profile)?
   - Which needs server state (e.g., birth chart computation)?
   - Which needs URL params (e.g., `/chart/[id]`)?
7. **Map API dependencies**: List each endpoint needed (e.g., `POST /api/chart/compute`, `GET /api/user/profile`)
8. **Identify new components**: Are there gaps? List new components to build (e.g., "BirthChartCanvas component" or "RefundForm")
9. **Data flow diagram**: Describe how data flows: User input → API call → State update → Re-render
10. **Output wireframe document**: Include all above in structured markdown

## Quality Gates
- Must reference existing components from COMPONENT_LIBRARY.md by name
- If new component required, must justify why existing ones don't fit
- All API endpoints must be checked against existing routes in `app/api/`
- State management approach must match GrahAI conventions (context + hooks, or server actions)
- No wireframe is approved until user confirms it matches the feature spec

## Edge Cases
- **Redesign of existing page**: Compare old vs. new component tree; flag breaking changes
- **Mobile-only feature** (e.g., app-like gesture): Document touch interactions explicitly
- **Payment flow**: Ensure Razorpay integration point is clear in data flow
- **Async chart computation**: Plan loading skeleton and result caching strategy
