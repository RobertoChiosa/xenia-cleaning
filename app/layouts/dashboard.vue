<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem, NavigationMenuItem } from '@nuxt/ui'

const { org, orgsPending, properties, memberships } = useOrg()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

async function onLogout() {
  await supabase.auth.signOut()
  return navigateTo('/login')
}

const links = computed<NavigationMenuItem[][]>(() => [[{
  label: 'Oggi',
  icon: 'i-lucide-layout-dashboard',
  to: '/dashboard',
  exact: true
}, {
  label: 'Utenti',
  icon: 'i-lucide-users',
  to: '/dashboard/users'
}, {
  label: 'Proprietà',
  icon: 'i-lucide-building-2',
  to: '/dashboard/properties'
}], [{
  label: 'Impostazioni',
  icon: 'i-lucide-settings',
  to: '/dashboard/settings'
}, {
  label: 'Assistenza',
  icon: 'i-lucide-circle-help',
  to: 'mailto:assistenza@perfectclean.it',
  target: '_blank'
}]])

const searchGroups = computed<CommandPaletteGroup<CommandPaletteItem>[]>(() => [{
  id: 'sezioni',
  label: 'Sezioni',
  items: links.value.flat().map(link => ({
    label: link.label,
    icon: link.icon,
    to: link.to
  }))
}, {
  id: 'proprieta',
  label: 'Proprietà',
  items: properties.value.map(property => ({
    label: property.name,
    icon: 'i-lucide-building-2',
    to: `/dashboard/properties/${property.id}`
  }))
}, {
  id: 'utenti',
  label: 'Utenti',
  items: memberships.value.map(member => ({
    label: member.user?.email ?? member.userId,
    suffix: member.role,
    icon: 'i-lucide-user',
    to: '/dashboard/users'
  }))
}])
</script>

<template>
  <div
    v-if="orgsPending"
    class="flex h-screen items-center justify-center"
  >
    <UIcon
      name="i-lucide-loader-circle"
      class="size-6 animate-spin text-muted"
    />
  </div>

  <div
    v-else-if="!org"
    class="flex h-screen flex-col items-center justify-center gap-4 px-4 text-center"
  >
    <UIcon
      name="i-lucide-building-2"
      class="size-10 text-dimmed"
    />
    <div class="space-y-1">
      <h1 class="text-lg font-semibold text-highlighted">
        Nessuna organizzazione
      </h1>
      <p class="text-sm text-muted max-w-sm">
        Il tuo account non è ancora collegato a nessuna organizzazione. Chiedi a un amministratore di invitarti, oppure creane una tramite l'API.
      </p>
    </div>
    <UButton
      label="Esci"
      icon="i-lucide-log-out"
      color="neutral"
      variant="subtle"
      @click="onLogout"
    />
  </div>

  <UDashboardGroup v-else>
    <UDashboardSidebar
      collapsible
      resizable
    >
      <template #header="{ collapsed }">
        <OrgSwitcher :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" />

        <UNavigationMenu
          :items="links"
          :collapsed="collapsed"
          orientation="vertical"
          class="mt-2"
        />
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu
          :items="[[{ label: 'Impostazioni', icon: 'i-lucide-settings', to: '/dashboard/settings' }], [{ label: 'Esci', icon: 'i-lucide-log-out', onSelect: onLogout }]]"
          :content="{ align: 'start' }"
        >
          <UButton
            :label="collapsed ? undefined : (user?.email ?? 'Account')"
            :avatar="{ alt: user?.email ?? 'Account' }"
            color="neutral"
            variant="ghost"
            :block="!collapsed"
            :ui="{ base: 'justify-start' }"
          />
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <slot />

    <UDashboardSearch
      placeholder="Cerca una sezione, una proprietà o un operatore…"
      :groups="searchGroups"
    />
  </UDashboardGroup>
</template>
