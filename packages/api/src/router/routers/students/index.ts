import { prisma } from '@pedaki/db';
import { preparePagination } from '@pedaki/services/shared/utils.js';
import { studentPropertiesService } from '@pedaki/services/students/properties.service.js';
import { FieldAllowedOperators, KnownFieldsKeys } from '@pedaki/services/students/query.model.js';
import { studentQueryService } from '@pedaki/services/students/query.service.js';
import type { GetStudentMapping, Student } from '@pedaki/services/students/student.model.js';
import {
  GetManyStudentsInputSchema,
  GetManyStudentsOutputSchema,
  GetStudentMappingSchema,
  StudentSchema,
  UpdateOneStudentInputSchema,
} from '@pedaki/services/students/student.model.js';
import { TRPCError } from '@trpc/server';
import { studentPropertiesSchema } from '~api/router/routers/students/properties';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const studentsRouter = router({
  properties: studentPropertiesSchema,

  getSchema: privateProcedure.output(GetStudentMappingSchema).query(() => {
    const schema: GetStudentMapping = [];
    KnownFieldsKeys.forEach(key => {
      if (key == 'count') return;
      const group = key.startsWith('class.teachers.')
        ? 'teacher'
        : key.startsWith('class.')
          ? 'class'
          : 'default';
      schema.push({
        type: group,
        field: key,
      });
    });

    const properties = studentPropertiesService.getProperties();
    Object.keys(properties).forEach(property => {
      schema.push({
        type: 'property',
        field: `properties.${property}`,
      });
    });

    return schema;
  }),

  getMany: privateProcedure
    .input(GetManyStudentsInputSchema)
    .output(GetManyStudentsOutputSchema)
    .query(async ({ input }) => {
      try {
        // validate fields
        input.fields.forEach(field => {
          if (field.startsWith('properties.')) {
            const key = field.split('properties.', 2)[1];
            if (!key) {
              // TODO: custom error
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Invalid field ${field}`,
              });
            }
            const schema = studentPropertiesService.getPropertySchema(key);
            if (schema === null) {
              // TODO: custom error
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Invalid field ${field}`,
              });
            }
          }
        });

        input.filter?.forEach(({ field, value, operator }, index) => {
          if (field.startsWith('properties.')) {
            const key = field.split('properties.', 2)[1];
            if (!key) {
              // TODO: custom error
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Invalid field ${field}`,
              });
            }
            const schema = studentPropertiesService.getPropertySchema(key);
            if (schema === null) {
              // TODO: custom error
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Invalid field ${field}`,
              });
            }
            // TODO: we are doing ~ the same thing in query.model.ts and here (base vs properties)
            const allowedOperators = FieldAllowedOperators[schema.type];
            if (!allowedOperators.includes(operator)) return false;
            const isArray = Array.isArray(value);
            if (isArray && !['in', 'nin'].includes(operator)) return false;
            if (!isArray && ['in', 'nin'].includes(operator)) return false;
            if (!isArray) {
              schema.schema.parse(value, {
                path: ['fields', index, 'value'],
              });
            } else {
              schema.schema.array().parse(value, {
                path: ['fields', index, 'value'],
              });
            }
          }
        });
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: (error as Error).message,
        });
      }

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
