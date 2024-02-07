import { PropertyType } from '@prisma/client';
import { z } from 'zod';

export const CreatePropertySchema = z.object({
  type: z.nativeEnum(PropertyType),
  name: z.string().min(1),
  required: z.boolean(),
});
export type CreateProperty = z.input<typeof CreatePropertySchema>;

export const PropertyWithId = CreatePropertySchema.merge(z.object({ id: z.number() }));

export const GetManyPropertiesSchema = z.record(PropertyWithId);
export type GetManyProperties = z.output<typeof GetManyPropertiesSchema>;
