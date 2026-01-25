import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Gas Town Hall');
  });

  test('displays hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-title')).toContainText('Gas Town Hall');
    await expect(page.locator('.hero-headline')).toBeVisible();
  });

  test('has working navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.locator('nav a').filter({ hasText: 'Docs' })
    ).toBeVisible();
    await expect(
      page.locator('nav a').filter({ hasText: 'Discord' })
    ).toBeVisible();
    await expect(
      page.locator('nav a').filter({ hasText: 'GitHub' })
    ).toBeVisible();
  });

  test('blog section displays posts', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.blog-list .blog-item').first()).toBeVisible();
  });
});

test.describe('Documentation', () => {
  test('docs page loads', async ({ page }) => {
    await page.goto('/docs');
    await expect(page).toHaveTitle(/Gas Town Docs/);
  });

  test('sidebar navigation is visible', async ({ page }) => {
    await page.goto('/docs');
    await expect(page.locator('.docs-sidebar')).toBeVisible();
    await expect(page.locator('.docs-sidebar nav h3').first()).toBeVisible();
  });

  test('can navigate to a concept page', async ({ page }) => {
    await page.goto('/docs');
    await page.click('a[href="/docs/concepts/convoy"]');
    await expect(page).toHaveURL('/docs/concepts/convoy');
    await expect(page.locator('.docs-content h1')).toContainText('Convoy');
  });
});

test.describe('Accessibility', () => {
  test('skip link exists and works', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('main content landmark exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main#main-content')).toBeVisible();
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('Static Pages', () => {
  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/About/);
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page).toHaveTitle(/Privacy/);
  });

  test('terms page loads', async ({ page }) => {
    await page.goto('/terms');
    await expect(page).toHaveTitle(/Terms/);
  });
});
