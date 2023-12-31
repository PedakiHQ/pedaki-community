export default {
  metadata: {
    title: 'Général',
  },
  rows: {
    general: {
      title: 'Général',
      description: 'Paramètres généraux du workspace.',
      form: {
        fields: {
          name: {
            label: 'Nom du workspace',
            description: 'blabla sidebar et onglets',
          },
          defaultLanguage: {
            label: "Langue de l'application",
            description: 'Blabla uniquement celle de base',
            placeholder: 'Sélectionnez une langue',
          },
        },
        submit: {
          label: 'Sauvegarder',
          loading: {
            title: 'Sauvegarde en cours',
            description: ' ',
          },
          success: {
            title: '🎉 Informations mises à jour avec succès',
            description: ' ',
          },
          error: {
            title: 'Une erreur est survenue lors de la mise à jour des informations',
            description: ' ',
          },
        },
      },
    },
    appearance: {
      title: 'Apparence',
      description: "Paramètres d'apparence du workspace.",
      form: {
        fields: {
          logo: {
            label: 'Logo du workspace',
            description: 'blabla la preview peut changer (taille recommendée {width}x{height}})',
          },
        },
        submit: {
          label: 'Sauvegarder',
          loading: {
            title: 'Sauvegarde du logo en cours',
            description: ' ',
          },
          success: {
            title: '🎉 Logo mis à jour avec succès',
            description: ' ',
          },
          error: {
            title: 'Une erreur est survenue lors de la mise à jour du logo',
            description: ' ',
          },
        },
      },
    },
  },
} as const;
