import type { AIModel } from "./types";

export interface ModelCost {
  model: AIModel;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

export function calculateMonthlyCost(
  model: AIModel,
  inputTokens: number,
  outputTokens: number
): ModelCost {
  const inputCost = (inputTokens * model.inputTokenPricePer1M) / 1_000_000;
  const outputCost = (outputTokens * model.outputTokenPricePer1M) / 1_000_000;
  return {
    model,
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
  };
}

export function calculateAllCosts(
  models: AIModel[],
  inputTokens: number,
  outputTokens: number
): ModelCost[] {
  return models
    .map((model) => calculateMonthlyCost(model, inputTokens, outputTokens))
    .sort((a, b) => a.totalCost - b.totalCost);
}

export function estimateTokensFromText(text: string): number {
  return Math.ceil(text.length / 4);
}

export function formatCost(cost: number): string {
  if (cost === 0) return "$0.00";
  if (cost < 0.01) return `$${parseFloat(cost.toFixed(4))}`;
  if (cost < 1) return `$${parseFloat(cost.toFixed(3))}`;
  return `$${cost.toFixed(2)}`;
}
