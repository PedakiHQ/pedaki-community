import { Inter } from 'next/font/google';
import './globals.css';
import '@pedaki/design/tailwind/index.css';
import { Providers } from '~/app/[locale]/providers';
import { getI18n, getStaticParams } from '~/locales/server';
import type { LocaleCode } from '~/locales/server';
import { fallbackLocale, locales } from '~/locales/shared';
import { notFound } from 'next/navigation';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  const locale = locales.includes(params.locale) ? params.locale : fallbackLocale;

  return {
    title: {
      template: '%s - Pedaki',
      default: 'Pedaki',
    },
    description: 'todo',
    openGraph: {
      title: 'Pedaki',
      description: 'todo',
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

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: LocaleCode };
}) {
  if (!locales.includes(locale)) {
    return notFound();
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
