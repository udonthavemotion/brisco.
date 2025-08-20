import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://brisco-streetwear.netlify.app', // Update with your domain
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
