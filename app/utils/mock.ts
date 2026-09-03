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

export const staffStateColor: Record<string, Color> = {
  'In servizio': 'primary',
  'Programmato': 'info',
  'Disponibile': 'neutral',
  'Ferie': 'info',
  'Assente': 'error'
}

export const docStatusColor: Record<string, Color> = {
  'Bozza': 'neutral',
  'Da approvare': 'warning',
  'Approvato': 'success',
  'Inviata': 'info',
  'Pagata': 'success',
  'Scaduta': 'error'
}

// fascia oraria predefinita di una proprietà
export const defaultAvailability = { from: '10:00', to: '16:00' }

export const clientStatusColor: Record<string, Color> = {
  'Attivo': 'success',
  'In rinnovo': 'warning',
  'Sospeso': 'neutral'
}

export const organizations = [
  {
    id: 'perfectclean',
    name: 'PerfectClean SRL',
    initials: 'PC',
    legalName: 'PerfectClean Società a responsabilità limitata',
    vat: 'IT09876543210',
    taxCode: '09876543210',
    sdi: 'M5UXCR1',
    pec: 'perfectclean@pec.it',
    email: 'amministrazione@perfectclean.it',
    phone: '+39 02 4455 1120',
    address: 'Via Melchiorre Gioia 8',
    city: '20124 Milano (MI)',
    plan: 'Piano Business',
    role: 'Titolare'
  },
  {
    id: 'nordservizi',
    name: 'Nord Servizi Srl',
    initials: 'NS',
    legalName: 'Nord Servizi Società a responsabilità limitata',
    vat: 'IT01234567890',
    taxCode: '01234567890',
    sdi: 'KRRH6B9',
    pec: 'nordservizi@pec.it',
    email: 'amministrazione@nordservizi.it',
    phone: '+39 011 337 8890',
    address: 'Corso Francia 214',
    city: '10093 Collegno (TO)',
    plan: 'Piano Starter',
    role: 'Amministrazione'
  }
]

export const userStatusColor: Record<string, Color> = {
  Attivo: 'success',
  Invitato: 'warning',
  Disattivato: 'neutral'
}

export const userRoles = [
  { value: 'Titolare', description: 'Accesso completo, gestisce azienda e utenti.' },
  { value: 'Responsabile operativa', description: 'Planning, interventi, operatori e proprietà.' },
  { value: 'Amministrazione', description: 'Cartellini, fatture e dati azienda.' },
  { value: 'Capo squadra', description: 'Solo i propri interventi e cartellini.' }
]

