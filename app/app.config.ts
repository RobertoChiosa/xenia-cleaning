export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      secondary: 'tanuki',
      neutral: 'gl-gray'
    },

    // Pajamas: raggio 4px ovunque, pulsanti a peso normale, niente ombre.
    button: {
      slots: { base: 'rounded-sm font-normal' }
    },
    badge: {
      slots: { base: 'rounded-full font-medium' }
    },
    input: {
      slots: { base: 'rounded-sm' }
    },
    textarea: {
      slots: { base: 'rounded-sm' }
    },
    select: {
      slots: { base: 'rounded-sm' }
    },
    selectMenu: {
      slots: { base: 'rounded-sm' }
    },
    inputMenu: {
      slots: { base: 'rounded-sm' }
    },
    modal: {
      slots: { content: 'rounded-sm shadow-none ring ring-default' }
    },
    alert: {
      slots: { root: 'rounded-sm' }
    },
    dropdownMenu: {
      slots: { content: 'rounded-sm', item: 'rounded-sm' }
    },
    card: {
      slots: {
        root: 'rounded-sm shadow-none',
        header: 'bg-elevated/40 py-3 sm:py-3',
        title: 'text-sm',
        body: 'p-4 sm:p-4',
        footer: 'bg-elevated/40 py-3 sm:py-3'
      }
    },
    pageCard: {
      slots: { root: 'rounded-sm' }
    },

    // Tabelle dense, intestazione su fondo grigio come nelle liste di GitLab.
    table: {
      slots: {
        th: 'px-4 py-2.5 text-sm font-semibold text-highlighted text-start bg-elevated/40',
        td: 'px-4 py-2.5 text-sm text-default whitespace-nowrap',
        tr: 'data-[selected=true]:bg-elevated/50 hover:bg-elevated/30 transition-colors'
      }
    },

    // Voce attiva grigia e in grassetto, non colorata: è il segno della super-sidebar.
    navigationMenu: {
      slots: { link: 'rounded-sm' },
      variants: {
        active: {
          true: { link: 'font-semibold' }
        }
      },
      defaultVariants: { color: 'neutral' }
    },

    dashboardSidebar: {
      slots: {
        root: 'bg-muted',
        header: 'border-b border-default',
        footer: 'border-t border-default'
      }
    },
    dashboardPanel: {
      slots: { root: 'bg-default' }
    },
    dashboardNavbar: {
      slots: { title: 'text-base' }
    },

    // Sito pubblico: superficie bianca sotto un body grigio, header opaco.
    main: {
      base: 'min-h-[calc(100vh-var(--ui-header-height))] bg-default'
    },
    header: {
      slots: { root: 'bg-default border-b border-default h-(--ui-header-height) sticky top-0 z-50' }
    }
  }
})
