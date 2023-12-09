import type { NextAuthConfig } from 'next-auth';
import { env } from './env';

declare module 'next-auth' {
  interface User {
    id: string;
    image: string;
    email: string;
    name: string;
    emailVerified: Date | null;
  }
}

const useSecureCookies = process.env.NODE_ENV === 'production';

export const baseAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  debug: env.NODE_ENV !== 'production',
  useSecureCookies: useSecureCookies,
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        domain: env.NODE_ENV === 'production' ? '.pedaki.fr' : undefined,
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
