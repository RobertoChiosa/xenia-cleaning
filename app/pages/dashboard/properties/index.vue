<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const { properties, clients, jobs } = useOrg()

const route = useRoute()
const search = ref('')
const client = ref((route.query.client as string) || 'tutti')
const operator = route.query.operator as string | undefined

const clientItems = [
  { label: 'Tutti i clienti', value: 'tutti' },
  ...clients.value.map(item => ({ label: item.name, value: item.id }))
]

// un operatore "lavora" su una proprietà se ha almeno un intervento lì, non per un'assegnazione fissa
const worksOn = (propertyId: string, name: string) =>
  jobs.value.some(job => job.propertyId === propertyId && crewNames(job.crew).includes(name))

const filtered = computed(() => properties.value.filter(property =>
  (client.value === 'tutti' || property.clientId === client.value)
  && (!operator || worksOn(property.id, operator))
  && (property.name + property.client + property.address).toLowerCase().includes(search.value.toLowerCase())
))

const columns: TableColumn<typeof properties.value[number]>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Proprietà' },
  { accessorKey: 'address', header: 'Indirizzo' },
  { accessorKey: 'clientId', header: 'ID cliente' },
  { accessorKey: 'client', header: 'Cliente' },
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

        <template #right>
          <UButton
            label="Nuova proprietà"
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
            placeholder="Cerca proprietà o indirizzo"
            size="sm"
            class="w-72"
          />
        </template>

        <template #right>
          <USelect
            v-model="client"
            :items="clientItems"
            size="sm"
            class="w-52"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="space-y-4">
        <UAlert
          v-if="operator"
          :title="`Proprietà assegnate a ${operator}`"
          icon="i-lucide-user-check"
          color="neutral"
          variant="subtle"
          :actions="[{
            label: 'Mostra tutte',
            to: '/dashboard/properties',
            color: 'neutral',
            variant: 'subtle'
          }]"
        />

        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <UTable
            :data="filtered"
            :columns="columns"
            empty="Nessuna proprietà corrisponde ai filtri."
          >
            <template #id-cell="{ row }">
              <span class="font-mono text-xs text-dimmed">{{ row.original.id }}</span>
            </template>

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

            <template #clientId-cell="{ row }">
              <span class="font-mono text-xs text-dimmed">{{ row.original.clientId }}</span>
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
      </div>
    </template>
  </UDashboardPanel>
</template>
