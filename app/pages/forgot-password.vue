<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const sent = ref(false)

const fields = [{
  name: 'email',
  type: 'email' as const,
  label: 'Email',
  placeholder: 'nome@impresa.it',
  required: true
}]

// ponytail: solo UI — mostra la conferma, non invia nulla
function onSubmit() {
  sent.value = true
}
</script>

<template>
  <UAuthForm
    v-if="!sent"
    title="Reimposta la password"
    description="Inserisci l'email di lavoro e ti inviamo un link per reimpostarla."
    icon="i-lucide-key-round"
    :fields="fields"
    :submit="{ label: 'Invia il link' }"
    @submit="onSubmit"
  >
    <template #footer>
      <ULink
        to="/login"
        class="text-sm text-primary font-medium"
      >
        Torna all'accesso
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
        Controlla la posta
      </h1>
      <p class="text-sm text-muted">
        Se l'email è associata a un account, il link per reimpostare la password è in arrivo. Scade tra 30 minuti.
      </p>
    </div>

    <UButton
      to="/login"
      label="Torna all'accesso"
      color="neutral"
      variant="subtle"
      block
    />
  </div>
</template>
