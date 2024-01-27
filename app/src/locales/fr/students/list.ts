export default {
  metadata: {
    title: 'Elèves',
  },
  header: {
    title: 'Elèves',
    description: 'Liste des élèves',
  },
  headerActions: {
    create: {
      label: 'Ajouter des élèves',
    },
    import: {
      label: 'Importer',
    },
  },
  table: {
    columns: {
      firstName: {
        label: 'Prénom',
      },
      lastName: {
        label: 'Nom',
      },
      class: {
        label: 'Classe',
      },
      teachers: {
        label: 'Professeurs',
      },
    },
    footer: {
      showing: 'Affichage de {from} à {to} sur {total}',
      perPage: 'Elèves par page',
    },
    hide: {
      columns: {
        label: 'Colonnes',
        subLabel: 'Sélectionnez les colonnes à afficher',
      },
    },
  },
} as const;
