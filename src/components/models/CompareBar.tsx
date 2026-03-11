"use client";

import Link from "next/link";
import { buildComparisonUrl } from "@/lib/comparison";

interface CompareBarProps {
  selectedIds: string[];
  onClear: () => void;
}

export function CompareBar({ selectedIds, onClear }: CompareBarProps) {
  if (selectedIds.length < 2) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-800 text-surface-900 dark:text-white border-t border-surface-200 dark:border-surface-700 py-3 px-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span className="text-sm">
          {selectedIds.length} models selected
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={onClear}
            className="text-sm text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"
          >
            Clear
          </button>
          <Link
            href={buildComparisonUrl(selectedIds)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Compare
          </Link>
        </div>
      </div>
    </div>
  );
}
