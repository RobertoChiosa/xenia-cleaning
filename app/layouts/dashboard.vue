<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem, NavigationMenuItem } from '@nuxt/ui'

const unassignedJobs = computed(() => jobs.filter(job => job.status === 'Da assegnare').length)
const pendingTimesheets = computed(() => timesheets.filter(sheet => sheet.status === 'Da approvare').length)

const links = computed<NavigationMenuItem[][]>(() => [[{
  label: 'Oggi',
  icon: 'i-lucide-layout-dashboard',
  to: '/dashboard',
  exact: true
}, {
  label: 'Planning',
  icon: 'i-lucide-calendar-days',
  to: '/dashboard/schedule'
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
}, {
  label: 'Cartellini',
  icon: 'i-lucide-clock',
  badge: pendingTimesheets.value || undefined,
  to: '/dashboard/timesheets'
}, {
  label: 'Fatture',
  icon: 'i-lucide-receipt',
  to: '/dashboard/invoices'
}], [{
  label: 'Impostazioni',
  icon: 'i-lucide-settings',
  to: '/dashboard/settings'
}, {
  label: 'Assistenza',
  icon: 'i-lucide-circle-help',
  to: 'mailto:assistenza@xeniaservizi.it',
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
  items: properties.map(property => ({
    label: property.name,
    suffix: `${property.client} · ${property.address}`,
    icon: 'i-lucide-building-2',
    to: `/dashboard/properties/${property.id}`
  }))
}, {
  id: 'operatori',
  label: 'Operatori',
  items: staff.map(member => ({
    label: member.name,
    suffix: `${member.role} · ${member.zone}`,
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
        <NuxtLink
          to="/"
          aria-label="Xenia — vai alla home"
        >
          <AppLogo
            v-if="!collapsed"
            class="w-auto h-6 shrink-0"
          />
          <UIcon
            v-else
            name="i-lucide-sparkles"
            class="size-5 text-primary"
          />
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" />

        <UButton
          :label="collapsed ? undefined : 'Nuovo intervento'"
          icon="i-lucide-plus"
          :block="!collapsed"
          to="/dashboard/jobs"
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
