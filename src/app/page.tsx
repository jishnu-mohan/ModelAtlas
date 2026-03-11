"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllModels, getUniqueProviders } from "@/lib/data";
import {
  filterModels,
  sortModels,
  defaultFilterState,
  filterStateToParams,
  paramsToFilterState,
  defaultSortField,
  defaultSortDir,
} from "@/lib/filters";
import type { FilterState, SortField, SortDirection } from "@/lib/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { ModelGrid } from "@/components/models/ModelGrid";
import { ModelList } from "@/components/models/ModelList";
import { CompareBar } from "@/components/models/CompareBar";

type ViewMode = "grid" | "list";

function HomeContent() {
  const allModels = getAllModels();
  const providers = getUniqueProviders();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [initialized, setInitialized] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [sortField, setSortField] = useState<SortField>(defaultSortField);
  const [sortDir, setSortDir] = useState<SortDirection>(defaultSortDir);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Initialize state from URL params on mount
  useEffect(() => {
    const parsed = paramsToFilterState(searchParams);
    setFilters(parsed.filters);
    setSortField(parsed.sortField);
    setSortDir(parsed.sortDir);
    setInitialized(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const stored = localStorage.getItem("modelExplorerViewMode");
    if (stored === "list") setViewMode("list");
  }, []);

  // Sync state changes to URL
  const updateUrl = useCallback(
    (newFilters: FilterState, newSortField: SortField, newSortDir: SortDirection) => {
      const params = filterStateToParams(newFilters, newSortField, newSortDir);
      const queryString = params.toString();
      router.replace(queryString ? `/?${queryString}` : "/", { scroll: false });
    },
    [router]
  );

  function handleFiltersChange(newFilters: FilterState) {
    setFilters(newFilters);
    if (initialized) updateUrl(newFilters, sortField, sortDir);
  }

  function handleSortFieldChange(field: SortField) {
    setSortField(field);
    if (initialized) updateUrl(filters, field, sortDir);
  }

  function handleSortDirChange() {
    const newDir = sortDir === "asc" ? "desc" : "asc";
    setSortDir(newDir);
    if (initialized) updateUrl(filters, sortField, newDir);
  }

  function handleViewModeChange(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem("modelExplorerViewMode", mode);
  }

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
        <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-2">
          Compare AI Models
        </h1>
        <p className="text-surface-500 dark:text-surface-400 text-lg max-w-2xl">
          Side-by-side comparison of pricing, specs, and benchmarks across leading AI providers. Select models to compare.
        </p>
      </section>

      <div className="space-y-4 mb-6">
        <SearchInput
          value={filters.search}
          onChange={(search) => handleFiltersChange({ ...filters, search })}
          placeholder="Search by model name, provider, or use case..."
        />
        <FilterPanel filters={filters} onChange={handleFiltersChange} providers={providers} />

        <div className="flex items-center gap-3">
          <label className="text-sm text-surface-500 dark:text-surface-400">Sort by:</label>
          <select
            value={sortField}
            onChange={(e) => handleSortFieldChange(e.target.value as SortField)}
            className="text-sm border border-surface-300 dark:border-surface-600 rounded-lg px-3 py-1.5 bg-white dark:bg-surface-800 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="name">Name</option>
            <option value="provider">Provider</option>
            <option value="inputTokenPricePer1M">Input Price</option>
            <option value="outputTokenPricePer1M">Output Price</option>
            <option value="contextWindow">Context Window</option>
            <option value="releaseDate">Release Date</option>
          </select>
          <button
            onClick={handleSortDirChange}
            className="text-sm border border-surface-300 dark:border-surface-600 rounded-lg px-3 py-1.5 bg-white dark:bg-surface-800 dark:text-surface-50 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
          >
            {sortDir === "asc" ? "Ascending" : "Descending"}
          </button>

          <div className="ml-auto flex border border-surface-300 dark:border-surface-600 rounded-lg overflow-hidden">
            <button
              onClick={() => handleViewModeChange("grid")}
              aria-label="Grid view"
              className={`p-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-surface-800 text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-700"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="7" height="7" rx="1" fill="currentColor" />
                <rect x="10" y="1" width="7" height="7" rx="1" fill="currentColor" />
                <rect x="1" y="10" width="7" height="7" rx="1" fill="currentColor" />
                <rect x="10" y="10" width="7" height="7" rx="1" fill="currentColor" />
              </svg>
            </button>
            <button
              onClick={() => handleViewModeChange("list")}
              aria-label="List view"
              className={`p-1.5 transition-colors ${
                viewMode === "list"
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-surface-800 text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-700"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="2" width="16" height="3" rx="1" fill="currentColor" />
                <rect x="1" y="7.5" width="16" height="3" rx="1" fill="currentColor" />
                <rect x="1" y="13" width="16" height="3" rx="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <ModelGrid models={filtered} selectedIds={selectedIds} onToggle={toggleModel} />
      ) : (
        <ModelList models={filtered} selectedIds={selectedIds} onToggle={toggleModel} />
      )}

      <CompareBar
        selectedIds={[...selectedIds]}
        onClear={() => setSelectedIds(new Set())}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
