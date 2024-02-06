import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newProperties = [
  {
    id: 1,
    name: 'Maths Level',
    type: 'LEVEL' as const,
  },
  {
    id: 2,
    name: 'English Level',
    type: 'LEVEL' as const,
  },
];

const fakeStudents = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  otherName: Math.random() > 0.5 ? faker.person.middleName() : null,
  birthDate: faker.date.past(),
  gender: Math.random() > 0.5 ? 'M' : 'F',
  properties: newProperties.reduce(
    (acc, property) => {
      acc[property.id] = faker.number.int({ min: 0, max: 20 });
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
    // to test the filter
    firstName: 'Nathan',
    lastName: 'Dupont',
    otherName: null,
    birthDate: new Date('2001-01-01'),
    properties: {
      ...baseStudent.properties,
      1: 15,
    },
  };

  await prisma.$transaction([
    prisma.$executeRawUnsafe('TRUNCATE TABLE users RESTART IDENTITY CASCADE'),
    prisma.$executeRawUnsafe('TRUNCATE TABLE tokens RESTART IDENTITY CASCADE'),
    prisma.$executeRawUnsafe('TRUNCATE TABLE properties RESTART IDENTITY CASCADE'),
    prisma.$executeRawUnsafe('TRUNCATE TABLE students RESTART IDENTITY CASCADE'),
    prisma.$executeRawUnsafe('TRUNCATE TABLE classes RESTART IDENTITY CASCADE'),
    prisma.$executeRawUnsafe('TRUNCATE TABLE class_branches RESTART IDENTITY CASCADE'),
    prisma.$executeRawUnsafe('TRUNCATE TABLE class_levels RESTART IDENTITY CASCADE'),
    prisma.$executeRawUnsafe('TRUNCATE TABLE academic_years RESTART IDENTITY CASCADE'),
    prisma.$executeRawUnsafe('TRUNCATE TABLE teachers RESTART IDENTITY CASCADE'),
    prisma.$executeRawUnsafe('TRUNCATE TABLE imports RESTART IDENTITY CASCADE'),
    prisma.$executeRawUnsafe('TRUNCATE TABLE import_students RESTART IDENTITY CASCADE'),
    prisma.$executeRawUnsafe('TRUNCATE TABLE import_classes RESTART IDENTITY CASCADE'),

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

    // Create academic years
    prisma.academicYear.createMany({
      data: [
        {
          name: '2021-2022',
          startDate: new Date('2021-09-01'),
          endDate: new Date('2022-06-30'),
        },
        {
          name: '2022-2023',
          startDate: new Date('2022-09-01'),
          endDate: new Date('2023-06-30'),
        },
      ],
    }),

    // Create branches
    prisma.classBranch.createMany({
      data: [
        {
          name: 'Info',
          color: '#FF0000',
        },
        {
          name: 'Maths',
          color: '#00FF00',
        },
      ],
    }),

    // Create levels
    prisma.classLevel.createMany({
      data: [
        {
          name: '6ème',
          color: '#0000FF',
        },
        {
          name: '5ème',
          color: '#0000FF',
        },
        {
          name: 'CE1',
          color: '#0000FF',
        },
        {
          name: 'CP',
          color: '#0000FF',
        },
      ],
    }),

    // // Create teachers
    prisma.teacher.createMany({
      data: [
        {
          name: 'Teacher 1',
        },
        {
          name: 'Teacher 2',
        },
        {
          name: 'Teacher 3',
        },
      ],
    }),

    // Create classes
    prisma.class.create({
      data: {
        name: '6ème A',
        description: 'Class A',
        // mainTeacher: {
        //     connect: {id: 1},
        // },
        level: {
          connect: { id: 1 },
        },
        academicYear: {
          connect: { id: 1 },
        },
        teachers: {
          connect: [{ id: 1 }, { id: 2 }],
        },
      },
    }),
    prisma.class.create({
      data: {
        name: '6ème B',
        description: 'Class B',
        mainTeacher: {
          connect: { id: 2 },
        },
        level: {
          connect: { id: 2 },
        },
        academicYear: {
          connect: { id: 1 },
        },
        teachers: {
          connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
        },
      },
    }),
    prisma.class.create({
      data: {
        name: '5ème A',
        description: 'Class A',
        mainTeacher: {
          connect: { id: 3 },
        },
        level: {
          connect: { id: 1 },
        },
        academicYear: {
          connect: { id: 2 },
        },
        teachers: {
          connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
        },
      },
    }),
    prisma.class.create({
      data: {
        name: 'CP Jobard',
        description: 'Class A',
        mainTeacher: {
          connect: { id: 3 },
        },
        level: {
          connect: { id: 4 },
        },
        academicYear: {
          connect: { id: 2 },
        },
        teachers: {
          connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
        },
      },
    }),

    // Create properties
    prisma.property.createMany({
      data: newProperties,
    }),

    // for the filter
    prisma.student.create({
      data: { ...newStudent, classes: { connect: { id: 2 } } },
    }),
    // Create students
    prisma.student.createMany({
      data: Array.from({ length: 200 }, fakeStudents),
    }),
  ]);
};

export default resetDb;
