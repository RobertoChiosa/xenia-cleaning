<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const { invoices } = useOrg()

const status = ref('Tutti gli stati')

const filtered = computed(() => status.value === 'Tutti gli stati'
  ? invoices.value
  : invoices.value.filter(invoice => invoice.status === status.value))

const byStatus = (status: string) => computed(() => invoices.value.filter(invoice => invoice.status === status))

const august = computed(() => invoices.value.filter(invoice => invoice.period === 'Agosto 2026'))
const drafts = byStatus('Bozza')
const overdue = byStatus('Scaduta')
const paid = byStatus('Pagata')

const stats = computed(() => [
  { label: 'Fatturato agosto', value: eur(sum(august.value, invoice => invoice.total)), hint: `${august.value.length} fatture` },
  { label: 'In bozza', value: eur(sum(drafts.value, invoice => invoice.total)), hint: 'Da completare e inviare' },
  { label: 'Scaduto', value: eur(sum(overdue.value, invoice => invoice.total)), hint: overdue.value.map(invoice => invoice.client).join(', ') || 'Nessun insoluto' },
  { label: 'Incassato', value: eur(sum(paid.value, invoice => invoice.total)), hint: 'Fatture saldate' }
])

const columns: TableColumn<typeof invoices.value[number]>[] = [
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
