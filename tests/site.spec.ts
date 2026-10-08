import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('all bilingual pages render without horizontal overflow or browser errors', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const resources: string[] = [];
  page.on('response', response => { if (response.url().startsWith('http://127.0.0.1:4321') && response.status() >= 400) resources.push(response.url()); });
  for (const lang of ['en', 'zh']) {
    for (const route of ['', 'research/', 'publications/', 'photography/', 'about/']) {
      await page.goto(`/${lang}/${route}`);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
      const layout = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
      expect(layout.document, `${lang}/${route}`).toBeLessThanOrEqual(layout.viewport + 1);
      await expect(page.locator('body')).not.toContainText(/EP-FXT|In preparation|AstroKit/);
      if (!route || route === 'photography/') await page.screenshot({ path: `work/screenshots/${testInfo.project.name}-${lang}-${route ? 'photography' : 'home'}.png`, fullPage: true, animations: 'disabled' });
    }
  }
  expect(errors).toEqual([]);
  expect(resources).toEqual([]);
});

test('language switch preserves route and hash and remembers language', async ({ page }) => {
  await page.goto('/en/research/#qhsc');
  await page.locator('[data-language-switch]').click();
  await expect(page).toHaveURL(/\/zh\/research\/#qhsc$/);
  await expect(page.locator('h1')).toHaveText('从光，到理解。');
  await page.goto('/');
  await expect(page).toHaveURL(/\/zh\/$/);
  await page.locator('[data-language-switch]').click();
  await expect(page).toHaveURL(/\/en\/$/);
  expect(await page.evaluate(() => localStorage.getItem('language'))).toBe('en');
});

test('public paper, real education dates, and honest empty gallery', async ({ page }) => {
  await page.goto('/en/publications/');
  await expect(page.locator('article.publication')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Read the paper' })).toHaveAttribute('href', 'https://iopscience.iop.org/article/10.3847/1538-4365/ae2099');
  await page.locator('summary').click();
  await expect(page.locator('#bibtex')).toContainText('10.3847/1538-4365/ae2099');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.locator('#copy-citation').click();
  await expect(page.locator('#copy-status')).toHaveText('Copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Zhu2026QHSC');
  await page.goto('/zh/about/');
  await expect(page.locator('body')).toContainText('2026.08');
  await expect(page.locator('body')).toContainText('2026.07');
  await expect(page.locator('body')).not.toContainText('下载简历');
  await page.goto('/zh/photography/');
  await expect(page.locator('body')).toContainText('作品，正在精选。');
  await expect(page.locator('.photo-open')).toHaveCount(0);
});

test('mobile navigation opens, escape closes, and links work', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/zh/');
  const button = page.getByRole('button', { name: '菜单' });
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-nav')).toBeHidden();
  await button.click();
  await page.locator('#mobile-nav').getByRole('link', { name: '摄影' }).click();
  await expect(page).toHaveURL(/\/zh\/photography\/$/);
});

test('narrow screens, tablet, and enlarged text remain within the viewport', async ({ page }) => {
  for (const width of [320, 768, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['/en/', '/zh/', '/en/research/', '/zh/about/']) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width} ${route}`).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('/zh/');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('essential navigation works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/en/');
  await page.getByRole('link', { name: 'Explore my research' }).first().click();
  await expect(page).toHaveURL(/\/en\/research\/$/);
  await page.locator('[data-language-switch]').click();
  await expect(page).toHaveURL(/\/zh\/research\/$/);
  await context.close();
});


test('main pages meet automated accessibility checks', async ({ page }) => {
  test.setTimeout(60000);
  for (const route of ['/en/', '/zh/research/', '/en/publications/', '/zh/photography/', '/zh/about/']) {
    await page.goto(route);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations, route).toEqual([]);
  }
});
