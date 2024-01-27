'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pedaki/design/ui/select';
import type { Field } from '@pedaki/services/students/query.model';
import type {
  StudentColumnDef,
  StudentData,
} from '~/app/[locale]/(main)/students/(list)/columns.tsx';
import { generateColumns } from '~/app/[locale]/(main)/students/(list)/columns.tsx';
import { DataTable } from '~/app/[locale]/(main)/students/(list)/data-table.tsx';
import { useScopedI18n } from '~/locales/client.ts';
import { api } from '~/server/clients/client.ts';
import type { OutputType } from '~api/router/router.ts';
import { useQueryState } from 'nuqs';
import React, { useEffect } from 'react';
import { ColumnSelector } from './column-selector';
import { PaginationElement } from './pagination';
import type { PossiblePerPage } from './parameters';
import { possiblesPerPage, searchParams, serialize } from './parameters';

const Client = ({
  propertyMapping,
  classMapping,
  teacherMapping,
}: {
  propertyMapping: OutputType['students']['properties']['getMany'];
  classMapping: OutputType['classes']['getMany'];
  teacherMapping: OutputType['teachers']['getMany'];
}) => {
  const t = useScopedI18n('students.list.table');

  const translatedColumns = React.useMemo(
    () =>
      generateColumns(t, {
        propertyMapping,
        classMapping,
        teacherMapping,
      }),
    [propertyMapping, classMapping, teacherMapping],
  );

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

  const generateUrl = (data: {
    page?: number;
    perPage?: PossiblePerPage;
    sorting?: { id: string; desc: boolean }[];
    columns?: Record<string, boolean>;
  }) => {
    return serialize({
      page: data.page ?? page,
      perPage: data.perPage ?? perPage,
      sorting: data.sorting ?? sorting,
      columns: data.columns ?? columnVisibility,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <ColumnSelector
        columns={translatedColumns}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
      />
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
      <div className="grid grid-cols-12 items-center justify-between gap-4">
        <span className="col-span-6 mx-auto text-p-sm text-sub lg:col-span-3 lg:ml-0">
          {t('footer.showing', {
            from: isLoading ? '0' : (page - 1) * perPage + 1,
            to: isLoading ? '0' : Math.min(page * perPage, meta?.totalCount ?? 0),
            total: isLoading ? '0' : meta?.totalCount,
          })}
        </span>
        <div className="order-last col-span-12 lg:order-none lg:col-span-6">
          <PaginationElement
            page={page}
            setPage={setPage}
            totalPages={meta?.pageCount}
            generateUrl={generateUrl}
          />
        </div>
        <div className="col-span-6 mx-auto flex items-center gap-2 lg:col-span-3 lg:mr-0">
          <span className="text-p-sm text-sub">{t('footer.perPage')}</span>
          <Select
            onValueChange={async value => {
              const newValue = Number(value) as PossiblePerPage;
              if (newValue === perPage) return;
              await setPerPage(newValue);
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={perPage}>{perPage}</SelectValue>
            </SelectTrigger>
            <SelectContent side="left" align="start">
              {possiblesPerPage.map(value => (
                <SelectItem key={value} value={String(value)}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
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
