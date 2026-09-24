<script setup lang="ts">
const { data: rows } = useCalendarEvents()
const { reorderProperties } = useOrg()

const DAY_WIDTH = 72 // px — colonne a larghezza fissa: senza, il grid si stira a 1fr e non avanza mai overflow da scrollare
const BASE_DAYS = 14
const LOAD_MORE_DAYS = 14
const MS_DAY = 86_400_000
const today = new Date().toISOString().slice(0, 10)

const rangeStart = ref(today)
const visibleDays = ref(BASE_DAYS)

// riempie tutta la larghezza disponibile invece di lasciare uno spazio vuoto a destra su schermi larghi
const scrollEl = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const LABEL_WIDTH = 180 // px — larghezza della colonna sticky "Proprietà"
const fillDays = computed(() => Math.max(BASE_DAYS, Math.ceil((containerWidth.value - LABEL_WIDTH) / DAY_WIDTH) + 1))

let resizeObserver: ResizeObserver | undefined
onMounted(() => {
  if (!scrollEl.value) return
  resizeObserver = new ResizeObserver((entries) => {
    containerWidth.value = entries[0]!.contentRect.width
    if (visibleDays.value < fillDays.value) visibleDays.value = fillDays.value
  })
  resizeObserver.observe(scrollEl.value)
})
onUnmounted(() => resizeObserver?.disconnect())

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

// riporta la vista all'inizio della nuova finestra invece di lasciarla scrollata dov'era prima
function resetScroll() {
  if (scrollEl.value) scrollEl.value.scrollLeft = 0
}

