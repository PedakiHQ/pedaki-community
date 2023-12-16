import './globals.css';
import '@pedaki/design/tailwind/index.css';
import { Providers } from '~/app/[locale]/providers';
import { getI18n, getStaticParams } from '~/locales/server';
import type { LocaleCode } from '~/locales/server';
import { locales } from '~/locales/shared';
import { fixLocale } from '~/locales/utils';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';
import React from 'react';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  const locale = fixLocale(params.locale);
  setStaticParamsLocale(locale);
  const t = await getI18n();

  return {
    title: {
      template: `%s - ${t('metadata.title')}`,
      default: t('metadata.title'),
    },
    description: t('metadata.description'),
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

export default function Layout({
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

  return <Providers locale={locale}>{children}</Providers>;
}
