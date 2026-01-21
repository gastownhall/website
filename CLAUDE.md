# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Gas Town Hall website (gastownhall.ai) - a documentation and resource hub for Gas Town, an AI-powered development workflow orchestration system. The site is built with Astro 5.x and outputs to a `deploy/` directory.

## Build Commands

```bash
npm run dev          # Start development server
npm run build        # Type check + production build (outputs to deploy/)
npm run preview      # Preview production build
npm run shred-docs   # Regenerate docs pages from docs-fodder/gastown-docs/
npm run llms         # Regenerate public/llms.txt from site pages
npm test             # Run unit tests for shared modules
```

## Architecture

### Directory Structure

```
├── src/
│   ├── site.config.ts       # Centralized site configuration (URLs, social links, blog posts)
│   ├── pages/               # File-based routing (index.astro, docs/, blog/)
│   ├── layouts/             # BaseLayout, DocsLayout, BlogLayout
│   └── components/
│       ├── Hero.astro
│       └── icons/           # Reusable SVG icon components (DiscordIcon, XIcon, GitHubIcon)
├── scripts/
│   ├── shred-docs.mjs       # Converts docs-fodder markdown to Astro pages
│   ├── generate-llms.mjs    # Generates llms.txt from site structure
│   └── lib/                 # Shared utilities (DRY principle)
│       ├── config.mjs       # Site configuration for scripts (URLs, paths)
│       ├── files.mjs        # File system utilities (findFiles, filePathToUrlPath)
│       ├── markdown.mjs     # Markdown processing (extraction, conversion)
│       └── __tests__/       # Unit tests for shared modules
├── public/                  # Static assets (global.css, robots.txt, llms.txt, favicons)
├── docs-fodder/             # Source content (DO NOT MODIFY directly)
│   ├── gastown-docs/        # Technical documentation (25 markdown files)
│   └── steve-blog-posts/    # Blog post content (5 files)
└── deploy/                  # Build output (git-ignored)
```

### Configuration

**Site Configuration**: All URLs, social links, and metadata are centralized in two locations:
- `src/site.config.ts` - Used by Astro components
- `scripts/lib/config.mjs` - Used by build scripts

When updating URLs or social links, update both files to keep them in sync.

### Shared Modules (scripts/lib/)

The build scripts share common utilities to follow DRY:

- **config.mjs** - Site URLs, paths, and metadata
- **files.mjs** - `findFiles()` for recursive file discovery, `filePathToUrlPath()` for URL conversion
- **markdown.mjs** - `extractTitle()`, `extractDescription()`, `toSlug()`, `convertMarkdownToHtml()`

### Key Patterns

**Docs Generation**: The `shred-docs.mjs` script reads markdown from `docs-fodder/gastown-docs/`, converts to HTML, and generates `.astro` pages in `src/pages/docs/`. Run `npm run shred-docs` when gastown-docs content changes.

**Layout Hierarchy**: Pages use BaseLayout (global header/footer, SEO meta tags, Plausible analytics). Docs pages wrap with DocsLayout which adds the sidebar navigation.

**Icon Components**: SVG icons are extracted into reusable Astro components in `src/components/icons/` to avoid duplication.

**Styling**: Global styles live in `public/styles/global.css` with CSS custom properties. Component-specific styles use Astro's scoped `<style>` blocks.

**Path Alias**: `@/*` maps to `src/*` for imports.

## Testing

Tests use Node.js built-in test runner. Run with `npm test`.

Test files are in `scripts/lib/__tests__/` and cover the shared utility modules.

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
