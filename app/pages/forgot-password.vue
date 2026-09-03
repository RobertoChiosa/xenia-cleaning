<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const sent = ref(false)

const fields = [{
  name: 'email',
  type: 'email' as const,
  label: 'Email',
  placeholder: 'you@agency.com',
  required: true
}]

// ponytail: UI only — flips to the confirmation state, sends nothing
function onSubmit() {
  sent.value = true
}
</script>

<template>
  <UAuthForm
    v-if="!sent"
    title="Reset your password"
    description="Enter your work email and we'll send you a reset link."
    icon="i-lucide-key-round"
    :fields="fields"
    :submit="{ label: 'Send reset link' }"
    @submit="onSubmit"
  >
    <template #footer>
      <ULink
        to="/login"
        class="text-sm text-primary font-medium"
      >
        Back to sign in
      </ULink>
    </template>
  </UAuthForm>

  <div
    v-else
    class="text-center space-y-4"
  >
    <UIcon
      name="i-lucide-mail-check"
      class="size-10 text-primary mx-auto"
    />

    <div class="space-y-1">
      <h1 class="text-xl font-semibold text-highlighted">
        Check your inbox
      </h1>
      <p class="text-sm text-muted">
        If that email is on a workspace, a reset link is on its way. The link expires in 30 minutes.
      </p>
    </div>

    <UButton
      to="/login"
      label="Back to sign in"
      color="neutral"
      variant="subtle"
      block
    />
  </div>
</template>
