"use client";

import Link from "next/link";
import { buildComparisonUrl } from "@/lib/comparison";
import type { ScoredModel } from "@/lib/recommend";

interface Props {
  results: ScoredModel[];
  onStartOver: () => void;
}

export function RecommendResults({ results, onStartOver }: Props) {
  const topIds = results.slice(0, 3).map((r) => r.model.id);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-2">
        Your Top Picks
      </h2>
      <p className="text-surface-500 dark:text-surface-400 mb-6">
        Based on your preferences, here are the best models for you.
      </p>

      <div className="space-y-4 mb-8">
        {results.map((result, i) => (
          <div
            key={result.model.id}
            className={`p-4 rounded-lg border transition-colors ${
              i === 0
                ? "border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20"
                : "border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-surface-400">#{i + 1}</span>
                  <Link
                    href={`/models/${result.model.id}`}
                    className="text-lg font-semibold text-surface-900 dark:text-surface-50 hover:text-primary-600 transition-colors"
                  >
                    {result.model.name}
                  </Link>
                </div>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  {result.model.provider} &middot; ${result.model.inputTokenPricePer1M.toFixed(2)}/{result.model.outputTokenPricePer1M.toFixed(2)} per 1M tokens
                </p>
              </div>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">
                Score: {result.score}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.reasons
                .filter((r) => !r.includes("(required)"))
                .map((reason) => (
                  <span
                    key={reason}
                    className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  >
                    {reason}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {topIds.length >= 2 && (
          <Link
            href={buildComparisonUrl(topIds)}
            className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Compare Top Picks
          </Link>
        )}
        <button
          onClick={onStartOver}
          className="px-4 py-2 text-sm border border-surface-300 dark:border-surface-600 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
