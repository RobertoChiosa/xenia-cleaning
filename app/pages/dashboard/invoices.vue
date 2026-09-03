<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const status = ref('Tutti gli stati')

const filtered = computed(() => status.value === 'Tutti gli stati'
  ? invoices
  : invoices.filter(invoice => invoice.status === status.value))

const stats = [
  { label: 'Fatturato agosto', value: '€ 20.700', hint: '4 fatture' },
  { label: 'In bozza', value: '€ 12.480', hint: 'Da completare e inviare' },
  { label: 'Scaduto', value: '€ 8.100', hint: 'Comune di Sesto · 3 giorni' },
  { label: 'Incassato', value: '€ 16.800', hint: 'Ultimi 30 giorni' }
]

const columns: TableColumn<typeof invoices[number]>[] = [
  { accessorKey: 'number', header: 'Numero' },
  { accessorKey: 'client', header: 'Cliente' },
  { accessorKey: 'period', header: 'Periodo' },
  { accessorKey: 'hours', header: 'Ore' },
  { accessorKey: 'amount', header: 'Importo' },
  { accessorKey: 'due', header: 'Scadenza' },
  { accessorKey: 'status', header: 'Stato' },
  { id: 'actions' }
]
</script>

<template>
  <UDashboardPanel id="invoices">
    <template #header>
      <UDashboardNavbar title="Fatture">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Genera da interventi"
            icon="i-lucide-file-plus"
            size="sm"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <USelect
            v-model="status"
            size="sm"
            :items="['Tutti gli stati', 'Bozza', 'Inviata', 'Pagata', 'Scaduta']"
          />
        </template>

        <template #right>
          <UButton
            label="Esporta XML"
            icon="i-lucide-download"
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
            :data="filtered"
            :columns="columns"
            empty="Nessuna fattura con questo stato."
          >
            <template #status-cell="{ row }">
              <UBadge
                :label="row.original.status"
                :color="docStatusColor[row.original.status]"
                variant="subtle"
              />
            </template>

            <template #actions-cell="{ row }">
              <UButton
                :label="row.original.status === 'Bozza' ? 'Completa' : 'Apri'"
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
