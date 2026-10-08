import { mkdtemp, cp, mkdir, symlink, readFile, writeFile, stat, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { chromium } from '@playwright/test';
const root = fileURLToPath(new URL('../', import.meta.url));
await mkdir(join(root, 'work'), { recursive: true });
const fixture = await mkdtemp(join(root, 'work/photo-test-'));
let server, browser;
try {
  for (const name of ['src', 'scripts']) await cp(join(root, name), join(fixture, name), { recursive: true });
  for (const name of ['package.json', 'astro.config.mjs', 'tsconfig.json']) await cp(join(root, name), join(fixture, name));
  await symlink(join(root, 'node_modules'), join(fixture, 'node_modules'));
  await mkdir(join(fixture, 'public'), { recursive: true });
  await cp(join(root, 'public/favicon.svg'), join(fixture, 'public/favicon.svg'));
  const input = join(fixture, 'incoming/photos');
  await mkdir(input, { recursive: true });
  // Large synthetic, uncompressed test frame, never a user portfolio photograph.
  const width = 6000, height = 4000;
  const pixels = Buffer.alloc(width * height * 3);
  let seed = 42;
  for (let i = 0; i < pixels.length; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; pixels[i] = seed >>> 24; }
  const original = join(input, 'large-frame.tiff');
  await sharp(pixels, { raw: { width, height, channels: 3 } }).withMetadata({ orientation: 6 }).tiff({ compression: 'none' }).toFile(original);
  await sharp({ create: { width: 1500, height: 1000, channels: 3, background: '#284d69' } }).jpeg().toFile(join(input, 'second.jpg'));
  await writeFile(join(input, 'large-frame.json'), JSON.stringify({ title: { en: 'Synthetic test frame', zh: '测试图像' }, description: { en: '<script>not executable</script>', zh: '测试说明' } }));
  const before = await stat(original);
  assert(before.size > 25 * 1024 * 1024);
  const run = (command, args) => {
    const result = spawnSync(command, args, { cwd: fixture, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' }, encoding: 'utf8' });
    if (result.status !== 0) throw new Error(result.stdout + result.stderr);
    return result.stdout;
  };
  console.log(run(process.execPath, [join(fixture, 'scripts/prepare-photos.mjs')]));
  const photos = JSON.parse(await readFile(join(fixture, 'src/data/photos.json'), 'utf8'));
  assert.equal(photos.length, 2);
  const first = photos.find(p => p.title.en === 'Synthetic test frame');
  assert.equal(first.width, 1867); assert.equal(first.height, 2800);
  for (const photo of photos) {
    const image = await sharp(join(fixture, 'public', photo.large)).metadata();
    assert(!image.exif && !image.xmp && !image.iptc, 'Private metadata was not stripped');
    assert(image.width <= 2800 && image.height <= 2800);
    assert.equal(new Set(photo.sources.map(s => s.width)).size, photo.sources.length);
  }
  assert.equal((await stat(original)).size, before.size);
  console.log(run('npm', ['run', 'build']));
  server = createServer(async (req, res) => {
    try {
      let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';
      const content = await readFile(join(fixture, 'dist', pathname));
      res.setHeader('Content-Type', pathname.endsWith('.html') ? 'text/html' : pathname.endsWith('.js') ? 'text/javascript' : pathname.endsWith('.css') ? 'text/css' : pathname.endsWith('.webp') ? 'image/webp' : 'application/octet-stream');
      res.end(content);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(4322, '127.0.0.1', resolve));
  browser = await chromium.launch();
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:4322/en/photography/');
    assert.equal(await page.locator('.photo-open').count(), 2);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.locator('.photo-open').first().click();
    await page.waitForFunction(() => document.querySelector('#lightbox').open && document.querySelector('#lightbox-image').complete && document.querySelector('#lightbox-image').naturalWidth > 0);
    assert.equal(await page.locator('#photo-title').textContent(), 'Synthetic test frame');
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#photo-title').textContent(), 'second');
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('#photo-title').textContent(), 'Synthetic test frame');
    assert.equal(await page.locator('#photo-caption').textContent(), '<script>not executable</script>');
    await page.keyboard.press('Escape');
    assert(!(await page.locator('#lightbox').evaluate(d => d.open)));
    assert(await page.locator('.photo-open').first().evaluate(b => b === document.activeElement));
    assert.deepEqual(errors, []);
    await page.close();
  }
  // Invalid metadata must leave the previously generated gallery unchanged.
  const oldManifest = await readFile(join(fixture, 'src/data/photos.json'), 'utf8');
  await writeFile(join(input, 'second.json'), '{invalid');
  const failure = spawnSync(process.execPath, [join(fixture, 'scripts/prepare-photos.mjs')], { cwd: fixture, encoding: 'utf8' });
  assert.notEqual(failure.status, 0);
  assert.equal(await readFile(join(fixture, 'src/data/photos.json'), 'utf8'), oldManifest);
  await writeFile(join(input, 'second.json'), '{"published":false}');
  run(process.execPath, [join(fixture, 'scripts/prepare-photos.mjs')]);
  assert.equal(JSON.parse(await readFile(join(fixture, 'src/data/photos.json'), 'utf8')).length, 1);
  console.log(`Photo QA passed: ${(before.size / 1048576).toFixed(1)} MB TIFF, orientation, metadata stripping, responsive sizes, desktop/mobile lightbox, keyboard/focus, safe text, atomic manifest, unpublishing.`);
} finally {
  await browser?.close();
  await new Promise(resolve => server ? server.close(resolve) : resolve());
  await rm(fixture, { recursive: true, force: true });
}
