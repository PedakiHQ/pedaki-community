import AuthWrapper from '~/app/[locale]/auth/auth-wrapper.tsx';
import type { PageType } from '~/app/types.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import React from 'react';
import LoginForm from './login-form';

export default function LoginPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);

  return (
    <AuthWrapper
      title="Connexion"
      description="Bienvenue ! Entrez vos identifiants pour accéder à votre compte."
    >
      <LoginForm />
    </AuthWrapper>
  );
}
