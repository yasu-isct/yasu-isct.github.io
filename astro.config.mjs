// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yasu-isct.github.io',
  output: 'static',
  integrations: [sitemap({
    i18n: {
      defaultLocale: 'ja',
      locales: { ja: 'ja', zh: 'zh-CN', en: 'en' },
    },
  })],
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'zh', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
