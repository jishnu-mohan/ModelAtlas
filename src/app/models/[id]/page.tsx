import Link from "next/link";
import { getAllModels, getModelById } from "@/lib/data";
import { generateModelMetadata, generateModelJsonLd } from "@/lib/seo";
import { ModelDetail } from "@/components/models/ModelDetail";
import { buildComparisonUrl } from "@/lib/comparison";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const model = getModelById(id);
  if (!model) return { title: "Model Not Found" };
  return generateModelMetadata(model);
}

export function generateStaticParams() {
  return getAllModels().map((m) => ({ id: m.id }));
}

export default async function ModelPage({ params }: PageProps) {
  const { id } = await params;
  const model = getModelById(id);

  if (!model) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Model Not Found</h1>
        <p className="text-surface-500 mb-4">
          No model found with ID &ldquo;{id}&rdquo;.
        </p>
        <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
          Browse all models
        </Link>
      </div>
    );
  }

  const allModels = getAllModels();
  const relatedModels = allModels
    .filter((m) => m.id !== model.id && (m.provider === model.provider || m.costTier === model.costTier))
    .slice(0, 4);

  const jsonLd = generateModelJsonLd(model);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/" className="text-sm text-primary-600 hover:text-primary-700 mb-4 inline-block">
        &larr; Back to all models
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-surface-900">{model.name}</h1>
        <p className="text-surface-500 text-lg">by {model.provider}</p>
      </div>

      <ModelDetail model={model} />

      {/* Related Models */}
      {relatedModels.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Compare with</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {relatedModels.map((related) => (
              <Link
                key={related.id}
                href={buildComparisonUrl([model.id, related.id])}
                className="border border-surface-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all"
              >
                <div className="font-medium text-surface-900">{related.name}</div>
                <div className="text-sm text-surface-500">{related.provider}</div>
                <div className="text-xs text-primary-600 mt-2">Compare &rarr;</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
