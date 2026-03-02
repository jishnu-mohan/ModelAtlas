export type Modality = "text" | "vision" | "audio" | "image-gen" | "video";
export type SpeedTier = "fast" | "balanced" | "advanced";
export type CostTier = "cheap" | "mid" | "premium";
export type ModelStatus = "active" | "deprecated";

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  inputTokenPricePer1M: number;
  outputTokenPricePer1M: number;
  currency: string;
  contextWindow: number;
  maxOutputTokens: number;
  modalities: Modality[];
  supportsToolCalling: boolean;
  supportsStructuredOutput: boolean;
  supportsFineTuning: boolean;
  apiAvailable: boolean;
  openSource: boolean;
  onPremAvailable: boolean;
  releaseDate: string;
  status: ModelStatus;
  bestFor: string[];
  speedTier: SpeedTier;
  costTier: CostTier;
  pricingSourceUrl: string;
  lastUpdated: string;
  benchmarks?: Record<string, number>;
}

export type SortField =
  | "name"
  | "provider"
  | "inputTokenPricePer1M"
  | "outputTokenPricePer1M"
  | "contextWindow"
  | "maxOutputTokens"
  | "releaseDate";

export type SortDirection = "asc" | "desc";

export interface FilterState {
  search: string;
  providers: string[];
  modalities: Modality[];
  status: ModelStatus[];
  costTier: CostTier[];
  speedTier: SpeedTier[];
  openSourceOnly: boolean;
  toolCallingOnly: boolean;
}

export interface ComparisonField {
  key: string;
  label: string;
  category: "pricing" | "technical" | "capabilities" | "classification" | "benchmarks";
  tooltip?: string;
  format: "number" | "currency" | "boolean" | "text" | "array" | "date" | "tokens";
}

export interface ListConfig {
  slug: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  filter?: (model: AIModel) => boolean;
  sort?: { field: SortField; direction: SortDirection };
}
