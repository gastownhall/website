/**
 * Utilities for syncing documentation from external repositories.
 */

import { readdir } from 'fs/promises';
import { join } from 'path';

/**
 * Recursively count markdown files in a directory.
 *
 * @param {string} dir - Directory to search
 * @returns {Promise<number>} Count of .md files
 */
export async function countMarkdownFiles(dir) {
  let count = 0;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += await countMarkdownFiles(join(dir, entry.name));
    } else if (entry.name.endsWith('.md')) {
      count++;
    }
  }
  return count;
}

/**
 * Filter function for copying files, excluding OS-specific files.
 *
 * @param {string} src - Source path being copied
 * @returns {boolean} True if file should be copied
 */
export function shouldCopyFile(src) {
  return !src.includes('.DS_Store');
}
