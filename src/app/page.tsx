"use client";

import { useState, useMemo } from "react";
import { getAllModels, getUniqueProviders } from "@/lib/data";
import { filterModels, sortModels, defaultFilterState } from "@/lib/filters";
import type { FilterState, SortField, SortDirection } from "@/lib/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { ModelGrid } from "@/components/models/ModelGrid";
import { CompareBar } from "@/components/models/CompareBar";

export default function HomePage() {
  const allModels = getAllModels();
  const providers = getUniqueProviders();

  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => sortModels(filterModels(allModels, filters), sortField, sortDir),
    [allModels, filters, sortField, sortDir]
  );

  function toggleModel(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">
          Compare AI Models
        </h1>
        <p className="text-surface-500 text-lg max-w-2xl">
          Side-by-side comparison of pricing, specs, and benchmarks across leading AI providers. Select models to compare.
        </p>
      </section>

      <div className="space-y-4 mb-6">
        <SearchInput
          value={filters.search}
          onChange={(search) => setFilters({ ...filters, search })}
          placeholder="Search by model name, provider, or use case..."
        />
        <FilterPanel filters={filters} onChange={setFilters} providers={providers} />

        <div className="flex items-center gap-3">
          <label className="text-sm text-surface-500">Sort by:</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="text-sm border border-surface-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="name">Name</option>
            <option value="provider">Provider</option>
            <option value="inputTokenPricePer1M">Input Price</option>
            <option value="outputTokenPricePer1M">Output Price</option>
            <option value="contextWindow">Context Window</option>
            <option value="releaseDate">Release Date</option>
          </select>
          <button
            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            className="text-sm border border-surface-300 rounded-lg px-3 py-1.5 bg-white hover:bg-surface-50 transition-colors"
          >
            {sortDir === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
      </div>

      <ModelGrid models={filtered} selectedIds={selectedIds} onToggle={toggleModel} />

      <CompareBar
        selectedIds={[...selectedIds]}
        onClear={() => setSelectedIds(new Set())}
      />
    </div>
  );
}
