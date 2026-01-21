#!/usr/bin/env node

/**
 * Generate llms.txt for Gas Town Hall
 *
 * llms.txt is a standard for providing LLM-friendly site information.
 * See: https://llmstxt.org/
 *
 * Usage: node scripts/generate-llms.mjs
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const PAGES_DIR = join(ROOT, 'src', 'pages');
const OUTPUT_FILE = join(ROOT, 'public', 'llms.txt');

const SITE_URL = 'https://gastownhall.ai';

/**
 * Recursively get all .astro files in a directory
 */
async function getAstroFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await getAstroFiles(fullPath, files);
    } else if (entry.name.endsWith('.astro')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract title and description from an Astro file's frontmatter or component props
 */
async function extractPageInfo(filePath) {
  const content = await readFile(filePath, 'utf-8');

  // Convert file path to URL path
  const relativePath = relative(PAGES_DIR, filePath);
  let urlPath = '/' + relativePath.replace(/\.astro$/, '').replace(/index$/, '').replace(/\/$/, '');
  if (urlPath === '') urlPath = '/';

  // Try to extract title from various patterns
  let title = null;
  let description = null;

  // Pattern: title="..." or title='...'
  const titleMatch = content.match(/title\s*[=:]\s*["']([^"']+)["']/);
  if (titleMatch) {
    title = titleMatch[1];
  }

  // Pattern: description="..." or description='...'
  const descMatch = content.match(/description\s*[=:]\s*["']([^"']+)["']/);
  if (descMatch) {
    description = descMatch[1];
  }

  // Fallback: generate title from URL path
  if (!title) {
    const pathParts = urlPath.split('/').filter(Boolean);
    if (pathParts.length === 0) {
      title = 'Home';
    } else {
      title = pathParts[pathParts.length - 1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }

  return { urlPath, title, description };
}

/**
 * Group pages by section
 */
function groupPages(pages) {
  const groups = {
    main: [],
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
    } else {
      groups.main.push(page);
    }
  }

  return groups;
}

/**
 * Generate the llms.txt content
 */
function generateLlmsTxt(groups) {
  const lines = [];

  // Header
  lines.push('# Gas Town Hall');
  lines.push('');
  lines.push('> Gas Town Hall is the documentation and resource hub for Gas Town, an AI-powered development workflow system. Gas Town uses autonomous agents (polecats) to execute software development tasks through a structured work tracking system (beads and molecules).');
  lines.push('');
  lines.push(`Website: ${SITE_URL}`);
  lines.push('');

  // Main pages
  if (groups.main.length > 0) {
    lines.push('## Main Pages');
    lines.push('');
    for (const page of groups.main.sort((a, b) => a.urlPath.localeCompare(b.urlPath))) {
      const url = `${SITE_URL}${page.urlPath}`;
      lines.push(`- [${page.title}](${url})${page.description ? ': ' + page.description : ''}`);
    }
    lines.push('');
  }

  // Docs index
  if (groups.docs.length > 0) {
    lines.push('## Documentation');
    lines.push('');
    for (const page of groups.docs.sort((a, b) => a.urlPath.localeCompare(b.urlPath))) {
      const url = `${SITE_URL}${page.urlPath}`;
      lines.push(`- [${page.title}](${url})${page.description ? ': ' + page.description : ''}`);
    }
    lines.push('');
  }

  // Concepts
  if (groups['docs/concepts'].length > 0) {
    lines.push('## Core Concepts');
    lines.push('');
    for (const page of groups['docs/concepts'].sort((a, b) => a.urlPath.localeCompare(b.urlPath))) {
      const url = `${SITE_URL}${page.urlPath}`;
      lines.push(`- [${page.title}](${url})${page.description ? ': ' + page.description : ''}`);
    }
    lines.push('');
  }

  // Design
  if (groups['docs/design'].length > 0) {
    lines.push('## Architecture & Design');
    lines.push('');
    for (const page of groups['docs/design'].sort((a, b) => a.urlPath.localeCompare(b.urlPath))) {
      const url = `${SITE_URL}${page.urlPath}`;
      lines.push(`- [${page.title}](${url})${page.description ? ': ' + page.description : ''}`);
    }
    lines.push('');
  }

  // Examples
  if (groups['docs/examples'].length > 0) {
    lines.push('## Examples');
    lines.push('');
    for (const page of groups['docs/examples'].sort((a, b) => a.urlPath.localeCompare(b.urlPath))) {
      const url = `${SITE_URL}${page.urlPath}`;
      lines.push(`- [${page.title}](${url})${page.description ? ': ' + page.description : ''}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  console.log('Generating llms.txt...');

  // Get all Astro pages
  const astroFiles = await getAstroFiles(PAGES_DIR);
  console.log(`Found ${astroFiles.length} pages`);

  // Extract info from each page
  const pages = await Promise.all(astroFiles.map(extractPageInfo));

  // Group pages by section
  const groups = groupPages(pages);

  // Generate content
  const content = generateLlmsTxt(groups);

  // Write to file
  await writeFile(OUTPUT_FILE, content, 'utf-8');
  console.log(`Written to ${OUTPUT_FILE}`);
}

main();
