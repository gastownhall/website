/**
 * Docs generation utilities - pure functions for building route maps
 * and generating Astro page content from markdown.
 */

import { basename, dirname } from 'path';
import {
  toSlug,
  removeFrontmatter,
  convertMarkdownToHtml,
} from './markdown.mjs';

/**
 * Builds a map of filename → route for all markdown files.
 * Used to resolve .md links to proper routes.
 *
 * Convention: overview.md maps to its directory root (e.g., / not /overview in subdomain mode)
 *
 * @param {Array<{relativePath: string}>} files - List of files with relativePath
 * @param {boolean} subdomain - If true, routes are at root level (no /docs/ prefix)
 * @returns {Map<string, string>} Map of filename → route
 */
export function buildRouteMap(files, subdomain = false) {
  const routeMap = new Map();
  const prefix = subdomain ? '' : '/docs';

  for (const { relativePath } of files) {
    const filename = basename(relativePath);
    const dirPath = dirname(relativePath);
    let slug = toSlug(filename);

    // Convention: overview.md becomes the index page for its directory
    if (slug === 'overview') {
      slug = '';
    }

    let route;
    if (dirPath === '.') {
      route = slug ? `${prefix}/${slug}` : prefix || '/';
    } else {
      route = slug ? `${prefix}/${dirPath}/${slug}` : `${prefix}/${dirPath}`;
    }
    routeMap.set(filename, route);
  }
  return routeMap;
}

/**
 * Generates an Astro page component from markdown content.
 *
 * @param {string} content - Markdown content
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {number} depth - Directory depth for relative imports
 * @param {Map<string, string>} routeMap - Map of filename → route
 * @param {boolean} subdomain - If true, use subdomain layout path
 * @returns {string} Astro page content
 */
export function generateAstroPage(
  content,
  title,
  description,
  depth,
  routeMap,
  subdomain = false
) {
  // In subdomain mode, layouts are at ../layouts/ from pages/
  // In normal mode, layouts are at ../../layouts/ from pages/docs/
  const layoutPath = subdomain
    ? '../'.repeat(depth + 1) + 'layouts/DocsLayout.astro'
    : '../'.repeat(depth + 2) + 'layouts/DocsLayout.astro';

  let cleanContent = removeFrontmatter(content);
  cleanContent = cleanContent.replace(/^#\s+.+\n?/, '').trim();
  cleanContent = convertMarkdownToHtml(cleanContent, routeMap, subdomain);

  const escapedContent = JSON.stringify(cleanContent);
  const escapedTitle = title.replace(/"/g, '\\"');
  const escapedDesc = description.replace(/"/g, '\\"');

  return `---
import DocsLayout from '${layoutPath}';

const content = ${escapedContent};
---

<DocsLayout title="${escapedTitle}" description="${escapedDesc}">
  <div class="markdown-content" set:html={content} />
</DocsLayout>
`;
}

/**
 * Determines the output slug for a markdown file.
 * Convention: overview.md becomes index (serves as directory landing page)
 *
 * @param {string} filename - The markdown filename
 * @returns {string} The output slug
 */
export function getOutputSlug(filename) {
  const slug = toSlug(filename);
  return slug === 'overview' ? 'index' : slug;
}

/**
 * Calculates the directory depth from a relative path.
 *
 * @param {string} dirPath - Directory path (e.g., "concepts" or "design/nested")
 * @returns {number} The depth (0 for root, 1 for one level deep, etc.)
 */
export function getDirectoryDepth(dirPath) {
  return dirPath === '.' ? 0 : dirPath.split('/').length;
}
