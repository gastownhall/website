/**
 * Shared configuration for Gas Town Hall website build scripts.
 *
 * Site metadata is imported from /site.config.json (shared with Astro components).
 * Path configuration is defined here for build script use.
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load shared config from JSON
const configPath = join(__dirname, '..', '..', 'site.config.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

export const paths = {
  root: join(__dirname, '..', '..'),
  src: join(__dirname, '..', '..', 'src'),
  pages: join(__dirname, '..', '..', 'src', 'pages'),
  public: join(__dirname, '..', '..', 'public'),
  docsFodder: join(__dirname, '..', '..', 'docs-fodder'),
  gastown: join(__dirname, '..', '..', 'docs-fodder', 'gastown-docs'),
  blogPosts: join(__dirname, '..', '..', 'docs-fodder', 'steve-blog-posts'),
};

export const { site, social, analytics, blogPosts } = config;
