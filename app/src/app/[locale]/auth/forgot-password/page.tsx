import AuthWrapper from '~/app/[locale]/auth/auth-wrapper.tsx';
import type { PageType } from '~/app/types.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import React from 'react';

export default function ForgotPasswordPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);

  return (
    <AuthWrapper title="Mot de passe oublié" description="todo">
      TODO
    </AuthWrapper>
  );
}
