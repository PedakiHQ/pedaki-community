export default {
  content: {
    home: {
      title: 'Accueil',
    },
    classes: {
      title: 'Classes',
      items: {
        teacher: {
          title: 'Gestion des professeurs',
        },
        list: {
          title: 'Liste des classes',
        },
        generate: {
          title: 'Générer les classes',
        },
      },
    },
    students: {
      title: 'Elèves',
      items: {
        list: {
          title: 'Liste des élèves',
        },
        schema: {
          title: "Schéma d'élèves",
        },
      },
    },
    teachers: {
      title: 'Professeurs',
      items: {
        list: {
          title: 'Liste des professeurs',
        },
      },
    },
  },
  altContent: {
    settings: 'Paramètres',
    documentation: 'Documentation',
  },
  user: {
    dropdown: {
      label: 'Utilisateur',
      settings: 'Paramètres',
      language: 'Changer de langue',
      signout: 'Se déconnecter',
    },
  },
} as const;
