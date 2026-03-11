"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllModels } from "@/lib/data";
import { getRecommendations } from "@/lib/recommend";
import type { RecommendationCriteria, ScoredModel } from "@/lib/recommend";
import { RecommendWizard } from "@/components/recommend/RecommendWizard";
import { RecommendResults } from "@/components/recommend/RecommendResults";

export default function RecommendPage() {
  const [results, setResults] = useState<ScoredModel[] | null>(null);

  function handleComplete(criteria: RecommendationCriteria) {
    const models = getAllModels();
    const recommendations = getRecommendations(models, criteria);
    setResults(recommendations);
  }

  function handleStartOver() {
    setResults(null);
  }

  return (
    <div>
      <Link href="/" className="text-sm text-primary-600 hover:text-primary-700 mb-4 inline-block">
        &larr; Back to all models
      </Link>

      {!results && (
        <>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-2">
            Find Your Ideal Model
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-lg mb-8 max-w-2xl">
            Answer a few questions and we&apos;ll recommend the best AI models for your needs.
          </p>
        </>
      )}

      {results ? (
        <RecommendResults results={results} onStartOver={handleStartOver} />
      ) : (
        <RecommendWizard onComplete={handleComplete} />
      )}
    </div>
  );
}
