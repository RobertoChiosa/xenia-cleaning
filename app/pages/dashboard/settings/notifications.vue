<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const { org } = useOrg()

// ponytail: preferenze in memoria per organizzazione — sostituire con la chiamata di salvataggio
const preferences = useState('notifications', () => Object.fromEntries(
  organizations.map(item => [item.id, { unassigned: true, noShow: true, timesheets: true, invoices: false }])
))

const state = computed(() => preferences.value[org.value.id]!)

const switches: { key: keyof typeof state.value, label: string, description: string }[] = [
  { key: 'unassigned', label: 'Interventi ancora da assegnare', description: 'Avviso 3 ore prima dell\'inizio del turno.' },
  { key: 'noShow', label: 'Timbratura mancante', description: 'Avviso 15 minuti dopo l\'orario previsto.' },
  { key: 'timesheets', label: 'Cartellini da approvare', description: 'Riepilogo il lunedì mattina.' },
  { key: 'invoices', label: 'Fatture scadute', description: 'Promemoria settimanale sugli insoluti.' }
]

function onSubmit() {
  toast.add({
    title: 'Preferenze salvate',
    description: `Valgono per ${org.value.name}.`,
    icon: 'i-lucide-check',
    color: 'success'
  })
}
</script>

<template>
  <SettingsPanel title="Notifiche">
    <template #actions>
      <UButton
        label="Salva modifiche"
        size="sm"
        @click="onSubmit"
      />
    </template>

    <UCard class="max-w-3xl">
      <template #header>
        <div>
          <h2 class="font-semibold text-highlighted">
            Avvisi operativi
          </h2>
          <p class="text-sm text-muted">
            Impostati per {{ org.name }}. Ogni organizzazione ha le sue preferenze.
          </p>
        </div>
      </template>

      <div class="space-y-4">
        <USwitch
          v-for="item in switches"
          :key="item.key"
          v-model="state[item.key]"
          :label="item.label"
          :description="item.description"
        />
      </div>
    </UCard>
  </SettingsPanel>
</template>
