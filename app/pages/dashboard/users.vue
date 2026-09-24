<script setup lang="ts">
import type { FormError, TableColumn } from '@nuxt/ui'
import type { Membership, OrgRole } from '~/composables/useOrg'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const { org, memberships, inviteMember, removeMember } = useOrg()

const search = ref('')
const inviteOpen = ref(false)

const roleItems = [{ label: 'Membro', value: 'member' }, { label: 'Admin', value: 'admin' }, { label: 'Owner', value: 'owner' }]

const blank = () => ({ email: '', role: 'member' as OrgRole })
const state = reactive(blank())

const filtered = computed(() => memberships.value.filter(member =>
  (member.user?.email ?? '').toLowerCase().includes(search.value.toLowerCase())))

const columns: TableColumn<Membership>[] = [
  { accessorKey: 'email', header: 'Utente' },
  { accessorKey: 'role', header: 'Ruolo' },
  { id: 'actions' }
]

function validate(state: { email: string, role: OrgRole }): FormError[] {
  const errors: FormError[] = []

  if (!state.email.trim()) {
    errors.push({ name: 'email', message: 'L\'email è obbligatoria.' })
  }

  return errors
}

async function onSubmit() {
  try {
    await inviteMember(state.email.trim(), state.role)
    toast.add({ title: 'Utente invitato', description: state.email, icon: 'i-lucide-check', color: 'success' })
    inviteOpen.value = false
    Object.assign(state, blank())
  } catch (error) {
    toast.add({
      title: 'Invito non riuscito',
      description: error instanceof Error ? error.message : 'Riprova più tardi.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  }
}

async function onRemove(membership: Membership) {
  try {
    await removeMember(membership.id)
    toast.add({ title: 'Utente rimosso', icon: 'i-lucide-check', color: 'success' })
  } catch (error) {
    toast.add({
      title: 'Rimozione non riuscita',
      description: error instanceof Error ? error.message : 'Riprova più tardi.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  }
}
</script>

<template>
  <UDashboardPanel id="users">
    <template #header>
      <UDashboardNavbar title="Utenti">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Invita utente"
            icon="i-lucide-user-plus"
            size="sm"
            @click="inviteOpen = true"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Cerca utente"
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
          empty="Nessun utente trovato."
        >
          <template #email-cell="{ row }">
            <div class="flex items-center gap-2">
              <UAvatar
                :alt="row.original.user?.email"
                size="xs"
              />
              <p class="font-medium text-highlighted truncate">
                {{ row.original.user?.email ?? row.original.userId }}
              </p>
            </div>
          </template>

          <template #role-cell="{ row }">
            <UBadge
              :label="row.original.role"
              color="neutral"
              variant="subtle"
            />
          </template>

          <template #actions-cell="{ row }">
            <UButton
              label="Rimuovi"
              icon="i-lucide-user-minus"
              color="error"
              variant="subtle"
              size="xs"
              @click="onRemove(row.original)"
            />
          </template>
        </UTable>
      </UCard>

      <UModal
        v-model:open="inviteOpen"
        title="Invita utente"
        :description="`Viene aggiunto a ${org!.name}. Deve aver già effettuato l'accesso almeno una volta.`"
      >
        <template #body>
          <UForm
            id="invite-form"
            :state="state"
            :validate="validate"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField
              name="email"
              label="Email"
              required
            >
              <UInput
                v-model="state.email"
                type="email"
                placeholder="nome@impresa.it"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="role"
              label="Ruolo"
              required
            >
              <USelect
                v-model="state.role"
                :items="roleItems"
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
            @click="inviteOpen = false"
          />
          <UButton
            type="submit"
            form="invite-form"
            label="Invita"
          />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
