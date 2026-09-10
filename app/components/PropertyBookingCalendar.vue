<script setup lang="ts">
const { properties, bookings, jobs } = useOrg()

const VISIBLE_DAYS = 14
const MS_DAY = 86_400_000

const rangeStart = ref(today)

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

const days = computed(() => Array.from({ length: VISIBLE_DAYS }, (_, i) => addDays(rangeStart.value, i)))

function prevWeek() {
  rangeStart.value = addDays(rangeStart.value, -7)
}
function nextWeek() {
  rangeStart.value = addDays(rangeStart.value, 7)
}
function goToday() {
  rangeStart.value = today
}

type Booking = typeof bookings.value[number]

// la barra occupa da metà del giorno di checkin a metà del giorno di checkout:
// l'altra metà di quel giorno resta libera per il prossimo ospite
// ponytail: una corsia per proprietà, niente gestione di prenotazioni sovrapposte sulla stessa unità
function barsFor(propertyId: string) {
  const total = days.value.length
  const bars: { booking: Booking, leftPct: number, widthPct: number }[] = []
  for (const booking of bookings.value) {
    if (booking.propertyId !== propertyId) continue
    const checkinOffset = diffDays(rangeStart.value, booking.checkin)
    const checkoutOffset = diffDays(rangeStart.value, booking.checkout)
    if (checkoutOffset < 0 || checkinOffset > total) continue
    const left = Math.max(0, Math.min(total, checkinOffset + 0.5))
    const right = Math.max(0, Math.min(total, checkoutOffset + 0.5))
    if (right <= left) continue
    bars.push({ booking, leftPct: (left / total) * 100, widthPct: ((right - left) / total) * 100 })
  }
  return bars
}

function jobSummary(jobId: string) {
  const job = jobs.value.find(item => item.id === jobId)
  if (!job) return ''
  return `${job.window} · ${job.crew} · ${job.status}`
}

// rosso: da creare o da assegnare — giallo: assegnato, in attesa di essere concluso — verde: concluso
function checkoutState(booking: Booking): 'red' | 'yellow' | 'green' {
  if (!booking.jobId) return 'red'
  const job = jobs.value.find(item => item.id === booking.jobId)
  if (!job || job.status === 'Da assegnare' || job.status === 'Annullato') return 'red'
  if (job.status === 'Concluso') return 'green'
  return 'yellow'
}

// un giorno è "attivabile" se è il checkout di una prenotazione su quella proprietà,
// anche quando lo stesso giorno è anche il checkin di un'altra prenotazione
function checkoutInfo(propertyId: string, day: string) {
  const booking = bookings.value.find(item => item.propertyId === propertyId && item.checkout === day)
  if (!booking) return null
  return {
    booking,
    state: checkoutState(booking),
    tooltip: booking.jobId ? jobSummary(booking.jobId) : 'Crea l\'intervento per questo checkout'
  }
}

const interventionOpen = ref(false)
const interventionBookingId = ref<string | null>(null)

function openIntervention(bookingId: string) {
  interventionBookingId.value = bookingId
  interventionOpen.value = true
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
    >
      <div class="min-w-[1100px]">
        <div class="flex border-b border-default">
          <div class="sticky left-0 z-10 w-[180px] shrink-0 bg-default px-3 py-2 text-xs font-medium text-dimmed border-r border-default">
            Proprietà
          </div>
          <div
            class="grid flex-1"
            :style="{ gridTemplateColumns: `repeat(${days.length}, minmax(72px, 1fr))` }"
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
          v-for="property in properties"
          :key="property.id"
          class="flex border-b border-default"
        >
          <ULink
            :to="`/dashboard/properties/${property.id}`"
            class="sticky left-0 z-10 flex w-[180px] shrink-0 items-center bg-default px-3 py-3 text-sm font-medium text-highlighted border-r border-default truncate"
          >
            {{ property.name }}
          </ULink>

          <div class="relative flex-1">
            <div
              class="grid h-14"
              :style="{ gridTemplateColumns: `repeat(${days.length}, minmax(72px, 1fr))` }"
            >
              <div
                v-for="day in days"
                :key="day"
                class="relative border-r border-default last:border-r-0 transition-shadow hover:ring-1 hover:ring-inset hover:ring-highlighted"
                :class="day === today ? 'bg-primary/5' : ''"
              >
                <template
                  v-for="info in [checkoutInfo(property.id, day)]"
                  :key="info?.booking.id ?? day"
                >
                  <UTooltip
                    v-if="info"
                    :text="info.tooltip"
                  >
                    <button
                      type="button"
                      class="absolute left-1/2 top-1/2 z-10 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2"
                      :class="{
                        'border-error bg-transparent hover:bg-error/10': info.state === 'red',
                        'border-warning bg-warning text-white': info.state === 'yellow',
                        'border-success bg-success text-white': info.state === 'green'
                      }"
                      :aria-label="info.tooltip"
                      @click="openIntervention(info.booking.id)"
                    >
                      <UIcon
                        v-if="info.state === 'yellow'"
                        name="i-lucide-clock"
                        class="size-3.5"
                      />
                      <UIcon
                        v-else-if="info.state === 'green'"
                        name="i-lucide-check"
                        class="size-3.5"
                      />
                    </button>
                  </UTooltip>
                </template>
              </div>
            </div>

            <div
              v-for="bar in barsFor(property.id)"
              :key="bar.booking.id"
              class="absolute bottom-1.5 h-1.5 rounded-full bg-black/50"
              :style="{ left: `calc(${bar.leftPct}% + 3px)`, width: `calc(${bar.widthPct}% - 6px)` }"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <p class="text-xs text-muted">
        Rosso = da creare o da assegnare. Giallo = assegnato, in attesa di essere concluso. Verde = concluso. Passa sopra per i dettagli, clicca per agire.
      </p>
    </template>
  </UCard>

  <InterventionModal
    v-model:open="interventionOpen"
    :booking-id="interventionBookingId"
  />
</template>
