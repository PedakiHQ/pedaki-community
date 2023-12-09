import type { LocaleCode } from '~/locales/server.ts';
import { locales } from '~/locales/shared';
import { withAuth } from 'next-auth/middleware';
import { createI18nMiddleware } from 'next-international/middleware';
import type { NextFetchEvent, NextRequest } from 'next/server';

const I18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale: 'fr',
  urlMappingStrategy: 'rewriteDefault',
});

const withoutAuth = [
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/login',
  '/auth/activate',
];

const i18nMiddleware = function middleware(req: NextRequest) {
  return I18nMiddleware(req);
};

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;
  let localePath = pathname.split('/', 2)[1] as LocaleCode | undefined;
  localePath = localePath && locales.includes(localePath) ? localePath : undefined;

  const locale =
    request.cookies.get('Next-Locale')?.value ??
    (localePath && locales.includes(localePath) ? localePath : 'fr');

  const pathnameWithoutLocale = localePath ? pathname.replace(`/${localePath}`, '') : pathname;

  if (withoutAuth.includes(pathnameWithoutLocale)) {
    return i18nMiddleware(request);
  }

  const authMiddleware = withAuth(i18nMiddleware, {
    pages: {
      signIn: `/${locale}/auth/login`,
    },
  });
  // @ts-expect-error: Event type is buggy
  return authMiddleware(request, event);
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next).*)'],
};
