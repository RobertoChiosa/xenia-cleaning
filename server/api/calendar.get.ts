import ical, { type VEvent } from 'node-ical'

// ponytail: minimal SSRF guard — https-only, blocks obviously-internal hosts. Not a full allowlist:
// the URL is an org admin's own property setting, not public input, so the threat model is "don't let
// it hit our internal network / cloud metadata", not "restrict to one calendar provider".
const PRIVATE_HOST = /^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  if (typeof url !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'URL calendario non valido' })
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'URL calendario non valido' })
  }
  if (parsedUrl.protocol !== 'https:' || PRIVATE_HOST.test(parsedUrl.hostname)) {
    throw createError({ statusCode: 400, statusMessage: 'URL calendario non valido' })
  }

  const res = await fetch(url)
  if (!res.ok) {
    throw createError({ statusCode: 502, statusMessage: 'Impossibile scaricare il calendario' })
  }

  const events = ical.parseICS(await res.text())
  const cutoff = Date.now() - 24 * 60 * 60 * 1000 // ieri: non perdere un evento in corso da oggi

  return Object.values(events)
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
