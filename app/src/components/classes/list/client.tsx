'use client';

import { cn } from '@pedaki/design/utils';
import type { Field } from '@pedaki/services/classes/query.model';
import type { ClassColumnDef, ClassData } from '~/components/classes/list/columns.tsx';
import { generateColumns } from '~/components/classes/list/columns.tsx';
import { searchParams, serialize } from '~/components/classes/list/parameters.ts';
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
import { useScopedI18n } from '~/locales/client.ts';
import { api } from '~/server/clients/client.ts';
import { useClassesListStore } from '~/store/classes/list/list.store.ts';
import React, { useEffect, useMemo } from 'react';

const Client = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const t = useScopedI18n('classes.list.table');

  const {
    setTranslatedColumns,
    teacherMapping,
    academicYearMapping,
    classBranchMapping,
    classLevelMapping,
  } = useClassesListStore(store => ({
    teacherMapping: store.teacherMapping,
    academicYearMapping: store.academicYearMapping,
    classBranchMapping: store.classBranchMapping,
    classLevelMapping: store.classLevelMapping,
    setTranslatedColumns: store.setTranslatedColumns,
  }));

  const translatedColumns = useMemo(() => {
    const result = generateColumns(t, {
      teacherMapping,
      academicYearMapping,
      classBranchMapping,
      classLevelMapping,
    });
    setTranslatedColumns(result);
    return result;
  }, [
    t,
    teacherMapping,
    academicYearMapping,
    classBranchMapping,
    classLevelMapping,
    setTranslatedColumns,
  ]);

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
  const { data, isLoading: isQueryLoading } = api.classes.getPaginatedMany.useQuery({
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

  const classes = data?.data;
  const meta = data?.meta;

  useEffect(() => {
    if (meta?.pageCount && page > meta.pageCount) {
      void setPage(meta.pageCount);
    }
  }, [setPage, meta?.pageCount, page]);

  const isLoading = isQueryLoading || isTransitionLoading;

  return (
    <div className={cn('flex h-full flex-col gap-4', className)}>
      <div className="flex gap-4 pr-1 pt-1">
        <Filters filters={filters} setFilters={setFilters} type="classes" />
        <ColumnSelector
          columns={translatedColumns}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
      </div>
      <TableElement
        columns={translatedColumns}
        data={classes}
        isLoading={isLoading}
        perPage={perPage}
        sorting={sorting}
        setSorting={setSorting}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
      />
      <Footer
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
}: {
  columns: ClassColumnDef[];
  data: ClassData[] | undefined;
  isLoading: boolean;
  perPage: number;
  sorting: { id: string; desc: boolean }[];
  setSorting: React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }[]>>;
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) => {
  const t = useScopedI18n('classes.list.table');

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
    />
  );
};

export default Client;
