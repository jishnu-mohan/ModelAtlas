# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Dev server with Turbopack (http://localhost:3000)
npm run build          # Production build
npm run start          # Start production server
npm run lint           # ESLint
npm run typecheck      # TypeScript type checking (tsc --noEmit)
npm run test           # Run all tests once (Vitest)
npm run test:watch     # Run tests in watch mode
npx vitest run src/lib/__tests__/filters.test.ts  # Run a single test file
```

Node 20 LTS (see `.nvmrc`). Package manager is npm.

## Architecture

Static-first Next.js 16 app (App Router) with no backend. All AI model data lives in `src/data/models.json` — the single source of truth. Pages are statically generated at build time.

**Data flow:** `models.json` -> `lib/data.ts` (accessors) -> `lib/filters.ts` / `lib/comparison.ts` -> Components -> Pages

### Key directories

- `src/app/` — Next.js App Router pages and layouts
- `src/components/` — React components organized by domain (`ui/`, `models/`, `comparison/`, `layout/`)
- `src/lib/` — Pure utility functions (data access, filtering, comparison, SEO). Tests in `__tests__/` subdirectories
- `src/data/` — Static JSON data with validation tests
- `src/config/site.ts` — Site-wide constants
- `docs/` — Architecture docs and data contribution guide

### Route structure

- `/` — Model explorer with search, filters, sorting
- `/models/[id]` — Individual model detail page
- `/compare/[...slugs]` — Side-by-side comparison (URL-encoded, e.g., `/compare/gpt-4o-vs-claude-sonnet`)
- `/lists/[slug]` — Curated list pages (cheapest, largest-context, open-source, best-for-coding, best-for-reasoning)

### Core types

The `AIModel` interface in `src/lib/types.ts` defines the schema for all model data. Key fields include pricing (`inputTokenPricePer1M`, `outputTokenPricePer1M`), capabilities (`modalities`, `supportsToolCalling`), tiers (`speedTier`, `costTier`), and optional `benchmarks` (MMLU, HumanEval, etc.).

## Code Conventions

- TypeScript strict mode — no `any` types
- Components should stay under 150 lines
- Pure functions in `src/lib/` — no side effects
- Tailwind CSS 4 for all styling (custom theme colors defined in `globals.css`)
- Path alias: `@/*` maps to `./src/*`
- Comparisons are URL-encoded using `vs` separator between model IDs
