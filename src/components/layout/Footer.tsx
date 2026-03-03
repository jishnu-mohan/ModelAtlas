import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-50 mb-2">{siteConfig.name}</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Open-source AI model comparison platform. Compare pricing, specs, and benchmarks across providers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-50 mb-2">Links</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-surface-500 dark:text-surface-400 hover:text-primary-600 transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href={`${siteConfig.github}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className="text-surface-500 dark:text-surface-400 hover:text-primary-600 transition-colors">
                  Contributing
                </a>
              </li>
              <li>
                <a href={`${siteConfig.github}/issues`} target="_blank" rel="noopener noreferrer" className="text-surface-500 dark:text-surface-400 hover:text-primary-600 transition-colors">
                  Report Issue
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-50 mb-2">Disclaimer</h3>
            <p className="text-xs text-surface-400 dark:text-surface-500">
              {siteConfig.disclaimer}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-surface-200 dark:border-surface-700 text-center text-xs text-surface-400 dark:text-surface-500">
          MIT License &copy; {new Date().getFullYear()} {siteConfig.author}
        </div>
      </div>
    </footer>
  );
}
