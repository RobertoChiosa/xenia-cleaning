import ical, { type VEvent } from 'node-ical'

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  // ponytail: minimal SSRF guard — only Google's private-ICS URL shape is accepted, this isn't a general proxy
  if (typeof url !== 'string' || !url.startsWith('https://calendar.google.com/calendar/ical/')) {
    throw createError({ statusCode: 400, statusMessage: 'URL calendario non valido' })
  }

  const res = await fetch(url)
  if (!res.ok) {
    throw createError({ statusCode: 502, statusMessage: 'Impossibile scaricare il calendario' })
  }

  const parsed = ical.parseICS(await res.text())
  const cutoff = Date.now() - 24 * 60 * 60 * 1000 // ieri: non perdere un evento in corso da oggi

  return Object.values(parsed)
    .filter((item): item is VEvent => !!item && item.type === 'VEVENT')
    .filter((item): item is VEvent & { start: Date } => !!item.start && new Date(item.end ?? item.start).getTime() >= cutoff)
    .map(item => ({
      uid: item.uid,
      summary: item.summary || '(senza titolo)',
      start: new Date(item.start).toISOString(),
      end: new Date(item.end ?? item.start).toISOString(),
      allDay: item.datetype === 'date'
    }))
    .sort((a, b) => a.start.localeCompare(b.start))
})
