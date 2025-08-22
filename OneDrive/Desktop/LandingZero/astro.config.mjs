import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/static';

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [tailwind()],
  output: 'static',
  site: 'https://zeromotionmarketing.com',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
