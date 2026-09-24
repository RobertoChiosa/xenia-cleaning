<template>
  <div class="min-h-svh flex flex-col items-center justify-center gap-8 p-4">
    <NuxtLink
      to="/login"
      aria-label="Xenia — vai all'accesso"
      class="focus-visible:outline-3 outline-primary/25 rounded-md p-1"
    >
      <AppLogo class="w-auto h-7 shrink-0" />
    </NuxtLink>

    <UPageCard class="w-full max-w-md">
      <slot />
    </UPageCard>
  </div>
</template>
