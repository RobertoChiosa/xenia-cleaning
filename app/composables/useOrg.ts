// ponytail: stato in memoria sul mock — sostituire useState con le fetch quando ci sarà il backend
export function useOrg() {
  const orgs = useState('orgs', () => organizations)
  const members = useState('users', () => users)
  const customers = useState('clients', () => clients)
  const activeId = useState('org-active', () => orgs.value[0]!.id)

  const org = computed(() => orgs.value.find(item => item.id === activeId.value) ?? orgs.value[0]!)

  const scope = <T extends { orgId: string }>(rows: T[]) =>
    computed(() => rows.filter(row => row.orgId === org.value.id))

  return {
    orgs,
    org,
    activeId,
    setOrg: (id: string) => {
      activeId.value = id
    },
    users: computed(() => members.value.filter(user => user.orgId === org.value.id)),
    addUser: (user: typeof users[number]) => members.value.push(user),
    removeUser: (email: string) => {
      members.value = members.value.filter(user => !(user.email === email && user.orgId === org.value.id))
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
    properties: scope(properties),
    staff: scope(staff),
    jobs: scope(jobs),
    timesheets: scope(timesheets),
    invoices: scope(invoices)
  }
}
