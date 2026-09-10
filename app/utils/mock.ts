// il "oggi" del mock
export const today = '2026-09-03'

// ponytail: mock data only — swap for API calls when there's a backend
// lng/lat sono approssimati sull'indirizzo: geocodifica alla creazione quando ci sarà il backend
type Color = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

export const jobStatusColor: Record<string, Color> = {
  'In corso': 'primary',
  'Programmato': 'info',
  'Da assegnare': 'warning',
  'Concluso': 'neutral',
  'Annullato': 'error'
}

export const clientStatusColor: Record<string, Color> = {
  'Attivo': 'success',
  'In rinnovo': 'warning',
  'Sospeso': 'neutral'
}

export const bookingStatusColor: Record<string, Color> = {
  'In arrivo': 'info',
  'In corso': 'primary',
  'Da liberare': 'warning',
  'Intervento creato': 'success'
}

// stato calcolato, non salvato: dipende solo da oggi e da se esiste già l'intervento di pulizia
export function bookingStatus(booking: { checkin: string, checkout: string, jobId?: string }) {
  if (booking.jobId) return 'Intervento creato'
  if (today < booking.checkin) return 'In arrivo'
  if (today < booking.checkout) return 'In corso'
  return 'Da liberare'
}

export const organizations = [
  { id: 'perfectclean', name: 'PerfectClean SRL' },
  { id: 'nordservizi', name: 'Nord Servizi Srl' }
]

// operatore: solo il necessario per assegnarlo a una proprietà e chiamarlo
export interface User {
  orgId: string
  name: string
  phone: string
}

export const users: User[] = [
  { orgId: 'perfectclean', name: 'Dorin Vasile', phone: '+39 351 447 6620' },
  { orgId: 'perfectclean', name: 'Marta Conti', phone: '+39 340 118 4402' },
  { orgId: 'perfectclean', name: 'Anna Pellegrini', phone: '+39 347 902 1188' },
  { orgId: 'perfectclean', name: 'Elena Serra', phone: '+39 333 210 7745' },
  { orgId: 'perfectclean', name: 'Youssef Ben Ali', phone: '+39 320 556 3390' },
  { orgId: 'perfectclean', name: 'Ilaria Moretti', phone: '+39 348 771 2201' },
  { orgId: 'perfectclean', name: 'Tommaso Rossi', phone: '+39 346 664 8812' },
  { orgId: 'nordservizi', name: 'Chiara Bosco', phone: '+39 342 550 9911' },
  { orgId: 'nordservizi', name: 'Luca Ferrero', phone: '+39 335 224 6708' },
  { orgId: 'nordservizi', name: 'Ana Popescu', phone: '+39 349 118 2277' },
  { orgId: 'nordservizi', name: 'Karim Haddad', phone: '+39 327 990 4416' },
  { orgId: 'nordservizi', name: 'Sofia Marino', phone: '+39 331 806 5540' }
]

export const clients = [
  { orgId: 'perfectclean', id: 'xenia', name: 'Xenia SRL', reference: 'Roberto Chiosa', email: 'roberto@xeniapm.it', status: 'Attivo' },
  { orgId: 'nordservizi', id: 'politecnico-to', name: 'Consorzio Politecnico', reference: 'Ing. Ferrero', email: 'servizi@consorziopolito.it', status: 'Attivo' },
  { orgId: 'nordservizi', id: 'alpina-clinic', name: 'Clinica Alpina', reference: 'Dott.ssa Bosco', email: 'direzione@clinicaalpina.it', status: 'Attivo' },
  { orgId: 'nordservizi', id: 'lingotto-retail', name: 'Lingotto Retail', reference: 'Davide Rossi', email: 'facility@lingottoretail.it', status: 'In rinnovo' }
]