export const users = [
  { orgId: 'perfectclean', name: 'Roberto Bianchi', email: 'roberto@perfectclean.it', role: 'Titolare', status: 'Attivo', lastAccess: 'Oggi, 07:12' },
  { orgId: 'perfectclean', name: 'Roberto Chiosa', email: 'giulia@perfectclean.it', role: 'Responsabile operativa', status: 'Attivo', lastAccess: 'Oggi, 06:48' },
  { orgId: 'perfectclean', name: 'Marco Bassi', email: 'marco@perfectclean.it', role: 'Amministrazione', status: 'Attivo', lastAccess: 'Ieri, 17:30' },
  { orgId: 'perfectclean', name: 'Dorin Vasile', email: 'dorin@perfectclean.it', role: 'Capo squadra', status: 'Attivo', lastAccess: 'Ieri, 13:05' },
  { orgId: 'perfectclean', name: 'Sara Lodi', email: 's.lodi@perfectclean.it', role: 'Amministrazione', status: 'Invitato', lastAccess: 'Mai' },
  { orgId: 'perfectclean', name: 'Paolo Neri', email: 'paolo@perfectclean.it', role: 'Capo squadra', status: 'Disattivato', lastAccess: '12 giu' },
  { orgId: 'nordservizi', name: 'Roberto Bianchi', email: 'roberto@nordservizi.it', role: 'Amministrazione', status: 'Attivo', lastAccess: 'Oggi, 07:15' },
  { orgId: 'nordservizi', name: 'Chiara Bosco', email: 'chiara@nordservizi.it', role: 'Titolare', status: 'Attivo', lastAccess: 'Oggi, 08:02' },
  { orgId: 'nordservizi', name: 'Luca Ferrero', email: 'luca@nordservizi.it', role: 'Responsabile operativa', status: 'Attivo', lastAccess: 'Ieri, 19:20' }
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
    id: 'via-boggio',
    name: 'Via Boggio',
    address: 'Via Boggio 61, Milano',
    lng: 9.1859,
    lat: 45.477,
    from: '10:00',
    to: '16:00',
    client: 'Xenia SRL',
    clientId: 'xenia',
    assigned: [
      { name: 'Marta Conti', role: 'Referente' },
      { name: 'Youssef Ben Ali', role: 'Squadra' }
    ]
  },
  {
    orgId: 'perfectclean',
    id: 'corso-vittorio-1',
    name: 'Corso Vittorio 1',
    address: 'Corso Vittorio Emanuele II 1, Milano',
    lng: 9.1918,
    lat: 45.4655,
    from: '10:00',
    to: '16:00',
    client: 'Xenia SRL',
    clientId: 'xenia',
    assigned: []
  },
  {
    orgId: 'nordservizi',
    id: 'polito-aule',
    name: 'Aule Politecnico',
    address: 'Corso Duca degli Abruzzi 24, Torino',
    lng: 7.66,
    lat: 45.0625,
    from: '19:00',
    to: '22:00',
    client: 'Consorzio Politecnico',
    clientId: 'politecnico-to',
    assigned: [
      { name: 'Ana Popescu', role: 'Referente' },
      { name: 'Karim Haddad', role: 'Squadra' }
    ]
  },
  {
    orgId: 'nordservizi',
    id: 'polito-laboratori',
    name: 'Laboratori Politecnico',
    address: 'Via Boggio 61, Torino',
    lng: 7.658,
    lat: 45.064,
    from: '18:00',
    to: '20:00',
    client: 'Consorzio Politecnico',
    clientId: 'politecnico-to',
    assigned: []
  },
  {
    orgId: 'nordservizi',
    id: 'alpina-poliambulatorio',
    name: 'Clinica Alpina',
    address: 'Via Cernaia 18, Torino',
    lng: 7.674,
    lat: 45.071,
    from: '06:00',
    to: '09:00',
    client: 'Clinica Alpina',
    clientId: 'alpina-clinic',
    assigned: [
      { name: 'Chiara Bosco', role: 'Referente' },
      { name: 'Ana Popescu', role: 'Sostituto' }
    ]
  },
  {
    orgId: 'nordservizi',
    id: 'lingotto-galleria',
    name: 'Galleria Lingotto',
    address: 'Via Nizza 230, Torino',
    lng: 7.664,
    lat: 45.031,
    from: '22:00',
    to: '01:00',
    client: 'Lingotto Retail',
    clientId: 'lingotto-retail',
    assigned: [
      { name: 'Luca Ferrero', role: 'Referente' },
      { name: 'Karim Haddad', role: 'Squadra' }
    ]
  }
]

