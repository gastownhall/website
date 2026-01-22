/**
 * Site configuration - single source of truth for URLs, social links, and metadata.
 * Used by Astro components for consistent site-wide values.
 *
 * The actual data is stored in /site.config.json (shared with build scripts).
 * This file re-exports with TypeScript types for type safety in components.
 */

import config from '../site.config.json';

// In dev mode, use local URLs; in production, use the configured URLs
const isDev = import.meta.env.DEV;

export const site = {
  ...config.site,
  // Override docsUrl in dev mode to point to local /docs path
  docsUrl: isDev ? 'http://localhost:4321/docs' : config.site.docsUrl,
};

export const social = config.social;
export const analytics = config.analytics;
export const blogPosts = config.blogPosts;
