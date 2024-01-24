import { buildPaginationClause, buildWhereClause, escape, getJsonBType } from '~/shared/sql.ts';
import type {
  Field,
  GetManyStudentsInput,
  UpdateOneStudentInput,
} from '~/students/student.model.ts';
import { getKnownField } from '~/students/student.model.ts';

// TODO: rename to StudentQueryService and add a new StudentService
class StudentService {
  #buildWhereClause(filter: GetManyStudentsInput['filter']): string {
    if (filter.length === 0) return '';

    // Here we suppose that the input is correct
    const whereClauses = filter.map(({ field, operator, value }) => {
      const knownField = getKnownField(field);
      const whereField = knownField
        ? `${knownField.mappping}::${knownField.cast}`
        : `properties ->> '${field.split('properties.', 2)[1]}'`;

      return buildWhereClause(whereField, operator, value);
    });

    return `(${whereClauses.join(' AND ')})`;
  }

  buildSelectPreparedQuery(
    request: GetManyStudentsInput,
    {
      withPagination = true,
      selectFields,
    }: { withPagination: boolean | undefined; selectFields: Field[] },
  ): string {
    const whereClause = this.#buildWhereClause(request.filter);
    const paginationClause = withPagination ? buildPaginationClause(request.pagination) : '';

    if (!selectFields.includes('id') && !selectFields.includes('count')) {
      selectFields.push('id');
    }

    const finalFields = selectFields.map(field => {
      const knownField = getKnownField(field);
      return knownField
        ? `${knownField.mappping}::${knownField.cast} as "${field}"`
        : field.startsWith('properties.')
          ? // TODO cast
            `properties ->> '${field.split('properties.', 2)[1]}' as "${field}"`
          : field;
    });

    const hasClassFields = request.filter.some(({ field }) => field.startsWith('class.'));
    const joinClass = hasClassFields
      ? `
        INNER JOIN "_class_to_student" t1 ON students.id = t1."B"
        INNER JOIN classes class ON class.id = t1."A"`
      : '';

    return `SELECT ${finalFields.join(', ')}
                FROM students ${joinClass} ${whereClause.length > 0 ? 'WHERE' : ''}  ${whereClause} ${paginationClause}`;
  }

  buildSelectJoinQuery(fields: Field[], ids: number[]): string | null {
    const finalFields = fields
      .map(field => {
        const knownField = getKnownField(field);
        if (!knownField) return null;
        return `${knownField.mappping}::${knownField.cast} as "${field}"`;
      })
      .filter(Boolean);

    // TODO handle other join than class

    return `SELECT ${finalFields.join(', ')}, "t"."B" as "id"
        FROM "_class_to_student" t
            INNER JOIN "classes" class ON "t"."A" = "class"."id"
        WHERE "t"."B" IN (${ids.join(',')})`;
  }

  buildUpdatePreparedQuery(request: UpdateOneStudentInput): string {
    // flat properties
    const finalFields = Object.entries(request)
      .map(([key, value]) => {
        if (key === 'id') return;
        if (typeof value === 'undefined') return;

        if (key === 'properties' && typeof value === 'object' && value !== null) {
          const result: string[] = [];
          for (const [k, v] of Object.entries(value)) {
            if (typeof v === 'undefined') return;
            let value = escape(v);
            value = `to_jsonb(${value}::${getJsonBType(v)})`;

            result.push(`jsonb_build_object('${k}', ${value})`);
          }

          return `properties = properties || ${result.join(' || ')}`;
        }

        const knownField = getKnownField(key);
        if (knownField) {
          return `${knownField.mappping} = ${escape(value)}`;
        }
      })
      .filter(Boolean);

    return `UPDATE students
                SET ${finalFields.join(', ')}
                WHERE id = ${escape(request.id)}`;
  }
}

const studentService = new StudentService();
export { studentService };
