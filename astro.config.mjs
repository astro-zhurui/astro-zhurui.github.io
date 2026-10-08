import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://astro-zhurui.github.io',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  server: { port: 4321 },
});
