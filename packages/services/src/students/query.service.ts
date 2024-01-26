import { buildPaginationClause, buildWhereClause, escape, getJsonBType } from '~/shared/sql.ts';
import { studentPropertiesService } from '~/students/properties.service.ts';
import { getKnownField } from '~/students/query.model.ts';
import type { Field } from '~/students/query.model.ts';
import type { GetManyStudentsInput, UpdateOneStudentInput } from '~/students/student.model.ts';

// TODO make this cleaner

class StudentQueryService {
  #buildWhereClause(filter: GetManyStudentsInput['filter']): string {
    if (!filter || filter.length === 0) return '';

    // Here we suppose that the input is correct
    const whereClauses = filter.map(({ field, operator, value }) => {
      let whereField: string = field;
      const knownField = getKnownField(field);
      if (knownField) {
        whereField = `${knownField.mappping}::${knownField.fieldType}`;
      } else if (field.startsWith('properties.')) {
        const key = field.split('properties.', 2)[1]!;
        const knownProperty = studentPropertiesService.getPropertySchema(key);
        if (knownProperty) {
          whereField = `(properties ->> '${key}')::${knownProperty.type}`;
        }
      }

      return buildWhereClause(whereField, operator, value);
    });

    return `(${whereClauses.join(' AND ')})`;
  }

  #buildOrderByClause(orderBy: GetManyStudentsInput['orderBy']): string {
    if (!orderBy || orderBy.length === 0) return '';

    // Here we suppose that the input is correct
    const orderByClauses = orderBy.map(([field, order]) => {
      let orderByField: string = field;
      const knownField = getKnownField(field);
      if (knownField) {
        orderByField = `${knownField.mappping}::${knownField.fieldType}`;
      } else if (field.startsWith('properties.')) {
        const key = field.split('properties.', 2)[1]!;
        const knownProperty = studentPropertiesService.getPropertySchema(key);
        if (knownProperty) {
          orderByField = `(properties ->> '${key}')::${knownProperty.type}`;
        }
      }

      return `${orderByField} ${order}`;
    });
    return `ORDER BY ${orderByClauses.join(', ')}`;
  }

  buildSelectPreparedQuery(
    request: GetManyStudentsInput,
    { selectFields }: { selectFields: Field[] },
  ): string {
    const isCount = selectFields.includes('count');
    const whereClause = this.#buildWhereClause(request.filter);
    const paginationClause = !isCount ? buildPaginationClause(request.pagination) : '';
    const orderByClause = !isCount ? this.#buildOrderByClause(request.orderBy) : '';

    if (!selectFields.includes('id') && !isCount) {
      selectFields.push('id');
    }

    const finalFields = selectFields.map(field => {
      const knownField = getKnownField(field);
      if (knownField) {
        return `${knownField.mappping}::${knownField.fieldType} as "${field}"`;
      }
      if (field.startsWith('properties.')) {
        const key = field.split('properties.', 2)[1]!;
        const knownProperty = studentPropertiesService.getPropertySchema(key);
        if (knownProperty) {
          return `(properties ->> '${key}')::${knownProperty.type} as "${field}"`;
        }
      }

      return field;
    });

    const hasClassFields =
      request.filter?.some(({ field }) => field.startsWith('class.')) ??
      request.orderBy?.some(([field]) => field.startsWith('class.')) ??
      request.fields.some(field => field.startsWith('class.')) ??
      false;

    const joinClass = hasClassFields
      ? `
        INNER JOIN "_class_to_student" t1 ON students.id = t1."B"
        INNER JOIN classes class ON class.id = t1."A"`
      : '';
    const hasTeachers =
      request.filter?.some(({ field }) => field.startsWith('class.teachers.')) ??
      request.orderBy?.some(([field]) => field.startsWith('class.teachers.')) ??
      request.fields.some(field => field.startsWith('class.teachers.')) ??
      false;
    const joinTeachers = hasTeachers
      ? `
        INNER JOIN "_class_to_teacher" t2 ON class.id = t2."A"
        INNER JOIN teachers ON teachers.id = t2."B"`
      : '';

    return `SELECT ${finalFields.join(', ')}
                FROM students ${joinClass} ${joinTeachers} ${whereClause.length > 0 ? 'WHERE' : ''} ${whereClause} ${orderByClause} ${paginationClause} `;
  }

  buildSelectJoinQuery(request: GetManyStudentsInput, ids: number[]): string | null {
    const fields = request.fields.filter(field => field.startsWith('class.'));
    const finalFields = fields
      .map(field => {
        const knownField = getKnownField(field);
        if (!knownField) return null;
        return `${knownField.mappping}::${knownField.fieldType} as "${field}"`;
      })
      .filter(Boolean);

    const hasTeachers = fields.some(field => field.startsWith('class.teachers.'));

    const joinTeachers = hasTeachers
      ? `
        INNER JOIN "_class_to_teacher" t2 ON class.id = t2."A"
        INNER JOIN teachers ON teachers.id = t2."B"`
      : '';
    const whereTeachers = hasTeachers
      ? request.filter
          ?.filter(({ field }) => field.startsWith('class.teachers.'))
          .map(({ field, operator, value }) => {
            const whereField = `teachers.${field.split('class.teachers.', 2)[1]}`;
            return buildWhereClause(whereField, operator, value);
          })
          .join(' AND ')
      : '';

    return `SELECT ${finalFields.join(', ')}, "t"."B" as "id"
                FROM "_class_to_student" t
                         INNER JOIN "classes" class ON "t"."A" = "class"."id"
                    ${joinTeachers}
                WHERE "t"."B" IN (${ids.join(',')}) ${whereTeachers ? 'AND' : ''} ${whereTeachers}`;
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

const studentQueryService = new StudentQueryService();
export { studentQueryService };
