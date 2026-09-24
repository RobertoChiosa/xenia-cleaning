<script setup lang="ts">
import type { FormError, TableColumn } from '@nuxt/ui'
import type { CalendarEvent } from '~/composables/useCalendarEvents'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const { properties, saveProperty } = useOrg()

const route = useRoute()
const property = computed(() => properties.value.find(item => item.id === route.params.id))

if (!property.value) {
  throw createError({ statusCode: 404, statusMessage: 'Proprietà non trovata', fatal: true })
}

const state = reactive({ name: property.value.name, address: property.value.address ?? '', icsUrl: property.value.icsUrl ?? '' })
watch(property, (value) => {
  if (value) Object.assign(state, { name: value.name, address: value.address ?? '', icsUrl: value.icsUrl ?? '' })
})

function validate(state: { name: string }): FormError[] {
  const errors: FormError[] = []
  if (!state.name.trim()) {
    errors.push({ name: 'name', message: 'Il nome è obbligatorio.' })
  }
  return errors
}

async function onSubmit() {
  await saveProperty(property.value!.id, { name: state.name.trim(), address: state.address.trim() || undefined, icsUrl: state.icsUrl.trim() || undefined })
  toast.add({ title: 'Proprietà aggiornata', description: state.name, icon: 'i-lucide-check', color: 'success' })
}

const { data: events, pending: eventsPending, error: eventsError } = await useFetch<CalendarEvent[]>('/api/calendar', {
  query: { url: property.value.icsUrl },
  immediate: !!property.value.icsUrl,
  watch: false
})

const eventColumns: TableColumn<CalendarEvent>[] = [
  { accessorKey: 'summary', header: 'Evento' },
  { accessorKey: 'start', header: 'Inizio' },
  { accessorKey: 'end', header: 'Fine' }
]
</script>

<template>
  <UDashboardPanel id="property">
    <template #header>
      <UDashboardNavbar :title="property!.name">
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
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6 max-w-lg">
        <UCard>
          <template #header>
            <h2 class="font-semibold text-highlighted">
              Scheda proprietà
            </h2>
          </template>

          <UForm
            id="property-form"
            :state="state"
            :validate="validate"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField
              name="name"
              label="Nome"
              required
            >
              <UInput
                v-model="state.name"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="address"
              label="Indirizzo"
            >
              <UInput
                v-model="state.address"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="icsUrl"
              label="Indirizzo calendario iCal"
              description="Da Google Calendar: Impostazioni e condivisione → Indirizzo segreto in formato iCal."
            >
              <UInput
                v-model="state.icsUrl"
                placeholder="https://calendar.google.com/calendar/ical/.../basic.ics"
                class="w-full"
              />
            </UFormField>

            <UButton
              type="submit"
              label="Salva modifiche"
            />
          </UForm>
        </UCard>

        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <template #header>
            <h2 class="font-semibold text-highlighted">
              Prossimi eventi
            </h2>
          </template>

          <UTable
            v-if="property!.icsUrl"
            :data="events ?? []"
            :columns="eventColumns"
            :loading="eventsPending"
            empty="Nessun evento nei prossimi giorni."
          >
            <template #start-cell="{ row }">
              {{ formatLongDay(row.original.start.slice(0, 10)) }}
            </template>
            <template #end-cell="{ row }">
              {{ formatLongDay(row.original.end.slice(0, 10)) }}
            </template>
          </UTable>
          <p
            v-else
            class="p-4 text-sm text-muted"
          >
            Imposta l'indirizzo iCal qui sopra per vedere gli eventi.
          </p>
          <p
            v-if="eventsError"
            class="p-4 text-sm text-error"
          >
            Impossibile leggere questo calendario. Controlla l'indirizzo iCal.
          </p>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
