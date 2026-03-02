# ModelAtlas — Implementation Plan

> AI Model Comparison Platform — MVP Implementation Plan
> Generated: 2026-03-02

---

## Overview

ModelAtlas is a developer-focused, open-source AI model comparison platform built with Next.js (App Router), TypeScript, and Tailwind CSS. It uses a static-first, data-driven architecture (JSON data files, no backend) and follows an Open Core strategy with MIT licensing.

This plan covers the full MVP (Phase 1) implementation broken into ordered, actionable steps.

---

## Step 1: Project Scaffolding & Configuration

**Goal:** Initialize the Next.js project with all tooling and configuration.

### Actions:
1. Initialize Next.js 15 project with App Router, TypeScript (strict), Tailwind CSS, and ESLint
2. Configure `tsconfig.json` with strict mode and path aliases (`@/` → `src/`)
3. Configure Tailwind with a custom design system (colors, spacing, typography)
4. Add `.gitignore`, `.editorconfig`, `.nvmrc` (Node 20 LTS)
5. Add Prettier config for consistent formatting
6. Create the base folder structure:

```
modelatlas/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── compare/
│   │   │   └── [...slugs]/
│   │   │       └── page.tsx    # /compare/model-a-vs-model-b
│   │   ├── models/
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Individual model page
│   │   ├── best-for/
│   │   │   └── [category]/
│   │   │       └── page.tsx    # /best-ai-model-for-coding, etc.
│   │   └── lists/
│   │       └── [slug]/
│   │           └── page.tsx    # /cheapest-ai-models, etc.
│   ├── components/             # React components
│   │   ├── ui/                 # Generic UI primitives
│   │   ├── comparison/         # Comparison-specific components
│   │   ├── models/             # Model card/detail components
│   │   └── layout/             # Header, Footer, Nav
│   ├── data/                   # Static JSON data files
│   │   └── models.json
│   ├── lib/                    # Utilities, helpers, constants
│   │   ├── types.ts            # TypeScript interfaces
│   │   ├── filters.ts          # Filtering/sorting logic
│   │   ├── comparison.ts       # Comparison utilities
│   │   └── seo.ts              # SEO/metadata helpers
│   └── config/                 # App configuration
│       └── site.ts             # Site-wide constants
├── docs/                       # Documentation
├── LICENSE
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── PLAN.md
```

### Files Created:
- `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`
- `.gitignore`, `.editorconfig`, `.nvmrc`, `.prettierrc`
- `src/app/layout.tsx`, `src/config/site.ts`

---

## Step 2: Data Model & Type Definitions

**Goal:** Define the TypeScript interfaces and create the initial model dataset.

### Actions:
1. Create `src/lib/types.ts` with the core `AIModel` interface:

```ts
export interface AIModel {
  id: string;                              // URL-safe slug: "gpt-4o"
  name: string;                            // Display name: "GPT-4o"
  provider: string;                        // "OpenAI", "Anthropic", etc.
  inputTokenPricePer1M: number;            // USD per 1M input tokens
  outputTokenPricePer1M: number;           // USD per 1M output tokens
  currency: string;                        // "USD"
  contextWindow: number;                   // in tokens
  maxOutputTokens: number;                 // in tokens
  modalities: Modality[];                  // ["text", "vision", ...]
  supportsToolCalling: boolean;
  supportsStructuredOutput: boolean;
  supportsFineTuning: boolean;
  apiAvailable: boolean;
  openSource: boolean;
  onPremAvailable: boolean;
  releaseDate: string;                     // ISO date string
  status: "active" | "deprecated";
  bestFor: string[];                       // ["coding", "rag", "chatbots"]
  speedTier: "fast" | "balanced" | "advanced";
  costTier: "cheap" | "mid" | "premium";
  pricingSourceUrl: string;
  lastUpdated: string;                     // ISO date string
  benchmarks?: Record<string, number>;     // Extensible benchmark scores
}

export type Modality = "text" | "vision" | "audio" | "image-gen" | "video";
export type SortField = keyof Pick<AIModel, "name" | "provider" | "inputTokenPricePer1M" | "outputTokenPricePer1M" | "contextWindow" | "maxOutputTokens" | "releaseDate">;
export type SortDirection = "asc" | "desc";

export interface FilterState {
  search: string;
  providers: string[];
  modalities: Modality[];
  status: ("active" | "deprecated")[];
  costTier: AIModel["costTier"][];
  speedTier: AIModel["speedTier"][];
  openSourceOnly: boolean;
  toolCallingOnly: boolean;
}
```

2. Create `src/data/models.json` with an initial dataset of 15–20 popular models across providers (OpenAI, Anthropic, Google, Meta, Mistral, etc.) with accurate, sourced pricing and specs.