export const jobs = [
  { orgId: 'perfectclean', id: 'INT-1039', window: '10:00 – 14:00', date: 'Gio 3 set', propertyId: 'via-boggio', property: 'Via Boggio', client: 'Xenia SRL', crew: 'Marta C. +1', hours: 4, status: 'In corso' },
  { orgId: 'perfectclean', id: 'INT-1040', window: '08:00 – 11:00', date: 'Gio 3 set', propertyId: 'corso-vittorio-1', property: 'Corso Vittorio 1', client: 'Xenia SRL', crew: 'Da assegnare', hours: 3, status: 'Da assegnare' },
  { orgId: 'perfectclean', id: 'INT-1038', window: '14:00 – 16:00', date: 'Gio 3 set', propertyId: 'via-boggio', property: 'Via Boggio', client: 'Xenia SRL', crew: 'Elena S.', hours: 2, status: 'Concluso' },
  { orgId: 'perfectclean', id: 'INT-1041', window: '10:00 – 14:00', date: 'Ven 4 set', propertyId: 'via-boggio', property: 'Via Boggio', client: 'Xenia SRL', crew: 'Marta C. +1', hours: 4, status: 'Programmato' },
  { orgId: 'perfectclean', id: 'INT-1042', window: '08:00 – 11:00', date: 'Ven 4 set', propertyId: 'corso-vittorio-1', property: 'Corso Vittorio 1', client: 'Xenia SRL', crew: 'Da assegnare', hours: 3, status: 'Da assegnare' },
  { orgId: 'perfectclean', id: 'INT-1036', window: '10:00 – 14:00', date: 'Mer 2 set', propertyId: 'via-boggio', property: 'Via Boggio', client: 'Xenia SRL', crew: 'Marta C. +1', hours: 4, status: 'Concluso' },
  { orgId: 'perfectclean', id: 'INT-1035', window: '08:00 – 11:00', date: 'Mar 1 set', propertyId: 'corso-vittorio-1', property: 'Corso Vittorio 1', client: 'Xenia SRL', crew: 'Ilaria M.', hours: 3, status: 'Annullato' },
  { orgId: 'nordservizi', id: 'NS-0311', window: '06:00 – 09:00', date: 'Gio 3 set', propertyId: 'alpina-poliambulatorio', property: 'Clinica Alpina', client: 'Clinica Alpina', crew: 'Chiara B. +1', hours: 5, status: 'Concluso' },
  { orgId: 'nordservizi', id: 'NS-0312', window: '18:00 – 20:00', date: 'Gio 3 set', propertyId: 'polito-laboratori', property: 'Laboratori Politecnico', client: 'Consorzio Politecnico', crew: 'Da assegnare', hours: 4, status: 'Da assegnare' },
  { orgId: 'nordservizi', id: 'NS-0313', window: '19:00 – 22:00', date: 'Gio 3 set', propertyId: 'polito-aule', property: 'Aule Politecnico', client: 'Consorzio Politecnico', crew: 'Ana P. +1', hours: 6, status: 'Programmato' },
  { orgId: 'nordservizi', id: 'NS-0314', window: '22:00 – 01:00', date: 'Gio 3 set', propertyId: 'lingotto-galleria', property: 'Galleria Lingotto', client: 'Lingotto Retail', crew: 'Luca F. +1', hours: 6, status: 'Programmato' },
  { orgId: 'nordservizi', id: 'NS-0315', window: '06:00 – 09:00', date: 'Ven 4 set', propertyId: 'alpina-poliambulatorio', property: 'Clinica Alpina', client: 'Clinica Alpina', crew: 'Chiara B. +1', hours: 5, status: 'Programmato' },
  { orgId: 'nordservizi', id: 'NS-0316', window: '19:00 – 22:00', date: 'Ven 4 set', propertyId: 'polito-aule', property: 'Aule Politecnico', client: 'Consorzio Politecnico', crew: 'Da assegnare', hours: 6, status: 'Da assegnare' },
  { orgId: 'nordservizi', id: 'NS-0308', window: '22:00 – 01:00', date: 'Mer 2 set', propertyId: 'lingotto-galleria', property: 'Galleria Lingotto', client: 'Lingotto Retail', crew: 'Luca F. +1', hours: 6, status: 'Concluso' }
]

