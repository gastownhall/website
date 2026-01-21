# Gas Town Hall Website

The official website for [Gas Town](https://github.com/steveyegge/gastown) - an orchestration layer for AI coding agents.

**Live site**: https://gastownhall.ai

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:4321 to view the site.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type check + production build |
| `npm run preview` | Preview production build |
| `npm run shred-docs` | Regenerate docs from source markdown |
| `npm run llms` | Regenerate llms.txt |
| `npm test` | Run unit tests |

## Project Structure

```
├── src/
│   ├── site.config.ts       # Site configuration (URLs, social links)
│   ├── pages/               # Astro pages (file-based routing)
│   ├── layouts/             # Page layouts
│   └── components/          # Reusable components
├── scripts/
│   ├── shred-docs.mjs       # Docs generation script
│   ├── generate-llms.mjs    # llms.txt generation script
│   └── lib/                 # Shared utilities
├── public/                  # Static assets
├── docs-fodder/             # Source content (don't edit directly)
│   ├── gastown-docs/        # Documentation markdown
│   └── steve-blog-posts/    # Blog post content
└── deploy/                  # Build output
```

## Documentation

Documentation pages are auto-generated from `docs-fodder/gastown-docs/`. To update:

1. Edit markdown files in `docs-fodder/gastown-docs/`
2. Run `npm run shred-docs`
3. The script generates Astro pages in `src/pages/docs/`

## Configuration

Site URLs and social links are centralized in:
- `src/site.config.ts` - for Astro components
- `scripts/lib/config.mjs` - for build scripts

## Tech Stack

- [Astro](https://astro.build/) - Static site generator
- [Plausible](https://plausible.io/) - Privacy-friendly analytics
- Node.js test runner - Unit testing

## License

See the main [Gas Town repository](https://github.com/steveyegge/gastown) for license information.