### Files Created:
- `src/lib/types.ts`
- `src/data/models.json`

---

## Step 3: Data Access & Utility Functions

**Goal:** Build the pure-function utility layer for filtering, sorting, comparing, and querying models.

### Actions:
1. Create `src/lib/data.ts` — loads and parses `models.json`, provides accessor functions:
   - `getAllModels(): AIModel[]`
   - `getModelById(id: string): AIModel | undefined`
   - `getModelsByIds(ids: string[]): AIModel[]`
   - `getUniqueProviders(): string[]`

2. Create `src/lib/filters.ts` — pure filtering/sorting logic:
   - `filterModels(models: AIModel[], filters: FilterState): AIModel[]`
   - `sortModels(models: AIModel[], field: SortField, direction: SortDirection): AIModel[]`
   - `searchModels(models: AIModel[], query: string): AIModel[]`

3. Create `src/lib/comparison.ts` — comparison utilities:
   - `getComparisonFields(): ComparisonField[]` — returns ordered list of fields to compare
   - `getDifferences(models: AIModel[]): Set<string>` — returns field keys that differ across selected models
   - `formatFieldValue(field: string, value: unknown): string` — formats values for display (e.g., numbers with commas, booleans as Yes/No)

4. Create `src/lib/seo.ts` — SEO/metadata helpers:
   - `generateCompareMetadata(models: AIModel[]): Metadata`
   - `generateModelMetadata(model: AIModel): Metadata`
   - `generateListMetadata(category: string): Metadata`
   - `generateJsonLd(models: AIModel[]): object` — Schema.org structured data

### Files Created:
- `src/lib/data.ts`
- `src/lib/filters.ts`
- `src/lib/comparison.ts`
- `src/lib/seo.ts`

---

## Step 4: Layout & Shared UI Components

**Goal:** Build the app shell and reusable UI primitives.

### Actions:
1. Create `src/app/layout.tsx` — root layout with:
   - HTML `<head>` with default metadata, viewport, Open Graph tags
   - Header with logo, navigation, and GitHub link
   - Footer with disclaimer, links, and last updated info
   - Clean body with max-width container

2. Create `src/components/layout/Header.tsx`:
   - Logo/brand ("ModelAtlas")
   - Nav links: Home, Compare, Models
   - GitHub star badge / link
   - Mobile hamburger menu

3. Create `src/components/layout/Footer.tsx`:
   - Pricing disclaimer
   - MIT License reference
   - Links: GitHub, Contributing, Report Issue

4. Create UI primitives in `src/components/ui/`:
   - `Badge.tsx` — colored pill badges (for tags, tiers, modalities)
   - `Tooltip.tsx` — hover tooltip for field explanations
   - `SearchInput.tsx` — search input with debounce
   - `FilterPanel.tsx` — collapsible filter sidebar/panel
   - `Toggle.tsx` — toggle switch component
   - `Select.tsx` — dropdown select component

