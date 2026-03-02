import { describe, it, expect } from "vitest";
import {
  getComparisonFields,
  getDifferences,
  formatFieldValue,
  parseComparisonSlugs,
  buildComparisonUrl,
  getBenchmarkFields,
} from "../comparison";
import { getAllModels } from "../data";

describe("getComparisonFields", () => {
  it("returns a non-empty array of fields", () => {
    const fields = getComparisonFields();
    expect(fields.length).toBeGreaterThan(0);
  });

  it("every field has required properties", () => {
    const fields = getComparisonFields();
    for (const field of fields) {
      expect(field.key).toBeTruthy();
      expect(field.label).toBeTruthy();
      expect(field.category).toBeTruthy();
      expect(field.format).toBeTruthy();
    }
  });
});

describe("getDifferences", () => {
  it("returns empty set for fewer than 2 models", () => {
    const models = getAllModels();
    expect(getDifferences([])).toEqual(new Set());
    expect(getDifferences([models[0]])).toEqual(new Set());
  });

  it("detects differences between two different models", () => {
    const models = getAllModels();
    // Pick two models from different providers
    const m1 = models.find((m) => m.provider === "OpenAI")!;
    const m2 = models.find((m) => m.provider === "Anthropic")!;
    const diffs = getDifferences([m1, m2]);
    expect(diffs.has("provider")).toBe(true);
  });
});

describe("formatFieldValue", () => {
  it("formats currency", () => {
    expect(formatFieldValue("currency", 2.5)).toBe("$2.50");
    expect(formatFieldValue("currency", 0.1)).toBe("$0.10");
  });

  it("formats booleans", () => {
    expect(formatFieldValue("boolean", true)).toBe("Yes");
    expect(formatFieldValue("boolean", false)).toBe("No");
  });

  it("formats arrays", () => {
    expect(formatFieldValue("array", ["text", "vision"])).toBe("text, vision");
  });

  it("formats tokens", () => {
    expect(formatFieldValue("tokens", 128000)).toBe("128K");
    expect(formatFieldValue("tokens", 1000000)).toBe("1M");
    expect(formatFieldValue("tokens", 1048576)).toBe("1.0M");
  });

  it("handles null/undefined", () => {
    expect(formatFieldValue("text", null)).toBe("—");
    expect(formatFieldValue("text", undefined)).toBe("—");
  });
});

describe("parseComparisonSlugs", () => {
  it("parses a vs-separated slug", () => {
    expect(parseComparisonSlugs(["gpt-4o-vs-claude-sonnet-4"])).toEqual([
      "gpt-4o",
      "claude-sonnet-4",
    ]);
  });

  it("parses three models", () => {
    expect(parseComparisonSlugs(["a-vs-b-vs-c"])).toEqual(["a", "b", "c"]);
  });
});

describe("buildComparisonUrl", () => {
  it("builds a comparison URL", () => {
    expect(buildComparisonUrl(["gpt-4o", "claude-sonnet-4"])).toBe(
      "/compare/gpt-4o-vs-claude-sonnet-4"
    );
  });
});

describe("getBenchmarkFields", () => {
  it("returns all unique benchmark keys", () => {
    const models = getAllModels();
    const keys = getBenchmarkFields(models);
    expect(keys.length).toBeGreaterThan(0);
    expect(keys).toContain("MMLU");
  });
});
