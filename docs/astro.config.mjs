import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://docs.gastownhall.ai',
  outDir: '../deploy-docs',
  server: { port: 4322 },
  integrations: [
    starlight({
      title: 'Gas Town Docs',
      social: {
        github: 'https://github.com/steveyegge/gastown',
        discord: 'https://discord.gg/pKsyZJ3S',
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
