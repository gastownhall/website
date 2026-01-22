#!/usr/bin/env node

/**
 * Docs Shredder - Generates Astro pages from gastown-docs markdown files.
 *
 * Usage:
 *   node scripts/shred-docs.mjs              # Build for /docs/ path (main site)
 *   node scripts/shred-docs.mjs --subdomain  # Build for subdomain (root level)
 *
 * This script is idempotent - running it multiple times will simply
 * regenerate all docs pages, overwriting any existing generated files.
 *
 * ============================================================================
 * IMPORTANT: NO FILE-SPECIFIC RULES
 * ============================================================================
 * This shredder MUST remain generic and work with ANY properly-formatted
 * markdown documentation. Do NOT add special cases, mappings, or rules for
 * specific files (e.g., "if filename is X, do Y").
 *
 * If the generated output has problems (broken links, bad formatting, etc.),
 * the FIX belongs in the SOURCE DOCUMENTATION, not in this shredder.
 *
 * The shredder's job is to faithfully convert well-formed markdown to Astro
 * pages. It is NOT responsible for fixing source documentation issues.
 * ============================================================================
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname, basename, relative } from 'path';

import { paths } from './lib/config.mjs';
import { findFiles } from './lib/files.mjs';
import { extractTitle, extractDescription } from './lib/markdown.mjs';
import {
  buildRouteMap,
  generateAstroPage,
  getOutputSlug,
  getDirectoryDepth,
} from './lib/docs.mjs';

// Check for --subdomain flag
const SUBDOMAIN_MODE = process.argv.includes('--subdomain');

const DOCS_SOURCE = paths.gastown;
// In subdomain mode, output to src-docs/pages/ at root level
// In normal mode, output to src/pages/docs/
const DOCS_OUTPUT = SUBDOMAIN_MODE
  ? join(paths.root, 'src-docs', 'pages')
  : join(paths.pages, 'docs');
const SKIP_FILES = new Set();

/**
 * Processes a single markdown file into an Astro page.
 *
 * Convention: overview.md becomes index.astro (serves as directory landing page)
 *
 * @param {string} fullPath - Full path to markdown file
 * @param {string} relativePath - Relative path within docs source
 * @param {Map} routeMap - Map of filename → route
 * @param {boolean} subdomain - If true, generate for subdomain
 */
async function processFile(
  fullPath,
  relativePath,
  routeMap,
  subdomain = false
) {
  const filename = basename(relativePath);

  if (SKIP_FILES.has(filename)) {
    return { status: 'skipped', relativePath };
  }

  const content = await readFile(fullPath, 'utf-8');
  const dirPath = dirname(relativePath);
  const slug = getOutputSlug(filename);

  const outputDir = dirPath === '.' ? DOCS_OUTPUT : join(DOCS_OUTPUT, dirPath);
  const outputPath = join(outputDir, `${slug}.astro`);
  const depth = getDirectoryDepth(dirPath);

  const title = extractTitle(content, filename);
  const description = extractDescription(content);
  const astroContent = generateAstroPage(
    content,
    title,
    description,
    depth,
    routeMap,
    subdomain
  );

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, astroContent, 'utf-8');

  return { status: 'generated', outputPath: relative(DOCS_OUTPUT, outputPath) };
}

async function shredDocs() {
  console.log('Docs Shredder starting...');
  console.log(
    `  Mode: ${SUBDOMAIN_MODE ? 'subdomain (docs.gastownhall.ai)' : 'main site (/docs/)'}`
  );
  console.log(`  Source: ${relative(paths.root, DOCS_SOURCE)}`);
  console.log(`  Output: ${relative(paths.root, DOCS_OUTPUT)}`);

  const files = await findFiles(DOCS_SOURCE, '.md');
  console.log(`  Found ${files.length} markdown files`);

  // Build route map for resolving .md links
  const routeMap = buildRouteMap(files, SUBDOMAIN_MODE);

  let generated = 0;
  let skipped = 0;

  for (const { fullPath, relativePath } of files) {
    const result = await processFile(
      fullPath,
      relativePath,
      routeMap,
      SUBDOMAIN_MODE
    );

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
