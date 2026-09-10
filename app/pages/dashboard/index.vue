<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { jobs } = useOrg()

const todayJobs = computed(() => jobs.value.filter(job => job.date === today))

// prossimi 7 giorni: aiuta a organizzare gli interventi prima che arrivino, non solo oggi
const weekAhead = computed(() => {
  const end = new Date(`${today}T00:00:00`)
  end.setDate(end.getDate() + 7)
  return end.toISOString().slice(0, 10)
})
const upcomingUnassigned = computed(() =>
  jobs.value.filter(job => job.date >= today && job.date <= weekAhead.value && job.status === 'Da assegnare').length)

const stats = computed(() => [
  { label: 'Interventi di oggi', value: String(todayJobs.value.length), hint: `${todayJobs.value.filter(job => job.status === 'Concluso').length} conclusi` },
  { label: 'Da coprire oggi', value: String(todayJobs.value.filter(job => job.status === 'Da assegnare').length), hint: 'Senza operatore assegnato' },
  { label: 'Da coprire nei prossimi 7 giorni', value: String(upcomingUnassigned.value), hint: 'Su tutte le proprietà' }
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

        <PropertyBookingCalendar />
      </div>
    </template>
  </UDashboardPanel>
</template>
