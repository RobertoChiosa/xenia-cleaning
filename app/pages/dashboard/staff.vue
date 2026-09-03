<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const { staff, properties, timesheets } = useOrg()

const search = ref('')

const filtered = computed(() => staff.value.filter(member =>
  (member.name + member.state).toLowerCase().includes(search.value.toLowerCase())
))

const propertiesOf = (name: string) =>
  properties.value.filter(property => property.assigned.includes(name))

const covered = computed(() => properties.value.filter(property => property.assigned.length).length)

const stats = computed(() => [
  { label: 'Operatori attivi', value: String(staff.value.length), hint: `${staff.value.filter(member => member.state === 'In servizio').length} in servizio oggi` },
  { label: 'Senza proprietà', value: String(staff.value.filter(member => !propertiesOf(member.name).length).length), hint: 'Operatori non ancora assegnati' },
  { label: 'Straordinari', value: `${sum(timesheets.value, sheet => sheet.overtime)} h`, hint: 'Settimana al 31 agosto' },
  { label: 'Proprietà coperte', value: `${covered.value}/${properties.value.length}`, hint: 'Con almeno un operatore assegnato' }
])

const columns: TableColumn<typeof staff.value[number]>[] = [
  { accessorKey: 'name', header: 'Operatore' },
  { id: 'properties', header: 'Proprietà assegnate' },
  { accessorKey: 'state', header: 'Stato' },
  { accessorKey: 'detail', header: 'Dove' }
]
</script>

<template>
  <UDashboardPanel id="staff">
    <template #header>
      <UDashboardNavbar title="Operatori">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Nuovo operatore"
            icon="i-lucide-user-plus"
            size="sm"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Cerca operatore o zona"
            size="sm"
            class="w-72"
          />
        </template>

        <template #right>
          <UButton
            label="Disponibilità"
            icon="i-lucide-calendar-check"
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
            empty="Nessun operatore trovato."
          >
            <template #name-cell="{ row }">
              <div class="flex items-center gap-2">
                <UAvatar
                  :alt="row.original.name"
                  size="xs"
                />
                <div class="min-w-0">
                  <p class="font-medium text-highlighted truncate">
                    {{ row.original.name }}
                  </p>
                  <p class="text-xs text-muted truncate">
                    {{ row.original.phone }}
                  </p>
                </div>
              </div>
            </template>

            <template #properties-cell="{ row }">
              <div
                v-if="propertiesOf(row.original.name).length"
                class="flex flex-wrap gap-1"
              >
                <UBadge
                  v-for="property in propertiesOf(row.original.name)"
                  :key="property.id"
                  :label="property.name"
                  :to="`/dashboard/properties/${property.id}`"
                  color="neutral"
                  variant="subtle"
                />
              </div>
              <span
                v-else
                class="text-xs text-dimmed"
              >
                Nessuna
              </span>
            </template>

            <template #state-cell="{ row }">
              <UBadge
                :label="row.original.state"
                :color="staffStateColor[row.original.state]"
                variant="subtle"
              />
            </template>
          </UTable>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
