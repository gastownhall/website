#!/usr/bin/env node

/**
 * Generate CLI usage documentation from gt --help output.
 *
 * This script captures the output of `gt --help` and all subcommand help,
 * then generates an Astro page with the formatted documentation.
 *
 * Note: Uses execSync with hardcoded command names only (no user input),
 * so command injection is not a concern here.
 *
 * Usage: node scripts/generate-usage.mjs
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Output to docs subdomain source (canonical location)
const OUTPUT_FILE = join(rootDir, 'src-docs', 'pages', 'usage.astro');

/**
 * Run a command and return its output, or null if it fails.
 * Only used with hardcoded gt commands - no user input.
 */
function runCommand(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', timeout: 10000 });
  } catch {
    console.error(`  Warning: Failed to run "${cmd}"`);
    return null;
  }
}

/**
 * Parse the main help output to extract command names.
 */
function parseCommands(helpOutput) {
  const commands = [];
  const lines = helpOutput.split('\n');

  let inCommandSection = false;

  for (const line of lines) {
    // Detect section headers (they end with ':' and are followed by commands)
    if (
      line.match(
        /^(Work Management|Agent Management|Communication|Services|Workspace|Configuration|Diagnostics|Additional Commands):$/
      )
    ) {
      inCommandSection = true;
      continue;
    }

    // End of command sections
    if (line.startsWith('Flags:') || line.startsWith('Use "gt')) {
      inCommandSection = false;
      continue;
    }

    // Parse command lines (format: "  command        Description")
    if (inCommandSection) {
      const match = line.match(/^\s{2}(\w[\w-]*)\s+/);
      if (match) {
        commands.push(match[1]);
      }
    }
  }

  return commands;
}

/**
 * Escape HTML entities, control characters, and JSX-special characters.
 */
function escapeHtml(text) {
  return (
    text
      // Remove control characters (except newline, tab, carriage return)
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Escape HTML entities
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      // Escape curly braces to prevent JSX interpretation in Astro
      .replace(/\{/g, '&#123;')
      .replace(/\}/g, '&#125;')
  );
}

/**
 * Generate the Astro page content.
 * @param {string} mainHelp - The main help output
 * @param {Object} commandHelps - Help output for each command
 */
function generateAstroPage(mainHelp, commandHelps) {
  const escapedMainHelp = escapeHtml(mainHelp);

  let commandSections = '';
  for (const [cmd, help] of Object.entries(commandHelps)) {
    if (help) {
      const escapedHelp = escapeHtml(help);
      commandSections += `
  <section class="command-section">
    <h2 id="${cmd}"><code>gt ${cmd}</code></h2>
    <pre class="help-output">${escapedHelp}</pre>
  </section>
`;
    }
  }

  // Generate table of contents
  const tocItems = Object.keys(commandHelps)
    .filter((cmd) => commandHelps[cmd])
    .map(
      (cmd) => `        <li><a href="#${cmd}"><code>gt ${cmd}</code></a></li>`
    )
    .join('\n');

  return `---
import DocsLayout from '../layouts/DocsLayout.astro';
---

<DocsLayout
  title="CLI Usage"
  description="Command-line usage reference for the gt (Gas Town) CLI tool"
>
  <p class="intro">
    This page documents the <code>gt</code> command-line interface. The help output below
    is automatically generated from the installed version of Gas Town.
  </p>

  <section class="main-help">
    <h2>Overview</h2>
    <pre class="help-output">${escapedMainHelp}</pre>
  </section>

  <nav class="command-toc">
    <h2>Command Reference</h2>
    <p>Click a command to jump to its detailed help:</p>
    <ul class="toc-list">
${tocItems}
    </ul>
  </nav>

${commandSections}
</DocsLayout>

<style>
  .intro {
    font-size: 1.0625rem;
    line-height: 1.7;
    margin-bottom: 2rem;
    color: var(--color-text);
  }

  .main-help,
  .command-section {
    margin-bottom: 3rem;
  }

  .command-toc {
    background: var(--color-bg-alt);
    border: 2px solid var(--color-border);
    border-radius: 4px;
    padding: 1.5rem;
    margin-bottom: 3rem;
  }

  .command-toc h2 {
    margin-top: 0;
  }

  .command-toc p {
    margin-bottom: 1rem;
    color: var(--color-text-muted);
  }

  .toc-list {
    column-count: 3;
    column-gap: 2rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .toc-list li {
    margin-bottom: 0.5rem;
    break-inside: avoid;
  }

  .toc-list a {
    color: var(--color-accent);
    text-decoration: none;
  }

  .toc-list a:hover {
    text-decoration: underline;
  }

  .command-section h2 {
    font-family: var(--font-display);
    border-bottom: 2px solid var(--color-brass);
    padding-bottom: 0.5rem;
    scroll-margin-top: calc(var(--header-height, 80px) + 2rem);
  }

  .help-output {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 1.5rem;
    border-radius: 4px;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }

  @media (max-width: 768px) {
    .toc-list {
      column-count: 2;
    }
  }

  @media (max-width: 480px) {
    .toc-list {
      column-count: 1;
    }
  }
</style>
`;
}

async function main() {
  console.log('Generating CLI usage documentation...');

  // Check if gt is available
  const gtPath = runCommand('which gt');
  if (!gtPath) {
    console.error('Error: gt command not found in PATH');
    console.log('Skipping usage page generation.');
    return;
  }
  console.log(`  Found gt at: ${gtPath.trim()}`);

  // Get main help
  console.log('  Capturing gt --help...');
  const mainHelp = runCommand('gt --help');
  if (!mainHelp) {
    console.error('Error: Failed to get gt --help output');
    process.exit(1);
  }

  // Parse commands from main help
  const commands = parseCommands(mainHelp);
  console.log(`  Found ${commands.length} commands`);

  // Get help for each command
  const commandHelps = {};
  for (const cmd of commands) {
    process.stdout.write(`  Capturing gt ${cmd} --help...`);
    const help = runCommand(`gt ${cmd} --help`);
    commandHelps[cmd] = help;
    console.log(help ? ' ok' : ' failed');
  }

  // Generate the Astro page
  const pageContent = generateAstroPage(mainHelp, commandHelps);

  // Ensure output directory exists and write file
  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, pageContent, 'utf-8');
  console.log(`\nWritten to ${OUTPUT_FILE}`);
  console.log('Done!');
}

main();
