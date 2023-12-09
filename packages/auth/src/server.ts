import NextAuth from 'next-auth';
import { authOptions } from './server.config.ts';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(authOptions);