export const staff = [
  { orgId: 'perfectclean', name: 'Marta Conti', role: 'Capo squadra', zone: 'Milano centro', phone: '+39 340 118 4402', contract: 'Full time', certs: 'HACCP, altezze', hours: 38, state: 'In servizio', detail: 'Via Boggio · dalle 09:58' },
  { orgId: 'perfectclean', name: 'Anna Pellegrini', role: 'Operatrice', zone: 'Milano sud', phone: '+39 347 902 1188', contract: 'Full time', certs: 'Protocollo sanitario', hours: 36, state: 'In servizio', detail: 'Nessun intervento oggi' },
  { orgId: 'perfectclean', name: 'Dorin Vasile', role: 'Capo squadra', zone: 'Milano est', phone: '+39 351 447 6620', contract: 'Full time', certs: 'Macchinari, altezze', hours: 40, state: 'Programmato', detail: 'Via Boggio · inizia alle 14:00' },
  { orgId: 'perfectclean', name: 'Elena Serra', role: 'Operatrice', zone: 'Milano centro', phone: '+39 333 210 7745', contract: 'Part time 24h', certs: 'HACCP', hours: 22, state: 'Disponibile', detail: 'Turno concluso alle 16:00' },
  { orgId: 'perfectclean', name: 'Youssef Ben Ali', role: 'Operatore', zone: 'Milano ovest', phone: '+39 320 556 3390', contract: 'Full time', certs: 'Vetrate', hours: 39, state: 'Disponibile', detail: 'Nessun intervento oggi' },
  { orgId: 'perfectclean', name: 'Ilaria Moretti', role: 'Operatrice', zone: 'Sesto San Giovanni', phone: '+39 348 771 2201', contract: 'Part time 30h', certs: 'HACCP', hours: 28, state: 'Ferie', detail: 'Rientro lunedì 8 settembre' },
  { orgId: 'perfectclean', name: 'Tommaso Rossi', role: 'Operatore', zone: 'Milano centro', phone: '+39 346 664 8812', contract: 'Full time', certs: 'Protocollo sanitario', hours: 31, state: 'Assente', detail: 'Corso Vittorio 1 · turno 08:00 non coperto' },
  { orgId: 'nordservizi', name: 'Chiara Bosco', role: 'Capo squadra', zone: 'Torino centro', phone: '+39 342 550 9911', contract: 'Full time', certs: 'Protocollo sanitario, HACCP', hours: 38, state: 'In servizio', detail: 'Clinica Alpina · dalle 06:03' },
  { orgId: 'nordservizi', name: 'Ana Popescu', role: 'Operatrice', zone: 'Torino centro', phone: '+39 349 118 2277', contract: 'Full time', certs: 'HACCP', hours: 37, state: 'Programmato', detail: 'Aule Politecnico · inizia alle 19:00' },
  { orgId: 'nordservizi', name: 'Karim Haddad', role: 'Operatore', zone: 'Torino nord', phone: '+39 327 990 4416', contract: 'Part time 30h', certs: 'Macchinari', hours: 29, state: 'Disponibile', detail: 'Nessun intervento fino alle 22:00' },
  { orgId: 'nordservizi', name: 'Luca Ferrero', role: 'Capo squadra', zone: 'Torino sud', phone: '+39 335 224 6708', contract: 'Full time', certs: 'Altezze, vetrate', hours: 40, state: 'Programmato', detail: 'Galleria Lingotto · inizia alle 22:00' },
  { orgId: 'nordservizi', name: 'Sofia Marino', role: 'Operatrice', zone: 'Torino sud', phone: '+39 331 806 5540', contract: 'Part time 24h', certs: 'HACCP', hours: 21, state: 'Ferie', detail: 'Rientro martedì 9 settembre' }
]

