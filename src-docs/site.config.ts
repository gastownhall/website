/**
 * Site configuration for the docs subdomain (docs.gastownhall.ai).
 * Used by Astro components for consistent site-wide values.
 */

export const site = {
  name: 'Gas Town Docs',
  url: 'https://docs.gastownhall.ai',
  mainSiteUrl: 'https://gastownhall.ai',
  description:
    'Documentation for Gas Town, an open source orchestration layer for AI coding agents.',
  twitterHandle: '@gastownhall',
} as const;

export const social = {
  discord: 'https://discord.gg/pKsyZJ3S',
  x: 'https://x.com/gastownhall',
  github: 'https://github.com/steveyegge/gastown',
} as const;

export const analytics = {
  plausibleDomain: 'docs.gastownhall.ai',
  plausibleScript: 'https://plausible.io/js/script.js',
} as const;
