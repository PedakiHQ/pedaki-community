import { prisma } from '@pedaki/db';
import type { ImportUploadStatus } from '@pedaki/services/students/imports/import.model.js';
import {
  ImportUploadResultSchema,
  ImportUploadSchema,
  ImportUploadStatusSchema,
} from '@pedaki/services/students/imports/import.model.js';
import { studentImportsService } from '@pedaki/services/students/imports/imports.service.js';
import { studentImportsClasses } from '~api/router/routers/students/imports/classes.ts';
import { privateProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const studentImports = router({
  classes: studentImportsClasses,

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

  deleteOne: privateProcedure
    .input(z.string())
    .output(z.boolean())
    .mutation(async ({ input }) => {
      await prisma.import.delete({
        where: {
          id: input,
        },
      });

      return true;
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
});
