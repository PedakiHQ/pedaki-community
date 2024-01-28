// @ts-nocheck
// TODO: fix auth types

import type { NextAuthConfig } from 'next-auth';
import { env } from './env';

declare module '@auth/core/types' {
  /**
   * Returned by `auth`, contains information about the active session.
   */
  interface Session {
    user: {
      image: string;
      name: string;
      email: string;
      id: string;
      emailVerified: boolean;
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    } & DefaultSession['user'];
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string;
    // @ts-expect-error: in our case it's always a string
    image: string;
    // @ts-expect-error: in our case it's always a string
    email: string;
    // @ts-expect-error: in our case it's always a string
    name: string;
    emailVerified: boolean;
  }
}

declare module '@auth/core/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    name: string;
    email: string;
    id: string;
    emailVerified: boolean;
    picture: string;
  }
}

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
