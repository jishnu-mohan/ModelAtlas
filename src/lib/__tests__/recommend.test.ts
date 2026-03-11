import { describe, it, expect } from "vitest";
import { scoreModel, getRecommendations, defaultCriteria } from "../recommend";
import { getAllModels } from "../data";
import type { AIModel } from "../types";
import type { RecommendationCriteria } from "../recommend";

const mockModel: AIModel = {
  id: "test-model",
  name: "Test Model",
  provider: "TestProvider",
  inputTokenPricePer1M: 1.0,
  outputTokenPricePer1M: 2.0,
  currency: "USD",
  contextWindow: 128000,
  maxOutputTokens: 4096,
  modalities: ["text", "vision"],
  supportsToolCalling: true,
  supportsStructuredOutput: true,
  supportsFineTuning: false,
  apiAvailable: true,
  openSource: true,
  onPremAvailable: false,
  releaseDate: "2024-01-01",
  status: "active",
  bestFor: ["coding", "reasoning"],
  speedTier: "fast",
  costTier: "cheap",
  pricingSourceUrl: "https://example.com",
  lastUpdated: "2024-01-01",
};

describe("scoreModel", () => {
  it("scores matching use cases at +10 each", () => {
    const criteria: RecommendationCriteria = {
      ...defaultCriteria,
      useCases: ["coding"],
    };
    const result = scoreModel(mockModel, criteria);
    expect(result.score).toBe(10);
    expect(result.reasons).toContain("Matches your use case: coding");
  });

  it("scores matching budget tier", () => {
    const criteria: RecommendationCriteria = {
      ...defaultCriteria,
      budgetTier: "cheap",
    };
    const result = scoreModel(mockModel, criteria);
    expect(result.score).toBe(5);
  });

  it("penalizes missing required tool calling", () => {
    const noToolModel: AIModel = { ...mockModel, supportsToolCalling: false };
    const criteria: RecommendationCriteria = {
      ...defaultCriteria,
      requireToolCalling: true,
    };
    const result = scoreModel(noToolModel, criteria);
    expect(result.score).toBeLessThan(0);
  });

  it("penalizes missing required open source", () => {
    const closedModel: AIModel = { ...mockModel, openSource: false };
    const criteria: RecommendationCriteria = {
      ...defaultCriteria,
      requireOpenSource: true,
    };
    const result = scoreModel(closedModel, criteria);
    expect(result.score).toBeLessThan(0);
  });

  it("scores matching modalities", () => {
    const criteria: RecommendationCriteria = {
      ...defaultCriteria,
      preferredModalities: ["vision"],
    };
    const result = scoreModel(mockModel, criteria);
    expect(result.score).toBe(2);
  });

  it("combines multiple criteria", () => {
    const criteria: RecommendationCriteria = {
      useCases: ["coding", "reasoning"],
      budgetTier: "cheap",
      requireToolCalling: true,
      requireOpenSource: false,
      preferredModalities: ["vision"],
      contextNeeds: "any",
    };
    // coding: 10, reasoning: 10, budget: 5, tool calling: 3, vision: 2 = 30
    const result = scoreModel(mockModel, criteria);
    expect(result.score).toBe(30);
  });
});

describe("getRecommendations", () => {
  it("returns at most 5 results", () => {
    const models = getAllModels();
    const results = getRecommendations(models, defaultCriteria);
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it("returns results sorted by score descending", () => {
    const models = getAllModels();
    const criteria: RecommendationCriteria = {
      ...defaultCriteria,
      useCases: ["coding"],
      budgetTier: "cheap",
    };
    const results = getRecommendations(models, criteria);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].score).toBeLessThanOrEqual(results[i - 1].score);
    }
  });

  it("only includes active models", () => {
    const models = getAllModels();
    const results = getRecommendations(models, defaultCriteria);
    expect(results.every((r) => r.model.status === "active")).toBe(true);
  });
});
