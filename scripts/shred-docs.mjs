#!/usr/bin/env node

/**
 * Docs Shredder - Generates Astro pages from gastown-docs markdown files
 *
 * Usage: node scripts/shred-docs.mjs
 *
 * This script is idempotent - running it multiple times will simply
 * regenerate all docs pages, overwriting any existing generated files.
 */

import { readdir, readFile, writeFile, mkdir, rm } from 'fs/promises';
import { join, dirname, basename, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths relative to project root
const PROJECT_ROOT = join(__dirname, '..');
const DOCS_SOURCE = join(PROJECT_ROOT, 'docs-fodder', 'gastown-docs');
const DOCS_OUTPUT = join(PROJECT_ROOT, 'src', 'pages', 'docs');

// Files to skip (handled specially or not needed)
const SKIP_FILES = new Set(['overview.md']); // overview.md becomes docs/index.astro

/**
 * Convert a markdown filename to a URL-friendly slug
 */
function toSlug(filename) {
  return filename
    .replace(/\.md$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Extract title from markdown content (first H1 or filename)
 */
function extractTitle(content, filename) {
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  // Fallback to filename
  return filename
    .replace(/\.md$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Extract first paragraph as description
 */
function extractDescription(content) {
  // Remove frontmatter if present
  let text = content.replace(/^---[\s\S]*?---\n?/, '');
  // Remove the title
  text = text.replace(/^#\s+.+\n?/, '');
  // Find first paragraph
  const lines = text.trim().split('\n');
  const paragraphLines = [];
  for (const line of lines) {
    if (line.trim() === '') {
      if (paragraphLines.length > 0) break;
      continue;
    }
    if (line.startsWith('#') || line.startsWith('```') || line.startsWith('|')) {
      break;
    }
    paragraphLines.push(line.trim());
  }
  const description = paragraphLines.join(' ').slice(0, 160);
  return description || 'Gas Town documentation';
}

/**
 * Remove frontmatter from markdown content
 */
function removeFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n?/, '');
}

/**
 * Generate an Astro page component from markdown
 */
function generateAstroPage(content, title, description, depth = 0) {
  const layoutPath = depth === 0
    ? '../../layouts/DocsLayout.astro'
    : '../'.repeat(depth + 1) + '../layouts/DocsLayout.astro';

  // Clean the content
  let cleanContent = removeFrontmatter(content);
  // Remove the first H1 since it's rendered by the layout
  cleanContent = cleanContent.replace(/^#\s+.+\n?/, '').trim();

  // Convert markdown to basic HTML for now (simple conversion)
  // This is a minimal conversion - a proper build would use a markdown parser
  cleanContent = convertMarkdownToHtml(cleanContent);

  // Escape for JavaScript string
  const escapedContent = JSON.stringify(cleanContent);

  return `---
import DocsLayout from '${layoutPath}';

const content = ${escapedContent};
---

<DocsLayout title="${title.replace(/"/g, '\\"')}" description="${description.replace(/"/g, '\\"')}">
  <div class="markdown-content" set:html={content} />
</DocsLayout>
`;
}

/**
 * Simple markdown to HTML conversion
 */
function convertMarkdownToHtml(md) {
  let html = md;

  // Code blocks (must be before inline code)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return '<pre><code class="language-' + (lang || 'text') + '">' + escapeHtml(code.trim()) + '</code></pre>';
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headers
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Tables (basic)
  html = html.replace(/^\|(.+)\|$/gm, (match, content) => {
    const cells = content.split('|').map(c => c.trim());
    if (cells.every(c => /^[-:]+$/.test(c))) return ''; // Skip separator rows
    const cellHtml = cells.map(c => '<td>' + c + '</td>').join('');
    return '<tr>' + cellHtml + '</tr>';
  });
  html = html.replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>');

  // Paragraphs (lines not already wrapped)
  const lines = html.split('\n');
  const processed = [];
  let inPara = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inPara) {
        processed.push('</p>');
        inPara = false;
      }
      continue;
    }
    if (trimmed.startsWith('<')) {
      if (inPara) {
        processed.push('</p>');
        inPara = false;
      }
      processed.push(line);
    } else {
      if (!inPara) {
        processed.push('<p>');
        inPara = true;
      }
      processed.push(line);
    }
  }
  if (inPara) processed.push('</p>');

  return processed.join('\n');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Recursively find all markdown files
 */
async function findMarkdownFiles(dir, baseDir = dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findMarkdownFiles(fullPath, baseDir));
    } else if (entry.name.endsWith('.md')) {
      const relativePath = relative(baseDir, fullPath);
      files.push({ fullPath, relativePath });
    }
  }

  return files;
}

/**
 * Main shredder function
 */
async function shredDocs() {
  console.log('📄 Docs Shredder starting...');
  console.log(`   Source: ${relative(PROJECT_ROOT, DOCS_SOURCE)}`);
  console.log(`   Output: ${relative(PROJECT_ROOT, DOCS_OUTPUT)}`);

  // Find all markdown files
  const files = await findMarkdownFiles(DOCS_SOURCE);
  console.log(`   Found ${files.length} markdown files`);

  let generated = 0;
  let skipped = 0;

  for (const { fullPath, relativePath } of files) {
    const filename = basename(relativePath);

    if (SKIP_FILES.has(filename)) {
      console.log(`   ⏭️  Skipping ${relativePath} (handled separately)`);
      skipped++;
      continue;
    }

    // Read markdown content
    const content = await readFile(fullPath, 'utf-8');

    // Determine output path
    const dirPath = dirname(relativePath);
    const slug = toSlug(filename);
    const outputDir = dirPath === '.'
      ? DOCS_OUTPUT
      : join(DOCS_OUTPUT, dirPath);
    const outputPath = join(outputDir, `${slug}.astro`);

    // Calculate depth for import path
    const depth = dirPath === '.' ? 0 : dirPath.split('/').length;

    // Extract metadata
    const title = extractTitle(content, filename);
    const description = extractDescription(content);

    // Generate Astro page
    const astroContent = generateAstroPage(content, title, description, depth);

    // Ensure output directory exists
    await mkdir(outputDir, { recursive: true });

    // Write the file
    await writeFile(outputPath, astroContent, 'utf-8');
    console.log(`   ✅ Generated ${relative(DOCS_OUTPUT, outputPath)}`);
    generated++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Generated: ${generated} pages`);
  console.log(`   Skipped: ${skipped} files`);
  console.log('✨ Done!');
}

// Run the shredder
shredDocs().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
