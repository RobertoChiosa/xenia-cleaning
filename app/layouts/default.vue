<script setup lang="ts">
const links = [
  { label: 'Funzionalità', to: '/#features' },
  { label: 'Come funziona', to: '/#how-it-works' }
]
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          aria-label="Xenia — vai alla home"
          class="focus-visible:outline-3 outline-primary/25 rounded-md p-1 -ms-1"
        >
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>
      </template>

      <UNavigationMenu :items="links" />

      <template #right>
        <UColorModeButton />

        <UButton
          to="/login"
          label="Accedi"
          color="neutral"
          variant="ghost"
        />

        <UButton
          to="/login"
          label="Richiedi una demo"
        />
      </template>

      <template #body>
        <UNavigationMenu
          :items="links"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          © {{ new Date().getFullYear() }} Xenia
        </p>
      </template>

      <template #right>
        <UButton
          icon="i-lucide-mail"
          aria-label="Email"
          color="neutral"
          variant="ghost"
          to="mailto:info@xenia.it"
        />
        <UButton
          icon="i-simple-icons-linkedin"
          aria-label="LinkedIn"
          color="neutral"
          variant="ghost"
          to="#"
        />
      </template>
    </UFooter>
  </div>
</template>
