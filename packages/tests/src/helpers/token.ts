import { prisma } from '@pedaki/db';
import type { TokenType } from '@prisma/client';

export const getTokenCount = async (email: string, type: TokenType | undefined) => {
  return await prisma.token.count({
    where: {
      user: { email },
      type: type,
    },
  });
};
