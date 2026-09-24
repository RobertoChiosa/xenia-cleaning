<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const { properties, createProperty, deleteProperty, reorderProperties } = useOrg()

const search = ref('')
const createOpen = ref(false)

// il trascinamento riordina la lista completa: con un filtro attivo l'indice mostrato non
// corrisponderebbe più a quello reale, quindi si disabilita finché la ricerca è vuota
const filtered = computed(() => properties.value.filter(property =>
  property.name.toLowerCase().includes(search.value.toLowerCase())))
const canReorder = computed(() => !search.value)

const dragIndex = ref<number | null>(null)

function onDragStart(index: number) {
  dragIndex.value = index
}
async function onDrop(index: number) {
  const from = dragIndex.value
  dragIndex.value = null
  if (from === null || from === index) return
  const reordered = [...properties.value]
  const [moved] = reordered.splice(from, 1)
  reordered.splice(index, 0, moved!)
  await reorderProperties(reordered.map(p => p.id))
}

const blank = () => ({ name: '', icsUrl: '' })
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
    await createProperty({ name: state.name.trim(), icsUrl: state.icsUrl.trim() || undefined })
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

async function onDelete(property: typeof properties.value[number]) {
  if (!confirm(`Eliminare "${property.name}"? L'azione non è reversibile.`)) return
  try {
    await deleteProperty(property.id)
    toast.add({ title: 'Proprietà eliminata', description: property.name, icon: 'i-lucide-check', color: 'success' })
  } catch (error) {
    toast.add({
      title: 'Eliminazione non riuscita',
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
            placeholder="Cerca proprietà"
            size="sm"
            class="w-72"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <p
          v-if="!filtered.length"
          class="p-4 text-sm text-muted"
        >
          Nessuna proprietà corrisponde alla ricerca.
        </p>

        <div
          v-for="(property, index) in filtered"
          :key="property.id"
          class="flex items-center gap-3 border-b border-default px-3 py-3 last:border-b-0"
          :class="dragIndex === index ? 'opacity-40' : ''"
          :draggable="canReorder"
          @dragstart="onDragStart(index)"
          @dragover.prevent
          @drop="onDrop(index)"
        >
          <UIcon
            name="i-lucide-grip-vertical"
            class="size-4 shrink-0 text-dimmed"
            :class="canReorder ? 'cursor-grab' : 'opacity-30'"
          />

          <ULink
            :to="`/dashboard/properties/${property.id}`"
            class="flex-1 font-medium text-highlighted truncate"
          >
            {{ property.name }}
          </ULink>

          <UBadge
            :label="property.icsUrl ? 'Collegato' : 'Non collegato'"
            :color="property.icsUrl ? 'success' : 'neutral'"
            variant="subtle"
          />

          <div class="flex gap-2">
            <UButton
              label="Apri"
              :to="`/dashboard/properties/${property.id}`"
              color="neutral"
              variant="subtle"
              size="xs"
            />
            <UButton
              label="Elimina"
              icon="i-lucide-trash-2"
              color="error"
              variant="subtle"
              size="xs"
              @click="onDelete(property)"
            />
          </div>
        </div>

        <template #footer>
          <p class="text-sm text-muted">
            {{ filtered.length }} proprietà su {{ properties.length }}
            <span v-if="!canReorder">· svuota la ricerca per riordinare</span>
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
              name="icsUrl"
              label="Indirizzo calendario iCal"
              description="Facoltativo, si può impostare anche dopo dalla scheda proprietà."
            >
              <UInput
                v-model="state.icsUrl"
                placeholder="https://www.lodgify.com/....ics"
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
