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
import {
  writeFileSync,
  mkdirSync,
  readFileSync,
  existsSync,
  readdirSync,
} from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Output paths
const DOCS_DIR = join(rootDir, 'src-docs', 'pages');
const USAGE_DIR = join(DOCS_DIR, 'usage');
const USAGE_INDEX = join(DOCS_DIR, 'usage.astro');
const SIDEBAR_DATA = join(rootDir, 'src-docs', 'data', 'usage-commands.json');

// Path to local gastown repo for extracting help from source
const GASTOWN_REPO = join(process.env.HOME, 'Code/Cache/steveyegge/gastown');
const GASTOWN_CMD_DIR = join(GASTOWN_REPO, 'internal/cmd');

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
 * Check if help output is valid gt help (not from an underlying tool).
 *
 * Some gt commands use DisableFlagParsing and pass --help through to
 * underlying tools (git, bd), returning their help instead of gt's.
 * See: https://github.com/steveyegge/gastown/issues/975
 *
 * @param {string} help - The help output to check
 * @param {string} cmd - The command name (for logging)
 * @returns {boolean} True if this is valid gt help
 */
function isValidGtHelp(help, cmd) {
  if (!help) return false;

  // Man pages have doubled characters from terminal formatting (e.g., "NNAAMMEE")
  if (/\b([A-Z])\1{1}([A-Z])\2{1}/.test(help)) {
    console.warn(`  [skip] gt ${cmd}: detected man page output`);
    return false;
  }

  // Man page headers like "GIT-COMMIT(1)" or "BD-SHOW(1)"
  if (/^[A-Z]+-[A-Z]+\(\d+\)/m.test(help)) {
    console.warn(`  [skip] gt ${cmd}: detected man page header`);
    return false;
  }

  return true;
}

/**
 * Extract help text from Go source for a command.
 *
 * Parses Cobra command definitions to extract Use, Short, and Long fields,
 * then formats them to match gt's help output format.
 *
 * @param {string} cmd - The command name (e.g., "commit")
 * @returns {string|null} Formatted help text or null if not found
 */
