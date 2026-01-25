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
| `npm run sync-docs` | Sync docs from gastown repo and rebuild (requires gt CLI) |
| `npm run usage` | Generate CLI usage pages from gt --help (requires gt CLI) |
| `npm run llms` | Regenerate llms.txt for main site |
| `npm run llms-full` | Regenerate llms-full.txt (comprehensive) for main site root |
| `npm run llms-full:main` | Regenerate /docs/llms-full.txt for main site |
| `npm run llms:docs` | Regenerate llms.txt for docs subdomain (includes full CLI) |
| `npm run llms:docs:main` | Regenerate /docs/llms.txt for main site (includes full CLI) |
| `npm test` | Run unit tests (72 tests) |
| `npm run test:e2e` | Run E2E tests with Playwright |
| `npm run test:all` | Run all tests (unit + E2E) |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run audit:check` | Check for high/critical vulnerabilities |
| `npm run check` | Run all quality checks (lint, format, test, audit) |
| `npm run deploy` | Manual deploy to Cloudflare Pages |

Build pipelines:
- **Main site:** copy-assets → shred-docs → copy-docs → llms → llms-full → llms-full:main → llms:docs:main → astro build → `deploy/`
- **Docs subdomain:** copy-assets → shred-docs → llms:docs → astro build → `deploy-docs/`
- **Dev server:** copy-assets → shred-docs → copy-docs → llms → llms-full → llms-full:main → llms:docs:main → astro dev
- **Sync docs:** syncs gastown repo → shred-docs → usage → copy-docs (requires gt CLI)

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
│   ├── generate-llms.mjs    # Generate /llms.txt
│   ├── generate-llms-full.mjs # Generate /llms-full.txt (--main for /docs/)
│   ├── generate-llms-docs.mjs # Generate /docs/llms.txt (--main for main site)
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
gt --help                 → usage      → src-docs/pages/usage/*.astro (committed)
src-docs/pages/           → copy-docs  → src/pages/docs/*.astro
```

**Note:** Usage docs (`src-docs/pages/usage/` and `src-docs/data/usage-commands.json`) are committed to the repo because the Cloudflare build environment doesn't have the `gt` CLI. When `gt` changes, run `npm run sync-docs` locally and commit the updated files.

### LLM Reference Files

LLM-friendly text files are generated during every build (not committed):

| URL | Description |
|-----|-------------|
| `/llms.txt` | Short reference with page links |
| `/llms-full.txt` | Comprehensive with content excerpts |
| `/docs/llms.txt` | Docs reference with full CLI usage |
| `/docs/llms-full.txt` | Comprehensive docs reference |

### Updating from a New Gastown Release

```bash
# 1. Pull latest gastown
cd ~/Code/Cache/steveyegge/gastown && git pull && cd -

# 2. Sync docs from gastown repo (requires gt CLI installed locally)
npm run sync-docs

# 3. Preview locally
npm run dev

# 4. Commit the updated files (usage docs + astro pages)
git add -A && git commit -m "Sync docs from gastown"

# 5. Push to main - CF auto-builds both sites
git push
```

**What gets committed:** `src-docs/pages/usage/*.astro`, `src-docs/data/usage-commands.json`, and `src-docs/pages/*.astro`

**What CF generates:** LLM reference files (`llms.txt`, `llms-full.txt`) are regenerated during each build.

### Editing Docs Locally

To edit documentation without syncing from gastown:
1. Edit markdown files in `docs-fodder/gastown-docs/`
2. Run `npm run dev` (regenerates automatically)

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
