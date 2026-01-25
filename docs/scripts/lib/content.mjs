/**
 * Content processing utilities for syncing docs to Starlight.
 * Pure functions extracted for testability.
 */

// Files that should go to the "other" directory
export const OTHER_FILES = [
  'beads-native-messaging.md',
  'formula-resolution.md',
  'mol-mall-design.md',
  'why-these-features.md',
];

// File name mappings
export const FILE_MAPPINGS = {
  'overview.md': 'index.md',
  'INSTALLING.md': 'installing.md',
};

/**
 * Extract title from first H1 heading
 */
export function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled';
}

/**
 * Extract description from first paragraph after the title
 */
export function extractDescription(content) {
  // Remove the title line
  const withoutTitle = content.replace(/^#\s+.+\n+/, '');
  // Find first paragraph (text before next heading or blank line followed by heading)
  const match = withoutTitle.match(/^([^#\n].+?)(?:\n\n|\n(?=#))/s);
  if (match) {
    // Clean up the description - remove newlines and trim
    return match[1].replace(/\n/g, ' ').trim().slice(0, 200);
  }
  return '';
}

/**
 * Transform markdown links from .md to Starlight slug format
 * [text](file.md) -> [text](/file/)
 * [text](../design/arch.md) -> [text](/design/arch/)
 * [text](concepts/convoy.md) -> [text](/concepts/convoy/)
 */
export function transformLinks(content, currentDir) {
  return content.replace(
    /\[([^\]]+)\]\(([^)]+\.md)(?:#([^)]+))?\)/g,
    (match, text, path, anchor) => {
      // Skip external links
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return match;
      }

      // Normalize the path
      let slug = path.replace(/\.md$/, '');

      // Handle relative paths
      if (slug.startsWith('../')) {
        slug = slug.replace(/^\.\.\//, '/');
      } else if (slug.startsWith('./')) {
        slug = '/' + currentDir + '/' + slug.replace(/^\.\//, '');
      } else if (!slug.startsWith('/')) {
        // Check if it's in a subdirectory or same directory
        if (slug.includes('/')) {
          slug = '/' + slug;
        } else {
          // Same directory or root - need to figure out the right path
          if (currentDir) {
            slug = '/' + currentDir + '/' + slug;
          } else {
            slug = '/' + slug;
          }
        }
      }

      // Apply file mappings
      if (slug === '/overview') slug = '/';
      if (slug === '/INSTALLING') slug = '/installing';

      // Handle OTHER_FILES mapping
      const filename = path.split('/').pop();
      if (OTHER_FILES.includes(filename)) {
        slug = '/other/' + filename.replace('.md', '');
      }

      // Normalize: remove double slashes, ensure trailing slash for Starlight
      slug = slug.replace(/\/+/g, '/');
      if (!slug.endsWith('/') && !anchor) {
        slug += '/';
      }

      // Add anchor if present
      if (anchor) {
        return `[${text}](${slug}#${anchor})`;
      }

      return `[${text}](${slug})`;
    }
  );
}

/**
 * Add frontmatter to markdown content
 */
export function addFrontmatter(content, title, description) {
  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
---

`;
  // Remove the original H1 title since Starlight will add it from frontmatter
  const contentWithoutTitle = content.replace(/^#\s+.+\n+/, '');
  return frontmatter + contentWithoutTitle;
}
