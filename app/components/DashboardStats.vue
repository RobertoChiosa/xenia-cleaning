<script setup lang="ts">
defineProps<{
  items: { label: string, value: string, hint: string }[]
}>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <UPageCard
      v-for="item in items"
      :key="item.label"
      :title="item.value"
      :description="item.label"
      variant="subtle"
      :ui="{ title: 'text-2xl font-semibold' }"
    >
      <template #footer>
        <p class="text-xs text-muted">
          {{ item.hint }}
        </p>
      </template>
    </UPageCard>
  </div>
</template>
