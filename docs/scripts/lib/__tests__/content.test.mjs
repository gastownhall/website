import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractTitle,
  extractDescription,
  transformLinks,
  addFrontmatter,
  OTHER_FILES,
  FILE_MAPPINGS,
} from '../content.mjs';

describe('extractTitle', () => {
  it('extracts title from H1 heading', () => {
    const content = '# My Title\n\nSome content here.';
    assert.equal(extractTitle(content), 'My Title');
  });

  it('returns Untitled when no H1 found', () => {
    const content = 'Some content without a heading.';
    assert.equal(extractTitle(content), 'Untitled');
  });

  it('handles whitespace in title', () => {
    const content = '#   Spaced  Title  \n\nContent.';
    assert.equal(extractTitle(content), 'Spaced  Title');
  });

  it('extracts first H1 only', () => {
    const content = '# First Title\n\n## Second Title\n\n# Another H1';
    assert.equal(extractTitle(content), 'First Title');
  });
});

describe('extractDescription', () => {
  it('extracts first paragraph after title', () => {
    const content =
      '# Title\n\nThis is the description paragraph.\n\n## Next section';
    assert.equal(
      extractDescription(content),
      'This is the description paragraph.'
    );
  });

  it('returns empty string when no paragraph found', () => {
    const content = '# Title\n\n## Immediate heading';
    assert.equal(extractDescription(content), '');
  });

  it('truncates long descriptions to 200 chars', () => {
    const longText = 'A'.repeat(250);
    const content = `# Title\n\n${longText}\n\n## Next`;
    assert.equal(extractDescription(content).length, 200);
  });

  it('joins multi-line paragraphs', () => {
    const content = '# Title\n\nLine one\nline two\nline three.\n\n## Next';
    assert.equal(extractDescription(content), 'Line one line two line three.');
  });
});

describe('transformLinks', () => {
  it('transforms simple .md links to slug format', () => {
    const content = 'See [the glossary](glossary.md) for details.';
    const result = transformLinks(content, '');
    assert.equal(result, 'See [the glossary](/glossary/) for details.');
  });

  it('transforms relative parent paths', () => {
    const content =
      'See [architecture](../design/architecture.md) for details.';
    const result = transformLinks(content, 'concepts');
    assert.equal(
      result,
      'See [architecture](/design/architecture/) for details.'
    );
  });

  it('transforms overview.md to root', () => {
    const content = 'See the [overview](overview.md).';
    const result = transformLinks(content, '');
    assert.equal(result, 'See the [overview](/).');
  });

  it('transforms INSTALLING.md to /installing/', () => {
    const content = 'See [installing](INSTALLING.md).';
    const result = transformLinks(content, '');
    assert.equal(result, 'See [installing](/installing/).');
  });

  it('preserves anchors', () => {
    const content = 'See [section](glossary.md#anchor).';
    const result = transformLinks(content, '');
    // No trailing slash before anchor (correct URL format)
    assert.equal(result, 'See [section](/glossary#anchor).');
  });

  it('does not modify external links', () => {
    const content = 'See [docs](https://example.com/doc.md).';
    const result = transformLinks(content, '');
    assert.equal(result, 'See [docs](https://example.com/doc.md).');
  });

  it('maps OTHER_FILES to /other/ directory', () => {
    const content = 'See [messaging](beads-native-messaging.md).';
    const result = transformLinks(content, '');
    assert.equal(result, 'See [messaging](/other/beads-native-messaging/).');
  });

  it('handles subdirectory links', () => {
    const content = 'See [convoy](concepts/convoy.md).';
    const result = transformLinks(content, '');
    assert.equal(result, 'See [convoy](/concepts/convoy/).');
  });
});

describe('addFrontmatter', () => {
  it('adds frontmatter with title and description', () => {
    const content = '# My Title\n\nContent here.';
    const result = addFrontmatter(content, 'My Title', 'A description');
    assert.ok(result.startsWith('---\ntitle: "My Title"\n'));
    assert.ok(result.includes('description: "A description"'));
    assert.ok(result.includes('---\n\n'));
  });

  it('removes original H1 title from content', () => {
    const content = '# My Title\n\nContent here.';
    const result = addFrontmatter(content, 'My Title', 'A description');
    assert.ok(!result.includes('# My Title'));
    assert.ok(result.includes('Content here.'));
  });

  it('escapes quotes in title and description', () => {
    const content = '# Title with "quotes"\n\nContent.';
    const result = addFrontmatter(
      content,
      'Title with "quotes"',
      'Desc with "quotes"'
    );
    assert.ok(result.includes('title: "Title with \\"quotes\\""'));
    assert.ok(result.includes('description: "Desc with \\"quotes\\""'));
  });
});

describe('constants', () => {
  it('OTHER_FILES contains expected files', () => {
    assert.ok(OTHER_FILES.includes('beads-native-messaging.md'));
    assert.ok(OTHER_FILES.includes('formula-resolution.md'));
    assert.ok(OTHER_FILES.includes('mol-mall-design.md'));
    assert.ok(OTHER_FILES.includes('why-these-features.md'));
  });

  it('FILE_MAPPINGS maps overview.md to index.md', () => {
    assert.equal(FILE_MAPPINGS['overview.md'], 'index.md');
  });

  it('FILE_MAPPINGS maps INSTALLING.md to installing.md', () => {
    assert.equal(FILE_MAPPINGS['INSTALLING.md'], 'installing.md');
  });
});
