# Contributing to ModelAtlas

Thank you for your interest in contributing! Here's how you can help.

## Adding a New Model

1. Edit `src/data/models.json`
2. Add a new entry following the `AIModel` schema in `src/lib/types.ts`
3. Required fields: `id`, `name`, `provider`, pricing, context window, modalities, and all capability flags
4. The `id` must be a unique URL-safe slug (lowercase, hyphens)
5. Include `pricingSourceUrl` linking to the official pricing page
6. Set `lastUpdated` to today's date (ISO format: `YYYY-MM-DD`)
7. Run `npm run typecheck` and `npm run test` to verify

## Updating Pricing

1. Find the model entry in `src/data/models.json`
2. Update `inputTokenPricePer1M` and/or `outputTokenPricePer1M`
3. Verify against the official source and update `pricingSourceUrl` if needed
4. Update `lastUpdated` to today's date

## Code Contributions

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run checks: `npm run typecheck && npm run lint && npm run test`
5. Commit with a clear message
6. Open a pull request

## Code Style

- TypeScript strict mode — no `any` types
- Small, focused components (under 150 lines)
- Pure functions in `src/lib/` — no side effects
- Tailwind CSS for all styling

## Reporting Issues

Open an issue on GitHub with:
- A clear description of the problem
- Steps to reproduce (if applicable)
- Expected vs actual behavior
