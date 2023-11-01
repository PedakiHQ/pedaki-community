import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '~/app/[locale]/providers';
import { getI18n, getStaticParams } from '~/locales/server';

const inter = Inter({ subsets: ['latin'] });

export const generateMetadata = async () => {
  const t = await getI18n();

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
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
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
