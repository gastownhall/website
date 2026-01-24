/**
 * LLM text generation utilities - pure functions for grouping pages
 * and formatting llms.txt content.
 */

import { site } from './config.mjs';

/**
 * @typedef {Object} PageInfo
 * @property {string} urlPath - The URL path (e.g., "/docs/overview")
 * @property {string} title - The page title
 * @property {string|null} description - The page description (optional)
 */

/**
 * Groups pages by their section based on URL path.
 *
 * @param {PageInfo[]} pages - Array of page info objects
 * @returns {Object} Object with section names as keys and arrays of pages as values
 */
export function groupPages(pages) {
  const groups = {
    main: [],
    blog: [],
    docs: [],
    'docs/concepts': [],
    'docs/design': [],
    'docs/examples': [],
  };

  for (const page of pages) {
    if (page.urlPath.startsWith('/docs/concepts')) {
      groups['docs/concepts'].push(page);
    } else if (page.urlPath.startsWith('/docs/design')) {
      groups['docs/design'].push(page);
    } else if (page.urlPath.startsWith('/docs/examples')) {
      groups['docs/examples'].push(page);
    } else if (page.urlPath.startsWith('/docs')) {
      groups.docs.push(page);
    } else if (page.urlPath.startsWith('/blog')) {
      groups.blog.push(page);
    } else {
      groups.main.push(page);
    }
  }

  return groups;
}

/**
 * Formats a page entry as a markdown list item.
 * Docs pages use the docs subdomain URL.
 *
 * @param {PageInfo} page - Page info object
 * @returns {string} Formatted markdown list item
 */
export function formatPageEntry(page) {
  let url;
  if (page.urlPath.startsWith('/docs')) {
    // Transform /docs/... to docs.gastownhall.ai/...
    const docsPath = page.urlPath.replace(/^\/docs\/?/, '/');
    url = `${site.docsUrl}${docsPath === '/' ? '' : docsPath}`;
  } else {
    url = `${site.url}${page.urlPath}`;
  }
  const suffix = page.description ? `: ${page.description}` : '';
  return `- [${page.title}](${url})${suffix}`;
}

/**
 * Renders a section if it has pages.
 *
 * @param {string} title - Section title
 * @param {PageInfo[]} pages - Array of pages in this section
 * @returns {string} Formatted section (empty string if no pages)
 */
export function renderSection(title, pages) {
  if (pages.length === 0) return '';

  const sorted = pages.sort((a, b) => a.urlPath.localeCompare(b.urlPath));
  const entries = sorted.map(formatPageEntry).join('\n');

  return `## ${title}\n\n${entries}\n\n`;
}

/**
 * Generates the llms.txt content from grouped pages.
 *
 * @param {Object} groups - Object with section names as keys and arrays of pages as values
 * @returns {string} Complete llms.txt content
 */
export function generateLlmsTxt(groups) {
  const lastModified = new Date().toISOString().split('T')[0];

  const header = `# ${site.name}

> ${site.name} is the documentation and resource hub for Gas Town, an open source orchestration layer for AI coding agents. Gas Town helps you manage multiple Claude Code instances simultaneously—tracking accountability, measuring quality, and scaling AI-assisted engineering workflows.

## Quick Summary

- **What:** Orchestration layer for AI coding agents
- **Problem Solved:** Accountability, quality measurement, work routing, and agent coordination at scale
- **Key Concepts:** Convoys (batch work tracking), Polecats (ephemeral workers), Crew (persistent workers), Beads (atomic work units)
- **Core Principle:** GUPP - "If there is work on your Hook, YOU MUST RUN IT"

## Links

- Website: ${site.url}
- Documentation: ${site.docsUrl}
- GitHub: https://github.com/steveyegge/gastown
- Full LLM content: ${site.url}/llms-full.txt

Last updated: ${lastModified}

`;

  const sections = [
    renderSection('Main Pages', groups.main),
    renderSection('Blog', groups.blog),
    renderSection('Documentation', groups.docs),
    renderSection('Core Concepts', groups['docs/concepts']),
    renderSection('Architecture & Design', groups['docs/design']),
    renderSection('Examples', groups['docs/examples']),
  ];

  return header + sections.join('');
}

/**
 * Extracts title from Astro file content using regex.
 *
 * @param {string} content - Astro file content
 * @returns {string|null} Extracted title or null
 */
export function extractTitleFromAstro(content) {
  const match = content.match(/title\s*[=:]\s*["']([^"']+)["']/);
  return match ? match[1] : null;
}

/**
 * Extracts description from Astro file content using regex.
 *
 * @param {string} content - Astro file content
 * @returns {string|null} Extracted description or null
 */
export function extractDescriptionFromAstro(content) {
  const match = content.match(/description\s*[=:]\s*["']([^"']+)["']/);
  return match ? match[1] : null;
}
