"use client";

import Link from "next/link";
import type { AIModel } from "@/lib/types";
import { Badge, CostTierBadge, SpeedTierBadge } from "@/components/ui/Badge";

interface ModelListProps {
  models: AIModel[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}

export function ModelList({ models, selectedIds, onToggle }: ModelListProps) {
  if (models.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-surface-500 dark:text-surface-400 text-lg">No models match your filters.</p>
        <p className="text-surface-400 dark:text-surface-500 text-sm mt-1">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
        {models.length} model{models.length !== 1 ? "s" : ""}
      </p>
      <div className="overflow-x-auto border border-surface-200 dark:border-surface-700 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-50 dark:bg-surface-800">
              <th className="text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700 w-8"></th>
              <th className="text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700">Model</th>
              <th className="text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700">Provider</th>
              <th className="text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700">Input $/1M</th>
              <th className="text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700">Output $/1M</th>
              <th className="text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700 hidden sm:table-cell">Context</th>
              <th className="text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700 hidden sm:table-cell">Tags</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => {
              const selected = selectedIds.has(model.id);
              return (
                <tr
                  key={model.id}
                  className={`border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50/50 dark:hover:bg-surface-800/50 ${
                    selected ? "bg-primary-50/30 dark:bg-primary-900/20" : ""
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggle(model.id)}
                      className="rounded border-surface-300 dark:border-surface-600 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/models/${model.id}`}
                      className="font-medium text-surface-900 dark:text-surface-50 hover:text-primary-600 transition-colors"
                    >
                      {model.name}
                    </Link>
                  </td>
                  <td className="p-3 text-surface-600 dark:text-surface-300">{model.provider}</td>
                  <td className="p-3 font-mono">${model.inputTokenPricePer1M.toFixed(2)}</td>
                  <td className="p-3 font-mono">${model.outputTokenPricePer1M.toFixed(2)}</td>
                  <td className="p-3 hidden sm:table-cell">{formatContext(model.contextWindow)}</td>
                  <td className="p-3 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      <CostTierBadge tier={model.costTier} />
                      <SpeedTierBadge tier={model.speedTier} />
                      {model.openSource && <Badge variant="purple">oss</Badge>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(tokens % 1_000_000 === 0 ? 0 : 1)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(0)}K`;
  return tokens.toString();
}
