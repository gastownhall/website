#!/usr/bin/env node

/**
 * Copy static assets from src/static/ to tmp/public/.
 *
 * This script ensures all static assets are copied to Astro's public directory
 * before the build, making the entire site regeneratable from source.
 *
 * Usage: node scripts/copy-assets.mjs
 */

import { cp, mkdir } from 'fs/promises';
import { join, relative } from 'path';
import { paths } from './lib/config.mjs';

const STATIC_SOURCE = join(paths.src, 'static');
const PUBLIC_OUTPUT = paths.public;

async function copyAssets() {
  console.log('Copying static assets...');
  console.log(`  Source: ${relative(paths.root, STATIC_SOURCE)}`);
  console.log(`  Output: ${relative(paths.root, PUBLIC_OUTPUT)}`);

  // Ensure public directory exists
  await mkdir(PUBLIC_OUTPUT, { recursive: true });

  // Copy all static assets recursively
  await cp(STATIC_SOURCE, PUBLIC_OUTPUT, {
    recursive: true,
    filter: (src) => !src.includes('.DS_Store'),
  });

  console.log('Done!');
}

copyAssets();
