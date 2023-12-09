import { auth } from '@pedaki/auth/edge.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { locales } from '~/locales/shared';
import { createI18nMiddleware } from 'next-international/middleware';
import {NextResponse  } from 'next/server';
import type {NextRequest} from 'next/server';

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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let localePath = pathname.split('/', 2)[1] as LocaleCode | undefined;
  localePath = localePath && locales.includes(localePath) ? localePath : undefined;

  const locale = request.cookies.get('Next-Locale')?.value ?? localePath ?? 'fr';

  const pathnameWithoutLocale = localePath ? pathname.replace(`/${localePath}`, '') : pathname;

  const isInWithoutAuth = withoutAuth.includes(pathnameWithoutLocale);
  if (isInWithoutAuth) {
    // Check if the user is already logged in, if that's the case redirect to the homepage
    const user = await auth();
    if(user) {
      return NextResponse.redirect(new URL(`/${locale}?error=AlreadyLogged`, request.nextUrl));
    }

    return i18nMiddleware(request);
  }

  const user = await auth();
  if (!user) {
    // If no user, redirect to login page
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.nextUrl));
  }
  return i18nMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next).*)'],
};