function extractHelpFromSource(cmd) {
  if (!existsSync(GASTOWN_CMD_DIR)) {
    return null;
  }

  // Try to find the source file for this command
  const possibleFiles = [
    join(GASTOWN_CMD_DIR, `${cmd}.go`),
    join(GASTOWN_CMD_DIR, `${cmd.replace(/-/g, '_')}.go`),
  ];

  let sourceFile = null;
  for (const file of possibleFiles) {
    if (existsSync(file)) {
      sourceFile = file;
      break;
    }
  }

  // If not found by name, search all .go files for the command
  if (!sourceFile) {
    const files = readdirSync(GASTOWN_CMD_DIR).filter((f) => f.endsWith('.go'));
    for (const file of files) {
      const content = readFileSync(join(GASTOWN_CMD_DIR, file), 'utf-8');
      // Look for Use: "cmd" or Use: "cmd ..."
      if (new RegExp(`Use:\\s*["'\`]${cmd}(\\s|["'\`])`).test(content)) {
        sourceFile = join(GASTOWN_CMD_DIR, file);
        break;
      }
    }
  }

  if (!sourceFile) {
    return null;
  }

  const content = readFileSync(sourceFile, 'utf-8');

  // Find the command variable that matches this command
  // Look for patterns like: var commitCmd = &cobra.Command{
  const cmdVarPattern = new RegExp(
    `var\\s+(\\w*${cmd}\\w*Cmd|${cmd}Cmd)\\s*=\\s*&cobra\\.Command\\s*\\{`,
    'i'
  );
  const cmdMatch = content.match(cmdVarPattern);
  if (!cmdMatch) {
    return null;
  }

  // Extract the block for this command (find matching braces)
  const startIdx = cmdMatch.index + cmdMatch[0].length;
  let braceCount = 1;
  let endIdx = startIdx;
  for (let i = startIdx; i < content.length && braceCount > 0; i++) {
    if (content[i] === '{') braceCount++;
    else if (content[i] === '}') braceCount--;
    endIdx = i;
  }
  const cmdBlock = content.slice(cmdMatch.index, endIdx + 1);

  // Extract Use field
  const useMatch = cmdBlock.match(/Use:\s*["'`]([^"'`]+)["'`]/);
  const use = useMatch ? useMatch[1] : cmd;

  // Extract Short field
  const shortMatch = cmdBlock.match(/Short:\s*["'`]([^"'`]+)["'`]/);
  const short = shortMatch ? shortMatch[1] : '';

  // Extract Long field (can be multi-line with backticks)
  let long = '';
  const longBacktickMatch = cmdBlock.match(/Long:\s*`([^`]+)`/s);
  const longQuoteMatch = cmdBlock.match(/Long:\s*"([^"]+)"/);
  if (longBacktickMatch) {
    long = longBacktickMatch[1];
  } else if (longQuoteMatch) {
    long = longQuoteMatch[1].replace(/\\n/g, '\n');
  }

  // Format to match gt's help output style
  let help = '';
  if (long) {
    help += long.trim() + '\n\n';
  } else if (short) {
    help += short + '\n\n';
  }
  help += `Usage:\n  gt ${use}\n`;

  // Note about the workaround
  help += `\n[Help extracted from source - see github.com/steveyegge/gastown/issues/975]`;

  return help;
}

/**
 * Parse the main help output to extract command names grouped by category.
 * Dynamically detects category headers - no hardcoded category names.
 * @returns {Object} Map of category name to array of {name, description}
 */
function parseCommandsByCategory(helpOutput) {
  const categories = {};
  const lines = helpOutput.split('\n');

  let currentCategory = null;

  // Skip these known non-command sections
  const skipSections = ['Available Commands', 'Flags', 'Global Flags'];

  // Pattern for category headers: Title Case words followed by colon
  // Examples: "Work Management:", "Agent Management:", "Additional Commands:"
  const categoryPattern = /^([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*):$/;

  for (const line of lines) {
    // Detect section headers dynamically
    const categoryMatch = line.match(categoryPattern);
    if (categoryMatch) {
      const categoryName = categoryMatch[1];
      // Skip non-command sections
      if (skipSections.includes(categoryName)) {
        currentCategory = null;
        continue;
      }
      currentCategory = categoryName;
      categories[currentCategory] = [];
      continue;
    }

    // End of command sections
    if (line.startsWith('Flags:') || line.startsWith('Use "gt')) {
      currentCategory = null;
      continue;
    }

    // Parse command lines (format: "  command        Description")
    if (currentCategory) {
      const match = line.match(/^\s{2}(\w[\w-]*)\s{2,}(.+)$/);
      if (match) {
        categories[currentCategory].push({
          name: match[1],
          description: match[2].trim(),
        });
      }
    }
  }

  return categories;
}

/**
 * Flatten categories to a simple command list.
 */
function flattenCommands(categories) {
  const commands = [];
  for (const cmds of Object.values(categories)) {
    for (const cmd of cmds) {
      commands.push(cmd.name);
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
 * Extract version number from gt version output.
 * @param {string} versionOutput - Output from "gt version"
 * @returns {string|null} Version string (e.g., "0.5.0") or null
 */
function parseVersion(versionOutput) {
  if (!versionOutput) return null;
  // Match "gt version X.Y.Z" pattern
  const match = versionOutput.match(/version\s+(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

/**
 * Convert category name to URL slug.
 * @param {string} category - Category name (e.g., "Work Management")
 * @returns {string} URL slug (e.g., "work-management")
 */
function categoryToSlug(category) {
  return category.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Generate a category page with all commands in that category.
 * @param {string} category - Category name
 * @param {Array} commands - Array of {name, description, help} objects
 */
function generateCategoryPage(category, commands) {
  const title = `${category} Commands`;
  const desc = `CLI reference for Gas Town ${category.toLowerCase()} commands`;

  const commandSections = commands
    .map((cmd) => {
      const escapedHelp = escapeHtml(cmd.help);
      return `  <section class="command-section" id="${cmd.name}">
    <h2><code>gt ${cmd.name}</code></h2>
    <p class="command-description">${cmd.description}</p>
    <pre class="help-output">${escapedHelp}</pre>
  </section>`;
    })
    .join('\n\n');

  return `---
import DocsLayout from '../../layouts/DocsLayout.astro';
---

<DocsLayout
  title="${title}"
  description="${desc}"
>
  <p class="intro">
    This page documents the <strong>${category}</strong> commands for the <code>gt</code> CLI.
  </p>

${commandSections}
</DocsLayout>

<style>
  .intro {
    font-size: 1.0625rem;
    line-height: 1.7;
    margin-bottom: 2rem;
    color: var(--color-text);
  }

  .command-section {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--color-border);
  }

  .command-section:last-child {
    border-bottom: none;
  }

  .command-section h2 {
    margin-bottom: 0.5rem;
  }

  .command-description {
    color: var(--color-text-muted);
    margin-bottom: 1rem;
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
</style>
`;
}

/**
 * Generate the main usage index page (overview only, no command sections).
 * @param {string} mainHelp - The main help output
 * @param {string|null} version - Gas Town version string
 */
function generateUsageIndex(mainHelp, version) {
  const escapedMainHelp = escapeHtml(mainHelp);

  return `---
import DocsLayout from '../layouts/DocsLayout.astro';
---

<DocsLayout
  title="CLI Usage"
  description="Command-line usage reference for the gt (Gas Town) CLI tool"
>
  <p class="intro">
    This page documents the <code>gt</code> command-line interface. The help output below
    is automatically generated from the installed version of ${version ? `<strong>Gas Town v${version}</strong>` : 'Gas Town'}.
  </p>
  <p class="intro">
    Select a command from the sidebar to see its detailed help.
  </p>

  <section class="main-help">
    <h2>Overview</h2>
    <pre class="help-output">${escapedMainHelp}</pre>
  </section>
</DocsLayout>

<style>
  .intro {
    font-size: 1.0625rem;
    line-height: 1.7;
    margin-bottom: 1rem;
    color: var(--color-text);
  }

  .main-help {
    margin-bottom: 3rem;
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
</style>
`;
}

async function main() {
  console.log('Generating CLI usage documentation...');

  // Check if gt is available - fail loudly if not
  const gtPath = runCommand('which gt');
  if (!gtPath) {
    console.error('Error: gt command not found in PATH');
    console.error('The gt CLI is required to generate usage documentation.');
    console.error('Install gt or ensure it is in your PATH.');
    process.exit(1);
  }
  console.log(`  Found gt at: ${gtPath.trim()}`);

  // Get version
  console.log('  Capturing gt version...');
  const versionOutput = runCommand('gt version');
  const version = parseVersion(versionOutput);
  if (version) {
    console.log(`  Version: ${version}`);
  }

  // Get main help
  console.log('  Capturing gt --help...');
  const mainHelp = runCommand('gt --help');
  if (!mainHelp) {
    console.error('Error: Failed to get gt --help output');
    process.exit(1);
  }

  // Parse commands by category from main help
  const categories = parseCommandsByCategory(mainHelp);
  const commands = flattenCommands(categories);
  console.log(
    `  Found ${commands.length} commands in ${Object.keys(categories).length} categories`
  );

  // Get help for each command
  const commandHelps = {};
  const commandDescriptions = {};
  let fallbackCount = 0;

  // Build description lookup
  for (const [, cmds] of Object.entries(categories)) {
    for (const cmd of cmds) {
      commandDescriptions[cmd.name] = cmd.description;
    }
  }

  for (const cmd of commands) {
    process.stdout.write(`  Capturing gt ${cmd} --help...`);
    const help = runCommand(`gt ${cmd} --help`);
    if (isValidGtHelp(help, cmd)) {
      commandHelps[cmd] = help;
      console.log(' ok');
    } else if (help) {
      // Help returned but it's from underlying tool, not gt
      // Try to extract from source as fallback
      const sourceHelp = extractHelpFromSource(cmd);
      if (sourceHelp) {
        commandHelps[cmd] = sourceHelp;
        console.log(' ok (from source)');
        fallbackCount++;
      } else {
        commandHelps[cmd] = null;
        console.log(' failed (no fallback)');
      }
    } else {
      commandHelps[cmd] = null;
      console.log(' failed');
    }
  }
  if (fallbackCount > 0) {
    console.log(
      `  Extracted ${fallbackCount} command(s) from source (see github.com/steveyegge/gastown/issues/975)`
    );
  }

  // Ensure directories exist
  mkdirSync(USAGE_DIR, { recursive: true });
  mkdirSync(dirname(SIDEBAR_DATA), { recursive: true });

  // Generate category pages (one page per category with all commands)
  console.log('\n  Generating category pages...');
  let pageCount = 0;
  const sidebarData = [];

  for (const [category, cmds] of Object.entries(categories)) {
    // Get commands with valid help
    const validCmds = cmds
      .filter((c) => commandHelps[c.name])
      .map((c) => ({
        name: c.name,
        description: c.description,
        help: commandHelps[c.name],
      }));

    if (validCmds.length === 0) continue;

    const slug = categoryToSlug(category);
    const pageContent = generateCategoryPage(category, validCmds);
    const pagePath = join(USAGE_DIR, `${slug}.astro`);
    writeFileSync(pagePath, pageContent, 'utf-8');
    pageCount++;
    console.log(
      `    ${category} (${validCmds.length} commands) -> ${slug}.astro`
    );

    // Add to sidebar data (include commands for anchor links)
    sidebarData.push({
      name: category,
      slug: slug,
      commands: validCmds.map((c) => ({
        name: c.name,
        description: c.description,
      })),
    });
  }
  console.log(`  Generated ${pageCount} category pages`);

  writeFileSync(SIDEBAR_DATA, JSON.stringify(sidebarData, null, 2), 'utf-8');
  console.log(`  Generated sidebar data: ${SIDEBAR_DATA}`);

  // Generate usage index page
  const indexContent = generateUsageIndex(mainHelp, version);
  writeFileSync(USAGE_INDEX, indexContent, 'utf-8');
  console.log(`  Generated usage index: ${USAGE_INDEX}`);

  console.log('\nDone!');
}

main();
