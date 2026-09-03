<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{ title: string }>()

const tabs: NavigationMenuItem[] = [
  { label: 'Azienda', icon: 'i-lucide-building-2', to: '/dashboard/settings/azienda' },
  { label: 'Utenti', icon: 'i-lucide-users', to: '/dashboard/settings/utenti' },
  { label: 'Notifiche', icon: 'i-lucide-bell', to: '/dashboard/settings/notifiche' }
]
</script>

<template>
  <UDashboardPanel id="settings">
    <template #header>
      <UDashboardNavbar :title="title">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <slot name="actions" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UNavigationMenu
          :items="tabs"
          highlight
          class="-mb-px"
        />
      </UDashboardToolbar>
    </template>

    <template #body>
      <slot />
    </template>
  </UDashboardPanel>
</template>
