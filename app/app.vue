<script setup lang="ts">
import { it } from '@nuxt/ui/locale'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'it'
  }
})

const title = 'Xenia — Il software gestionale per imprese di pulizia'
const description = 'Pianificazione turni, squadre, rilevazione presenze e fatturazione clienti per imprese di pulizia. Tutto in un unico sistema.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp :locale="it">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
