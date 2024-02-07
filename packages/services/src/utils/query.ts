import { z } from 'zod';

const FieldTypes = ['int', 'text', 'date'] as const;
export type FieldType = (typeof FieldTypes)[number];

const QueryOperators = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  // 'in',
  // 'nin',
  'like',
  'nlike',
] as const;

export const QueryOperatorSchema = z.enum(QueryOperators);
export type QueryOperator = z.infer<typeof QueryOperatorSchema>;

export const FieldAllowedOperators: Record<FieldType, QueryOperator[]> = {
  int: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'],
  text: ['eq', 'neq', 'like', 'nlike'],
  date: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'],
} as const;

export const isPositiveOperator = (operator: QueryOperator): boolean => {
  return ['eq', 'gt', 'gte', 'in', 'like'].includes(operator);
};

export const createFilterSchema = <T extends z.ZodTypeAny>(fieldSchema: T) =>
  z.object({
    field: fieldSchema,
    operator: QueryOperatorSchema,
    value: z.union([
      z.string(),
      // z.string().array(),
      z.number(),
      // z.number().array(),
      z.boolean(),
      z.date(),
      // z.date().array(),
    ]),
  });

export const DefaultFilterSchema = createFilterSchema(z.string().min(1));
export type DefaultFilter = z.infer<typeof DefaultFilterSchema>;