### Files Created:
- `src/app/layout.tsx` (updated)
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Tooltip.tsx`
- `src/components/ui/SearchInput.tsx`
- `src/components/ui/FilterPanel.tsx`
- `src/components/ui/Toggle.tsx`
- `src/components/ui/Select.tsx`

---

## Step 5: Home Page — Model Explorer

**Goal:** Build the main landing page where users browse and select models.

### Actions:
1. Create `src/app/page.tsx` — home page that:
   - Displays a hero section with tagline and CTA
   - Shows all models in a card grid
   - Includes search bar and filter panel
   - Allows selecting models (checkbox) for comparison
   - Shows a floating "Compare X models" action bar when models are selected

2. Create `src/components/models/ModelCard.tsx`:
   - Provider logo/icon area
   - Model name and provider
   - Key stats: price, context window, modalities
   - Tags: bestFor, speedTier, costTier
   - Selectable (checkbox) for comparison
   - "View details" link

3. Create `src/components/models/ModelGrid.tsx`:
   - Responsive grid layout for model cards
   - Empty state when no models match filters
   - Model count indicator

4. Create `src/components/models/CompareBar.tsx`:
   - Sticky bottom bar that appears when 2+ models are selected
   - Shows selected model count and names
   - "Compare" button that navigates to comparison page
   - "Clear" button

### Files Created:
- `src/app/page.tsx`
- `src/components/models/ModelCard.tsx`
- `src/components/models/ModelGrid.tsx`
- `src/components/models/CompareBar.tsx`

---

## Step 6: Comparison Page

**Goal:** Build the core comparison UI with side-by-side model comparison.

### Actions:
1. Create `src/app/compare/[...slugs]/page.tsx`:
   - Parses URL slugs (e.g., `gpt-4o-vs-claude-3-5-sonnet`)
   - Loads models from data
   - Renders comparison table
   - Generates SEO metadata and JSON-LD for the comparison
   - Static generation via `generateStaticParams` for known model pairs

2. Create `src/components/comparison/ComparisonTable.tsx`:
   - Sticky header row with model names
   - Rows for each comparison field, grouped by category:
     - **Pricing**: input price, output price, cost tier
     - **Technical**: context window, max output, modalities, release date
     - **Capabilities**: tool calling, structured output, fine-tuning, API, open-source, on-prem
     - **Classification**: bestFor, speedTier, status
     - **Benchmarks**: MMLU, HumanEval, etc. (if available)
   - Highlighted cells where values differ
   - Responsive: horizontal scroll on mobile

3. Create `src/components/comparison/ComparisonHeader.tsx`:
   - Sticky top row with model name, provider, and quick stats
   - "Remove" button per model
   - "Add model" button to add more to comparison

4. Create `src/components/comparison/ComparisonRow.tsx`:
   - Single row component
   - Field label with tooltip explanation
   - Value cells with formatting (numbers, booleans, arrays, dates)
   - Highlight class when values differ

5. Create `src/components/comparison/DiffToggle.tsx`:
   - "Show only differences" toggle
   - Filters comparison rows to only show fields that differ

### Files Created:
- `src/app/compare/[...slugs]/page.tsx`
- `src/components/comparison/ComparisonTable.tsx`
- `src/components/comparison/ComparisonHeader.tsx`
- `src/components/comparison/ComparisonRow.tsx`
- `src/components/comparison/DiffToggle.tsx`

---

## Step 7: Individual Model Page

**Goal:** Build the detail page for a single model.

### Actions:
1. Create `src/app/models/[id]/page.tsx`:
   - Full model detail view
   - All fields displayed in organized sections
   - "Compare with..." dropdown to jump into comparison
   - SEO metadata and JSON-LD (Schema.org Product)
   - Static generation via `generateStaticParams`

2. Create `src/components/models/ModelDetail.tsx`:
   - Organized sections: Overview, Pricing, Technical Specs, Capabilities, Classification
   - Pricing source link with "last updated" timestamp
   - Benchmark scores (if available) displayed as a simple bar chart or table
   - Related models suggestion (same provider or same costTier)

### Files Created:
- `src/app/models/[id]/page.tsx`
- `src/components/models/ModelDetail.tsx`

---

## Step 8: SEO Pages — Best-For & Curated Lists

**Goal:** Build SEO-optimized category and list pages.

### Actions:
1. Create `src/app/best-for/[category]/page.tsx`:
   - Dynamic route for categories like "coding", "rag", "chatbots", "reasoning"
   - Filters models by `bestFor` field
   - SEO title: "Best AI Models for Coding (2026) — ModelAtlas"
   - Renders filtered model grid with category description

2. Create `src/app/lists/[slug]/page.tsx`:
   - Curated list pages:
     - `cheapest-ai-models` — sorted by input price ascending
     - `largest-context-window-models` — sorted by context window descending
     - `open-source-ai-models` — filtered to openSource === true
   - Each has custom intro text, SEO metadata, and sorted/filtered model grid

3. Create `src/lib/lists.ts`:
   - Define list configurations (slug, title, description, filter/sort logic)
   - `getListConfig(slug: string): ListConfig`
   - `generateStaticParams` helper for known lists

### Files Created:
- `src/app/best-for/[category]/page.tsx`
- `src/app/lists/[slug]/page.tsx`
- `src/lib/lists.ts`

---

## Step 9: Sitemap, robots.txt & SEO Finalization

**Goal:** Ensure search engine discoverability.

### Actions:
1. Create `src/app/sitemap.ts` — dynamic sitemap generation:
   - Home page
   - All individual model pages
   - All known comparison pages (top model pairs)
   - All best-for category pages
   - All curated list pages

2. Create `src/app/robots.ts` — robots.txt generation

3. Add Open Graph images:
   - Create `src/app/opengraph-image.tsx` for dynamic OG image generation (Next.js built-in)
   - Or add static fallback OG image in `public/og-image.png`

4. Verify all pages have:
   - Unique `<title>` and `<meta name="description">`
   - JSON-LD structured data
   - Canonical URLs
   - Open Graph and Twitter Card tags

### Files Created:
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/opengraph-image.tsx` (or `public/og-image.png`)

---

## Step 10: Documentation

**Goal:** Create all required documentation files.

### Actions:
1. Create `README.md`:
   - Project description and screenshot
   - Features list
   - Quick start (clone, install, dev, build)
   - Tech stack
   - Data update guide (how to edit models.json)
   - Architecture overview
   - Contributing link
   - License

