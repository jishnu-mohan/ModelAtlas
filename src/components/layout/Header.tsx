"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-surface-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-surface-900">
            <span className="text-primary-600">&#9670;</span>
            {siteConfig.name}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-surface-600 hover:text-surface-900 text-sm font-medium transition-colors"
            >
              Models
            </Link>
            <Link
              href="/lists/best-ai-models-for-coding"
              className="text-surface-600 hover:text-surface-900 text-sm font-medium transition-colors"
            >
              Best For
            </Link>
            <Link
              href="/lists/cheapest-ai-models"
              className="text-surface-600 hover:text-surface-900 text-sm font-medium transition-colors"
            >
              Lists
            </Link>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-surface-600 hover:text-surface-900 text-sm font-medium transition-colors"
            >
              GitHub
            </a>
          </nav>

          <button
            className="md:hidden p-2 text-surface-600 hover:text-surface-900"
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

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-surface-200 pt-4 flex flex-col gap-3">
            <Link href="/" className="text-surface-600 hover:text-surface-900 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Models
            </Link>
            <Link href="/lists/best-ai-models-for-coding" className="text-surface-600 hover:text-surface-900 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Best For
            </Link>
            <Link href="/lists/cheapest-ai-models" className="text-surface-600 hover:text-surface-900 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Lists
            </Link>
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-surface-600 hover:text-surface-900 text-sm font-medium">
              GitHub
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
