# Scripts

Build scripts and utilities for the Gas Town Hall website.

## Architecture

**npm workspaces monorepo** with two Astro projects:

| Site | Location | Port | Deployed To |
|------|----------|------|-------------|
| Main site | `./` (root) | 4321 | gastownhall.ai |
| Docs site | `./docs/` (workspace) | 4322 | docs.gastownhall.ai |

Single `npm install` at root installs all dependencies. Use `npm run <script> -w docs` to run docs scripts.

**Main site scripts:** `scripts/` (this directory)
**Docs site scripts:** `docs/scripts/`

## Output Types

| Type | Location | Committed? | When Generated |
|------|----------|------------|----------------|
| Docs content | `docs/src/content/docs/` | No | `npm run sync-docs` or `npm run build:docs` |
| CLI Usage docs | `docs/src/content/docs/usage/` | No | `npm run sync-docs` (requires gt CLI) |
| LLM files (main) | `tmp/public/*.txt` | No | Every `build` and `dev` |
| Static assets | `tmp/public/` | No | Every `build` and `dev` |

## Main Site Scripts

### copy-assets.mjs

Copies static assets from `src/static/` to `tmp/public/`.

```bash
npm run copy-assets
```

**Source:** `src/static/` → **Output:** `tmp/public/`

### generate-llms.mjs

Generates `tmp/public/llms.txt` - a short LLM reference with page links for the main site.

```bash
npm run llms
```

Scans all Astro pages and creates a structured text file listing site content.

### sync-gastown-docs.mjs

Syncs documentation from the gastown repo and rebuilds all docs.

```bash
npm run sync-docs                              # Uses default path
node scripts/sync-gastown-docs.mjs /path/to/gastown  # Custom path
```

This is the primary script for updating docs when gastown changes. It:
1. Syncs `docs/` from gastown repo to `docs-fodder/gastown-docs/`
2. Runs `docs/scripts/sync-content.mjs` to generate Starlight content
3. Runs `docs/scripts/generate-usage.mjs` to create CLI usage docs (requires gt CLI)

After running, commit the changes for CF to build.

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

## Docs Site Scripts (docs/scripts/)

### sync-content.mjs

Syncs markdown from `docs-fodder/gastown-docs/` to Starlight content collection.

```bash
cd docs && npm run sync-content
```

- Adds Starlight frontmatter (title, description)
- Transforms `.md` links to Starlight slugs
- Maps `overview.md` → `index.md`
- Organizes files into correct directories

**Source:** `docs-fodder/gastown-docs/` → **Output:** `docs/src/content/docs/`

### generate-usage.mjs

Generates CLI Usage pages from `gt --help` output.

```bash
cd docs && npm run generate-usage
```

Captures help text from `gt --help` and all subcommands, then generates markdown pages organized by category. Requires `gt` to be installed and available in PATH.

**Output:** `docs/src/content/docs/usage/*.md` and `docs/src/data/usage-commands.json`

**Note:** `usage-commands.json` is committed because Cloudflare builds don't have the `gt` CLI. The markdown files are generated at build time from the committed JSON.

## Library Modules (lib/)

Reusable pure functions extracted for testability:

| Module | Purpose |
|--------|---------|
| `config.mjs` | Site configuration and paths |
| `files.mjs` | File discovery and path utilities |
| `markdown.mjs` | Markdown parsing and HTML conversion |
| `llms.mjs` | Page grouping and llms.txt formatting |
| `sync.mjs` | Gastown repo sync utilities |

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
node --test scripts/lib/__tests__/markdown.test.mjs
```

## Test Files

### og-tags.test.mjs

Tests for Open Graph meta tag generation.

```bash
node --test scripts/og-tags.test.mjs
```

## Adding New Scripts

1. Create the script file as `.mjs` (ES modules)
2. Add shebang: `#!/usr/bin/env node`
3. Import shared utilities from `lib/`
4. Add to `package.json` scripts if frequently used
5. Document in this README
