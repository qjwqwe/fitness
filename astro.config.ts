import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';

const site = import.meta.env.PUBLIC_SITE_URL || 'https://qjwqwe.github.io';
const base = import.meta.env.PUBLIC_BASE_PATH || '/fitness';

// https://astro.build/config
export default defineConfig({
  site: site,
  base: base === '/' ? undefined : base,
  integrations: [sitemap(), tailwind()],
  output: 'static',
});
