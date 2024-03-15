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
      label: 'Ajouter un élève',
    },
    export: {
      label: 'Exporter',
    },
    import: {
      label: 'Importer',
    },
  },
  upload: {
    oldImport: {
      label: 'Reprendre un import',
    },
    submit: {
      error: {
        title: "Une erreur est survenue lors de l'import",
        description: ' ',
      },
    },
    status: {
      default: 'Erreur inconnue',
      EMPTY_FILE: 'Fichier vide',
      UNKNOWN_FORMAT: 'Format de fichier inconnu',
      inserted: '{count} élèves trouvés',
    },
  },
  table: {
    noResult: 'Aucun élève trouvé',
    columns: {
      firstName: {
        label: 'Prénom',
      },
      lastName: {
        label: 'Nom',
      },
      gender: {
        label: 'Genre',
      },
      class: {
        label: 'Classe',
      },
      teachers: {
        label: 'Professeurs',
      },
    },
    footer: {
      perPage: 'Elèves par page',
    },
  },
} as const;
