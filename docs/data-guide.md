# Data Update Guide

## Overview

All model data is stored in `src/data/models.json`. This file is the single source of truth for the entire application.

## Adding a New Model

Add a new object to the JSON array with all required fields:

```json
{
  "id": "model-slug",
  "name": "Model Display Name",
  "provider": "Provider Name",
  "inputTokenPricePer1M": 1.00,
  "outputTokenPricePer1M": 3.00,
  "currency": "USD",
  "contextWindow": 128000,
  "maxOutputTokens": 8192,
  "modalities": ["text", "vision"],
  "supportsToolCalling": true,
  "supportsStructuredOutput": true,
  "supportsFineTuning": false,
  "apiAvailable": true,
  "openSource": false,
  "onPremAvailable": false,
  "releaseDate": "2025-01-15",
  "status": "active",
  "bestFor": ["coding", "reasoning"],
  "speedTier": "balanced",
  "costTier": "mid",
  "pricingSourceUrl": "https://provider.com/pricing",
  "lastUpdated": "2025-12-01",
  "benchmarks": {
    "MMLU": 85.0,
    "HumanEval": 90.0,
    "GSM8K": 92.0
  }
}
```

## Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique URL-safe slug (lowercase, hyphens only) |
| `name` | string | Human-readable model name |
| `provider` | string | Company name (OpenAI, Anthropic, Google, etc.) |
| `inputTokenPricePer1M` | number | USD cost per 1 million input tokens |
| `outputTokenPricePer1M` | number | USD cost per 1 million output tokens |
| `currency` | string | Always "USD" for now |
| `contextWindow` | number | Maximum tokens in a single request |
| `maxOutputTokens` | number | Maximum tokens in a single response |
| `modalities` | string[] | Supported input types: "text", "vision", "audio", "image-gen", "video" |
| `supportsToolCalling` | boolean | Function/tool calling support |
| `supportsStructuredOutput` | boolean | JSON structured output support |
| `supportsFineTuning` | boolean | Fine-tuning available |
| `apiAvailable` | boolean | API access available |
| `openSource` | boolean | Model weights are publicly available |
| `onPremAvailable` | boolean | Can be deployed on-premises |
| `releaseDate` | string | ISO date (YYYY-MM-DD) |
| `status` | string | "active" or "deprecated" |
| `bestFor` | string[] | Use case tags: "coding", "reasoning", "chatbots", "rag", etc. |
| `speedTier` | string | "fast", "balanced", or "advanced" |
| `costTier` | string | "cheap", "mid", or "premium" |
| `pricingSourceUrl` | string | URL to official pricing page |
| `lastUpdated` | string | ISO date of last data update |
| `benchmarks` | object | Optional benchmark scores (key: benchmark name, value: score) |

## Pricing Guidelines

- Always normalize to **USD per 1 million tokens**
- Use the base/standard tier pricing (not batch or cached pricing)
- Link to the official pricing page as `pricingSourceUrl`
- Update `lastUpdated` whenever you change pricing data

## Validation

After editing, run:

```bash
npm run typecheck   # Verify TypeScript types
npm run test        # Run data integrity tests
npm run build       # Verify the build succeeds
```
