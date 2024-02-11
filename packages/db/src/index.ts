import { logger } from '@pedaki/logger';
import PrismaClientPkg from '@prisma/client';
import { pagination } from 'prisma-extension-pagination';
import { fieldEncryptionExtension } from 'prisma-field-encryption';
import { env } from './env.ts';

const PrismaClient = PrismaClientPkg.PrismaClient;

const prismaClientSingleton = () => {
  let client = new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn', 'info'] : ['error'],
  }).$extends(
    pagination({
      pages: {
        limit: 30,
        includePageCount: true,
      },
    }),
  );

  if (env.PRISMA_ENCRYPTION_KEY && !env.PRISMA_ENCRYPTION_KEY.startsWith('{{{')) {
    client = client.$extends(
      fieldEncryptionExtension({
        encryptionKey: env.PRISMA_ENCRYPTION_KEY,
        decryptionKeys:
          env.PRISMA_DECRYPTION_KEY && !env.PRISMA_DECRYPTION_KEY.startsWith('{{{')
            ? [env.PRISMA_DECRYPTION_KEY]
            : undefined,
      }),
    );
  }

  logger.debug('Created Prisma client', {
    withEncryption: !!env.PRISMA_ENCRYPTION_KEY,
    withDecryption: !!env.PRISMA_DECRYPTION_KEY,
  });

  return client;
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
