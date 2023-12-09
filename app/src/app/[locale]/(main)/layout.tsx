import AuthProvider from '~/app/[locale]/(main)/AuthProvider.tsx';
import LanguageSelector from '~/components/LanguageSelector';
import Logo from '~/components/logo.tsx';
import React from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
