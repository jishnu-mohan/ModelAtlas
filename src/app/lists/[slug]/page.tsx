import Link from "next/link";
import { getAllModels } from "@/lib/data";
import { sortModels } from "@/lib/filters";
import { getListConfig, getAllListSlugs } from "@/lib/lists";
import { generateListMetadata } from "@/lib/seo";
import { Badge, CostTierBadge, SpeedTierBadge } from "@/components/ui/Badge";
import { buildComparisonUrl } from "@/lib/comparison";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const config = getListConfig(slug);
  if (!config) return { title: "List Not Found" };
  return generateListMetadata(config.metaTitle, config.metaDescription);
}

export function generateStaticParams() {
  return getAllListSlugs().map((slug) => ({ slug }));
}

export default async function ListPage({ params }: PageProps) {
  const { slug } = await params;
  const config = getListConfig(slug);

  if (!config) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-2">List Not Found</h1>
        <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
          Browse all models
        </Link>
      </div>
    );
  }

  let models = getAllModels();
  if (config.filter) {
    models = models.filter(config.filter);
  }
  if (config.sort) {
    models = sortModels(models, config.sort.field, config.sort.direction);
  }

  return (
    <div>
      <Link href="/" className="text-sm text-primary-600 hover:text-primary-700 mb-4 inline-block">
        &larr; Back to all models
      </Link>

      <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-2">{config.title}</h1>
      <p className="text-surface-500 dark:text-surface-400 text-lg mb-8 max-w-2xl">{config.description}</p>

      <div className="overflow-x-auto border border-surface-200 dark:border-surface-700 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-50 dark:bg-surface-800">
              <th className="text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700">#</th>
              <th className="text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700">Model</th>
              <th className="text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700">Provider</th>
              <th className="text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700">Input $/1M</th>
              <th className="text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700">Output $/1M</th>
              <th className="text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700">Context</th>
              <th className="text-left p-3 font-semibold text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700">Tags</th>
              <th className="p-3 border-b border-surface-200 dark:border-surface-700"></th>
            </tr>
          </thead>
          <tbody>
            {models.map((model, i) => (
              <tr key={model.id} className="border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50/50 dark:hover:bg-surface-800/50">
                <td className="p-3 text-surface-400 dark:text-surface-500">{i + 1}</td>
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
                <td className="p-3">{formatContext(model.contextWindow)}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    <CostTierBadge tier={model.costTier} />
                    <SpeedTierBadge tier={model.speedTier} />
                    {model.openSource && <Badge variant="purple">oss</Badge>}
                  </div>
                </td>
                <td className="p-3">
                  <Link
                    href={buildComparisonUrl([model.id])}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Compare
                  </Link>
                </td>
              </tr>
            ))}
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
