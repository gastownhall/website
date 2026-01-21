/**
 * Markdown processing utilities for Gas Town Hall.
 * Handles extraction of metadata and conversion to HTML.
 */

const FRONTMATTER_REGEX = /^---[\s\S]*?---\n?/;
const H1_REGEX = /^#\s+(.+)$/m;

/**
 * Removes YAML frontmatter from markdown content.
 *
 * @param {string} content - Markdown content
 * @returns {string} Content without frontmatter
 */
export function removeFrontmatter(content) {
  return content.replace(FRONTMATTER_REGEX, '');
}

/**
 * Extracts the title from markdown content (first H1) or generates from filename.
 *
 * @param {string} content - Markdown content
 * @param {string} filename - Fallback filename for title generation
 * @returns {string} Extracted or generated title
 */
export function extractTitle(content, filename) {
  const h1Match = content.match(H1_REGEX);
  if (h1Match) {
    return h1Match[1].trim();
  }
  return titleFromFilename(filename);
}

/**
 * Generates a title from a filename.
 *
 * @param {string} filename - Filename to convert
 * @returns {string} Title case version of filename
 */
export function titleFromFilename(filename) {
  return filename
    .replace(/\.md$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Extracts the first paragraph as a description.
 *
 * @param {string} content - Markdown content
 * @param {number} [maxLength=160] - Maximum description length
 * @param {string} [fallback='Gas Town documentation'] - Default if no paragraph found
 * @returns {string} Description text
 */
export function extractDescription(content, maxLength = 160, fallback = 'Gas Town documentation') {
  let text = removeFrontmatter(content);
  text = text.replace(H1_REGEX, '');

  const lines = text.trim().split('\n');
  const paragraphLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') {
      if (paragraphLines.length > 0) break;
      continue;
    }
    if (trimmed.startsWith('#') || trimmed.startsWith('```') || trimmed.startsWith('|')) {
      break;
    }
    paragraphLines.push(trimmed);
  }

  const description = paragraphLines.join(' ').slice(0, maxLength);
  return description || fallback;
}

/**
 * Converts a filename to a URL-friendly slug.
 *
 * @param {string} filename - Filename to convert
 * @returns {string} URL-friendly slug
 */
export function toSlug(filename) {
  return filename
    .replace(/\.md$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Escapes HTML special characters.
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Converts markdown to HTML.
 * Handles: code blocks, inline code, headers, bold, italic, links, lists, tables.
 *
 * @param {string} md - Markdown content
 * @returns {string} HTML content
 */
export function convertMarkdownToHtml(md) {
  let html = md;

  html = convertCodeBlocks(html);
  html = convertInlineCode(html);
  html = convertHeaders(html);
  html = convertEmphasis(html);
  html = convertLinks(html);
  html = convertLists(html);
  html = convertTables(html);
  html = wrapParagraphs(html);

  return html;
}

function convertCodeBlocks(html) {
  return html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
  });
}

function convertInlineCode(html) {
  return html.replace(/`([^`]+)`/g, '<code>$1</code>');
}

function convertHeaders(html) {
  return html
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>');
}

function convertEmphasis(html) {
  return html
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function convertLinks(html) {
  return html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function convertLists(html) {
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  return html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
}

function convertTables(html) {
  html = html.replace(/^\|(.+)\|$/gm, (_, content) => {
    const cells = content.split('|').map(c => c.trim());
    if (cells.every(c => /^[-:]+$/.test(c))) return '';
    const cellHtml = cells.map(c => `<td>${c}</td>`).join('');
    return `<tr>${cellHtml}</tr>`;
  });
  return html.replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>');
}

function wrapParagraphs(html) {
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
