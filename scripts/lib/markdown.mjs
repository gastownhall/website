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
 * @param {Map<string, string>} [routeMap] - Optional map of filename → route for .md link conversion
 * @returns {string} HTML content
 */
export function convertMarkdownToHtml(md, routeMap) {
  let html = md;

  // Extract code blocks first to protect them from other conversions
  const codeBlocks = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(`<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`);
    return placeholder;
  });

  // Extract inline code to protect it
  const inlineCode = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const placeholder = `__INLINE_CODE_${inlineCode.length}__`;
    inlineCode.push(`<code>${escapeHtml(code)}</code>`);
    return placeholder;
  });

  // Now apply conversions safely
  html = convertHeaders(html);
  html = convertEmphasis(html);
  html = convertLinks(html, routeMap);
  html = convertLists(html);
  html = convertTables(html);
  html = wrapParagraphs(html);

  // Restore inline code
  inlineCode.forEach((code, i) => {
    html = html.replace(`__INLINE_CODE_${i}__`, code);
  });

  // Restore code blocks
  codeBlocks.forEach((block, i) => {
    html = html.replace(`__CODE_BLOCK_${i}__`, block);
  });

  return html;
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

/**
 * Converts markdown links to HTML, optionally transforming .md links to routes.
 *
 * @param {string} html - HTML content with markdown links
 * @param {Map<string, string>} [routeMap] - Optional map of filename → route
 * @returns {string} HTML with converted links
 */
function convertLinks(html, routeMap) {
  return html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, href) => {
    let displayText = text;

    // If link text looks like a filename (ends in .md), convert to title
    if (displayText.endsWith('.md')) {
      displayText = titleFromFilename(displayText);
    }

    // Transform .md links to doc routes if we have a route map
    if (routeMap && href.endsWith('.md')) {
      // Extract just the filename from paths like "../concepts/molecules.md"
      const filename = href.split('/').pop();
      const route = routeMap.get(filename);
      if (route) {
        return `<a href="${route}">${displayText}</a>`;
      }
      // Link to non-existent file - keep as-is but remove .md extension
      const slug = filename.replace(/\.md$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return `<a href="/docs/${slug}">${displayText}</a>`;
    }
    return `<a href="${href}">${displayText}</a>`;
  });
}

function convertLists(html) {
  // Mark ordered list items with a special marker so we can distinguish them
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<oli>$1</oli>');
  // Mark unordered list items
  html = html.replace(/^- (.+)$/gm, '<uli>$1</uli>');

  // Wrap consecutive ordered list items in <ol>
  html = html.replace(/(<oli>.*<\/oli>\n?)+/g, match => {
    const items = match.replace(/<oli>/g, '<li>').replace(/<\/oli>/g, '</li>');
    return `<ol>${items}</ol>`;
  });

  // Wrap consecutive unordered list items in <ul>
  html = html.replace(/(<uli>.*<\/uli>\n?)+/g, match => {
    const items = match.replace(/<uli>/g, '<li>').replace(/<\/uli>/g, '</li>');
    return `<ul>${items}</ul>`;
  });

  return html;
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
