import { prisma } from '@pedaki/db';
import type { ImportUploadStatus } from '@pedaki/services/students/imports/import.model.js';
import {
  ImportUploadResultSchema,
  ImportUploadSchema,
  ImportUploadStatusSchema,
} from '@pedaki/services/students/imports/import.model.js';
import { studentImportsService } from '@pedaki/services/students/imports/imports.service.js';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const studentImports = router({
  upload: privateProcedure
    .input(ImportUploadSchema)
    .output(ImportUploadResultSchema)
    .mutation(async ({ input }) => {
      const id = await studentImportsService.createImport();

      // We don't want to wait for the file to be processed
      void studentImportsService.processFile(id, {
        ...input,
        buffer: input.buffer as Buffer,
      });

      return {
        id: id,
      };
    }),

  status: privateProcedure
    .input(ImportUploadResultSchema.pick({ id: true }))
    .output(ImportUploadStatusSchema)
    .mutation(async ({ input }) => {
      const currentStatus = await prisma.import.findUnique({
        where: {
          id: input.id,
        },
        select: {
          status: true,
          data: true,
        },
      });

      console.log(currentStatus);

      return {
        status: currentStatus?.status ?? 'ERROR',
        data: (currentStatus?.data as ImportUploadStatus['data']) ?? {
          message: 'Import not found',
        },
      };
    }),
});
