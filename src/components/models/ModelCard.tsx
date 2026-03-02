"use client";

import Link from "next/link";
import type { AIModel } from "@/lib/types";
import { Badge, CostTierBadge, SpeedTierBadge } from "@/components/ui/Badge";

interface ModelCardProps {
  model: AIModel;
  selected: boolean;
  onToggle: (id: string) => void;
}

export function ModelCard({ model, selected, onToggle }: ModelCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 transition-all hover:shadow-md ${
        selected ? "border-primary-400 ring-2 ring-primary-100 bg-primary-50/30" : "border-surface-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggle(model.id)}
                className="rounded border-surface-300 text-primary-600 focus:ring-primary-500 mr-2"
              />
              <Link
                href={`/models/${model.id}`}
                className="font-semibold text-surface-900 hover:text-primary-600 transition-colors truncate"
              >
                {model.name}
              </Link>
            </label>
          </div>
          <p className="text-sm text-surface-500">{model.provider}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div>
          <span className="text-surface-400 text-xs">Input</span>
          <p className="font-medium text-surface-800">${model.inputTokenPricePer1M}/1M</p>
        </div>
        <div>
          <span className="text-surface-400 text-xs">Output</span>
          <p className="font-medium text-surface-800">${model.outputTokenPricePer1M}/1M</p>
        </div>
        <div>
          <span className="text-surface-400 text-xs">Context</span>
          <p className="font-medium text-surface-800">{formatContext(model.contextWindow)}</p>
        </div>
        <div>
          <span className="text-surface-400 text-xs">Max Output</span>
          <p className="font-medium text-surface-800">{formatContext(model.maxOutputTokens)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {model.modalities.map((m) => (
          <Badge key={m}>{m}</Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <CostTierBadge tier={model.costTier} />
        <SpeedTierBadge tier={model.speedTier} />
        {model.openSource && <Badge variant="purple">open-source</Badge>}
      </div>
    </div>
  );
}

function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(tokens % 1_000_000 === 0 ? 0 : 1)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(0)}K`;
  return tokens.toString();
}
