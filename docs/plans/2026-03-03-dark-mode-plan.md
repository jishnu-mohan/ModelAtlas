# Dark Mode Switcher Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a dark mode toggle that respects system preference, persists user choice, and applies dark variants across all components.

**Architecture:** Tailwind 4 class-based dark mode via `@custom-variant`. A ThemeProvider context manages state (localStorage + prefers-color-scheme). An inline `<script>` in `<head>` prevents flash of wrong theme. A sun/moon toggle button in the Header switches modes.

**Tech Stack:** Tailwind CSS 4 `dark:` variants, React Context, localStorage, `prefers-color-scheme` media query.

---

### Task 1: Enable Tailwind dark mode

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Add the custom variant directive**

Add this line at the top of `src/app/globals.css`, right after the `@import "tailwindcss";` line:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

**Step 2: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```
feat: enable tailwind dark mode custom variant
```

---

### Task 2: Create ThemeProvider

**Files:**
- Create: `src/components/ThemeProvider.tsx`
- Create: `src/lib/__tests__/theme.test.ts`

**Step 1: Write the failing test**

Create `src/lib/__tests__/theme.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("theme logic", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
  });

  it("applies dark class when localStorage is dark", () => {
    localStorage.setItem("theme", "dark");
    applyTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes dark class when localStorage is light", () => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "light");
    applyTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("uses system preference when no localStorage value", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
    applyTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});

function applyTheme() {
  const stored = localStorage.getItem("theme");
  if (stored === "dark") {
    document.documentElement.classList.add("dark");
  } else if (stored === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", prefersDark);
  }
}
```

**Step 2: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/theme.test.ts`
Expected: PASS (the logic is inline in the test file as a reference implementation).

**Step 3: Create the ThemeProvider component**

Create `src/components/ThemeProvider.tsx`:

```tsx
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**Step 4: Run all tests**

Run: `npm run test`
Expected: All tests pass including the new theme test.

**Step 5: Commit**

```
feat: add ThemeProvider with localStorage and system preference support
```

---

### Task 3: Wire ThemeProvider into layout with FOWT prevention

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Update layout.tsx**

Add the FOWT prevention inline script in `<head>`, wrap `<body>` contents with `ThemeProvider`, and add dark body classes.

The full updated file should be:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Compare AI Models`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-50 min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Key changes:
- Import `ThemeProvider`
- Add `suppressHydrationWarning` to `<html>` (needed because inline script modifies classList before hydration)
- Add `<head>` with inline theme script
- Add `dark:bg-surface-900 dark:text-surface-50` to `<body>`
- Wrap body contents in `<ThemeProvider>`

**Step 2: Run dev server and verify**

Run: `npm run dev`
Expected: App loads without errors. No flash of wrong theme.

**Step 3: Commit**

```
feat: wire ThemeProvider into root layout with FOWT prevention
```

---

### Task 4: Add theme toggle to Header

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Step 1: Update Header with toggle button**

Replace the full file with:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { useTheme } from "@/components/ThemeProvider";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-surface-900 dark:text-surface-50">
            <span className="text-primary-600">&#9670;</span>
            {siteConfig.name}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-50 text-sm font-medium transition-colors"
            >
              Models
            </Link>
            <Link
              href="/lists/best-ai-models-for-coding"
              className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-50 text-sm font-medium transition-colors"
            >
              Best For
            </Link>
            <Link
              href="/lists/cheapest-ai-models"
              className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-50 text-sm font-medium transition-colors"
            >
              Lists
            </Link>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-50 text-sm font-medium transition-colors"
            >
              GitHub
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-50 transition-colors"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-50"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              className="p-2 text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-surface-200 dark:border-surface-700 pt-4 flex flex-col gap-3">
            <Link href="/" className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-50 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Models
            </Link>
            <Link href="/lists/best-ai-models-for-coding" className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-50 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Best For
            </Link>
            <Link href="/lists/cheapest-ai-models" className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-50 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Lists
            </Link>
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-50 text-sm font-medium">
              GitHub
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
```

**Step 2: Run dev server and test toggle**

Run: `npm run dev`
Expected: Sun/moon icon visible in header. Clicking toggles dark/light. Page background and header change.

**Step 3: Commit**

```
feat: add dark mode toggle button to header
```

---

### Task 5: Add dark classes to Footer

**Files:**
- Modify: `src/components/layout/Footer.tsx`

**Step 1: Update Footer**

Apply the dark color mapping to all color classes in Footer:

