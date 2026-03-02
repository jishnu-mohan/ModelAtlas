import { describe, it, expect } from "vitest";
import { getAllModels } from "@/lib/data";
import type { AIModel, Modality, SpeedTier, CostTier, ModelStatus } from "@/lib/types";

const validModalities: Modality[] = ["text", "vision", "audio", "image-gen", "video"];
const validSpeedTiers: SpeedTier[] = ["fast", "balanced", "advanced"];
const validCostTiers: CostTier[] = ["cheap", "mid", "premium"];
const validStatuses: ModelStatus[] = ["active", "deprecated"];

describe("models.json data integrity", () => {
  const models = getAllModels();

  it("has at least 10 models", () => {
    expect(models.length).toBeGreaterThanOrEqual(10);
  });

  it("has no duplicate IDs", () => {
    const ids = models.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  describe.each(models.map((m) => [m.id, m]))("%s", (_id, model) => {
    const m = model as AIModel;

    it("has a valid id (lowercase, hyphens, alphanumeric)", () => {
      expect(m.id).toMatch(/^[a-z0-9-]+$/);
    });

    it("has a non-empty name and provider", () => {
      expect(m.name.length).toBeGreaterThan(0);
      expect(m.provider.length).toBeGreaterThan(0);
    });

    it("has valid pricing (non-negative numbers)", () => {
      expect(m.inputTokenPricePer1M).toBeGreaterThanOrEqual(0);
      expect(m.outputTokenPricePer1M).toBeGreaterThanOrEqual(0);
    });

    it("has currency set to USD", () => {
      expect(m.currency).toBe("USD");
    });

    it("has valid context window and max output tokens", () => {
      expect(m.contextWindow).toBeGreaterThan(0);
      expect(m.maxOutputTokens).toBeGreaterThan(0);
    });

    it("has valid modalities", () => {
      expect(m.modalities.length).toBeGreaterThan(0);
      for (const mod of m.modalities) {
        expect(validModalities).toContain(mod);
      }
    });

    it("has valid tier values", () => {
      expect(validSpeedTiers).toContain(m.speedTier);
      expect(validCostTiers).toContain(m.costTier);
      expect(validStatuses).toContain(m.status);
    });

    it("has valid dates", () => {
      expect(new Date(m.releaseDate).toString()).not.toBe("Invalid Date");
      expect(new Date(m.lastUpdated).toString()).not.toBe("Invalid Date");
    });

    it("has a pricing source URL", () => {
      expect(m.pricingSourceUrl).toMatch(/^https?:\/\//);
    });

    it("has at least one bestFor tag", () => {
      expect(m.bestFor.length).toBeGreaterThan(0);
    });

    it("has valid boolean fields", () => {
      expect(typeof m.supportsToolCalling).toBe("boolean");
      expect(typeof m.supportsStructuredOutput).toBe("boolean");
      expect(typeof m.supportsFineTuning).toBe("boolean");
      expect(typeof m.apiAvailable).toBe("boolean");
      expect(typeof m.openSource).toBe("boolean");
      expect(typeof m.onPremAvailable).toBe("boolean");
    });

    if (m.benchmarks) {
      it("has valid benchmark scores (0-100)", () => {
        for (const [, score] of Object.entries(m.benchmarks!)) {
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);
        }
      });
    }
  });
});
