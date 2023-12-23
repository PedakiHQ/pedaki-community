import { TRPCError } from '@trpc/server';

export class DisabledInDemoError extends TRPCError {
  constructor() {
    super({
      code: 'UNAUTHORIZED',
      message: 'DISABLED_IN_DEMO',
    });
  }
}
