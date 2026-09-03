<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import { parseDate } from '@internationalized/date'

definePageMeta({ layout: 'dashboard' })

const { jobs } = useOrg()

const selected = shallowRef<CalendarDate>(parseDate(today))

const selectedDate = computed(() => selected.value.toString())

const byDate = computed(() => {
  const map = new Map<string, typeof jobs.value>()
  for (const job of jobs.value) {
    map.set(job.date, [...(map.get(job.date) ?? []), job])
  }
  return map
})

const dayJobs = computed(() =>
  [...(byDate.value.get(selectedDate.value) ?? [])].sort((a, b) => a.window.localeCompare(b.window)))

const dayHours = computed(() => sum(dayJobs.value, job => job.hours))
const unassigned = computed(() => dayJobs.value.filter(job => job.status === 'Da assegnare').length)
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
    </template>

    <template #body>
      <div class="grid gap-4 lg:grid-cols-[auto_1fr] items-start">
        <UCard :ui="{ body: 'flex justify-center' }">
          <UCalendar
            v-model="selected"
            size="lg"
          >
            <template #day="{ day }">
              <UChip
                :show="byDate.has(day.toString())"
                size="2xs"
                :color="byDate.get(day.toString())?.some(job => job.status === 'Da assegnare') ? 'warning' : 'primary'"
              >
                {{ day.day }}
              </UChip>
            </template>
          </UCalendar>
        </UCard>

        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <template #header>
            <div class="flex items-center justify-between gap-4">
              <div class="min-w-0">
                <h2 class="font-semibold text-highlighted first-letter:uppercase">
                  {{ formatLongDay(selectedDate) }}
                </h2>
                <p class="text-sm text-muted">
                  {{ dayJobs.length }} interventi · {{ dayHours }} ore
                  <template v-if="unassigned">
                    · <span class="text-warning">{{ unassigned }} da coprire</span>
                  </template>
                </p>
              </div>

              <UButton
                label="Aggiungi"
                icon="i-lucide-plus"
                color="neutral"
                variant="subtle"
                size="sm"
              />
            </div>
          </template>

          <ul
            v-if="dayJobs.length"
            class="divide-y divide-default"
          >
            <li
              v-for="job in dayJobs"
              :key="job.id"
              class="flex items-center gap-4 px-4 py-3"
            >
              <span class="text-sm font-medium text-highlighted tabular-nums shrink-0">
                {{ job.window }}
              </span>

              <div class="min-w-0 flex-1">
                <ULink
                  :to="`/dashboard/properties/${job.propertyId}`"
                  class="text-sm font-medium text-highlighted"
                >
                  {{ job.property }}
                </ULink>
                <p
                  class="text-xs"
                  :class="job.crew === 'Da assegnare' ? 'text-warning' : 'text-muted'"
                >
                  {{ job.crew }} · {{ job.hours }} h
                </p>
              </div>

              <UBadge
                :label="job.status"
                :color="jobStatusColor[job.status]"
                variant="subtle"
                class="shrink-0"
              />
            </li>
          </ul>

          <UEmpty
            v-else
            icon="i-lucide-calendar-off"
            title="Nessun intervento"
            :description="`Non c'è niente in programma per ${formatLongDay(selectedDate)}.`"
            :actions="[{ label: 'Aggiungi intervento', icon: 'i-lucide-plus', color: 'neutral', variant: 'subtle' }]"
          />
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
