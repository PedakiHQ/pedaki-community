import type { PropertyType } from '@prisma/client';
import type { FieldType } from '~/students/query.model.ts';
import { z } from 'zod';

const propertiesValidation: Record<PropertyType, { type: FieldType; schema: z.Schema }> = {
  LEVEL: {
    type: 'int',
    schema: z.number().min(0).max(100), // In front we use a transform to convert to A, B, C, D, E, F or 0-20 depending on the setting
  },
};

class StudentPropertiesService {
  #studentProperties: Record<string, PropertyType> = {};

  getStudentProperties() {
    return this.#studentProperties;
  }
}

const studentPropertiesService = new StudentPropertiesService();
export { studentPropertiesService };
