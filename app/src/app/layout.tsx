import { FAVICON_URL, LOGO_URL } from '~/constants.ts';
import { env } from '~/env.ts';
import { fallbackLocale, locales } from '~/locales/shared';
import { fetchSettings } from '~/settings/fetch.ts';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const generateMetadata = async () => {
  const settings = await fetchSettings();

  return {
    metadataBase: new URL(`https://${env.NEXT_PUBLIC_PEDAKI_HOSTNAME}`),
    title: {
      template: `%s - ${settings.name}`,
      default: settings.name,
    },
    description: 'TODO description',
    applicationName: settings.name,
    robots: 'noindex, nofollow',
    alternates: {
      canonical: '/',
      languages: {
        'x-default': '/',
        ...locales.reduce(
          (acc, locale) => {
            acc[locale] = settings.defaultLanguage === locale ? '/' : `/${locale}`;
            return acc;
          },
          {} as Record<string, string>,
        ),
      },
    },
    icons: [
      { rel: 'icon', type: 'image/png', sizes: '32x32', url: FAVICON_URL },
      { rel: 'apple-touch-icon', type: 'image/png', sizes: '192x192', url: LOGO_URL },
    ],
  };
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // TODO: not possible atm, but we should change the lang to the current locale
  return (
    <html lang={fallbackLocale} dir="ltr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