export const properties = [
  {
    orgId: 'perfectclean',
    id: 'via-boggio-1',
    name: 'Via Boggio 1',
    address: 'Via Boggio 56, Torino',
    client: 'Xenia SRL',
    clientId: 'xenia'
  },
  {
    orgId: 'perfectclean',
    id: 'via-boggio-2',
    name: 'Via Boggio 2',
    address: 'Via Boggio 56, Torino',
    client: 'Xenia SRL',
    clientId: 'xenia'
  },
  {
    orgId: 'perfectclean',
    id: 'corso-vittorio-1',
    name: 'Corso Vittorio 1',
    address: 'Corso Vittorio Emanuele II 1, Milano',
    client: 'Xenia SRL',
    clientId: 'xenia'
  },
  {
    orgId: 'perfectclean',
    id: 'corso-vittorio-2',
    name: 'Corso Vittorio 2',
    address: 'Corso Vittorio Emanuele II 1, Milano',
    client: 'Xenia SRL',
    clientId: 'xenia'
  },
  {
    orgId: 'nordservizi',
    id: 'polito-aule',
    name: 'Aule Politecnico',
    address: 'Corso Duca degli Abruzzi 24, Torino',
    client: 'Consorzio Politecnico',
    clientId: 'politecnico-to'
  },
  {
    orgId: 'nordservizi',
    id: 'polito-laboratori',
    name: 'Laboratori Politecnico',
    address: 'Via Boggio 61, Torino',
    client: 'Consorzio Politecnico',
    clientId: 'politecnico-to'
  },
  {
    orgId: 'nordservizi',
    id: 'alpina-poliambulatorio',
    name: 'Clinica Alpina',
    address: 'Via Cernaia 18, Torino',
    client: 'Clinica Alpina',
    clientId: 'alpina-clinic'
  },
  {
    orgId: 'nordservizi',
    id: 'lingotto-galleria',
    name: 'Galleria Lingotto',
    address: 'Via Nizza 230, Torino',
    client: 'Lingotto Retail',
    clientId: 'lingotto-retail'
  }
]

// prenotazione dell'ospite su una proprietà: il checkout è ciò che genera l'intervento di pulizia
export interface Booking {
  orgId: string
  id: string
  propertyId: string
  property: string
  checkin: string
  checkout: string
  jobId?: string
}

