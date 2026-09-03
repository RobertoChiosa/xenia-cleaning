// ponytail: mock data only — swap for API calls when there's a backend
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

export const clientStatusColor: Record<string, Color> = {
  'Attivo': 'success',
  'In rinnovo': 'warning',
  'Sospeso': 'neutral'
}

export const clients = [
  { id: 'portanuova', name: 'Portanuova Srl', properties: 3, contract: 'Contratto annuale', reference: 'Giulia Fanti', email: 'g.fanti@portanuova.it', hoursMonth: 72, billing: '€ 4.320 / mese', status: 'Attivo' },
  { id: 'navigli-salute', name: 'Navigli Salute', properties: 2, contract: 'Contratto annuale', reference: 'Dott. Rinaldi', email: 'direzione@naviglisalute.it', hoursMonth: 60, billing: '€ 3.900 / mese', status: 'Attivo' },
  { id: 'le-corti', name: 'Gruppo Le Corti', properties: 5, contract: 'Contratto triennale', reference: 'Marco Bassi', email: 'm.bassi@lecorti.it', hoursMonth: 180, billing: '€ 10.800 / mese', status: 'Attivo' },
  { id: 'darsena', name: 'Darsena Hospitality', properties: 1, contract: 'Contratto annuale', reference: 'Chiara Lupo', email: 'housekeeping@hoteldarsena.it', hoursMonth: 210, billing: '€ 12.600 / mese', status: 'Attivo' },
  { id: 'meucci', name: 'Meucci Logistica', properties: 1, contract: 'A chiamata', reference: 'Sara Lodi', email: 's.lodi@meuccilog.it', hoursMonth: 24, billing: 'A consumo', status: 'Attivo' },
  { id: 'sesto', name: 'Comune di Sesto', properties: 4, contract: 'Gara pubblica', reference: 'Ufficio tecnico', email: 'appalti@comune.sesto.it', hoursMonth: 140, billing: '€ 8.100 / mese', status: 'In rinnovo' },
  { id: 'verdi', name: 'Verdi & Associati', properties: 1, contract: 'Contratto annuale', reference: 'Avv. Verdi', email: 'studio@verdiassociati.it', hoursMonth: 8, billing: '€ 560 / mese', status: 'Sospeso' }
]

