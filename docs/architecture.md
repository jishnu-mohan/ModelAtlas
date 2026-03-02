# Architecture

## Overview

ModelAtlas is a static-first Next.js application. All model data is stored in a JSON file and pages are statically generated at build time. There is no backend, database, or external API dependency for the MVP.

## Data Flow

```
models.json  →  lib/data.ts  →  lib/filters.ts  →  Components  →  Pages
                                 lib/comparison.ts
```

1. **`src/data/models.json`** — Single source of truth for all model data
2. **`src/lib/data.ts`** — Loads JSON and provides accessor functions
3. **`src/lib/filters.ts`** — Pure functions for filtering and sorting
4. **`src/lib/comparison.ts`** — Comparison logic, diff detection, formatting
5. **Components** — Render data using React components
6. **Pages** — Next.js pages that compose components and generate metadata

## Key Design Decisions

### Static JSON over Database
- No runtime dependencies
- Easy to contribute (edit a JSON file)
- Fast builds, instant page loads
- Git-tracked data changes

### Small, Isolated Components
- Each component is under 150 lines
- Components are organized by feature (`models/`, `comparison/`, `ui/`)
- Easier to review, test, and modify

### Pure Utility Functions
- All logic in `src/lib/` is side-effect free
- Functions take data in, return results out
- Easy to unit test

### URL-Based State
- Comparison selections are encoded in the URL (`/compare/gpt-4o-vs-claude-sonnet-4`)
- Pages are shareable and bookmarkable
- SEO-friendly

## Folder Structure

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Next.js App Router pages and metadata |
| `src/components/ui/` | Generic reusable UI primitives |
| `src/components/models/` | Model-specific components (card, grid, detail) |
| `src/components/comparison/` | Comparison table components |
| `src/components/layout/` | Header, Footer |
| `src/data/` | Static JSON data files |
| `src/lib/` | Pure utility functions and TypeScript types |
| `src/config/` | Site-wide configuration constants |
| `docs/` | Project documentation |

## Extending the Schema

To add a new field to the model data:

1. Add the field to the `AIModel` interface in `src/lib/types.ts`
2. Add the field to all entries in `src/data/models.json`
3. If it should appear in comparisons, add a `ComparisonField` entry in `src/lib/comparison.ts`
4. Update relevant components to display the new field
