<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import type { Organization } from '~/composables/useOrg'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const { org, saveOrg } = useOrg()

const state = reactive({ ...org.value! })

watch(org, value => Object.assign(state, value))

function validate(state: Partial<Organization>): FormError[] {
  const errors: FormError[] = []

  if (!state.name?.trim()) {
    errors.push({ name: 'name', message: 'Il nome dell\'organizzazione è obbligatorio.' })
  }

  return errors
}

async function onSubmit() {
  await saveOrg({ name: state.name })

  toast.add({
    title: 'Company aggiornata',
    description: state.name,
    icon: 'i-lucide-check',
    color: 'success'
  })
}
</script>

<template>
  <SettingsPanel title="Impostazioni">
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
      class="max-w-lg"
      @submit="onSubmit"
    >
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <UAvatar
              :text="initials(org!.name)"
              size="lg"
              class="bg-primary/10 text-primary"
            />
            <h2 class="font-semibold text-highlighted truncate">
              {{ org!.name }}
            </h2>
          </div>
        </template>

        <UFormField
          name="name"
          label="Nome organizzazione"
          description="Compare nel selettore in alto a sinistra."
          required
        >
          <UInput
            v-model="state.name"
            class="w-full"
          />
        </UFormField>
      </UCard>
    </UForm>
  </SettingsPanel>
</template>
