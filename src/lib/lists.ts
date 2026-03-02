import type { AIModel, ListConfig } from "./types";

export const listConfigs: ListConfig[] = [
  {
    slug: "cheapest-ai-models",
    title: "Cheapest AI Models",
    description:
      "The most affordable AI models ranked by input token price. Great for high-volume applications and cost-sensitive projects.",
    metaTitle: "Cheapest AI Models (2026) — Pricing Comparison",
    metaDescription:
      "Compare the cheapest AI models by price per token. Find the most affordable LLMs for your project.",
    sort: { field: "inputTokenPricePer1M", direction: "asc" },
  },
  {
    slug: "largest-context-window-models",
    title: "Largest Context Window AI Models",
    description:
      "AI models with the biggest context windows, ideal for processing long documents, codebases, and complex multi-turn conversations.",
    metaTitle: "Largest Context Window AI Models (2026)",
    metaDescription:
      "Find AI models with the largest context windows. Compare context sizes from 32K to over 1M tokens.",
    sort: { field: "contextWindow", direction: "desc" },
  },
  {
    slug: "open-source-ai-models",
    title: "Open Source AI Models",
    description:
      "Fully open-source AI models you can self-host, fine-tune, and deploy on your own infrastructure.",
    metaTitle: "Open Source AI Models (2026) — Self-Hostable LLMs",
    metaDescription:
      "Compare open-source AI models. Find self-hostable LLMs with pricing, specs, and benchmarks.",
    filter: (model: AIModel) => model.openSource,
  },
  {
    slug: "best-ai-models-for-coding",
    title: "Best AI Models for Coding",
    description:
      "Top AI models optimized for code generation, debugging, and software development tasks.",
    metaTitle: "Best AI Models for Coding (2026)",
    metaDescription:
      "Compare the best AI models for coding. Ranked by HumanEval scores, pricing, and developer features.",
    filter: (model: AIModel) => model.bestFor.includes("coding"),
  },
  {
    slug: "best-ai-models-for-reasoning",
    title: "Best AI Models for Reasoning",
    description:
      "AI models that excel at complex reasoning, logic, math, and multi-step problem solving.",
    metaTitle: "Best AI Models for Reasoning (2026)",
    metaDescription:
      "Compare the best AI models for reasoning tasks. Find top performers for math, logic, and analysis.",
    filter: (model: AIModel) => model.bestFor.includes("reasoning"),
  },
];

export function getListConfig(slug: string): ListConfig | undefined {
  return listConfigs.find((c) => c.slug === slug);
}

export function getAllListSlugs(): string[] {
  return listConfigs.map((c) => c.slug);
}
