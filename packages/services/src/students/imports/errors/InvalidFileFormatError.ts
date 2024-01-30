import { TRPCError } from '@trpc/server';

export class InvalidFileFormatError extends TRPCError {
  constructor() {
    super({
      code: 'BAD_REQUEST',
      message: 'INVALID_FILE_FORMAT',
    });
  }
}
