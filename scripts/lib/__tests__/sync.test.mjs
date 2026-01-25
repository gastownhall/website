import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdir, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { countMarkdownFiles, shouldCopyFile } from '../sync.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEST_DIR = join(__dirname, '__test-fixtures__', 'sync-test');

describe('countMarkdownFiles', () => {
  before(async () => {
    // Create test directory structure
    await mkdir(join(TEST_DIR, 'subdir'), { recursive: true });
    await writeFile(join(TEST_DIR, 'file1.md'), '# File 1');
    await writeFile(join(TEST_DIR, 'file2.md'), '# File 2');
    await writeFile(join(TEST_DIR, 'file3.txt'), 'Not markdown');
    await writeFile(join(TEST_DIR, 'subdir', 'nested.md'), '# Nested');
    await writeFile(join(TEST_DIR, 'subdir', 'also-not.json'), '{}');
  });

  after(async () => {
    // Clean up test directory
    await rm(TEST_DIR, { recursive: true, force: true });
  });

  it('counts markdown files in a directory', async () => {
    const count = await countMarkdownFiles(TEST_DIR);
    assert.strictEqual(count, 3);
  });

  it('counts only .md files, not other extensions', async () => {
    const count = await countMarkdownFiles(TEST_DIR);
    // Should count file1.md, file2.md, nested.md (not .txt or .json)
    assert.strictEqual(count, 3);
  });

  it('counts files in nested directories', async () => {
    const subCount = await countMarkdownFiles(join(TEST_DIR, 'subdir'));
    assert.strictEqual(subCount, 1);
  });
});

describe('shouldCopyFile', () => {
  it('returns true for regular files', () => {
    assert.strictEqual(shouldCopyFile('/path/to/file.md'), true);
    assert.strictEqual(shouldCopyFile('/path/to/file.astro'), true);
    assert.strictEqual(shouldCopyFile('/docs/overview.md'), true);
  });

  it('returns false for .DS_Store files', () => {
    assert.strictEqual(shouldCopyFile('/path/to/.DS_Store'), false);
    assert.strictEqual(shouldCopyFile('.DS_Store'), false);
    assert.strictEqual(shouldCopyFile('/docs/.DS_Store'), false);
  });

  it('returns false for paths containing .DS_Store', () => {
    assert.strictEqual(shouldCopyFile('/path/.DS_Store/file.md'), false);
  });
});
