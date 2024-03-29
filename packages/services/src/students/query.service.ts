/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { buildPaginationClause, buildWhereClause, escape, getJsonBType } from '~/shared/sql.ts';
import { studentPropertiesService } from '~/students/properties/properties.service.ts';
import { getKnownField } from '~/students/query.model.ts';
import type { Field } from '~/students/query.model.ts';
import type { GetManyStudentsInput, UpdateOneStudentInput } from '~/students/student.model.ts';

// TODO make this cleaner

class StudentQueryService {
  #buildWhereClause(where: GetManyStudentsInput['where']): string {
    if (!where || where.length === 0) return '';

    // Here we suppose that the input is correct
    const whereClauses = where.map(({ field, operator, value }) => {
      let whereField: string = field;
      const knownField = getKnownField(field);
      if (knownField) {
        whereField = `${knownField.mapping}::${knownField.fieldType}`;
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
        orderByField = `${knownField.mapping}::${knownField.fieldType}`;
      } else if (field.startsWith('properties.')) {
        const key = field.split('properties.', 2)[1]!;
        const knownProperty = studentPropertiesService.getPropertySchema(key);
        if (knownProperty) {
          orderByField = `(properties ->> '${key}')::${knownProperty.type}`;
        }
      }

      return `${orderByField} ${order} NULLS ${order === 'asc' ? 'FIRST' : 'LAST'}`;
    });
    return `ORDER BY ${orderByClauses.join(', ')}`;
  }

  #buildGroupByClause(isCount: boolean, hasClassFields: boolean, hasTeachers: boolean): string {
    const groupByClause = [];
    if (!isCount) {
      groupByClause.push('students.id');
    }
    if (hasClassFields) {
      groupByClause.push('class.id');
    }
    if (hasTeachers) {
      groupByClause.push('teachers.id');
    }
    if (groupByClause.length === 0) return '';
    return `GROUP BY ${groupByClause.join(', ')}`;
  }

  buildSelectPreparedQuery(
    request: GetManyStudentsInput,
    { selectFields, groupBy }: { selectFields: Field[]; groupBy?: string },
  ): string {
    const isCount = selectFields.includes('count');
    const whereClause = this.#buildWhereClause(request.where);
    const paginationClause =
      !isCount && request.pagination.limit !== -1 ? buildPaginationClause(request.pagination) : '';
    const orderByClause = !isCount ? this.#buildOrderByClause(request.orderBy) : '';

    if (!selectFields.includes('id') && !isCount) {
      selectFields.push('id');
    }

    const finalFields = selectFields.map(field => {
      const knownField = getKnownField(field);
      if (knownField) {
        return `${knownField.mapping}::${knownField.fieldType} as "${field}"`;
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
      request.where?.some(({ field }) => field.startsWith('class.')) ||
      (!isCount && request.orderBy?.some(([field]) => field.startsWith('class.'))) ||
      (!isCount && selectFields.some(field => field.startsWith('class.'))) ||
      false;

    const joinClass = hasClassFields
      ? `
        LEFT JOIN "_class_to_student" t1 ON students.id = t1."B"
        LEFT JOIN classes class ON class.id = t1."A"`
      : '';
    const hasTeachers =
      request.where?.some(({ field }) => field.startsWith('class.teachers.')) ||
      (!isCount && request.orderBy?.some(([field]) => field.startsWith('class.teachers.'))) ||
      (!isCount && selectFields.some(field => field.startsWith('class.teachers.'))) ||
      false;
    const joinTeachers = hasTeachers
      ? `
        LEFT JOIN "_class_to_teacher" t2 ON class.id = t2."A"
        LEFT JOIN teachers ON teachers.id = t2."B"`
      : '';

    const groupByClause = groupBy ?? this.#buildGroupByClause(isCount, hasClassFields, hasTeachers);

    return `SELECT ${finalFields.join(', ')}
                FROM students ${joinClass} ${joinTeachers} ${whereClause.length > 0 ? 'WHERE' : ''} ${whereClause} ${groupByClause} ${orderByClause} ${paginationClause} `;
  }

  buildSelectJoinQuery(request: GetManyStudentsInput, ids: number[]): string | null {
    if (ids.length === 0) return null;
    const fields = request.fields.filter(field => field.startsWith('class.'));
    const finalFields = fields
      .map(field => {
        const knownField = getKnownField(field);
        if (!knownField) return null;
        return `${knownField.mapping}::${knownField.fieldType} as "${field}"`;
      })
      .filter(Boolean);

    const hasTeachers = fields.some(field => field.startsWith('class.teachers.'));

    const joinTeachers = hasTeachers
      ? `
        INNER JOIN "_class_to_teacher" t2 ON class.id = t2."A"
        INNER JOIN teachers ON teachers.id = t2."B"`
      : '';
    const whereTeachers = hasTeachers
      ? request.where
          ?.filter(({ field }) => field.startsWith('class.teachers.'))
          .map(({ field, operator, value }) => {
            const whereField = `teachers.${field.split('class.teachers.', 2)[1]} `;
            return buildWhereClause(whereField, operator, value);
          })
          .join(' AND ')
      : '';

    return `SELECT ${finalFields.join(', ')}, "t"."B" as "id"
                FROM "_class_to_student" t
                         INNER JOIN "classes" class ON "t"."A" = "class"."id" and "class"."status" = 'ACTIVE' 
                    ${joinTeachers}
                WHERE "t"."B" IN(${ids.join(',')}) ${whereTeachers ? `AND ${whereTeachers}` : ''} `;
  }

  buildUpdatePreparedQuery(request: UpdateOneStudentInput): string {
    // flat properties
    const finalFields = Object.entries(request)
      .map(([key, value]) => {
        if (key === 'id') return;
        if (typeof value === 'undefined') return;

        if (key === 'properties' && typeof value === 'object' && value !== null) {
          const values = Object.entries(value);
          if (values.length <= 0) return;

          const updateResult: string[] = [];
          const deleteResult: string[] = [];
          for (const [k, v] of values) {
            // If the value meet conditions we remove add the key to be removed
            if (v === '' || v === null || v === undefined) {
              deleteResult.push(`'${k}'`);
              continue;
            }
            let value = escape(v);
            value = `to_jsonb(${value}:: ${getJsonBType(v)})`;

            updateResult.push(`jsonb_build_object('${k}', ${value})`);
          }

          let res = 'properties = properties ';
          // Deletes should go first
          if (deleteResult.length > 0) {
            res = `${res}- ${deleteResult.join(' - ')} `;
          }
          if (updateResult.length > 0) {
            res = `${res}|| ${updateResult.join(' || ')} `;
          }
          return res;
        }

        const knownField = getKnownField(key);
        if (knownField) {
          return `${knownField.mapping} = ${escape(value)} `;
        }
      })
      .filter(Boolean);

    return `UPDATE students
                SET ${finalFields.join(', ')}
                WHERE id = ${escape(request.id)} `;
  }
}

const studentQueryService = new StudentQueryService();
export { studentQueryService };