export const properties = [
  {
    id: 'portanuova-uffici',
    name: 'Uffici Portanuova',
    client: 'Portanuova Srl',
    clientId: 'portanuova',
    type: 'Uffici',
    address: 'Via Melchiorre Gioia 8, Milano',
    zone: 'Milano centro',
    sqm: '1.400 m²',
    plan: 'Lun–Ven · 07:00–09:00',
    hoursPerVisit: 4,
    access: 'Badge in portineria, allarme codice 4412',
    assigned: [
      { name: 'Marta Conti', role: 'Referente' },
      { name: 'Youssef Ben Ali', role: 'Squadra' },
      { name: 'Elena Serra', role: 'Sostituto' }
    ]
  },
  {
    id: 'navigli-poliambulatorio',
    name: 'Poliambulatorio Navigli',
    client: 'Navigli Salute',
    clientId: 'navigli-salute',
    type: 'Sanitario',
    address: 'Via Ascanio Sforza 42, Milano',
    zone: 'Milano sud',
    sqm: '620 m²',
    plan: 'Lun–Sab · 08:00–11:00',
    hoursPerVisit: 3,
    access: 'Chiavi in cassaforte, protocollo sanitario obbligatorio',
    assigned: [
      { name: 'Anna Pellegrini', role: 'Referente' },
      { name: 'Tommaso Rossi', role: 'Sostituto' }
    ]
  },
  {
    id: 'le-corti-centro',
    name: 'Centro Le Corti',
    client: 'Gruppo Le Corti',
    clientId: 'le-corti',
    type: 'Retail',
    address: 'Viale Certosa 120, Milano',
    zone: 'Milano est',
    sqm: '5.200 m²',
    plan: 'Tutti i giorni · 13:00–16:00',
    hoursPerVisit: 9,
    access: 'Ingresso merci lato nord, referente di sede sempre presente',
    assigned: [
      { name: 'Dorin Vasile', role: 'Referente' },
      { name: 'Ilaria Moretti', role: 'Squadra' },
      { name: 'Youssef Ben Ali', role: 'Squadra' }
    ]
  },
  {
    id: 'darsena-hotel',
    name: 'Hotel Darsena',
    client: 'Darsena Hospitality',
    clientId: 'darsena',
    type: 'Hotel',
    address: 'Viale Gorizia 30, Milano',
    zone: 'Milano centro',
    sqm: '3.000 m²',
    plan: 'Tutti i giorni · 06:00–08:00',
    hoursPerVisit: 8,
    access: 'Ingresso staff via Gorizia 28, divisa obbligatoria',
    assigned: [
      { name: 'Elena Serra', role: 'Referente' },
      { name: 'Tommaso Rossi', role: 'Squadra' }
    ]
  },
  {
    id: 'manzoni-istituto',
    name: 'Istituto Manzoni',
    client: 'Comune di Sesto',
    clientId: 'sesto',
    type: 'Scuola',
    address: 'Via Manzoni 15, Sesto San Giovanni',
    zone: 'Sesto San Giovanni',
    sqm: '2.100 m²',
    plan: 'Lun–Ven · 18:00–21:00',
    hoursPerVisit: 6,
    access: 'Chiavi custode, accesso solo dopo le 17:30',
    assigned: []
  },
  {
    id: 'meucci-capannone',
    name: 'Capannone 3, via Meucci',
    client: 'Meucci Logistica',
    clientId: 'meucci',
    type: 'Industriale',
    address: 'Via Meucci 21, Cinisello Balsamo',
    zone: 'Milano nord',
    sqm: '2.800 m²',
    plan: 'A chiamata · fascia 09:00–12:00',
    hoursPerVisit: 3,
    access: 'Scarpe antinfortunistiche, referente di magazzino',
    assigned: []
  },
  {
    id: 'tortona-showroom',
    name: 'Showroom Tortona',
    client: 'Gruppo Le Corti',
    clientId: 'le-corti',
    type: 'Retail',
    address: 'Via Tortona 37, Milano',
    zone: 'Milano ovest',
    sqm: '450 m²',
    plan: 'Mar e Ven · 14:00–18:00',
    hoursPerVisit: 4,
    access: 'Codice serranda 8890',
    assigned: [
      { name: 'Youssef Ben Ali', role: 'Referente' }
    ]
  },
  {
    id: 'verdi-studio',
    name: 'Studio legale Verdi',
    client: 'Verdi & Associati',
    clientId: 'verdi',
    type: 'Uffici',
    address: 'Corso Venezia 5, Milano',
    zone: 'Milano centro',
    sqm: '180 m²',
    plan: 'Mer · 15:00–17:00',
    hoursPerVisit: 2,
    access: 'Chiavi consegnate al referente',
    assigned: [
      { name: 'Anna Pellegrini', role: 'Referente' }
    ]
  }
]

