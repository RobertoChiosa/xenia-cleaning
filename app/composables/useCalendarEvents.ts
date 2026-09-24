export interface CalendarEvent {
  uid: string
  summary: string
  start: string
  end: string
  guests?: number
}

export function useCalendarEvents() {
  const { properties } = useOrg()

  return useAsyncData('calendar-events', async () => {
    const withCalendar = properties.value.filter(p => p.icsUrl)
    const settled = await Promise.allSettled(
      withCalendar.map(p => $fetch<CalendarEvent[]>('/api/calendar', { query: { url: p.icsUrl } }))
    )
    const byPropertyId = new Map(withCalendar.map((property, i) => {
      const result = settled[i]!
      return [property.id, { events: result.status === 'fulfilled' ? result.value : [], error: result.status === 'rejected' }] as const
    }))

    return properties.value.map(property => ({
      property,
      events: byPropertyId.get(property.id)?.events ?? [],
      error: byPropertyId.get(property.id)?.error ?? false
    }))
  }, { watch: [properties] })
}
