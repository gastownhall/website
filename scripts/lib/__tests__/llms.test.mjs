import { describe, it } from 'node:test';
import assert from 'node:assert';

import {
  groupPages,
  formatPageEntry,
  renderSection,
  generateLlmsTxt,
  extractTitleFromAstro,
  extractDescriptionFromAstro,
} from '../llms.mjs';

describe('groupPages', () => {
  it('groups main pages correctly', () => {
    const pages = [
      { urlPath: '/', title: 'Home' },
      { urlPath: '/about', title: 'About' },
    ];
    const groups = groupPages(pages);

    assert.strictEqual(groups.main.length, 2);
    assert.strictEqual(groups.blog.length, 0);
    assert.strictEqual(groups.docs.length, 0);
  });

  it('groups blog pages correctly', () => {
    const pages = [
      { urlPath: '/blog/post-1', title: 'Post 1' },
      { urlPath: '/blog/post-2', title: 'Post 2' },
    ];
    const groups = groupPages(pages);

    assert.strictEqual(groups.blog.length, 2);
    assert.strictEqual(groups.main.length, 0);
  });

  it('groups docs pages correctly', () => {
    const pages = [
      { urlPath: '/docs', title: 'Docs' },
      { urlPath: '/docs/installing', title: 'Installing' },
    ];
    const groups = groupPages(pages);

    assert.strictEqual(groups.docs.length, 2);
  });

  it('groups docs subsections correctly', () => {
    const pages = [
      { urlPath: '/docs/concepts/convoy', title: 'Convoy' },
      { urlPath: '/docs/design/architecture', title: 'Architecture' },
      { urlPath: '/docs/examples/demo', title: 'Demo' },
    ];
    const groups = groupPages(pages);

    assert.strictEqual(groups['docs/concepts'].length, 1);
    assert.strictEqual(groups['docs/design'].length, 1);
    assert.strictEqual(groups['docs/examples'].length, 1);
    assert.strictEqual(groups.docs.length, 0);
  });
});

describe('formatPageEntry', () => {
  it('formats main site pages with site URL', () => {
    const page = { urlPath: '/about', title: 'About', description: null };
    const result = formatPageEntry(page);

    assert.strictEqual(result, '- [About](https://gastownhall.ai/about)');
  });

  it('formats docs pages with docs subdomain URL', () => {
    const page = {
      urlPath: '/docs/installing',
      title: 'Installing',
      description: null,
    };
    const result = formatPageEntry(page);

    assert.ok(result.includes('https://docs.gastownhall.ai/installing'));
  });

  it('formats docs root correctly', () => {
    const page = { urlPath: '/docs', title: 'Docs', description: null };
    const result = formatPageEntry(page);

    assert.ok(result.includes('https://docs.gastownhall.ai)'));
  });

  it('includes description when present', () => {
    const page = { urlPath: '/', title: 'Home', description: 'Welcome page' };
    const result = formatPageEntry(page);

    assert.ok(result.includes(': Welcome page'));
  });
});

describe('renderSection', () => {
  it('returns empty string for empty pages array', () => {
    const result = renderSection('Empty', []);
    assert.strictEqual(result, '');
  });

  it('renders section with title and entries', () => {
    const pages = [{ urlPath: '/about', title: 'About', description: null }];
    const result = renderSection('Main Pages', pages);

    assert.ok(result.includes('## Main Pages'));
    assert.ok(result.includes('- [About]'));
  });

  it('sorts pages by URL path', () => {
    const pages = [
      { urlPath: '/z-page', title: 'Z Page', description: null },
      { urlPath: '/a-page', title: 'A Page', description: null },
    ];
    const result = renderSection('Test', pages);

    const aIndex = result.indexOf('A Page');
    const zIndex = result.indexOf('Z Page');
    assert.ok(aIndex < zIndex);
  });
});

describe('generateLlmsTxt', () => {
  it('generates header with site info', () => {
    const groups = {
      main: [],
      blog: [],
      docs: [],
      'docs/concepts': [],
      'docs/design': [],
      'docs/examples': [],
    };
    const result = generateLlmsTxt(groups);

    assert.ok(result.includes('# Gas Town Hall'));
    assert.ok(result.includes('Website: https://gastownhall.ai'));
  });

  it('includes all non-empty sections', () => {
    const groups = {
      main: [{ urlPath: '/', title: 'Home', description: null }],
      blog: [{ urlPath: '/blog/post', title: 'Post', description: null }],
      docs: [],
      'docs/concepts': [],
      'docs/design': [],
      'docs/examples': [],
    };
    const result = generateLlmsTxt(groups);

    assert.ok(result.includes('## Main Pages'));
    assert.ok(result.includes('## Blog'));
    assert.ok(!result.includes('## Documentation'));
  });
});

describe('extractTitleFromAstro', () => {
  it('extracts title with equals sign', () => {
    const content = 'title = "My Page Title"';
    assert.strictEqual(extractTitleFromAstro(content), 'My Page Title');
  });

  it('extracts title with colon', () => {
    const content = 'title: "Another Title"';
    assert.strictEqual(extractTitleFromAstro(content), 'Another Title');
  });

  it('extracts title with single quotes', () => {
    const content = "title = 'Single Quote Title'";
    assert.strictEqual(extractTitleFromAstro(content), 'Single Quote Title');
  });

  it('returns null when no title found', () => {
    const content = 'const x = 5;';
    assert.strictEqual(extractTitleFromAstro(content), null);
  });
});

describe('extractDescriptionFromAstro', () => {
  it('extracts description with equals sign', () => {
    const content = 'description = "Page description here"';
    assert.strictEqual(
      extractDescriptionFromAstro(content),
      'Page description here'
    );
  });

  it('extracts description with colon', () => {
    const content = 'description: "Another description"';
    assert.strictEqual(
      extractDescriptionFromAstro(content),
      'Another description'
    );
  });

  it('returns null when no description found', () => {
    const content = 'title = "Just a title"';
    assert.strictEqual(extractDescriptionFromAstro(content), null);
  });
});
