'use client';

import type { Field, FieldType } from '@pedaki/services/students/query.model';
import type {
  StudentColumnDef,
  StudentData,
} from '~/app/[locale]/(main)/students/(list)/columns.tsx';
import { generateColumns } from '~/app/[locale]/(main)/students/(list)/columns.tsx';
import { DataTable } from '~/app/[locale]/(main)/students/(list)/data-table.tsx';
import Filters from '~/app/[locale]/(main)/students/(list)/filters.tsx';
import Footer from '~/app/[locale]/(main)/students/(list)/footer.tsx';
import { useScopedI18n } from '~/locales/client.ts';
import { api } from '~/server/clients/client.ts';
import { useStudentsListStore } from '~/store/students/list/list.store.ts';
import { useQueryState } from 'nuqs';
import React, { useEffect, useMemo } from 'react';
import { ColumnSelector } from './column-selector';
import { searchParams } from './parameters';

const Client = () => {
  const t = useScopedI18n('students.list.table');

  const { setTranslatedColumns, propertyMapping, classMapping, teacherMapping } =
    useStudentsListStore(store => ({
      propertyMapping: store.propertyMapping,
      classMapping: store.classMapping,
      teacherMapping: store.teacherMapping,
      setTranslatedColumns: store.setTranslatedColumns,
    }));

  const translatedColumns = useMemo(() => {
    const result = generateColumns(t, {
      propertyMapping,
      classMapping,
      teacherMapping,
    });
    setTranslatedColumns(result);
    return result;
  }, [t, propertyMapping, classMapping, teacherMapping, setTranslatedColumns]);

  // Loading state
  const [isTransitionLoading, startTransition] = React.useTransition();
  const [_page, setPage] = useQueryState(
    'page',
    searchParams.page.withOptions({ history: 'push', startTransition }),
  );
  const [sorting, setSorting] = useQueryState(
    'sorting',
    searchParams.sorting.withOptions({
      history: 'replace',
      startTransition,
    }),
  );
  const [filters, setFilters] = useQueryState(
    'filter',
    searchParams.filters.withOptions({
      history: 'push',
      startTransition,
    }),
  );
  const [perPage, setPerPage] = useQueryState(
    'perPage',
    searchParams.perPage.withOptions({
      history: 'replace',
      startTransition,
    }),
  );
  const [columnVisibility, setColumnVisibility] = useQueryState(
    'columns',
    searchParams.columns.withOptions({
      history: 'replace',
      startTransition,
    }),
  );
  const visibleColumns = React.useMemo(() => {
    return Object.entries(columnVisibility)
      .filter(([, visible]) => visible)
      .map(([column]) => column);
  }, [columnVisibility]);

  const page = Math.max(1, _page);

  // Fetch data
  const { data, isLoading: isQueryLoading } = api.students.getMany.useQuery({
    // @ts-expect-error: TODO fix types
    fields: [
      ...new Set(
        visibleColumns.map(column => translatedColumns.find(col => col.id === column)?.accessorKey),
      ),
    ].filter(Boolean),
    orderBy: sorting.map(sort => [
      sort.id.replace('_', '.') as Field,
      sort.desc ? 'desc' : ('asc' as const),
    ]),
    where: filters,
    pagination: {
      page,
      limit: perPage,
    },
  });

  const students = data?.data;
  const meta = data?.meta;

  useEffect(() => {
    if (meta?.pageCount && page > meta.pageCount) {
      void setPage(meta.pageCount);
    }
  }, [setPage, meta?.pageCount, page]);

  const isLoading = isQueryLoading || isTransitionLoading;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Filters filters={filters} setFilters={setFilters} />
        <ColumnSelector
          columns={translatedColumns}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
      </div>

      <TableElement
        columns={translatedColumns}
        data={students}
        isLoading={isLoading}
        perPage={perPage}
        sorting={sorting}
        setSorting={setSorting}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
      />
      <Footer
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        meta={meta}
        sorting={sorting}
        columnVisibility={columnVisibility}
      />
    </div>
  );
};

const TableElement = ({
  columns,
  data,
  isLoading,
  perPage,
  sorting,
  setSorting,
  columnVisibility,
  setColumnVisibility,
}: {
  columns: StudentColumnDef[];
  data: StudentData[];
  isLoading: boolean;
  perPage: number;
  sorting: { id: string; desc: boolean }[];
  setSorting: React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }[]>>;
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) => {
  const tableColumns = React.useMemo(
    () =>
      isLoading
        ? columns.map(col => {
            return {
              ...col,
              cell: col.loadingCell ?? col.cell,
            };
          })
        : columns,
    [isLoading, columns],
  );

  const tableData = React.useMemo(() => {
    if (isLoading || !data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Array(perPage).fill({});
    }

    return data;
  }, [isLoading, data, perPage]);

  return (
    <DataTable
      columns={tableColumns.filter(col => !col.accessorKey || columnVisibility[col.id])}
      data={tableData}
      sorting={sorting}
      setSorting={setSorting}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
    />
  );
};

export default Client;
