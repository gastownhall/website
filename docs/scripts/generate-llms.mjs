#!/usr/bin/env node

/**
 * Generate llms.txt for Gas Town Docs subdomain.
 *
 * llms.txt is a standard for providing LLM-friendly site information.
 * See: https://llmstxt.org/
 *
 * Usage: node docs/scripts/generate-llms.mjs
 */

import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = join(__dirname, '..');
const CONTENT_DIR = join(DOCS_ROOT, 'src/content/docs');
const PUBLIC_DIR = join(DOCS_ROOT, 'public');
const OUTPUT_FILE = join(PUBLIC_DIR, 'llms.txt');

const DOCS_URL = 'https://docs.gastownhall.ai';

/**
 * Recursively find all markdown files in a directory
 */
async function findMarkdownFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await findMarkdownFiles(fullPath, files);
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Extract frontmatter from markdown content
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  }
  return frontmatter;
}

/**
 * Convert file path to URL path
 */
function filePathToUrlPath(filePath) {
  // Remove .md extension
  let urlPath = filePath.replace(/\.mdx?$/, '');
  // Handle index files - they map to their parent directory
  urlPath = urlPath.replace(/\/?index$/, '');
  // Handle empty path (root index.md)
  if (urlPath === '') {
    return '/';
  }
  // Ensure leading slash
  if (!urlPath.startsWith('/')) {
    urlPath = '/' + urlPath;
  }
  // Add trailing slash
  if (!urlPath.endsWith('/')) {
    urlPath += '/';
  }
  return urlPath;
}

/**
 * Group pages by section
 */
function groupPages(pages) {
  const groups = {
    main: [],
    usage: [],
    concepts: [],
    design: [],
    examples: [],
    other: [],
  };

  for (const page of pages) {
    if (page.urlPath.startsWith('/usage/')) {
      groups.usage.push(page);
    } else if (page.urlPath.startsWith('/concepts/')) {
      groups.concepts.push(page);
    } else if (page.urlPath.startsWith('/design/')) {
      groups.design.push(page);
    } else if (page.urlPath.startsWith('/examples/')) {
      groups.examples.push(page);
    } else if (page.urlPath.startsWith('/other/')) {
      groups.other.push(page);
    } else {
      groups.main.push(page);
    }
  }

  return groups;
}

/**
 * Format a page entry as markdown list item
 */
function formatPageEntry(page) {
  const url = `${DOCS_URL}${page.urlPath === '/' ? '' : page.urlPath}`;
  const suffix = page.description ? `: ${page.description}` : '';
  return `- [${page.title}](${url})${suffix}`;
}

/**
 * Render a section
 */
function renderSection(title, pages) {
  if (pages.length === 0) return '';
  const sorted = pages.sort((a, b) => a.urlPath.localeCompare(b.urlPath));
  const entries = sorted.map(formatPageEntry).join('\n');
  return `## ${title}\n\n${entries}\n\n`;
}

/**
 * Generate the llms.txt content
 */
function generateLlmsTxt(groups) {
  const lastModified = new Date().toISOString().split('T')[0];

  const header = `# Gas Town Documentation

> Comprehensive documentation for Gas Town, an open source orchestration layer for AI coding agents. This site covers installation, CLI usage, core concepts, architecture design, and examples.

## Quick Summary

- **What:** Orchestration layer for AI coding agents
- **Problem Solved:** Accountability, quality measurement, work routing, and agent coordination at scale
- **Key Concepts:** Convoys (batch work tracking), Polecats (ephemeral workers), Crew (persistent workers), Beads (atomic work units)
- **Core Principle:** GUPP - "If there is work on your Hook, YOU MUST RUN IT"

## Links

- Main Website: https://gastownhall.ai
- Documentation: ${DOCS_URL}
- GitHub: https://github.com/steveyegge/gastown

Last updated: ${lastModified}

`;

  const sections = [
    renderSection('Overview', groups.main),
    renderSection('CLI Usage', groups.usage),
    renderSection('Core Concepts', groups.concepts),
    renderSection('Architecture & Design', groups.design),
    renderSection('Examples', groups.examples),
    renderSection('Other Topics', groups.other),
  ];

  return header + sections.join('');
}

async function main() {
  console.log('Generating docs llms.txt...');

  // Ensure public directory exists
  await mkdir(PUBLIC_DIR, { recursive: true });

  // Find all markdown files
  const files = await findMarkdownFiles(CONTENT_DIR);
  console.log(`  Found ${files.length} documentation pages`);

  // Extract page info from each file
  const pages = await Promise.all(
    files.map(async (fullPath) => {
      const content = await readFile(fullPath, 'utf-8');
      const relativePath = relative(CONTENT_DIR, fullPath);
      const urlPath = filePathToUrlPath(relativePath);
      const frontmatter = extractFrontmatter(content);

      return {
        urlPath,
        title: frontmatter.title || 'Untitled',
        description: frontmatter.description || null,
      };
    })
  );

  const groups = groupPages(pages);
  const content = generateLlmsTxt(groups);

  await writeFile(OUTPUT_FILE, content, 'utf-8');
  console.log(`  Written to ${relative(DOCS_ROOT, OUTPUT_FILE)}`);
  console.log('Done!');
}

main();
