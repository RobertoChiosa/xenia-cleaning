<script setup lang="ts">
const props = defineProps<{
  lng: number
  lat: number
  label: string
}>()

// ponytail: Static Images API — un <img>, zero JS. Passare a mapbox-gl solo se serve interazione
const config = useRuntimeConfig()
const MAPBOX_TOKEN = config.public.mapboxAccessToken

const colorMode = useColorMode()

const src = computed(() => {
  const style = colorMode.value === 'dark' ? 'dark-v11' : 'streets-v12'
  const marker = `pin-s+00c16a(${props.lng},${props.lat})`

  return `https://api.mapbox.com/styles/v1/mapbox/${style}/static/${marker}/${props.lng},${props.lat},14,0/640x220@2x?access_token=${MAPBOX_TOKEN}`
})

const directions = computed(() =>
  `https://www.google.com/maps/search/?api=1&query=${props.lat},${props.lng}`)
</script>

<template>
  <div class="rounded-lg border border-default overflow-hidden">
    <div
      v-if="!MAPBOX_TOKEN"
      class="flex items-center gap-2 p-4 text-sm text-muted"
    >
      <UIcon
        name="i-lucide-map-off"
        class="size-4 shrink-0"
      />
      Mappa non disponibile: manca NUXT_PUBLIC_MAPBOX_ACCESS_TOKEN.
    </div>

    <ClientOnly v-else>
      <a
        :href="directions"
        target="_blank"
        rel="noopener"
        class="block relative group"
      >
        <img
          :src="src"
          :alt="`Mappa di ${label}`"
          width="640"
          height="220"
          loading="lazy"
          class="w-full h-40 object-cover"
        >
        <span class="absolute bottom-2 right-2 rounded-md bg-default/90 px-2 py-1 text-xs text-muted group-hover:text-highlighted">
          Apri nelle mappe
        </span>
      </a>

      <template #fallback>
        <USkeleton class="w-full h-40 rounded-none" />
      </template>
    </ClientOnly>
  </div>
</template>
