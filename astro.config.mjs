import { defineConfig } from 'astro/config';

export default defineConfig({
  outDir: './deploy',
  build: {
    assets: '_assets'
  }
});
