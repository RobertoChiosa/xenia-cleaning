<script setup lang="ts">
import type { FormError, TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const { org, bookings, properties, addBooking } = useOrg()

const search = ref('')
const createOpen = ref(false)

type Booking = typeof bookings.value[number]

const filtered = computed(() => bookings.value.filter(booking =>
  (booking.property + booking.id).toLowerCase().includes(search.value.toLowerCase())))

const columns: TableColumn<Booking>[] = [
  { accessorKey: 'id', header: 'Codice' },
  { accessorKey: 'property', header: 'Proprietà' },
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

// nuova prenotazione
const propertyItems = computed(() => properties.value.map(property => ({ label: property.name, value: property.id })))

const blank = () => ({ orgId: org.value.id, id: '', propertyId: properties.value[0]?.id ?? '', property: '', checkin: today, checkout: today })
const state = reactive(blank())

function validate(state: Partial<Booking>): FormError[] {
  const errors: FormError[] = []

  if (!state.propertyId) {
    errors.push({ name: 'propertyId', message: 'Seleziona una proprietà.' })
  }
  if (!state.checkin) {
    errors.push({ name: 'checkin', message: 'Indica la data di checkin.' })
  }
  if (!state.checkout) {
    errors.push({ name: 'checkout', message: 'Indica la data di checkout.' })
  } else if (state.checkin && state.checkout <= state.checkin) {
    errors.push({ name: 'checkout', message: 'Il checkout deve essere dopo il checkin.' })
  }

  return errors
}

function onSubmit() {
  const property = properties.value.find(item => item.id === state.propertyId)
  if (!property) return

  addBooking({
    orgId: org.value.id,
    id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
    propertyId: property.id,
    property: property.name,
    checkin: state.checkin,
    checkout: state.checkout
  })

  createOpen.value = false
  Object.assign(state, blank())
}
</script>

<template>
  <UDashboardPanel id="bookings">
    <template #header>
      <UDashboardNavbar title="Prenotazioni">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Nuova prenotazione"
            icon="i-lucide-plus"
            size="sm"
            @click="createOpen = true"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Cerca per proprietà o codice"
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
          empty="Nessuna prenotazione corrisponde ai filtri."
        >
          <template #id-cell="{ row }">
            <span class="font-mono text-xs text-dimmed">{{ row.original.id }}</span>
          </template>

          <template #property-cell="{ row }">
            <ULink
              :to="`/dashboard/properties/${row.original.propertyId}`"
              class="font-medium text-highlighted"
            >
              {{ row.original.property }}
            </ULink>
          </template>

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

        <template #footer>
          <p class="text-sm text-muted">
            {{ filtered.length }} prenotazioni su {{ bookings.length }}
          </p>
        </template>
      </UCard>

      <InterventionModal
        v-model:open="interventionOpen"
        :booking-id="interventionBookingId"
      />

      <UModal
        v-model:open="createOpen"
        title="Nuova prenotazione"
        :description="`Viene creata in ${org.name}.`"
      >
        <template #body>
          <UForm
            id="booking-form"
            :state="state"
            :validate="validate"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField
              name="propertyId"
              label="Proprietà"
              required
            >
              <USelect
                v-model="state.propertyId"
                :items="propertyItems"
                value-key="value"
                class="w-full"
              />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField
                name="checkin"
                label="Checkin"
                required
              >
                <UInput
                  v-model="state.checkin"
                  type="date"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                name="checkout"
                label="Checkout"
                required
              >
                <UInput
                  v-model="state.checkout"
                  type="date"
                  class="w-full"
                />
              </UFormField>
            </div>
          </UForm>
        </template>

        <template #footer>
          <UButton
            label="Annulla"
            color="neutral"
            variant="ghost"
            @click="createOpen = false"
          />
          <UButton
            type="submit"
            form="booking-form"
            label="Crea prenotazione"
          />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
