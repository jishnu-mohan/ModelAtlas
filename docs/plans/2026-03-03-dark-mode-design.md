# Dark Mode Switcher Design

## Overview

Add a dark mode toggle to ModelAtlas using Tailwind CSS `dark:` variants with a class-based strategy. No external dependencies. Respects system preference by default with manual override persisted to localStorage.

## Approach

Pure Tailwind `dark:` variant with a custom ThemeProvider. Chosen over CSS variable swap (too large a refactor) and next-themes (unnecessary dependency for this scope).

## Infrastructure

### ThemeProvider (`src/components/ThemeProvider.tsx`)

- `"use client"` context provider wrapping the app in layout.tsx
- Reads `localStorage("theme")` on mount, falls back to `prefers-color-scheme`
- Toggles the `dark` class on `<html>`
- Exposes `theme` (light/dark/system) and `toggleTheme` via React context and a `useTheme()` hook

### FOWT Prevention

- Inline `<script>` in layout.tsx `<head>` that runs before paint
- Reads localStorage / prefers-color-scheme and sets `dark` class on `<html>` immediately
- Prevents flash of wrong theme on page load

### Tailwind Configuration

- Add `@custom-variant dark (&:where(.dark *))` in globals.css to enable class-based dark mode in Tailwind 4

## Toggle Button

- Sun/moon SVG icon button in Header, between nav links and GitHub link (desktop)
- Also appears at bottom of mobile menu
- No icon library -- inline SVG

## Dark Color Mapping

| Light | Dark |
|-------|------|
| `bg-white` | `dark:bg-surface-900` |
| `bg-surface-50` | `dark:bg-surface-800` |
| `bg-surface-100` | `dark:bg-surface-700` |
| `bg-surface-200` | `dark:bg-surface-700` |
| `text-surface-900` | `dark:text-surface-50` |
| `text-surface-800` | `dark:text-surface-100` |
| `text-surface-700` | `dark:text-surface-200` |
| `text-surface-600` | `dark:text-surface-300` |
| `text-surface-500` | `dark:text-surface-400` |
| `text-surface-400` | `dark:text-surface-500` |
| `text-surface-300` | `dark:text-surface-600` |
| `border-surface-200` | `dark:border-surface-700` |
| `border-surface-300` | `dark:border-surface-600` |
| `border-surface-100` | `dark:border-surface-700` |
| `bg-yellow-50` | `dark:bg-yellow-900/20` |

Primary colors (blue) remain unchanged -- sufficient contrast on dark backgrounds.

## Files Touched

**New:**
- `src/components/ThemeProvider.tsx`

**Modified:**
- `src/app/globals.css` -- custom variant directive
- `src/app/layout.tsx` -- inline script, ThemeProvider wrapper, dark body classes
- `src/components/layout/Header.tsx` -- toggle button, dark classes
- `src/components/layout/Footer.tsx` -- dark classes
- `src/components/models/ModelCard.tsx` -- dark classes
- `src/components/models/ModelGrid.tsx` -- dark classes
- `src/components/models/ModelDetail.tsx` -- dark classes
- `src/components/models/CompareBar.tsx` -- dark classes
- `src/components/comparison/ComparisonTable.tsx` -- dark classes
- `src/components/ui/Badge.tsx` -- dark classes
- `src/components/ui/FilterPanel.tsx` -- dark classes
- `src/components/ui/SearchInput.tsx` -- dark classes
- `src/components/ui/Tooltip.tsx` -- dark classes
- `src/app/page.tsx` -- dark classes
- `src/app/models/[id]/page.tsx` -- dark classes
- `src/app/lists/[slug]/page.tsx` -- dark classes
- `src/app/compare/[...slugs]/page.tsx` -- dark classes

## Testing

- Add unit test for ThemeProvider toggle logic
- Verify all existing tests pass
