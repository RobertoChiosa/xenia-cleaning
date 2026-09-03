<script setup lang="ts">
import type { DropdownMenuItem, FormError, TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const { org, users, addUser, removeUser } = useOrg()

const search = ref('')
const inviteOpen = ref(false)

const invite = reactive({ name: '', email: '', role: 'Capo squadra' })

const filtered = computed(() => users.value.filter(user =>
  (user.name + user.email + user.role).toLowerCase().includes(search.value.toLowerCase())))

const owners = computed(() => users.value.filter(user => user.role === 'Titolare').length)

const columns: TableColumn<typeof users.value[number]>[] = [
  { accessorKey: 'name', header: 'Utente' },
  { accessorKey: 'role', header: 'Ruolo' },
  { accessorKey: 'status', header: 'Stato' },
  { accessorKey: 'lastAccess', header: 'Ultimo accesso' },
  { id: 'actions' }
]

function validateInvite(state: Partial<typeof invite>): FormError[] {
  const errors: FormError[] = []

  if (!state.name?.trim()) {
    errors.push({ name: 'name', message: 'Il nome è obbligatorio.' })
  }
  if (!state.email?.includes('@')) {
    errors.push({ name: 'email', message: 'Inserisci un indirizzo email valido.' })
  } else if (users.value.some(user => user.email === state.email)) {
    errors.push({ name: 'email', message: 'Questo indirizzo è già stato invitato.' })
  }

  return errors
}

// ponytail: solo UI — nessuna email inviata, l'utente resta in memoria
function onInvite() {
  addUser({ orgId: org.value.id, ...invite, status: 'Invitato', lastAccess: 'Mai' })

  toast.add({ title: `Invito inviato a ${invite.email}`, icon: 'i-lucide-mail', color: 'success' })

  inviteOpen.value = false
  Object.assign(invite, { name: '', email: '', role: 'Capo squadra' })
}

function setRole(user: typeof users.value[number], role: string) {
  user.role = role
  toast.add({ title: `${user.name} è ora ${role.toLowerCase()}`, icon: 'i-lucide-shield-check' })
}

function setStatus(user: typeof users.value[number], status: string) {
  user.status = status
}

function onRemove(user: typeof users.value[number]) {
  removeUser(user.email)
  toast.add({ title: `${user.name} rimosso da ${org.value.name}`, icon: 'i-lucide-user-minus', color: 'warning' })
}

// l'ultimo titolare non può essere declassato, disattivato o rimosso
function isLastOwner(user: typeof users.value[number]) {
  return user.role === 'Titolare' && owners.value === 1
}

function rowActions(user: typeof users.value[number]): DropdownMenuItem[][] {
  return [
    userRoles.map(role => ({
      label: role.value,
      type: 'checkbox' as const,
      checked: user.role === role.value,
      disabled: isLastOwner(user) && role.value !== 'Titolare',
      onSelect: () => setRole(user, role.value)
    })),
    [{
      label: user.status === 'Disattivato' ? 'Riattiva' : 'Disattiva',
      icon: user.status === 'Disattivato' ? 'i-lucide-user-check' : 'i-lucide-user-x',
      disabled: isLastOwner(user),
      onSelect: () => setStatus(user, user.status === 'Disattivato' ? 'Attivo' : 'Disattivato')
    }, {
      label: 'Rimuovi dall\'organizzazione',
      icon: 'i-lucide-trash-2',
      color: 'error' as const,
      disabled: isLastOwner(user),
      onSelect: () => onRemove(user)
    }]
  ]
}
</script>

<template>
  <SettingsPanel title="Utenti">
    <template #actions>
      <UButton
        label="Invita utente"
        icon="i-lucide-user-plus"
        size="sm"
        @click="inviteOpen = true"
      />
    </template>

    <div class="space-y-4 max-w-4xl">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Cerca per nome, email o ruolo"
        size="sm"
        class="w-72"
      />

      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <UTable
          :data="filtered"
          :columns="columns"
          empty="Nessun utente corrisponde alla ricerca."
        >
          <template #name-cell="{ row }">
            <div class="flex items-center gap-2">
              <UAvatar
                :alt="row.original.name"
                size="xs"
              />
              <div class="min-w-0">
                <p class="font-medium text-highlighted truncate">
                  {{ row.original.name }}
                </p>
                <p class="text-xs text-muted truncate">
                  {{ row.original.email }}
                </p>
              </div>
            </div>
          </template>

          <template #status-cell="{ row }">
            <UBadge
              :label="row.original.status"
              :color="userStatusColor[row.original.status]"
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

        <template #footer>
          <p class="text-sm text-muted">
            {{ users.length }} utenti in {{ org.name }} · {{ owners }} con ruolo titolare
          </p>
        </template>
      </UCard>
    </div>

    <UModal
      v-model:open="inviteOpen"
      title="Invita un utente"
      :description="`Riceverà l'accesso a ${org.name}. Potrai cambiare il ruolo in qualsiasi momento.`"
    >
      <template #body>
        <UForm
          id="invite-form"
          :state="invite"
          :validate="validateInvite"
          class="space-y-4"
          @submit="onInvite"
        >
          <UFormField
            name="name"
            label="Nome e cognome"
            required
          >
            <UInput
              v-model="invite.name"
              class="w-full"
            />
          </UFormField>

          <UFormField
            name="email"
            label="Email di lavoro"
            required
          >
            <UInput
              v-model="invite.email"
              type="email"
              placeholder="nome@impresa.it"
              class="w-full"
            />
          </UFormField>

          <UFormField
            name="role"
            label="Ruolo"
          >
            <URadioGroup
              v-model="invite.role"
              :items="userRoles"
              value-key="value"
              label-key="value"
            />
          </UFormField>
        </UForm>
      </template>

      <template #footer>
        <UButton
          label="Annulla"
          color="neutral"
          variant="ghost"
          @click="inviteOpen = false"
        />
        <UButton
          type="submit"
          form="invite-form"
          label="Invia invito"
        />
      </template>
    </UModal>
  </SettingsPanel>
</template>
