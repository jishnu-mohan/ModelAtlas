import modelsData from "@/data/models.json";
import type { AIModel } from "./types";

const models: AIModel[] = modelsData as AIModel[];

export function getAllModels(): AIModel[] {
  return models;
}

export function getModelById(id: string): AIModel | undefined {
  return models.find((m) => m.id === id);
}

export function getModelsByIds(ids: string[]): AIModel[] {
  return ids.map((id) => models.find((m) => m.id === id)).filter(Boolean) as AIModel[];
}

export function getUniqueProviders(): string[] {
  return [...new Set(models.map((m) => m.provider))].sort();
}

export function getUniqueBestForTags(): string[] {
  return [...new Set(models.flatMap((m) => m.bestFor))].sort();
}

export function getAllModelIds(): string[] {
  return models.map((m) => m.id);
}
