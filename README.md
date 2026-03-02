# ModelAtlas

Open-source AI model comparison platform. Compare pricing, specs, and benchmarks across leading AI providers — side by side.

## Features

- **Side-by-side comparison** — Select multiple models and compare in a detailed table
- **Rich model data** — Pricing, context windows, modalities, capabilities, and benchmarks
- **Smart filtering** — Filter by provider, cost tier, speed tier, modalities, and more
- **Search** — Find models by name, provider, or use case
- **SEO-optimized pages** — Curated lists for "cheapest models", "best for coding", etc.
- **Data transparency** — Every price links to its official source with a last-updated timestamp
- **Mobile-friendly** — Responsive design that works on all screen sizes

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS 4**
- **Static data** — JSON-driven, no backend required

## Getting Started

```bash
# Clone the repository
git clone https://github.com/jishnu-mohan/ModelAtlas.git
cd ModelAtlas

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run type checks
npm run typecheck

# Run tests
npm run test
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Updating Model Data

All model data lives in `src/data/models.json`. To add or update a model:

1. Edit `src/data/models.json`
2. Follow the `AIModel` interface defined in `src/lib/types.ts`
3. Include a `pricingSourceUrl` for transparency
4. Set `lastUpdated` to today's date

See [docs/data-guide.md](docs/data-guide.md) for detailed instructions.

## Architecture

```
src/
├── app/                    # Next.js pages (App Router)
│   ├── page.tsx            # Home — model explorer
│   ├── compare/[...slugs]/ # Side-by-side comparison
│   ├── models/[id]/        # Individual model detail
│   └── lists/[slug]/       # Curated SEO list pages
├── components/             # React components
│   ├── ui/                 # Generic UI primitives
│   ├── comparison/         # Comparison table components
│   ├── models/             # Model card/detail components
│   └── layout/             # Header, Footer
├── data/                   # Static JSON data
│   └── models.json
├── lib/                    # Pure utility functions
│   ├── types.ts            # TypeScript interfaces
│   ├── data.ts             # Data access layer
│   ├── filters.ts          # Filtering & sorting
│   ├── comparison.ts       # Comparison logic
│   ├── seo.ts              # SEO metadata helpers
│   └── lists.ts            # Curated list configs
└── config/
    └── site.ts             # Site-wide constants
```

See [docs/architecture.md](docs/architecture.md) for a deeper explanation.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE) — Copyright (c) 2026 Jishnu Mohan P R
