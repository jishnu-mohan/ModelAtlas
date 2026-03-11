"use client";

import type { AIModel } from "@/lib/types";
import { ModelCard } from "./ModelCard";

interface ModelGridProps {
  models: AIModel[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}

export function ModelGrid({ models, selectedIds, onToggle }: ModelGridProps) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            selected={selectedIds.has(model.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
