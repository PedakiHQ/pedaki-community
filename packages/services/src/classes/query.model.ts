import { FilterSchema, getKnownField } from '~/classes/query.model.client.ts';
import { FieldAllowedOperators } from '~/utils/query.ts';
import type { FieldType } from '~/utils/query.ts';
import type { z } from 'zod';

export const FilterSchemaWithRefinement = FilterSchema.refine(({ field, operator, value }) => {
  const knownField = getKnownField(field);
  let zodSchema: z.Schema | undefined = undefined;
  let fieldType: FieldType | undefined = undefined;
  if (knownField) {
    zodSchema = knownField.type;
    fieldType = knownField.fieldType;
  }

  if (!fieldType || !zodSchema) return false;

  const isArray = Array.isArray(value);
  if (isArray && !['in', 'nin'].includes(operator)) return false;
  if (!isArray && ['in', 'nin'].includes(operator)) return false;
  if (!isArray) {
    const allowedOperators = FieldAllowedOperators[fieldType];
    if (!allowedOperators.includes(operator)) return false;
  }

  if (isArray) {
    zodSchema.array().parse(value, {
      path: [field, 'value'],
    });
    return true;
  } else {
    zodSchema.parse(value, {
      path: [field, 'value'],
    });
    return true;
  }
});

export * from './query.model.client.ts';