function prevWeek() {
  rangeStart.value = addDays(rangeStart.value, -7)
  visibleDays.value = fillDays.value
  resetScroll()
}
function nextWeek() {
  rangeStart.value = addDays(rangeStart.value, 7)
  visibleDays.value = fillDays.value
  resetScroll()
}
function goToday() {
  rangeStart.value = today
  visibleDays.value = fillDays.value
  resetScroll()
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

// Un soggiorno occupa la seconda metà del giorno di check-in e la prima metà di quello di
// check-out: nella colonna del cambio si vede così la coda della prenotazione che finisce
// accanto alla testa di quella che comincia, invece di due barre attaccate al bordo.
const HALF_DAY = 0.5

// ponytail: una corsia per proprietà, niente gestione di eventi sovrapposti sulla stessa unità
function barsFor(row: Row) {
  const total = days.value.length
  const bars: { event: CalendarEvent, leftPct: number, widthPct: number }[] = []
  for (const calEvent of row.events) {
    const checkIn = diffDays(rangeStart.value, calEvent.start.slice(0, 10)) + HALF_DAY
    const checkOut = diffDays(rangeStart.value, calEvent.end.slice(0, 10)) + HALF_DAY
    if (checkOut < 0 || checkIn > total) continue
    const left = Math.max(0, Math.min(total, checkIn))
    // una prenotazione senza notti resta comunque visibile come mezza giornata
    const right = Math.max(0, Math.min(total, Math.max(checkOut, checkIn + HALF_DAY)))
    if (right <= left) continue
    bars.push({ event: calEvent, leftPct: (left / total) * 100, widthPct: ((right - left) / total) * 100 })
  }
  return bars
}

// i periodi bloccati sui provider (Lodgify, ecc.) arrivano come evento con questo titolo, non come vera prenotazione
function isClosed(calEvent: CalendarEvent) {
  return /closed/i.test(calEvent.summary)
}

function barLabel(calEvent: CalendarEvent) {
  if (isClosed(calEvent)) return 'Chiuso'
  return calEvent.guests ? `${calEvent.guests} ospiti` : 'Prenotato'
}

// trascinamento con il mouse per scorrere in orizzontale (rotellina verticale e touch scrollano nativamente già da soli)
const panning = ref(false)
let panStartX = 0
let panStartScroll = 0

function onPanStart(event: MouseEvent) {
  const el = event.currentTarget as HTMLElement
  panning.value = true
  panStartX = event.clientX
  panStartScroll = el.scrollLeft
}
function onPanMove(event: MouseEvent) {
  if (!panning.value) return
  const el = event.currentTarget as HTMLElement
  el.scrollLeft = panStartScroll - (event.clientX - panStartX)
}
function onPanEnd() {
  panning.value = false
}

// trascina una riga proprietà per riordinare: mousedown.stop sulla maniglia evita che
// parta anche il pan orizzontale del contenitore
const dragRowIndex = ref<number | null>(null)

function onRowDragStart(index: number) {
  dragRowIndex.value = index
}
async function onRowDrop(index: number) {
  const from = dragRowIndex.value
  dragRowIndex.value = null
  if (from === null || from === index || !rows.value) return
  const reordered = [...rows.value]
  const [moved] = reordered.splice(from, 1)
  reordered.splice(index, 0, moved!)
  await reorderProperties(reordered.map(row => row.property.id))
}
</script>

<template>
  <UCard
    class="flex h-full flex-col"
    :ui="{ body: 'p-0 sm:p-0 flex-1 min-h-0 overflow-hidden' }"
  >
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
      ref="scrollEl"
      class="h-full overflow-auto select-none"
      :class="panning ? 'cursor-grabbing' : 'cursor-grab'"
      @scroll="onScroll"
      @mousedown="onPanStart"
      @mousemove="onPanMove"
      @mouseup="onPanEnd"
      @mouseleave="onPanEnd"
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
              :class="day === today ? 'bg-primary text-inverted font-semibold' : 'text-muted'"
            >
              {{ formatDay(day) }}
            </div>
          </div>
        </div>

        <div
          v-for="(row, index) in rows"
          :key="row.property.id"
          class="flex border-b border-default"
          :class="dragRowIndex === index ? 'opacity-40' : ''"
          @dragover.prevent
          @drop="onRowDrop(index)"
        >
          <div
            draggable="true"
            class="sticky left-0 z-10 flex w-[180px] shrink-0 cursor-grab items-center gap-1.5 bg-default px-3 py-3 border-r border-default"
            @mousedown.stop
            @dragstart="onRowDragStart(index)"
          >
            <UIcon
              name="i-lucide-grip-vertical"
              class="size-3.5 shrink-0 text-dimmed"
            />
            <ULink
              :to="`/dashboard/properties/${row.property.id}`"
              class="flex flex-1 items-center gap-1.5 text-sm font-medium text-highlighted truncate"
            >
              {{ row.property.name }}
              <UIcon
                v-if="row.error"
                name="i-lucide-triangle-alert"
                class="size-3.5 text-error shrink-0"
              />
            </ULink>
          </div>

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
                  class="relative"
                  :class="day === today ? 'bg-primary/10 border-x border-primary' : 'border-r border-default last:border-r-0'"
                />
              </div>

              <div
                v-for="bar in barsFor(row)"
                :key="bar.event.uid"
                class="group absolute bottom-1.5 top-1.5 flex items-center gap-1 rounded-full px-2.5 ring-1 ring-inset"
                :class="isClosed(bar.event) ? 'bg-elevated ring-default' : 'bg-primary/15 ring-primary/30'"
                :style="{ left: `calc(${bar.leftPct}% + 2px)`, width: `calc(${bar.widthPct}% - 4px)` }"
              >
                <span
                  class="flex items-center gap-1 truncate text-xs font-medium"
                  :class="isClosed(bar.event) ? 'text-dimmed' : 'text-primary'"
                >
                  <UIcon
                    :name="isClosed(bar.event) ? 'i-lucide-ban' : 'i-lucide-users'"
                    class="size-3 shrink-0"
                  />
                  {{ barLabel(bar.event) }}
                </span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex flex-wrap items-center gap-4 text-xs text-muted">
        <span class="flex items-center gap-1.5">
          <span class="size-2.5 rounded-full bg-primary/60" />
          Prenotato
        </span>
        <span class="flex items-center gap-1.5">
          <span class="size-2.5 rounded-full bg-neutral-500/40" />
          Chiuso
        </span>
      </div>
    </template>
  </UCard>
</template>
