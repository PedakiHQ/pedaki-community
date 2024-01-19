export default {
  metadata: {
    title: 'Connexion',
    description: ' ',
  },
  wrapper: {
    title: 'Connexion',
    description: 'Bienvenue ! Entrez vos identifiants pour accéder à votre compte.',
  },
  fields: {
    email: {
      label: 'Email',
      placeholder: 'tony@parker.com',
    },
    password: {
      label: 'Mot de passe',
    },
  },
  submit: {
    label: 'Se connecter',
  },
  forgotPassword: {
    label: 'Mot de passe oublié ?',
  },
  register: {
    label: 'Pas encore de compte ?',
  },
} as const;
