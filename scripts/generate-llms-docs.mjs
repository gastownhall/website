#!/usr/bin/env node

/**
 * Generate llms.txt for Gas Town documentation.
 *
 * This generates a comprehensive llms.txt that includes:
 * - Full glossary definitions
 * - Concept documentation excerpts
 * - Design documentation excerpts
 * - Complete CLI usage reference
 *
 * Usage:
 *   node scripts/generate-llms-docs.mjs           # Output to tmp/public/llms.txt (for docs subdomain)
 *   node scripts/generate-llms-docs.mjs --main    # Output to tmp/public/docs/llms.txt (for main site)
 */

import { readFile, writeFile, readdir, mkdir } from 'fs/promises';
import { join, relative, basename, dirname } from 'path';

import { paths, site } from './lib/config.mjs';

const isMainSite = process.argv.includes('--main');
const OUTPUT_FILE = isMainSite
  ? join(paths.public, 'docs', 'llms.txt')
  : join(paths.public, 'llms.txt');
const DOCS_DIR = join(paths.root, 'docs-fodder', 'gastown-docs');
const USAGE_JSON = join(paths.root, 'src-docs', 'data', 'usage-commands.json');

/**
 * Read a markdown file and extract its content.
 */
async function readMarkdownFile(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  return withoutFrontmatter.trim();
}

/**
 * Extract a content excerpt.
 */
function extractExcerpt(content, maxLength = 500) {
  const withoutH1 = content.replace(/^#\s+[^\n]+\n+/, '');
  const lines = withoutH1.split('\n');
  let excerpt = '';

  for (const line of lines) {
    if (line.startsWith('#')) break;
    if (line.startsWith('```')) break;
    excerpt += line + '\n';
    if (excerpt.length >= maxLength) break;
  }

  excerpt = excerpt.trim();
  if (excerpt.length > maxLength) {
    excerpt = excerpt.slice(0, maxLength - 3) + '...';
  }

  return excerpt;
}

/**
 * Recursively find all markdown files in a directory.
 */
async function findMarkdownFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await findMarkdownFiles(fullPath, files);
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Parse glossary content into structured definitions.
 */
function parseGlossary(content) {
  const definitions = [];
  const lines = content.split('\n');
  let currentTerm = null;
  let currentDef = '';

  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (currentTerm) {
        definitions.push({ term: currentTerm, definition: currentDef.trim() });
      }
      currentTerm = line.replace('### ', '');
      currentDef = '';
    } else if (line.startsWith('## ')) {
      if (currentTerm) {
        definitions.push({ term: currentTerm, definition: currentDef.trim() });
        currentTerm = null;
        currentDef = '';
      }
    } else if (currentTerm) {
      currentDef += line + '\n';
    }
  }

  if (currentTerm) {
    definitions.push({ term: currentTerm, definition: currentDef.trim() });
  }

  return definitions;
}

/**
 * Read usage commands from JSON and format for llms.txt.
 */
async function formatUsageCommands() {
  const usageData = JSON.parse(await readFile(USAGE_JSON, 'utf-8'));
  let output = '';

  for (const category of usageData) {
    output += `### ${category.name}\n\n`;

    for (const cmd of category.commands) {
      output += `- \`gt ${cmd.name}\` - ${cmd.description}\n`;
    }

    output += '\n';
  }

  return output;
}

