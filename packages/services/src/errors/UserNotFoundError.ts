import { TRPCError } from '@trpc/server';

export class UserNotFoundError extends TRPCError {
  constructor() {
    super({
      code: 'BAD_REQUEST',
      message: 'USER_NOT_FOUND',
    });
  }
}
