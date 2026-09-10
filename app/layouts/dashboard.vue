<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem, NavigationMenuItem } from '@nuxt/ui'

const { jobs, bookings, properties, users } = useOrg()

const unassignedJobs = computed(() => jobs.value.filter(job => job.status === 'Da assegnare').length)
const pendingCheckouts = computed(() => bookings.value.filter(booking => !booking.jobId && bookingStatus(booking) === 'Da liberare').length)

const links = computed<NavigationMenuItem[][]>(() => [[{
  label: 'Oggi',
  icon: 'i-lucide-layout-dashboard',
  to: '/dashboard',
  exact: true
}, {
  label: 'Prenotazioni',
  icon: 'i-lucide-calendar-check',
  badge: pendingCheckouts.value || undefined,
  to: '/dashboard/bookings'
}, {
  label: 'Interventi',
  icon: 'i-lucide-clipboard-list',
  badge: unassignedJobs.value || undefined,
  to: '/dashboard/jobs'
}, {
  label: 'Operatori',
  icon: 'i-lucide-users',
  to: '/dashboard/staff'
}, {
  label: 'Clienti',
  icon: 'i-lucide-briefcase',
  to: '/dashboard/clients'
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
    suffix: `${property.client} · ${property.address}`,
    icon: 'i-lucide-building-2',
    to: `/dashboard/properties/${property.id}`
  }))
}, {
  id: 'operatori',
  label: 'Operatori',
  items: users.value.map(member => ({
    label: member.name,
    suffix: member.phone,
    icon: 'i-lucide-user',
    to: `/dashboard/properties?operator=${member.name}`
  }))
}])
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      resizable
    >
      <template #header="{ collapsed }">
        <OrgSwitcher :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" />

        <UButton
          :label="collapsed ? undefined : 'Nuova prenotazione'"
          icon="i-lucide-plus"
          :block="!collapsed"
          to="/dashboard/bookings"
        />

        <UNavigationMenu
          :items="links"
          :collapsed="collapsed"
          orientation="vertical"
          class="mt-2"
        />
      </template>

      <template #footer="{ collapsed }">
        <UButton
          :label="collapsed ? undefined : 'Roberto B.'"
          :avatar="{ alt: 'Roberto B.' }"
          color="neutral"
          variant="ghost"
          :block="!collapsed"
          :ui="{ base: 'justify-start' }"
          to="/dashboard/settings"
        />
      </template>
    </UDashboardSidebar>

    <slot />

    <UDashboardSearch
      placeholder="Cerca una sezione, una proprietà o un operatore…"
      :groups="searchGroups"
    />
  </UDashboardGroup>
</template>
