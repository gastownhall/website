import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gastownhall.ai',
  outDir: './deploy',
  publicDir: './tmp/public',
  build: {
    assets: '_assets',
  },
  // Force light theme for code blocks since we use a light parchment background
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
