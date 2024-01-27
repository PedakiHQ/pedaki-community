import { prisma } from '@pedaki/db';
import type { PropertyType } from '@prisma/client';
import { PROPERTIES_VALIDATION } from './properties-validations.ts';
import type { PropertySchema } from './properties-validations.ts';

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
