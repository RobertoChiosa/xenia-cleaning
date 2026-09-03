<template>
  <div>
    <UPageHero
      title="Operations software for cleaning agencies"
      description="Schedule crews, dispatch jobs, track hours and invoice clients — one system instead of a group chat and a spreadsheet."
      :links="[{
        label: 'Book a demo',
        to: '/login',
        size: 'lg'
      }, {
        label: 'Log in',
        to: '/login',
        size: 'lg',
        color: 'neutral',
        variant: 'ghost',
        trailingIcon: 'i-lucide-arrow-right'
      }]"
    />

    <UPageSection
      id="features"
      :features="[{
        icon: 'i-lucide-calendar-days',
        title: 'Scheduling',
        description: 'Recurring contracts, one-off jobs and cover shifts on a single planner. Conflicts and travel gaps flagged before you publish.'
      }, {
        icon: 'i-lucide-users',
        title: 'Crews',
        description: 'Staff records, availability, certifications and rates. Assign by skill and postcode instead of memory.'
      }, {
        icon: 'i-lucide-clock',
        title: 'Time & attendance',
        description: 'Clock-in from site, verified hours, and overtime ready to hand to payroll.'
      }, {
        icon: 'i-lucide-receipt',
        title: 'Client billing',
        description: 'Turn completed jobs into invoices per contract, with the hours and extras already attached.'
      }]"
    />

    <UPageSection
      id="how-it-works"
      title="Built around how agencies actually run"
      description="Contracts, sites and crews are first-class, so a schedule change updates the job sheet, the timesheet and the invoice in one move."
    >
      <UPageColumns>
        <UPageCard
          title="Dispatch in the morning"
          description="Today's board shows every job, who is on it, and what is still unassigned."
          variant="ghost"
        />
        <UPageCard
          title="Track through the day"
          description="Clock-ins, no-shows and completed sites update live, without calling round."
          variant="ghost"
        />
        <UPageCard
          title="Close out the month"
          description="Approved hours to payroll, completed jobs to invoices. Nothing re-typed."
          variant="ghost"
        />
      </UPageColumns>
    </UPageSection>

    <UPageSection>
      <UPageCTA
        title="Run your agency from one place"
        description="Set up your contracts, crews and sites in an afternoon."
        variant="subtle"
        :links="[{
          label: 'Book a demo',
          to: '/login'
        }, {
          label: 'Log in',
          to: '/login',
          color: 'neutral',
          variant: 'outline'
        }]"
      />
    </UPageSection>
  </div>
</template>
