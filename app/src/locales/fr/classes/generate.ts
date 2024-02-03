export default {
  metadata: {
    title: 'Générer les classes',
  },
  header: {
    title: 'Générer les classes',
    description: ' ',
  },
  input: {
    rules: {
      types: {
        gather_attributes: 'Regrouper',
        balance_count: 'Équilibrer',
        balance_class_count: 'Équilibrer dans une classe',
        maximize_class_size: 'Maximiser la taille des classes',
        maximize_classes: 'Maximiser le nombre de classes',
        positive_relationships: "Préférences amicales d'élèves",
        negative_relationships: "Préférences de séparation d'élèves",
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
