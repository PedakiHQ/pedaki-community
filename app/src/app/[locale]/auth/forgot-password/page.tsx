import AuthWrapper from '~/app/[locale]/auth/auth-wrapper.tsx';
import type { PageType } from '~/app/types.ts';
import { getI18n } from '~/locales/server.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import React from 'react';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getI18n();

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
};

export default function ForgotPasswordPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);

  return (
    <AuthWrapper title="Mot de passe oublié" description="todo">
      TODO
    </AuthWrapper>
  );
}