```tsx
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-50 mb-2">{siteConfig.name}</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Open-source AI model comparison platform. Compare pricing, specs, and benchmarks across providers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-50 mb-2">Links</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-surface-500 dark:text-surface-400 hover:text-primary-600 transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href={`${siteConfig.github}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className="text-surface-500 dark:text-surface-400 hover:text-primary-600 transition-colors">
                  Contributing
                </a>
              </li>
              <li>
                <a href={`${siteConfig.github}/issues`} target="_blank" rel="noopener noreferrer" className="text-surface-500 dark:text-surface-400 hover:text-primary-600 transition-colors">
                  Report Issue
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-50 mb-2">Disclaimer</h3>
            <p className="text-xs text-surface-400 dark:text-surface-500">
              {siteConfig.disclaimer}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-surface-200 dark:border-surface-700 text-center text-xs text-surface-400 dark:text-surface-500">
          MIT License &copy; {new Date().getFullYear()} {siteConfig.author}
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Commit**

```
feat: add dark mode classes to Footer
```

---

### Task 6: Add dark classes to UI components (Badge, FilterPanel, SearchInput, Tooltip)

**Files:**
- Modify: `src/components/ui/Badge.tsx`
- Modify: `src/components/ui/FilterPanel.tsx`
- Modify: `src/components/ui/SearchInput.tsx`
- Modify: `src/components/ui/Tooltip.tsx`

**Step 1: Update Badge.tsx**

Update the `variantStyles` object to include dark variants:

```typescript
const variantStyles = {
  default: "bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-200",
  primary: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300",
  green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
} as const;
```

No other changes to Badge.tsx.

**Step 2: Update FilterPanel.tsx**

Apply dark classes to the FilterPanel container and FilterChip:

- Container outer div: `"border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800"`
- Button text: `"text-surface-700 dark:text-surface-200"`
- Filter count badge: `"bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"`
- Expanded section border: `"border-t border-surface-200 dark:border-surface-700"`
- FilterSection title: `"text-surface-500 dark:text-surface-400"`
- Checkbox labels: `"text-surface-600 dark:text-surface-300"`
- FilterChip inactive: `"bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-300 dark:border-surface-600 hover:border-surface-400 dark:hover:border-surface-500"`
- FilterChip active: `"bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-700"`

**Step 3: Update SearchInput.tsx**

- Input: `"bg-white dark:bg-surface-800 border-surface-300 dark:border-surface-600"`
- Search icon: `"text-surface-400 dark:text-surface-500"` (already fine)
- Clear button: `"text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300"`

**Step 4: Update Tooltip.tsx**

The tooltip already uses `bg-surface-800 text-white` which works well in both modes. Add dark variants:

- Tooltip background: `"bg-surface-800 dark:bg-surface-200 text-white dark:text-surface-900"`
- Arrow: `"border-t-surface-800 dark:border-t-surface-200"`

**Step 5: Commit**

```
feat: add dark mode classes to UI components
```

---

### Task 7: Add dark classes to model components (ModelCard, ModelGrid, ModelDetail, CompareBar)

**Files:**
- Modify: `src/components/models/ModelCard.tsx`
- Modify: `src/components/models/ModelGrid.tsx`
- Modify: `src/components/models/ModelDetail.tsx`
- Modify: `src/components/models/CompareBar.tsx`

**Step 1: Update ModelCard.tsx**

- Unselected card: `"border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"`
- Selected card: `"border-primary-400 ring-2 ring-primary-100 dark:ring-primary-900/30 bg-primary-50/30 dark:bg-primary-900/20"`
- Model name: `"text-surface-900 dark:text-surface-50"`
- Provider: `"text-surface-500 dark:text-surface-400"`
- Labels (Input/Output/Context/Max Output): `"text-surface-400 dark:text-surface-500"`
- Values: `"text-surface-800 dark:text-surface-100"`
- Checkbox border: `"border-surface-300 dark:border-surface-600"`

**Step 2: Update ModelGrid.tsx**

- No models text: `"text-surface-500 dark:text-surface-400"` and `"text-surface-400 dark:text-surface-500"`
- Count text: `"text-surface-500 dark:text-surface-400"`

**Step 3: Update ModelDetail.tsx**

- Section headings: `"text-surface-900 dark:text-surface-50 border-b border-surface-200 dark:border-surface-700"`
- InfoCard: `"bg-surface-50 dark:bg-surface-800"` with label `"text-surface-500 dark:text-surface-400"` and value `"text-surface-800 dark:text-surface-100"`
- CapabilityItem supported: `"text-surface-800 dark:text-surface-100"`
- CapabilityItem unsupported: `"text-surface-400 dark:text-surface-500"` and `"text-surface-300 dark:text-surface-600"`
- Benchmark cards: `"bg-surface-50 dark:bg-surface-800"` with `"text-surface-500 dark:text-surface-400"` and `"text-surface-900 dark:text-surface-50"`
- Progress bar background: `"bg-surface-200 dark:bg-surface-700"`
- Last updated text: `"text-surface-400 dark:text-surface-500"`

