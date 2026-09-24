export const sum = <T>(rows: T[], pick: (row: T) => number) =>
  rows.reduce((total, row) => total + pick(row), 0)

export const initials = (name: string) =>
  name.split(' ').filter(Boolean).map(word => word[0]).slice(0, 2).join('').toUpperCase()

const dayFormat = new Intl.DateTimeFormat('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })
const longDayFormat = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })

export const formatDay = (iso: string) => dayFormat.format(new Date(`${iso}T12:00:00Z`))
export const formatLongDay = (iso: string) => longDayFormat.format(new Date(`${iso}T12:00:00Z`))
