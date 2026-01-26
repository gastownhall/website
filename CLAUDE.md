# CLAUDE.md

Guidance for Claude Code when working with this repository.

## Quick Reference

```bash
npm run dev          # Start main site dev server (localhost:4321)
npm run dev:docs     # Start docs dev server (localhost:4322)
npm run build        # Build main site
npm run build:docs   # Build docs subdomain (from committed content)
npm run sync-docs    # Sync docs from gastown repo (requires gt CLI) - LOCAL ONLY
npm run deploy       # Build + deploy main site
npm run deploy:docs  # Build + deploy docs subdomain
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests (Playwright)
npm run check        # Run all quality checks
npm run lint         # ESLint
npm run format       # Prettier
```

## Key Architecture

**npm workspaces monorepo** with two Astro projects:
- **Main site** (`src/`) - gastownhall.ai
- **Docs site** (`docs/`) - docs.gastownhall.ai (Astro Starlight workspace)

**Documentation flow:**
```
LOCAL (when content changes, requires gt CLI):
  npm run sync-docs              (syncs content + generates usage)
  git commit + push              (commit updated content)

CLOUDFLARE (on every deploy):
  npm run build:docs             (builds from committed content)
```

**Config:** `site.config.json` is the single source of truth for main site
**Path alias:** `@/*` maps to `src/*`
**Gastown repo:** GitHub: https://github.com/steveyegge/gastown, local: ~/Code/Cache/steveyegge/gastown

### Main Site Layouts

- **BaseLayout** - Header, footer, SEO meta, JSON-LD, Plausible analytics
- **BlogLayout** - Wraps BaseLayout, adds article formatting

### Docs Site (Starlight)

Uses Astro Starlight for documentation with:
- Automatic sidebar from `docs/astro.config.mjs`
- Content Collections in `docs/src/content/docs/`
- Built-in search, TOC (dark mode disabled - uses fixed light theme)
- Custom theme in `docs/src/styles/custom.css`
- Component overrides: `PageFrame.astro` (mayor overlay), `ThemeSelect.astro` (disabled)

### Design System

Steampunk industrial theme documented in `specs/`:
- **`specs/design-system.json`** - Design tokens, component specs, CSS values
- **`specs/design-concept.json`** - Design philosophy, principles, guidelines

Both sites share the same visual language: brass accents, parchment backgrounds, Cinzel/Crimson Text typography.

### Build Script Utilities

Pure functions in `scripts/lib/`:
- `config.mjs` - Site config and paths
- `files.mjs` - File discovery
- `markdown.mjs` - Markdown utilities
- `llms.mjs` - llms.txt formatting
- `sync.mjs` - Sync utilities

Tests in `scripts/lib/__tests__/` and `docs/scripts/lib/__tests__/`. E2E tests in `e2e/`.

### LLM Reference Files

Generated during build (not committed):
- `/llms.txt` - Short reference for main site

## Guidelines

- **Docs content is committed** - Edit `docs/src/content/docs/*.md` directly, or run `npm run sync-docs` to update from gastown repo (requires gt CLI).
- **Updating docs from gastown:** Run `npm run sync-docs` locally, then commit the updated content.
- **build vs sync-docs:** `npm run build:docs` builds from committed content (no gt needed). `npm run sync-docs` regenerates content from gastown repo (requires gt CLI).
- **tmp/public/ is generated** - Don't edit. Static assets source is `src/static/` (copied during build).
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

**Pre-commit hook:** Husky runs `npm run check` on commits to main branch only. Feature branches skip checks. To bypass: `git commit --no-verify`
