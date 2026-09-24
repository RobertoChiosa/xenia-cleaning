export interface Organization {
  id: string
  name: string
}

export interface Property {
  id: string
  orgId: string
  name: string
  googleDriveFolderId?: string
  icsUrl?: string
  position?: number
}

export type OrgRole = 'owner' | 'admin' | 'member'

export interface Membership {
  id: string
  userId: string
  role: OrgRole
  user?: { id: string, email: string, displayName?: string, avatarUrl?: string }
}

export function useOrg() {
  const xeniaFetch = useXeniaApi()

  const { data: orgs, pending: orgsPending, refresh: refreshOrgs } = useAsyncData('orgs',
    () => xeniaFetch<Organization[]>('/organizations'), { default: () => [] })

  const activeId = useState('org-active', () => '')
  watch(orgs, (list) => {
    if (!activeId.value && list.length) activeId.value = list[0]!.id
  }, { immediate: true })
  // può essere undefined: un utente appena iscritto non ha ancora nessuna organizzazione in xenia-api
  const org = computed(() => orgs.value.find(item => item.id === activeId.value) ?? orgs.value[0])

  const { data: properties, refresh: refreshProperties } = useAsyncData('properties',
    () => org.value ? xeniaFetch<Property[]>(`/organizations/${org.value.id}/properties`) : Promise.resolve([]),
    { watch: [org], default: () => [] })

  const { data: memberships, refresh: refreshMemberships } = useAsyncData('memberships',
    () => org.value ? xeniaFetch<Membership[]>(`/organizations/${org.value.id}/memberships`) : Promise.resolve([]),
    { watch: [org], default: () => [] })

  return {
    orgs,
    orgsPending,
    org,
    activeId,
    setOrg: (id: string) => { activeId.value = id },
    saveOrg: (patch: Partial<Organization>) =>
      xeniaFetch(`/organizations/${org.value!.id}`, { method: 'PATCH', body: patch }).then(() => refreshOrgs()),

    properties,
    createProperty: (patch: Partial<Property>) =>
      xeniaFetch(`/organizations/${org.value!.id}/properties`, { method: 'POST', body: patch }).then(() => refreshProperties()),
    saveProperty: (id: string, patch: Partial<Property>) =>
      xeniaFetch(`/organizations/${org.value!.id}/properties/${id}`, { method: 'PATCH', body: patch }).then(() => refreshProperties()),
    deleteProperty: (id: string) =>
      xeniaFetch(`/organizations/${org.value!.id}/properties/${id}`, { method: 'DELETE' }).then(() => refreshProperties()),
    reorderProperties: (orderedIds: string[]) =>
      Promise.all(orderedIds.map((id, position) =>
        xeniaFetch(`/organizations/${org.value!.id}/properties/${id}`, { method: 'PATCH', body: { position } })))
        .then(() => refreshProperties()),

    memberships,
    inviteMember: (email: string, role: OrgRole) =>
      xeniaFetch(`/organizations/${org.value!.id}/memberships`, { method: 'POST', body: { email, role } }).then(() => refreshMemberships()),
    removeMember: (membershipId: string) =>
      xeniaFetch(`/organizations/${org.value!.id}/memberships/${membershipId}`, { method: 'DELETE' }).then(() => refreshMemberships())
  }
}