export const timesheets = [
  { orgId: 'perfectclean', staff: 'Marta Conti', week: '25 – 31 ago', ordinary: 38, overtime: 2, jobs: 11, status: 'Da approvare' },
  { orgId: 'perfectclean', staff: 'Anna Pellegrini', week: '25 – 31 ago', ordinary: 36, overtime: 0, jobs: 12, status: 'Da approvare' },
  { orgId: 'perfectclean', staff: 'Dorin Vasile', week: '25 – 31 ago', ordinary: 40, overtime: 6, jobs: 9, status: 'Da approvare' },
  { orgId: 'perfectclean', staff: 'Elena Serra', week: '25 – 31 ago', ordinary: 22, overtime: 0, jobs: 7, status: 'Approvato' },
  { orgId: 'perfectclean', staff: 'Youssef Ben Ali', week: '25 – 31 ago', ordinary: 39, overtime: 3, jobs: 10, status: 'Approvato' },
  { orgId: 'perfectclean', staff: 'Ilaria Moretti', week: '25 – 31 ago', ordinary: 28, overtime: 0, jobs: 8, status: 'Approvato' },
  { orgId: 'perfectclean', staff: 'Tommaso Rossi', week: '25 – 31 ago', ordinary: 31, overtime: 0, jobs: 9, status: 'Bozza' },
  { orgId: 'nordservizi', staff: 'Chiara Bosco', week: '25 – 31 ago', ordinary: 38, overtime: 4, jobs: 10, status: 'Da approvare' },
  { orgId: 'nordservizi', staff: 'Ana Popescu', week: '25 – 31 ago', ordinary: 37, overtime: 0, jobs: 9, status: 'Approvato' },
  { orgId: 'nordservizi', staff: 'Karim Haddad', week: '25 – 31 ago', ordinary: 29, overtime: 2, jobs: 7, status: 'Da approvare' },
  { orgId: 'nordservizi', staff: 'Luca Ferrero', week: '25 – 31 ago', ordinary: 40, overtime: 5, jobs: 11, status: 'Approvato' },
  { orgId: 'nordservizi', staff: 'Sofia Marino', week: '25 – 31 ago', ordinary: 21, overtime: 0, jobs: 5, status: 'Bozza' }
]

export const invoices = [
  { orgId: 'perfectclean', number: '2026/0184', client: 'Xenia SRL', period: 'Agosto 2026', hours: 72, amount: '€ 4.320,00', total: 4320, due: '30 set', status: 'Inviata' },
  { orgId: 'perfectclean', number: '2026/0185', client: 'Xenia SRL', period: 'Agosto 2026', hours: 60, amount: '€ 3.900,00', total: 3900, due: '30 set', status: 'Inviata' },
  { orgId: 'perfectclean', number: '2026/0186', client: 'Xenia SRL', period: 'Agosto 2026', hours: 180, amount: '€ 10.800,00', total: 10800, due: '15 set', status: 'Bozza' },
  { orgId: 'perfectclean', number: '2026/0187', client: 'Xenia SRL', period: 'Agosto 2026', hours: 24, amount: '€ 1.680,00', total: 1680, due: '15 set', status: 'Bozza' },
  { orgId: 'perfectclean', number: '2026/0179', client: 'Xenia SRL', period: 'Luglio 2026', hours: 140, amount: '€ 8.100,00', total: 8100, due: '31 ago', status: 'Scaduta' },
  { orgId: 'perfectclean', number: '2026/0178', client: 'Xenia SRL', period: 'Luglio 2026', hours: 70, amount: '€ 4.200,00', total: 4200, due: '31 ago', status: 'Pagata' },
  { orgId: 'perfectclean', number: '2026/0177', client: 'Xenia SRL', period: 'Luglio 2026', hours: 210, amount: '€ 12.600,00', total: 12600, due: '31 ago', status: 'Pagata' },
  { orgId: 'nordservizi', number: 'NS/2026/0042', client: 'Consorzio Politecnico', period: 'Agosto 2026', hours: 96, amount: '€ 5.760,00', total: 5760, due: '30 set', status: 'Inviata' },
  { orgId: 'nordservizi', number: 'NS/2026/0043', client: 'Clinica Alpina', period: 'Agosto 2026', hours: 88, amount: '€ 5.280,00', total: 5280, due: '30 set', status: 'Bozza' },
  { orgId: 'nordservizi', number: 'NS/2026/0038', client: 'Lingotto Retail', period: 'Luglio 2026', hours: 64, amount: '€ 3.840,00', total: 3840, due: '31 ago', status: 'Pagata' },
  { orgId: 'nordservizi', number: 'NS/2026/0037', client: 'Consorzio Politecnico', period: 'Luglio 2026', hours: 92, amount: '€ 5.520,00', total: 5520, due: '31 ago', status: 'Scaduta' }
]