async function main() {
  const target = isMainSite
    ? 'main site (/docs/llms.txt)'
    : 'docs subdomain (/llms.txt)';
  console.log(`Generating llms.txt for ${target}...`);
  const lastModified = new Date().toISOString().split('T')[0];

  let output = `# ${site.name} Documentation - LLM Reference

> Complete reference for Gas Town, an open source orchestration layer for AI coding agents. Gas Town helps you manage multiple Claude Code instances simultaneously—tracking accountability, measuring quality, and scaling AI-assisted engineering workflows.

## Quick Summary

- **What:** Orchestration layer for AI coding agents
- **Problem Solved:** Accountability, quality measurement, work routing, and agent coordination at scale
- **Key Concepts:** Convoys (batch work tracking), Polecats (ephemeral workers), Crew (persistent workers), Beads (atomic work units)
- **Core Principle:** GUPP - "If there is work on your Hook, YOU MUST RUN IT"

## Links

- Website: ${site.url}
- Documentation: ${site.docsUrl}
- GitHub: https://github.com/steveyegge/gastown

Last updated: ${lastModified}

---

`;

  // Process glossary
  console.log('  Processing glossary...');
  const glossaryPath = join(DOCS_DIR, 'glossary.md');
  const glossaryContent = await readMarkdownFile(glossaryPath);
  const definitions = parseGlossary(glossaryContent);

  output += `## Key Terms and Concepts

`;

  for (const { term, definition } of definitions) {
    const shortDef = extractExcerpt(definition, 200);
    output += `### ${term}\n${shortDef}\n\n`;
  }

  // Process overview
  console.log('  Processing overview...');
  const overviewPath = join(DOCS_DIR, 'overview.md');
  const overviewContent = await readMarkdownFile(overviewPath);

  output += `---

## Why Gas Town Exists

${extractExcerpt(overviewContent, 800)}

---

`;

  // Process concept docs
  console.log('  Processing concept docs...');
  const conceptsDir = join(DOCS_DIR, 'concepts');
  const conceptFiles = await findMarkdownFiles(conceptsDir);

  output += `## Core Concepts

`;

  for (const file of conceptFiles) {
    const content = await readMarkdownFile(file);
    const title = content.match(/^#\s+(.+)$/m)?.[1] || basename(file, '.md');
    const excerpt = extractExcerpt(content, 300);

    output += `### ${title}\n${excerpt}\n\n`;
  }

  // Process design docs
  console.log('  Processing design docs...');
  const designDir = join(DOCS_DIR, 'design');
  const designFiles = await findMarkdownFiles(designDir);

  output += `---

## Architecture & Design

`;

  for (const file of designFiles) {
    const content = await readMarkdownFile(file);
    const title = content.match(/^#\s+(.+)$/m)?.[1] || basename(file, '.md');
    const excerpt = extractExcerpt(content, 300);

    output += `### ${title}\n${excerpt}\n\n`;
  }

  // Add complete CLI reference
  console.log('  Processing CLI usage...');
  output += `---

## Complete CLI Reference (gt)

`;

  output += await formatUsageCommands();

  // Add role summary
  output += `---

## Role Summary

| Role | Type | Description |
|------|------|-------------|
| Mayor | Infrastructure | Global coordinator, initiates convoys |
| Deacon | Infrastructure | Background supervisor daemon |
| Witness | Infrastructure | Per-rig polecat lifecycle manager |
| Refinery | Infrastructure | Per-rig merge queue processor |
| Polecat | Worker | Ephemeral worker with own worktree |
| Crew | Worker | Persistent worker with own clone |
| Dog | Helper | Deacon helper for infrastructure tasks |

---

## Use Cases

### Managing Multiple Coding Agents
Gas Town lets you run multiple Claude Code instances in parallel, each working on separate tasks. The Witness monitors their progress, the Refinery merges their work, and Convoys track the overall status.

### Tracking Agent Quality and Reliability
Every action is attributed to its agent (\`BD_ACTOR\`). You can compare model performance, track completion times, and identify which agents need tuning.

### Cross-Repository Coordination
Work can span multiple "rigs" (repositories). Convoys provide a unified view of work in flight across your entire town.

### A/B Testing Models
Deploy different models on similar tasks and compare outcomes with \`bd stats --group-by=model\`.

---

*For the main Gas Town Hall website, visit ${site.url}*
`;

  await mkdir(dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, output, 'utf-8');
  console.log(`  Written to ${relative(paths.root, OUTPUT_FILE)}`);
  console.log('Done!');
}

main();
