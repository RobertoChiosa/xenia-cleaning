<script setup lang="ts">
definePageMeta({ layout: 'auth' })

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
}, {
  name: 'remember',
  type: 'checkbox' as const,
  label: 'Resta collegato'
}]

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  color: 'neutral' as const,
  variant: 'subtle' as const,
  block: true
}, {
  label: 'Microsoft',
  icon: 'i-simple-icons-microsoft',
  color: 'neutral' as const,
  variant: 'subtle' as const,
  block: true
}]

// ponytail: solo UI — nessuna chiamata di autenticazione, porta direttamente alla dashboard
function onSubmit() {
  return navigateTo('/dashboard')
}
</script>

<template>
  <UAuthForm
    title="Bentornato"
    description="Accedi all'area della tua impresa."
    icon="i-lucide-sparkles"
    :fields="fields"
    :providers="providers"
    :submit="{ label: 'Accedi' }"
    separator="oppure"
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

    <template #footer>
      <p class="text-sm text-muted">
        Non hai ancora un account?
        <ULink
          to="/"
          class="text-primary font-medium"
        >
          Richiedi una demo
        </ULink>
      </p>
    </template>
  </UAuthForm>
</template>
