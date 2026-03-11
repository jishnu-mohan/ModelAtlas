import type { AIModel, CostTier, Modality } from "./types";

export interface RecommendationCriteria {
  useCases: string[];
  budgetTier: CostTier | "any";
  requireToolCalling: boolean;
  requireOpenSource: boolean;
  preferredModalities: Modality[];
  contextNeeds: "small" | "medium" | "large" | "any";
}

export interface ScoredModel {
  model: AIModel;
  score: number;
  reasons: string[];
}

export const defaultCriteria: RecommendationCriteria = {
  useCases: [],
  budgetTier: "any",
  requireToolCalling: false,
  requireOpenSource: false,
  preferredModalities: [],
  contextNeeds: "any",
};

export function scoreModel(
  model: AIModel,
  criteria: RecommendationCriteria
): ScoredModel {
  let score = 0;
  const reasons: string[] = [];

  // Use case matching
  for (const useCase of criteria.useCases) {
    if (model.bestFor.some((tag) => tag.toLowerCase() === useCase.toLowerCase())) {
      score += 10;
      reasons.push(`Matches your use case: ${useCase}`);
    }
  }

  // Budget tier matching
  if (criteria.budgetTier !== "any") {
    if (model.costTier === criteria.budgetTier) {
      score += 5;
      reasons.push(`Within your budget: ${criteria.budgetTier} tier`);
    }
  }

  // Tool calling
  if (criteria.requireToolCalling) {
    if (model.supportsToolCalling) {
      score += 3;
      reasons.push("Supports tool calling");
    } else {
      score -= 100;
      reasons.push("Does not support tool calling (required)");
    }
  }

  // Open source
  if (criteria.requireOpenSource) {
    if (model.openSource) {
      score += 3;
      reasons.push("Open source");
    } else {
      score -= 100;
      reasons.push("Not open source (required)");
    }
  }

  // Modality matching
  for (const modality of criteria.preferredModalities) {
    if (model.modalities.includes(modality)) {
      score += 2;
      reasons.push(`Supports ${modality}`);
    }
  }

  // Context needs
  if (criteria.contextNeeds !== "any") {
    const contextMatch = matchesContextNeeds(model.contextWindow, criteria.contextNeeds);
    if (contextMatch) {
      score += 2;
      reasons.push(`Context window fits your needs`);
    }
  }

  return { model, score, reasons };
}

function matchesContextNeeds(
  contextWindow: number,
  needs: "small" | "medium" | "large"
): boolean {
  switch (needs) {
    case "small":
      return contextWindow <= 32_000;
    case "medium":
      return contextWindow > 32_000 && contextWindow <= 128_000;
    case "large":
      return contextWindow > 128_000;
  }
}

export function getRecommendations(
  models: AIModel[],
  criteria: RecommendationCriteria
): ScoredModel[] {
  const activeModels = models.filter((m) => m.status === "active");
  return activeModels
    .map((model) => scoreModel(model, criteria))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
