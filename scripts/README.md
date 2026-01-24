# Scripts

Build scripts and utilities for the Gas Town Hall website.

## Build Scripts

### copy-assets.mjs

Copies static assets from `src/static/` to `tmp/public/`.

```bash
npm run copy-assets
```

**Source:** `src/static/` → **Output:** `tmp/public/`

This ensures all static assets are part of the build process, making the entire site regeneratable.

### shred-docs.mjs

Generates Astro pages from markdown documentation.

```bash
# Build for /docs/ path (main site)
npm run shred-docs

# Build for subdomain (root level)
node scripts/shred-docs.mjs --subdomain
```

**Source:** `docs-fodder/gastown-docs/` → **Output:** `src/pages/docs/*.astro`

### generate-llms.mjs

Generates `tmp/public/llms.txt` - a short LLM reference with page links.

```bash
npm run llms
```

Scans all Astro pages and creates a structured text file listing site content.

### generate-llms-full.mjs

Generates `tmp/public/llms-full.txt` - a comprehensive LLM reference with content excerpts.

```bash
npm run llms-full
```

Includes glossary definitions, concept excerpts, CLI reference, and use cases.

### generate-og-preview.mjs

Preview how Open Graph cards appear on social media (Facebook, Twitter, LinkedIn, Discord).

```bash
# Preview local build (from deploy/ directory)
node scripts/generate-og-preview.mjs

# Preview local dev server (requires server running on localhost:4321)
node scripts/generate-og-preview.mjs --local

# Preview production site
node scripts/generate-og-preview.mjs --prod

# Open the preview
open tmp/og-preview.html
```

**Output:** `tmp/og-preview.html`

## Test Files

### og-tags.test.mjs

Tests for Open Graph meta tag generation.

```bash
node --test scripts/og-tags.test.mjs
```

## Library Modules (lib/)

Reusable pure functions extracted for testability:

| Module | Purpose |
|--------|---------|
| `config.mjs` | Site configuration and paths |
| `files.mjs` | File discovery and path utilities |
| `markdown.mjs` | Markdown parsing and HTML conversion |
| `docs.mjs` | Route mapping and Astro page generation |
| `llms.mjs` | Page grouping and llms.txt formatting |

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
node --test scripts/lib/__tests__/markdown.test.mjs
```

## Adding New Scripts

1. Create the script file as `.mjs` (ES modules)
2. Add shebang: `#!/usr/bin/env node`
3. Import shared utilities from `lib/`
4. Add to `package.json` scripts if frequently used
5. Document in this README
