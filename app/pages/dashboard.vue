<script setup lang="ts">
definePageMeta({ layout: false })

const links = [[{
  label: 'Overview',
  icon: 'i-lucide-layout-dashboard',
  to: '/dashboard'
}, {
  label: 'Bookings',
  icon: 'i-lucide-calendar-days',
  badge: '3',
  to: '/dashboard'
}, {
  label: 'Cleaners',
  icon: 'i-lucide-users',
  to: '/dashboard'
}, {
  label: 'Properties',
  icon: 'i-lucide-house',
  to: '/dashboard'
}, {
  label: 'Invoices',
  icon: 'i-lucide-receipt',
  to: '/dashboard'
}], [{
  label: 'Settings',
  icon: 'i-lucide-settings',
  to: '/dashboard'
}, {
  label: 'Help',
  icon: 'i-lucide-circle-help',
  to: '/dashboard'
}]]

const stats = [
  { label: 'Upcoming visits', value: '3', icon: 'i-lucide-calendar-check', hint: 'Next: Thu 09:00' },
  { label: 'Hours this month', value: '18', icon: 'i-lucide-clock', hint: '+4 vs last month' },
  { label: 'Average rating', value: '4.9', icon: 'i-lucide-star', hint: 'Across 12 visits' },
  { label: 'Spend this month', value: '£312', icon: 'i-lucide-wallet', hint: 'Regular plan rate' }
]

const bookings = [
  { date: 'Thu 5 Sep · 09:00', service: 'Regular home clean', cleaner: 'Marta K.', address: '14 Ashfield Rd', status: 'Confirmed' },
  { date: 'Fri 13 Sep · 14:00', service: 'Deep clean', cleaner: 'Ana P.', address: '14 Ashfield Rd', status: 'Confirmed' },
  { date: 'Thu 19 Sep · 09:00', service: 'Regular home clean', cleaner: 'Marta K.', address: '14 Ashfield Rd', status: 'Pending' },
  { date: 'Thu 29 Aug · 09:00', service: 'Regular home clean', cleaner: 'Marta K.', address: '14 Ashfield Rd', status: 'Completed' },
  { date: 'Thu 22 Aug · 09:00', service: 'Office clean', cleaner: 'Dorin V.', address: 'Unit 3, Reed St', status: 'Completed' }
]

const columns = [
  { accessorKey: 'date', header: 'When' },
  { accessorKey: 'service', header: 'Service' },
  { accessorKey: 'cleaner', header: 'Cleaner' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'status', header: 'Status' }
]

const statusColor = {
  Confirmed: 'primary',
  Pending: 'warning',
  Completed: 'neutral'
} as const
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      resizable
    >
      <template #header="{ collapsed }">
        <NuxtLink to="/">
          <AppLogo
            v-if="!collapsed"
            class="w-auto h-6 shrink-0"
          />
          <UIcon
            v-else
            name="i-lucide-sparkles"
            class="size-5 text-primary"
          />
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UButton
          :label="collapsed ? undefined : 'Book a clean'"
          icon="i-lucide-plus"
          :block="!collapsed"
          to="/dashboard"
        />

        <UNavigationMenu
          :items="links"
          :collapsed="collapsed"
          orientation="vertical"
          class="mt-2"
        />
      </template>

      <template #footer="{ collapsed }">
        <UButton
          :label="collapsed ? undefined : 'Roberto B.'"
          :avatar="{ alt: 'Roberto B.' }"
          color="neutral"
          variant="ghost"
          :block="!collapsed"
          :ui="{ base: 'justify-start' }"
          to="/login"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel id="overview">
      <template #header>
        <UDashboardNavbar title="Overview">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>

          <template #right>
            <UColorModeButton />
            <UButton
              icon="i-lucide-bell"
              color="neutral"
              variant="ghost"
              aria-label="Notifications"
            />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <div class="space-y-6">
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <UPageCard
              v-for="stat in stats"
              :key="stat.label"
              :icon="stat.icon"
              :title="stat.value"
              :description="stat.label"
              variant="subtle"
              :ui="{ title: 'text-2xl font-semibold' }"
            >
              <template #footer>
                <p class="text-xs text-muted">
                  {{ stat.hint }}
                </p>
              </template>
            </UPageCard>
          </div>

          <UCard :ui="{ body: 'p-0 sm:p-0' }">
            <template #header>
              <div class="flex items-center justify-between gap-4">
                <div>
                  <h2 class="font-semibold text-highlighted">
                    Bookings
                  </h2>
                  <p class="text-sm text-muted">
                    Your next and most recent visits.
                  </p>
                </div>

                <UButton
                  label="New booking"
                  icon="i-lucide-plus"
                  size="sm"
                  to="/dashboard"
                />
              </div>
            </template>

            <UTable
              :data="bookings"
              :columns="columns"
            >
              <template #status-cell="{ row }">
                <UBadge
                  :label="row.original.status"
                  :color="statusColor[row.original.status as keyof typeof statusColor]"
                  variant="subtle"
                />
              </template>
            </UTable>
          </UCard>

          <div class="grid gap-4 lg:grid-cols-2">
            <UCard>
              <template #header>
                <h2 class="font-semibold text-highlighted">
                  Your cleaners
                </h2>
              </template>

              <div class="space-y-4">
                <div
                  v-for="cleaner in [
                    { name: 'Marta K.', role: 'Regular home clean · 12 visits' },
                    { name: 'Ana P.', role: 'Deep clean specialist · 2 visits' },
                    { name: 'Dorin V.', role: 'Office clean · 4 visits' }
                  ]"
                  :key="cleaner.name"
                  class="flex items-center gap-3"
                >
                  <UAvatar :alt="cleaner.name" />
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-highlighted truncate">
                      {{ cleaner.name }}
                    </p>
                    <p class="text-xs text-muted truncate">
                      {{ cleaner.role }}
                    </p>
                  </div>
                  <UButton
                    icon="i-lucide-message-circle"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    class="ms-auto"
                    aria-label="Message"
                  />
                </div>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <h2 class="font-semibold text-highlighted">
                  Plan
                </h2>
              </template>

              <div class="space-y-4">
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-semibold text-highlighted">Regular</span>
                  <UBadge
                    label="Active"
                    variant="subtle"
                  />
                </div>
                <p class="text-sm text-muted">
                  Fortnightly, 3 hours, same cleaner. £16/hour. Next invoice 1 Oct.
                </p>
                <div class="flex gap-2">
                  <UButton
                    label="Change plan"
                    color="neutral"
                    variant="subtle"
                    size="sm"
                  />
                  <UButton
                    label="Pause"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                  />
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
