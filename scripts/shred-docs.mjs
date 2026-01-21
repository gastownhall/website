#!/usr/bin/env node

/**
 * Docs Shredder - Generates Astro pages from gastown-docs markdown files.
 *
 * Usage: node scripts/shred-docs.mjs
 *
 * This script is idempotent - running it multiple times will simply
 * regenerate all docs pages, overwriting any existing generated files.
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname, basename, relative } from 'path';

import { paths } from './lib/config.mjs';
import { findFiles } from './lib/files.mjs';
import {
  extractTitle,
  extractDescription,
  toSlug,
  removeFrontmatter,
  convertMarkdownToHtml,
} from './lib/markdown.mjs';

const DOCS_SOURCE = paths.gastown;
const DOCS_OUTPUT = join(paths.pages, 'docs');
const SKIP_FILES = new Set(['overview.md']);

/**
 * Generates an Astro page component from markdown content.
 */
function generateAstroPage(content, title, description, depth) {
  const layoutPath = '../'.repeat(depth + 2) + 'layouts/DocsLayout.astro';

  let cleanContent = removeFrontmatter(content);
  cleanContent = cleanContent.replace(/^#\s+.+\n?/, '').trim();
  cleanContent = convertMarkdownToHtml(cleanContent);

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
 * Processes a single markdown file into an Astro page.
 */
async function processFile(fullPath, relativePath) {
  const filename = basename(relativePath);

  if (SKIP_FILES.has(filename)) {
    return { status: 'skipped', relativePath };
  }

  const content = await readFile(fullPath, 'utf-8');
  const dirPath = dirname(relativePath);
  const slug = toSlug(filename);
  const outputDir = dirPath === '.' ? DOCS_OUTPUT : join(DOCS_OUTPUT, dirPath);
  const outputPath = join(outputDir, `${slug}.astro`);
  const depth = dirPath === '.' ? 0 : dirPath.split('/').length;

  const title = extractTitle(content, filename);
  const description = extractDescription(content);
  const astroContent = generateAstroPage(content, title, description, depth);

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, astroContent, 'utf-8');

  return { status: 'generated', outputPath: relative(DOCS_OUTPUT, outputPath) };
}

async function shredDocs() {
  console.log('Docs Shredder starting...');
  console.log(`  Source: ${relative(paths.root, DOCS_SOURCE)}`);
  console.log(`  Output: ${relative(paths.root, DOCS_OUTPUT)}`);

  const files = await findFiles(DOCS_SOURCE, '.md');
  console.log(`  Found ${files.length} markdown files`);

  let generated = 0;
  let skipped = 0;

  for (const { fullPath, relativePath } of files) {
    const result = await processFile(fullPath, relativePath);

    if (result.status === 'skipped') {
      console.log(`  Skipping ${result.relativePath} (handled separately)`);
      skipped++;
    } else {
      console.log(`  Generated ${result.outputPath}`);
      generated++;
    }
  }

  console.log(`\nSummary:`);
  console.log(`  Generated: ${generated} pages`);
  console.log(`  Skipped: ${skipped} files`);
  console.log('Done!');
}

shredDocs();
