<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const { properties, clients } = useOrg()

const route = useRoute()
const search = ref('')
const client = ref((route.query.client as string) || 'tutti')
const operator = route.query.operator as string | undefined

const clientItems = [
  { label: 'Tutti i clienti', value: 'tutti' },
  ...clients.value.map(item => ({ label: item.name, value: item.id }))
]

const filtered = computed(() => properties.value.filter(property =>
  (client.value === 'tutti' || property.clientId === client.value)
  && (!operator || property.assigned.includes(operator))
  && (property.name + property.client + property.address).toLowerCase().includes(search.value.toLowerCase())
))

const unassigned = computed(() => properties.value.filter(property => !property.assigned.length))

const columns: TableColumn<typeof properties.value[number]>[] = [
  { accessorKey: 'name', header: 'Proprietà' },
  { accessorKey: 'client', header: 'Cliente' },
  { id: 'availability', header: 'Piano di servizio' },
  { accessorKey: 'assigned', header: 'Operatori assegnati' },
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

        <UAlert
          v-if="unassigned.length"
          :title="`${unassigned.length} proprietà senza operatori assegnati`"
          :description="unassigned.map(property => property.name).join(' · ')"
          icon="i-lucide-user-x"
          color="warning"
          variant="subtle"
          :actions="[{
            label: 'Assegna ora',
            to: `/dashboard/properties/${unassigned[0]?.id}`,
            color: 'warning',
            variant: 'subtle'
          }]"
        />

        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <UTable
            :data="filtered"
            :columns="columns"
            empty="Nessuna proprietà corrisponde ai filtri."
          >
            <template #name-cell="{ row }">
              <div class="min-w-0">
                <ULink
                  :to="`/dashboard/properties/${row.original.id}`"
                  class="font-medium text-highlighted"
                >
                  {{ row.original.name }}
                </ULink>
                <p class="text-xs text-muted truncate">
                  {{ row.original.address }}
                </p>
              </div>
            </template>

            <template #availability-cell="{ row }">
              <span class="tabular-nums">{{ row.original.from }} – {{ row.original.to }}</span>
            </template>

            <template #assigned-cell="{ row }">
              <div
                v-if="row.original.assigned.length"
                class="flex items-center gap-2"
              >
                <UAvatarGroup size="xs">
                  <UAvatar
                    v-for="member in row.original.assigned"
                    :key="member"
                    :alt="member"
                  />
                </UAvatarGroup>
                <span class="text-xs text-muted">
                  {{ row.original.assigned.join(', ') }}
                </span>
              </div>
              <UBadge
                v-else
                label="Da assegnare"
                color="warning"
                variant="subtle"
              />
            </template>

            <template #actions-cell="{ row }">
              <UButton
                :label="row.original.assigned.length ? 'Apri' : 'Assegna'"
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
