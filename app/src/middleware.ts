import { auth } from '@pedaki/auth/edge.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { fallbackLocale, locales } from '~/locales/shared';
import { fetchSettings } from '~/settings/fetch.ts';
import { createI18nMiddleware } from 'next-international/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const I18nMiddlewareCache = new Map<string, ReturnType<typeof createI18nMiddleware>>();

const getI18nMiddleware = (locale: LocaleCode) => {
  if (!I18nMiddlewareCache.has(locale)) {
    const I18nMiddleware = createI18nMiddleware({
      locales,
      defaultLocale: locale,
      urlMappingStrategy: 'rewriteDefault',
    });
    I18nMiddlewareCache.set(locale, I18nMiddleware);
  }

  return I18nMiddlewareCache.get(locale)!;
};

const withoutAuth = [
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/login',
  '/auth/activate',
  '/auth/join',
];

const i18nMiddleware = async function middleware(req: NextRequest) {
  const settings = await fetchSettings();
  let locale = settings.defaultLanguage;
  if (!locale || !locales.includes(locale as LocaleCode)) {
    locale = fallbackLocale;
  }

  if (!req.cookies.get('Next-Locale')) {
    // Workaround to have to cookie available in the first request
    req.cookies.set('Next-Locale', locale);
  }

  return getI18nMiddleware(locale as LocaleCode)(req);
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let localePath = pathname.split('/', 2)[1] as LocaleCode | undefined;
  localePath = localePath && locales.includes(localePath) ? localePath : undefined;

  const locale = request.cookies.get('Next-Locale')?.value ?? localePath ?? fallbackLocale;

  const pathnameWithoutLocale = localePath ? pathname.replace(`/${localePath}`, '') : pathname;

  try {
    const isInWithoutAuth = withoutAuth.includes(pathnameWithoutLocale);
    if (isInWithoutAuth) {
      // Check if the user is already logged in, if that's the case redirect to the homepage
      const user = await auth();
      if (user) {
        return NextResponse.redirect(new URL(`/${locale}?error=AlreadyLogged`, request.nextUrl));
      }

      return i18nMiddleware(request);
    }

    const user = await auth();
    if (!user || typeof user === 'string') {
      // If no user, redirect to login page
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.nextUrl));
    }

    return i18nMiddleware(request);
  } catch (error) {
    return NextResponse.error();
  }
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next).*)'],
};
