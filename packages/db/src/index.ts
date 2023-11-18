import { PrismaClient } from '@prisma/client';
import { fieldEncryptionExtension } from 'prisma-field-encryption';
import { env } from './env.ts';

const prismaClientSingleton = () => {
  let client = new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn', 'info'] : ['error'],
  });
  if (env.PRISMA_ENCRYPTION_KEY) {
    console.log('Using field encryption');
    client = client.$extends(
      fieldEncryptionExtension({
        encryptionKey: env.PRISMA_ENCRYPTION_KEY,
      }),
    ) as PrismaClient;
  }
  return client;
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