export const jobs = [
  { id: 'INT-1042', window: '07:00 – 09:00', date: 'Gio 3 set', propertyId: 'portanuova-uffici', property: 'Uffici Portanuova', client: 'Portanuova Srl', crew: 'Marta C. +1', hours: 4, status: 'In corso' },
  { id: 'INT-1043', window: '08:00 – 11:00', date: 'Gio 3 set', propertyId: 'navigli-poliambulatorio', property: 'Poliambulatorio Navigli', client: 'Navigli Salute', crew: 'Anna P.', hours: 3, status: 'In corso' },
  { id: 'INT-1044', window: '09:00 – 12:00', date: 'Gio 3 set', propertyId: 'meucci-capannone', property: 'Capannone 3, via Meucci', client: 'Meucci Logistica', crew: 'Da assegnare', hours: 3, status: 'Da assegnare' },
  { id: 'INT-1045', window: '13:00 – 16:00', date: 'Gio 3 set', propertyId: 'le-corti-centro', property: 'Centro Le Corti', client: 'Gruppo Le Corti', crew: 'Dorin V. +2', hours: 9, status: 'Programmato' },
  { id: 'INT-1046', window: '18:00 – 21:00', date: 'Gio 3 set', propertyId: 'manzoni-istituto', property: 'Istituto Manzoni', client: 'Comune di Sesto', crew: 'Da assegnare', hours: 6, status: 'Da assegnare' },
  { id: 'INT-1041', window: '06:00 – 08:00', date: 'Gio 3 set', propertyId: 'darsena-hotel', property: 'Hotel Darsena', client: 'Darsena Hospitality', crew: 'Elena S. +1', hours: 8, status: 'Concluso' },
  { id: 'INT-1047', window: '07:00 – 09:00', date: 'Ven 4 set', propertyId: 'portanuova-uffici', property: 'Uffici Portanuova', client: 'Portanuova Srl', crew: 'Marta C. +1', hours: 4, status: 'Programmato' },
  { id: 'INT-1048', window: '14:00 – 18:00', date: 'Ven 4 set', propertyId: 'tortona-showroom', property: 'Showroom Tortona', client: 'Gruppo Le Corti', crew: 'Youssef B.', hours: 4, status: 'Programmato' },
  { id: 'INT-1049', window: '20:00 – 23:00', date: 'Ven 4 set', propertyId: 'le-corti-centro', property: 'Centro Le Corti', client: 'Gruppo Le Corti', crew: 'Da assegnare', hours: 3, status: 'Da assegnare' },
  { id: 'INT-1039', window: '15:00 – 17:00', date: 'Mer 2 set', propertyId: 'verdi-studio', property: 'Studio legale Verdi', client: 'Verdi & Associati', crew: 'Anna P.', hours: 2, status: 'Concluso' },
  { id: 'INT-1038', window: '18:00 – 21:00', date: 'Mar 1 set', propertyId: 'manzoni-istituto', property: 'Istituto Manzoni', client: 'Comune di Sesto', crew: 'Ilaria M. +1', hours: 6, status: 'Annullato' }
]

export const staff = [
  { name: 'Marta Conti', role: 'Capo squadra', zone: 'Milano centro', phone: '+39 340 118 4402', contract: 'Full time', certs: 'HACCP, altezze', hours: 38, state: 'In servizio', detail: 'Uffici Portanuova · dalle 06:58' },
  { name: 'Anna Pellegrini', role: 'Operatrice', zone: 'Milano sud', phone: '+39 347 902 1188', contract: 'Full time', certs: 'Protocollo sanitario', hours: 36, state: 'In servizio', detail: 'Poliambulatorio Navigli · dalle 08:02' },
  { name: 'Dorin Vasile', role: 'Capo squadra', zone: 'Milano est', phone: '+39 351 447 6620', contract: 'Full time', certs: 'Macchinari, altezze', hours: 40, state: 'Programmato', detail: 'Centro Le Corti · inizia alle 13:00' },
  { name: 'Elena Serra', role: 'Operatrice', zone: 'Milano centro', phone: '+39 333 210 7745', contract: 'Part time 24h', certs: 'HACCP', hours: 22, state: 'Disponibile', detail: 'Turno concluso alle 08:00' },
  { name: 'Youssef Ben Ali', role: 'Operatore', zone: 'Milano ovest', phone: '+39 320 556 3390', contract: 'Full time', certs: 'Vetrate', hours: 39, state: 'Disponibile', detail: 'Nessun intervento oggi' },
  { name: 'Ilaria Moretti', role: 'Operatrice', zone: 'Sesto San Giovanni', phone: '+39 348 771 2201', contract: 'Part time 30h', certs: 'HACCP', hours: 28, state: 'Ferie', detail: 'Rientro lunedì 8 settembre' },
  { name: 'Tommaso Rossi', role: 'Operatore', zone: 'Milano centro', phone: '+39 346 664 8812', contract: 'Full time', certs: 'Protocollo sanitario', hours: 31, state: 'Assente', detail: 'Hotel Darsena · turno 06:00 non coperto' }
]

