<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const { org, orgs } = useOrg()

// ponytail: si scrive direttamente sul record in memoria — la sidebar segue in tempo reale
const state = reactive({ ...org.value })

watch(org, value => Object.assign(state, value))

function validate(state: Partial<typeof org.value>): FormError[] {
  const errors: FormError[] = []

  if (!state.name?.trim()) {
    errors.push({ name: 'name', message: 'Il nome dell\'organizzazione è obbligatorio.' })
  }
  if (!state.legalName?.trim()) {
    errors.push({ name: 'legalName', message: 'La ragione sociale è obbligatoria.' })
  }
  if (!/^IT\d{11}$/.test(state.vat?.replace(/\s/g, '') ?? '')) {
    errors.push({ name: 'vat', message: 'Formato atteso: IT seguito da 11 cifre.' })
  }
  if (!state.email?.includes('@')) {
    errors.push({ name: 'email', message: 'Inserisci un indirizzo email valido.' })
  }
  if (state.pec && !state.pec.includes('@')) {
    errors.push({ name: 'pec', message: 'Inserisci un indirizzo PEC valido.' })
  }
  if (state.sdi && state.sdi.length !== 7) {
    errors.push({ name: 'sdi', message: 'Il codice destinatario SDI ha 7 caratteri.' })
  }

  return errors
}

function onSubmit() {
  const index = orgs.value.findIndex(item => item.id === org.value.id)
  orgs.value[index] = { ...state }

  toast.add({
    title: 'Dati azienda aggiornati',
    description: state.name,
    icon: 'i-lucide-check',
    color: 'success'
  })
}
</script>

<template>
  <SettingsPanel title="Azienda">
    <template #actions>
      <UButton
        type="submit"
        form="company-form"
        label="Salva modifiche"
        size="sm"
      />
    </template>

    <UForm
      id="company-form"
      :state="state"
      :validate="validate"
      class="space-y-6 max-w-3xl"
      @submit="onSubmit"
    >
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <UAvatar
              :text="org.initials"
              size="lg"
              class="bg-primary/10 text-primary"
            />
            <div class="min-w-0">
              <h2 class="font-semibold text-highlighted truncate">
                {{ org.name }}
              </h2>
              <p class="text-sm text-muted">
                {{ org.plan }} · il tuo ruolo: {{ org.role }}
              </p>
            </div>
          </div>
        </template>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField
            name="name"
            label="Nome visualizzato"
            description="Compare nel selettore in alto a sinistra."
            required
            class="sm:col-span-2"
          >
            <UInput
              v-model="state.name"
              class="w-full"
            />
          </UFormField>
          <UFormField
            name="legalName"
            label="Ragione sociale"
            required
            class="sm:col-span-2"
          >
            <UInput
              v-model="state.legalName"
              class="w-full"
            />
          </UFormField>
          <UFormField
            name="vat"
            label="Partita IVA"
            required
          >
            <UInput
              v-model="state.vat"
              class="w-full"
            />
          </UFormField>
          <UFormField
            name="taxCode"
            label="Codice fiscale"
          >
            <UInput
              v-model="state.taxCode"
              class="w-full"
            />
          </UFormField>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="font-semibold text-highlighted">
            Contatti e sede
          </h2>
        </template>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField
            name="email"
            label="Email amministrazione"
            required
          >
            <UInput
              v-model="state.email"
              type="email"
              class="w-full"
            />
          </UFormField>
          <UFormField
            name="phone"
            label="Telefono"
          >
            <UInput
              v-model="state.phone"
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
            name="city"
            label="CAP, città e provincia"
          >
            <UInput
              v-model="state.city"
              class="w-full"
            />
          </UFormField>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-highlighted">
              Fatturazione elettronica
            </h2>
            <p class="text-sm text-muted">
              Usati per l'invio delle fatture allo SDI.
            </p>
          </div>
        </template>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField
            name="sdi"
            label="Codice destinatario"
            hint="7 caratteri"
          >
            <UInput
              v-model="state.sdi"
              class="w-full"
            />
          </UFormField>
          <UFormField
            name="pec"
            label="PEC"
          >
            <UInput
              v-model="state.pec"
              type="email"
              class="w-full"
            />
          </UFormField>
        </div>
      </UCard>
    </UForm>
  </SettingsPanel>
</template>
