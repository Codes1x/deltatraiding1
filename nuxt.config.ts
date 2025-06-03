// https://nuxt.com/docs/api/configuration/nuxt-config  
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
        {
          name: 'data-telegram-web-app',
          content: 'https://t.me/timures_tma_bot/tma_timures',
        },
      ],
      script: [{ src: '/lib/telegram-web-app.js' }],
    },
  },
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxtjs/i18n'],
  i18n: {
    vueI18n: './i18n.config.ts',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English'
      },
      {
        code: 'ru',
        name: 'Русский'
      },
    ]
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  plugins: [
    '@/plugins/maska.client.ts',
    '@/plugins/apexcharts.client.ts'
  ],
  css: [
    '@/assets/fonts.css',
    '@/assets/normalize.css',
    '@/assets/global.css',
    '@egjs/vue3-flicking/dist/flicking.css',
  ],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: false,

  alias: {
    '@charts': resolve(__dirname, 'components/chart'),
  },

  vite: {
    plugins: [
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
    optimizeDeps: {
      include: ['echarts', 'vue-echarts'],
    },
  },
})