2. Create `CONTRIBUTING.md`:
   - How to add a new model
   - How to update pricing
   - Code style and conventions
   - PR process
   - Issue templates

3. Create `CODE_OF_CONDUCT.md`:
   - Standard Contributor Covenant

4. Create `docs/architecture.md`:
   - Folder structure explanation
   - Data flow diagram (JSON → lib → components → pages)
   - Design decisions and rationale
   - How to extend the schema

5. Create `docs/data-guide.md`:
   - How to add/update models in `models.json`
   - Required fields and validation rules
   - Pricing normalization guidelines
   - Source citation requirements

### Files Created:
- `README.md`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `docs/architecture.md`
- `docs/data-guide.md`

---

## Step 11: Testing & Quality Assurance

**Goal:** Ensure correctness and reliability.

### Actions:
1. Add testing dependencies (Vitest + React Testing Library)
2. Create tests for pure utility functions:
   - `src/lib/__tests__/filters.test.ts` — filter, sort, search logic
   - `src/lib/__tests__/comparison.test.ts` — diff detection, formatting
   - `src/lib/__tests__/data.test.ts` — data loading, model lookups
3. Create tests for data integrity:
   - `src/data/__tests__/models.test.ts` — validate all models match schema, no duplicate IDs, valid URLs, required fields present
4. Add lint and type-check scripts to `package.json`:
   - `npm run lint` — ESLint
   - `npm run typecheck` — `tsc --noEmit`
   - `npm run test` — Vitest
5. Verify the build succeeds: `npm run build`

### Files Created:
- `vitest.config.ts`
- `src/lib/__tests__/filters.test.ts`
- `src/lib/__tests__/comparison.test.ts`
- `src/lib/__tests__/data.test.ts`
- `src/data/__tests__/models.test.ts`

---

## Step 12: Deployment Configuration

**Goal:** Prepare for Vercel deployment.

### Actions:
1. Ensure `next.config.ts` is optimized:
   - Static export configuration (if using `output: 'export'`) or standard SSG
   - Image optimization settings
   - Headers for caching

2. Add `vercel.json` (if needed) for custom routing or headers

3. Add deployment instructions to README:
   - One-click Vercel deploy button
   - Manual deployment steps
   - Environment variables (none required for MVP)

4. Final build verification: `npm run build && npm run start`

### Files Created/Updated:
- `next.config.ts` (updated)
- `vercel.json` (if needed)
- `README.md` (updated with deploy instructions)

---

## Implementation Order & Dependencies

```
Step 1  (Scaffolding)
  ↓
Step 2  (Types & Data)
  ↓
Step 3  (Utilities)
  ↓
Step 4  (Layout & UI)
  ↓
Step 5  (Home Page)      ← depends on Steps 2-4
  ↓
Step 6  (Comparison)     ← depends on Steps 2-4
  ↓
Step 7  (Model Detail)   ← depends on Steps 2-4
  ↓
Step 8  (SEO Pages)      ← depends on Steps 2-4
  ↓
Step 9  (SEO/Sitemap)    ← depends on Steps 5-8
  ↓
Step 10 (Documentation)  ← can run in parallel with Steps 5-9
  ↓
Step 11 (Testing)        ← depends on Steps 2-3, can start early
  ↓
Step 12 (Deployment)     ← final step
```

**Note:** Steps 5, 6, 7, and 8 are independent of each other and can be implemented in any order once Steps 1–4 are complete. Step 10 can be started alongside feature work. Step 11 utility tests can be written as soon as Step 3 is done.

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 15 (App Router) | SSG support, file-based routing, built-in SEO tools |
| Styling | Tailwind CSS | Utility-first, fast iteration, no runtime CSS |
| Data storage | Static JSON | No backend needed, easy to contribute, fast builds |
| State management | URL params + React state | Comparison state in URL for shareability, no extra library |
| Testing | Vitest | Fast, TS-native, compatible with React Testing Library |
| Deployment | Vercel | Zero-config Next.js hosting, free tier, global CDN |
| URL scheme for comparison | `/compare/model-a-vs-model-b` | SEO-friendly, human-readable, shareable |

---

## Estimated File Count

| Category | Files |
|----------|-------|
| Configuration | ~10 |
| Types & Data | ~3 |
| Utilities | ~5 |
| Components | ~15 |
| Pages | ~6 |
| Tests | ~5 |
| Documentation | ~5 |
| **Total** | **~49** |

---

## Out of Scope for MVP

These are explicitly deferred to Phase 2+:
- Backend / database
- User authentication
- Cost calculator / token simulator
- Performance charts / visualizations
- Automated pricing sync / scraping
- Community ratings / comments
- API service
- Premium features
- Version history / change logs
- Deprecation alert system
