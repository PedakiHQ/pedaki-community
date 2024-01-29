import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
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
    } & DefaultSession['user'];
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string;
    image: string;
    email: string;
    name: string;
    emailVerified: boolean;
  }

  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Account {}
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    name: string;
    email: string;
    id: string;
    emailVerified: boolean;
    picture: string;
  }
}
