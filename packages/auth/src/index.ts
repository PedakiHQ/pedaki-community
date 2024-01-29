import type { NextAuthConfig } from 'next-auth';
import { env } from './env';

const useSecureCookies = env.NODE_ENV === 'production';
const cookiePrefix = useSecureCookies ? '__Secure-' : '';

export const baseAuthOptions = {
  secret: env.AUTH_SECRET,
  debug: env.NODE_ENV !== 'production',
  useSecureCookies: useSecureCookies,
  trustHost: true,
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        domain: env.NODE_ENV === 'production' ? env.NEXT_PUBLIC_PEDAKI_HOSTNAME : undefined,
        secure: useSecureCookies,
      },
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [],
} satisfies NextAuthConfig;
