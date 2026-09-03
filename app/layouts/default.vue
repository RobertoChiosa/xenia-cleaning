<script setup lang="ts">
const links = [
  { label: 'Features', to: '/#features' },
  { label: 'How it works', to: '/#how-it-works' }
]
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
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
          label="Log in"
          color="neutral"
          variant="ghost"
        />

        <UButton
          to="/login"
          label="Book a demo"
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
          © {{ new Date().getFullYear() }} Xenia Cleaning
        </p>
      </template>

      <template #right>
        <UButton
          icon="i-lucide-mail"
          aria-label="Email"
          color="neutral"
          variant="ghost"
          to="mailto:hello@xeniacleaning.com"
        />
        <UButton
          icon="i-simple-icons-instagram"
          aria-label="Instagram"
          color="neutral"
          variant="ghost"
          to="#"
        />
      </template>
    </UFooter>
  </div>
</template>
