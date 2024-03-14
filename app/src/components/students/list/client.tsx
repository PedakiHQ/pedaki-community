'use client';

import { cn } from '@pedaki/design/utils';
import type { Field } from '@pedaki/services/students/query.model';
import {
  useColumnsVisibilityParams,
  useFilterParams,
  usePageParams,
  usePerPageParams,
  useSortingParams,
} from '~/components/datatable/client';
import { ColumnSelector } from '~/components/datatable/column-selector';
import { DataTable } from '~/components/datatable/data-table';
import Filters from '~/components/datatable/filters';
import Footer from '~/components/datatable/footer';
import type { StudentColumnDef, StudentData } from '~/components/students/list/columns.tsx';
import { generateColumns } from '~/components/students/list/columns.tsx';
import { searchParams, serialize } from '~/components/students/list/parameters.ts';
import { useScopedI18n } from '~/locales/client.ts';
import { api } from '~/server/clients/client.ts';
import { useStudentsListStore } from '~/store/students/list/list.store.ts';
import React, { useMemo } from 'react';

interface ClientProps {
  className?: string;
  onClickRow?: (event: React.MouseEvent<HTMLTableRowElement>, value: StudentData) => void;
  actionColumn?: (data: StudentData) => React.ReactNode;
  selectedRows?: Record<StudentData['id'], boolean>;
  onDataChange?: (students: Object[], meta: { totalCount: number }) => void; // TODO: type this
}

const Client = ({
  className,
  onClickRow,
  actionColumn,
  selectedRows,
  onDataChange,
}: ClientProps) => {
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
  const [_page, setPage] = usePageParams(searchParams, startTransition);
  const [sorting, setSorting] = useSortingParams(searchParams, startTransition);
  const [filters, setFilters] = useFilterParams(searchParams, startTransition);
  const [perPage, setPerPage] = usePerPageParams(searchParams, startTransition);
  const [columnVisibility, setColumnVisibility] = useColumnsVisibilityParams(
    searchParams,
    startTransition,
  );
  const visibleColumns = React.useMemo(() => {
    return Object.entries(columnVisibility)
      .filter(([, visible]) => visible)
      .map(([column]) => column);
  }, [columnVisibility]);

  const page = Math.max(1, _page);

  // Fetch data
  const {
    data,
    isLoading: isQueryLoading,
    isError,
  } = api.students.getMany.useQuery({
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
  students && meta && onDataChange?.(students, meta);

  if (meta?.pageCount && page > meta.pageCount) {
    void setPage(meta.pageCount);
  }

  const isLoading = isQueryLoading || isTransitionLoading || isError;

  return (
    <div className={cn('flex h-full flex-col gap-4 overflow-y-auto', className)}>
      <div className="flex gap-4 pt-1 pr-1">
        <Filters filters={filters} setFilters={setFilters} type="students" />
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
        onClickRow={onClickRow}
        actionColumn={actionColumn}
        selectedRows={selectedRows}
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
        perPageLabel={t('footer.perPage')}
        serialize={serialize}
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
  onClickRow,
  actionColumn,
  selectedRows,
}: {
  columns: StudentColumnDef[];
  data: StudentData[] | undefined;
  isLoading: boolean;
  perPage: number;
  sorting: { id: string; desc: boolean }[];
  setSorting: React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }[]>>;
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onClickRow?: ClientProps['onClickRow'];
  actionColumn?: ClientProps['actionColumn'];
  selectedRows?: ClientProps['selectedRows'];
}) => {
  const t = useScopedI18n('students.list.table');

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
      noResultLabel={t('noResult')}
      columns={tableColumns.filter(col => !col.accessorKey || columnVisibility[col.id])}
      data={tableData}
      sorting={sorting}
      setSorting={setSorting}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      onClickRow={onClickRow}
      selectedRows={selectedRows}
      actionColumn={actionColumn}
    />
  );
};

export default Client;
