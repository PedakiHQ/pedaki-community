export default {
  title: 'Importer des élèves',
  description: 'Renseignez la liste des élèves de votre workspace.',
  steps: {
    sidebarSubmenu: {
      content: 'Déroulez le menu latéral concernant les élèves.',
    },
    navigate: {
      content: 'Accédez à la page contenant la liste des élèves',
    },
    importButton: {
      content: 'Cliquez sur ce bouton pour importer des élèves',
    },
    modal: {
      content:
        "Ici, vous pouvez importer un fichier CSV contenant la liste des élèves. Le format de de fichier est automatiquement détecté. Essayez d'importer un fichier, le tutoriel continuera après.",
    },
    studentTab: {
      content: "Aller à l'onglet 'Élèves'",
    },
    navigation: {
      content:
        "Dans ce menu, vous pouvez choisir l'élève que vous souhaitez modifier ou supprimer.",
    },
    leftSide: {
      content: 'Ce côté représente les données importées',
    },
    rightSide: {
      content: 'Ce côté représente les données qui vont être sauvegardées.',
    },
    link: {
      content:
        "Notre service essaie de lier les données importées avec les données déjà existantes. Si vous n'êtes pas satisfait du résultat, vous pouvez choisir un autre élève.",
    },
    actions: {
      content: 'Vous pouvez soit supprimer les données importées, soit les sauvegarder.',
    },
  },
} as const;
