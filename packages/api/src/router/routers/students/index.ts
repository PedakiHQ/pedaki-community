import { prisma } from '@pedaki/db';
import { preparePagination } from '@pedaki/services/shared/utils.js';
import { studentPropertiesService } from '@pedaki/services/students/properties.service.js';
import { studentQueryService } from '@pedaki/services/students/query.service.js';
import type { Student } from '@pedaki/services/students/student.model.js';
import {
  GetManyStudentsInputSchema,
  GetManyStudentsOutputSchema,
  StudentSchema,
  UpdateOneStudentInputSchema,
} from '@pedaki/services/students/student.model.js';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const studentsRouter = router({
  getMany: privateProcedure
    .input(GetManyStudentsInputSchema)
    .output(GetManyStudentsOutputSchema)
    .query(async ({ input }) => {
      // TODO valid operator/value based on schema

      // validate fields
      input.filter?.forEach(({ field, value, operator }) => {
        if (field.startsWith('properties.')) {
          const key = field.split('properties.', 2)[1];
          if (!key) {
            // TODO custom error
            throw new Error(`Invalid field ${field}`);
          }
          const schema = studentPropertiesService.getPropertySchema(key);
          if (schema === null) {
            // TODO custom error
            throw new Error(`Unknown property ${key}`);
          }
          // TODO: we are doing ~ the same thing in query.model.ts and here (base vs properties)
          const isArray = Array.isArray(value);
          if (isArray && !['in', 'nin'].includes(operator)) return false;
          if (!isArray && ['in', 'nin'].includes(operator)) return false;
          if (!isArray) {
            schema.schema.parse(value, {
              path: ['fields', field],
            });
          } else {
            schema.schema.array().parse(value, {
              path: ['fields', field],
            });
          }
        }
      });

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
          ...Object.fromEntries(otherData),
          properties: Object.fromEntries(
            properties.map(([key, value]) => [key.split('properties.')[1], value]),
          ) as Record<string, any>,
          class: Object.fromEntries(
            classData.map(([key, value]) => [key.split('class.')[1], value]),
          ) as Record<string, any>,
        };
      });

      return {
        data: finalData,
        meta: pagination,
      };
    }),

  getOne: privateProcedure
    .input(StudentSchema.pick({ id: true }))
    .output(StudentSchema)
    .query(async ({ input }) => {
      const student = await prisma.student.findUnique({
        where: { id: input.id },
      });

      if (!student) {
        // TODO custom error
        throw new Error('Student not found');
      }

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
