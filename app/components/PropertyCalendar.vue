<script setup lang="ts">
const { data: rows } = useCalendarEvents()

const DAY_WIDTH = 72 // px — colonne a larghezza fissa: senza, il grid si stira a 1fr e non avanza mai overflow da scrollare
const BASE_DAYS = 14
const LOAD_MORE_DAYS = 14
const MS_DAY = 86_400_000
const today = new Date().toISOString().slice(0, 10)

const rangeStart = ref(today)
const visibleDays = ref(BASE_DAYS)

// tutta l'aritmetica resta in UTC: costruire in locale ed estrarre con toISOString() sfaserebbe
// i giorni di un'ora quando il fuso dell'utente non è UTC
function addDays(iso: string, amount: number) {
  const date = new Date(`${iso}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + amount)
  return date.toISOString().slice(0, 10)
}

function diffDays(from: string, to: string) {
  return Math.round((new Date(`${to}T12:00:00Z`).getTime() - new Date(`${from}T12:00:00Z`).getTime()) / MS_DAY)
}

const days = computed(() => Array.from({ length: visibleDays.value }, (_, i) => addDays(rangeStart.value, i)))
const gridWidth = computed(() => days.value.length * DAY_WIDTH)

function prevWeek() {
  rangeStart.value = addDays(rangeStart.value, -7)
  visibleDays.value = BASE_DAYS
}
function nextWeek() {
  rangeStart.value = addDays(rangeStart.value, 7)
  visibleDays.value = BASE_DAYS
}
function goToday() {
  rangeStart.value = today
  visibleDays.value = BASE_DAYS
}

// scorrendo verso destra si estende la finestra invece di restare bloccati a un limite fisso
function onScroll(event: Event) {
  const el = event.currentTarget as HTMLElement
  if (el.scrollLeft + el.clientWidth >= el.scrollWidth - DAY_WIDTH * 2) {
    visibleDays.value += LOAD_MORE_DAYS
  }
}

type Row = NonNullable<typeof rows.value>[number]
type CalendarEvent = Row['events'][number]

// ponytail: una corsia per proprietà, niente gestione di eventi sovrapposti sulla stessa unità
function barsFor(row: Row) {
  const total = days.value.length
  const bars: { event: CalendarEvent, leftPct: number, widthPct: number }[] = []
  for (const calEvent of row.events) {
    const startOffset = diffDays(rangeStart.value, calEvent.start.slice(0, 10))
    const endOffset = diffDays(rangeStart.value, calEvent.end.slice(0, 10))
    if (endOffset < 0 || startOffset > total) continue
    const left = Math.max(0, Math.min(total, startOffset))
    const right = Math.max(0, Math.min(total, Math.max(endOffset, startOffset + 1)))
    if (right <= left) continue
    bars.push({ event: calEvent, leftPct: (left / total) * 100, widthPct: ((right - left) / total) * 100 })
  }
  return bars
}

function eventTooltip(calEvent: CalendarEvent) {
  const guests = calEvent.guests ? ` · ${calEvent.guests} ospiti` : ''
  return `${calEvent.summary} · ${formatDay(calEvent.start.slice(0, 10))} – ${formatDay(calEvent.end.slice(0, 10))}${guests}`
}

// la rotellina del mouse scrolla in verticale per natura: qui la ridirigiamo in orizzontale
function onWheel(event: WheelEvent) {
  const el = event.currentTarget as HTMLElement
  if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
    el.scrollLeft += event.deltaY
    event.preventDefault()
  }
}
</script>

<template>
  <UCard :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <h2 class="font-semibold text-highlighted">
          Calendario proprietà
        </h2>
        <div class="flex items-center gap-1">
          <UButton
            icon="i-lucide-chevron-left"
            color="neutral"
            variant="ghost"
            size="xs"
            aria-label="Settimana precedente"
            @click="prevWeek"
          />
          <UButton
            label="Oggi"
            color="neutral"
            variant="subtle"
            size="xs"
            @click="goToday"
          />
          <UButton
            icon="i-lucide-chevron-right"
            color="neutral"
            variant="ghost"
            size="xs"
            aria-label="Settimana successiva"
            @click="nextWeek"
          />
        </div>
      </div>
    </template>

    <div
      class="overflow-x-auto"
      @wheel="onWheel"
      @scroll="onScroll"
    >
      <div>
        <div class="flex border-b border-default">
          <div class="sticky left-0 z-10 w-[180px] shrink-0 bg-default px-3 py-2 text-xs font-medium text-dimmed border-r border-default">
            Proprietà
          </div>
          <div
            class="grid"
            :style="{ gridTemplateColumns: `repeat(${days.length}, ${DAY_WIDTH}px)`, width: `${gridWidth}px` }"
          >
            <div
              v-for="day in days"
              :key="day"
              class="px-1 py-2 text-center text-xs"
              :class="day === today ? 'bg-primary/10 text-primary font-semibold' : 'text-muted'"
            >
              {{ formatDay(day) }}
            </div>
          </div>
        </div>

        <div
          v-for="row in rows"
          :key="row.property.id"
          class="flex border-b border-default"
        >
          <ULink
            :to="`/dashboard/properties/${row.property.id}`"
            class="sticky left-0 z-10 flex w-[180px] shrink-0 items-center gap-1.5 bg-default px-3 py-3 text-sm font-medium text-highlighted border-r border-default truncate"
          >
            {{ row.property.name }}
            <UIcon
              v-if="row.error"
              name="i-lucide-triangle-alert"
              class="size-3.5 text-error shrink-0"
              title="Calendario non raggiungibile"
            />
          </ULink>

          <div
            class="relative"
            :style="{ width: `${gridWidth}px` }"
          >
            <div
              v-if="!row.property.icsUrl"
              class="flex h-14 items-center px-3 text-xs text-dimmed"
            >
              Nessun calendario collegato
            </div>

            <template v-else>
              <div
                class="grid h-14"
                :style="{ gridTemplateColumns: `repeat(${days.length}, ${DAY_WIDTH}px)` }"
              >
                <div
                  v-for="day in days"
                  :key="day"
                  class="relative border-r border-default last:border-r-0"
                  :class="day === today ? 'bg-primary/5' : ''"
                />
              </div>

              <div
                v-for="bar in barsFor(row)"
                :key="bar.event.uid"
                class="group absolute bottom-1.5 top-1.5 flex items-center rounded-md bg-primary/15 px-2"
                :style="{ left: `calc(${bar.leftPct}% + 2px)`, width: `calc(${bar.widthPct}% - 4px)` }"
              >
                <UTooltip :text="eventTooltip(bar.event)">
                  <span class="truncate text-xs font-medium text-primary">
                    {{ bar.event.summary }}
                  </span>
                </UTooltip>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <p class="text-xs text-muted">
        Eventi dai calendari Google collegati a ciascuna proprietà. Passa sopra una barra per i dettagli.
      </p>
    </template>
  </UCard>
</template>
