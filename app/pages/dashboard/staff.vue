<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const search = ref('')

const filtered = computed(() => staff.filter(member =>
  (member.name + member.zone + member.role).toLowerCase().includes(search.value.toLowerCase())
))

const stats = [
  { label: 'Operatori attivi', value: '24', hint: '19 in servizio oggi' },
  { label: 'Ore contrattuali', value: '868', hint: 'Settimanali complessive' },
  { label: 'Straordinari', value: '38 h', hint: 'Settimana in corso' },
  { label: 'Attestati in scadenza', value: '2', hint: 'HACCP entro 30 giorni' }
]

const propertyCount = (name: string) =>
  properties.filter(property => property.assigned.some(member => member.name === name)).length

const columns: TableColumn<typeof staff[number]>[] = [
  { accessorKey: 'name', header: 'Operatore' },
  { accessorKey: 'role', header: 'Ruolo' },
  { accessorKey: 'zone', header: 'Zona' },
  { accessorKey: 'contract', header: 'Contratto' },
  { accessorKey: 'certs', header: 'Attestati' },
  { id: 'properties', header: 'Proprietà' },
  { accessorKey: 'hours', header: 'Ore/sett.' },
  { accessorKey: 'state', header: 'Stato' }
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
              <ULink
                :to="`/dashboard/properties?operator=${row.original.name}`"
                class="text-muted"
              >
                {{ propertyCount(row.original.name) }} assegnate
              </ULink>
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
