export default {
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
        IGNORED: 'Ignoré',
        PENDING: 'En attente',
      },
    },
  },

  existing: {
    linkToStudent: 'Lier à un élève',
    linkedToStudent: 'Lié à un {name}',
  },

  fields: {
    firstName: {
      label: 'Prénom',
      // TODO
      placeholder: 'Guillaume',
    },
    lastName: {
      label: 'Nom',
        placeholder: 'Jobard',
    },
    otherName: {
      label: 'Troisième nom',
      placeholder: 'ElChapo',
    },
    birthDate: {
      label: 'Date de naissance'
    },
  },
};
