import { ClassGeneratorInputSchema } from '~/classes/generator.model.client.ts';
import { FilterSchemaWithRefinement } from '~/students/query.model.ts';
import { z } from 'zod';

export const ClassGeneratorInputWithRefinementSchema = ClassGeneratorInputSchema.omit({
  where: true,
}).merge(
  z.object({
    where: FilterSchemaWithRefinement.array().optional(),
  }),
);