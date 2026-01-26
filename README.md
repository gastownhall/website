# Gas Town Hall Website

The official website for [Gas Town](https://github.com/steveyegge/gastown) - an orchestration layer for AI coding agents.

**Live site**: https://gastownhall.ai

## Quick Start

```bash
npm install          # Installs all dependencies (monorepo with npm workspaces)
npm run dev          # Main site at localhost:4321
npm run dev:docs     # Docs site at localhost:4322
```

## Local Staging

To preview production builds locally before deploying:

```bash
npm run build && npm run preview           # Main site
npm run build:docs && npm run preview:docs # Docs site
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start main site dev server (port 4321) |
| `npm run dev:docs` | Start docs dev server (port 4322) |
| `npm run build` | Build main site |
| `npm run build:docs` | Build docs subdomain (from committed content, no gt needed) |
| `npm run build:all` | Build both main site and docs |
| `npm run preview` | Preview main site production build (run build first) |
| `npm run preview:docs` | Preview docs production build (run build:docs first) |
| `npm run copy-assets` | Copy static assets to tmp/public/ |
| `npm run sync-docs` | Sync docs from gastown repo (requires gt CLI) |
| `npm run llms` | Regenerate llms.txt for main site |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests with Playwright |
| `npm run test:all` | Run all tests (unit + E2E) |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run audit:check` | Check for high/critical vulnerabilities |
| `npm run check` | Run all quality checks (lint, format, test, audit) |
| `npm run deploy` | Build + deploy main site to Cloudflare |
| `npm run deploy:docs` | Build + deploy docs subdomain to Cloudflare |

Build pipelines:
- **Main site:** copy-assets → llms → astro build → `deploy/`
- **Docs subdomain:** llms → astro build → `deploy-docs/` (content is COMMITTED, no gt needed)

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

This is an **npm workspaces monorepo** with two Astro projects:

```
├── package.json             # Root package with workspaces: ["docs"]
├── src/                     # Main site source
│   ├── site.config.ts       # Site configuration (URLs, social links)
│   ├── pages/               # Astro pages (file-based routing)
│   ├── layouts/             # Page layouts (BaseLayout, BlogLayout)
│   └── components/          # Reusable components
├── docs/                    # Docs subdomain (Astro Starlight workspace)
│   ├── package.json         # Workspace package (docs-specific deps)
│   ├── astro.config.mjs     # Starlight config with sidebar
│   ├── src/content/docs/    # Markdown content (committed)
│   └── scripts/             # Docs build scripts
├── scripts/
│   ├── copy-assets.mjs      # Copy src/static/ → tmp/public/
│   ├── sync-gastown-docs.mjs # Sync docs from gastown repo
│   ├── generate-llms.mjs    # Generate /llms.txt
│   └── lib/                 # Shared utilities and tests
├── src/static/              # Static assets (source of truth)
├── docs-fodder/
│   ├── gastown-docs/        # Documentation markdown source
│   └── steve-blog-posts/    # Blog post content
├── deploy/                  # Main site build output
└── deploy-docs/             # Docs subdomain build output
```

## Documentation

Docs use [Astro Starlight](https://starlight.astro.build/) for a modern documentation experience with built-in search, dark mode, and automatic navigation.

### IMPORTANT: Build vs Sync Workflow

**`npm run build:docs`** - Builds from COMMITTED content. No gt CLI needed. Used by Cloudflare.

**`npm run sync-docs`** - Regenerates content from gastown repo. Requires gt CLI. LOCAL ONLY.

```
LOCAL (when gastown docs change):
  npm run sync-docs     # Regenerate content (requires gt CLI)
  git commit + push     # Commit the updated content

CLOUDFLARE (automatic on push):
  npm run build:docs    # Build from committed content (no gt needed)
```

The `docs/src/content/docs/` directory is **committed**. Cloudflare builds from these committed files.

### Updating from a New Gastown Release

```bash
# 1. Pull latest gastown
cd ~/Code/Cache/steveyegge/gastown && git pull && cd -

# 2. Sync docs from gastown repo (requires gt CLI)
npm run sync-docs

# 3. Preview locally
npm run build:docs && npm run preview:docs

# 4. Commit the updated docs
git add docs/src/content/docs/ && git commit -m "Sync docs from gastown"

# 5. Push to main - CF auto-builds both sites
git push
```

### Editing Docs Locally

To edit documentation without syncing from gastown:
1. Edit markdown files directly in `docs/src/content/docs/`
2. Run `npm run dev:docs` to preview
3. Commit your changes

## Configuration

Single source of truth: `site.config.json` contains all site metadata.

- `src/site.config.ts` - Re-exports JSON for Astro components
- `scripts/lib/config.mjs` - Imports JSON for build scripts
- `docs/astro.config.mjs` - Starlight sidebar configuration

## Tech Stack

- [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) - Monorepo management
- [Astro](https://astro.build/) - Static site generator
- [Astro Starlight](https://starlight.astro.build/) - Documentation framework
- [Plausible](https://plausible.io/) - Privacy-friendly analytics
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) - Linting and formatting
- [Playwright](https://playwright.dev/) - E2E testing
- [Husky](https://typicode.github.io/husky/) - Git hooks
- Node.js test runner - Unit testing

## Quality Checks

A pre-commit hook runs `npm run check` automatically on commits to `main` branch, which includes:
- ESLint
- Prettier format check
- Unit tests
- Security audit (fails on high/critical vulnerabilities)

To bypass temporarily: `git commit --no-verify`

## License

This website is licensed under the [MIT License](LICENSE).

**Content Attribution:** All documentation content from the Gas Town repository and blog posts by Steve Yegge are copyright Steve Yegge and are reproduced on this website with permission. The MIT license applies only to the website code, design, and infrastructure - not to the Gas Town documentation content.

For the Gas Town software license, see the [Gas Town repository](https://github.com/steveyegge/gastown).
