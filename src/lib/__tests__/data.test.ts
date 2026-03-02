import { describe, it, expect } from "vitest";
import { getAllModels, getModelById, getModelsByIds, getUniqueProviders, getAllModelIds } from "../data";

describe("data", () => {
  it("getAllModels returns a non-empty array", () => {
    const models = getAllModels();
    expect(models.length).toBeGreaterThan(0);
  });

  it("getModelById returns a model for a valid id", () => {
    const models = getAllModels();
    const model = getModelById(models[0].id);
    expect(model).toBeDefined();
    expect(model!.id).toBe(models[0].id);
  });

  it("getModelById returns undefined for an invalid id", () => {
    expect(getModelById("nonexistent-model-xyz")).toBeUndefined();
  });

  it("getModelsByIds returns only matching models", () => {
    const models = getAllModels();
    const ids = [models[0].id, models[1].id, "nonexistent"];
    const result = getModelsByIds(ids);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(models[0].id);
    expect(result[1].id).toBe(models[1].id);
  });

  it("getUniqueProviders returns sorted unique providers", () => {
    const providers = getUniqueProviders();
    expect(providers.length).toBeGreaterThan(0);
    for (let i = 1; i < providers.length; i++) {
      expect(providers[i] >= providers[i - 1]).toBe(true);
    }
    expect(new Set(providers).size).toBe(providers.length);
  });

  it("getAllModelIds returns ids for every model", () => {
    const ids = getAllModelIds();
    const models = getAllModels();
    expect(ids).toHaveLength(models.length);
  });
});
