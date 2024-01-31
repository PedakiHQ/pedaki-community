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
  data: z
    .object({
      // TODO: make this a union
      family: ImportFamilySchema.optional(),
      initialCount: z.number().optional(),
      mappedCount: z.number().optional(),
      total: z.number().optional(),
      message: z.string().optional(),
    })
    .optional(),
});

export type ImportUploadStatus = z.infer<typeof ImportUploadStatusSchema>;
