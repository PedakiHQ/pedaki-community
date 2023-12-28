import './globals.css';
import '@pedaki/design/tailwind/index.css';
import { BaseProvider } from '~/app/[locale]/baseProvider.tsx';
import DemoBanner from '~/components/DemoBanner/wrapper';
import type { LocaleCode } from '~/locales/server';
import { getStaticParams } from '~/locales/server';
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

export const generateMetadata = ({ params }: { params: { locale: LocaleCode } }) => {
  const locale = fixLocale(params.locale);
  setStaticParamsLocale(locale);

  return {
    openGraph: {
      locale: locale,
    },
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

  const cookieStore = cookies().get(COOKIE_NAME);
  const storeValue = cookieStore ? (JSON.parse(cookieStore.value) as GlobalStore) : {};

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BaseProvider>
        <GlobalStoreProvider {...storeValue}>
          <DemoBanner />
          <div className="relative h-full peer-data-[visible=true]:mt-12">
            <WorkspaceStoreProvider settings={settings}>{children}</WorkspaceStoreProvider>
          </div>
        </GlobalStoreProvider>
      </BaseProvider>
    </Suspense>
  );
}
