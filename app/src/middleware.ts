import { locales } from '~/locales/shared';
import { withAuth } from 'next-auth/middleware';
import { createI18nMiddleware } from 'next-international/middleware';
import type { NextFetchEvent, NextRequest } from 'next/server';

const I18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale: 'fr',
  urlMappingStrategy: 'rewriteDefault',
});

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const locale = request.cookies.get('Next-Locale')?.value ?? 'fr';

  const authMiddleware = withAuth(
    function middleware(req) {
      return I18nMiddleware(req);
    },
    {
      pages: {
        signIn: `/${locale}/login`,
      },
    },
  );
  // @ts-expect-error
  return authMiddleware(request, event);
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next).*)'],
};