export const timesheets = [
  { staff: 'Marta Conti', week: '25 – 31 ago', ordinary: 38, overtime: 2, jobs: 11, status: 'Da approvare' },
  { staff: 'Anna Pellegrini', week: '25 – 31 ago', ordinary: 36, overtime: 0, jobs: 12, status: 'Da approvare' },
  { staff: 'Dorin Vasile', week: '25 – 31 ago', ordinary: 40, overtime: 6, jobs: 9, status: 'Da approvare' },
  { staff: 'Elena Serra', week: '25 – 31 ago', ordinary: 22, overtime: 0, jobs: 7, status: 'Approvato' },
  { staff: 'Youssef Ben Ali', week: '25 – 31 ago', ordinary: 39, overtime: 3, jobs: 10, status: 'Approvato' },
  { staff: 'Ilaria Moretti', week: '25 – 31 ago', ordinary: 28, overtime: 0, jobs: 8, status: 'Approvato' },
  { staff: 'Tommaso Rossi', week: '25 – 31 ago', ordinary: 31, overtime: 0, jobs: 9, status: 'Bozza' }
]

export const invoices = [
  { number: '2026/0184', client: 'Portanuova Srl', period: 'Agosto 2026', hours: 72, amount: '€ 4.320,00', due: '30 set', status: 'Inviata' },
  { number: '2026/0185', client: 'Navigli Salute', period: 'Agosto 2026', hours: 60, amount: '€ 3.900,00', due: '30 set', status: 'Inviata' },
  { number: '2026/0186', client: 'Gruppo Le Corti', period: 'Agosto 2026', hours: 180, amount: '€ 10.800,00', due: '15 set', status: 'Bozza' },
  { number: '2026/0187', client: 'Meucci Logistica', period: 'Agosto 2026', hours: 24, amount: '€ 1.680,00', due: '15 set', status: 'Bozza' },
  { number: '2026/0179', client: 'Comune di Sesto', period: 'Luglio 2026', hours: 140, amount: '€ 8.100,00', due: '31 ago', status: 'Scaduta' },
  { number: '2026/0178', client: 'Portanuova Srl', period: 'Luglio 2026', hours: 70, amount: '€ 4.200,00', due: '31 ago', status: 'Pagata' },
  { number: '2026/0177', client: 'Darsena Hospitality', period: 'Luglio 2026', hours: 210, amount: '€ 12.600,00', due: '31 ago', status: 'Pagata' }
]

export const weekPlan = [
  { day: 'Lun 31', shifts: [{ time: '07:00', property: 'Uffici Portanuova', crew: 'Marta C. +1' }, { time: '13:00', property: 'Centro Le Corti', crew: 'Dorin V. +2' }, { time: '18:00', property: 'Istituto Manzoni', crew: 'Da assegnare' }] },
  { day: 'Mar 1', shifts: [{ time: '07:00', property: 'Uffici Portanuova', crew: 'Marta C. +1' }, { time: '14:00', property: 'Showroom Tortona', crew: 'Youssef B.' }] },
  { day: 'Mer 2', shifts: [{ time: '07:00', property: 'Uffici Portanuova', crew: 'Marta C. +1' }, { time: '15:00', property: 'Studio legale Verdi', crew: 'Anna P.' }, { time: '13:00', property: 'Centro Le Corti', crew: 'Dorin V. +2' }] },
  { day: 'Gio 3', shifts: [{ time: '06:00', property: 'Hotel Darsena', crew: 'Elena S. +1' }, { time: '09:00', property: 'Capannone 3, via Meucci', crew: 'Da assegnare' }, { time: '18:00', property: 'Istituto Manzoni', crew: 'Da assegnare' }] },
  { day: 'Ven 4', shifts: [{ time: '07:00', property: 'Uffici Portanuova', crew: 'Marta C. +1' }, { time: '14:00', property: 'Showroom Tortona', crew: 'Youssef B.' }, { time: '20:00', property: 'Centro Le Corti', crew: 'Da assegnare' }] },
  { day: 'Sab 5', shifts: [{ time: '08:00', property: 'Poliambulatorio Navigli', crew: 'Anna P.' }, { time: '13:00', property: 'Centro Le Corti', crew: 'Dorin V. +1' }] },
  { day: 'Dom 6', shifts: [{ time: '06:00', property: 'Hotel Darsena', crew: 'Elena S. +1' }] }
]
