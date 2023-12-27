import { z } from 'zod';

export const AvailabilitySchema = z.enum(['public', 'private', 'protected']);

export const FileUploadSchema = z.object({
  name: z
    .string()
    .nonempty()
    .regex(/^[a-zA-Z0-9-_]+$/)
    .optional(), // if not provided, the name will be generated
  extension: z.string().optional(), // if not provided, the extension will be extracted from the mimeType
  buffer: z.any(), // arrayBuffer
  mimeType: z.string(),
  size: z.number().int().positive(),

  availability: AvailabilitySchema,
  path: z.string().min(2).endsWith('/').optional(), // where the file will be stored, if not provided, it will be stored in the root directory
});

export type FileUpload = Omit<z.infer<typeof FileUploadSchema>, 'buffer'> & {
  buffer: ArrayBuffer;
};

export const FileUploadResultSchema = z.object({
  name: z.string(),
  mimeType: z.string(),
  size: z.number().int().positive(),
  url: z.string(),
  availability: AvailabilitySchema,
});

export type FileUploadResult = z.infer<typeof FileUploadResultSchema>;
