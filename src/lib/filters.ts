import type { AIModel, CostTier, FilterState, Modality, ModelStatus, SortDirection, SortField, SpeedTier } from "./types";

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

export const defaultSortField: SortField = "name";
export const defaultSortDir: SortDirection = "asc";

const validModalities: Modality[] = ["text", "vision", "audio", "image-gen", "video"];
const validStatuses: ModelStatus[] = ["active", "deprecated"];
const validCostTiers: CostTier[] = ["cheap", "mid", "premium"];
const validSpeedTiers: SpeedTier[] = ["fast", "balanced", "advanced"];
const validSortFields: SortField[] = [
  "name", "provider", "inputTokenPricePer1M", "outputTokenPricePer1M",
  "contextWindow", "maxOutputTokens", "releaseDate",
];

export function filterStateToParams(
  state: FilterState,
  sortField: SortField,
  sortDir: SortDirection
): URLSearchParams {
  const params = new URLSearchParams();

  if (state.search) params.set("q", state.search);
  if (state.providers.length > 0) params.set("p", state.providers.join(","));
  if (state.modalities.length > 0) params.set("m", state.modalities.join(","));
  if (state.status.length > 0) params.set("s", state.status.join(","));
  if (state.costTier.length > 0) params.set("ct", state.costTier.join(","));
  if (state.speedTier.length > 0) params.set("st", state.speedTier.join(","));
  if (state.openSourceOnly) params.set("oss", "1");
  if (state.toolCallingOnly) params.set("tc", "1");
  if (sortField !== defaultSortField) params.set("sort", sortField);
  if (sortDir !== defaultSortDir) params.set("dir", sortDir);

  return params;
}

export function paramsToFilterState(params: URLSearchParams): {
  filters: FilterState;
  sortField: SortField;
  sortDir: SortDirection;
} {
  const modalities = (params.get("m")?.split(",") ?? []).filter(
    (v): v is Modality => validModalities.includes(v as Modality)
  );
  const status = (params.get("s")?.split(",") ?? []).filter(
    (v): v is ModelStatus => validStatuses.includes(v as ModelStatus)
  );
  const costTier = (params.get("ct")?.split(",") ?? []).filter(
    (v): v is CostTier => validCostTiers.includes(v as CostTier)
  );
  const speedTier = (params.get("st")?.split(",") ?? []).filter(
    (v): v is SpeedTier => validSpeedTiers.includes(v as SpeedTier)
  );

  const sortParam = params.get("sort");
  const sortField: SortField = sortParam && validSortFields.includes(sortParam as SortField)
    ? (sortParam as SortField)
    : defaultSortField;

  const dirParam = params.get("dir");
  const sortDir: SortDirection = dirParam === "desc" ? "desc" : "asc";

  return {
    filters: {
      search: params.get("q") ?? "",
      providers: params.get("p")?.split(",").filter(Boolean) ?? [],
      modalities,
      status,
      costTier,
      speedTier,
      openSourceOnly: params.get("oss") === "1",
      toolCallingOnly: params.get("tc") === "1",
    },
    sortField,
    sortDir,
  };
}

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
