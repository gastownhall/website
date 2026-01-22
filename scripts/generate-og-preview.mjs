#!/usr/bin/env node

/**
 * Generate OG Preview Tool
 *
 * Creates an HTML preview file showing how Open Graph cards will appear
 * on various social media platforms (Facebook, Twitter, LinkedIn, Discord).
 *
 * Usage:
 *   node scripts/generate-og-preview.mjs           # Preview local build
 *   node scripts/generate-og-preview.mjs --local   # Preview local dev server
 *   node scripts/generate-og-preview.mjs --prod    # Preview production site
 *
 * Output: tmp/og-preview.html
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Parse command line arguments
const args = process.argv.slice(2);
const mode = args.includes('--prod')
  ? 'prod'
  : args.includes('--local')
    ? 'local'
    : 'build';

// Load site configuration from JSON (single source of truth)
const configPath = join(rootDir, 'site.config.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

const siteName = config.site.name;
const siteUrl = config.site.url;
const siteDescription = config.site.description;
const twitterHandle = config.social.twitterHandle;

// Load BaseLayout to get current OG image path
const layoutPath = join(rootDir, 'src/layouts/BaseLayout.astro');
const layoutContent = readFileSync(layoutPath, 'utf-8');
const imageMatch = layoutContent.match(/image\s*=\s*['"]([^'"]+)['"]/);
const ogImagePath = imageMatch ? imageMatch[1] : '/og-image.jpg';

// Determine image source based on mode
let imageSource;
let modeLabel;
if (mode === 'prod') {
  imageSource = `${siteUrl}${ogImagePath}`;
  modeLabel = 'Production (gastownhall.ai)';
} else if (mode === 'local') {
  imageSource = `http://localhost:4321${ogImagePath}`;
  modeLabel = 'Local Dev Server (localhost:4321)';
} else {
  imageSource = `../public${ogImagePath}`;
  modeLabel = 'Local Build (deploy/)';
}

console.log('📋 Site Configuration:');
console.log(`  Mode: ${modeLabel}`);
console.log(`  Name: ${siteName}`);
console.log(`  URL: ${siteUrl}`);
console.log(`  Description: ${siteDescription.substring(0, 60)}...`);
console.log(`  OG Image: ${ogImagePath}`);
console.log(`  Image Source: ${imageSource}`);
console.log();

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Open Graph Card Preview - ${siteName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .header {
      text-align: center;
      color: white;
      margin-bottom: 1rem;
    }

    .header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .header p {
      opacity: 0.9;
      font-size: 1rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;
    }

    .platform-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .platform-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f0f0f0;
    }

    .platform-logo {
      width: 32px;
      height: 32px;
      border-radius: 6px;
    }

    .platform-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: #333;
    }

    /* Facebook-style card */
    .facebook-preview {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      background: #f9f9f9;
    }

    .facebook-preview img {
      width: 100%;
      height: auto;
      display: block;
      aspect-ratio: 1.91 / 1;
      object-fit: cover;
    }

    .facebook-preview .content {
      padding: 12px;
      background: #f0f2f5;
    }

    .facebook-preview .domain {
      font-size: 12px;
      color: #65676b;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .facebook-preview .title {
      font-size: 16px;
      font-weight: 600;
      color: #050505;
      margin-bottom: 4px;
      line-height: 1.3;
    }

    .facebook-preview .description {
      font-size: 14px;
      color: #65676b;
      line-height: 1.4;
    }

    /* Twitter-style card */
    .twitter-preview {
      border: 1px solid #cfd9de;
      border-radius: 16px;
      overflow: hidden;
      background: white;
    }

    .twitter-preview img {
      width: 100%;
      height: auto;
      display: block;
      aspect-ratio: 1.91 / 1;
      object-fit: cover;
    }

    .twitter-preview .content {
      padding: 12px;
    }

    .twitter-preview .title {
      font-size: 15px;
      font-weight: 600;
      color: #0f1419;
      margin-bottom: 2px;
      line-height: 1.3;
    }

    .twitter-preview .description {
      font-size: 14px;
      color: #536471;
      line-height: 1.4;
      margin-bottom: 4px;
    }

    .twitter-preview .domain {
      font-size: 13px;
      color: #536471;
    }

    /* LinkedIn-style card */
    .linkedin-preview {
      border: 1px solid #d0d5dd;
      border-radius: 8px;
      overflow: hidden;
      background: white;
    }

    .linkedin-preview img {
      width: 100%;
      height: auto;
      display: block;
      aspect-ratio: 1.91 / 1;
      object-fit: cover;
    }

    .linkedin-preview .content {
      padding: 16px;
      background: white;
    }

    .linkedin-preview .title {
      font-size: 16px;
      font-weight: 600;
      color: #000;
      margin-bottom: 4px;
      line-height: 1.4;
    }

    .linkedin-preview .domain {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }

    /* Discord-style card */
    .discord-preview {
      border-left: 4px solid #5865F2;
      border-radius: 4px;
      overflow: hidden;
      background: #2f3136;
      padding: 8px 12px 12px 12px;
    }

    .discord-preview .site-name {
      font-size: 12px;
      font-weight: 600;
      color: #00aff4;
      margin-bottom: 8px;
    }

    .discord-preview .title {
      font-size: 14px;
      font-weight: 600;
      color: #00aff4;
      margin-bottom: 4px;
      line-height: 1.3;
    }

    .discord-preview .description {
      font-size: 14px;
      color: #dcddde;
      line-height: 1.4;
      margin-bottom: 12px;
    }

    .discord-preview img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 4px;
      aspect-ratio: 1.91 / 1;
      object-fit: cover;
    }

    .metadata {
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      font-size: 0.875rem;
      color: #666;
    }

    .metadata h3 {
      font-size: 1rem;
      color: #333;
      margin-bottom: 0.75rem;
    }

    .metadata dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem 1rem;
    }

    .metadata dt {
      font-weight: 600;
      color: #555;
    }

    .metadata dd {
      color: #666;
      word-break: break-all;
    }

    .footer {
      text-align: center;
      color: white;
      opacity: 0.8;
      font-size: 0.875rem;
      padding: 1rem;
    }

    .footer a {
      color: white;
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .container {
        grid-template-columns: 1fr;
      }

      body {
        padding: 1rem;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎩 Open Graph Card Preview</h1>
    <p>How your ${siteName} links will appear on social media</p>
    <p style="font-size: 0.875rem; opacity: 0.8; margin-top: 0.5rem;">Mode: ${modeLabel}</p>
  </div>

  <div class="container">
    <!-- Facebook -->
    <div class="platform-card">
      <div class="platform-header">
        <svg class="platform-logo" viewBox="0 0 24 24" fill="#1877f2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        <span class="platform-name">Facebook</span>
      </div>
      <div class="facebook-preview">
        <img src="${imageSource}" alt="Preview">
        <div class="content">
          <div class="domain">${siteUrl.replace('https://', '').replace('http://', '')}</div>
          <div class="title">${siteName}</div>
          <div class="description">${siteDescription.substring(0, 150)}...</div>
        </div>
      </div>
    </div>

    <!-- Twitter -->
    <div class="platform-card">
      <div class="platform-header">
        <svg class="platform-logo" viewBox="0 0 24 24" fill="#000">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span class="platform-name">X (Twitter)</span>
      </div>
      <div class="twitter-preview">
        <img src="${imageSource}" alt="Preview">
        <div class="content">
          <div class="title">${siteName}</div>
          <div class="description">${siteDescription.substring(0, 150)}...</div>
          <div class="domain">🔗 ${siteUrl.replace('https://', '').replace('http://', '')}</div>
        </div>
      </div>
    </div>

    <!-- LinkedIn -->
    <div class="platform-card">
      <div class="platform-header">
        <svg class="platform-logo" viewBox="0 0 24 24" fill="#0077b5">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        <span class="platform-name">LinkedIn</span>
      </div>
      <div class="linkedin-preview">
        <img src="${imageSource}" alt="Preview">
        <div class="content">
          <div class="title">${siteName}</div>
          <div class="domain">${siteUrl.replace('https://', '').replace('http://', '')}</div>
        </div>
      </div>
    </div>

    <!-- Discord -->
    <div class="platform-card">
      <div class="platform-header">
        <svg class="platform-logo" viewBox="0 0 24 24" fill="#5865F2">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
        <span class="platform-name">Discord</span>
      </div>
      <div class="discord-preview">
        <div class="site-name">${siteName}</div>
        <div class="title">${siteUrl.replace('https://', '').replace('http://', '')}</div>
        <div class="description">${siteDescription}</div>
        <img src="${imageSource}" alt="Preview">
      </div>
    </div>
  </div>

  <div class="platform-card metadata">
    <h3>📋 Open Graph Metadata</h3>
    <dl>
      <dt>og:type</dt>
      <dd>website</dd>

      <dt>og:url</dt>
      <dd>${siteUrl}/</dd>

      <dt>og:title</dt>
      <dd>${siteName}</dd>

      <dt>og:description</dt>
      <dd>${siteDescription}</dd>

      <dt>og:image</dt>
      <dd>${siteUrl}${ogImagePath}</dd>

      <dt>og:image:width</dt>
      <dd>1200</dd>

      <dt>og:image:height</dt>
      <dd>630</dd>

      <dt>og:image:alt</dt>
      <dd>Mayor of Gas Town - AI-powered development workflows</dd>

      <dt>og:site_name</dt>
      <dd>${siteName}</dd>

      <dt>twitter:card</dt>
      <dd>summary_large_image</dd>

      <dt>twitter:site</dt>
      <dd>${twitterHandle}</dd>

      <dt>twitter:creator</dt>
      <dd>@csells</dd>
    </dl>
  </div>

  <div class="footer">
    <p>Generated by <a href="./generate-og-preview.mjs">scripts/generate-og-preview.mjs</a></p>
    <p style="margin-top: 0.5rem;">Usage:</p>
    <p><code>node scripts/generate-og-preview.mjs</code> - Preview local build (deploy/)</p>
    <p><code>node scripts/generate-og-preview.mjs --local</code> - Preview dev server (localhost:4321)</p>
    <p><code>node scripts/generate-og-preview.mjs --prod</code> - Preview production (gastownhall.ai)</p>
  </div>
</body>
</html>
`;

// Ensure tmp directory exists and write the file
const tmpDir = join(rootDir, 'tmp');
mkdirSync(tmpDir, { recursive: true });
const outputPath = join(tmpDir, 'og-preview.html');
writeFileSync(outputPath, html, 'utf-8');

console.log('✅ Generated: tmp/og-preview.html');
console.log();
console.log('To view:');
console.log('  open tmp/og-preview.html');
console.log();
