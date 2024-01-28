import { studentPropertiesService } from '~/students/properties.service.ts';
import type { FieldType } from '~/students/query.model.client.ts';
import {
  FieldAllowedOperators,
  FieldSchema,
  FilterSchema,
  getKnownField,
} from '~/students/query.model.client.ts';
import { z } from 'zod';

export const FieldSchemaWithRefinement = FieldSchema.refine(
  key => {
    if (key.startsWith('properties.')) {
      const propertyKey = key.split('properties.', 2)[1]!;
      const property = studentPropertiesService.getPropertySchema(propertyKey);
      return property !== null;
    }
    return true;
  },
  key => ({
    message: `Unknown property ${key}`,
  }),
);

export const FilterSchemaWithRefinement = FilterSchema.omit({ field: true })
  .merge(
    z.object({
      field: FieldSchemaWithRefinement,
    }),
  )
  .refine(({ field, operator, value }) => {
    const knownField = getKnownField(field);
    let zodSchema: z.Schema | undefined = undefined;
    let fieldType: FieldType | undefined = undefined;
    if (knownField) {
      zodSchema = knownField.type;
      fieldType = knownField.fieldType;
    } else if (field.startsWith('properties.')) {
      const propertyKey = field.split('properties.', 2)[1]!;
      const property = studentPropertiesService.getPropertySchema(propertyKey);
      if (!property) return false;
      zodSchema = property.schema;
      fieldType = property.type;
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
