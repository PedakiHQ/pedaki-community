export default {
  metadata: {
    title: 'Invitation',
    description: ' ',
  },
  wrapper: {
    title: 'Tu as été invité à rejoindre {name}',
    description: "Avant d'accéder au workspace, choisis un mot de passe",
  },
  fields: {
    name: {
      label: 'Nom',
      placeholder: 'Nathan',
    },
    password: {
      label: 'Mot de passe',
    },
    passwordConfirm: {
      label: 'Confirmation de mot de passe',
    },
  },
  wrongId: {
    label: "Ce n'est pas votre identifiant",
  },
  submit: {
    label: 'Créer mon compte',
    loading: {
      title: 'Création du compte en cours',
      description: ' ',
    },
    success: {
      title: '🎉 Compte créé avec succès',
      description: ' ',
    },
    error: {
      title: 'Une erreur est survenue lors de la création du compte',
      description: ' ',
    },
  },
} as const;
