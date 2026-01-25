# Gas Town Hall Website

The official website for [Gas Town](https://github.com/steveyegge/gastown) - an orchestration layer for AI coding agents.

**Live site**: https://gastownhall.ai

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:4321 to view the site.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build main site only |
| `npm run build:docs` | Build docs subdomain only |
| `npm run build:all` | Build both main site and docs |
| `npm run preview` | Preview production build |
| `npm run copy-assets` | Copy static assets to tmp/public/ |
| `npm run shred-docs` | Generate docs to src-docs/pages/ from markdown |
| `npm run copy-docs` | Copy src-docs/pages/ to src/pages/docs/ (with path transforms) |
| `npm run sync-docs` | Sync docs from gastown repo and rebuild |
| `npm run usage` | Generate CLI usage page from gt --help |
| `npm run llms` | Regenerate llms.txt |
| `npm run llms-full` | Regenerate llms-full.txt (comprehensive) |
| `npm test` | Run unit tests (66 tests) |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run deploy` | Manual deploy to Cloudflare Pages |

Build pipelines:
- **Main site:** copy-assets → shred-docs → usage → copy-docs → llms → llms-full → astro build → `deploy/`
- **Docs subdomain:** copy-assets → shred-docs → usage → astro build → `deploy-docs/`
- **Dev server:** copy-assets → shred-docs → usage → copy-docs → astro dev

## Deployment

Both sites auto-deploy to Cloudflare Pages on push to `main`.

| Site | URL | Cloudflare Project | Output Dir |
|------|-----|-------------------|------------|
| Main | https://gastownhall.ai | `gastownhall-website` | `deploy/` |
| Docs | https://docs.gastownhall.ai | `gastown-docs` | `deploy-docs/` |

Manual deploys:
- `npm run deploy` - Deploy main site
- `npm run deploy:docs` - Deploy docs subdomain

**Redirects:** gastownhall.com → gastownhall.ai

## Project Structure

```
├── src/                     # Main site source
│   ├── site.config.ts       # Site configuration (URLs, social links)
│   ├── pages/               # Astro pages (file-based routing)
│   │   └── docs/            # Generated from src-docs/ via copy-docs
│   ├── layouts/             # Page layouts (BaseLayout, DocsLayout, BlogLayout)
│   └── components/          # Reusable components
├── src-docs/                # Docs subdomain source (canonical)
│   ├── pages/               # Generated docs pages
│   └── layouts/             # Docs-specific layouts
├── scripts/
│   ├── copy-assets.mjs      # Copy src/static/ → tmp/public/
│   ├── shred-docs.mjs       # Generate docs-fodder/ → src-docs/pages/
│   ├── copy-docs.mjs        # Copy src-docs/pages/ → src/pages/docs/
│   ├── sync-gastown-docs.mjs # Sync docs from gastown repo
│   ├── generate-usage.mjs   # Generate CLI usage from gt --help
│   ├── generate-llms.mjs    # Generate llms.txt
│   ├── generate-llms-full.mjs
│   └── lib/                 # Shared utilities and tests
├── src/static/              # Static assets (source of truth)
├── docs-fodder/
│   ├── gastown-docs/        # Documentation markdown source
│   └── steve-blog-posts/    # Blog post content
├── deploy/                  # Main site build output
└── deploy-docs/             # Docs subdomain build output
```

## Documentation

Docs are generated to `src-docs/pages/` (canonical location for the subdomain), then copied to `src/pages/docs/` for the main site.

```
docs-fodder/gastown-docs/ → shred-docs → src-docs/pages/*.astro
gt --help                 → usage      → src-docs/pages/usage.astro
src-docs/pages/           → copy-docs  → src/pages/docs/*.astro
```

To update documentation:
1. Edit markdown files in `docs-fodder/gastown-docs/`
2. Run `npm run build` or `npm run dev` (regenerates automatically)

To sync docs from a new gastown release:
```bash
npm run sync-docs                              # Uses default path
node scripts/sync-gastown-docs.mjs /path/to/gastown  # Custom path
```

## Configuration

Single source of truth: `site.config.json` contains all site metadata.

- `src/site.config.ts` - Re-exports JSON for Astro components
- `scripts/lib/config.mjs` - Imports JSON for build scripts

**Dev/Prod URL Switching:** Docs links automatically point to localhost in dev mode and docs.gastownhall.ai in production.

## Tech Stack

- [Astro](https://astro.build/) - Static site generator
- [Plausible](https://plausible.io/) - Privacy-friendly analytics
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) - Linting and formatting
- Node.js test runner - Unit testing

## License

This website is licensed under the [MIT License](LICENSE).

**Content Attribution:** All documentation content from the Gas Town repository and blog posts by Steve Yegge are copyright Steve Yegge and are reproduced on this website with permission. The MIT license applies only to the website code, design, and infrastructure - not to the Gas Town documentation content.

For the Gas Town software license, see the [Gas Town repository](https://github.com/steveyegge/gastown).
