import { z } from 'zod';

export const ImportFamilySchema = z.enum(['siecle']);
export type ImportFamily = z.infer<typeof ImportFamilySchema>;

export const ImportUploadSchema = z.object({
  buffer: z.any(), // Buffer
  mimeType: z.string(),
  name: z.string(),
});

export type ImportUpload = Omit<z.infer<typeof ImportUploadSchema>, 'buffer'> & {
  buffer: ArrayBuffer;
};

export const ImportUploadResultSchema = z.object({
  id: z.string(),
});

export type ImportUploadResult = z.infer<typeof ImportUploadResultSchema>;

const CountSchema = z.object({
  mappedCount: z.number(),
  insertedCount: z.number(),
});

export const ImportUploadStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'DONE', 'ERROR']),
  createdAt: z.date().nullable(),
  data: z
    .object({
      // TODO: make this a union
      family: ImportFamilySchema.optional(),
      students: CountSchema.optional(),
      classes: CountSchema.optional(),
      levels: CountSchema.optional(),
      message: z.string().optional(),
    })
    .optional(),
});

export type ImportUploadStatus = z.infer<typeof ImportUploadStatusSchema>;
