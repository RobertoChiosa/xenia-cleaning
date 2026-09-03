<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { weekPlan } = useOrg()

const view = ref('week')
const zone = ref('Tutte le zone')
</script>

<template>
  <UDashboardPanel id="schedule">
    <template #header>
      <UDashboardNavbar title="Planning">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Pubblica turni"
            icon="i-lucide-send"
            size="sm"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UFieldGroup size="sm">
            <UButton
              label="Indietro"
              icon="i-lucide-chevron-left"
              color="neutral"
              variant="outline"
            />
            <UButton
              label="31 ago – 6 set"
              color="neutral"
              variant="outline"
            />
            <UButton
              label="Avanti"
              trailing-icon="i-lucide-chevron-right"
              color="neutral"
              variant="outline"
            />
          </UFieldGroup>
        </template>

        <template #right>
          <USelect
            v-model="zone"
            size="sm"
            :items="['Tutte le zone', 'Milano centro', 'Milano nord', 'Milano sud', 'Milano est', 'Milano ovest']"
          />
          <USelect
            v-model="view"
            size="sm"
            :items="[{ label: 'Settimana', value: 'week' }, { label: 'Giorno', value: 'day' }, { label: 'Mese', value: 'month' }]"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="grid gap-3 lg:grid-cols-7 sm:grid-cols-2">
        <div
          v-for="day in weekPlan"
          :key="day.day"
          class="rounded-lg border border-default bg-elevated/25 p-3 space-y-2"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-highlighted">
              {{ day.day }}
            </p>
            <span class="text-xs text-muted">{{ day.shifts.length }}</span>
          </div>

          <div
            v-for="shift in day.shifts"
            :key="shift.time + shift.property"
            class="rounded-md border border-default bg-default p-2 space-y-1"
          >
            <p class="text-xs font-medium text-highlighted">
              {{ shift.time }} · {{ shift.property }}
            </p>
            <p
              class="text-xs"
              :class="shift.crew === 'Da assegnare' ? 'text-warning' : 'text-muted'"
            >
              {{ shift.crew }}
            </p>
          </div>

          <UButton
            label="Aggiungi"
            icon="i-lucide-plus"
            color="neutral"
            variant="ghost"
            size="xs"
            block
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
