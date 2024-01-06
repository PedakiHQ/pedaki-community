import { authService } from '@pedaki/services/auth/auth.service';
import { assertTrpcError, assertZodError } from '@pedaki/tests/error.js';
import { assertIsCurrentPassword, getCurrentUser } from '@pedaki/tests/user.js';
import { adminData } from '~api/tests/helpers/base-user.ts';
import { getAnonymousSession, getUserSession } from '~api/tests/helpers/sessions.ts';
import { describe, expect, test } from 'vitest';

const password = 'password';

describe('authRouter', () => {
  const anonymousSession = getAnonymousSession();
  const userSession = getUserSession();

  describe('getUserInfoFromActivationToken', () => {
    test.each([anonymousSession, userSession])(
      'throws an error if the payload is invalid - $type',
      async ({ api }) => {
        try {
          // @ts-expect-error: we want to test the error
          await api.auth.getUserInfoFromActivationToken({});
          expect.fail('should have thrown an error');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          assertZodError(e, [
            {
              path: ['token'],
              message: 'Required',
            },
          ]);
        }
      },
    );

    test.each([anonymousSession, userSession])(
      'throws an error if the token is invalid - $type',
      async ({ api }) => {
        try {
          await api.auth.getUserInfoFromActivationToken({
            token: 'invalid-token',
          });
          expect.fail('should have thrown an error');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          expect(e.message).toBe('USER_NOT_FOUND');
        }
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

  describe('activateAccount', () => {
    test.each([anonymousSession, userSession])(
      'throws an error if the payload is invalid - $type',
      async ({ api }) => {
        try {
          // @ts-expect-error: we want to test the error
          await api.auth.activateAccount({});
          expect.fail('should have thrown an error');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          assertZodError(e, [
            {
              path: ['token'],
              message: 'Required',
            },
            {
              path: ['email'],
              message: 'Required',
            },
            {
              path: ['password'],
              message: 'Required',
            },
          ]);
        }
      },
    );

    test.each([anonymousSession, userSession])(
      'throws an error if the token is invalid - $type',
      async ({ api }) => {
        try {
          await api.auth.activateAccount({
            token: 'invalid-token',
            email: adminData.email,
            password: password,
          });
          expect.fail('should have thrown an error');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          expect(e.message).toBe('USER_NOT_FOUND');
        }
      },
    );

    test.each([anonymousSession, userSession])(
      'throws an error if the email is not the same as the token - $type',
      async ({ api }) => {
        try {
          const token = await authService.createToken(adminData.email, 'ACTIVATE_ACCOUNT');
          await api.auth.activateAccount({
            token,
            email: 'invalid-email',
            password: password,
          });
          expect.fail('should have thrown an error');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          expect(e.message).toBe('INVALID_TOKEN');
        }
      },
    );

    test.each([anonymousSession, userSession])(
      'activates the account if the token is valid - $type',
      async ({ api }) => {
        const token = await authService.createToken(adminData.email, 'ACTIVATE_ACCOUNT');
        const initialPassword = (await getCurrentUser(adminData.email)).password;
        await api.auth.activateAccount({
          token,
          email: adminData.email,
          password: password,
        });
        const newPassword = (await getCurrentUser(adminData.email)).password;
        expect(initialPassword).not.toBe(newPassword);
        expect(newPassword).not.toBe(password); // hashed
        await assertIsCurrentPassword(adminData.email, password);
      },
    );

    test.each([anonymousSession, userSession])(
      'throws an error if the token is already used - $type',
      async ({ api }) => {
        try {
          const token = await authService.createToken(adminData.email, 'ACTIVATE_ACCOUNT');
          await api.auth.activateAccount({
            token,
            email: adminData.email,
            password: password,
          });
          await api.auth.activateAccount({
            token,
            email: adminData.email,
            password: password,
          });
          expect.fail('should have thrown an error');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          expect(e.message).toBe('USER_NOT_FOUND');
        }
      },
    );
  });

  describe('acceptInvite', () => {
    test.each([anonymousSession, userSession])(
      'throws an error if the payload is invalid - $type',
      async ({ api }) => {
        try {
          // @ts-expect-error: we want to test the error
          await api.auth.acceptInvite({});
          expect.fail('should have thrown an error');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          assertZodError(e, [
            {
              path: ['token'],
              message: 'Required',
            },
            {
              path: ['email'],
              message: 'Required',
            },
            {
              path: ['password'],
              message: 'Required',
            },
            {
              path: ['name'],
              message: 'Required',
            },
          ]);
        }
      },
    );

    test.each([anonymousSession, userSession])(
      'throws an error if the token is invalid - $type',
      async ({ api }) => {
        try {
          await api.auth.acceptInvite({
            token: 'invalid-token',
            email: adminData.email,
            password: password,
            name: 'name',
          });
          expect.fail('should have thrown an error');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          expect(e.message).toBe('USER_NOT_FOUND');
        }
      },
    );

    test.each([anonymousSession, userSession])(
      'throws an error if the email is not the same as the token - $type',
      async ({ api }) => {
        try {
          const token = await authService.createToken(adminData.email, 'ACTIVATE_ACCOUNT');
          await api.auth.acceptInvite({
            token,
            email: 'invalid-email',
            password: password,
            name: 'name',
          });
          expect.fail('should have thrown an error');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          expect(e.message).toBe('INVALID_TOKEN');
        }
      },
    );

    test.each([anonymousSession, userSession])(
      'activates the account if the token is valid - $type',
      async ({ api }) => {
        const token = await authService.createToken(adminData.email, 'ACTIVATE_ACCOUNT');
        const initialUser = await getCurrentUser(adminData.email);
        await api.auth.acceptInvite({
          token,
          email: adminData.email,
          password: password,
          name: 'name',
        });
        const newUser = await getCurrentUser(adminData.email);
        expect(newUser.password).not.toBe(initialUser.password);
        expect(newUser.password).not.toBe(password); // hashed
        await assertIsCurrentPassword(adminData.email, password);

        expect(newUser.name).not.toBe(initialUser.name);
        expect(newUser.name).toBe('name');
      },
    );

    test.each([anonymousSession, userSession])(
      'throws an error if the token is already used - $type',
      async ({ api }) => {
        try {
          const token = await authService.createToken(adminData.email, 'ACTIVATE_ACCOUNT');
          await api.auth.acceptInvite({
            token,
            email: adminData.email,
            password: password,
            name: 'name',
          });
          await api.auth.acceptInvite({
            token,
            email: adminData.email,
            password: password,
            name: 'name',
          });
          expect.fail('should have thrown an error');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          expect(e.message).toBe('USER_NOT_FOUND');
        }
      },
    );
  });
});
