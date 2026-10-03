<script setup lang="ts">
defineProps<{ title: string, description?: string, label?: string }>()
const emit = defineEmits<{ close: [confirmed: boolean] }>()
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :close="false"
    @update:open="emit('close', false)"
  >
    <template #footer>
      <UButton
        label="Annulla"
        color="neutral"
        variant="ghost"
        @click="emit('close', false)"
      />
      <UButton
        :label="label ?? 'Conferma'"
        color="error"
        @click="emit('close', true)"
      />
    </template>
  </UModal>
</template>
