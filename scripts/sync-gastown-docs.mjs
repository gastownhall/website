#!/usr/bin/env node

/**
 * Syncs documentation from the gastown repo and rebuilds the docs site.
 *
 * Usage:
 *   node scripts/sync-gastown-docs.mjs [gastown-path]
 *
 * If gastown-path is not provided, defaults to /Users/csells/Code/Cache/steveyegge/gastown
 *
 * This script:
 *   1. Syncs docs/ from gastown repo to docs-fodder/gastown-docs/
 *   2. Runs shred-docs to generate Astro pages
 *   3. Runs generate-usage to create CLI usage docs (requires gt CLI)
 *   4. Runs copy-docs to copy pages to main site
 *   5. Copies sidebar data to main site
 *
 * After running, commit the changes for CF to build:
 *   git add -A && git commit -m "Sync docs"
 */

import { cp, rm, copyFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

import { countMarkdownFiles, shouldCopyFile } from './lib/sync.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const DEFAULT_GASTOWN_PATH = '/Users/csells/Code/Cache/steveyegge/gastown';
const DOCS_DEST = join(ROOT, 'docs-fodder', 'gastown-docs');

/**
 * Run a node script and wait for it to complete.
 */
function runScript(scriptPath, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n→ ${description}`);
    console.log(`  $ node ${relative(ROOT, scriptPath)}`);

    const child = spawn('node', [scriptPath], {
      cwd: ROOT,
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script exited with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

/**
 * Sync docs from source to destination.
 * Removes destination first to ensure clean sync (handles deleted files).
 */
async function syncDocs(source, dest) {
  console.log('\n→ Syncing docs from gastown repo');
  console.log(`  Source: ${source}`);
  console.log(`  Dest:   ${relative(ROOT, dest)}`);

  // Count source files
  const sourceCount = await countMarkdownFiles(source);
  console.log(`  Found ${sourceCount} markdown files in source`);

  // Remove existing destination to ensure clean sync
  if (existsSync(dest)) {
    await rm(dest, { recursive: true });
  }

  // Copy source to destination
  await cp(source, dest, {
    recursive: true,
    filter: shouldCopyFile,
  });

  // Count destination files
  const destCount = await countMarkdownFiles(dest);
  console.log(`  Synced ${destCount} markdown files`);
}

async function main() {
  const gastownPath = process.argv[2] || DEFAULT_GASTOWN_PATH;
  const docsSource = join(gastownPath, 'docs');

  console.log('='.repeat(60));
  console.log('Gas Town Docs Sync');
  console.log('='.repeat(60));

  // Validate source exists
  if (!existsSync(docsSource)) {
    console.error(`\nError: Source docs not found at ${docsSource}`);
    console.error(
      'Please provide the path to the gastown repo as an argument:'
    );
    console.error('  node scripts/sync-gastown-docs.mjs /path/to/gastown');
    process.exit(1);
  }

  // Sync docs
  await syncDocs(docsSource, DOCS_DEST);

  // Rebuild documentation
  await runScript(
    join(__dirname, 'shred-docs.mjs'),
    'Generating Astro pages from markdown'
  );
  await runScript(
    join(__dirname, 'generate-usage.mjs'),
    'Generating CLI usage docs (requires gt CLI)'
  );
  await runScript(
    join(__dirname, 'copy-docs.mjs'),
    'Copying docs to main site'
  );

  // Copy sidebar data to main site
  console.log('\n→ Copying sidebar data to main site');
  const sidebarSrc = join(ROOT, 'src-docs', 'data', 'usage-commands.json');
  const sidebarDest = join(ROOT, 'src', 'data', 'usage-commands.json');
  await mkdir(dirname(sidebarDest), { recursive: true });
  await copyFile(sidebarSrc, sidebarDest);
  console.log(`  Copied usage-commands.json`);

  console.log('\n' + '='.repeat(60));
  console.log('Sync complete!');
  console.log('='.repeat(60));
  console.log('\nNext steps:');
  console.log('  git add -A && git commit -m "Sync docs"  # Commit for CF');
  console.log('  npm run dev         # Preview changes locally');
  console.log('  npm run build       # Build for production');
  console.log('  npm run deploy      # Deploy main site');
  console.log('  npm run deploy:docs # Deploy docs subdomain');
}

main();
