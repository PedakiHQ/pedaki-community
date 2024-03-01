export default {
  metadata: {
    title: 'Elèves',
  },
  header: {
    title: 'Elèves',
    description: 'Modèle de données pour un étudiant',
  },

  personalInfos: {
    title: 'Informations de base',
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
      gender: {
        label: 'Genre',
        placeholder: 'Genre',
        options: {
          M: 'Masculin',
          F: 'Féminin',
          O: 'Autre',
        },
      },
      otherName: {
        label: 'Troisième nom',
        placeholder: 'ElChapo',
      },
      birthDate: {
        label: 'Date de naissance',
        placeholder: '01/01/2000',
      },
    },
  },

  properties: {
    new: {
      trigger: 'Ajouter',
      title: 'Nouvelle propriété',
    },
    action: {
      remove: 'Supprimer',
      add: 'Ajouter',
    },
    fields: {
      type: {
        placeholder: 'Type',
        options: {
          LEVEL: {
            label: 'Niveau',
          },
        },
      },
      name: {
        placeholder: 'Nom',
      },
      required: {
        label: 'Requis',
      },
    },
  },

  create: {
    submit: 'Ajouter',
  },
  edit: {
    submit: 'Modifier',
  },
} as const;
