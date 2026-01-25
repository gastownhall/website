#!/usr/bin/env node

/**
 * Generate llms-full.txt for Gas Town Hall.
 *
 * llms-full.txt is an extended version of llms.txt with full content excerpts,
 * glossary definitions, and CLI reference. This provides LLMs with comprehensive
 * context about Gas Town.
 *
 * Usage:
 *   node scripts/generate-llms-full.mjs           # Output to tmp/public/llms-full.txt
 *   node scripts/generate-llms-full.mjs --main    # Output to tmp/public/docs/llms-full.txt (for main site)
 */

import { readFile, writeFile, readdir, mkdir } from 'fs/promises';
import { join, relative, basename, dirname } from 'path';

import { paths, site } from './lib/config.mjs';

const isMainSite = process.argv.includes('--main');
const OUTPUT_FILE = isMainSite
  ? join(paths.public, 'docs', 'llms-full.txt')
  : join(paths.public, 'llms-full.txt');
const DOCS_DIR = join(paths.root, 'docs-fodder', 'gastown-docs');

/**
 * Read a markdown file and extract its content.
 */
async function readMarkdownFile(filePath) {
  const content = await readFile(filePath, 'utf-8');
  // Remove frontmatter if present
  const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  return withoutFrontmatter.trim();
}

/**
 * Extract a content excerpt (first 500 chars of actual content).
 */
function extractExcerpt(content, maxLength = 500) {
  // Remove the first H1 heading
  const withoutH1 = content.replace(/^#\s+[^\n]+\n+/, '');
  // Get first paragraph-ish content
  const lines = withoutH1.split('\n');
  let excerpt = '';

  for (const line of lines) {
    if (line.startsWith('#')) break; // Stop at next heading
    if (line.startsWith('```')) break; // Stop at code block
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
      // Section headers - skip
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

async function main() {
  const target = isMainSite
    ? 'main site (/docs/llms-full.txt)'
    : 'root (/llms-full.txt)';
  console.log(`Generating llms-full.txt for ${target}...`);
  const lastModified = new Date().toISOString().split('T')[0];

  // Start with comprehensive header
  let output = `# ${site.name} - Complete LLM Reference

> ${site.name} is the documentation and resource hub for Gas Town, an open source orchestration layer for AI coding agents. Gas Town helps you manage multiple Claude Code instances simultaneously—tracking accountability, measuring quality, and scaling AI-assisted engineering workflows.

## Quick Summary

- **What:** Orchestration layer for AI coding agents
- **Problem Solved:** Accountability, quality measurement, work routing, and agent coordination at scale
- **Key Concepts:** Convoys (batch work tracking), Polecats (ephemeral workers), Crew (persistent workers), Beads (atomic work units)
- **Core Principle:** GUPP - "If there is work on your Hook, YOU MUST RUN IT"

## Links

- Website: ${site.url}
- Documentation: ${site.docsUrl}
- GitHub: https://github.com/steveyegge/gastown
- Short LLM reference: ${site.url}/llms.txt

Last updated: ${lastModified}

---

`;

  // Read and process glossary
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

  // Read and process overview
  console.log('  Processing overview...');
  const overviewPath = join(DOCS_DIR, 'overview.md');
  const overviewContent = await readMarkdownFile(overviewPath);

  output += `---

## Why Gas Town Exists

${extractExcerpt(overviewContent, 800)}

---

`;

  // Read and process all concept docs
  console.log('  Processing concept docs...');
  const conceptsDir = join(DOCS_DIR, 'concepts');
  const conceptFiles = await findMarkdownFiles(conceptsDir);

  output += `## Core Concepts

`;

  for (const file of conceptFiles) {
    const name = basename(file, '.md');
    const content = await readMarkdownFile(file);
    const title = content.match(/^#\s+(.+)$/m)?.[1] || name;
    const excerpt = extractExcerpt(content, 300);

    output += `### ${title}\n${excerpt}\n\n`;
  }

  // Read and process design docs
  console.log('  Processing design docs...');
  const designDir = join(DOCS_DIR, 'design');
  const designFiles = await findMarkdownFiles(designDir);

  output += `---

## Architecture & Design

`;

  for (const file of designFiles) {
    const name = basename(file, '.md');
    const content = await readMarkdownFile(file);
    const title = content.match(/^#\s+(.+)$/m)?.[1] || name;
    const excerpt = extractExcerpt(content, 300);

    output += `### ${title}\n${excerpt}\n\n`;
  }

  // Add CLI quick reference
  console.log('  Adding CLI reference...');
  output += `---

## CLI Quick Reference

### Town Management (gt)
- \`gt install [path]\` - Create town
- \`gt doctor\` - Health check
- \`gt doctor --fix\` - Auto-repair

### Convoy Management
- \`gt convoy list\` - Dashboard of active convoys
- \`gt convoy create "name" [issues...]\` - Create convoy tracking issues
- \`gt convoy status [convoy-id]\` - Show progress

### Work Assignment
- \`gt sling <bead> <rig>\` - Assign work to polecat
- \`gt hook\` - What's on my hook

### Sessions
- \`gt handoff\` - Request session cycle
- \`gt nudge <agent> "message"\` - Send message to agent
- \`gt peek <agent>\` - Check agent health

### Beads Commands (bd)
- \`bd list --status=open\` - List open issues
- \`bd ready\` - Work with no blockers
- \`bd show <id>\` - Show issue details
- \`bd create --title="..."\` - Create new issue
- \`bd close <id>\` - Close issue

### Molecule Commands
- \`bd formula list\` - Available formulas
- \`bd mol pour <proto>\` - Create molecule
- \`bd mol wisp <proto>\` - Create ephemeral wisp
- \`gt mol current\` - What should I work on next

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

*This is the complete LLM reference for Gas Town. For the short version, see ${site.url}/llms.txt*
`;

  await mkdir(dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, output, 'utf-8');
  console.log(`  Written to ${relative(paths.root, OUTPUT_FILE)}`);
  console.log('Done!');
}

main();
