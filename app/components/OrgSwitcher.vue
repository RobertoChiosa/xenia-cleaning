<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{ collapsed?: boolean }>()

const { orgs, org, activeId, setOrg } = useOrg()
const route = useRoute()

// le rotte di dettaglio sono legate all'organizzazione: cambiando, si torna alla bacheca
function switchTo(id: string) {
  setOrg(id)
  if (route.path !== '/dashboard' && route.path.startsWith('/dashboard/properties/')) {
    return navigateTo('/dashboard')
  }
}

const items = computed<DropdownMenuItem[][]>(() => [
  orgs.value.map(item => ({
    label: item.name,
    suffix: item.plan,
    avatar: { text: item.initials },
    type: 'checkbox' as const,
    checked: item.id === activeId.value,
    onSelect: () => switchTo(item.id)
  })),
  [{
    label: 'Dati azienda',
    icon: 'i-lucide-building-2',
    to: '/dashboard/settings/azienda'
  }, {
    label: 'Utenti',
    icon: 'i-lucide-users',
    to: '/dashboard/settings/utenti'
  }],
  [{
    label: 'Vai al sito pubblico',
    icon: 'i-lucide-external-link',
    to: '/'
  }]
])
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'start' }"
    :ui="{ content: collapsed ? 'w-64' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      color="neutral"
      variant="ghost"
      :block="!collapsed"
      :square="collapsed"
      :aria-label="`Organizzazione attiva: ${org.name}. Cambia organizzazione`"
      :ui="{ base: 'justify-start gap-2', trailingIcon: 'ms-auto' }"
      :trailing-icon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
    >
      <UAvatar
        :text="org.initials"
        size="sm"
        class="shrink-0 bg-primary/10 text-primary"
      />

      <span
        v-if="!collapsed"
        class="min-w-0 text-left"
      >
        <span class="block text-[10px] font-medium uppercase tracking-wide text-dimmed">
          Organizzazione
        </span>
        <span class="block text-sm font-semibold text-highlighted truncate">
          {{ org.name }}
        </span>
      </span>
    </UButton>
  </UDropdownMenu>
</template>