export const bookings: Booking[] = [
  { orgId: 'perfectclean', id: 'BKG-3001', propertyId: 'via-boggio-1', property: 'Via Boggio 1', checkin: '2026-08-30', checkout: '2026-09-02', jobId: 'INT-1036' },
  { orgId: 'perfectclean', id: 'BKG-3002', propertyId: 'via-boggio-1', property: 'Via Boggio 1', checkin: '2026-09-02', checkout: '2026-09-03', jobId: 'INT-1038' },
  { orgId: 'perfectclean', id: 'BKG-3003', propertyId: 'via-boggio-2', property: 'Via Boggio 2', checkin: '2026-09-02', checkout: '2026-09-03', jobId: 'INT-1039' },
  { orgId: 'perfectclean', id: 'BKG-3004', propertyId: 'via-boggio-1', property: 'Via Boggio 1', checkin: '2026-09-03', checkout: '2026-09-04', jobId: 'INT-1041' },
  { orgId: 'perfectclean', id: 'BKG-3005', propertyId: 'via-boggio-1', property: 'Via Boggio 1', checkin: '2026-09-04', checkout: '2026-09-06' },
  { orgId: 'perfectclean', id: 'BKG-3010', propertyId: 'via-boggio-2', property: 'Via Boggio 2', checkin: '2026-09-03', checkout: '2026-09-07' },
  { orgId: 'perfectclean', id: 'BKG-3006', propertyId: 'corso-vittorio-1', property: 'Corso Vittorio 1', checkin: '2026-08-29', checkout: '2026-09-01', jobId: 'INT-1035' },
  { orgId: 'perfectclean', id: 'BKG-3007', propertyId: 'corso-vittorio-1', property: 'Corso Vittorio 1', checkin: '2026-09-01', checkout: '2026-09-03', jobId: 'INT-1040' },
  { orgId: 'perfectclean', id: 'BKG-3008', propertyId: 'corso-vittorio-1', property: 'Corso Vittorio 1', checkin: '2026-09-03', checkout: '2026-09-04', jobId: 'INT-1042' },
  { orgId: 'perfectclean', id: 'BKG-3009', propertyId: 'corso-vittorio-1', property: 'Corso Vittorio 1', checkin: '2026-09-04', checkout: '2026-09-05' },
  { orgId: 'nordservizi', id: 'BKG-4001', propertyId: 'alpina-poliambulatorio', property: 'Clinica Alpina', checkin: '2026-08-31', checkout: '2026-09-03', jobId: 'NS-0311' },
  { orgId: 'nordservizi', id: 'BKG-4002', propertyId: 'alpina-poliambulatorio', property: 'Clinica Alpina', checkin: '2026-09-03', checkout: '2026-09-04', jobId: 'NS-0315' },
  { orgId: 'nordservizi', id: 'BKG-4003', propertyId: 'alpina-poliambulatorio', property: 'Clinica Alpina', checkin: '2026-09-04', checkout: '2026-09-05' },
  { orgId: 'nordservizi', id: 'BKG-4004', propertyId: 'polito-laboratori', property: 'Laboratori Politecnico', checkin: '2026-08-30', checkout: '2026-09-03', jobId: 'NS-0312' },
  { orgId: 'nordservizi', id: 'BKG-4005', propertyId: 'polito-aule', property: 'Aule Politecnico', checkin: '2026-08-31', checkout: '2026-09-03', jobId: 'NS-0313' },
  { orgId: 'nordservizi', id: 'BKG-4006', propertyId: 'polito-aule', property: 'Aule Politecnico', checkin: '2026-09-03', checkout: '2026-09-04', jobId: 'NS-0316' },
  { orgId: 'nordservizi', id: 'BKG-4007', propertyId: 'lingotto-galleria', property: 'Galleria Lingotto', checkin: '2026-08-30', checkout: '2026-09-02', jobId: 'NS-0308' },
  { orgId: 'nordservizi', id: 'BKG-4008', propertyId: 'lingotto-galleria', property: 'Galleria Lingotto', checkin: '2026-09-02', checkout: '2026-09-03', jobId: 'NS-0314' },
  { orgId: 'nordservizi', id: 'BKG-4009', propertyId: 'lingotto-galleria', property: 'Galleria Lingotto', checkin: '2026-09-03', checkout: '2026-09-05' }
]

