import { prisma } from '@pedaki/db';
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
  #studentProperties: Record<string, { type: PropertyType; name: string }>;

  constructor() {
    this.#studentProperties = {};
  }

  async reload() {
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        type: true,
        name: true,
      },
    });
    this.#studentProperties = properties.reduce(
      (acc, property) => {
        acc[property.id] = {
          type: property.type,
          name: property.name,
        };
        return acc;
      },
      {} as Record<string, { type: PropertyType; name: string }>,
    );
  }

  getProperties() {
    return this.#studentProperties;
  }

  getPropertyType(property: string): PropertyType | null {
    const studentProperties = this.getProperties();
    return studentProperties[property]?.type ?? null;
  }

  getPropertySchema(property: string): PropertySchema | null {
    const studentProperties = this.getProperties();
    const propertyType = studentProperties[property] ?? null;
    if (propertyType === null) return null;
    return PROPERTIES_VALIDATION[propertyType.type];
  }
}

const studentPropertiesService = new StudentPropertiesService();
await studentPropertiesService.reload();
export { studentPropertiesService };
