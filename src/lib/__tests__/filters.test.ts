import { describe, it, expect } from "vitest";
import { filterModels, sortModels, defaultFilterState } from "../filters";
import { getAllModels } from "../data";
import type { FilterState } from "../types";

describe("filterModels", () => {
  const models = getAllModels();

  it("returns all models with default filters", () => {
    const result = filterModels(models, defaultFilterState);
    expect(result).toHaveLength(models.length);
  });

  it("filters by search term (model name)", () => {
    const filters: FilterState = { ...defaultFilterState, search: "GPT" };
    const result = filterModels(models, filters);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.name.toLowerCase().includes("gpt") || m.provider.toLowerCase().includes("gpt"))).toBe(true);
  });

  it("filters by provider", () => {
    const filters: FilterState = { ...defaultFilterState, providers: ["Anthropic"] };
    const result = filterModels(models, filters);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.provider === "Anthropic")).toBe(true);
  });

  it("filters by cost tier", () => {
    const filters: FilterState = { ...defaultFilterState, costTier: ["cheap"] };
    const result = filterModels(models, filters);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.costTier === "cheap")).toBe(true);
  });

  it("filters by open source only", () => {
    const filters: FilterState = { ...defaultFilterState, openSourceOnly: true };
    const result = filterModels(models, filters);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.openSource)).toBe(true);
  });

  it("filters by modalities", () => {
    const filters: FilterState = { ...defaultFilterState, modalities: ["audio"] };
    const result = filterModels(models, filters);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.modalities.includes("audio"))).toBe(true);
  });

  it("combines multiple filters", () => {
    const filters: FilterState = {
      ...defaultFilterState,
      costTier: ["cheap"],
      openSourceOnly: true,
    };
    const result = filterModels(models, filters);
    expect(result.every((m) => m.costTier === "cheap" && m.openSource)).toBe(true);
  });

  it("returns empty array when no models match", () => {
    const filters: FilterState = { ...defaultFilterState, search: "nonexistent_model_xyz_123" };
    const result = filterModels(models, filters);
    expect(result).toHaveLength(0);
  });
});

describe("sortModels", () => {
  const models = getAllModels();

  it("sorts by name ascending", () => {
    const sorted = sortModels(models, "name", "asc");
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].name.localeCompare(sorted[i - 1].name)).toBeGreaterThanOrEqual(0);
    }
  });

  it("sorts by input price descending", () => {
    const sorted = sortModels(models, "inputTokenPricePer1M", "desc");
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].inputTokenPricePer1M).toBeLessThanOrEqual(sorted[i - 1].inputTokenPricePer1M);
    }
  });

  it("sorts by context window ascending", () => {
    const sorted = sortModels(models, "contextWindow", "asc");
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].contextWindow).toBeGreaterThanOrEqual(sorted[i - 1].contextWindow);
    }
  });
});
