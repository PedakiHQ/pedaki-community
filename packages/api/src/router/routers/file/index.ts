import { getCache } from '@pedaki/services/files/cache/factory.js';
import type { FileUploadResult } from '@pedaki/services/files/file.model.js';
import { FileUploadResultSchema, FileUploadSchema } from '@pedaki/services/files/file.model.js';
import { getStorage } from '@pedaki/services/files/storage/factory.js';
import { privateProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const fileRouter = router({
  upload: privateProcedure
    .input(z.array(FileUploadSchema))
    .output(z.array(FileUploadResultSchema))
    .mutation(async ({ input }) => {
      // TODO: check if the user has the right to upload files in the given folder
      // TODO: the logo folder should contain only images and only the logo/favicons
      const storage = await getStorage();
      const cache = await getCache();

      const results: FileUploadResult[] = [];
      for (const file of input) {
        results.push(
          await storage.uploadFile({
            ...file,
            buffer: file.buffer as Buffer,
          }),
        );
      }

      const promises = results.map(result => cache.map(c => c.clearCacheUrl(result.url)));
      await Promise.all(promises.flat());

      return results;
    }),
});
