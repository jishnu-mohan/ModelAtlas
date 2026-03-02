import type { AIModel, ComparisonField } from "./types";

export function getComparisonFields(): ComparisonField[] {
  return [
    {
      key: "provider",
      label: "Provider",
      category: "technical",
      format: "text",
    },
    {
      key: "inputTokenPricePer1M",
      label: "Input Price / 1M tokens",
      category: "pricing",
      format: "currency",
      tooltip: "Cost per 1 million input tokens in USD",
    },
    {
      key: "outputTokenPricePer1M",
      label: "Output Price / 1M tokens",
      category: "pricing",
      format: "currency",
      tooltip: "Cost per 1 million output tokens in USD",
    },
    {
      key: "costTier",
      label: "Cost Tier",
      category: "pricing",
      format: "text",
    },
    {
      key: "contextWindow",
      label: "Context Window",
      category: "technical",
      format: "tokens",
      tooltip: "Maximum number of tokens the model can process in a single request",
    },
    {
      key: "maxOutputTokens",
      label: "Max Output Tokens",
      category: "technical",
      format: "tokens",
      tooltip: "Maximum number of tokens the model can generate in a single response",
    },
    {
      key: "modalities",
      label: "Modalities",
      category: "technical",
      format: "array",
      tooltip: "Input types the model can process",
    },
    {
      key: "releaseDate",
      label: "Release Date",
      category: "technical",
      format: "date",
    },
    {
      key: "status",
      label: "Status",
      category: "technical",
      format: "text",
    },
    {
      key: "supportsToolCalling",
      label: "Tool Calling",
      category: "capabilities",
      format: "boolean",
      tooltip: "Whether the model supports function/tool calling",
    },
    {
      key: "supportsStructuredOutput",
      label: "Structured Output",
      category: "capabilities",
      format: "boolean",
      tooltip: "Whether the model can return structured JSON output",
    },
    {
      key: "supportsFineTuning",
      label: "Fine-Tuning",
      category: "capabilities",
      format: "boolean",
    },
    {
      key: "apiAvailable",
      label: "API Available",
      category: "capabilities",
      format: "boolean",
    },
    {
      key: "openSource",
      label: "Open Source",
      category: "capabilities",
      format: "boolean",
    },
    {
      key: "onPremAvailable",
      label: "On-Prem Deployment",
      category: "capabilities",
      format: "boolean",
    },
    {
      key: "bestFor",
      label: "Best For",
      category: "classification",
      format: "array",
    },
    {
      key: "speedTier",
      label: "Speed Tier",
      category: "classification",
      format: "text",
    },
  ];
}

export function getBenchmarkFields(models: AIModel[]): string[] {
  const allKeys = new Set<string>();
  for (const model of models) {
    if (model.benchmarks) {
      for (const key of Object.keys(model.benchmarks)) {
        allKeys.add(key);
      }
    }
  }
  return [...allKeys].sort();
}

export function getDifferences(models: AIModel[]): Set<string> {
  if (models.length < 2) return new Set();

  const diffFields = new Set<string>();
  const fields = getComparisonFields();

  for (const field of fields) {
    const values = models.map((m) => {
      const val = m[field.key as keyof AIModel];
      return Array.isArray(val) ? JSON.stringify(val) : String(val);
    });

    if (new Set(values).size > 1) {
      diffFields.add(field.key);
    }
  }

  // Check benchmark differences
  const benchmarkKeys = getBenchmarkFields(models);
  for (const key of benchmarkKeys) {
    const values = models.map((m) => m.benchmarks?.[key] ?? null);
    const uniqueValues = new Set(values.map(String));
    if (uniqueValues.size > 1) {
      diffFields.add(`benchmark:${key}`);
    }
  }

  return diffFields;
}

export function formatFieldValue(format: string, value: unknown): string {
  if (value === null || value === undefined) return "—";

  switch (format) {
    case "currency":
      return `$${(value as number).toFixed(2)}`;
    case "number":
      return (value as number).toLocaleString();
    case "tokens":
      return formatTokenCount(value as number);
    case "boolean":
      return value ? "Yes" : "No";
    case "array":
      return (value as string[]).join(", ");
    case "date":
      return new Date(value as string).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    default:
      return String(value);
  }
}

function formatTokenCount(tokens: number): string {
  if (tokens >= 1_000_000) {
    const val = tokens / 1_000_000;
    return `${Number.isInteger(val) ? val.toFixed(0) : val.toFixed(1)}M`;
  }
  if (tokens >= 1_000) {
    const val = tokens / 1_000;
    return `${Number.isInteger(val) ? val.toFixed(0) : val.toFixed(1)}K`;
  }
  return tokens.toLocaleString();
}

export function parseComparisonSlugs(slugs: string[]): string[] {
  // URL format: /compare/model-a-vs-model-b-vs-model-c
  // slugs = ["model-a-vs-model-b-vs-model-c"]
  if (slugs.length === 1) {
    return slugs[0].split("-vs-");
  }
  return slugs;
}

export function buildComparisonUrl(modelIds: string[]): string {
  return `/compare/${modelIds.join("-vs-")}`;
}
