#!/usr/bin/env node

/**
 * Generate llms.txt for Gas Town Hall.
 *
 * llms.txt is a standard for providing LLM-friendly site information.
 * See: https://llmstxt.org/
 *
 * Usage: node scripts/generate-llms.mjs
 */

import { readFile, writeFile } from 'fs/promises';
import { join, relative } from 'path';

import { paths, site } from './lib/config.mjs';
import { findFiles, filePathToUrlPath } from './lib/files.mjs';
import { titleFromFilename } from './lib/markdown.mjs';

const OUTPUT_FILE = join(paths.public, 'llms.txt');

/**
 * Extracts title and description from an Astro file.
 */
async function extractPageInfo(fullPath, relativePath) {
  const content = await readFile(fullPath, 'utf-8');
  const urlPath = filePathToUrlPath(relativePath, '.astro');

  const titleMatch = content.match(/title\s*[=:]\s*["']([^"']+)["']/);
  const descMatch = content.match(/description\s*[=:]\s*["']([^"']+)["']/);

  const title = titleMatch
    ? titleMatch[1]
    : urlPath === '/'
      ? 'Home'
      : titleFromFilename(urlPath.split('/').pop());

  return {
    urlPath,
    title,
    description: descMatch ? descMatch[1] : null,
  };
}

/**
 * Groups pages by their section based on URL path.
 */
function groupPages(pages) {
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
 */
function formatPageEntry(page) {
  const url = `${site.url}${page.urlPath}`;
  const suffix = page.description ? `: ${page.description}` : '';
  return `- [${page.title}](${url})${suffix}`;
}

/**
 * Renders a section if it has pages.
 */
function renderSection(title, pages) {
  if (pages.length === 0) return '';

  const sorted = pages.sort((a, b) => a.urlPath.localeCompare(b.urlPath));
  const entries = sorted.map(formatPageEntry).join('\n');

  return `## ${title}\n\n${entries}\n\n`;
}

/**
 * Generates the llms.txt content.
 */
function generateLlmsTxt(groups) {
  const header = `# ${site.name}

> ${site.name} is the documentation and resource hub for Gas Town, an AI-powered development workflow system. Gas Town uses autonomous agents (polecats) to execute software development tasks through a structured work tracking system (beads and molecules).

Website: ${site.url}

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

async function main() {
  console.log('Generating llms.txt...');

  const files = await findFiles(paths.pages, '.astro');
  console.log(`  Found ${files.length} pages`);

  const pages = await Promise.all(
    files.map(({ fullPath, relativePath }) => extractPageInfo(fullPath, relativePath))
  );

  const groups = groupPages(pages);
  const content = generateLlmsTxt(groups);

  await writeFile(OUTPUT_FILE, content, 'utf-8');
  console.log(`  Written to ${relative(paths.root, OUTPUT_FILE)}`);
  console.log('Done!');
}

main();
