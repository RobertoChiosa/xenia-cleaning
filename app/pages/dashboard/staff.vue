<script setup lang="ts">
import type { FormError, TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const { org, users, properties, jobs, addUser } = useOrg()

const search = ref('')
const createOpen = ref(false)

type Operator = typeof users.value[number]

const blank = (): Operator => ({ orgId: org.value.id, name: '', phone: '' })
const state = reactive(blank())

const filtered = computed(() => users.value.filter(member =>
  member.name.toLowerCase().includes(search.value.toLowerCase())))

// le proprietà di un operatore sono quelle su cui ha almeno un intervento, non un'assegnazione fissa
const propertiesOf = (name: string) => {
  const ids = new Set(jobs.value.filter(job => crewNames(job.crew).includes(name)).map(job => job.propertyId))
  return properties.value.filter(property => ids.has(property.id))
}

const covered = computed(() => new Set(
  jobs.value.filter(job => job.status !== 'Da assegnare').map(job => job.propertyId)
).size)

const stats = computed(() => [
  { label: 'Operatori', value: String(users.value.length), hint: `In ${org.value.name}` },
  { label: 'Senza proprietà', value: String(users.value.filter(member => !propertiesOf(member.name).length).length), hint: 'Operatori non ancora assegnati' },
  { label: 'Proprietà coperte', value: `${covered.value}/${properties.value.length}`, hint: 'Con almeno un intervento assegnato' }
])

const columns: TableColumn<Operator>[] = [
  { accessorKey: 'name', header: 'Operatore' },
  { accessorKey: 'phone', header: 'Telefono' },
  { id: 'properties', header: 'Proprietà assegnate' }
]

function validate(state: Partial<Operator>): FormError[] {
  const errors: FormError[] = []

  if (!state.name?.trim()) {
    errors.push({ name: 'name', message: 'Il nome è obbligatorio.' })
  } else if (users.value.some(member => member.name === state.name?.trim())) {
    errors.push({ name: 'name', message: 'Esiste già un operatore con questo nome.' })
  }
  if (!state.phone?.trim()) {
    errors.push({ name: 'phone', message: 'Il numero di telefono è obbligatorio.' })
  }

  return errors
}

function onSubmit() {
  addUser({ ...state, orgId: org.value.id, name: state.name.trim() })

  toast.add({ title: 'Operatore creato', description: state.name, icon: 'i-lucide-check', color: 'success' })

  createOpen.value = false
  Object.assign(state, blank())
}
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
            @click="createOpen = true"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Cerca operatore"
            size="sm"
            class="w-72"
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
                <p class="font-medium text-highlighted truncate">
                  {{ row.original.name }}
                </p>
              </div>
            </template>

            <template #phone-cell="{ row }">
              <span class="text-muted">{{ row.original.phone }}</span>
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
          </UTable>
        </UCard>
      </div>

      <UModal
        v-model:open="createOpen"
        title="Nuovo operatore"
        :description="`Viene aggiunto a ${org.name}.`"
      >
        <template #body>
          <UForm
            id="operator-form"
            :state="state"
            :validate="validate"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField
              name="name"
              label="Nome e cognome"
              required
            >
              <UInput
                v-model="state.name"
                placeholder="Marta Conti"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="phone"
              label="Numero di telefono"
              required
            >
              <UInput
                v-model="state.phone"
                placeholder="+39 340 118 4402"
                class="w-full"
              />
            </UFormField>
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
            form="operator-form"
            label="Crea operatore"
          />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
