/**
 * Astro configuration for the docs subdomain (docs.gastownhall.ai).
 *
 * This config is used when building the docs site separately for the subdomain.
 * The docs pages are generated at root level (not under /docs/).
 *
 * Usage: astro build --config astro.config.docs.mjs
 */
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://docs.gastownhall.ai',
  outDir: './deploy-docs',
  srcDir: './src-docs',
  build: {
    assets: '_assets',
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
