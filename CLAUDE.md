# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gas Town Hall website (gastownhall.ai) - documentation hub for Gas Town, an orchestration layer for AI coding agents. Built with Astro 5.x, outputs to `deploy/`.

## Build Commands

```bash
npm run dev          # Start dev server (http://localhost:4321)
npm run build        # Build main site (gastownhall.ai)
npm run build:docs   # Build docs subdomain (docs.gastownhall.ai)
npm run build:all    # Build both
npm run preview      # Preview production build
npm run copy-assets  # Copy src/static/ to tmp/public/
npm run shred-docs   # Regenerate docs from docs-fodder/gastown-docs/
npm run usage        # Regenerate src/pages/docs/usage.astro from gt --help
npm run llms         # Regenerate tmp/public/llms.txt
npm run llms-full    # Regenerate tmp/public/llms-full.txt
npm test             # Run all tests (Node.js test runner)
node --test scripts/lib/__tests__/markdown.test.mjs  # Run single test file
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run format:check # Check formatting without writing
npm run deploy       # Manual deploy to Cloudflare Pages
```

**Main site build (`npm run build`):** copy-assets → shred-docs → usage → llms → llms-full → astro check → astro build → `deploy/`

**Docs build (`npm run build:docs`):** copy-assets → shred-docs:subdomain → usage → astro check → astro build → `deploy-docs/`

**Fully regeneratable:** Deleting `tmp/public/` and running build regenerates everything.

## Deployment

Auto-deploys to Cloudflare Pages on push to `main`.

| Site | URL | Cloudflare Project | Deploy Command |
|------|-----|-------------------|----------------|
| Main | gastownhall.ai | `gastownhall-website` | `npm run deploy` |
| Docs | docs.gastownhall.ai | `gastown-docs` | `npm run deploy:docs` |

The main site's `_redirects` file routes `/docs/*` → `docs.gastownhall.ai/*`.

## Architecture

### Configuration

Single source of truth: `site.config.json` contains all site metadata (URLs, social links, etc.)

- `src/site.config.ts` - Re-exports JSON for Astro components with TypeScript types
- `scripts/lib/config.mjs` - Imports JSON for build scripts, also exports paths

**Dev/Prod URL Switching:** `site.docsUrl` automatically points to `http://localhost:4321/docs` in dev mode and `https://docs.gastownhall.ai` in production (via `import.meta.env.DEV`).

### Docs Generation Pipeline

`docs-fodder/gastown-docs/` → `npm run shred-docs` → `src/pages/docs/*.astro`

Do NOT edit generated docs pages directly. Edit source markdown, then regenerate.

### Build Scripts

All scripts are in `scripts/`:

- `copy-assets.mjs` - Copies src/static/ to tmp/public/
- `shred-docs.mjs` - Generates Astro pages from markdown docs
- `generate-usage.mjs` - Generates CLI Usage page from gt --help output
- `generate-llms.mjs` - Generates tmp/public/llms.txt (short LLM reference)
- `generate-llms-full.mjs` - Generates tmp/public/llms-full.txt (comprehensive LLM reference)
- `generate-og-preview.mjs` - OG card preview tool (output: tmp/og-preview.html)

### Build Script Utilities

Reusable pure functions in `scripts/lib/`:

- `config.mjs` - Site config and paths
- `files.mjs` - File discovery and path utilities
- `markdown.mjs` - Markdown parsing and HTML conversion
- `docs.mjs` - Route mapping and Astro page generation
- `llms.mjs` - Page grouping and llms.txt formatting

Tests in `scripts/lib/__tests__/`.

### Layout Hierarchy

- **BaseLayout** - Header, footer, SEO meta, JSON-LD, Plausible analytics
- **DocsLayout** - Wraps BaseLayout, adds sidebar navigation
- **BlogLayout** - Wraps BaseLayout, adds article formatting

### Static Assets

All static assets live in `src/static/` (source of truth):
- `favicon.svg`, `og-image.*` - Site icons and social images
- `robots.txt`, `_redirects` - SEO and Cloudflare config
- `styles/global.css` - Global CSS with steampunk theme
- `images/` - Site images and blog post images

These are copied to `tmp/public/` during build. Do NOT edit files in `tmp/public/` directly.

### Styling

- Global: `src/static/styles/global.css` (CSS custom properties, steampunk theme)
- Component: Astro scoped `<style>` blocks
- Design system: `docs/design_concept.json`, `docs/design-system.json`

### Path Alias

`@/*` maps to `src/*`

## Content Attribution

Gas Town documentation and Steve Yegge blog posts are copyright Steve Yegge, used with permission. MIT license applies only to website code/design.

## Git Workflow

Do NOT commit or push until explicitly asked by the user.

## Project-Specific Guidelines

- **Don't swallow errors** - no try-catch blocks in sample apps or tests; let exceptions surface to find root causes
- **No placeholder code** - production code only, not stubs or TODOs
- **Generated files are read-only** - don't edit `src/pages/docs/*.astro` or `tmp/public/` directly
- **Test files should be silent** - no console output on success; use `expect()` for assertions
- **Scratch files go in `tmp/`** - temporary/experimental files belong in the tmp/ folder
