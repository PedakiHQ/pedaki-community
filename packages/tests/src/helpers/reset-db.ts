import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resetDb = async () => {
  if (process.env.DATABASE_URL?.includes('pedaki_test') === false) {
    throw new Error('resetDb should not be run on a non-test database');
  }

  const newSettings = {
    name: process.env.NEXT_PUBLIC_PEDAKI_NAME ?? 'Pedaki',
    defaultLanguage: 'fr',
  };

  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.token.deleteMany(),
    prisma.workspaceSetting.deleteMany(),

    // create users
    prisma.user.createMany({
      data: [
        {
          email: 'admin@pedaki.fr',
          name: 'Admin',
          emailVerified: new Date(),
        },
        {
          email: 'user@pedaki.fr',
          name: 'User',
        },
      ],
    }),

    prisma.workspaceSetting.upsert({
      where: { id: 1 }, // we only have one row
      update: newSettings,
      create: newSettings,
    }),
  ]);
};

export default resetDb;
