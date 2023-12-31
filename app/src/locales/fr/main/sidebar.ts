export default {
  content: {
    home: {
      title: 'Accueil',
    },
    classes: {
      title: 'Classes',
      items: {
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
  },
  altContent: {
    settings: 'Paramètres',
    documentation: 'Documentation',
  },
  user: {
    header: {
      name: 'Bonjour {name} !',
    },
    dropdown: {
      label: 'Utilisateur',
      settings: 'Paramètres',
      language: 'Changer de langue',
      signout: 'Se déconnecter',
    },
  },
} as const;
