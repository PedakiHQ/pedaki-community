import { authService } from '@pedaki/services/auth/auth.service';
import { TRPCError } from '@trpc/server';
import { adminData } from '~api/tests/helpers/base-user.ts';
import { getAnonymousSession, getUserSession } from '~api/tests/helpers/sessions.ts';
import { describe, expect, test } from 'vitest';

describe('authRouter', () => {
  const anonymousSession = getAnonymousSession();
  const userSession = getUserSession();

  describe('getUserInfoFromActivationToken', () => {
    test.each([anonymousSession, userSession])(
      'throws an error if the payload is invalid - $type',
      async ({ api }) => {
        // @ts-expect-error: we want to test the error
        await expect(() => api.auth.getUserInfoFromActivationToken({})).rejects.toThrowError(
          TRPCError,
        );
      },
    );

    test.each([anonymousSession, userSession])(
      'throws an error if the token is invalid - $type',
      async ({ api }) => {
        await expect(() =>
          api.auth.getUserInfoFromActivationToken({
            token: 'invalid-token',
          }),
        ).rejects.toThrowError(TRPCError);
      },
    );

    test.each([anonymousSession, userSession])(
      'returns the user info if the token is valid - $type',
      async ({ api }) => {
        const userEmail = adminData.email;
        const token = await authService.createToken(userEmail, 'ACTIVATE_ACCOUNT');
        const result = await api.auth.getUserInfoFromActivationToken({
          token,
        });
        expect(result).toEqual({
          email: userEmail,
          name: adminData.name,
        });
      },
    );
  });
});
