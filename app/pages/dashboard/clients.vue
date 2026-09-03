<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const search = ref('')

const filtered = computed(() => clients.filter(client =>
  (client.name + client.reference + client.contract).toLowerCase().includes(search.value.toLowerCase())
))

const columns: TableColumn<typeof clients[number]>[] = [
  { accessorKey: 'name', header: 'Cliente' },
  { accessorKey: 'contract', header: 'Contratto' },
  { accessorKey: 'reference', header: 'Referente' },
  { accessorKey: 'properties', header: 'Proprietà' },
  { accessorKey: 'hoursMonth', header: 'Ore/mese' },
  { accessorKey: 'billing', header: 'Importo' },
  { accessorKey: 'status', header: 'Stato' }
]
</script>

<template>
  <UDashboardPanel id="clients">
    <template #header>
      <UDashboardNavbar title="Clienti">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Nuovo cliente"
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
            placeholder="Cerca cliente o referente"
            size="sm"
            class="w-72"
          />
        </template>

        <template #right>
          <UButton
            label="Vedi le proprietà"
            icon="i-lucide-building-2"
            color="neutral"
            variant="outline"
            size="sm"
            to="/dashboard/properties"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <UTable
          :data="filtered"
          :columns="columns"
          empty="Nessun cliente trovato."
        >
          <template #name-cell="{ row }">
            <div class="min-w-0">
              <p class="font-medium text-highlighted truncate">
                {{ row.original.name }}
              </p>
              <p class="text-xs text-muted truncate">
                {{ row.original.email }}
              </p>
            </div>
          </template>

          <template #properties-cell="{ row }">
            <UButton
              :label="`${row.original.properties} proprietà`"
              :to="`/dashboard/properties?client=${row.original.id}`"
              color="neutral"
              variant="subtle"
              size="xs"
              trailing-icon="i-lucide-arrow-right"
            />
          </template>

          <template #status-cell="{ row }">
            <UBadge
              :label="row.original.status"
              :color="clientStatusColor[row.original.status]"
              variant="subtle"
            />
          </template>
        </UTable>
      </UCard>
    </template>
  </UDashboardPanel>
</template>
