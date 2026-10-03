<script setup lang="ts">
import type { FormError, TableColumn } from '@nuxt/ui'
import type { Membership, OrgRole } from '~/composables/useOrg'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const confirm = useConfirm()
const { org, memberships, inviteMember, updateMember, removeMember } = useOrg()

const search = ref('')
const inviteOpen = ref(false)
const editing = ref<Membership | null>(null)

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

function openInvite() {
  editing.value = null
  Object.assign(state, blank())
  inviteOpen.value = true
}

function openEdit(membership: Membership) {
  editing.value = membership
  Object.assign(state, { email: membership.user?.email ?? membership.userId, role: membership.role })
  inviteOpen.value = true
}

async function onSubmit() {
  try {
    if (editing.value) {
      await updateMember(editing.value.id, state.role)
      toast.add({ title: 'Utente aggiornato', description: state.email, icon: 'i-lucide-check', color: 'success' })
    } else {
      await inviteMember(state.email.trim(), state.role)
      toast.add({ title: 'Utente invitato', description: state.email, icon: 'i-lucide-check', color: 'success' })
    }
    inviteOpen.value = false
  } catch (error) {
    toast.add({
      title: editing.value ? 'Modifica non riuscita' : 'Invito non riuscito',
      description: error instanceof Error ? error.message : 'Riprova più tardi.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  }
}

async function onRemove(membership: Membership) {
  if (!await confirm('Rimuovere utente', `${membership.user?.email ?? membership.userId} perde l'accesso a ${org.value!.name}.`, 'Rimuovi')) return
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
            @click="openInvite()"
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
              label="Modifica"
              icon="i-lucide-pencil"
              color="neutral"
              variant="subtle"
              size="xs"
              class="mr-2"
              @click="openEdit(row.original)"
            />
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
        :title="editing ? 'Modifica utente' : 'Invita utente'"
        :description="editing ? 'Puoi cambiare solo il ruolo.' : `Viene aggiunto a ${org!.name}. Se non ha ancora un account riceve un'email per scegliere la password.`"
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
                :disabled="!!editing"
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
            :label="editing ? 'Salva' : 'Invita'"
          />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
