# CLAUDE.md

Guidance for Claude Code when working with this repository.

## Quick Reference

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Build main site
npm run build:docs   # Build docs subdomain
npm run sync-docs    # Sync docs from gastown repo and rebuild
npm test             # Run tests
npm run lint         # ESLint
npm run format       # Prettier
```

## Key Architecture

- **Canonical docs:** `src-docs/pages/` (for docs.gastownhall.ai)
- **Main site docs:** `src/pages/docs/` (copied from src-docs/ with path transforms)
- **Config:** `site.config.json` is the single source of truth
- **Path alias:** `@/*` maps to `src/*`

### Layouts

- **BaseLayout** - Header, footer, SEO meta, JSON-LD, Plausible analytics
- **DocsLayout** - Wraps BaseLayout, adds sidebar navigation
- **BlogLayout** - Wraps BaseLayout, adds article formatting

### Build Script Utilities

Pure functions in `scripts/lib/`:
- `config.mjs` - Site config and paths
- `files.mjs` - File discovery
- `markdown.mjs` - Markdown → HTML conversion
- `docs.mjs` - Route mapping and Astro page generation
- `llms.mjs` - llms.txt formatting

Tests in `scripts/lib/__tests__/`.

## Guidelines

- **Generated files are read-only** - Don't edit `src-docs/pages/*.astro`, `src/pages/docs/*.astro`, or `tmp/public/`. Edit source markdown in `docs-fodder/`, then regenerate.
- **Exception: `usage.astro`** - This file IS committed because CF build has no `gt` CLI. Regenerate locally with `npm run usage` when gt changes.
- **Static assets source:** `src/static/` (copied to `tmp/public/` during build)
- **Scratch files:** Use `tmp/` folder

## Architecture Best Practices

- **TDD (Test-Driven Development)** - write the tests first; the implementation code isn't done until the tests pass.
- **DRY (Don't Repeat Yourself)** – eliminate duplicated logic by extracting shared utilities and modules.
- **Separation of Concerns** – each module should handle one distinct responsibility.
- **Single Responsibility Principle (SRP)** – every class/module/function/file should have exactly one reason to change.
- **Clear Abstractions & Contracts** – expose intent through small, stable interfaces and hide implementation details.
- **Low Coupling, High Cohesion** – keep modules self-contained, minimize cross-dependencies.
- **Scalability & Statelessness** – design components to scale horizontally and prefer stateless services when possible.
- **Observability & Testability** – build in logging, metrics, tracing, and ensure components can be unit/integration tested.
- **KISS (Keep It Simple, Sir)** - keep solutions as simple as possible.
- **YAGNI (You're Not Gonna Need It)** – avoid speculative complexity or over-engineering.
- **Don't Swallow Errors** by catching exceptions, silently filling in required but missing values or adding timeouts when something hangs unexpectedly. All of those are exceptions that should be thrown so that the errors can be seen, root causes can be found and fixes can be applied.
- **No Placeholder Code** - we're building production code here, not toys.
- **No Comments for Removed Functionality** - the source is not the place to keep history of what's changed; it's the place to implement the current requirements only.
- **Layered Architecture** - organize code into clear tiers where each layer depends only on the one(s) below it, keeping logic cleanly separated.
- **Prefer Non-Nullable Variables** when possible; use nullability sparingly.
- **Prefer Async Notifications** when possible over inefficient polling.
- **Consider First Principles** to assess your current architecture against the one you'd use if you started over from scratch.
- **Eliminate Race Conditions** that might cause dropped or corrupted data.
- **Write for Maintainability** so that the code is clear and readable and easy to maintain by future developers.
- **Arrange Project Idiomatically** for the language and framework being used, including recommended lints, static analysis tools, folder structure and gitignore entries.

## Git Workflow

Do NOT commit or push until explicitly asked by the user.
