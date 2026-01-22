/**
 * File system utilities for Gas Town Hall build scripts.
 * Handles recursive file discovery with filtering.
 */

import { readdir } from 'fs/promises';
import { join, relative } from 'path';

/**
 * Recursively finds all files matching a given extension in a directory.
 *
 * @param {string} dir - Directory to search
 * @param {string} extension - File extension to match (e.g., '.md', '.astro')
 * @param {string} [baseDir] - Base directory for relative path calculation (defaults to dir)
 * @returns {Promise<Array<{fullPath: string, relativePath: string}>>}
 */
export async function findFiles(dir, extension, baseDir = dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findFiles(fullPath, extension, baseDir)));
    } else if (entry.name.endsWith(extension)) {
      const relativePath = relative(baseDir, fullPath);
      files.push({ fullPath, relativePath });
    }
  }

  return files;
}

/**
 * Converts a file path to a URL path.
 * Handles index files and removes extensions.
 *
 * @param {string} relativePath - Relative file path from pages directory
 * @param {string} extension - File extension to remove
 * @returns {string} URL path
 */
export function filePathToUrlPath(relativePath, extension) {
  let urlPath =
    '/' +
    relativePath
      .replace(new RegExp(`\\${extension}$`), '')
      .replace(/index$/, '')
      .replace(/\/$/, '');

  return urlPath || '/';
}
