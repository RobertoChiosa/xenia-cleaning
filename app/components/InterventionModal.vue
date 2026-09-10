<script setup lang="ts">
const props = defineProps<{ bookingId: string | null }>()
const open = defineModel<boolean>('open', { required: true })

const { bookings, jobs, users, checkout, assignJob, rescheduleJob, conflictAt } = useOrg()
const toast = useToast()

const booking = computed(() => bookings.value.find(item => item.id === props.bookingId))
const job = computed(() => (booking.value?.jobId ? jobs.value.find(item => item.id === booking.value!.jobId) : undefined))

const from = ref('11:00')
const to = ref('15:00')
const search = ref('')
const selected = ref<string | null>(null)

// ogni apertura riparte dai dati reali dell'intervento, se già esiste
watch(open, (value) => {
  if (!value) return

  search.value = ''
  if (job.value) {
    const [start, end] = job.value.window.split('–').map(part => part.trim())
    from.value = start ?? '11:00'
    to.value = end ?? '15:00'
    const [first] = crewNames(job.value.crew)
    selected.value = first && first !== 'Da assegnare' ? first : null
  } else {
    from.value = '11:00'
    to.value = '15:00'
    selected.value = null
  }
})

const candidates = computed(() => users.value
  .filter(member => member.name.toLowerCase().includes(search.value.toLowerCase()))
  .map(member => ({
    ...member,
    conflict: booking.value ? conflictAt(booking.value.checkout, `${from.value} – ${to.value}`, member.name, job.value?.id) : undefined
  })))

function pick(name: string) {
  selected.value = selected.value === name ? null : name
}

function onSubmit() {
  if (!booking.value) return
  const window = `${from.value} – ${to.value}`
  const wasNew = !booking.value.jobId

  const jobId = booking.value.jobId ?? checkout(booking.value.id, window)
  if (!jobId) return
  if (!wasNew) rescheduleJob(jobId, window)

  if (selected.value) {
    const conflict = conflictAt(booking.value.checkout, window, selected.value, jobId)
    if (conflict) {
      toast.add({
        title: `${selected.value} è già occupato in questo orario`,
        description: `${conflict.property} · ${conflict.window}`,
        icon: 'i-lucide-alert-triangle',
        color: 'error'
      })
      return
    }
    assignJob(jobId, selected.value)
  }

  toast.add({
    title: wasNew ? 'Intervento creato' : 'Intervento aggiornato',
    description: booking.value.property,
    icon: 'i-lucide-check',
    color: 'success'
  })

  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Intervento"
    :description="booking ? `${booking.property} · checkout ${formatDay(booking.checkout)}` : ''"
  >
    <template #body>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Dalle">
            <UInput
              v-model="from"
              type="time"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Alle">
            <UInput
              v-model="to"
              type="time"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField label="Persona assegnata">
          <div class="space-y-2">
            <UInput
              v-model="search"
              icon="i-lucide-search"
              placeholder="Cerca operatore"
              class="w-full"
            />

            <div class="max-h-56 space-y-1.5 overflow-y-auto">
              <button
                v-for="member in candidates"
                :key="member.name"
                type="button"
                class="flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                :class="selected === member.name ? 'border-primary bg-primary/5' : 'border-default hover:bg-elevated'"
                :disabled="!!member.conflict"
                @click="pick(member.name)"
              >
                <UAvatar
                  :alt="member.name"
                  size="sm"
                />
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-highlighted truncate">
                    {{ member.name }}
                  </p>
                  <p
                    class="text-xs truncate"
                    :class="member.conflict ? 'text-error' : 'text-muted'"
                  >
                    {{ member.conflict ? `Occupato: ${member.conflict.property} · ${member.conflict.window}` : member.phone }}
                  </p>
                </div>
                <UIcon
                  v-if="selected === member.name"
                  name="i-lucide-check-circle"
                  class="size-4 text-primary shrink-0"
                />
              </button>

              <p
                v-if="!candidates.length"
                class="py-2 text-center text-sm text-muted"
              >
                Nessun operatore trovato.
              </p>
            </div>
          </div>
        </UFormField>
      </div>
    </template>

    <template #footer>
      <UButton
        label="Annulla"
        color="neutral"
        variant="ghost"
        @click="open = false"
      />
      <UButton
        label="Salva"
        @click="onSubmit"
      />
    </template>
  </UModal>
</template>
