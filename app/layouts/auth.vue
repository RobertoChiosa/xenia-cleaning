<template>
  <div class="min-h-svh flex flex-col items-center justify-center gap-8 p-4">
    <NuxtLink
      to="/"
      aria-label="Xenia — vai alla home"
      class="focus-visible:outline-3 outline-primary/25 rounded-md p-1"
    >
      <AppLogo class="w-auto h-7 shrink-0" />
    </NuxtLink>

    <UPageCard class="w-full max-w-md">
      <slot />
    </UPageCard>

    <UButton
      to="/"
      label="Torna alla home"
      icon="i-lucide-arrow-left"
      color="neutral"
      variant="ghost"
      size="sm"
    />
  </div>
</template>
