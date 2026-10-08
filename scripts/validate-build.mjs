import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const files = [];
const walk = async directory => { for (const entry of await readdir(directory, { withFileTypes: true })) { const path = join(directory, entry.name); if (entry.isDirectory()) await walk(path); else files.push(path); } };
await walk(dist);
const expected = ['index.html','404.html', ...['en','zh'].flatMap(lang => ['','research/','publications/','photography/','about/'].map(page => `${lang}/${page}index.html`)), 'sitemap.xml'];
for (const path of expected) await stat(join(dist, path));
let links = 0;
for (const file of files.filter(p => p.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), 'https://astro-zhurui.github.io');
    const path = decodeURIComponent(url.pathname);
    const target = resolve(dist, '.' + path);
    if (!target.startsWith(dist + '/') && target !== dist) throw new Error(`Invalid local URL: ${path}`);
    await stat(path.endsWith('/') ? join(target, 'index.html') : target);
    links++;
  }
  // Explicitly keep private CV content and unapproved projects out of the build.
  for (const term of ['Counterpart Identification and Classification', 'In preparation', 'EP-FXT', 'AstroKit', '/incoming/', '手机号码', '身份证']) if (html.includes(term)) throw new Error(`Unapproved / private content in ${file}: ${term}`);
}
const manifest = JSON.parse(await readFile(join(root, 'src/data/photos.json'), 'utf8'));
for (const photo of manifest) for (const source of photo.sources) await stat(join(dist, source.src));
const bytes = (await Promise.all(files.map(async p => (await stat(p)).size))).reduce((a, b) => a + b, 0);
if (bytes >= 1_000_000_000) throw new Error('Published site exceeds GitHub Pages size limit.');
console.log(`Validated: ${expected.length} required files, ${links} local links, ${manifest.length} photographs, ${(bytes / 1048576).toFixed(2)} MB.`);
