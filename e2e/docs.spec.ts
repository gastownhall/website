import { test, expect } from '@playwright/test';

test.describe('Docs Site (Starlight)', () => {
  // Use the docs subdomain port
  const docsUrl = 'http://localhost:4322';

  test('docs page loads with correct styling', async ({ page }) => {
    await page.goto(docsUrl);
    await expect(page).toHaveTitle(/Gas Town Docs/);
  });

  test('mobile TOC button is vertically centered', async ({ page }) => {
    // Set viewport to trigger mobile TOC (< 72rem = 1152px)
    await page.setViewportSize({ width: 1000, height: 800 });
    // Navigate to a page with headings that generates a TOC
    await page.goto(`${docsUrl}/design/architecture/`);

    // Wait for the nav element to be visible
    const nav = page.locator('mobile-starlight-toc nav');
    await expect(nav).toBeVisible({ timeout: 10000 });

    const navBox = await nav.boundingBox();

    // Get the toggle button's bounding box
    const toggle = page.locator('mobile-starlight-toc .toggle');
    const toggleBox = await toggle.boundingBox();

    if (navBox && toggleBox) {
      // Calculate the vertical center of the nav
      const navCenterY = navBox.y + navBox.height / 2;
      // Calculate the vertical center of the toggle
      const toggleCenterY = toggleBox.y + toggleBox.height / 2;

      // The toggle should be within 5px of center
      const verticalOffset = Math.abs(navCenterY - toggleCenterY);
      console.log(`Nav center: ${navCenterY}, Toggle center: ${toggleCenterY}, Offset: ${verticalOffset}`);

      expect(verticalOffset).toBeLessThan(5);
    }
  });

  test('mobile TOC button is horizontally centered', async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.goto(`${docsUrl}/design/architecture/`);

    const nav = page.locator('mobile-starlight-toc nav');
    const navBox = await nav.boundingBox();

    const toggle = page.locator('mobile-starlight-toc .toggle');
    const toggleBox = await toggle.boundingBox();

    if (navBox && toggleBox) {
      const navCenterX = navBox.x + navBox.width / 2;
      const toggleCenterX = toggleBox.x + toggleBox.width / 2;

      const horizontalOffset = Math.abs(navCenterX - toggleCenterX);
      console.log(`Nav center X: ${navCenterX}, Toggle center X: ${toggleCenterX}, Offset: ${horizontalOffset}`);

      expect(horizontalOffset).toBeLessThan(5);
    }
  });
});
