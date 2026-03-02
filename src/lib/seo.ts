import type { Metadata } from "next";
import type { AIModel } from "./types";
import { siteConfig } from "@/config/site";

export function generateCompareMetadata(models: AIModel[]): Metadata {
  const names = models.map((m) => m.name);
  const title = `${names.join(" vs ")} — Compare AI Models | ${siteConfig.name}`;
  const description = `Side-by-side comparison of ${names.join(", ")}. Compare pricing, context windows, benchmarks, and capabilities.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function generateModelMetadata(model: AIModel): Metadata {
  const title = `${model.name} by ${model.provider} — Pricing, Specs & Benchmarks | ${siteConfig.name}`;
  const description = `${model.name} specs: $${model.inputTokenPricePer1M}/1M input tokens, ${formatContextWindow(model.contextWindow)} context window. ${model.modalities.join(", ")} support. Compare with other AI models.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function generateListMetadata(title: string, description: string): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function generateModelJsonLd(model: AIModel) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: model.name,
    applicationCategory: "AI Model",
    operatingSystem: "Cloud",
    offers: {
      "@type": "Offer",
      price: model.inputTokenPricePer1M,
      priceCurrency: model.currency,
      description: `Per 1M input tokens`,
    },
    author: {
      "@type": "Organization",
      name: model.provider,
    },
    datePublished: model.releaseDate,
  };
}

export function generateCompareJsonLd(models: AIModel[]) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Compare ${models.map((m) => m.name).join(" vs ")}`,
    description: `Side-by-side comparison of ${models.map((m) => m.name).join(", ")}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: models.map((model, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: model.name,
          author: { "@type": "Organization", name: model.provider },
        },
      })),
    },
  };
}

function formatContextWindow(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(tokens % 1_000_000 === 0 ? 0 : 1)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(0)}K`;
  return tokens.toString();
}
