import Link from "next/link";
import { getAllModels, getModelsByIds } from "@/lib/data";
import { parseComparisonSlugs } from "@/lib/comparison";
import { generateCompareMetadata, generateCompareJsonLd } from "@/lib/seo";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";

interface PageProps {
  params: Promise<{ slugs: string[] }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slugs } = await params;
  const modelIds = parseComparisonSlugs(slugs);
  const models = getModelsByIds(modelIds);
  if (models.length < 2) return { title: "Comparison Not Found" };
  return generateCompareMetadata(models);
}

export function generateStaticParams() {
  const models = getAllModels();
  const params: { slugs: string[] }[] = [];

  // Generate pairs for the most popular models
  for (let i = 0; i < Math.min(models.length, 10); i++) {
    for (let j = i + 1; j < Math.min(models.length, 10); j++) {
      params.push({ slugs: [`${models[i].id}-vs-${models[j].id}`] });
    }
  }
  return params;
}

export default async function ComparePage({ params }: PageProps) {
  const { slugs } = await params;
  const modelIds = parseComparisonSlugs(slugs);
  const models = getModelsByIds(modelIds);

  if (models.length < 2) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-surface-900 mb-2">
          Comparison Not Found
        </h1>
        <p className="text-surface-500 mb-4">
          We need at least 2 valid models to compare. Some model IDs may be invalid.
        </p>
        <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
          Browse all models
        </Link>
      </div>
    );
  }

  const jsonLd = generateCompareJsonLd(models);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-6">
        <Link href="/" className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-block">
          &larr; Back to all models
        </Link>
        <h1 className="text-2xl font-bold text-surface-900">
          {models.map((m) => m.name).join(" vs ")}
        </h1>
        <p className="text-surface-500 mt-1">
          Side-by-side comparison of pricing, specs, and benchmarks.
        </p>
      </div>

      <ComparisonTable models={models} />
    </div>
  );
}
