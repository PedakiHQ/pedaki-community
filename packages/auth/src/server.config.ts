import { PrismaAdapter } from '@auth/prisma-adapter';
import { matchPassword } from '@pedaki/common/utils/hash';
import { prisma } from '@pedaki/db';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { env } from './env.ts';
import { baseAuthOptions } from './index.ts';

export const authOptions: NextAuthConfig = {
  ...baseAuthOptions,
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth/login', // Error code passed in query string as ?error=
    verifyRequest: '/',
    newUser: '/',
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt: ({ token, user, trigger, session }) => {
      // console.log('JWT Callback', { token, user, trigger, session })
      if (user) {
        token.emailVerified = user.emailVerified !== null;
      }

      if (trigger === 'update' && session) {
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
      // Called every time a session is checked
      // console.log("Session Callback", { session, token })

      session.user = {
        ...session.user,
        emailVerified: token.emailVerified,
      };

      return session;
    },
    signIn: () => {
      // Use the signIn() callback to control if a user is allowed to sign in.
      // console.log('Sign In Callback', { user, account });

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
            email: credentials.email as string,
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            emailVerified: true,
            password: true,
          },
        });

        if (!user?.password) {
          return null;
        }

        const passwordMatch = matchPassword(
          credentials.password as string,
          user.password,
          env.PASSWORD_SALT,
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: !!user.emailVerified,
        };
      },
    }),
  ],
};
