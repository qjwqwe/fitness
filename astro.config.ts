import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://fitness.sbnone.dpdns.org',
  integrations: [tailwind()],
  output: 'static',
  build: {
    format: 'directory',
  },
});
