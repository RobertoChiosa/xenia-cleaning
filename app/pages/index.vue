<template>
  <div>
    <UPageHero
      title="Il gestionale per le imprese di pulizia"
      description="Gestisci clienti e proprietà, assegna gli operatori, controlla le ore e fattura. Un unico sistema al posto di gruppi WhatsApp e fogli Excel."
      :links="[{
        label: 'Richiedi una demo',
        to: '/login',
        size: 'lg'
      }, {
        label: 'Accedi',
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
        title: 'Pianificazione',
        description: 'Servizi ricorrenti, interventi una tantum e sostituzioni in un unico planning. Sovrapposizioni e tempi di trasferimento segnalati prima della pubblicazione.'
      }, {
        icon: 'i-lucide-building-2',
        title: 'Clienti e proprietà',
        description: 'Ogni cliente con le sue proprietà, il piano di servizio e gli operatori assegnati in modo stabile.'
      }, {
        icon: 'i-lucide-clock',
        title: 'Presenze e ore',
        description: 'Timbratura in loco, ore verificate e straordinari pronti per la busta paga.'
      }, {
        icon: 'i-lucide-receipt',
        title: 'Fatturazione clienti',
        description: 'Dagli interventi conclusi alla fattura per contratto, con ore ed extra già inclusi.'
      }]"
    />

    <UPageSection
      id="how-it-works"
      title="Costruito su come lavorano davvero le imprese"
      description="Clienti, proprietà e operatori sono al centro: assegni una volta la squadra alla proprietà e ogni intervento nasce già coperto."
    >
      <UPageColumns>
        <UPageCard
          title="La mattina assegni"
          description="La bacheca del giorno mostra ogni intervento, chi lo copre e quali proprietà sono scoperte."
          variant="ghost"
        />
        <UPageCard
          title="Durante il giorno controlli"
          description="Timbrature, assenze e interventi conclusi si aggiornano in tempo reale, senza fare il giro di telefonate."
          variant="ghost"
        />
        <UPageCard
          title="A fine mese chiudi"
          description="Ore approvate alla busta paga, interventi conclusi in fattura. Niente da riscrivere."
          variant="ghost"
        />
      </UPageColumns>
    </UPageSection>

    <UPageSection>
      <UPageCTA
        title="Gestisci l'impresa da un solo posto"
        description="Carica clienti, proprietà e operatori in un pomeriggio."
        variant="subtle"
        :links="[{
          label: 'Richiedi una demo',
          to: '/login'
        }, {
          label: 'Accedi',
          to: '/login',
          color: 'neutral',
          variant: 'outline'
        }]"
      />
    </UPageSection>
  </div>
</template>
