import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
    functionPerRoute: false,
    edgeMiddleware: false
  }),
  site: 'https://www.brisclothing.com/',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
