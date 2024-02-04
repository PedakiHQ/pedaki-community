/**
 * Transform our filter array to a prisma where object
 * @param filters Filters to use
 * @returns The specified type to use in the prisma request
 */
export const filtersArrayToPrismaWhere = <T extends object>(
  filters: { field: string; operator: string; value: any }[] | undefined,
): T => {
  const where = {} as T;
  if (filters) {
    for (const { field, operator, value } of filters) {
      const fieldParts = field.split('.');
      let current = where;
      // Move to the last part of the field
      for (const part of fieldParts) {
        // Initialize the next part of the where object and move to it
        // @ts-expect-error: The current object is valid, we can't have a valid type
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        current = current[part] = current[part] ?? {};
      }

      // If we are in a negatiive operator, we need to create a not object
      switch (operator) {
        case 'neq':
        case 'nlike':
          // Initialize the next part of the where object and move to it
          // @ts-expect-error: The current object is valid, we can't have a valid type
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          current = current.not = current.not ?? {};
          break;
      }
      switch (operator) {
        case 'eq':
        case 'neq':
          // @ts-expect-error: The current object is valid, we can't have a valid type
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          current.equals = value;
          break;
        case 'like':
        case 'nlike':
          // @ts-expect-error: The current object is valid, we can't have a valid type
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          current.contains = value;
          break;
        // case 'gt':
        // case 'gte':
        // case 'lt':
        // case 'lte':
        default:
          // @ts-expect-error: The current object is valid, we can't have a valid type
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          current[operator] = value;
      }
    }
  }

  return where;
};

/**
 * Transform our orderBy array to a prisma orderBy object
 * @param orderBy Order by array to use
 * @returns The specified type to use in the prisma request
 */
export const orderByArrayToPrismaOrderBy = <T extends object>(
  orderBy: [string, 'asc' | 'desc'][] | undefined,
): T => {
  const orderByResult = {} as T;
  if (orderBy) {
    for (const [field, sort] of orderBy) {
      const fieldParts = field.split('.');
      if (fieldParts.length > 0) {
        let current = orderByResult;
        // Move to the last part of the field
        for (const part of fieldParts.slice(0, -1)) {
          // Initialize the next part of the where object and move to it
          // @ts-expect-error: The current object is valid, we can't have a valid type
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          current = current[part] = current[part] ?? {};
        }
        // @ts-expect-error: The current object is valid, we can't have a valid type
        current[fieldParts[fieldParts.length - 1]] = sort;
      }
    }
  }

  return orderByResult;
};
