<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const fields = [{
  name: 'email',
  type: 'email' as const,
  label: 'Email',
  placeholder: 'you@agency.com',
  required: true
}, {
  name: 'password',
  type: 'password' as const,
  label: 'Password',
  placeholder: 'Enter your password',
  required: true
}, {
  name: 'remember',
  type: 'checkbox' as const,
  label: 'Keep me signed in'
}]

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  color: 'neutral' as const,
  variant: 'subtle' as const,
  block: true
}, {
  label: 'Apple',
  icon: 'i-simple-icons-apple',
  color: 'neutral' as const,
  variant: 'subtle' as const,
  block: true
}]

// ponytail: UI only — no auth call, just lands you on the dashboard
function onSubmit() {
  return navigateTo('/dashboard')
}
</script>

<template>
  <UAuthForm
    title="Welcome back"
    description="Sign in to your agency workspace."
    icon="i-lucide-sparkles"
    :fields="fields"
    :providers="providers"
    :submit="{ label: 'Sign in' }"
    separator="or"
    @submit="onSubmit"
  >
    <template #password-hint>
      <ULink
        to="/forgot-password"
        class="text-primary font-medium"
      >
        Forgot password?
      </ULink>
    </template>

    <template #footer>
      <p class="text-sm text-muted">
        No workspace yet?
        <ULink
          to="/"
          class="text-primary font-medium"
        >
          Book a demo
        </ULink>
      </p>
    </template>
  </UAuthForm>
</template>
