<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{ title: string }>()

const tabs: NavigationMenuItem[] = [
  { label: 'Company', icon: 'i-lucide-building-2', to: '/dashboard/settings/company' },
  { label: 'Utenti', icon: 'i-lucide-users', to: '/dashboard/settings/users' },
  { label: 'Notifiche', icon: 'i-lucide-bell', to: '/dashboard/settings/notifications' }
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
