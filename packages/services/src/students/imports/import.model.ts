import { z } from 'zod';

export const ImportFamilySchema = z.enum(['siecle']);
export type ImportFamily = z.infer<typeof ImportFamilySchema>;

export const ImportUploadSchema = z.object({
  buffer: z.any(), // Buffer
  mimeType: z.string(),
});

export type ImportUpload = Omit<z.infer<typeof ImportUploadSchema>, 'buffer'> & {
  buffer: ArrayBuffer;
};

export const ImportUploadResultSchema = z.object({
  id: z.string(),
});

export type ImportUploadResult = z.infer<typeof ImportUploadResultSchema>;

export const ImportUploadStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'DONE', 'ERROR']),
  data: z.union([
    z.object({
      family: ImportFamilySchema,
    }),
    z.object({
      family: ImportFamilySchema,
      initialCount: z.number(),
      mappedCount: z.number(),
      total: z.number(),
    }),
    z.object({
      message: z.string(),
    }),
  ]),
});

export type ImportUploadStatus = z.infer<typeof ImportUploadStatusSchema>;
