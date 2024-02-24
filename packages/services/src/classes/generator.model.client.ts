import { RawInputSchema } from '@pedaki/algorithms';
import { FilterSchema } from '~/students/query.model.client.ts';
import { z } from 'zod';

export const ClassGeneratorInputSchema = z
  .object({
    where: FilterSchema.array().min(1).optional(),
  })
  .merge(RawInputSchema);

export type ClassGeneratorInput = z.infer<typeof ClassGeneratorInputSchema>;
