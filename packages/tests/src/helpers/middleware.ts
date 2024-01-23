import { expect } from 'vitest';
import { assertTrpcError } from './error.ts';

export const assertIsInternal = async (
  method: () => Promise<any>,
  options: {
    isLogged: boolean;
    shouldWork?: boolean;
  },
) => {
  try {
    await method();
  } catch (e) {
    assertTrpcError(e, 'UNAUTHORIZED');
    if (options.isLogged) {
      expect(e.message).toBe('MISSING_SECRET');
    } else {
      expect(e.message).toBe('AUTHENTICATION_REQUIRED');
    }
    return;
  }

  if (options.shouldWork === false) {
    expect.fail('Expected an error to be thrown');
  }
};

export const assertIsAuthenticated = async (
  method: () => Promise<any>,
  options: {
    shouldWork?: boolean;
  },
) => {
  try {
    await method();
  } catch (e) {
    assertTrpcError(e, 'UNAUTHORIZED');
    expect(e.message).toBe('AUTHENTICATION_REQUIRED');
    return;
  }

  if (options.shouldWork === false) {
    expect.fail('Expected an error to be thrown');
  }
};
