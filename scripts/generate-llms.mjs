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

import { paths } from './lib/config.mjs';
import { findFiles, filePathToUrlPath } from './lib/files.mjs';
import { titleFromFilename } from './lib/markdown.mjs';
import {
  groupPages,
  generateLlmsTxt,
  extractTitleFromAstro,
  extractDescriptionFromAstro,
} from './lib/llms.mjs';

const OUTPUT_FILE = join(paths.public, 'llms.txt');

/**
 * Extracts title and description from an Astro file.
 */
async function extractPageInfo(fullPath, relativePath) {
  const content = await readFile(fullPath, 'utf-8');
  const urlPath = filePathToUrlPath(relativePath, '.astro');

  const extractedTitle = extractTitleFromAstro(content);
  const title = extractedTitle
    ? extractedTitle
    : urlPath === '/'
      ? 'Home'
      : titleFromFilename(urlPath.split('/').pop());

  return {
    urlPath,
    title,
    description: extractDescriptionFromAstro(content),
  };
}

async function main() {
  console.log('Generating llms.txt...');

  const files = await findFiles(paths.pages, '.astro');
  console.log(`  Found ${files.length} pages`);

  const pages = await Promise.all(
    files.map(({ fullPath, relativePath }) =>
      extractPageInfo(fullPath, relativePath)
    )
  );

  const groups = groupPages(pages);
  const content = generateLlmsTxt(groups);

  await writeFile(OUTPUT_FILE, content, 'utf-8');
  console.log(`  Written to ${relative(paths.root, OUTPUT_FILE)}`);
  console.log('Done!');
}

main();
