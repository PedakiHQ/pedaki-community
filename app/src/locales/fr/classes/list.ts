export default {
  metadata: {
    title: 'Classes',
  },
  header: {
    title: 'Classes',
    description: 'Liste des classes',
  },
  headerActions: {
    generate: {
      label: 'Générer des classes',
    },
  },
  table: {
    noResult: 'Aucune classe trouvé',
    columns: {
      name: {
        label: 'Libellé',
      },
      description: {
        label: 'Description',
      },
      academicYear: {
        label: 'Année académique',
      },
      level: {
        label: 'Niveau',
      },
      mainTeacher: {
        label: 'Professeur principal',
      },
      branches: {
        label: 'Branche(s)',
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
