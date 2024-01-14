export default {
  metadata: {
    title: 'Activation de compte',
    description: ' ',
  },
  wrapper: {
    title: 'Bonjour {name} !',
    description: "Avant d'accéder ay workspace, choisissez un mot de passe",
  },
  fields: {
    password: {
      label: 'Mot de passe',
    },
    passwordConfirm: {
      label: 'Confirmation de mot de passe',
    },
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
