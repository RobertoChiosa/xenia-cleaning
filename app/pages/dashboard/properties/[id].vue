<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const { properties, jobs, bookings } = useOrg()

const route = useRoute()
const property = properties.value.find(item => item.id === route.params.id)

if (!property) {
  throw createError({ statusCode: 404, statusMessage: 'Proprietà non trovata', fatal: true })
}

const propertyJobs = computed(() => jobs.value.filter(job => job.propertyId === property.id))
const propertyBookings = computed(() => bookings.value.filter(booking => booking.propertyId === property.id))

const jobColumns: TableColumn<typeof jobs.value[number]>[] = [
  { accessorKey: 'date', header: 'Data' },
  { accessorKey: 'window', header: 'Fascia' },
  { accessorKey: 'crew', header: 'Squadra' },
  { accessorKey: 'hours', header: 'Ore' },
  { accessorKey: 'status', header: 'Stato' },
  { id: 'actions' }
]

const bookingColumns: TableColumn<typeof bookings.value[number]>[] = [
  { accessorKey: 'checkin', header: 'Checkin' },
  { accessorKey: 'checkout', header: 'Checkout' },
  { id: 'status', header: 'Stato' },
  { id: 'actions' }
]

const interventionOpen = ref(false)
const interventionBookingId = ref<string | null>(null)

function openIntervention(bookingId: string) {
  interventionBookingId.value = bookingId
  interventionOpen.value = true
}
</script>

<template>
  <UDashboardPanel id="property">
    <template #header>
      <UDashboardNavbar :title="property.name">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Torna alle proprietà"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            size="sm"
            to="/dashboard/properties"
          />
          <UButton
            label="Modifica"
            icon="i-lucide-pencil"
            size="sm"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="font-semibold text-highlighted">
              Scheda proprietà
            </h2>
          </template>

          <dl class="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <dt class="text-muted">
                Cliente
              </dt>
              <dd class="text-highlighted">
                <ULink :to="`/dashboard/properties?client=${property.clientId}`">
                  {{ property.client }}
                </ULink>
              </dd>
            </div>
            <div>
              <dt class="text-muted">
                Indirizzo
              </dt>
              <dd class="text-highlighted">
                {{ property.address }}
              </dd>
            </div>
          </dl>
        </UCard>

        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <template #header>
            <div>
              <h2 class="font-semibold text-highlighted">
                Prenotazioni
              </h2>
              <p class="text-sm text-muted">
                Al checkout si crea l'intervento di pulizia da assegnare.
              </p>
            </div>
          </template>

          <UTable
            :data="propertyBookings"
            :columns="bookingColumns"
            empty="Nessuna prenotazione su questa proprietà."
          >
            <template #checkin-cell="{ row }">
              {{ formatDay(row.original.checkin) }}
            </template>

            <template #checkout-cell="{ row }">
              {{ formatDay(row.original.checkout) }}
            </template>

            <template #status-cell="{ row }">
              <UBadge
                :label="bookingStatus(row.original)"
                :color="bookingStatusColor[bookingStatus(row.original)]"
                variant="subtle"
              />
            </template>

            <template #actions-cell="{ row }">
              <UButton
                v-if="!row.original.jobId"
                label="Registra checkout"
                icon="i-lucide-log-out"
                color="neutral"
                variant="subtle"
                size="xs"
                @click="openIntervention(row.original.id)"
              />
              <UButton
                v-else
                label="Vedi intervento"
                :to="`/dashboard/jobs?q=${row.original.jobId}`"
                color="neutral"
                variant="subtle"
                size="xs"
              />
            </template>
          </UTable>
        </UCard>

        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <template #header>
            <h2 class="font-semibold text-highlighted">
              Interventi sulla proprietà
            </h2>
          </template>

          <UTable
            :data="propertyJobs"
            :columns="jobColumns"
            empty="Nessun intervento su questa proprietà."
          >
            <template #crew-cell="{ row }">
              <span :class="row.original.crew === 'Da assegnare' ? 'text-warning' : ''">
                {{ row.original.crew }}
              </span>
            </template>

            <template #status-cell="{ row }">
              <UBadge
                :label="row.original.status"
                :color="jobStatusColor[row.original.status]"
                variant="subtle"
              />
            </template>

            <template #actions-cell="{ row }">
              <UButton
                label="Assegna"
                icon="i-lucide-user-plus"
                color="neutral"
                variant="subtle"
                size="xs"
                @click="openIntervention(row.original.bookingId)"
              />
            </template>
          </UTable>
        </UCard>
      </div>

      <InterventionModal
        v-model:open="interventionOpen"
        :booking-id="interventionBookingId"
      />
    </template>
  </UDashboardPanel>
</template>
