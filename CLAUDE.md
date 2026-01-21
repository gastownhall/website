# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gas Town Hall website (gastownhall.ai) - documentation hub for Gas Town, an orchestration layer for AI coding agents. Built with Astro 5.x, outputs to `deploy/`.

## Build Commands

```bash
npm run dev          # Start dev server (http://localhost:4321)
npm run build        # Type check + production build
npm run preview      # Preview production build
npm run shred-docs   # Regenerate docs from docs-fodder/gastown-docs/
npm run llms         # Regenerate public/llms.txt
npm test             # Run all tests
node --test scripts/lib/__tests__/markdown.test.mjs  # Run single test
npm run deploy       # Manual deploy to Cloudflare Pages
```

## Deployment

Auto-deploys to Cloudflare Pages on push to `main`. Manual deploy: `npm run deploy`.

## Architecture

### Dual Configuration (Keep in Sync)

- `src/site.config.ts` - Used by Astro components
- `scripts/lib/config.mjs` - Used by build scripts

### Docs Generation Pipeline

`docs-fodder/gastown-docs/` → `npm run shred-docs` → `src/pages/docs/*.astro`

Do NOT edit generated docs pages directly. Edit source markdown, then regenerate.

### Layout Hierarchy

- **BaseLayout** - Header, footer, SEO meta, JSON-LD, Plausible analytics
- **DocsLayout** - Wraps BaseLayout, adds sidebar navigation
- **BlogLayout** - Wraps BaseLayout, adds article formatting

### Styling

- Global: `public/styles/global.css` (CSS custom properties, steampunk theme)
- Component: Astro scoped `<style>` blocks
- Design system: `docs/design_concept.json`, `docs/design-system.json`

### Path Alias

`@/*` maps to `src/*`

## Content Attribution

Gas Town documentation and Steve Yegge blog posts are copyright Steve Yegge, used with permission. MIT license applies only to website code/design.

## Git Workflow

Do NOT commit or push until explicitly asked by the user.

## Key Principles

- **Don't swallow errors** - Let exceptions surface for debugging
- **No try-catch** unless rethrowing or cleanup before throw
- **TDD** - Tests first, implementation done when tests pass
- **DRY** - Extract shared utilities
