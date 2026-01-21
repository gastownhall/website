import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Open Graph Tag Validation Tests
 *
 * These tests verify that the built HTML files contain proper Open Graph
 * protocol metadata tags for social media sharing.
 */

const deployDir = 'deploy';
const siteUrl = 'https://gastownhall.ai';

function readHtmlFile(relativePath) {
  const fullPath = join(deployDir, relativePath);
  return readFileSync(fullPath, 'utf-8');
}

function extractMetaContent(html, property) {
  const regex = new RegExp(`<meta property="${property}" content="([^"]*)"`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractTwitterMetaContent(html, name) {
  const regex = new RegExp(`<meta name="${name}" content="([^"]*)"`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

describe('Open Graph Tags - Homepage', () => {
  const html = readHtmlFile('index.html');

  it('should have og:type meta tag', () => {
    const ogType = extractMetaContent(html, 'og:type');
    assert.ok(ogType, 'og:type should be present');
    assert.strictEqual(ogType, 'website');
  });

  it('should have og:url meta tag with absolute URL', () => {
    const ogUrl = extractMetaContent(html, 'og:url');
    assert.ok(ogUrl, 'og:url should be present');
    assert.strictEqual(ogUrl, `${siteUrl}/`);
  });

  it('should have og:title meta tag', () => {
    const ogTitle = extractMetaContent(html, 'og:title');
    assert.ok(ogTitle, 'og:title should be present');
    assert.strictEqual(ogTitle, 'Gas Town Hall');
  });

  it('should have og:description meta tag', () => {
    const ogDescription = extractMetaContent(html, 'og:description');
    assert.ok(ogDescription, 'og:description should be present');
    assert.ok(ogDescription.length > 0, 'og:description should not be empty');
  });

  it('should have og:image meta tag with absolute URL', () => {
    const ogImage = extractMetaContent(html, 'og:image');
    assert.ok(ogImage, 'og:image should be present');
    assert.ok(ogImage.startsWith('https://'), 'og:image should be an absolute URL');
    assert.strictEqual(ogImage, `${siteUrl}/og-image.jpg`);
  });

  it('should have og:site_name meta tag', () => {
    const ogSiteName = extractMetaContent(html, 'og:site_name');
    assert.ok(ogSiteName, 'og:site_name should be present');
    assert.strictEqual(ogSiteName, 'Gas Town Hall');
  });

  it('should have og:locale meta tag', () => {
    const ogLocale = extractMetaContent(html, 'og:locale');
    assert.ok(ogLocale, 'og:locale should be present');
    assert.strictEqual(ogLocale, 'en_US');
  });

  it('should have og:image:width meta tag', () => {
    const ogImageWidth = extractMetaContent(html, 'og:image:width');
    assert.ok(ogImageWidth, 'og:image:width should be present');
    assert.strictEqual(ogImageWidth, '1200');
  });

  it('should have og:image:height meta tag', () => {
    const ogImageHeight = extractMetaContent(html, 'og:image:height');
    assert.ok(ogImageHeight, 'og:image:height should be present');
    assert.strictEqual(ogImageHeight, '630');
  });

  it('should have og:image:alt meta tag', () => {
    const ogImageAlt = extractMetaContent(html, 'og:image:alt');
    assert.ok(ogImageAlt, 'og:image:alt should be present');
    assert.ok(ogImageAlt.length > 0, 'og:image:alt should not be empty');
  });
});

describe('Twitter Card Tags - Homepage', () => {
  const html = readHtmlFile('index.html');

  it('should have twitter:card meta tag', () => {
    const twitterCard = extractTwitterMetaContent(html, 'twitter:card');
    assert.ok(twitterCard, 'twitter:card should be present');
    assert.strictEqual(twitterCard, 'summary_large_image');
  });

  it('should have twitter:url meta tag', () => {
    const twitterUrl = extractTwitterMetaContent(html, 'twitter:url');
    assert.ok(twitterUrl, 'twitter:url should be present');
    assert.strictEqual(twitterUrl, `${siteUrl}/`);
  });

  it('should have twitter:title meta tag', () => {
    const twitterTitle = extractTwitterMetaContent(html, 'twitter:title');
    assert.ok(twitterTitle, 'twitter:title should be present');
    assert.strictEqual(twitterTitle, 'Gas Town Hall');
  });

  it('should have twitter:description meta tag', () => {
    const twitterDescription = extractTwitterMetaContent(html, 'twitter:description');
    assert.ok(twitterDescription, 'twitter:description should be present');
    assert.ok(twitterDescription.length > 0, 'twitter:description should not be empty');
  });

  it('should have twitter:image meta tag', () => {
    const twitterImage = extractTwitterMetaContent(html, 'twitter:image');
    assert.ok(twitterImage, 'twitter:image should be present');
    assert.ok(twitterImage.startsWith('https://'), 'twitter:image should be an absolute URL');
  });

  it('should have twitter:site meta tag', () => {
    const twitterSite = extractTwitterMetaContent(html, 'twitter:site');
    assert.ok(twitterSite, 'twitter:site should be present');
    assert.strictEqual(twitterSite, '@gastownhall');
  });

  it('should have twitter:creator meta tag', () => {
    const twitterCreator = extractTwitterMetaContent(html, 'twitter:creator');
    assert.ok(twitterCreator, 'twitter:creator should be present');
    assert.strictEqual(twitterCreator, '@csells');
  });
});

describe('Open Graph Tags - About Page', () => {
  const html = readHtmlFile('about/index.html');

  it('should have og:type meta tag', () => {
    const ogType = extractMetaContent(html, 'og:type');
    assert.ok(ogType, 'og:type should be present');
    assert.strictEqual(ogType, 'website');
  });

  it('should have og:url meta tag with absolute URL', () => {
    const ogUrl = extractMetaContent(html, 'og:url');
    assert.ok(ogUrl, 'og:url should be present');
    assert.strictEqual(ogUrl, `${siteUrl}/about/`);
  });

  it('should have og:title meta tag', () => {
    const ogTitle = extractMetaContent(html, 'og:title');
    assert.ok(ogTitle, 'og:title should be present');
    assert.ok(ogTitle.includes('About'), 'og:title should mention About');
  });

  it('should have og:description meta tag', () => {
    const ogDescription = extractMetaContent(html, 'og:description');
    assert.ok(ogDescription, 'og:description should be present');
    assert.ok(ogDescription.length > 0, 'og:description should not be empty');
  });

  it('should have og:image meta tag', () => {
    const ogImage = extractMetaContent(html, 'og:image');
    assert.ok(ogImage, 'og:image should be present');
    assert.ok(ogImage.startsWith('https://'), 'og:image should be an absolute URL');
  });
});

describe('Open Graph Tags - Docs Page', () => {
  const html = readHtmlFile('docs/index.html');

  it('should have og:type meta tag', () => {
    const ogType = extractMetaContent(html, 'og:type');
    assert.ok(ogType, 'og:type should be present');
    assert.strictEqual(ogType, 'website');
  });

  it('should have og:url meta tag with absolute URL', () => {
    const ogUrl = extractMetaContent(html, 'og:url');
    assert.ok(ogUrl, 'og:url should be present');
    assert.strictEqual(ogUrl, `${siteUrl}/docs/`);
  });

  it('should have og:title meta tag', () => {
    const ogTitle = extractMetaContent(html, 'og:title');
    assert.ok(ogTitle, 'og:title should be present');
    assert.ok(ogTitle.includes('Docs') || ogTitle.includes('Gas Town'), 'og:title should be docs-related');
  });

  it('should have og:description meta tag', () => {
    const ogDescription = extractMetaContent(html, 'og:description');
    assert.ok(ogDescription, 'og:description should be present');
    assert.ok(ogDescription.length > 0, 'og:description should not be empty');
  });

  it('should have og:image meta tag', () => {
    const ogImage = extractMetaContent(html, 'og:image');
    assert.ok(ogImage, 'og:image should be present');
    assert.ok(ogImage.startsWith('https://'), 'og:image should be an absolute URL');
  });
});

describe('URL Construction', () => {
  it('should use absolute URLs for all pages', () => {
    const pages = [
      'index.html',
      'about/index.html',
      'docs/index.html'
    ];

    pages.forEach(page => {
      const html = readHtmlFile(page);
      const ogUrl = extractMetaContent(html, 'og:url');
      const ogImage = extractMetaContent(html, 'og:image');

      assert.ok(ogUrl.startsWith('https://'), `${page}: og:url should be absolute`);
      assert.ok(ogImage.startsWith('https://'), `${page}: og:image should be absolute`);
    });
  });

  it('should use consistent site URL', () => {
    const pages = [
      'index.html',
      'about/index.html',
      'docs/index.html'
    ];

    pages.forEach(page => {
      const html = readHtmlFile(page);
      const ogUrl = extractMetaContent(html, 'og:url');
      const ogImage = extractMetaContent(html, 'og:image');

      assert.ok(ogUrl.startsWith(siteUrl), `${page}: og:url should use ${siteUrl}`);
      assert.ok(ogImage.startsWith(siteUrl), `${page}: og:image should use ${siteUrl}`);
    });
  });
});
