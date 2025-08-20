import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://brisco.vercel.app', // Vercel production domain
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
