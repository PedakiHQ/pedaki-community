import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newProperties = [
  {
    name: 'math_level',
    type: 'LEVEL' as const,
  },
  {
    name: 'english_level',
    type: 'LEVEL' as const,
  },
];

const fakeStudents = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  otherName: Math.random() > 0.5 ? faker.person.middleName() : null,
  birthDate: faker.date.past(),
  properties: newProperties.reduce(
    (acc, property) => {
      acc[property.name] = faker.number.int({ min: 0, max: 20 });
      return acc;
    },
    {} as Record<string, any>,
  ),
});

const resetDb = async () => {
  if (process.env.DATABASE_URL?.includes('pedaki_test') === false) {
    throw new Error('resetDb should not be run on a non-test database');
  }

  const newSettings = {
    name: process.env.NEXT_PUBLIC_PEDAKI_NAME ?? 'Pedaki',
    defaultLanguage: 'fr',
  };

  const baseStudent = fakeStudents();
  const newStudent = {
    ...baseStudent,
    id: 1,
    // to test the filter
    firstName: 'Nathan',
    lastName: 'Dupont',
    otherName: null,
    birthDate: new Date('2001-01-01'),
    properties: {
      ...baseStudent.properties,
      math_level: 15,
    },
  };

  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.token.deleteMany(),
    prisma.property.deleteMany(),
    prisma.student.deleteMany(),

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

    // Create students
    // properties
    prisma.property.createMany({
      data: newProperties,
    }),
    prisma.student.createMany({
      data: Array.from({ length: 200 }, fakeStudents),
    }),
    prisma.student.upsert({
      where: { id: 1 },
      update: newStudent,
      create: newStudent,
    }),
  ]);
};

export default resetDb;
