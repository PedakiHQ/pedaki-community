export default {
  title: "Schéma d'élèves",
  description: "Configurez le schéma d'élèves de votre workspace.",
  steps: {
    sidebarSubmenu: {
      content: 'Déroulez le menu latéral concernant les élèves.',
    },
    navigate: {
      content: "Accédez à la page de gestion des Schémas d'élèves",
    },
    baseInfo: {
      content:
        "Dans cette section vous trouverez les informations de base concernant le schéma d'élèves. Ici il n'y a pas de configuration à faire.",
    },
    properties: {
      content:
        'Dans cette section vous pouvez ajouter, modifier ou supprimer des propriétés pour les élèves. Celà peut correspondre à une moyenne dans une matière, appartenance à un groupe, etc.',
    },
    propertiesButton: {
      content: 'Cliquez ici pour ajouter une propriété.',
    },
    propertiesForm: {
      content:
        "C'est ici que vous renseignez le nom et le type de la propriété que vous souhaitez ajouter. Pour le moment seul les notes sont disponibles.",
    },
  },
} as const;
