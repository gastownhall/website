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
npm test             # Run all tests (66 tests)
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run format:check # Check formatting without writing
npm run deploy       # Manual deploy to Cloudflare Pages
```

## Deployment

Auto-deploys to Cloudflare Pages on push to `main`. Manual deploy: `npm run deploy`.

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

- `shred-docs.mjs` - Generates Astro pages from markdown docs
- `generate-llms.mjs` - Generates public/llms.txt
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

## Architecture Best Practices

- **TDD (Test-Driven Development)** - write the tests first; the implementation
  code isn't done until the tests pass.
- **DRY (Don't Repeat Yourself)** – eliminate duplicated logic by extracting
  shared utilities and modules.
- **Separation of Concerns** – each module should handle one distinct
  responsibility.
- **Single Responsibility Principle (SRP)** – every class/module/function/file
  should have exactly one reason to change.
- **Clear Abstractions & Contracts** – expose intent through small, stable
  interfaces and hide implementation details.
- **Low Coupling, High Cohesion** – keep modules self-contained, minimize
  cross-dependencies.
- **Scalability & Statelessness** – design components to scale horizontally and
  prefer stateless services when possible.
- **Observability & Testability** – build in logging, metrics, tracing, and
  ensure components can be unit/integration tested.
- **KISS (Keep It Simple, Sir)** - keep solutions as simple as possible.
- **YAGNI (You're Not Gonna Need It)** – avoid speculative complexity or
  over-engineering.
- **Don't Swallow Errors** by catching expections, silently filling in required
  but missing values or adding timeouts when something hangs unexpectedly. All
  of those are exceptions that should be thrown so that the errors can be seen,
  root causes can be found and fixes can be applied.
- **No Placeholder Code** - we're building production code here, not toys.
- **No Comments for Removed Functionality** - the source is not the place to
  keep history of what's changed; it's the place to implement the current
  requirements only.
- **Layered Architecture** - organize code into clear tiers where each layer
  depends only on the one(s) below it, keeping logic cleanly separated.
- **Prefer Non-Nullable Variables** when possible; use nullability sparingly.
- **Prefer Async Notifications** when possible over inefficient polling.
- **Consider First Principles** to assess your current architecture against the
  one you'd use if you started over from scratch.
- **Eliminate Race Condtions** that might cause dropped or corrupted data
- **Write for Maintainability** so that the code is clear and readable and easy
  to maintain by future developers.
- **Arrange Project Idiomatically** for the language and framework being used,
  including recommended lints, static analysis tools, folder structure and
  gitignore entries.
