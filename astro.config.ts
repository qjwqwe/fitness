import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';

const site = import.meta.env.PUBLIC_SITE_URL || 'https://fitness.sbnone.dpdns.org';
const base = import.meta.env.PUBLIC_BASE_PATH || '/';

// https://astro.build/config
export default defineConfig({
  site: site,
  base: base === '/' ? undefined : base,
  integrations: [sitemap(), tailwind()],
  output: 'static',
});
