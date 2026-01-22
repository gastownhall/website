import { describe, it } from 'node:test';
import assert from 'node:assert';

import {
  removeFrontmatter,
  extractTitle,
  extractDescription,
  titleFromFilename,
  toSlug,
  escapeHtml,
  convertMarkdownToHtml,
} from '../markdown.mjs';

describe('removeFrontmatter', () => {
  it('removes YAML frontmatter from content', () => {
    const content = `---
title: Test
date: 2024-01-01
---
# Hello World`;
    const result = removeFrontmatter(content);
    assert.strictEqual(result, '# Hello World');
  });

  it('returns content unchanged if no frontmatter', () => {
    const content = '# Hello World';
    const result = removeFrontmatter(content);
    assert.strictEqual(result, '# Hello World');
  });
});

describe('extractTitle', () => {
  it('extracts title from first H1', () => {
    const content = '# My Title\n\nSome content';
    const result = extractTitle(content, 'fallback.md');
    assert.strictEqual(result, 'My Title');
  });

  it('falls back to filename if no H1', () => {
    const content = 'Some content without a title';
    const result = extractTitle(content, 'my-great-article.md');
    assert.strictEqual(result, 'My Great Article');
  });

  it('handles frontmatter before H1', () => {
    const content = `---
date: 2024-01-01
---
# Actual Title`;
    const result = extractTitle(content, 'fallback.md');
    assert.strictEqual(result, 'Actual Title');
  });
});

describe('extractDescription', () => {
  it('extracts first paragraph as description', () => {
    const content = `# Title

This is the first paragraph that should become the description.

This is the second paragraph.`;
    const result = extractDescription(content);
    assert.strictEqual(
      result,
      'This is the first paragraph that should become the description.'
    );
  });

  it('truncates long descriptions', () => {
    const longParagraph = 'A'.repeat(200);
    const content = `# Title\n\n${longParagraph}`;
    const result = extractDescription(content);
    assert.strictEqual(result.length, 160);
  });

  it('returns fallback for empty content', () => {
    const content = '# Title\n\n';
    const result = extractDescription(content, 160, 'Custom fallback');
    assert.strictEqual(result, 'Custom fallback');
  });

  it('stops at code blocks', () => {
    const content = `# Title

First paragraph.

\`\`\`
code block
\`\`\``;
    const result = extractDescription(content);
    assert.strictEqual(result, 'First paragraph.');
  });
});

describe('titleFromFilename', () => {
  it('converts hyphens to spaces', () => {
    const result = titleFromFilename('my-great-article.md');
    assert.strictEqual(result, 'My Great Article');
  });

  it('converts underscores to spaces', () => {
    const result = titleFromFilename('my_great_article.md');
    assert.strictEqual(result, 'My Great Article');
  });

  it('capitalizes words', () => {
    const result = titleFromFilename('hello-world.md');
    assert.strictEqual(result, 'Hello World');
  });
});

describe('toSlug', () => {
  it('converts filename to lowercase slug', () => {
    const result = toSlug('My-Great-Article.md');
    assert.strictEqual(result, 'my-great-article');
  });

  it('replaces special characters with hyphens', () => {
    const result = toSlug('Article (Draft) v2.md');
    assert.strictEqual(result, 'article-draft-v2');
  });

  it('removes leading and trailing hyphens', () => {
    const result = toSlug('--article--.md');
    assert.strictEqual(result, 'article');
  });
});

describe('escapeHtml', () => {
  it('escapes ampersands', () => {
    const result = escapeHtml('foo & bar');
    assert.strictEqual(result, 'foo &amp; bar');
  });

  it('escapes angle brackets', () => {
    const result = escapeHtml('<script>alert("xss")</script>');
    assert.strictEqual(
      result,
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('escapes quotes', () => {
    const result = escapeHtml('He said "hello"');
    assert.strictEqual(result, 'He said &quot;hello&quot;');
  });
});

describe('convertMarkdownToHtml', () => {
  it('converts headers', () => {
    const result = convertMarkdownToHtml('## Heading 2');
    assert.ok(result.includes('<h2>Heading 2</h2>'));
  });

  it('converts bold text', () => {
    const result = convertMarkdownToHtml('This is **bold** text');
    assert.ok(result.includes('<strong>bold</strong>'));
  });

  it('converts italic text', () => {
    const result = convertMarkdownToHtml('This is *italic* text');
    assert.ok(result.includes('<em>italic</em>'));
  });

  it('converts links', () => {
    const result = convertMarkdownToHtml('[link text](https://example.com)');
    assert.ok(result.includes('<a href="https://example.com">link text</a>'));
  });

  it('converts code blocks', () => {
    const result = convertMarkdownToHtml('```js\nconst x = 1;\n```');
    assert.ok(result.includes('<pre><code class="language-js">'));
    assert.ok(result.includes('const x = 1;'));
  });

  it('converts inline code', () => {
    const result = convertMarkdownToHtml('Use `npm install` to install');
    assert.ok(result.includes('<code>npm install</code>'));
  });

  it('converts unordered lists', () => {
    const result = convertMarkdownToHtml('- Item 1\n- Item 2');
    assert.ok(result.includes('<ul>'));
    assert.ok(result.includes('<li>Item 1</li>'));
    assert.ok(result.includes('<li>Item 2</li>'));
  });
});
