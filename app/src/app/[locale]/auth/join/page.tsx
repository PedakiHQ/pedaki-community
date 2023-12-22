import AuthWrapper from '~/app/[locale]/auth/auth-wrapper.tsx';
import JoinForm from '~/app/[locale]/auth/join/join-form.tsx';
import type { PageType } from '~/app/types.ts';
import AuthErrorPage from '~/components/ErrorPage/AuthErrorPage.tsx';
import { setStaticParamsLocale } from '~/locales/utils';
import { api } from '~/server/clients/server';
import { getWorkspaceSettings } from '~/settings';
import React from 'react';

export default async function AcceptInvitePage({
  params,
  searchParams,
}: PageType & { searchParams: Record<string, unknown> }) {
  setStaticParamsLocale(params.locale);

  const token = searchParams.token as string;
  if (!token) {
    // TODO: render error page with custom message
    return <AuthErrorPage />;
  }
  const settings = await getWorkspaceSettings();
  const userData = await api.auth.getUserInfoFromActivationToken.query({ token });

  return (
    <AuthWrapper
      title={`Tu as été invité à rejoindre ${settings.NAME}`}
      description="Avant d'accéder au workspace, choisis un mot de passe"
    >
      <JoinForm email={userData.email} token={token} />
    </AuthWrapper>
  );
}
