import './globals.css';
import '@pedaki/design/tailwind/index.css';
import { BaseProvider } from '~/app/[locale]/baseProvider.tsx';
import type { LocaleCode } from '~/locales/server';
import { getI18n, getStaticParams } from '~/locales/server';
import { locales } from '~/locales/shared';
import { fixLocale } from '~/locales/utils';
import { getWorkspaceSettings } from '~/settings';
import { COOKIE_NAME } from '~/store/global/constants.ts';
import type { GlobalStore } from '~/store/global/global.store.ts';
import GlobalStoreProvider from '~/store/global/StoreProvider.tsx';
import WorkspaceStoreProvider from '~/store/workspace/StoreProvider.tsx';
import { setStaticParamsLocale } from 'next-international/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  const locale = fixLocale(params.locale);
  setStaticParamsLocale(locale);
  const t = await getI18n();

  return {
    title: {
      template: `%s - ${t('metadata.title')}`,
      default: t('metadata.title'),
    },
    openGraph: {
      locale: locale,
    },
    icons: [
      { rel: 'icon', url: 'https://static.pedaki.fr/logo/favicon.ico' },
      { rel: 'apple-touch-icon', url: 'https://static.pedaki.fr/logo/apple-touch-icon.png' },
      { rel: 'mask-icon', url: 'https://static.pedaki.fr/logo/favicon.ico' },
      { rel: 'image/x-icon', url: 'https://static.pedaki.fr/logo/favicon.ico' },
    ],
  };
};

export function generateStaticParams() {
  return getStaticParams();
}

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: LocaleCode };
}) {
  if (!locales.includes(locale)) {
    notFound();
    return null;
  }

  const settings = await getWorkspaceSettings();
  console.log('layout', { settings });

  const cookieStore = cookies().get(COOKIE_NAME);
  const storeValue = cookieStore ? (JSON.parse(cookieStore.value) as GlobalStore) : {};

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BaseProvider>
        <GlobalStoreProvider {...storeValue}>
          <WorkspaceStoreProvider settings={settings}>{children}</WorkspaceStoreProvider>
        </GlobalStoreProvider>
      </BaseProvider>
    </Suspense>
  );
}
