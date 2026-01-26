#!/usr/bin/env node

/**
 * Generate CLI usage documentation from gt --help output.
 *
 * This script captures the output of `gt --help` and all subcommand help,
 * then generates Starlight-compatible markdown files.
 *
 * REQUIRES: gt CLI must be installed and in PATH.
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
const DOCS_ROOT = join(__dirname, '..');

// Output paths
const USAGE_DIR = join(DOCS_ROOT, 'src', 'content', 'docs', 'usage');

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
    return null;
  }
}

/**
 * Check if help output is valid gt help (not from an underlying tool).
 */
function isValidGtHelp(help, cmd) {
  if (!help) return false;

  // Man pages have doubled characters from terminal formatting
  if (/\b([A-Z])\1{1}([A-Z])\2{1}/.test(help)) {
    console.warn(`  [skip] gt ${cmd}: detected man page output`);
    return false;
  }

  // Man page headers like "GIT-COMMIT(1)"
  if (/^[A-Z]+-[A-Z]+\(\d+\)/m.test(help)) {
    console.warn(`  [skip] gt ${cmd}: detected man page header`);
    return false;
  }

  return true;
}

/**
 * Extract help text from Go source for a command.
 */
function extractHelpFromSource(cmd) {
  if (!existsSync(GASTOWN_CMD_DIR)) {
    return null;
  }

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

  if (!sourceFile) {
    const files = readdirSync(GASTOWN_CMD_DIR).filter((f) => f.endsWith('.go'));
    for (const file of files) {
      const content = readFileSync(join(GASTOWN_CMD_DIR, file), 'utf-8');
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

  const cmdVarPattern = new RegExp(
    `var\\s+(\\w*${cmd}\\w*Cmd|${cmd}Cmd)\\s*=\\s*&cobra\\.Command\\s*\\{`,
    'i'
  );
  const cmdMatch = content.match(cmdVarPattern);
  if (!cmdMatch) {
    return null;
  }

  const startIdx = cmdMatch.index + cmdMatch[0].length;
  let braceCount = 1;
  let endIdx = startIdx;
  for (let i = startIdx; i < content.length && braceCount > 0; i++) {
    if (content[i] === '{') braceCount++;
    else if (content[i] === '}') braceCount--;
    endIdx = i;
  }
  const cmdBlock = content.slice(cmdMatch.index, endIdx + 1);

  const useMatch = cmdBlock.match(/Use:\s*["'`]([^"'`]+)["'`]/);
  const use = useMatch ? useMatch[1] : cmd;

  const shortMatch = cmdBlock.match(/Short:\s*["'`]([^"'`]+)["'`]/);
  const short = shortMatch ? shortMatch[1] : '';

  let long = '';
  const longBacktickMatch = cmdBlock.match(/Long:\s*`([^`]+)`/s);
  const longQuoteMatch = cmdBlock.match(/Long:\s*"([^"]+)"/);
  if (longBacktickMatch) {
    long = longBacktickMatch[1];
  } else if (longQuoteMatch) {
    long = longQuoteMatch[1].replace(/\\n/g, '\n');
  }

  let help = '';
  if (long) {
    help += long.trim() + '\n\n';
  } else if (short) {
    help += short + '\n\n';
  }
  help += `Usage:\n  gt ${use}\n`;
  help += `\n[Help extracted from source - see github.com/steveyegge/gastown/issues/975]`;

  return help;
}

/**
 * Parse the main help output to extract command names grouped by category.
 */
function parseCommandsByCategory(helpOutput) {
  const categories = {};
  const lines = helpOutput.split('\n');

  let currentCategory = null;
  const skipSections = ['Available Commands', 'Flags', 'Global Flags'];
  const categoryPattern = /^([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*):$/;

  for (const line of lines) {
    const categoryMatch = line.match(categoryPattern);
    if (categoryMatch) {
      const categoryName = categoryMatch[1];
      if (skipSections.includes(categoryName)) {
        currentCategory = null;
        continue;
      }
      currentCategory = categoryName;
      categories[currentCategory] = [];
      continue;
    }

    if (line.startsWith('Flags:') || line.startsWith('Use "gt')) {
      currentCategory = null;
      continue;
    }

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
 * Extract version number from gt version output.
 */
function parseVersion(versionOutput) {
  if (!versionOutput) return null;
  const match = versionOutput.match(/version\s+(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

/**
 * Convert category name to URL slug.
 */
function categoryToSlug(category) {
  return category.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Generate a category markdown page with all commands in that category.
 */
function generateCategoryPage(category, commands, order) {
  // Avoid "Additional Commands Commands" - only add "Commands" if not already present
  const title = category.endsWith('Commands')
    ? category
    : `${category} Commands`;
  const categoryLower = category.toLowerCase();
  const desc = `CLI reference for Gas Town ${categoryLower}${categoryLower.endsWith('commands') ? '' : ' commands'}`;

  const commandSections = commands
    .map((cmd) => {
      return `## \`gt ${cmd.name}\`

${cmd.description}

\`\`\`
${cmd.help}
\`\`\``;
    })
    .join('\n\n');

  return `---
title: "${title}"
description: "${desc}"
sidebar:
  order: ${order}
---

This page documents the **${category}** commands for the \`gt\` CLI.

${commandSections}
`;
}

/**
 * Generate the main usage index page.
 */
function generateUsageIndex(mainHelp, version) {
  const versionText = version ? `**Gas Town v${version}**` : 'Gas Town';

  return `---
title: "CLI Usage"
description: "Command-line usage reference for the gt (Gas Town) CLI tool"
sidebar:
  order: 0
---

This page documents the \`gt\` command-line interface. The help output below
is automatically generated from the installed version of ${versionText}.

Select a command category from the sidebar to see detailed help.

## Command Reference

\`\`\`
${mainHelp}
\`\`\`
`;
}

async function main() {
  console.log('Generating CLI usage documentation for Starlight...');

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

  // Parse commands by category
  const categories = parseCommandsByCategory(mainHelp);
  const commands = flattenCommands(categories);
  console.log(
    `  Found ${commands.length} commands in ${Object.keys(categories).length} categories`
  );

  // Get help for each command
  const commandHelps = {};
  let fallbackCount = 0;

  for (const cmd of commands) {
    process.stdout.write(`  Capturing gt ${cmd} --help...`);
    const help = runCommand(`gt ${cmd} --help`);
    if (isValidGtHelp(help, cmd)) {
      commandHelps[cmd] = help;
      console.log(' ok');
    } else if (help) {
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

  // Ensure output directory exists
  mkdirSync(USAGE_DIR, { recursive: true });

  // Generate category pages
  console.log('\n  Generating category pages...');
  let pageCount = 0;
  let order = 1;

  for (const [category, cmds] of Object.entries(categories)) {
    const validCmds = cmds
      .filter((c) => commandHelps[c.name])
      .map((c) => ({
        name: c.name,
        description: c.description,
        help: commandHelps[c.name],
      }));

    if (validCmds.length === 0) continue;

    const slug = categoryToSlug(category);
    const pageContent = generateCategoryPage(category, validCmds, order);
    const pagePath = join(USAGE_DIR, `${slug}.md`);
    writeFileSync(pagePath, pageContent, 'utf-8');
    pageCount++;
    order++;
    console.log(`    ${category} (${validCmds.length} commands) -> ${slug}.md`);
  }

  // Generate usage index page
  const indexContent = generateUsageIndex(mainHelp, version);
  writeFileSync(join(USAGE_DIR, 'index.md'), indexContent, 'utf-8');
  console.log('  Generated usage index: usage/index.md');

  console.log(`\nDone! Generated ${pageCount + 1} pages.`);
}

main();
