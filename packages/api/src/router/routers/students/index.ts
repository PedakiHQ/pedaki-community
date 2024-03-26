import { prisma } from '@pedaki/db';
import { preparePagination } from '@pedaki/services/shared/utils.js';
import { studentPropertiesService } from '@pedaki/services/students/properties/properties.service';
import type { Field } from '@pedaki/services/students/query.model.client';
import { studentQueryService } from '@pedaki/services/students/query.service.js';
import {
  GetManyStudentsByIdInputSchema,
  GetManyStudentsByIdOutputSchema,
  GetManyStudentsInputSchema,
  GetManyStudentsOutputSchema,
  StudentSchema,
  UpdateOneStudentInputSchema,
} from '@pedaki/services/students/student.model.js';
import type { Student } from '@pedaki/services/students/student.model.js';
import { studentImports } from '~api/router/routers/students/imports';
import { studentPropertiesRouter } from '~api/router/routers/students/properties';
import { privateProcedure, router } from '~api/router/trpc.ts';
import { unflatten } from 'flat';

export const studentsRouter = router({
  properties: studentPropertiesRouter,
  imports: studentImports,

  getMany: privateProcedure
    .input(GetManyStudentsInputSchema)
    .output(GetManyStudentsOutputSchema)
    .query(async ({ input }) => {
      const baseFields = input.fields.filter(field => !field.startsWith('class.'));
      const joinFields = input.fields.filter(field => field.startsWith('class.'));

      const queryData = studentQueryService.buildSelectPreparedQuery(input, {
        selectFields: baseFields,
      });
      const queryCount = studentQueryService.buildSelectPreparedQuery(input, {
        selectFields: ['count'],
      });

      const [data, meta] = await prisma.$transaction([
        prisma.$queryRawUnsafe<{ id: number; [key: string]: any }[]>(queryData),
        prisma.$queryRawUnsafe<{ count: BigInt }[]>(queryCount),
      ]);

      let joinData: { id: number; [key: string]: any }[] | null = null;
      if (joinFields.length > 0) {
        const ids = data.map(student => student.id);
        const queryJoin = studentQueryService.buildSelectJoinQuery(input, ids);
        if (queryJoin !== null) {
          joinData = await prisma.$queryRawUnsafe<{ id: number; [key: string]: any }[]>(queryJoin);
        }
      }

      const pagination = preparePagination(
        Number(meta[0]!.count),
        input.pagination.page,
        input.pagination.limit,
      );

      const finalData = data.map(student => {
        const data = Object.entries(student);
        // properties starts with properties.
        const properties = data.filter(([key]) => key.startsWith('properties.'));
        const otherData = data.filter(([key]) => !key.startsWith('properties.'));
        const joinDataStudent = joinData?.filter(joinStudent => joinStudent.id === student.id);
        const joinDataStudentMap = joinDataStudent?.reduce(
          (acc, curr) => {
            Object.entries(curr).forEach(([key, value]) => {
              if (key.startsWith('class.teachers')) {
                const subKey = key.split('class.teachers.', 2)[1];
                if (!subKey) return;

                if (acc['class.teachers'] === undefined) {
                  acc['class.teachers'] = [];
                }
                const teacherArray = acc['class.teachers'] as Record<string, any>[];

                const index = teacherArray.length;

                if (teacherArray[index] === undefined) {
                  teacherArray[index] = {};
                }
                const teacherObject = teacherArray[index]!;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                teacherObject[subKey] = value;
              } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                acc[key] = value;
              }
            });
            return acc;
          },
          {} as Record<string, any>,
        );
        const classData = joinDataStudentMap
          ? Object.entries(joinDataStudentMap).filter(([key]) => key.startsWith('class.'))
          : [];
        return {
          id: student.id,
          ...Object.fromEntries(otherData),
          properties: Object.fromEntries(
            properties.map(([key, value]) => [key.split('properties.', 2)[1], value]),
          ) as Record<string, any>,
          class: Object.fromEntries(
            classData.map(([key, value]) => [key.split('class.', 2)[1], value]),
          ) as Record<string, any>,
        };
      });

      const withoutDuplicates = finalData.filter(
        (value, index, self) => index === self.findIndex(obj => obj.id === value.id),
      );

      return {
        data: withoutDuplicates,
        meta: pagination,
      };
    }),

  getManyById: privateProcedure
    .input(GetManyStudentsByIdInputSchema)
    .output(GetManyStudentsByIdOutputSchema)
    .query(async ({ input }) => {
      const fields = (
        studentPropertiesService.getPropertiesKeys().map(id => `properties.${id}`) as Field[]
      ).concat('firstName', 'lastName', 'otherName', 'birthDate', 'gender');
      let queryData = studentQueryService.buildSelectPreparedQuery(
        {
          fields,
          pagination: {
            page: 0,
            limit: -1,
          },
        },
        {
          selectFields: fields,
          groupBy: '',
        },
      );
      queryData += ` WHERE students.id in (${input.where.join(',')})`;

      const data = await prisma.$queryRawUnsafe<{ id: number; [key: string]: any }[]>(queryData);

      return data.map(student => {
        return unflatten(student, { object: true });
      });
    }),

  getOne: privateProcedure
    .input(StudentSchema.pick({ id: true }))
    .output(StudentSchema.nullable())
    .query(async ({ input }) => {
      const student = await prisma.student.findUnique({
        where: { id: input.id },
      });

      return student as Student;
    }),

  createOne: privateProcedure
    .input(StudentSchema.omit({ id: true }))
    .output(StudentSchema)
    .mutation(async ({ input }) => {
      const student = await prisma.student.create({
        data: {
          ...input,
          properties: input.properties ?? {},
        },
      });

      return student as Student;
    }),

  updateOne: privateProcedure.input(UpdateOneStudentInputSchema).mutation(async ({ input }) => {
    const updateStudentQuery = studentQueryService.buildUpdatePreparedQuery(input);
    await prisma.$queryRawUnsafe<Record<string, any>[]>(updateStudentQuery);
  }),

  deleteOne: privateProcedure
    .input(StudentSchema.pick({ id: true }))
    .mutation(async ({ input }) => {
      // TODO: check prisma query to see if the select is needed (the goal is to return the least amount of data)
      await prisma.student.delete({
        where: { id: input.id },
        select: {
          id: true,
        },
      });
    }),
});
