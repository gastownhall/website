import { describe, it } from 'node:test';
import assert from 'node:assert';

import {
  buildRouteMap,
  generateAstroPage,
  getOutputSlug,
  getDirectoryDepth,
} from '../docs.mjs';

describe('buildRouteMap', () => {
  it('builds routes for root-level files', () => {
    const files = [
      { relativePath: 'overview.md' },
      { relativePath: 'installing.md' },
    ];
    const routeMap = buildRouteMap(files, false);

    assert.strictEqual(routeMap.get('overview.md'), '/docs');
    assert.strictEqual(routeMap.get('installing.md'), '/docs/installing');
  });

  it('builds routes for nested files', () => {
    const files = [
      { relativePath: 'concepts/convoy.md' },
      { relativePath: 'design/architecture.md' },
    ];
    const routeMap = buildRouteMap(files, false);

    assert.strictEqual(routeMap.get('convoy.md'), '/docs/concepts/convoy');
    assert.strictEqual(
      routeMap.get('architecture.md'),
      '/docs/design/architecture'
    );
  });

  it('handles subdomain mode without /docs prefix', () => {
    const files = [
      { relativePath: 'overview.md' },
      { relativePath: 'installing.md' },
    ];
    const routeMap = buildRouteMap(files, true);

    assert.strictEqual(routeMap.get('overview.md'), '/');
    assert.strictEqual(routeMap.get('installing.md'), '/installing');
  });

  it('handles nested files in subdomain mode', () => {
    const files = [
      { relativePath: 'concepts/convoy.md' },
      { relativePath: 'concepts/overview.md' },
    ];
    const routeMap = buildRouteMap(files, true);

    assert.strictEqual(routeMap.get('convoy.md'), '/concepts/convoy');
    assert.strictEqual(routeMap.get('overview.md'), '/concepts');
  });
});

describe('generateAstroPage', () => {
  it('generates valid Astro page content', () => {
    const content = '# Test Title\n\nSome content here.';
    const routeMap = new Map();
    const result = generateAstroPage(
      content,
      'Test Title',
      'Test description',
      0,
      routeMap,
      false
    );

    assert.ok(
      result.includes("import DocsLayout from '../../layouts/DocsLayout.astro'")
    );
    assert.ok(result.includes('title="Test Title"'));
    assert.ok(result.includes('description="Test description"'));
    assert.ok(result.includes('<div class="markdown-content"'));
  });

  it('uses correct layout path for subdomain mode', () => {
    const content = '# Test\n\nContent';
    const routeMap = new Map();
    const result = generateAstroPage(
      content,
      'Test',
      'Desc',
      0,
      routeMap,
      true
    );

    assert.ok(
      result.includes("import DocsLayout from '../layouts/DocsLayout.astro'")
    );
  });

  it('adjusts layout path based on depth', () => {
    const content = '# Test\n\nContent';
    const routeMap = new Map();
    const result = generateAstroPage(
      content,
      'Test',
      'Desc',
      2,
      routeMap,
      false
    );

    assert.ok(
      result.includes(
        "import DocsLayout from '../../../../layouts/DocsLayout.astro'"
      )
    );
  });

  it('escapes quotes in title and description', () => {
    const content = '# Test\n\nContent';
    const routeMap = new Map();
    const result = generateAstroPage(
      content,
      'Title with "quotes"',
      'Description with "quotes"',
      0,
      routeMap,
      false
    );

    assert.ok(result.includes('title="Title with \\"quotes\\""'));
    assert.ok(result.includes('description="Description with \\"quotes\\""'));
  });
});

describe('getOutputSlug', () => {
  it('converts overview to index', () => {
    assert.strictEqual(getOutputSlug('overview.md'), 'index');
  });

  it('converts filename to slug', () => {
    assert.strictEqual(getOutputSlug('My-File-Name.md'), 'my-file-name');
  });

  it('handles simple filenames', () => {
    assert.strictEqual(getOutputSlug('installing.md'), 'installing');
  });
});

describe('getDirectoryDepth', () => {
  it('returns 0 for root directory', () => {
    assert.strictEqual(getDirectoryDepth('.'), 0);
  });

  it('returns 1 for single-level directory', () => {
    assert.strictEqual(getDirectoryDepth('concepts'), 1);
  });

  it('returns 2 for two-level directory', () => {
    assert.strictEqual(getDirectoryDepth('design/nested'), 2);
  });

  it('returns correct depth for deeply nested paths', () => {
    assert.strictEqual(getDirectoryDepth('a/b/c/d'), 4);
  });
});
