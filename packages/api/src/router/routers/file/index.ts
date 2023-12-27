import {
  FileUploadResult,
  FileUploadResultSchema,
  FileUploadSchema,
} from '@pedaki/services/files/file.model.js';
import { getStorage } from '@pedaki/services/files/storage/factory.js';
import { privateProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const fileRouter = router({
  upload: privateProcedure
    .input(z.array(FileUploadSchema))
    .output(z.array(FileUploadResultSchema))
    .mutation(async ({ input }) => {
      const storage = await getStorage();

      const results: FileUploadResult[] = [];
      for (const file of input) {
        results.push(await storage.uploadFile(file));
      }

      return results;
    }),
});
