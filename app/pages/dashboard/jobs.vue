<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const { jobs } = useOrg()

const search = ref('')
const status = ref('Tutti gli stati')

const filtered = computed(() => jobs.value.filter(job =>
  (status.value === 'Tutti gli stati' || job.status === status.value)
  && (job.property + job.client + job.crew + job.id).toLowerCase().includes(search.value.toLowerCase())
))

// ponytail: solo UI — le azioni distruttive vanno confermate con UModal quando ci sarà il backend
function rowActions(job: typeof jobs.value[number]): DropdownMenuItem[][] {
  return [[{
    label: 'Apri la proprietà',
    icon: 'i-lucide-building-2',
    to: `/dashboard/properties/${job.propertyId}`
  }, {
    label: 'Assegna la squadra',
    icon: 'i-lucide-user-plus',
    to: `/dashboard/properties/${job.propertyId}`
  }], [{
    label: 'Annulla intervento',
    icon: 'i-lucide-x',
    color: 'error' as const,
    disabled: job.status === 'Concluso' || job.status === 'Annullato'
  }]]
}

const columns: TableColumn<typeof jobs.value[number]>[] = [
  { accessorKey: 'id', header: 'Codice' },
  { accessorKey: 'date', header: 'Data' },
  { accessorKey: 'window', header: 'Fascia' },
  { accessorKey: 'property', header: 'Proprietà' },
  { accessorKey: 'client', header: 'Cliente' },
  { accessorKey: 'crew', header: 'Squadra' },
  { accessorKey: 'hours', header: 'Ore' },
  { accessorKey: 'status', header: 'Stato' },
  { id: 'actions' }
]
</script>

<template>
  <UDashboardPanel id="jobs">
    <template #header>
      <UDashboardNavbar title="Interventi">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Nuovo intervento"
            icon="i-lucide-plus"
            size="sm"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Cerca per proprietà, cliente o codice"
            size="sm"
            class="w-72"
          />
        </template>

        <template #right>
          <USelect
            v-model="status"
            size="sm"
            :items="['Tutti gli stati', 'Da assegnare', 'Programmato', 'In corso', 'Concluso', 'Annullato']"
          />
          <UButton
            label="Esporta"
            icon="i-lucide-download"
            color="neutral"
            variant="outline"
            size="sm"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <UTable
          :data="filtered"
          :columns="columns"
          empty="Nessun intervento corrisponde ai filtri."
        >
          <template #status-cell="{ row }">
            <UBadge
              :label="row.original.status"
              :color="jobStatusColor[row.original.status]"
              variant="subtle"
            />
          </template>

          <template #property-cell="{ row }">
            <ULink
              :to="`/dashboard/properties/${row.original.propertyId}`"
              class="font-medium text-highlighted"
            >
              {{ row.original.property }}
            </ULink>
          </template>

          <template #crew-cell="{ row }">
            <span :class="row.original.crew === 'Da assegnare' ? 'text-warning' : ''">
              {{ row.original.crew }}
            </span>
          </template>

          <template #actions-cell="{ row }">
            <UDropdownMenu :items="rowActions(row.original)">
              <UButton
                icon="i-lucide-ellipsis-vertical"
                color="neutral"
                variant="ghost"
                size="xs"
                aria-label="Azioni"
              />
            </UDropdownMenu>
          </template>
        </UTable>

        <template #footer>
          <p class="text-sm text-muted">
            {{ filtered.length }} interventi su {{ jobs.length }}
          </p>
        </template>
      </UCard>
    </template>
  </UDashboardPanel>
</template>
