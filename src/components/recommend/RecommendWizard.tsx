"use client";

import { useState } from "react";
import { getUniqueBestForTags } from "@/lib/data";
import type { CostTier, Modality } from "@/lib/types";
import type { RecommendationCriteria } from "@/lib/recommend";
import { defaultCriteria } from "@/lib/recommend";

interface Props {
  onComplete: (criteria: RecommendationCriteria) => void;
}

const budgetOptions: { label: string; value: CostTier | "any" }[] = [
  { label: "Budget-friendly", value: "cheap" },
  { label: "Mid-range", value: "mid" },
  { label: "Premium", value: "premium" },
  { label: "No preference", value: "any" },
];

const contextOptions: { label: string; value: "small" | "medium" | "large" | "any" }[] = [
  { label: "Small (<32K)", value: "small" },
  { label: "Medium (32K-128K)", value: "medium" },
  { label: "Large (128K+)", value: "large" },
  { label: "No preference", value: "any" },
];

export function RecommendWizard({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [criteria, setCriteria] = useState<RecommendationCriteria>(defaultCriteria);
  const bestForTags = getUniqueBestForTags();

  function toggleUseCase(tag: string) {
    setCriteria((prev) => ({
      ...prev,
      useCases: prev.useCases.includes(tag)
        ? prev.useCases.filter((t) => t !== tag)
        : [...prev.useCases, tag],
    }));
  }

  function toggleModality(mod: Modality) {
    setCriteria((prev) => ({
      ...prev,
      preferredModalities: prev.preferredModalities.includes(mod)
        ? prev.preferredModalities.filter((m) => m !== mod)
        : [...prev.preferredModalities, mod],
    }));
  }

  function next() {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(criteria);
    }
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  const pillBase =
    "px-3 py-1.5 text-sm rounded-lg border transition-colors cursor-pointer select-none";
  const pillActive = "bg-primary-600 text-white border-primary-600";
  const pillInactive =
    "border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s <= step
                  ? "bg-primary-600 text-white"
                  : "bg-surface-200 dark:bg-surface-700 text-surface-500"
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`flex-1 h-0.5 ${
                  s < step ? "bg-primary-600" : "bg-surface-200 dark:bg-surface-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Use Cases */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 mb-2">
            What will you use it for?
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            Select all that apply. You can skip if unsure.
          </p>
          <div className="flex flex-wrap gap-2">
            {bestForTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleUseCase(tag)}
                className={`${pillBase} ${
                  criteria.useCases.includes(tag) ? pillActive : pillInactive
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Budget */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 mb-2">
            What&apos;s your budget?
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            Select a pricing tier that works for you.
          </p>
          <div className="flex flex-col gap-3">
            {budgetOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setCriteria({ ...criteria, budgetTier: opt.value })}
                className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                  criteria.budgetTier === opt.value
                    ? "bg-primary-600 text-white border-primary-600"
                    : "border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Requirements */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 mb-2">
            Any specific requirements?
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            Check any must-have features. You can skip if none are required.
          </p>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={criteria.requireToolCalling}
                onChange={(e) =>
                  setCriteria({ ...criteria, requireToolCalling: e.target.checked })
                }
                className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-surface-700 dark:text-surface-300">Tool calling support</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={criteria.requireOpenSource}
                onChange={(e) =>
                  setCriteria({ ...criteria, requireOpenSource: e.target.checked })
                }
                className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-surface-700 dark:text-surface-300">Open source</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={criteria.preferredModalities.includes("vision")}
                onChange={() => toggleModality("vision")}
                className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-surface-700 dark:text-surface-300">Vision / image input</span>
            </label>

            <div>
              <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2 mt-6">
                Context window needs
              </p>
              <div className="flex flex-wrap gap-2">
                {contextOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCriteria({ ...criteria, contextNeeds: opt.value })}
                    className={`${pillBase} ${
                      criteria.contextNeeds === opt.value ? pillActive : pillInactive
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: confirm */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 mb-2">
            Ready to see your recommendations?
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            Review your selections and click &quot;Get Recommendations&quot; to see the best models for your needs.
          </p>
          <div className="bg-surface-50 dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700 space-y-2 text-sm">
            {criteria.useCases.length > 0 && (
              <p className="text-surface-700 dark:text-surface-300">
                <span className="font-medium">Use cases:</span> {criteria.useCases.join(", ")}
              </p>
            )}
            <p className="text-surface-700 dark:text-surface-300">
              <span className="font-medium">Budget:</span> {criteria.budgetTier === "any" ? "No preference" : criteria.budgetTier}
            </p>
            {criteria.requireToolCalling && (
              <p className="text-surface-700 dark:text-surface-300">Requires tool calling</p>
            )}
            {criteria.requireOpenSource && (
              <p className="text-surface-700 dark:text-surface-300">Requires open source</p>
            )}
            {criteria.preferredModalities.length > 0 && (
              <p className="text-surface-700 dark:text-surface-300">
                <span className="font-medium">Modalities:</span> {criteria.preferredModalities.join(", ")}
              </p>
            )}
            {criteria.contextNeeds !== "any" && (
              <p className="text-surface-700 dark:text-surface-300">
                <span className="font-medium">Context:</span> {criteria.contextNeeds}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={back}
          disabled={step === 1}
          className="px-4 py-2 text-sm border border-surface-300 dark:border-surface-600 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>
        <div className="flex gap-2">
          {step < 4 && (
            <button
              onClick={next}
              className="px-4 py-2 text-sm border border-surface-300 dark:border-surface-600 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
            >
              Skip
            </button>
          )}
          <button
            onClick={next}
            className="px-6 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {step === 4 ? "Get Recommendations" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
