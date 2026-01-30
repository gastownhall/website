import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://docs.gastownhall.ai',
  outDir: '../deploy-docs',
  server: { port: 4322 },
  integrations: [
    starlight({
      title: 'Gas Town Docs',
      favicon: '/favicon.svg',
      head: [
        // Open Graph
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://docs.gastownhall.ai/images/og-image.jpg',
          },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:width', content: '1200' },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:height', content: '630' },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:alt',
            content: 'Gas Town - AI-powered development workflows',
          },
        },
        // Twitter Card
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content: 'https://docs.gastownhall.ai/images/og-image.jpg',
          },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:site', content: '@gastownhall' },
        },
        { tag: 'meta', attrs: { name: 'twitter:creator', content: '@csells' } },
        // Plausible Analytics
        {
          tag: 'script',
          attrs: {
            defer: true,
            'data-domain': 'docs.gastownhall.ai',
            src: 'https://plausible.io/js/script.js',
          },
        },
      ],
      social: {
        github: 'https://github.com/steveyegge/gastown',
        discord: 'https://discord.gg/xHpUGUzZp2',
      },
      // Force light theme for code blocks since we use a light parchment background
      expressiveCode: {
        themes: ['github-light'],
      },
      customCss: ['./src/styles/custom.css'],
      components: {
        PageFrame: './src/components/PageFrame.astro',
        ThemeSelect: './src/components/ThemeSelect.astro',
        SiteTitle: './src/components/SiteTitle.astro',
        Header: './src/components/Header.astro',
      },
      sidebar: [
        { label: 'Overview', link: '/' },
        {
          label: 'CLI Usage',
          collapsed: true,
          autogenerate: { directory: 'usage' },
        },
        { label: 'Glossary', link: '/glossary/' },
        { label: 'Reference', link: '/reference/' },
        { label: 'Installing', link: '/installing/' },
        {
          label: 'Concepts',
          autogenerate: { directory: 'concepts' },
        },
        {
          label: 'Design',
          autogenerate: { directory: 'design' },
        },
        {
          label: 'Examples',
          autogenerate: { directory: 'examples' },
        },
        {
          label: 'Other',
          autogenerate: { directory: 'other' },
        },
      ],
    }),
  ],
});
