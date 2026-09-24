<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const supabase = useSupabaseClient()
const toast = useToast()

const fields = [{
  name: 'email',
  type: 'email' as const,
  label: 'Email',
  placeholder: 'nome@impresa.it',
  required: true
}, {
  name: 'password',
  type: 'password' as const,
  label: 'Password',
  placeholder: 'Inserisci la password',
  required: true
}]

async function onSubmit(event: { data: { email: string, password: string } }) {
  const { error } = await supabase.auth.signInWithPassword(event.data)
  if (error) {
    toast.add({ title: 'Accesso non riuscito', description: error.message, icon: 'i-lucide-triangle-alert', color: 'error' })
    return
  }
  return navigateTo('/dashboard')
}
</script>

<template>
  <UAuthForm
    title="Bentornato"
    description="Accedi all'area della tua impresa."
    icon="i-lucide-sparkles"
    :fields="fields"
    :submit="{ label: 'Accedi' }"
    @submit="onSubmit"
  >
    <template #password-hint>
      <ULink
        to="/forgot-password"
        class="text-primary font-medium"
      >
        Password dimenticata?
      </ULink>
    </template>
  </UAuthForm>
</template>