// interventi: creati al checkout di una prenotazione, poi assegnati a un operatore
// la squadra (crew) sono i nomi degli operatori assegnati a quello specifico intervento, separati da virgola
export const jobs = [
  { orgId: 'perfectclean', id: 'INT-1039', bookingId: 'BKG-3003', window: '10:00 – 14:00', date: '2026-09-03', propertyId: 'via-boggio-2', property: 'Via Boggio 2', client: 'Xenia SRL', crew: 'Marta Conti, Youssef Ben Ali', hours: 4, status: 'In corso' },
  { orgId: 'perfectclean', id: 'INT-1040', bookingId: 'BKG-3007', window: '08:00 – 11:00', date: '2026-09-03', propertyId: 'corso-vittorio-1', property: 'Corso Vittorio 1', client: 'Xenia SRL', crew: 'Da assegnare', hours: 3, status: 'Da assegnare' },
  { orgId: 'perfectclean', id: 'INT-1038', bookingId: 'BKG-3002', window: '14:00 – 16:00', date: '2026-09-03', propertyId: 'via-boggio-1', property: 'Via Boggio 1', client: 'Xenia SRL', crew: 'Elena Serra', hours: 2, status: 'Concluso' },
  { orgId: 'perfectclean', id: 'INT-1041', bookingId: 'BKG-3004', window: '10:00 – 14:00', date: '2026-09-04', propertyId: 'via-boggio-1', property: 'Via Boggio 1', client: 'Xenia SRL', crew: 'Marta Conti, Youssef Ben Ali', hours: 4, status: 'Programmato' },
  { orgId: 'perfectclean', id: 'INT-1042', bookingId: 'BKG-3008', window: '08:00 – 11:00', date: '2026-09-04', propertyId: 'corso-vittorio-1', property: 'Corso Vittorio 1', client: 'Xenia SRL', crew: 'Da assegnare', hours: 3, status: 'Da assegnare' },
  { orgId: 'perfectclean', id: 'INT-1036', bookingId: 'BKG-3001', window: '10:00 – 14:00', date: '2026-09-02', propertyId: 'via-boggio-1', property: 'Via Boggio 1', client: 'Xenia SRL', crew: 'Marta Conti, Youssef Ben Ali', hours: 4, status: 'Concluso' },
  { orgId: 'perfectclean', id: 'INT-1035', bookingId: 'BKG-3006', window: '08:00 – 11:00', date: '2026-09-01', propertyId: 'corso-vittorio-1', property: 'Corso Vittorio 1', client: 'Xenia SRL', crew: 'Ilaria Moretti', hours: 3, status: 'Annullato' },
  { orgId: 'nordservizi', id: 'NS-0311', bookingId: 'BKG-4001', window: '06:00 – 09:00', date: '2026-09-03', propertyId: 'alpina-poliambulatorio', property: 'Clinica Alpina', client: 'Clinica Alpina', crew: 'Chiara Bosco, Ana Popescu', hours: 5, status: 'Concluso' },
  { orgId: 'nordservizi', id: 'NS-0312', bookingId: 'BKG-4004', window: '18:00 – 20:00', date: '2026-09-03', propertyId: 'polito-laboratori', property: 'Laboratori Politecnico', client: 'Consorzio Politecnico', crew: 'Da assegnare', hours: 4, status: 'Da assegnare' },
  { orgId: 'nordservizi', id: 'NS-0313', bookingId: 'BKG-4005', window: '19:00 – 22:00', date: '2026-09-03', propertyId: 'polito-aule', property: 'Aule Politecnico', client: 'Consorzio Politecnico', crew: 'Ana Popescu, Karim Haddad', hours: 6, status: 'Programmato' },
  { orgId: 'nordservizi', id: 'NS-0314', bookingId: 'BKG-4008', window: '22:00 – 01:00', date: '2026-09-03', propertyId: 'lingotto-galleria', property: 'Galleria Lingotto', client: 'Lingotto Retail', crew: 'Luca Ferrero, Karim Haddad', hours: 6, status: 'Programmato' },
  { orgId: 'nordservizi', id: 'NS-0315', bookingId: 'BKG-4002', window: '06:00 – 09:00', date: '2026-09-04', propertyId: 'alpina-poliambulatorio', property: 'Clinica Alpina', client: 'Clinica Alpina', crew: 'Chiara Bosco, Ana Popescu', hours: 5, status: 'Programmato' },
  { orgId: 'nordservizi', id: 'NS-0316', bookingId: 'BKG-4006', window: '19:00 – 22:00', date: '2026-09-04', propertyId: 'polito-aule', property: 'Aule Politecnico', client: 'Consorzio Politecnico', crew: 'Da assegnare', hours: 6, status: 'Da assegnare' },
  { orgId: 'nordservizi', id: 'NS-0308', bookingId: 'BKG-4007', window: '22:00 – 01:00', date: '2026-09-02', propertyId: 'lingotto-galleria', property: 'Galleria Lingotto', client: 'Lingotto Retail', crew: 'Luca Ferrero, Karim Haddad', hours: 6, status: 'Concluso' }
]
