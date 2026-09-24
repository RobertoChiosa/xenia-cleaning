<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const { properties } = useOrg()

const search = ref('')

const filtered = computed(() => properties.value.filter(property =>
  (property.name + (property.address ?? '')).toLowerCase().includes(search.value.toLowerCase())))

const columns: TableColumn<typeof properties.value[number]>[] = [
  { accessorKey: 'name', header: 'Proprietà' },
  { accessorKey: 'address', header: 'Indirizzo' },
  { id: 'calendar', header: 'Calendario' },
  { id: 'actions' }
]
</script>

<template>
  <UDashboardPanel id="properties">
    <template #header>
      <UDashboardNavbar title="Proprietà">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Cerca proprietà o indirizzo"
            size="sm"
            class="w-72"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <UTable
          :data="filtered"
          :columns="columns"
          empty="Nessuna proprietà corrisponde alla ricerca."
        >
          <template #name-cell="{ row }">
            <ULink
              :to="`/dashboard/properties/${row.original.id}`"
              class="font-medium text-highlighted"
            >
              {{ row.original.name }}
            </ULink>
          </template>

          <template #address-cell="{ row }">
            <span class="text-muted truncate">{{ row.original.address }}</span>
          </template>

          <template #calendar-cell="{ row }">
            <UBadge
              :label="row.original.icsUrl ? 'Collegato' : 'Non collegato'"
              :color="row.original.icsUrl ? 'success' : 'neutral'"
              variant="subtle"
            />
          </template>

          <template #actions-cell="{ row }">
            <UButton
              label="Apri"
              :to="`/dashboard/properties/${row.original.id}`"
              color="neutral"
              variant="subtle"
              size="xs"
            />
          </template>
        </UTable>

        <template #footer>
          <p class="text-sm text-muted">
            {{ filtered.length }} proprietà su {{ properties.length }}
          </p>
        </template>
      </UCard>
    </template>
  </UDashboardPanel>
</template>
