import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://astro-zhurui.github.io',
  output: 'static',
  outDir: './.local/build',
  cacheDir: './.local/cache',
  trailingSlash: 'always',
  build: { format: 'directory' },
  server: { port: 4321 },
});
