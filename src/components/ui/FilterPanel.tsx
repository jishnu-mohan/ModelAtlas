"use client";

import { useState } from "react";
import type { FilterState, Modality, CostTier, SpeedTier } from "@/lib/types";

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  providers: string[];
}

export function FilterPanel({ filters, onChange, providers }: FilterPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const modalities: Modality[] = ["text", "vision", "audio", "image-gen", "video"];
  const costTiers: CostTier[] = ["cheap", "mid", "premium"];
  const speedTiers: SpeedTier[] = ["fast", "balanced", "advanced"];

  const activeCount =
    filters.providers.length +
    filters.modalities.length +
    filters.costTier.length +
    filters.speedTier.length +
    (filters.openSourceOnly ? 1 : 0) +
    (filters.toolCallingOnly ? 1 : 0);

  function toggleArrayFilter<T>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }

  function clearFilters() {
    onChange({
      ...filters,
      providers: [],
      modalities: [],
      status: [],
      costTier: [],
      speedTier: [],
      openSourceOnly: false,
      toolCallingOnly: false,
    });
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs">
            {activeCount}
          </span>
        )}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="absolute top-full left-0 mt-2 z-40 w-[480px] max-w-[calc(100vw-2rem)] border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 p-4 space-y-4 shadow-lg">
          <FilterSection title="Provider">
            <div className="flex flex-wrap gap-2">
              {providers.map((p) => (
                <FilterChip
                  key={p}
                  label={p}
                  active={filters.providers.includes(p)}
                  onClick={() => onChange({ ...filters, providers: toggleArrayFilter(filters.providers, p) })}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Modalities">
            <div className="flex flex-wrap gap-2">
              {modalities.map((m) => (
                <FilterChip
                  key={m}
                  label={m}
                  active={filters.modalities.includes(m)}
                  onClick={() => onChange({ ...filters, modalities: toggleArrayFilter(filters.modalities, m) })}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Cost Tier">
            <div className="flex flex-wrap gap-2">
              {costTiers.map((t) => (
                <FilterChip
                  key={t}
                  label={t}
                  active={filters.costTier.includes(t)}
                  onClick={() => onChange({ ...filters, costTier: toggleArrayFilter(filters.costTier, t) })}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Speed Tier">
            <div className="flex flex-wrap gap-2">
              {speedTiers.map((t) => (
                <FilterChip
                  key={t}
                  label={t}
                  active={filters.speedTier.includes(t)}
                  onClick={() => onChange({ ...filters, speedTier: toggleArrayFilter(filters.speedTier, t) })}
                />
              ))}
            </div>
          </FilterSection>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.openSourceOnly}
                onChange={(e) => onChange({ ...filters, openSourceOnly: e.target.checked })}
                className="rounded border-surface-300 dark:border-surface-600 text-primary-600 focus:ring-primary-500"
              />
              Open Source Only
            </label>
            <label className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.toolCallingOnly}
                onChange={(e) => onChange({ ...filters, toolCallingOnly: e.target.checked })}
                className="rounded border-surface-300 dark:border-surface-600 text-primary-600 focus:ring-primary-500"
              />
              Tool Calling
            </label>
          </div>

          {activeCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
        {title}
      </h4>
      {children}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
        active
          ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-700"
          : "bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-300 dark:border-surface-600 hover:border-surface-400 dark:hover:border-surface-500"
      }`}
    >
      {label}
    </button>
  );
}
