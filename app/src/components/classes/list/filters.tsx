import { FilterSchema, getKnownField } from '@pedaki/services/classes/query.model.client.js';
import type { DefaultFilter, FieldType } from '@pedaki/services/utils/query';
import { EditFilterContent, FilterContent } from '~/components/datatable/filters';
import type { EditFilterProps, FilterProps } from '~/components/datatable/filters';
import { useClassesListStore } from '~/store/classes/list/list.store.ts';
import React from 'react';

export const FilterWrapperClasses = <T extends DefaultFilter>(props: FilterProps<T>) => {
  const { columns } = useClassesListStore(store => ({
    columns: store.translatedColumns,
  }));

  return <FilterContent {...props} columns={columns} />;
};

export const EditFilterWrapperClasses = <T extends DefaultFilter>(props: EditFilterProps<T>) => {
  const { columns } = useClassesListStore(store => ({
    columns: store.translatedColumns,
  }));

  const getFieldType = (field: string): FieldType =>
    (field ? getKnownField(field)?.fieldType : undefined) ?? 'text';

  return (
    <EditFilterContent
      {...props}
      columns={columns}
      getFieldType={getFieldType}
      schema={FilterSchema}
    />
  );
};
