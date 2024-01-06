import { TRPCError } from '@trpc/server';

export class InvalidTokenError extends TRPCError {
  constructor() {
    super({
      code: 'BAD_REQUEST',
      message: 'INVALID_TOKEN',
    });
  }
}
