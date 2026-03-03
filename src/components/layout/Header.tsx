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
