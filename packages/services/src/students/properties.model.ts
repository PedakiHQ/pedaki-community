import { PropertyType } from '@prisma/client';
import { z } from 'zod';

export const GetManyPropertiesSchema = z.record(
  z.object({
    type: z.nativeEnum(PropertyType),
    name: z.string(),
  }),
);
export type GetManyProperties = z.infer<typeof GetManyPropertiesSchema>;
