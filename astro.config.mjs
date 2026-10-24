// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://yasu-isct.github.io',
  output: 'static',
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'zh', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
