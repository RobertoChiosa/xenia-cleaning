<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { org, properties, memberships } = useOrg()

const connected = computed(() => properties.value.filter(p => p.icsUrl).length)

const stats = computed(() => [
  { label: 'Proprietà', value: String(properties.value.length), hint: `In ${org.value!.name}` },
  { label: 'Calendari collegati', value: `${connected.value}/${properties.value.length}`, hint: 'Con indirizzo iCal impostato' },
  { label: 'Utenti', value: String(memberships.value.length), hint: `In ${org.value!.name}` }
])
</script>

<template>
  <UDashboardPanel id="today">
    <template #header>
      <UDashboardNavbar title="Oggi">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UColorModeButton />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <DashboardStats :items="stats" />

        <PropertyCalendar />
      </div>
    </template>
  </UDashboardPanel>
</template>
