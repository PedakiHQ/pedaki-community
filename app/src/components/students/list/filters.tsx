import { FilterSchema, getKnownField } from '@pedaki/services/students/query.model.client.js';
import type { DefaultFilter, FieldType } from '@pedaki/services/utils/query';
import { EditFilterContent, FilterContent, typedValue } from '~/components/datatable/filters';
import type { EditFilterProps, FilterProps } from '~/components/datatable/filters';
import { useStudentsListStore } from '~/store/students/list/list.store';
import React from 'react';

export const FilterWrapperStudents = <T extends DefaultFilter>(props: FilterProps<T>) => {
  const { columns } = useStudentsListStore(store => ({
    columns: store.translatedColumns,
  }));

  return <FilterContent {...props} columns={columns} />;
};

export const EditFilterWrapperStudents = <T extends DefaultFilter>(props: EditFilterProps<T>) => {
  const { columns, propertyTypes } = useStudentsListStore(store => ({
    columns: store.translatedColumns,
    propertyTypes: store.propertySchemaMapping as Record<
      string,
      (typeof store.propertySchemaMapping)[keyof typeof store.propertySchemaMapping]
    >,
  }));

  const getFieldType = (field: string): FieldType =>
    (field ? getKnownField(field)?.fieldType ?? propertyTypes[field]?.type : undefined) ?? 'text';

  const schema = FilterSchema.refine(({ field, value }) => {
    const isProperty = field?.startsWith('properties.');
    if (isProperty && value) {
      propertyTypes[field]?.schema.parse(typedValue(value, getFieldType(field)), {
        path: ['value'],
      });
    }
    return true;
  });

  return (
    <EditFilterContent {...props} columns={columns} getFieldType={getFieldType} schema={schema} />
  );
};
