import { defineConfig } from 'astro/config'

import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://rhiga2.github.io',
  integrations: [preact()],
})