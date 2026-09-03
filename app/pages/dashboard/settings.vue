<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()

interface Settings {
  name: string
  vat: string
  email: string
  phone: string
  notifications: {
    unassigned: boolean
    noShow: boolean
    timesheets: boolean
    invoices: boolean
  }
}

const state = reactive<Settings>({
  name: 'Xenia Servizi Srl',
  vat: 'IT 09876543210',
  email: 'amministrazione@xeniaservizi.it',
  phone: '+39 02 4455 1120',
  notifications: {
    unassigned: true,
    noShow: true,
    timesheets: true,
    invoices: false
  }
})

function validate(state: Partial<Settings>): FormError[] {
  const errors: FormError[] = []

  if (!state.name?.trim()) {
    errors.push({ name: 'name', message: 'La ragione sociale è obbligatoria.' })
  }
  if (!state.vat?.trim()) {
    errors.push({ name: 'vat', message: 'La partita IVA è obbligatoria.' })
  }
  if (!state.email?.includes('@')) {
    errors.push({ name: 'email', message: 'Inserisci un indirizzo email valido.' })
  }

  return errors
}

const team = [
  { name: 'Roberto Bianchi', email: 'roberto@xeniaservizi.it', role: 'Titolare' },
  { name: 'Giulia Fanti', email: 'giulia@xeniaservizi.it', role: 'Responsabile operativa' },
  { name: 'Marco Bassi', email: 'marco@xeniaservizi.it', role: 'Amministrazione' },
  { name: 'Dorin Vasile', email: 'dorin@xeniaservizi.it', role: 'Capo squadra' }
]

// ponytail: solo UI — nessuna persistenza, sostituire con la chiamata di salvataggio
function onSubmit() {
  toast.add({
    title: 'Impostazioni salvate',
    icon: 'i-lucide-check',
    color: 'success'
  })
}
</script>

<template>
  <UDashboardPanel id="settings">
    <template #header>
      <UDashboardNavbar title="Impostazioni">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            type="submit"
            form="settings-form"
            label="Salva modifiche"
            size="sm"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UForm
        id="settings-form"
        :state="state"
        :validate="validate"
        class="space-y-6 max-w-3xl"
        @submit="onSubmit"
      >
        <UCard>
          <template #header>
            <h2 class="font-semibold text-highlighted">
              Dati azienda
            </h2>
          </template>

          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField
              name="name"
              label="Ragione sociale"
              required
            >
              <UInput
                v-model="state.name"
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
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="font-semibold text-highlighted">
              Notifiche
            </h2>
          </template>

          <div class="space-y-4">
            <USwitch
              v-model="state.notifications.unassigned"
              label="Interventi ancora da assegnare"
              description="Avviso 3 ore prima dell'inizio del turno."
            />
            <USwitch
              v-model="state.notifications.noShow"
              label="Timbratura mancante"
              description="Avviso 15 minuti dopo l'orario previsto."
            />
            <USwitch
              v-model="state.notifications.timesheets"
              label="Cartellini da approvare"
              description="Riepilogo il lunedì mattina."
            />
            <USwitch
              v-model="state.notifications.invoices"
              label="Fatture scadute"
              description="Promemoria settimanale sugli insoluti."
            />
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-4">
              <h2 class="font-semibold text-highlighted">
                Utenti dell'area
              </h2>
              <UButton
                label="Invita"
                icon="i-lucide-user-plus"
                color="neutral"
                variant="subtle"
                size="sm"
              />
            </div>
          </template>

          <div class="space-y-4">
            <div
              v-for="member in team"
              :key="member.email"
              class="flex items-center gap-3"
            >
              <UAvatar :alt="member.name" />
              <div class="min-w-0">
                <p class="text-sm font-medium text-highlighted truncate">
                  {{ member.name }}
                </p>
                <p class="text-xs text-muted truncate">
                  {{ member.email }}
                </p>
              </div>
              <UBadge
                :label="member.role"
                color="neutral"
                variant="subtle"
                class="ms-auto"
              />
            </div>
          </div>
        </UCard>
      </UForm>
    </template>
  </UDashboardPanel>
</template>
