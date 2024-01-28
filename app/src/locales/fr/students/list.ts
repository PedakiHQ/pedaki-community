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
    filters: {
      noFilters: 'Aucun filtre',
      selector: {
        subLabel: 'Sélectionnez les filtres à appliquer',
      },
      clear: {
        label: 'Effacer les filtres',
      },
      new: {
        label: 'Nouveau filtre',
        title: 'Nouveau filtre',
      },
      edit: {
        title: 'Modifier le filtre',
      },
      form: {
        field: {
          placeholder: 'Colonne',
        },
        operator: {
          placeholder: 'Opérateur',
        },
        value: {
          placeholder: {
            text: 'Saisissez une valeur',
            int: 'Saisissez un nombre',
          },
        },
        action: {
          add: 'Ajouter',
          update: 'Modifier',
          remove: 'Supprimer',
        },
      },
    },
  },
} as const;
