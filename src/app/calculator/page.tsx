"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAllModels } from "@/lib/data";
import { calculateAllCosts, estimateTokensFromText, formatCost } from "@/lib/calculator";

const PRESETS = [
  { label: "1M", value: 1_000_000 },
  { label: "10M", value: 10_000_000 },
  { label: "100M", value: 100_000_000 },
];

type SortKey = "model" | "provider" | "inputCost" | "outputCost" | "totalCost";

function CalculatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [inputTokens, setInputTokens] = useState(10_000_000);
  const [outputTokens, setOutputTokens] = useState(2_000_000);
  const [sampleText, setSampleText] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("totalCost");
  const [sortAsc, setSortAsc] = useState(true);

  // Initialize from URL params
  useEffect(() => {
    const inParam = searchParams.get("in");
    const outParam = searchParams.get("out");
    if (inParam) setInputTokens(Number(inParam) || 10_000_000);
    if (outParam) setOutputTokens(Number(outParam) || 2_000_000);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (inputTokens !== 10_000_000) params.set("in", String(inputTokens));
    if (outputTokens !== 2_000_000) params.set("out", String(outputTokens));
    const queryString = params.toString();
    router.replace(queryString ? `/calculator?${queryString}` : "/calculator", { scroll: false });
  }, [inputTokens, outputTokens, router]);

  const activeModels = useMemo(
    () => getAllModels().filter((m) => m.status === "active"),
    []
  );

  const costs = useMemo(
    () => calculateAllCosts(activeModels, inputTokens, outputTokens),
    [activeModels, inputTokens, outputTokens]
  );

  const sortedCosts = useMemo(() => {
    const sorted = [...costs].sort((a, b) => {
      switch (sortKey) {
        case "model":
          return a.model.name.localeCompare(b.model.name);
        case "provider":
          return a.model.provider.localeCompare(b.model.provider);
        case "inputCost":
          return a.inputCost - b.inputCost;
        case "outputCost":
          return a.outputCost - b.outputCost;
        case "totalCost":
          return a.totalCost - b.totalCost;
      }
    });
    return sortAsc ? sorted : sorted.reverse();
  }, [costs, sortKey, sortAsc]);

  const cheapestTotal = costs.length > 0 ? costs[0].totalCost : 0;

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function handleEstimate() {
    if (sampleText.trim()) {
      const estimated = estimateTokensFromText(sampleText);
      setInputTokens(estimated);
    }
  }

  function formatTokenCount(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return n.toLocaleString();
  }

  const thClass =
    "text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700 cursor-pointer hover:text-surface-900 dark:hover:text-surface-50 select-none";

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return "";
    return sortAsc ? " \u2191" : " \u2193";
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-1">
        Cost Calculator
      </h1>
      <p className="text-surface-500 dark:text-surface-400 text-lg mb-4 max-w-2xl">
        Estimate your monthly API costs across all models. Enter your expected token usage to see projected costs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Monthly Input Tokens
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              value={inputTokens}
              onChange={(e) => setInputTokens(Math.max(0, Number(e.target.value)))}
              className="flex-1 border border-surface-300 dark:border-surface-600 rounded-lg px-3 py-2 bg-white dark:bg-surface-800 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setInputTokens(p.value)}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                  inputTokens === p.value
                    ? "bg-primary-600 text-white border-primary-600"
                    : "border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-surface-400 mt-1">{formatTokenCount(inputTokens)} tokens</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Monthly Output Tokens
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              value={outputTokens}
              onChange={(e) => setOutputTokens(Math.max(0, Number(e.target.value)))}
              className="flex-1 border border-surface-300 dark:border-surface-600 rounded-lg px-3 py-2 bg-white dark:bg-surface-800 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setOutputTokens(p.value)}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                  outputTokens === p.value
                    ? "bg-primary-600 text-white border-primary-600"
                    : "border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-surface-400 mt-1">{formatTokenCount(outputTokens)} tokens</p>
        </div>
      </div>

      <div className="mb-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700">
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          Estimate tokens from text (optional)
        </label>
        <textarea
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          placeholder="Paste sample text to estimate input tokens (~4 characters per token)..."
          rows={3}
          className="w-full border border-surface-300 dark:border-surface-600 rounded-lg px-3 py-2 bg-white dark:bg-surface-800 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2 text-sm"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={handleEstimate}
            disabled={!sampleText.trim()}
            className="px-4 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Estimate
          </button>
          {sampleText.trim() && (
            <span className="text-sm text-surface-500">
              ~{estimateTokensFromText(sampleText).toLocaleString()} tokens
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto border border-surface-200 dark:border-surface-700 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-50 dark:bg-surface-800">
              <th className={thClass}>#</th>
              <th className={thClass} onClick={() => handleSort("model")}>
                Model{sortIndicator("model")}
              </th>
              <th className={thClass} onClick={() => handleSort("provider")}>
                Provider{sortIndicator("provider")}
              </th>
              <th className={thClass} onClick={() => handleSort("inputCost")}>
                Input Cost{sortIndicator("inputCost")}
              </th>
              <th className={thClass} onClick={() => handleSort("outputCost")}>
                Output Cost{sortIndicator("outputCost")}
              </th>
              <th className={thClass} onClick={() => handleSort("totalCost")}>
                Total/Month{sortIndicator("totalCost")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCosts.map((item, i) => (
              <tr
                key={item.model.id}
                className={`border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50/50 dark:hover:bg-surface-800/50 ${
                  item.totalCost === cheapestTotal
                    ? "bg-green-50 dark:bg-green-900/20"
                    : ""
                }`}
              >
                <td className="p-3 text-surface-400 dark:text-surface-500">{i + 1}</td>
                <td className="p-3">
                  <Link
                    href={`/models/${item.model.id}`}
                    className="font-medium text-surface-900 dark:text-surface-50 hover:text-primary-600 transition-colors"
                  >
                    {item.model.name}
                  </Link>
                </td>
                <td className="p-3 text-surface-600 dark:text-surface-300">
                  {item.model.provider}
                </td>
                <td className="p-3 font-mono">{formatCost(item.inputCost)}</td>
                <td className="p-3 font-mono">{formatCost(item.outputCost)}</td>
                <td className="p-3 font-mono font-semibold">{formatCost(item.totalCost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense>
      <CalculatorContent />
    </Suspense>
  );
}
