<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const { properties, staff, jobs } = useOrg()

const route = useRoute()
const property = properties.value.find(item => item.id === route.params.id)

if (!property) {
  throw createError({ statusCode: 404, statusMessage: 'Proprietà non trovata', fatal: true })
}

// ponytail: stato locale — l'assegnazione vive solo nella sessione, niente backend
// copia profonda: il v-model sul ruolo scriverebbe dentro gli oggetti di mock.ts
const assigned = ref(property.assigned.map(member => ({ ...member })))
const open = ref(false)
const search = ref('')

const roles = ['Referente', 'Squadra', 'Sostituto']

const available = computed(() => staff.value.filter(member =>
  !assigned.value.some(item => item.name === member.name)
  && member.name.toLowerCase().includes(search.value.toLowerCase())
))

const propertyJobs = computed(() => jobs.value.filter(job => job.propertyId === property.id))

const columns: TableColumn<typeof jobs.value[number]>[] = [
  { accessorKey: 'date', header: 'Data' },
  { accessorKey: 'window', header: 'Fascia' },
  { accessorKey: 'crew', header: 'Squadra' },
  { accessorKey: 'hours', header: 'Ore' },
  { accessorKey: 'status', header: 'Stato' }
]

function assign(name: string) {
  assigned.value.push({ name, role: assigned.value.length ? 'Squadra' : 'Referente' })
  open.value = false
  search.value = ''
}

function unassign(name: string) {
  assigned.value = assigned.value.filter(member => member.name !== name)
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
        <div class="grid gap-4 lg:grid-cols-3">
          <UCard class="lg:col-span-2">
            <template #header>
              <div class="flex items-center justify-between gap-4">
                <h2 class="font-semibold text-highlighted">
                  Scheda proprietà
                </h2>
                <UBadge
                  :label="`${property.from} – ${property.to}`"
                  icon="i-lucide-clock"
                  color="neutral"
                  variant="subtle"
                />
              </div>
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
              <div>
                <dt class="text-muted">
                  Piano di servizio
                </dt>
                <dd class="text-highlighted tabular-nums">
                  {{ property.from }} – {{ property.to }}
                </dd>
              </div>
            </dl>

            <PropertyMap
              :lng="property.lng"
              :lat="property.lat"
              :label="property.name"
              class="mt-4"
            />
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center justify-between gap-2">
                <h2 class="font-semibold text-highlighted">
                  Operatori assegnati
                </h2>
                <UButton
                  icon="i-lucide-user-plus"
                  color="neutral"
                  variant="subtle"
                  size="xs"
                  aria-label="Assegna operatore"
                  @click="open = true"
                />
              </div>
            </template>

            <div
              v-if="assigned.length"
              class="space-y-3"
            >
              <div
                v-for="member in assigned"
                :key="member.name"
                class="flex items-center gap-2"
              >
                <UAvatar
                  :alt="member.name"
                  size="sm"
                />
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-highlighted truncate">
                    {{ member.name }}
                  </p>
                  <USelect
                    v-model="member.role"
                    :items="roles"
                    variant="none"
                    size="xs"
                    :ui="{ base: 'px-0 text-muted' }"
                  />
                </div>
                <UButton
                  icon="i-lucide-x"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  aria-label="Rimuovi"
                  @click="unassign(member.name)"
                />
              </div>
            </div>

            <div
              v-else
              class="text-center space-y-3 py-2"
            >
              <p class="text-sm text-muted">
                Nessun operatore assegnato. Gli interventi restano da coprire.
              </p>
              <UButton
                label="Assegna operatore"
                icon="i-lucide-user-plus"
                size="sm"
                block
                @click="open = true"
              />
            </div>
          </UCard>
        </div>

        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <template #header>
            <div class="flex items-center justify-between gap-4">
              <div>
                <h2 class="font-semibold text-highlighted">
                  Interventi sulla proprietà
                </h2>
                <p class="text-sm text-muted">
                  Generati dal piano di servizio, con gli operatori assegnati.
                </p>
              </div>
              <UButton
                label="Nuovo intervento"
                icon="i-lucide-plus"
                color="neutral"
                variant="subtle"
                size="sm"
              />
            </div>
          </template>

          <UTable
            :data="propertyJobs"
            :columns="columns"
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
          </UTable>
        </UCard>
      </div>

      <UModal
        v-model:open="open"
        title="Assegna un operatore"
        description="Gli operatori assegnati vengono proposti automaticamente sui prossimi interventi."
      >
        <template #body>
          <div class="space-y-3">
            <UInput
              v-model="search"
              icon="i-lucide-search"
              placeholder="Cerca operatore"
              class="w-full"
            />

            <div
              v-for="member in available"
              :key="member.name"
              class="flex items-center gap-3"
            >
              <UAvatar
                :alt="member.name"
                size="sm"
              />
              <div class="min-w-0">
                <p class="text-sm font-medium text-highlighted truncate">
                  {{ member.name }}
                </p>
                <p class="text-xs text-muted truncate">
                  {{ member.role }} · {{ member.zone }} · {{ member.hours }} h/sett.
                </p>
              </div>
              <UBadge
                :label="member.state"
                :color="staffStateColor[member.state]"
                variant="subtle"
                class="ms-auto"
              />
              <UButton
                label="Assegna"
                size="xs"
                @click="assign(member.name)"
              />
            </div>

            <p
              v-if="!available.length"
              class="text-sm text-muted text-center py-2"
            >
              Nessun operatore disponibile con questi criteri.
            </p>
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
