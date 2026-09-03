<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const { timesheets } = useOrg()

const week = ref('25 – 31 ago')

// ponytail: tariffe fisse per la stima — spostare sul contratto quando ci sarà il backend
const ORDINARY_RATE = 15
const OVERTIME_RATE = 20

const ordinary = computed(() => sum(timesheets.value, sheet => sheet.ordinary))
const overtime = computed(() => sum(timesheets.value, sheet => sheet.overtime))

const stats = computed(() => [
  { label: 'Ore ordinarie', value: String(ordinary.value), hint: `Settimana ${week.value}` },
  { label: 'Straordinari', value: String(overtime.value), hint: 'Da confermare con i capi squadra' },
  { label: 'Da approvare', value: String(timesheets.value.filter(sheet => sheet.status === 'Da approvare').length), hint: 'Bloccano l\'invio alle paghe' },
  { label: 'Costo del lavoro', value: eur(ordinary.value * ORDINARY_RATE + overtime.value * OVERTIME_RATE), hint: 'Stima sulla settimana' }
])

const columns: TableColumn<typeof timesheets.value[number]>[] = [
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
