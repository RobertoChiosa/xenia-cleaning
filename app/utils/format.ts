export const sum = <T>(rows: T[], pick: (row: T) => number) =>
  rows.reduce((total, row) => total + pick(row), 0)

export const initials = (name: string) =>
  name.split(' ').filter(Boolean).map(word => word[0]).slice(0, 2).join('').toUpperCase()

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h! * 60 + m!
}

// minuti dall'inizio del giorno di una fascia "10:00 – 14:00"; se finisce prima di iniziare, attraversa la mezzanotte
export const windowRange = (window: string) => {
  const [start, end] = window.split('–').map(part => part.trim())
  const startMin = toMinutes(start!)
  const endMin = toMinutes(end!)
  return [startMin, endMin <= startMin ? endMin + 24 * 60 : endMin] as const
}

export const windowsOverlap = (a: string, b: string) => {
  const [aStart, aEnd] = windowRange(a)
  const [bStart, bEnd] = windowRange(b)
  return aStart < bEnd && bStart < aEnd
}

export const windowHours = (window: string) => {
  const [start, end] = windowRange(window)
  return Math.round(((end - start) / 60) * 10) / 10
}

// un intervento può avere più operatori nella squadra, separati da virgola
export const crewNames = (crew: string) => crew.split(',').map(name => name.trim())

const dayFormat = new Intl.DateTimeFormat('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })
const longDayFormat = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })

export const formatDay = (iso: string) => dayFormat.format(new Date(`${iso}T12:00:00Z`))
export const formatLongDay = (iso: string) => longDayFormat.format(new Date(`${iso}T12:00:00Z`))
