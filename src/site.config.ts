/**
 * Site configuration - single source of truth for URLs, social links, and metadata.
 * Used by Astro components for consistent site-wide values.
 */

export const site = {
  name: 'Gas Town Hall',
  url: 'https://gastownhall.ai',
  description: 'Gas Town Hall is the official documentation and community hub for Gas Town, an open source orchestration layer for AI coding agents. Track accountability, measure quality, and scale your AI-assisted engineering workflows.',
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
    title: "Stevey's Birthday Blog",
    url: 'https://steve-yegge.medium.com/steveys-birthday-blog-34f437139cb5',
    description: "My birthday's coming up, Jan 20th. Fifty-seven. As my Uncle Harold used to say in the 1980s, \"Hey it's my birthday. Keep it...",
    date: 'Jan 19',
    image: '/images/blog/steveys-birthday-blog.jpg',
  },
  {
    title: 'BAGS and the Creator Economy',
    url: 'https://steve-yegge.medium.com/bags-and-the-creator-economy-249b924a621a',
    description: "I've told this bizarre story to a few people now, including my wife Linh, who was certain it was a scam, and everyone's eyes cross...",
    date: 'Jan 17',
    image: '/images/blog/bags-creator-economy.jpg',
  },
  {
    title: 'Gas Town Emergency User Manual',
    url: 'https://steve-yegge.medium.com/gas-town-emergency-user-manual-cf0e4556d74b',
    description: "It's been a busy 12 days since I launched Gas Town. I've merged over 100 PRs from nearly 50 contributors, adding 44k lines of...",
    date: 'Jan 13',
    image: '/images/blog/emergency-user-manual.jpg',
  },
  {
    title: 'The Future of Coding Agents',
    url: 'https://steve-yegge.medium.com/the-future-of-coding-agents-e9451a84207c',
    description: 'It has been three days since I launched Gas Town! Woohoo!',
    date: 'Jan 5',
    image: '/images/blog/future-of-coding-agents.jpg',
  },
  {
    title: 'Welcome to Gas Town',
    url: 'https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04',
    description: 'Happy New Year, and Welcome to Gas Town!',
    date: 'Jan 1',
    image: '/images/blog/welcome-to-gas-town.jpg',
  },
] as const;
