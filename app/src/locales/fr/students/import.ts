const imports = {
  metadata: {
    title: 'Importer des élèves',
  },
  header: {
    title: 'Elèves',
    description: 'Importer des élèves',
  },
  navigation: {
    items: {
      classes: 'Classes',
      students: 'Elèves',
    },
  },

  confirmation: {
    button: 'Valider',
    title: 'Confirmation',
    description: 'Voulez-vous vraiment valider cette action ? Cette action est irréversible.',
    actions: {
      confirm: 'Valider',
      cancel: 'Annuler',
    },
    students: {
      title: 'Elèves',
      added: 'Elèves ajoutés',
      updated: 'Elèves mis à jour',
    },
    classes: {
      title: 'Classes',
      added: 'Classes ajoutées',
      updated: 'Classes mises à jour',
    },
  },

  selector: {
    title: {
      classes: 'Sélectionner une classe',
      students: 'Sélectionner un élève',
    },
    noResults: {
      withFilters: 'Aucun résultat ne correspond à votre recherche',
      withoutFilters: 'Aucun résultat',
    },
    visibility: {
      hide: 'Cacher',
      show: 'Afficher',
    },
    filter: {
      label: 'Filtre',
      choices: {
        DONE: 'Terminé',
        REMOVED: 'Supprimé',
        PENDING: 'En attente',
      },
    },
  },

  existing: {
    linkToStudent: 'Lier à un élève',
    linkedToStudent: 'Lié à un {name}',
  },

  imported: {
    status: {
      DONE: '(Modifiée)',
    },
  },
};

export default imports;
