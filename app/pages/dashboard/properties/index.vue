<script setup lang="ts">
import type { FormError, TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const { properties, createProperty } = useOrg()

const search = ref('')
const createOpen = ref(false)

const filtered = computed(() => properties.value.filter(property =>
  (property.name + (property.address ?? '')).toLowerCase().includes(search.value.toLowerCase())))

const columns: TableColumn<typeof properties.value[number]>[] = [
  { accessorKey: 'name', header: 'Proprietà' },
  { accessorKey: 'address', header: 'Indirizzo' },
  { id: 'calendar', header: 'Calendario' },
  { id: 'actions' }
]

const blank = () => ({ name: '', address: '' })
const state = reactive(blank())

function validate(state: { name: string }): FormError[] {
  const errors: FormError[] = []
  if (!state.name.trim()) {
    errors.push({ name: 'name', message: 'Il nome è obbligatorio.' })
  }
  return errors
}

async function onSubmit() {
  try {
    await createProperty({ name: state.name.trim(), address: state.address.trim() || undefined })
    toast.add({ title: 'Proprietà creata', description: state.name, icon: 'i-lucide-check', color: 'success' })
    createOpen.value = false
    Object.assign(state, blank())
  } catch (error) {
    toast.add({
      title: 'Creazione non riuscita',
      description: error instanceof Error ? error.message : 'Riprova più tardi.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  }
}
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
            @click="createOpen = true"
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
      </UDashboardToolbar>
    </template>

    <template #body>
      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <UTable
          :data="filtered"
          :columns="columns"
          empty="Nessuna proprietà corrisponde alla ricerca."
        >
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

          <template #calendar-cell="{ row }">
            <UBadge
              :label="row.original.icsUrl ? 'Collegato' : 'Non collegato'"
              :color="row.original.icsUrl ? 'success' : 'neutral'"
              variant="subtle"
            />
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

      <UModal
        v-model:open="createOpen"
        title="Nuova proprietà"
      >
        <template #body>
          <UForm
            id="property-create-form"
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
                placeholder="Via Boggio 1"
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
            form="property-create-form"
            label="Crea proprietà"
          />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
