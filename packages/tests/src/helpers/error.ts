import { TRPCError } from '@trpc/server';
import type { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';
import { expect } from 'vitest';
import type { ZodIssue } from 'zod';

export const assertTrpcError = (
  error: unknown,
  code: TRPC_ERROR_CODE_KEY,
): asserts error is TRPCError => {
  expect(error).toBeInstanceOf(TRPCError);

  const trpcError = error as TRPCError;

  expect(trpcError.code).toBe(code);
};

export const assertZodError = (
  error: TRPCError,
  errors: (Partial<ZodIssue> & Pick<ZodIssue, 'path'>)[],
): void => {
  const message = error.message;
  // if zod error this is a json array
  expect(message[0]).toBe('[');
  const zodErrors = JSON.parse(message) as ZodIssue[];
  expect(zodErrors.length).toBe(Object.keys(errors).length);

  for (const error of zodErrors) {
    const expectedError = errors.find(e => e.path[0] === error.path[0]); // TODO: other paths?
    expect(expectedError).toBeDefined();
    expect(error).toEqual(expect.objectContaining(expectedError));
  }
};
