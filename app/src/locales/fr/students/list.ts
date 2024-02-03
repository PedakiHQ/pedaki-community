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
    export: {
      label: 'Exporter',
    },
    import: {
      label: 'Importer',
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
      class: {
        label: 'Classe',
      },
      teachers: {
        label: 'Professeurs',
      },
    },
    footer: {
      perPage: 'Classes par page',
    },
  },
} as const;
