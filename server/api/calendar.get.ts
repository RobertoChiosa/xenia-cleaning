import ical, { type VEvent } from 'node-ical'

// ponytail: minimal SSRF guard — https-only, blocks obviously-internal hosts. Not a full allowlist:
// the URL is an org admin's own property setting, not public input, so the threat model is "don't let
// it hit our internal network / cloud metadata", not "restrict to one calendar provider".
const PRIVATE_HOST = /^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/

// Lodgify's ext-info=true description puts the headcount in free text ("... for 3 people"), not a structured field
function guestCount(description?: string | { val: string }): number | undefined {
  const text = typeof description === 'string' ? description : description?.val
  const match = text?.match(/for (\d+) people/i)
  return match ? Number(match[1]) : undefined
}

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
  // ponytail: un anno di storico basta a scorrere all'indietro nel calendario senza tirare giù
  // feed enormi; se servisse andare più indietro, il passo successivo è passare la finestra
  // richiesta dal client come parametro invece di allargare questa costante
  const cutoff = Date.now() - 365 * 24 * 60 * 60 * 1000

  return Object.values(events)
    .filter((item): item is VEvent => !!item && item.type === 'VEVENT')
    .filter((item): item is VEvent & { start: Date } => !!item.start && new Date(item.end ?? item.start).getTime() >= cutoff)
    .map(item => ({
      uid: item.uid,
      summary: item.summary || '(senza titolo)',
      start: new Date(item.start).toISOString(),
      end: new Date(item.end ?? item.start).toISOString(),
      guests: guestCount(item.description)
    }))
    .sort((a, b) => a.start.localeCompare(b.start))
})
