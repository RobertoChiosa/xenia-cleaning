// ponytail: stato in memoria sul mock — sostituire useState con le fetch quando ci sarà il backend
export function useOrg() {
  const orgs = useState('orgs', () => organizations)
  const members = useState('users', () => users)
  const customers = useState('clients', () => clients)
  const allProperties = useState('properties', () => properties)
  const allJobs = useState('jobs', () => jobs)
  const allBookings = useState('bookings', () => bookings)
  const activeId = useState('org-active', () => orgs.value[0]!.id)

  const org = computed(() => orgs.value.find(item => item.id === activeId.value) ?? orgs.value[0]!)

  const scope = <T extends { orgId: string }>(rows: Ref<T[]>) =>
    computed(() => rows.value.filter(row => row.orgId === org.value.id))

  return {
    orgs,
    org,
    activeId,
    setOrg: (id: string) => {
      activeId.value = id
    },
    users: computed(() => members.value.filter(user => user.orgId === org.value.id)),
    addUser: (user: typeof users[number]) => members.value.push(user),
    removeUser: (name: string) => {
      members.value = members.value.filter(user => !(user.name === name && user.orgId === org.value.id))
    },
    clients: computed(() => customers.value.filter(client => client.orgId === org.value.id)),
    saveClient: (client: typeof clients[number]) => {
      const index = customers.value.findIndex(item => item.id === client.id && item.orgId === client.orgId)
      if (index === -1) {
        customers.value.push(client)
      } else {
        customers.value[index] = client
      }
    },
    removeClient: (id: string) => {
      customers.value = customers.value.filter(client => !(client.id === id && client.orgId === org.value.id))
    },
    properties: scope(allProperties),
    jobs: scope(allJobs),
    bookings: scope(allBookings),
    addBooking: (booking: typeof bookings[number]) => allBookings.value.push(booking),
    // crea l'intervento di pulizia al checkout di una prenotazione, se non esiste già
    checkout: (bookingId: string, window: string) => {
      const booking = allBookings.value.find(item => item.id === bookingId && item.orgId === org.value.id)
      if (!booking || booking.jobId) return undefined
      const property = allProperties.value.find(item => item.id === booking.propertyId)
      if (!property) return undefined
      const prefix = org.value.id === 'perfectclean' ? 'INT' : 'NS'
      const job = {
        orgId: org.value.id,
        id: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`,
        bookingId: booking.id,
        window,
        date: booking.checkout,
        propertyId: property.id,
        property: property.name,
        client: property.client,
        crew: 'Da assegnare',
        hours: windowHours(window),
        status: 'Da assegnare'
      }
      allJobs.value.push(job)
      booking.jobId = job.id
      return job.id
    },
    // un operatore non può coprire due interventi con orari sovrapposti lo stesso giorno
    // (excludeJobId serve a non far entrare in conflitto un intervento con se stesso)
    conflictAt: (date: string, window: string, operatorName: string, excludeJobId?: string) =>
      allJobs.value.find(other =>
        other.id !== excludeJobId
        && other.orgId === org.value.id
        && other.date === date
        && crewNames(other.crew).includes(operatorName)
        && windowsOverlap(other.window, window)),
    // cambia la fascia oraria di un intervento già creato
    rescheduleJob: (jobId: string, window: string) => {
      const job = allJobs.value.find(item => item.id === jobId && item.orgId === org.value.id)
      if (!job) return
      job.window = window
      job.hours = windowHours(window)
    },
    // assegna un operatore a un intervento: aggiorna la squadra e sblocca lo stato "da assegnare"
    assignJob: (jobId: string, operatorName: string) => {
      const job = allJobs.value.find(item => item.id === jobId && item.orgId === org.value.id)
      if (!job) return
      const busy = allJobs.value.some(other =>
        other.id !== job.id
        && other.orgId === job.orgId
        && other.date === job.date
        && crewNames(other.crew).includes(operatorName)
        && windowsOverlap(other.window, job.window))
      if (busy) return
      job.crew = job.crew === 'Da assegnare' ? operatorName : `${job.crew}, ${operatorName}`
      if (job.status === 'Da assegnare') job.status = 'Programmato'
    }
  }
}
