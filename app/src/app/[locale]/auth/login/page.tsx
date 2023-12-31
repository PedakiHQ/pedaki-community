import AuthWrapper from '~/app/[locale]/auth/auth-wrapper.tsx';
import type { PageType } from '~/app/types.ts';
import { getScopedI18n } from '~/locales/server.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import React from 'react';
import LoginForm from './login-form';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('auth.login');

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
};

export default async function LoginPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('auth.login');

  return (
    <AuthWrapper title={t('wrapper.title')} description={t('wrapper.description')}>
      <LoginForm />
    </AuthWrapper>
  );
}
