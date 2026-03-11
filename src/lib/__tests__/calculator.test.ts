import { describe, it, expect } from "vitest";
import {
  calculateMonthlyCost,
  calculateAllCosts,
  estimateTokensFromText,
  formatCost,
} from "../calculator";
import { getAllModels } from "../data";
import type { AIModel } from "../types";

const mockModel: AIModel = {
  id: "test-model",
  name: "Test Model",
  provider: "TestProvider",
  inputTokenPricePer1M: 3.0,
  outputTokenPricePer1M: 15.0,
  currency: "USD",
  contextWindow: 128000,
  maxOutputTokens: 4096,
  modalities: ["text"],
  supportsToolCalling: true,
  supportsStructuredOutput: true,
  supportsFineTuning: false,
  apiAvailable: true,
  openSource: false,
  onPremAvailable: false,
  releaseDate: "2024-01-01",
  status: "active",
  bestFor: ["coding"],
  speedTier: "balanced",
  costTier: "mid",
  pricingSourceUrl: "https://example.com",
  lastUpdated: "2024-01-01",
};

describe("calculateMonthlyCost", () => {
  it("calculates cost correctly", () => {
    const result = calculateMonthlyCost(mockModel, 10_000_000, 2_000_000);
    expect(result.inputCost).toBeCloseTo(30.0);
    expect(result.outputCost).toBeCloseTo(30.0);
    expect(result.totalCost).toBeCloseTo(60.0);
  });

  it("returns zero for zero tokens", () => {
    const result = calculateMonthlyCost(mockModel, 0, 0);
    expect(result.totalCost).toBe(0);
  });
});

describe("calculateAllCosts", () => {
  it("sorts by total cost ascending", () => {
    const models = getAllModels().filter((m) => m.status === "active");
    const results = calculateAllCosts(models, 10_000_000, 2_000_000);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].totalCost).toBeGreaterThanOrEqual(results[i - 1].totalCost);
    }
  });
});

describe("estimateTokensFromText", () => {
  it("estimates ~4 chars per token", () => {
    const text = "Hello, world!"; // 13 chars
    const tokens = estimateTokensFromText(text);
    expect(tokens).toBe(4); // ceil(13/4) = 4
  });

  it("returns 0 for empty string", () => {
    expect(estimateTokensFromText("")).toBe(0);
  });
});

describe("formatCost", () => {
  it("formats zero", () => {
    expect(formatCost(0)).toBe("$0.00");
  });

  it("formats small amounts with 4 decimals", () => {
    expect(formatCost(0.005)).toBe("$0.005");
  });

  it("formats very small amounts with 4 decimals", () => {
    expect(formatCost(0.0012)).toBe("$0.0012");
  });

  it("formats normal amounts with 2 decimals", () => {
    expect(formatCost(42.5)).toBe("$42.50");
  });
});
