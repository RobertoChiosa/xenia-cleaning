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
    // su Cloudflare la anon key è esposta come NUXT_PUBLIC_SUPABASE_ANON_KEY,
    // il modulo di default cerca NUXT_PUBLIC_SUPABASE_KEY
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
    types: false,
    redirectOptions: {
      login: '/login',
      callback: '/dashboard',
      exclude: ['/forgot-password']
    }
  }
})
