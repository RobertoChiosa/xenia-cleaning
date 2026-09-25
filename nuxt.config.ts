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
      // override: NUXT_PUBLIC_XENIA_API_BASE
      xeniaApiBase: 'http://localhost:8080/v1'
    }
  },

  routeRules: {
    '/': { redirect: '/login' }
  },

  compatibilityDate: '2026-06-30',

  // build per Cloudflare Workers con asset statici: deployConfig fa generare a nitro il
  // wrangler.json dell'output (binding ASSETS e nodejs_compat inclusi), così non c'è una
  // seconda copia della configurazione da tenere allineata a mano
  nitro: {
    preset: 'cloudflare-module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      // senza questo nitro inventa un nome dal repo (robertochiosa-xenia-cleaning)
      wrangler: {
        name: 'xenia-cleaning'
      }
    },
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
