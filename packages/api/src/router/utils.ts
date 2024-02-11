interface FiltersArrayToPrismaWhereOptions {
  /**
   * Relations that needs to be written in a different way
   */
  relations?: string[];
}

/**
 * Transform our filter array to a prisma where object
 * @param filters Filters to use
 * @param options Options to use
 * @returns The specified type to use in the prisma request
 */
export const filtersArrayToPrismaWhere = <T extends Record<string, any>>(
  filters: { field: string; operator: string; value: any }[] | undefined,
  { relations }: FiltersArrayToPrismaWhereOptions = {},
): T => {
  const where = {} as T;
  if (filters) {
    for (const { field, operator, value } of filters) {
      const fieldParts = field.split('.');

      if (!!relations && relations.includes(fieldParts[0]!) && fieldParts.length > 1) {
        // Insert 'some' in the fieldParts at the second position
        fieldParts.splice(1, 0, 'some');
      }

      let current = where;
      // Move to the last part of the field
      for (const part of fieldParts) {
        // Initialize the next part of the where object and move to it
        // @ts-expect-error: The current object is valid, we can't have a valid type
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        current = current[part] = current[part] ?? {};
      }

      // Add mode insensitive if needed (it cannot be put inside of the not object)
      // Only works and strings, to be sure we only add it if the search value contains letters
      if (typeof value === 'string' && /[a-z]/gi.test(value)) {
        switch (operator) {
          case 'eq':
          case 'neq':
          case 'like':
          case 'nlike':
            // @ts-expect-error: The current object is valid, we can't have a valid type
            current.mode = 'insensitive';
            break;
        }
      }

      // If we are in a negative operator, we need to create a not object
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

interface OrderByArrayToPrismaOrderByOptions {
  /**
   * All of the field whose first part is one of these will be ignored
   */
  ignoreStartsWith?: string[];
  /**
   * If specified, only the orderBy of this field will be used and returned
   */
  stepDown?: string;
}

/**
 * Transform our orderBy array to a prisma orderBy object
 * @param orderBy Order by array to use
 * @param options Options to use
 * @returns The specified type to use in the prisma request
 */
export const orderByArrayToPrismaOrderBy = <T extends Record<string, any>>(
  orderBy: [string, 'asc' | 'desc'][] | undefined,
  { ignoreStartsWith, stepDown }: OrderByArrayToPrismaOrderByOptions = {},
): T => {
  const orderByResult = {} as T;
  if (orderBy) {
    for (const [field, sort] of orderBy) {
      const fieldParts = field.split('.');
      if (fieldParts.length > 0) {
        if (
          (!!stepDown && fieldParts[0] !== stepDown) ||
          (!!ignoreStartsWith && ignoreStartsWith.includes(fieldParts[0]!))
        ) {
          continue;
        }

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

  if (stepDown && orderByResult[stepDown]) {
    return orderByResult[stepDown] as T;
  }

  return orderByResult;
};
