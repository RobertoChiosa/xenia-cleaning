// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/supabase'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      xeniaApiBase: process.env.NUXT_PUBLIC_XENIA_API_URL || 'http://localhost:8080/v1'
    }
  },

  routeRules: {
    '/': { redirect: '/login' }
  },

  compatibilityDate: '2026-06-30',

  // build per Cloudflare Pages: l'output finisce in dist/, che è la cartella che la dashboard pubblica
  nitro: {
    preset: 'cloudflare-pages',
    compressPublicAssets: true,
    minify: true
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  supabase: {
    types: false,
    redirectOptions: {
      login: '/login',
      callback: '/dashboard',
      exclude: ['/forgot-password']
    }
  }
})
