import { ClassesSchema } from '~/classes/class.model.ts';
import { z } from 'zod';

export const ClassesCreateInputSchema = ClassesSchema.pick({
  name: true,
})
  .merge(
    z.object({
      students: z.number().array(),
    }),
  )
  .array();
