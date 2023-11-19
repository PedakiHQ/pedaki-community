import type { DefaultSession, NextAuthOptions } from 'next-auth';
import { env } from './env';

declare module 'next-auth' {
  interface Session {
    user: {
      image: string;
      name: string;
      email: string;
      id: string;
      emailVerified: boolean;
    } & DefaultSession['user'];
  }

  // Database results (also the output type of the `authorize`, `profile` callback)
  interface User {
    id: string;
    image: string;
    email: string;
    name: string;
    emailVerified: Date | null;
  }
}

declare module 'next-auth/jwt' {
  // Globally the same thing, this is the output type of the `jwt` callback
  // One main difference is the picture field which corresponds to the user's image field
  interface JWT {
    name: string;
    email: string;
    id: string;
    emailVerified: boolean;
    picture: string;
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
} satisfies NextAuthOptions;