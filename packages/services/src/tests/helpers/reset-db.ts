import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resetDb = async () => {
  if (process.env.DATABASE_URL?.includes('pedaki_test') === false) {
    throw new Error('resetDb should not be run on a non-test database');
  }

  await prisma.$transaction([prisma.user.deleteMany(), prisma.token.deleteMany()]);

  await prisma.$transaction([
    // create users
    prisma.user.create({
      data: {
        email: 'admin@pedaki.fr',
        name: 'Admin',
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user@pedaki.fr',
        name: 'User',
      },
    }),
  ]);
};

export default resetDb;
