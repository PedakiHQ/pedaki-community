import ActivateForm from '~/app/[locale]/auth/activate/activate-form.tsx';
import AuthWrapper from '~/app/[locale]/auth/auth-wrapper.tsx';
import type { PageType } from '~/app/types.ts';
import AuthErrorPage from '~/components/ErrorPage/AuthErrorPage.tsx';
import { setStaticParamsLocale } from '~/locales/utils';
import { api } from '~/server/clients/server';
import React from 'react';

export default async function ActivateAccountPage({
  params,
  searchParams,
}: PageType & { searchParams: Record<string, unknown> }) {
  setStaticParamsLocale(params.locale);

  const token = searchParams.token as string;
  if (!token) {
    // TODO: render error page with custom message
    return <AuthErrorPage />;
  }

  const userData = await api.auth.getUserInfoFromActivationToken.query({ token });

  return (
    <AuthWrapper
      title={`Salut ${userData.name}`}
      description="Avant d'accéder au workspace, choisis un mot de passe"
    >
      <ActivateForm email={userData.email} token={token} />
    </AuthWrapper>
  );
}
