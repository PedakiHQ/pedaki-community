import { fallbackLocale } from '~/locales/shared';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // TODO: not possible atm, but we should change the lang to the current locale
  return (
    <html lang={fallbackLocale} dir="ltr" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
