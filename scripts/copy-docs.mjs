#!/usr/bin/env node

/**
 * Copies docs from src-docs/pages/ to src/pages/docs/.
 *
 * The canonical docs source is src-docs/pages/ (for the docs subdomain).
 * This script copies those files to src/pages/docs/ so the main site can
 * serve docs locally and generate llms.txt during builds.
 *
 * Transformations applied:
 * 1. Layout imports: ../layouts/ → ../../layouts/ (extra level for /docs/ nesting)
 * 2. Internal links: href="/" → href="/docs" and href="/path" → href="/docs/path"
 *
 * Usage: node scripts/copy-docs.mjs
 */

import { readdir, readFile, writeFile, mkdir, copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');
const rootDir = join(__dirname, '..');

const SRC_DIR = join(rootDir, 'src-docs', 'pages');
const DEST_DIR = join(rootDir, 'src', 'pages', 'docs');
const SIDEBAR_SRC = join(rootDir, 'src-docs', 'data', 'usage-commands.json');
const SIDEBAR_DEST = join(rootDir, 'src', 'data', 'usage-commands.json');

/**
 * Recursively finds all .astro files in a directory.
 */
async function findAstroFiles(dir, baseDir = dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findAstroFiles(fullPath, baseDir)));
    } else if (entry.name.endsWith('.astro')) {
      files.push({
        fullPath,
        relativePath: relative(baseDir, fullPath),
      });
    }
  }
  return files;
}

/**
 * Transforms file content for the main site's /docs/ path.
 */
function transformContent(content) {
  let result = content;

  // Transform layout imports: add one more ../ level
  // e.g., ../layouts/ → ../../layouts/
  //       ../../layouts/ → ../../../layouts/
  result = result.replace(/from ['"](\.\.\/)+(layouts\/)/g, (match) => {
    const levels = (match.match(/\.\.\//g) || []).length;
    return `from '${'../'.repeat(levels + 1)}layouts/`;
  });

  // Transform internal doc links in href attributes
  // href="/" → href="/docs"
  // href="/path" → href="/docs/path"
  // But NOT external links (http://, https://, #anchors, or already /docs/)
  result = result.replace(/href="(\/[^"]*?)"/g, (match, path) => {
    // Skip if already has /docs prefix or is an anchor
    if (path.startsWith('/docs') || path.startsWith('/#')) {
      return match;
    }
    // Handle root path
    if (path === '/') {
      return 'href="/docs"';
    }
    // Add /docs prefix
    return `href="/docs${path}"`;
  });

  return result;
}

async function main() {
  console.log('Copying docs for local development...');
  console.log(`  Source: ${relative(rootDir, SRC_DIR)}`);
  console.log(`  Dest:   ${relative(rootDir, DEST_DIR)}`);

  // Clean destination directory first (except keep it if it has non-generated files)
  // For safety, we'll just overwrite files rather than delete the whole directory

  const files = await findAstroFiles(SRC_DIR);
  console.log(`  Found ${files.length} files`);

  let copied = 0;
  for (const { fullPath, relativePath } of files) {
    const content = await readFile(fullPath, 'utf-8');
    const transformed = transformContent(content);

    const destPath = join(DEST_DIR, relativePath);
    const destDir = join(destPath, '..');

    await mkdir(destDir, { recursive: true });
    await writeFile(destPath, transformed, 'utf-8');
    console.log(`  Copied ${relativePath}`);
    copied++;
  }

  console.log(`\nCopied ${copied} files`);

  // Copy sidebar data if it exists
  if (existsSync(SIDEBAR_SRC)) {
    await mkdir(dirname(SIDEBAR_DEST), { recursive: true });
    await copyFile(SIDEBAR_SRC, SIDEBAR_DEST);
    console.log(`Copied sidebar data`);
  }

  console.log('Done!');
}

main();
