import type { AIModel } from "@/lib/types";
import { Badge, CostTierBadge, SpeedTierBadge, StatusBadge } from "@/components/ui/Badge";

interface ModelDetailProps {
  model: AIModel;
}

export function ModelDetail({ model }: ModelDetailProps) {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <section>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <StatusBadge status={model.status} />
          <CostTierBadge tier={model.costTier} />
          <SpeedTierBadge tier={model.speedTier} />
          {model.openSource && <Badge variant="purple">open-source</Badge>}
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {model.bestFor.map((tag) => (
            <Badge key={tag} variant="primary">{tag}</Badge>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h2 className="text-lg font-semibold text-surface-900 mb-3 border-b border-surface-200 pb-2">
          Pricing
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard label="Input Price" value={`$${model.inputTokenPricePer1M.toFixed(2)} / 1M tokens`} />
          <InfoCard label="Output Price" value={`$${model.outputTokenPricePer1M.toFixed(2)} / 1M tokens`} />
          <InfoCard label="Currency" value={model.currency} />
          <InfoCard
            label="Source"
            value={
              <a
                href={model.pricingSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline break-all"
              >
                Official pricing page
              </a>
            }
          />
        </div>
        <p className="text-xs text-surface-400 mt-2">
          Last updated: {new Date(model.lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </p>
      </section>

      {/* Technical Specs */}
      <section>
        <h2 className="text-lg font-semibold text-surface-900 mb-3 border-b border-surface-200 pb-2">
          Technical Specifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard label="Context Window" value={`${model.contextWindow.toLocaleString()} tokens`} />
          <InfoCard label="Max Output Tokens" value={`${model.maxOutputTokens.toLocaleString()} tokens`} />
          <InfoCard label="Modalities" value={model.modalities.join(", ")} />
          <InfoCard
            label="Release Date"
            value={new Date(model.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          />
        </div>
      </section>

      {/* Capabilities */}
      <section>
        <h2 className="text-lg font-semibold text-surface-900 mb-3 border-b border-surface-200 pb-2">
          Capabilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <CapabilityItem label="Tool Calling" supported={model.supportsToolCalling} />
          <CapabilityItem label="Structured Output" supported={model.supportsStructuredOutput} />
          <CapabilityItem label="Fine-Tuning" supported={model.supportsFineTuning} />
          <CapabilityItem label="API Available" supported={model.apiAvailable} />
          <CapabilityItem label="Open Source" supported={model.openSource} />
          <CapabilityItem label="On-Prem Deployment" supported={model.onPremAvailable} />
        </div>
      </section>

      {/* Benchmarks */}
      {model.benchmarks && Object.keys(model.benchmarks).length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-surface-900 mb-3 border-b border-surface-200 pb-2">
            Benchmarks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(model.benchmarks).map(([key, value]) => (
              <div key={key} className="bg-surface-50 rounded-lg p-4">
                <div className="text-sm text-surface-500 mb-1">{key}</div>
                <div className="text-2xl font-bold text-surface-900">{value.toFixed(1)}</div>
                <div className="mt-2 w-full bg-surface-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${Math.min(value, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-surface-50 rounded-lg p-4">
      <div className="text-xs text-surface-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm font-medium text-surface-800">{value}</div>
    </div>
  );
}

function CapabilityItem({ label, supported }: { label: string; supported: boolean }) {
  return (
    <div className="flex items-center gap-2 p-2">
      <span className={`text-lg ${supported ? "text-green-500" : "text-surface-300"}`}>
        {supported ? "\u2713" : "\u2717"}
      </span>
      <span className={`text-sm ${supported ? "text-surface-800" : "text-surface-400"}`}>
        {label}
      </span>
    </div>
  );
}
