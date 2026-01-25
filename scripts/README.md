# Scripts

Build scripts and utilities for the Gas Town Hall website.

## Output Types

| Type | Location | Committed? | When Generated |
|------|----------|------------|----------------|
| Usage docs | `src-docs/pages/usage/` | Yes | `npm run sync-docs` (requires gt CLI) |
| LLM files | `tmp/public/*.txt` | No | Every `build` and `dev` |
| Astro pages | `src-docs/pages/*.astro` | Yes | `npm run shred-docs` |

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

### generate-usage.mjs

Generates CLI Usage pages from `gt --help` output.

```bash
npm run usage          # Standalone (requires gt CLI)
npm run sync-docs      # Full pipeline including usage generation
```

Captures help text from `gt --help` and all subcommands, then generates Astro pages organized by category. Requires `gt` to be installed and available in PATH. Fails loudly if gt is not available.

**Output:** `src-docs/pages/usage/*.astro` and `src-docs/data/usage-commands.json`

**Note:** Usage docs are committed to the repo because Cloudflare builds don't have the `gt` CLI. The standard `build` and `build:docs` commands use the committed files.

### sync-gastown-docs.mjs

Syncs documentation from the gastown repo and rebuilds all docs.

```bash
npm run sync-docs                              # Uses default path
node scripts/sync-gastown-docs.mjs /path/to/gastown  # Custom path
```

This is the primary script for updating docs when gastown changes. It:
1. Syncs `docs/` from gastown repo to `docs-fodder/gastown-docs/`
2. Runs shred-docs to generate Astro pages
3. Runs generate-usage to create CLI usage docs (requires gt CLI)
4. Runs copy-docs to copy pages to main site
5. Copies sidebar data to main site

After running, commit the changes for CF to build.

### generate-llms.mjs

Generates `tmp/public/llms.txt` - a short LLM reference with page links for the main site.

```bash
npm run llms
```

Scans all Astro pages and creates a structured text file listing site content.

### generate-llms-full.mjs

Generates comprehensive LLM reference with content excerpts, glossary definitions, CLI reference, and use cases.

```bash
npm run llms-full         # Output to tmp/public/llms-full.txt
npm run llms-full:main    # Output to tmp/public/docs/llms-full.txt (for main site /docs/)
```

The `--main` flag changes the output path for embedding in the main site at `/docs/llms-full.txt`.

### generate-llms-docs.mjs

Generates comprehensive LLM reference including full CLI usage from `usage-commands.json`.

```bash
npm run llms:docs         # Output to tmp/public/llms.txt (for docs subdomain)
npm run llms:docs:main    # Output to tmp/public/docs/llms.txt (for main site)
```

Includes glossary definitions, concept excerpts, design docs, and **complete CLI command reference**. The `--main` flag changes the output path for embedding in the main site at `/docs/llms.txt`.

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
