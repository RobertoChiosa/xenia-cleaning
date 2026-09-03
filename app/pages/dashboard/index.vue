<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

// ponytail: derivati dal mock dove esiste una fonte, il resto è copy da demo
const unassignedJobs = computed(() => jobs.filter(job => job.status === 'Da assegnare').length)
const draftInvoices = computed(() => invoices.filter(invoice => invoice.status === 'Bozza'))
const unassignedProperties = computed(() => properties.filter(property => !property.assigned.length))
const pendingTimesheets = computed(() => timesheets.filter(sheet => sheet.status === 'Da approvare').length)

const stats = computed(() => [
  { label: 'Interventi di oggi', value: '28', hint: '6 conclusi' },
  { label: 'Interventi da coprire', value: String(unassignedJobs.value), hint: '2 iniziano entro 3 ore' },
  { label: 'Operatori in servizio', value: '19/24', hint: '1 assenza' },
  { label: 'Ore della settimana', value: '412', hint: '38 di straordinario' }
])

const today = jobs.filter(job => job.date === 'Gio 3 set')

const columns: TableColumn<typeof jobs[number]>[] = [
  { accessorKey: 'window', header: 'Fascia' },
  { accessorKey: 'property', header: 'Proprietà' },
  { accessorKey: 'client', header: 'Cliente' },
  { accessorKey: 'crew', header: 'Squadra' },
  { accessorKey: 'status', header: 'Stato' }
]

const attention = computed(() => [
  { icon: 'i-lucide-user-x', title: `${unassignedProperties.value.length} proprietà senza operatori`, detail: unassignedProperties.value.map(property => property.name).join(' · '), action: 'Assegna', to: '/dashboard/properties' },
  { icon: 'i-lucide-alarm-clock-off', title: 'Tommaso R. assente', detail: 'Hotel Darsena 06:00 · serve una sostituzione', action: 'Sostituisci', to: '/dashboard/staff' },
  { icon: 'i-lucide-file-warning', title: `${pendingTimesheets.value} cartellini da approvare`, detail: 'Settimana al 31 agosto · bloccano le paghe', action: 'Verifica', to: '/dashboard/timesheets' },
  { icon: 'i-lucide-receipt', title: `${draftInvoices.value.length} fatture in bozza`, detail: draftInvoices.value.map(invoice => invoice.client).join(', '), action: 'Completa', to: '/dashboard/invoices' }
])

const onSite = staff.filter(member => member.state !== 'Disponibile')
</script>

<template>
  <UDashboardPanel id="today">
    <template #header>
      <UDashboardNavbar title="Oggi">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UColorModeButton />
          <UButton
            icon="i-lucide-bell"
            color="neutral"
            variant="ghost"
            aria-label="Notifiche"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <DashboardStats :items="stats" />

        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <template #header>
            <div class="flex items-center justify-between gap-4">
              <div>
                <h2 class="font-semibold text-highlighted">
                  Interventi di oggi
                </h2>
                <p class="text-sm text-muted">
                  Giovedì 3 settembre · 28 interventi su 21 proprietà.
                </p>
              </div>

              <UButton
                label="Vedi tutti"
                color="neutral"
                variant="subtle"
                size="sm"
                trailing-icon="i-lucide-arrow-right"
                to="/dashboard/jobs"
              />
            </div>
          </template>

          <UTable
            :data="today"
            :columns="columns"
            empty="Nessun intervento programmato per oggi."
          >
            <template #property-cell="{ row }">
              <ULink
                :to="`/dashboard/properties/${row.original.propertyId}`"
                class="font-medium text-highlighted"
              >
                {{ row.original.property }}
              </ULink>
            </template>

            <template #status-cell="{ row }">
              <UBadge
                :label="row.original.status"
                :color="jobStatusColor[row.original.status]"
                variant="subtle"
              />
            </template>
          </UTable>
        </UCard>

        <div class="grid gap-4 lg:grid-cols-2">
          <UCard>
            <template #header>
              <h2 class="font-semibold text-highlighted">
                Stato operatori
              </h2>
            </template>

            <div class="space-y-4">
              <div
                v-for="member in onSite"
                :key="member.name"
                class="flex items-center gap-3"
              >
                <UAvatar :alt="member.name" />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-highlighted truncate">
                    {{ member.name }}
                  </p>
                  <p class="text-xs text-muted truncate">
                    {{ member.detail }}
                  </p>
                </div>
                <UBadge
                  :label="member.state"
                  :color="staffStateColor[member.state]"
                  variant="subtle"
                  class="ms-auto"
                />
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h2 class="font-semibold text-highlighted">
                Da gestire
              </h2>
            </template>

            <div class="space-y-4">
              <div
                v-for="item in attention"
                :key="item.title"
                class="flex items-start gap-3"
              >
                <UIcon
                  :name="item.icon"
                  class="size-4 mt-0.5 text-dimmed shrink-0"
                />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-highlighted">
                    {{ item.title }}
                  </p>
                  <p class="text-xs text-muted">
                    {{ item.detail }}
                  </p>
                </div>
                <UButton
                  :label="item.action"
                  :to="item.to"
                  color="neutral"
                  variant="subtle"
                  size="xs"
                  class="ms-auto shrink-0"
                />
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
