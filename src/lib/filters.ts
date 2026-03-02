import type { AIModel, FilterState, SortDirection, SortField } from "./types";

export const defaultFilterState: FilterState = {
  search: "",
  providers: [],
  modalities: [],
  status: [],
  costTier: [],
  speedTier: [],
  openSourceOnly: false,
  toolCallingOnly: false,
};

export function filterModels(models: AIModel[], filters: FilterState): AIModel[] {
  return models.filter((model) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesSearch =
        model.name.toLowerCase().includes(q) ||
        model.provider.toLowerCase().includes(q) ||
        model.bestFor.some((tag) => tag.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    if (filters.providers.length > 0 && !filters.providers.includes(model.provider)) {
      return false;
    }

    if (
      filters.modalities.length > 0 &&
      !filters.modalities.some((m) => model.modalities.includes(m))
    ) {
      return false;
    }

    if (filters.status.length > 0 && !filters.status.includes(model.status)) {
      return false;
    }

    if (filters.costTier.length > 0 && !filters.costTier.includes(model.costTier)) {
      return false;
    }

    if (filters.speedTier.length > 0 && !filters.speedTier.includes(model.speedTier)) {
      return false;
    }

    if (filters.openSourceOnly && !model.openSource) {
      return false;
    }

    if (filters.toolCallingOnly && !model.supportsToolCalling) {
      return false;
    }

    return true;
  });
}

export function sortModels(
  models: AIModel[],
  field: SortField,
  direction: SortDirection
): AIModel[] {
  return [...models].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    let comparison: number;
    if (typeof aVal === "string" && typeof bVal === "string") {
      comparison = aVal.localeCompare(bVal);
    } else {
      comparison = (aVal as number) - (bVal as number);
    }

    return direction === "asc" ? comparison : -comparison;
  });
}