export const weekPlan = [
  { orgId: 'perfectclean', day: 'Lun 31', shifts: [{ time: '10:00', property: 'Via Boggio', crew: 'Marta C. +1' }] },
  { orgId: 'perfectclean', day: 'Mar 1', shifts: [{ time: '10:00', property: 'Via Boggio', crew: 'Marta C. +1' }, { time: '08:00', property: 'Corso Vittorio 1', crew: 'Da assegnare' }] },
  { orgId: 'perfectclean', day: 'Mer 2', shifts: [{ time: '10:00', property: 'Via Boggio', crew: 'Marta C. +1' }] },
  { orgId: 'perfectclean', day: 'Gio 3', shifts: [{ time: '08:00', property: 'Corso Vittorio 1', crew: 'Da assegnare' }, { time: '10:00', property: 'Via Boggio', crew: 'Marta C. +1' }, { time: '14:00', property: 'Via Boggio', crew: 'Elena S.' }] },
  { orgId: 'perfectclean', day: 'Ven 4', shifts: [{ time: '08:00', property: 'Corso Vittorio 1', crew: 'Da assegnare' }, { time: '10:00', property: 'Via Boggio', crew: 'Marta C. +1' }] },
  { orgId: 'perfectclean', day: 'Sab 5', shifts: [{ time: '10:00', property: 'Via Boggio', crew: 'Elena S.' }] },
  { orgId: 'perfectclean', day: 'Dom 6', shifts: [] },
  { orgId: 'nordservizi', day: 'Lun 31', shifts: [{ time: '06:00', property: 'Clinica Alpina', crew: 'Chiara B. +1' }, { time: '19:00', property: 'Aule Politecnico', crew: 'Ana P. +1' }] },
  { orgId: 'nordservizi', day: 'Mar 1', shifts: [{ time: '06:00', property: 'Clinica Alpina', crew: 'Chiara B. +1' }, { time: '18:00', property: 'Laboratori Politecnico', crew: 'Da assegnare' }] },
  { orgId: 'nordservizi', day: 'Mer 2', shifts: [{ time: '06:00', property: 'Clinica Alpina', crew: 'Chiara B. +1' }, { time: '22:00', property: 'Galleria Lingotto', crew: 'Luca F. +1' }] },
  { orgId: 'nordservizi', day: 'Gio 3', shifts: [{ time: '06:00', property: 'Clinica Alpina', crew: 'Chiara B. +1' }, { time: '18:00', property: 'Laboratori Politecnico', crew: 'Da assegnare' }, { time: '19:00', property: 'Aule Politecnico', crew: 'Ana P. +1' }] },
  { orgId: 'nordservizi', day: 'Ven 4', shifts: [{ time: '06:00', property: 'Clinica Alpina', crew: 'Chiara B. +1' }, { time: '19:00', property: 'Aule Politecnico', crew: 'Da assegnare' }] },
  { orgId: 'nordservizi', day: 'Sab 5', shifts: [{ time: '06:00', property: 'Clinica Alpina', crew: 'Chiara B. +1' }, { time: '22:00', property: 'Galleria Lingotto', crew: 'Luca F. +1' }] },
  { orgId: 'nordservizi', day: 'Dom 6', shifts: [{ time: '22:00', property: 'Galleria Lingotto', crew: 'Luca F. +1' }] }
]
