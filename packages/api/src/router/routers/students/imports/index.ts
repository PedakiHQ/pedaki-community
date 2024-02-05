import { prisma } from '@pedaki/db';
import type { ImportUploadStatus } from '@pedaki/services/students/imports/import.model.js';
import {
  ImportUploadResultSchema,
  ImportUploadSchema,
  ImportUploadStatusSchema,
} from '@pedaki/services/students/imports/import.model.js';
import { studentImportsService } from '@pedaki/services/students/imports/imports.service.js';
import { MergeGetManyInput } from '@pedaki/services/students/imports/merge/merge.model';
import { studentImportsClasses } from '~api/router/routers/students/imports/classes.ts';
import { studentImportsStudents } from '~api/router/routers/students/imports/students.ts';
import { privateProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const studentImports = router({
  classes: studentImportsClasses,
  students: studentImportsStudents,

  upload: privateProcedure
    .input(ImportUploadSchema)
    .output(ImportUploadResultSchema)
    .mutation(async ({ input }) => {
      const id = await studentImportsService.createImport(input.name);
      // We don't want to wait for the file to be processed
      void studentImportsService.processFile(id, {
        ...input,
        buffer: input.buffer as Buffer,
      });

      return {
        id: id,
      };
    }),

  getMany: privateProcedure
    .output(
      z.array(
        ImportUploadStatusSchema.merge(
          z.object({
            id: z.string(),
            name: z.string(),
          }),
        ),
      ),
    )
    .query(async () => {
      const imports = await prisma.import.findMany({
        select: {
          id: true,
          data: true,
          createdAt: true,
          name: true,
          status: true,
        },
      });

      return imports.map(importUpload => {
        return {
          id: importUpload.id,
          name: importUpload.name,
          status: importUpload.status,
          createdAt: importUpload.createdAt,
          data: importUpload.data as ImportUploadStatus['data'],
        };
      });
    }),

  deleteOne: privateProcedure.input(z.string()).mutation(async ({ input }) => {
    await prisma.import.delete({
      where: {
        id: input,
      },
    });
  }),

  status: privateProcedure
    .input(ImportUploadResultSchema.pick({ id: true }))
    .output(ImportUploadStatusSchema)
    .query(async ({ input }) => {
      const currentStatus = await prisma.import.findUnique({
        where: {
          id: input.id,
        },
        select: {
          status: true,
          data: true,
          createdAt: true,
        },
      });

      return {
        status: currentStatus?.status ?? 'ERROR',
        createdAt: currentStatus?.createdAt ?? null,
        data: (currentStatus?.data as ImportUploadStatus['data']) ?? {
          message: 'NOT_FOUND',
        },
      };
    }),

  previewResult: privateProcedure
    .input(MergeGetManyInput)
    .output(
      z.object({
        students: z.object({
          added: z.number().default(0),
          updated: z.number().default(0),
        }),
        classes: z.object({
          added: z.number().default(0),
          updated: z.number().default(0),
        }),
      }),
    )
    .query(async ({ input }) => {
      const students = await prisma.importStudent.groupBy({
        by: ['status', 'studentId'],
        _count: {
          id: true,
        },
        where: {
          importId: input.importId,
          status: {
            not: 'IGNORED',
          },
        },
      });
      const studentsFlat = students.reduce(
        (acc, c) => {
          if (c.status === 'DONE' && c.studentId) {
            acc.updated = (acc.updated ?? 0) + c._count.id;
          } else {
            acc.added = (acc.added ?? 0) + c._count.id;
          }
          return acc;
        },
        {} as { added?: number; updated?: number },
      );

      const classes = await prisma.importClass.groupBy({
        by: ['status', 'classId'],
        _count: {
          id: true,
        },
        where: {
          importId: input.importId,
          status: {
            not: 'IGNORED',
          },
        },
      });
      const classesFlat = classes.reduce(
        (acc, c) => {
          if (c.status === 'DONE' && c.classId) {
            acc.updated = (acc.updated ?? 0) + c._count.id;
          } else {
            acc.added = (acc.added ?? 0) + c._count.id;
          }
          return acc;
        },
        {} as { added?: number; updated?: number },
      );

      console.log({
        students: studentsFlat,
        classes: classesFlat,
      });

      return {
        students: studentsFlat,
        classes: classesFlat,
      };
    }),
});
