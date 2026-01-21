import { describe, it } from 'node:test';
import assert from 'node:assert';

import { filePathToUrlPath } from '../files.mjs';

describe('filePathToUrlPath', () => {
  it('converts simple file path to URL path', () => {
    const result = filePathToUrlPath('about.astro', '.astro');
    assert.strictEqual(result, '/about');
  });

  it('handles nested paths', () => {
    const result = filePathToUrlPath('docs/getting-started.astro', '.astro');
    assert.strictEqual(result, '/docs/getting-started');
  });

  it('converts index files to directory path', () => {
    const result = filePathToUrlPath('docs/index.astro', '.astro');
    assert.strictEqual(result, '/docs');
  });

  it('converts root index to /', () => {
    const result = filePathToUrlPath('index.astro', '.astro');
    assert.strictEqual(result, '/');
  });

  it('handles deeply nested paths', () => {
    const result = filePathToUrlPath('docs/concepts/convoy.astro', '.astro');
    assert.strictEqual(result, '/docs/concepts/convoy');
  });

  it('works with .md extension', () => {
    const result = filePathToUrlPath('docs/overview.md', '.md');
    assert.strictEqual(result, '/docs/overview');
  });
});
