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
    <div className="border border-surface-200 rounded-lg bg-white">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-surface-700"
        onClick={() => setExpanded(!expanded)}
      >
        <span>
          Filters
          {activeCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs">
              {activeCount}
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-surface-200 pt-4">
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
            <label className="flex items-center gap-2 text-sm text-surface-600 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.openSourceOnly}
                onChange={(e) => onChange({ ...filters, openSourceOnly: e.target.checked })}
                className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
              />
              Open Source Only
            </label>
            <label className="flex items-center gap-2 text-sm text-surface-600 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.toolCallingOnly}
                onChange={(e) => onChange({ ...filters, toolCallingOnly: e.target.checked })}
                className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
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
      <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
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
          ? "bg-primary-100 text-primary-700 border-primary-300"
          : "bg-white text-surface-600 border-surface-300 hover:border-surface-400"
      }`}
    >
      {label}
    </button>
  );
}
