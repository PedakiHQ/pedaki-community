import { logger } from '@pedaki/logger';
import { PrismaClient } from '@prisma/client';
import { fieldEncryptionExtension } from 'prisma-field-encryption';
import { env } from './env.ts';

const prismaClientSingleton = () => {
  let client = new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn', 'info'] : ['error'],
  });

  if (env.PRISMA_ENCRYPTION_KEY) {
    client = client.$extends(
      fieldEncryptionExtension({
        encryptionKey: env.PRISMA_ENCRYPTION_KEY,
        decryptionKeys: env.PRISMA_DECRYPTION_KEYS?.filter(Boolean),
      }),
    ) as PrismaClient;
  }
  logger.debug('Created Prisma client', {
    withEncryption: !!env.PRISMA_ENCRYPTION_KEY,
    decryptionKeysLength: env.PRISMA_DECRYPTION_KEYS?.length ?? 'undefined',
  });

  return client;
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
