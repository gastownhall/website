#!/usr/bin/env node

/**
 * Syncs markdown from docs-fodder/gastown-docs/ to src/content/docs/
 * and adds required Starlight frontmatter.
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import {
  extractTitle,
  extractDescription,
  transformLinks,
  addFrontmatter,
  OTHER_FILES,
  FILE_MAPPINGS,
} from './lib/content.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = join(__dirname, '..');
const SOURCE_DIR = join(DOCS_ROOT, '..', 'docs-fodder', 'gastown-docs');
const DEST_DIR = join(DOCS_ROOT, 'src', 'content', 'docs');

/**
 * Process a single markdown file
 */
function processFile(sourcePath, destPath, currentDir = '') {
  const content = readFileSync(sourcePath, 'utf-8');

  const title = extractTitle(content);
  const description = extractDescription(content);
  const transformedContent = transformLinks(content, currentDir);
  const finalContent = addFrontmatter(transformedContent, title, description);

  // Ensure destination directory exists
  mkdirSync(dirname(destPath), { recursive: true });

  writeFileSync(destPath, finalContent);
  console.log(`  ${relative(DOCS_ROOT, destPath)}`);
}

/**
 * Process a directory recursively
 */
function processDirectory(sourceDir, destDir, currentDir = '') {
  const entries = readdirSync(sourceDir);

  for (const entry of entries) {
    const sourcePath = join(sourceDir, entry);
    const stat = statSync(sourcePath);

    if (stat.isDirectory()) {
      processDirectory(sourcePath, join(destDir, entry), entry);
    } else if (entry.endsWith('.md')) {
      // Determine destination filename
      let destFilename = FILE_MAPPINGS[entry] || entry.toLowerCase();
      let destPath;

      // Check if this file should go to "other" directory
      if (OTHER_FILES.includes(entry) && currentDir === '') {
        destPath = join(destDir, 'other', destFilename);
      } else {
        destPath = join(destDir, destFilename);
      }

      processFile(sourcePath, destPath, currentDir);
    }
  }
}

// Main
console.log('Syncing docs from docs-fodder to Starlight...');
console.log(`  Source: ${SOURCE_DIR}`);
console.log(`  Dest: ${DEST_DIR}`);
console.log('');

// Process all files
processDirectory(SOURCE_DIR, DEST_DIR);

console.log('');
console.log('Done!');
