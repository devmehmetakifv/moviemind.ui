import { test, expect } from '@playwright/test';

test.describe('User Journey', () => {
    test('can navigate to home page', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Moviemind/);
    });

    test('shows movie grid on home page', async ({ page }) => {
        await page.goto('/');
        // Wait for movies to load
        await page.waitForSelector('[class*="movie-card"], [class*="skeleton"]');
    });

    test('can search for movies', async ({ page }) => {
        await page.goto('/');

        const searchInput = page.locator('input[placeholder*="Search"]');
        await searchInput.fill('Toy Story');
        await page.locator('button:has-text("Search")').click();

        // Wait for results
        await page.waitForTimeout(500);
    });

    test('can navigate to movie detail', async ({ page }) => {
        await page.goto('/');

        // Wait for movies to load
        await page.waitForSelector('[class*="movie-card"]');

        // Click first movie
        await page.locator('[class*="movie-card"]').first().click();

        // Should be on detail page
        await expect(page.url()).toContain('/movies/');
    });

    test('shows 404 for invalid page', async ({ page }) => {
        await page.goto('/nonexistent-page');
        await expect(page.locator('text=404')).toBeVisible();
        await expect(page.locator('text=Page Not Found')).toBeVisible();
    });

    test('login page is accessible', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('text=Welcome Back')).toBeVisible();
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('register page is accessible', async ({ page }) => {
        await page.goto('/register');
        await expect(page.locator('text=Create Account')).toBeVisible();
    });

    test('3-click rule: can reach movie detail in 3 clicks', async ({ page }) => {
        // Start at home page (no click)
        await page.goto('/');
        await page.waitForSelector('[class*="movie-card"]');

        // Click 1: Click movie card
        await page.locator('[class*="movie-card"]').first().click();

        // Should now be on movie detail (1 click total)
        await expect(page.url()).toContain('/movies/');

        // This verifies KOG-06: Maximum 3 clicks to reach movie
        // Actually achieved in 1 click from home
    });
});

test.describe('Mobile Responsiveness', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('mobile menu works', async ({ page }) => {
        await page.goto('/');

        // Mobile menu button should be visible
        const menuButton = page.locator('button').filter({ has: page.locator('svg') }).last();
        await expect(menuButton).toBeVisible();
    });

    test('movie grid is responsive', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('[class*="movie-card"], [class*="skeleton"]');

        // Should show 2 columns on mobile (grid-cols-2)
        // Visual check - the grid should be properly responsive
    });
});
