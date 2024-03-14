export default {
  metadata: {
    title: 'Générer les classes',
  },
  header: {
    title: 'Classes',
    description: 'Générer les classes',
  },
  input: {
    rules: {
      types: {
        gather_attributes: {
          name: 'Regrouper',
          description: 'Réunir un ou plusieurs attributs dans un minimum de classe.',
        },
        balance_count: {
          name: 'Équilibrer entre les classes',
          description:
            "Répartir équitablement le dénombrement d'élèves ou d'attributs dans chaque classe possédant l'attribut.",
        },
        balance_class_count: {
          name: 'Équilibrer dans une classe',
          description:
            'Répartir équitablement le dénombrement de plusieurs attributs dans une même classe.',
        },
        maximize_class_size: {
          name: 'Maximiser la taille des classes',
          description:
            'Réduire au maximum le nombre de classes, en les remplissant autant que possible.',
        },
        maximize_classes: {
          name: 'Maximiser le nombre de classes',
          description: 'Réduire au maximum la taille des classes pour en avoir le plus possible.',
        },
        positive_relationships: {
          name: "Préférences amicales d'élèves",
          description: 'Réunir les élèves ayant une relation positive.',
        },
        negative_relationships: {
          name: "Préférences de séparation d'élèves",
          description: 'Séparer les élèves ayant une relation négative.',
        },
      },
      new: {
        label: 'Ajouter une règle',
        placeholder: 'Sélectionner un type de régle et définir ses attributs.',
      },
    },
    constraints: {
      class_size_limit: {
        label: 'Nombre maximum de classes',
        description: 'Nombre total de classes qui seront générées au maximum.',
      },
      class_amount_limit: {
        label: 'Taille maximale des classes',
        description: "Correspond au nombre d'élèves que peut contenir chaque classe.",
      },
    },
  },
  output: {
    generate: {
      label: 'Générer les classes',
    },
  },
} as const;
