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
| `npm test` | Run unit tests (66 tests) |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run deploy` | Manual deploy to Cloudflare Pages |

## Deployment

The site auto-deploys to Cloudflare Pages on push to `main`. Manual deploys can be run with `npm run deploy`.

- **Production**: https://gastownhall.ai
- **Redirects**: gastownhall.com → gastownhall.ai

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
│   ├── generate-og-preview.mjs  # OG card preview tool
│   └── lib/                 # Shared utilities and tests
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

Single source of truth: `site.config.json` contains all site metadata.

- `src/site.config.ts` - Re-exports JSON for Astro components
- `scripts/lib/config.mjs` - Imports JSON for build scripts

**Dev/Prod URL Switching:** Docs links automatically point to localhost in dev mode and docs.gastownhall.ai in production.

## Tech Stack

- [Astro](https://astro.build/) - Static site generator
- [Plausible](https://plausible.io/) - Privacy-friendly analytics
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) - Linting and formatting
- Node.js test runner - Unit testing

## License

This website is licensed under the [MIT License](LICENSE).

**Content Attribution:** All documentation content from the Gas Town repository and blog posts by Steve Yegge are copyright Steve Yegge and are reproduced on this website with permission. The MIT license applies only to the website code, design, and infrastructure - not to the Gas Town documentation content.

For the Gas Town software license, see the [Gas Town repository](https://github.com/steveyegge/gastown).
