import type { PropertyType } from '@prisma/client';
import type { FieldType } from '~/students/query.model.client.ts';
import { z } from 'zod';

export interface PropertySchema {
  type: FieldType;
  schema: z.Schema;
}
export const PROPERTIES_VALIDATION: Readonly<Record<PropertyType, PropertySchema>> = {
  LEVEL: {
    type: 'int',
    schema: z.number().min(0).max(100), // In front we use a transform to convert to A, B, C, D, E, F or 0-20 depending on the setting
  },
} as const;
