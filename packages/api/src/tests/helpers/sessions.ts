import { userData } from '~api/tests/helpers/base-user.ts';
import type { Caller } from './create-session';
import { createCallerSession } from './create-session';

export interface TestSession {
  api: Caller;
  type: 'anonymousUserSession' | 'userSession' | 'internalSession';
}

let anonymousUserSession: Caller | null = null;
let userSession: Caller | null = null;
let internalSession: Caller | null = null;
// let adminSession: Caller | null = null;

const getAnonymousSession = (): TestSession => {
  if (!anonymousUserSession) {
    anonymousUserSession = createCallerSession(null);
  }

  return { api: anonymousUserSession, type: 'anonymousUserSession' };
};

const getUserSession = (): TestSession => {
  if (!userSession) {
    userSession = createCallerSession({
      user: userData,
      expires: new Date().toISOString(),
    });
  }

  return {
    api: userSession,
    type: 'userSession',
  };
};

const getInternalSession = (): TestSession => {
  if (!internalSession) {
    const headers = new Headers();
    headers.set('x-pedaki-secret', process.env.API_INTERNAL_SECRET!);
    internalSession = createCallerSession(
      {
        user: userData,
        expires: new Date().toISOString(),
      },
      headers,
    );
  }

  return {
    api: internalSession,
    type: 'internalSession',
  };
};

export { getAnonymousSession, getUserSession, getInternalSession };
