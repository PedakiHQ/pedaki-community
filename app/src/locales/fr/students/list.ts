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
    columnHeader: {
      asc: 'Ascendant',
      desc: 'Décroissant',
      hide: 'Masquer',
    },
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
      and: 'ET',
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
          names: {
            eq: 'égal à',
            neq: 'différent de',
            gt: 'supérieur à',
            gte: 'supérieur ou égal à',
            lt: 'inférieur à',
            lte: 'inférieur ou égal à',
            // in: 'in',
            // nin: 'nin',
            like: 'contient',
            nlike: 'ne contient pas',
          },
          shortNames: {
            eq: '=',
            neq: '≠',
            gt: '>',
            gte: '≥',
            lt: '<',
            lte: '≤',
            // in: 'in',
            // nin: 'nin',
            like: 'contient',
            nlike: 'ne contient pas',
          },
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
