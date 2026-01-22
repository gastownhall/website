/**
 * Shared configuration for Gas Town Hall website.
 * Single source of truth for URLs, social links, and site metadata.
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const paths = {
  root: join(__dirname, '..', '..'),
  src: join(__dirname, '..', '..', 'src'),
  pages: join(__dirname, '..', '..', 'src', 'pages'),
  public: join(__dirname, '..', '..', 'public'),
  docsFodder: join(__dirname, '..', '..', 'docs-fodder'),
  gastown: join(__dirname, '..', '..', 'docs-fodder', 'gastown-docs'),
  blogPosts: join(__dirname, '..', '..', 'docs-fodder', 'steve-blog-posts'),
};

export const site = {
  name: 'Gas Town Hall',
  url: 'https://gastownhall.ai',
  docsUrl: 'https://docs.gastownhall.ai',
  description: 'Gas Town Hall - Documentation and resources for Gas Town',
  twitterHandle: '@gastownhall',
};

export const social = {
  discord: 'https://discord.gg/pKsyZJ3S',
  x: 'https://x.com/gastownhall',
  github: 'https://github.com/steveyegge/gastown',
};

export const analytics = {
  plausibleDomain: 'gastownhall.ai',
  plausibleScript: 'https://plausible.io/js/script.js',
};
