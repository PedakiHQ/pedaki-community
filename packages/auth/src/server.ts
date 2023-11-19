import { PrismaAdapter } from '@auth/prisma-adapter';
import { matchPassword } from '@pedaki/common/utils/hash';
import { prisma } from '@pedaki/db';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { env } from './env.ts';
import { baseAuthOptions } from './index.ts';

export const authOptions: NextAuthOptions = {
  ...baseAuthOptions,
  pages: {
    signIn: '/auth/login',
    error: '/auth/login', // Error code passed in query string as ?error=
  },
  // @ts-expect-error - The type from next-auth and @auth/prisma-adapter are incompatible
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt: ({ token, user, trigger, session }) => {
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified !== null;
      }

      if (trigger === 'update') {
        // TODO: Check type of session
        // We are only expecting the user.emailVerified property to be updated (confirm-email)
        const checkedSession = session as {
          user: { emailVerified: boolean };
        };
        if (checkedSession.user.emailVerified) {
          token.emailVerified = checkedSession.user.emailVerified;
        }
      }

      return token;
    },
    session: ({ session, token }) => {
      // console.log("Session Callback", { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          emailVerified: token.emailVerified,
        },
      };
    },
    signIn: ({ user, account }) => {
      console.log('Sign In Callback', { user, account });

      // TODO check spam email

      return true;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {},
        password: {},
        mfa: {},
      },
      async authorize(credentials) {
        // TODO: check mfa
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user?.password) {
          return null;
        }

        const passwordMatch = matchPassword(credentials.password, user.password, env.PASSWORD_SALT);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
};

export const auth = () => {
  return getServerSession(authOptions);
};