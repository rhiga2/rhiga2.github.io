// astro.config.mjs
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://rhiga2.github.io',
  integrations: [preact(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
