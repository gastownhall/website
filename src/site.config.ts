/**
 * Site configuration - single source of truth for URLs, social links, and metadata.
 * Used by Astro components for consistent site-wide values.
 */

export const site = {
  name: 'Gas Town Hall',
  url: 'https://gastownhall.ai',
  description: 'Gas Town Hall - Documentation and resources for Gas Town',
  twitterHandle: '@gastownhall',
} as const;

export const social = {
  discord: 'https://discord.gg/pKsyZJ3S',
  x: 'https://x.com/gastownhall',
  github: 'https://github.com/steveyegge/gastown',
} as const;

export const analytics = {
  plausibleDomain: 'gastownhall.ai',
  plausibleScript: 'https://plausible.io/js/script.js',
} as const;

export const blogPosts = [
  {
    title: 'Welcome to Gas Town',
    slug: 'welcome-to-gas-town',
    description: 'The launch post introducing Gas Town - an orchestration layer for AI coding agents.',
    date: 'Jan 1, 2026',
  },
  {
    title: 'The Future of Coding Agents',
    slug: 'future-of-coding-agents',
    description: 'Predictions about IDEs, big companies, and the evolution of coding agents.',
    date: 'Jan 5, 2026',
  },
  {
    title: 'Gas Town Emergency User Manual',
    slug: 'emergency-user-manual',
    description: 'How to keep up with 100+ PRs using Gas Town and PR Sheriffs.',
    date: 'Jan 15, 2026',
  },
  {
    title: 'BAGS and the Creator Economy',
    slug: 'bags-creator-economy',
    description: 'A bizarre story about tokens, creators, and the Gas Town economy.',
    date: 'Jan 17, 2026',
  },
  {
    title: "Stevey's Birthday Blog",
    slug: 'steveys-birthday-blog',
    description: 'Reflections on Money, Time, Power, Control, and Direction in AI.',
    date: 'Jan 19, 2026',
  },
] as const;
