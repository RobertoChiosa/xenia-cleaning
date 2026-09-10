<script setup lang="ts">
import type { DropdownMenuItem, FormError, TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const { org, clients, properties, saveClient, removeClient } = useOrg()

const search = ref('')
const editOpen = ref(false)
const editing = ref<string | null>(null)

type Client = typeof clients.value[number]

const blank = (): Client => ({
  orgId: org.value.id,
  id: '',
  name: '',
  reference: '',
  email: '',
  status: 'Attivo'
})

const state = reactive(blank())

const filtered = computed(() => clients.value.filter(client =>
  (client.name + client.reference + client.email).toLowerCase().includes(search.value.toLowerCase())
))

// il conteggio vive nelle proprietà, non nella scheda cliente
const propertyCount = (clientId: string) =>
  properties.value.filter(property => property.clientId === clientId).length

const columns: TableColumn<Client>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Cliente' },
  { accessorKey: 'reference', header: 'Referente' },
  { accessorKey: 'email', header: 'Email' },
  { id: 'properties', header: 'Proprietà' },
  { accessorKey: 'status', header: 'Stato' },
  { id: 'actions' }
]

const slug = (name: string) =>
  name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function validate(state: Partial<Client>): FormError[] {
  const errors: FormError[] = []

  if (!state.name?.trim()) {
    errors.push({ name: 'name', message: 'Il nome del cliente è obbligatorio.' })
  } else if (clients.value.some(client => client.name === state.name?.trim() && client.id !== editing.value)) {
    errors.push({ name: 'name', message: 'Esiste già un cliente con questo nome.' })
  }
  if (!state.reference?.trim()) {
    errors.push({ name: 'reference', message: 'Indica un referente.' })
  }
  if (!state.email?.includes('@')) {
    errors.push({ name: 'email', message: 'Inserisci un indirizzo email valido.' })
  }

  return errors
}

function openNew() {
  editing.value = null
  Object.assign(state, blank())
  editOpen.value = true
}

function openEdit(client: Client) {
  editing.value = client.id
  Object.assign(state, client)
  editOpen.value = true
}

// ponytail: scrive sullo stato in memoria — sostituire con la POST/PATCH quando ci sarà il backend
function onSubmit() {
  const id = editing.value ?? slug(state.name)

  saveClient({ ...state, id, name: state.name.trim() })

  toast.add({
    title: editing.value ? 'Cliente aggiornato' : 'Cliente creato',
    description: state.name,
    icon: 'i-lucide-check',
    color: 'success'
  })

  editOpen.value = false
}

function onRemove(client: Client) {
  removeClient(client.id)
  toast.add({ title: `${client.name} rimosso`, icon: 'i-lucide-trash-2', color: 'warning' })
}

function rowActions(client: Client): DropdownMenuItem[][] {
  const attached = propertyCount(client.id)

  return [[{
    label: 'Modifica',
    icon: 'i-lucide-pencil',
    onSelect: () => openEdit(client)
  }, {
    label: 'Vedi le proprietà',
    icon: 'i-lucide-building-2',
    to: `/dashboard/properties?client=${client.id}`
  }], [{
    label: attached ? `Ha ${attached} proprietà collegate` : 'Elimina cliente',
    icon: 'i-lucide-trash-2',
    color: 'error' as const,
    disabled: attached > 0,
    onSelect: () => onRemove(client)
  }]]
}
</script>

<template>
  <UDashboardPanel id="clients">
    <template #header>
      <UDashboardNavbar title="Clienti">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Nuovo cliente"
            icon="i-lucide-plus"
            size="sm"
            @click="openNew"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Cerca cliente o referente"
            size="sm"
            class="w-72"
          />
        </template>

        <template #right>
          <UButton
            label="Vedi le proprietà"
            icon="i-lucide-building-2"
            color="neutral"
            variant="outline"
            size="sm"
            to="/dashboard/properties"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <UTable
          :data="filtered"
          :columns="columns"
          empty="Nessun cliente trovato."
        >
          <template #id-cell="{ row }">
            <span class="font-mono text-xs text-dimmed">{{ row.original.id }}</span>
          </template>

          <template #name-cell="{ row }">
            <p class="font-medium text-highlighted truncate">
              {{ row.original.name }}
            </p>
          </template>

          <template #reference-cell="{ row }">
            <p class="text-highlighted truncate">
              {{ row.original.reference }}
            </p>
          </template>

          <template #email-cell="{ row }">
            <ULink
              :to="`mailto:${row.original.email}`"
              class="text-xs text-muted truncate"
            >
              {{ row.original.email }}
            </ULink>
          </template>

          <template #properties-cell="{ row }">
            <UButton
              :label="`${propertyCount(row.original.id)} proprietà`"
              :to="`/dashboard/properties?client=${row.original.id}`"
              color="neutral"
              variant="subtle"
              size="xs"
              trailing-icon="i-lucide-arrow-right"
            />
          </template>

          <template #status-cell="{ row }">
            <UBadge
              :label="row.original.status"
              :color="clientStatusColor[row.original.status]"
              variant="subtle"
            />
          </template>

          <template #actions-cell="{ row }">
            <UDropdownMenu :items="rowActions(row.original)">
              <UButton
                icon="i-lucide-ellipsis-vertical"
                color="neutral"
                variant="ghost"
                size="xs"
                :aria-label="`Azioni per ${row.original.name}`"
              />
            </UDropdownMenu>
          </template>
        </UTable>
      </UCard>

      <UModal
        v-model:open="editOpen"
        :title="editing ? 'Modifica cliente' : 'Nuovo cliente'"
        :description="editing ? 'Le modifiche valgono su contratti, proprietà e fatture collegate.' : `Il cliente viene creato in ${org.name}.`"
      >
        <template #body>
          <UForm
            id="client-form"
            :state="state"
            :validate="validate"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField
              name="name"
              label="Ragione sociale"
              required
            >
              <UInput
                v-model="state.name"
                placeholder="Xenia SRL"
                class="w-full"
              />
            </UFormField>

            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField
                name="reference"
                label="Nome del referente"
                required
              >
                <UInput
                  v-model="state.reference"
                  placeholder="Roberto Chiosa"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                name="email"
                label="Email del referente"
                required
              >
                <UInput
                  v-model="state.email"
                  type="email"
                  placeholder="nome@cliente.it"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                name="status"
                label="Stato"
                class="sm:col-span-2"
              >
                <USelect
                  v-model="state.status"
                  :items="['Attivo', 'In rinnovo', 'Sospeso']"
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
            @click="editOpen = false"
          />
          <UButton
            type="submit"
            form="client-form"
            :label="editing ? 'Salva modifiche' : 'Crea cliente'"
          />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
