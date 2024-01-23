import { buildPaginationClause, prepareValue } from '~/shared/sql.ts';
import { isKnownProperty, KnownPropertyToDb } from '~/students/student.model.ts';
import type { Field, GetManyStudentsInput } from '~/students/student.model.ts';

class StudentService {
  #buildWhereClause(filter: GetManyStudentsInput['filter']): string {
    if (filter.length === 0) return '';

    // Here we suppose that the input is correct
    const whereClauses = filter.map(({ field, operator, value }) => {
      const whereField = isKnownProperty(field)
        ? KnownPropertyToDb[field]
        : `properties ->> '${field.split('properties.', 2)[1]}'`;
      const cleanValue = prepareValue({ operator, value });
      const isNull = value === null;
      switch (operator) {
        case 'eq':
          return isNull ? `${whereField} is null` : `${whereField} = ${cleanValue}`;
        case 'neq':
          return isNull
            ? `${whereField} is not null`
            : `(${whereField} != ${cleanValue} OR ${whereField} IS NULL)`;
        case 'gt':
          return `${whereField} > ${cleanValue}`;
        case 'gte':
          return `${whereField} >= ${cleanValue}`;
        case 'lt':
          return `${whereField} < ${cleanValue}`;
        case 'lte':
          return `${whereField} <= ${cleanValue}`;
        case 'in':
          return `${whereField} IN ${cleanValue}`;
        case 'nin':
          return `${whereField} NOT IN ${cleanValue}`;
        case 'like':
          return `${whereField} ILIKE ${cleanValue}`;
        case 'nlike':
          return `${whereField} NOT ILIKE ${cleanValue}`;
      }
    });

    return `(${whereClauses.join(' AND ')})`;
  }

  buildPreparedQuery(
    request: GetManyStudentsInput,
    {
      withPagination = true,
      selectFields,
    }: { withPagination: boolean | undefined; selectFields: Field[] },
  ): string {
    const whereClause = this.#buildWhereClause(request.filter);
    const paginationClause = withPagination ? buildPaginationClause(request.pagination) : '';

    const finalFields = selectFields.map(field => {
      return isKnownProperty(field)
        ? `${KnownPropertyToDb[field]} as "${field}"`
        : field.startsWith('properties.')
          ? // TODO cast
            `properties ->> '${field.split('properties.', 2)[1]}'  as "${field}"`
          : field;
    });

    return `SELECT ${finalFields.join(', ')} FROM students ${whereClause.length > 0 ? 'WHERE' : ''} ${whereClause} ${paginationClause}`;
  }
}

const studentService = new StudentService();
export { studentService };
