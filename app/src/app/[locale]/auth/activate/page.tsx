import ActivateForm from '~/app/[locale]/auth/activate/activate-form.tsx';
import AuthWrapper from '~/app/[locale]/auth/auth-wrapper.tsx';
import type { PageType } from '~/app/types.ts';
import AuthErrorPage from '~/components/ErrorPage/AuthErrorPage.tsx';
import { getScopedI18n } from '~/locales/server.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import { api } from '~/server/clients/server';
import React from 'react';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('auth.activate');

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
};

export default async function ActivateAccountPage({
  params,
  searchParams,
}: PageType & { searchParams: Record<string, unknown> }) {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('auth.activate');

  const token = searchParams.token as string;
  if (!token) {
    // TODO: render error page with custom message
    return <AuthErrorPage />;
  }

  const userData = await api.auth.getUserInfoFromActivationToken.query({ token });

  return (
    <AuthWrapper
      title={t('wrapper.title', { name: userData.name })}
      description={t('wrapper.description')}
    >
      <ActivateForm email={userData.email} token={token} />
    </AuthWrapper>
  );
}
