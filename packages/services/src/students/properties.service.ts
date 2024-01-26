import type { PropertyType } from '@prisma/client';
import type { FieldType } from '~/students/query.model.ts';
import { z } from 'zod';

interface PropertySchema {
  type: FieldType;
  schema: z.Schema;
}
const PROPERTIES_VALIDATION: Readonly<Record<PropertyType, PropertySchema>> = {
  LEVEL: {
    type: 'int',
    schema: z.number().min(0).max(100), // In front we use a transform to convert to A, B, C, D, E, F or 0-20 depending on the setting
  },
} as const;

class StudentPropertiesService {
  #studentProperties: Record<string, PropertyType> | null = null;

  getStudentProperties() {
    if (this.#studentProperties === null) {
      // TODO: load from db
      this.#studentProperties = {
        math_level: 'LEVEL',
      };
    }

    return this.#studentProperties;
  }

  getPropertyType(property: string): PropertyType | null {
    const studentProperties = this.getStudentProperties();
    return studentProperties[property] ?? null;
  }

  getPropertySchema(property: string): PropertySchema | null {
    const studentProperties = this.getStudentProperties();
    const propertyType = studentProperties[property] ?? null;
    if (propertyType === null) return null;
    return PROPERTIES_VALIDATION[propertyType];
  }
}

const studentPropertiesService = new StudentPropertiesService();
export { studentPropertiesService };
