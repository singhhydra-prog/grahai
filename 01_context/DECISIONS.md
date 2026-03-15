# GrahAI — Architectural Decisions Log

## D001: Code-based report generation over Claude AI API
**Date**: 2026-03-14
**Decision**: Generate all 7 report types using pure TypeScript code from Swiss Ephemeris data, not Claude API calls.
**Rationale**:
- Eliminates API cost per report (~$0.05-0.15 per Claude call)
- Reduces generation time from 15-30s to <2s
- No external dependency for core revenue product
- Claude AI route kept as /api/reports/generate-typed backup
**Status**: Implemented

## D002: Meeus fallback for Vercel deployment
**Date**: 2026-03-14
**Decision**: Implement Meeus-algorithm fallback when Swiss Ephemeris native binary unavailable (Vercel serverless).
**Rationale**: sweph native C++ binary can't run in Vercel's serverless environment. Meeus gives ~1-2° accuracy which is sufficient for most interpretations.
**Status**: Implemented

## D003: Skill-centric Cowork workspace restructuring
**Date**: 2026-03-15
**Decision**: Restructure project into 01_context/02_workflows/03_docs/04_logs hierarchy with CLAUDE.md as project brain, skills as reusable workflows, and project memory files for session continuity.
**Rationale**: Documents recommended transitioning from "vibe coding" to professional agentic architecture. Skills compound over time. Memory files prevent context loss between sessions.
**Status**: In progress

## D004: Uniqueness target for reports
**Date**: 2026-03-15
**Decision**: All report generators must produce >60% unique (chart-specific) content when tested across 3 different charts.
**Rationale**: Generic/template text undermines the value proposition. Users pay for personalized analysis, not textbook astrology.
**Status**: Partially met (35-55% generic, needs further reduction)

## D005: Cosmic luxury design language
**Date**: 2026-03-05
**Decision**: Dark-mode-only UI with deep-space backgrounds, saffron-gold accents, glass-morphic surfaces.
**Rationale**: Differentiates from competitors (most use light themes). Evokes mysticism and premium feel. Aligns with target demographic expectations.
**Status**: Implemented
