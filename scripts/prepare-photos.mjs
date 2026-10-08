import { readdir, readFile, mkdir, rename, stat, rm, realpath } from 'node:fs/promises';
import { basename, extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { availableParallelism } from 'node:os';
import sharp from 'sharp';

// One photo at a time, up to two libvips threads: predictable memory on a laptop.
sharp.concurrency(Math.min(2, availableParallelism()));
sharp.cache({ memory: 64, files: 0, items: 20 });
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const input = join(root, 'incoming/photos');
const output = join(root, 'public/photos');
const manifest = join(root, 'src/data/photos.json');
const supported = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp', '.avif']);
const extensions = new Set(['.arw', '.cr2', '.cr3', '.nef', '.dng', '.heic', '.heif']);
const entries = await readdir(input, { withFileTypes: true });
const files = entries
  .filter((f) => f.isFile() && supported.has(extname(f.name).toLowerCase()))
  .sort((a, b) => a.name.localeCompare(b.name));
const started = performance.now();
const records = [];
const bilingual = (value, fallback = '') => {
  if (value == null) return { en: fallback, zh: fallback };
  if (typeof value === 'string') return { en: value, zh: value };
  if (typeof value !== 'object' || typeof value.en !== 'string' || typeof value.zh !== 'string')
    throw new Error('Metadata requires en and zh strings.');
  return { en: value.en, zh: value.zh };
};
await mkdir(output, { recursive: true });
for (const entry of entries)
  if (extensions.has(extname(entry.name).toLowerCase()))
    console.log(`Skipped ${entry.name}: export to JPEG or TIFF first.`);
for (const [index, file] of files.entries()) {
  const original = join(input, file.name);
  if (!(await realpath(original)).startsWith((await realpath(input)) + '/'))
    throw new Error('Photo must be inside incoming/photos.');
  const stem = basename(file.name, extname(file.name));
  let metadata = {};
  try {
    metadata = JSON.parse(await readFile(join(input, `${stem}.json`), 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (metadata.published === false) {
    console.log(`Skipped ${file.name}: published=false.`);
    continue;
  }
  // Stable safe IDs even for Chinese names; originals are never copied to public/.
  const id = createHash('sha256').update(file.name).digest('hex').slice(0, 16);
  const destination = join(output, id);
  await mkdir(destination, { recursive: true });
  const sources = [];
  let dimensions;
  for (const size of [480, 960, 1600, 2800]) {
    const target = join(destination, `${size}.webp`);
    const temporary = `${target}.part`;
    const info = await sharp(original, { limitInputPixels: 120_000_000 })
      .rotate()
      .resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
      .toColourspace('srgb')
      .webp({ quality: size === 2800 ? 90 : 85, effort: 4 })
      .toFile(temporary);
    await rename(temporary, target);
    dimensions = { width: info.width, height: info.height };
    sources.push({ src: `/photos/${id}/${size}.webp`, width: info.width });
  }
  // srcset width descriptors refer to actual width, including portrait photos.
  const unique = [...new Map(sources.map((s) => [s.width, s])).values()].sort(
    (a, b) => a.width - b.width,
  );
  records.push({
    id,
    title: bilingual(metadata.title, stem),
    description: bilingual(metadata.description),
    location: bilingual(metadata.location),
    album: bilingual(metadata.album),
    date: typeof metadata.date === 'string' ? metadata.date : '',
    ...dimensions,
    thumb: `/photos/${id}/960.webp`,
    large: `/photos/${id}/2800.webp`,
    sources: unique,
  });
  const originalBytes = (await stat(original)).size;
  const largeBytes = (await stat(join(destination, '2800.webp'))).size;
  console.log(
    `[${index + 1}/${files.length}] ${file.name} | ${(originalBytes / 1048576).toFixed(1)} MB → ${(largeBytes / 1024).toFixed(0)} KB`,
  );
}
// Commit the complete gallery atomically; do not replace it after a failed import.
const { writeFile } = await import('node:fs/promises');
await writeFile(`${manifest}.part`, JSON.stringify(records, null, 2) + '\n');
await rename(`${manifest}.part`, manifest);
// Remove only derivative folders created by this script and no longer selected.
const active = new Set(records.map((p) => p.id));
for (const entry of await readdir(output, { withFileTypes: true })) {
  if (entry.isDirectory() && /^[a-f0-9]{16}$/.test(entry.name) && !active.has(entry.name))
    await rm(join(output, entry.name), { recursive: true });
}
console.log(
  `Ready: ${records.length} photographs | ${((performance.now() - started) / 1000).toFixed(1)} s. Originals unchanged.`,
);
