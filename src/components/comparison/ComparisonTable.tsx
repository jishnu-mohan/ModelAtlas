"use client";

import { useState } from "react";
import type { AIModel } from "@/lib/types";
import {
  getComparisonFields,
  getBenchmarkFields,
  getDifferences,
  formatFieldValue,
} from "@/lib/comparison";
import { Tooltip } from "@/components/ui/Tooltip";

interface ComparisonTableProps {
  models: AIModel[];
}

export function ComparisonTable({ models }: ComparisonTableProps) {
  const [showOnlyDiffs, setShowOnlyDiffs] = useState(false);

  const fields = getComparisonFields();
  const benchmarkKeys = getBenchmarkFields(models);
  const differences = getDifferences(models);

  const categories = ["pricing", "technical", "capabilities", "classification"] as const;
  const categoryLabels: Record<string, string> = {
    pricing: "Pricing",
    technical: "Technical",
    capabilities: "Capabilities",
    classification: "Classification",
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <label className="flex items-center gap-2 text-sm text-surface-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyDiffs}
            onChange={(e) => setShowOnlyDiffs(e.target.checked)}
            className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
          />
          Show only differences
        </label>
      </div>

      <div className="overflow-x-auto border border-surface-200 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-50 sticky top-0 z-10">
              <th className="text-left p-3 font-semibold text-surface-600 border-b border-surface-200 min-w-[160px]">
                Feature
              </th>
              {models.map((model) => (
                <th
                  key={model.id}
                  className="text-left p-3 font-semibold text-surface-900 border-b border-surface-200 min-w-[180px]"
                >
                  <div>{model.name}</div>
                  <div className="text-xs font-normal text-surface-500">{model.provider}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const catFields = fields.filter((f) => f.category === cat);
              const visibleFields = showOnlyDiffs
                ? catFields.filter((f) => differences.has(f.key))
                : catFields;

              if (visibleFields.length === 0) return null;

              return (
                <CategorySection key={cat} label={categoryLabels[cat]}>
                  {visibleFields.map((field) => {
                    const isDiff = differences.has(field.key);
                    return (
                      <tr key={field.key} className="border-b border-surface-100 hover:bg-surface-50/50">
                        <td className="p-3 text-surface-600 font-medium">
                          {field.tooltip ? (
                            <Tooltip text={field.tooltip}>
                              <span className="border-b border-dotted border-surface-400 cursor-help">
                                {field.label}
                              </span>
                            </Tooltip>
                          ) : (
                            field.label
                          )}
                        </td>
                        {models.map((model) => {
                          const val = model[field.key as keyof AIModel];
                          return (
                            <td
                              key={model.id}
                              className={`p-3 ${isDiff ? "bg-yellow-50" : ""}`}
                            >
                              {formatFieldValue(field.format, val)}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </CategorySection>
              );
            })}

            {benchmarkKeys.length > 0 && (
              <CategorySection label="Benchmarks">
                {benchmarkKeys
                  .filter((key) => !showOnlyDiffs || differences.has(`benchmark:${key}`))
                  .map((key) => {
                    const isDiff = differences.has(`benchmark:${key}`);
                    return (
                      <tr key={key} className="border-b border-surface-100 hover:bg-surface-50/50">
                        <td className="p-3 text-surface-600 font-medium">{key}</td>
                        {models.map((model) => (
                          <td
                            key={model.id}
                            className={`p-3 ${isDiff ? "bg-yellow-50" : ""}`}
                          >
                            {model.benchmarks?.[key] != null
                              ? model.benchmarks[key].toFixed(1)
                              : "—"}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
              </CategorySection>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-surface-400">
        {models.map((m) => (
          <div key={m.id}>
            {m.name} pricing:{" "}
            <a
              href={m.pricingSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:underline"
            >
              source
            </a>{" "}
            (updated {m.lastUpdated})
          </div>
        ))}
      </div>
    </div>
  );
}

function CategorySection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <tr>
        <td
          colSpan={100}
          className="px-3 py-2 bg-surface-100 text-xs font-bold text-surface-500 uppercase tracking-wider"
        >
          {label}
        </td>
      </tr>
      {children}
    </>
  );
}
