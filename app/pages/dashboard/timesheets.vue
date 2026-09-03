<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const week = ref('25 – 31 ago')

const stats = [
  { label: 'Ore ordinarie', value: '234', hint: 'Settimana al 31 agosto' },
  { label: 'Straordinari', value: '11', hint: 'Da confermare con i capi squadra' },
  { label: 'Da approvare', value: '3', hint: 'Bloccano l\'invio alle paghe' },
  { label: 'Costo del lavoro', value: '€ 3.860', hint: 'Stima sulla settimana' }
]

const columns: TableColumn<typeof timesheets[number]>[] = [
  { accessorKey: 'staff', header: 'Operatore' },
  { accessorKey: 'week', header: 'Settimana' },
  { accessorKey: 'jobs', header: 'Interventi' },
  { accessorKey: 'ordinary', header: 'Ore ordinarie' },
  { accessorKey: 'overtime', header: 'Straordinari' },
  { accessorKey: 'status', header: 'Stato' },
  { id: 'actions' }
]
</script>

<template>
  <UDashboardPanel id="timesheets">
    <template #header>
      <UDashboardNavbar title="Cartellini">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Invia alle paghe"
            icon="i-lucide-upload"
            size="sm"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <USelect
            v-model="week"
            size="sm"
            :items="['25 – 31 ago', '18 – 24 ago', '11 – 17 ago', '4 – 10 ago']"
          />
        </template>

        <template #right>
          <UButton
            label="Approva tutti"
            icon="i-lucide-check-check"
            color="neutral"
            variant="outline"
            size="sm"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <DashboardStats :items="stats" />

        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <UTable
            :data="timesheets"
            :columns="columns"
            empty="Nessun cartellino per questa settimana."
          >
            <template #staff-cell="{ row }">
              <div class="flex items-center gap-2">
                <UAvatar
                  :alt="row.original.staff"
                  size="xs"
                />
                <span class="font-medium text-highlighted">{{ row.original.staff }}</span>
              </div>
            </template>

            <template #overtime-cell="{ row }">
              <span :class="row.original.overtime > 0 ? 'text-warning' : 'text-muted'">
                {{ row.original.overtime }} h
              </span>
            </template>

            <template #status-cell="{ row }">
              <UBadge
                :label="row.original.status"
                :color="docStatusColor[row.original.status]"
                variant="subtle"
              />
            </template>

            <template #actions-cell="{ row }">
              <UButton
                v-if="row.original.status === 'Da approvare'"
                label="Approva"
                color="neutral"
                variant="subtle"
                size="xs"
              />
            </template>
          </UTable>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
