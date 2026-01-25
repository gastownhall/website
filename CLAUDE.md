# CLAUDE.md

Guidance for Claude Code when working with this repository.

## Quick Reference

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Build main site
npm run build:docs   # Build docs subdomain
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
- **Static assets source:** `src/static/` (copied to `tmp/public/` during build)
- **Scratch files:** Use `tmp/` folder

## Git Workflow

Do NOT commit or push until explicitly asked by the user.
