import AuthWrapper from '~/app/[locale]/auth/auth-wrapper.tsx';
import type { PageType } from '~/app/types.ts';
import { getI18n } from '~/locales/server.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import React from 'react';
import LoginForm from './login-form';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getI18n();

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
};

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
