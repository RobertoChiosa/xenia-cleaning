<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

definePageMeta({ layout: 'auth' })

const supabase = useSupabaseClient()
const toast = useToast()
const ready = ref(false)
const email = ref('')
const linkError = ref('')

const fields = [{
  name: 'password',
  type: 'password' as const,
  label: 'Nuova password',
  placeholder: 'Almeno 8 caratteri',
  required: true
}, {
  name: 'confirm',
  type: 'password' as const,
  label: 'Conferma password',
  placeholder: 'Ripeti la password',
  required: true
}]

// il link di reset (PKCE, ?code=) viene scambiato da solo dal client; quello d'invito mandato da
// xenia-api arriva invece come #access_token=… (flusso implicito) e il client PKCE lo rifiuta, quindi
// la sessione la impostiamo a mano. Sempre, anche se c'è già una sessione: altrimenti chi apre il link
// da un browser dove è loggato un altro utente (es. l'admin che ha invitato) cambierebbe la password sbagliata
onMounted(async () => {
  const hash = new URLSearchParams(window.location.hash.slice(1))
  await supabase.auth.getSession()
  if (hash.get('access_token') && hash.get('refresh_token')) {
    const { error } = await supabase.auth.setSession({ access_token: hash.get('access_token')!, refresh_token: hash.get('refresh_token')! })
    if (error) await supabase.auth.signOut({ scope: 'local' })
  }
  history.replaceState(null, '', window.location.pathname)

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    email.value = user.email ?? ''
    ready.value = true
  } else {
    linkError.value = hash.get('error_description') ?? 'Il link non è valido o è scaduto.'
  }
})

function validate(state: Partial<{ password: string, confirm: string }>): FormError[] {
  const errors: FormError[] = []
  if ((state.password ?? '').length < 8) errors.push({ name: 'password', message: 'Almeno 8 caratteri.' })
  if (state.confirm !== state.password) errors.push({ name: 'confirm', message: 'Le password non coincidono.' })
  return errors
}

async function onSubmit(event: { data: { password: string } }) {
  const { error } = await supabase.auth.updateUser({ password: event.data.password })
  if (error) {
    toast.add({ title: 'Password non aggiornata', description: error.message, icon: 'i-lucide-triangle-alert', color: 'error' })
    return
  }
  toast.add({ title: 'Password aggiornata', icon: 'i-lucide-check', color: 'success' })
  return navigateTo('/dashboard')
}
</script>

<template>
  <UAuthForm
    v-if="ready"
    title="Scegli una nuova password"
    :description="`Account: ${email}`"
    icon="i-lucide-key-round"
    :fields="fields"
    :validate="validate"
    :submit="{ label: 'Salva la password' }"
    @submit="onSubmit"
  />

  <div
    v-else-if="linkError"
    class="text-center space-y-4"
  >
    <UIcon
      name="i-lucide-link-2-off"
      class="size-10 text-error mx-auto"
    />
    <p class="text-sm text-muted">
      {{ linkError }}
    </p>
    <UButton
      to="/forgot-password"
      label="Richiedi un nuovo link"
      color="neutral"
      variant="subtle"
      block
    />
  </div>

  <UIcon
    v-else
    name="i-lucide-loader-circle"
    class="size-8 animate-spin mx-auto block"
  />
</template>
