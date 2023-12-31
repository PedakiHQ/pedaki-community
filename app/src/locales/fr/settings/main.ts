export default {
  metadata: {
    title: { template: '%s - Paramètres - {applicationName}' },
    description: 'Gérer les paramètres de votre workspace.',
  },
  header: {
    title: 'Paramètres',
    description: 'Gérer les paramètres de votre workspace.',
  },
  navigation: {
    items: {
      default: {
        label: 'Paramètres',
      },
      general: {
        label: 'Général',
      },
      account: {
        label: 'Mon compte',
      },
      billing: {
        label: 'Abonnement',
      },
      users: {
        label: 'Utilisateurs',
      },
    },
  },
} as const;
