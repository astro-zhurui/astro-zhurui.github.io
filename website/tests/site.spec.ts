import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import photos from '../src/data/photos.json' with { type: 'json' };
import publications from '../src/data/publications.json' with { type: 'json' };

test('all bilingual pages render without horizontal overflow or browser errors', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const resources: string[] = [];
  page.on('response', (response) => {
    if (response.url().startsWith('http://127.0.0.1:4321') && response.status() >= 400)
      resources.push(response.url());
  });
  for (const lang of ['en', 'zh']) {
    for (const route of ['', 'research/', 'publications/', 'photography/', 'about/']) {
      await page.goto(`/${lang}/${route}`);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
      const layout = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth,
        viewport: innerWidth,
      }));
      expect(layout.document, `${lang}/${route}`).toBeLessThanOrEqual(layout.viewport + 1);
      await expect(page.locator('body')).not.toContainText(/EP-FXT|In preparation|AstroKit/);
      if (!route || route === 'photography/') {
        await page.waitForFunction(() =>
          [
            ...document.querySelectorAll<HTMLImageElement>('.hero-portrait img, .photo-card img'),
          ].every((img) => img.complete && img.naturalWidth > 0),
        );
        await page.screenshot({
          path: `.local/qa/screenshots/${testInfo.project.name}-${lang}-${route ? 'photography' : 'home'}.png`,
          fullPage: true,
          animations: 'disabled',
        });
      }
    }
  }
  expect(errors).toEqual([]);
  expect(resources).toEqual([]);
});

test('language switch preserves route and hash; root defaults to English', async ({ page }) => {
  await page.goto('/en/research/#qhsc');
  await page.locator('[data-language-switch]').click();
  await expect(page).toHaveURL(/\/zh\/research\/#qhsc$/);
  await expect(page.locator('h1')).toHaveText('研究方向');
  // An existing visitor's old preference must not override the English entry point.
  await page.evaluate(() => localStorage.setItem('language', 'zh'));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('[data-language-switch]').click();
  await expect(page).toHaveURL(/\/zh\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await page.locator('[data-language-switch]').click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('public paper, real education dates, and current gallery', async ({ page }) => {
  await page.goto('/en/publications/');
  await expect(page.locator('article.publication')).toHaveCount(publications.length);
  const qhsc = page.locator('#publication-qhsc');
  expect(
    await page
      .locator('article.publication')
      .evaluateAll((items) => items.map((el) => el.getAttribute('data-doi'))),
  ).toEqual(publications.map((paper) => paper.doi));
  await expect(page.locator('.authors strong')).toHaveCount(publications.length);
  await expect(qhsc.getByRole('link', { name: 'Read the paper' })).toHaveAttribute(
    'href',
    'https://iopscience.iop.org/article/10.3847/1538-4365/ae2099',
  );
  await expect(page.locator('h1')).toHaveText('Publications');
  await expect(page.locator('.citation, [data-copy-citation]')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText(/BibTeX/i);
  await page.goto('/zh/publications/');
  await expect(page.locator('h1')).toHaveText('Publications');
  await expect(page.locator('article.publication')).toHaveCount(publications.length);
  await expect(page.locator('.citation, [data-copy-citation]')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText(/BibTeX/i);

  await page.goto('/zh/about/');
  await expect(page.locator('body')).toContainText('2026.08');
  await expect(page.locator('body')).toContainText('2026.07');
  await expect(page.locator('body')).not.toContainText('下载简历');
  await page.goto('/zh/photography/');
  await expect(page.locator('.photo-open')).toHaveCount(photos.length);
  if (photos.length) {
    await expect(page.locator('.photo-card img')).toHaveCount(photos.length);
    await expect(page.locator('.gallery-empty')).toHaveCount(0);
  } else {
    await expect(page.locator('body')).toContainText('作品将陆续更新');
  }
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
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${width} ${route}`,
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('/zh/');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
});

test('essential navigation works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
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
  for (const route of [
    '/en/',
    '/zh/research/',
    '/en/publications/',
    '/zh/photography/',
    '/zh/about/',
  ]) {
    await page.goto(route);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations, route).toEqual([]);
  }
});

test('homepage portrait retains its composition and opens in the gallery', async ({ page }) => {
  const portrait = photos.find((photo) => photo.homepage);
  test.skip(!portrait, 'No homepage photograph configured');
  await page.goto('/zh/');
  const image = page.locator('.hero-portrait img');
  await expect(image).toBeVisible();
  await expect
    .poll(() => image.evaluate((img) => (img as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
  const dimensions = await image.evaluate((img) => {
    const element = img as HTMLImageElement;
    return {
      rendered: element.clientWidth / element.clientHeight,
      source: element.naturalWidth / element.naturalHeight,
    };
  });
  expect(Math.abs(dimensions.rendered - dimensions.source)).toBeLessThan(0.01);
  await page.locator('.hero-portrait a').click();
  await expect(page).toHaveURL(new RegExp(`/zh/photography/#photo-${portrait!.id}$`));
  await page.locator(`#photo-${portrait!.id} .photo-open`).click();
  await expect(page.locator('#lightbox')).toBeVisible();
  await expect(page.locator('#photo-title')).toHaveText(portrait!.title.zh);
  await expect(page.locator('#photo-title')).toBeHidden();
  await expect(page.locator('.photo-card figcaption')).toHaveCount(0);
  await expect
    .poll(() =>
      page.locator('#lightbox-image').evaluate((img) => (img as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  if (photos.length === 1) {
    await expect(page.locator('#photo-prev')).toBeDisabled();
    await expect(page.locator('#photo-next')).toBeDisabled();
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox')).toBeHidden();
  await expect(page.locator(`#photo-${portrait!.id} .photo-open`)).toBeFocused();
});

test('horizontal gallery snaps, drags, and respects reduced motion', async ({ page }, testInfo) => {
  test.skip(photos.length < 2, 'Requires multiple photographs');
  await page.goto('/zh/photography/');
  const track = page.locator('#photo-gallery');
  await expect(track).toHaveAttribute('data-active', '0');
  await page.locator('#gallery-next').click();
  await expect(track).toHaveAttribute('data-active', '1');
  await expect(page.locator('#gallery-position')).toHaveText(`2 / ${photos.length}`);
  await track.focus();
  await page.keyboard.press('ArrowRight');
  await expect(track).toHaveAttribute('data-active', '2');
  await expect(page.locator('#gallery-next')).toBeDisabled();
  await page.keyboard.press('ArrowLeft');
  await expect(track).toHaveAttribute('data-active', '1');
  if (testInfo.project.name === 'desktop') {
    const box = await track.boundingBox();
    await page.mouse.move(box!.x + box!.width * 0.65, box!.y + box!.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width * 0.15, box!.y + box!.height * 0.5, { steps: 15 });
    await page.mouse.up();
    await expect(track).toHaveAttribute('data-active', '2');
    await expect(page.locator('#lightbox')).toBeHidden();
  }
  if (testInfo.project.name === 'mobile') {
    const cdp = await page.context().newCDPSession(page);
    const box = await track.boundingBox();
    const y = box!.y + box!.height / 2;
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: 320, y }],
    });
    for (const x of [280, 240, 200, 160, 120, 80])
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(track).toHaveAttribute('data-active', '2');
    await expect(page.locator('#lightbox')).toBeHidden();
    await cdp.detach();
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.photo-open').first()).toHaveCSS('transform', 'none');
  await track.focus();
  await page.locator('#gallery-prev').click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
});
