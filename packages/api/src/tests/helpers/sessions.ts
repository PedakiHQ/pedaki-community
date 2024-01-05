import { userData } from '~api/tests/helpers/base-user.ts';
import type { Caller } from './create-session';
import { createCallerSession } from './create-session';

export interface TestSession {
  api: Caller;
  type: 'anonymousUserSession' | 'userSession';
}

let anonymousUserSession: Caller | null = null;
let userSession: Caller | null = null;
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

export { getAnonymousSession, getUserSession };