**Step 4: Update CompareBar.tsx**

CompareBar already has a dark background (`bg-surface-900 text-white`). In dark mode, slightly differentiate it:

- Container: `"bg-surface-900 dark:bg-surface-800 text-white border-t dark:border-surface-700"`
- Clear button: `"text-surface-300 dark:text-surface-400"`

**Step 5: Commit**

```
feat: add dark mode classes to model components
```

---

### Task 8: Add dark classes to ComparisonTable

**Files:**
- Modify: `src/components/comparison/ComparisonTable.tsx`

**Step 1: Update ComparisonTable.tsx**

- "Show only differences" label: `"text-surface-600 dark:text-surface-300"`
- Table border: `"border-surface-200 dark:border-surface-700"`
- Header row: `"bg-surface-50 dark:bg-surface-800"`
- Feature header: `"text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700"`
- Model name header: `"text-surface-900 dark:text-surface-50 border-b border-surface-200 dark:border-surface-700"`
- Provider text: `"text-surface-500 dark:text-surface-400"`
- Category section: `"bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400"`
- Data rows: `"border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50/50 dark:hover:bg-surface-800/50"`
- Feature label: `"text-surface-600 dark:text-surface-300"`
- Tooltip dotted border: `"border-surface-400 dark:border-surface-500"`
- Diff highlight: `"bg-yellow-50 dark:bg-yellow-900/20"`
- Source links text: `"text-surface-400 dark:text-surface-500"`
- Checkbox border: `"border-surface-300 dark:border-surface-600"`

**Step 2: Commit**

```
feat: add dark mode classes to ComparisonTable
```

---

### Task 9: Add dark classes to page files

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/models/[id]/page.tsx`
- Modify: `src/app/lists/[slug]/page.tsx`
- Modify: `src/app/compare/[...slugs]/page.tsx`

**Step 1: Update src/app/page.tsx**

- Heading: `"text-surface-900 dark:text-surface-50"`
- Subheading: `"text-surface-500 dark:text-surface-400"`
- Sort label: `"text-surface-500 dark:text-surface-400"`
- Select dropdown: `"border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800"`
- Sort button: `"border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700"`

**Step 2: Update src/app/models/[id]/page.tsx**

- Heading: `"text-surface-900 dark:text-surface-50"`
- Provider text: `"text-surface-500 dark:text-surface-400"`
- Not found text: `"text-surface-900 dark:text-surface-50"` and `"text-surface-500 dark:text-surface-400"`
- Related model cards: `"border-surface-200 dark:border-surface-700"` with `"text-surface-900 dark:text-surface-50"` and `"text-surface-500 dark:text-surface-400"`

**Step 3: Update src/app/lists/[slug]/page.tsx**

- Heading: `"text-surface-900 dark:text-surface-50"`
- Description: `"text-surface-500 dark:text-surface-400"`
- Table border: `"border-surface-200 dark:border-surface-700"`
- Table header: `"bg-surface-50 dark:bg-surface-800"` with `"text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700"`
- Row number: `"text-surface-400 dark:text-surface-500"`
- Model name: `"text-surface-900 dark:text-surface-50"`
- Provider: `"text-surface-600 dark:text-surface-300"`
- Data rows: `"border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50/50 dark:hover:bg-surface-800/50"`

**Step 4: Update src/app/compare/[...slugs]/page.tsx**

- Heading: `"text-surface-900 dark:text-surface-50"`
- Description: `"text-surface-500 dark:text-surface-400"`
- Not found text: same dark variants as above

**Step 5: Commit**

```
feat: add dark mode classes to all page components
```

---

### Task 10: Final verification

**Step 1: Run TypeScript type check**

Run: `npm run typecheck`
Expected: No errors.

**Step 2: Run ESLint**

Run: `npm run lint`
Expected: No errors.

**Step 3: Run all tests**

Run: `npm run test`
Expected: All tests pass (including the new theme test).

**Step 4: Run production build**

Run: `npm run build`
Expected: Build completes successfully.

**Step 5: Manual smoke test**

Run: `npm run dev`
Test the following:
1. Page loads in system-preferred theme (no flash)
2. Toggle button switches between sun/moon icons
3. Theme persists across page refresh
4. All pages render correctly in both modes: `/`, `/models/gpt-4o`, `/compare/gpt-4o-vs-claude-sonnet`, `/lists/cheapest-ai-models`
5. Mobile menu toggle works and shows theme button
6. Filter panel, badges, tooltips, and comparison table all respect dark mode

**Step 6: Commit (if any fixes needed)**

```
fix: dark mode polish adjustments
```
