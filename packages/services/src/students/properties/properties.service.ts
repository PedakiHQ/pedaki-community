import { prisma } from '@pedaki/db';
import type { CreateProperty, GetManyProperties } from '~/students/properties/properties.model.ts';
import type { PropertySchema } from './properties-validations.ts';
import { PROPERTIES_VALIDATION } from './properties-validations.ts';

class StudentPropertiesService {
  #studentProperties: GetManyProperties;

  constructor() {
    this.#studentProperties = {};
  }

  async reload() {
    // Skip in ci
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('{{{')) return;
    if (process.env.NODE_ENV !== 'test') console.log('Reloading student properties');
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        type: true,
        name: true,
        required: true,
      },
    });
    this.#studentProperties = properties.reduce((acc, property) => {
      acc[property.id] = {
        id: property.id,
        type: property.type,
        name: property.name,
        required: property.required,
      };
      return acc;
    }, {} as GetManyProperties);
    if (process.env.NODE_ENV !== 'test')
      console.log('Student properties reloaded', this.#studentProperties);
  }

  getProperties() {
    return this.#studentProperties;
  }

  getPropertiesKeys() {
    return Object.keys(this.#studentProperties);
  }

  getPropertySchema(property: string): PropertySchema | null {
    const studentProperties = this.getProperties();
    const propertyType = studentProperties[property] ?? null;
    if (propertyType === null) return null;
    return PROPERTIES_VALIDATION[propertyType.type];
  }

  async addNewProperty(property: CreateProperty) {
    // Add new property to the database
    const newProperty = await prisma.property.create({
      data: property,
    });
    // add new property to the local cache
    this.#studentProperties[newProperty.id] = newProperty;
    return newProperty;
  }

  async deleteProperty(property: { id: number }) {
    // delete property from the database
    const deletedProperty = await prisma.property.delete({
      where: {
        id: property.id,
      },
    });
    // delete property from the local cache
    delete this.#studentProperties[deletedProperty.id];

    // TODO: delete property from all students

    return deletedProperty;
  }
}

const studentPropertiesService = new StudentPropertiesService();
await studentPropertiesService.reload();
export { studentPropertiesService };
