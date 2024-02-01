'use client';

import { cn } from '@pedaki/design/utils';
import type { Field } from '@pedaki/services/classes/query.model';
import { ColumnSelector } from '~/components/classes/list/column-selector.tsx';
import type { ClassColumnDef, ClassData } from '~/components/classes/list/columns.tsx';
import { generateColumns } from '~/components/classes/list/columns.tsx';
import { DataTable } from '~/components/classes/list/data-table.tsx';
import Filters from '~/components/classes/list/filters.tsx';
import Footer from '~/components/classes/list/footer.tsx';
import { searchParams } from '~/components/classes/list/parameters.ts';
import { useScopedI18n } from '~/locales/client.ts';
import { api } from '~/server/clients/client.ts';
import { useClassesListStore } from '~/store/classes/list/list.store.ts';
import { useQueryState } from 'nuqs';
import React, { useEffect, useMemo } from 'react';

const Client = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const t = useScopedI18n('classes.list.table');

  //   const { setTranslatedColumns, propertyMapping, classMapping, teacherMapping } =
  //     useClassesListStore(store => ({
  //       propertyMapping: store.propertyMapping,
  //       classMapping: store.classMapping,
  //       teacherMapping: store.teacherMapping,
  //       setTranslatedColumns: store.setTranslatedColumns,
  //     }));

  //   const translatedColumns = useMemo(() => {
  //     const result = generateColumns(t, {
  //       propertyMapping,
  //       classMapping,
  //       teacherMapping,
  //     });
  //     setTranslatedColumns(result);
  //     return result;
  //   }, [t, propertyMapping, classMapping, teacherMapping, setTranslatedColumns]);

  //   // Loading state
  //   const [isTransitionLoading, startTransition] = React.useTransition();
  //   const [_page, setPage] = useQueryState(
  //     'page',
  //     searchParams.page.withOptions({ history: 'push', startTransition }),
  //   );
  //   const [sorting, setSorting] = useQueryState(
  //     'sorting',
  //     searchParams.sorting.withOptions({
  //       history: 'replace',
  //       startTransition,
  //     }),
  //   );
  //   const [filters, setFilters] = useQueryState(
  //     'filter',
  //     searchParams.filters.withOptions({
  //       history: 'push',
  //       startTransition,
  //     }),
  //   );
  //   const [perPage, setPerPage] = useQueryState(
  //     'perPage',
  //     searchParams.perPage.withOptions({
  //       history: 'replace',
  //       startTransition,
  //     }),
  //   );
  //   const [columnVisibility, setColumnVisibility] = useQueryState(
  //     'columns',
  //     searchParams.columns.withOptions({
  //       history: 'replace',
  //       startTransition,
  //     }),
  //   );
  //   const visibleColumns = React.useMemo(() => {
  //     return Object.entries(columnVisibility)
  //       .filter(([, visible]) => visible)
  //       .map(([column]) => column);
  //   }, [columnVisibility]);

  //   const page = Math.max(1, _page);

  //   // Fetch data
  //   const { data, isLoading: isQueryLoading } = api.classes.getMany.useQuery({
  //     fields: [
  //       ...new Set(
  //         visibleColumns.map(column => translatedColumns.find(col => col.id === column)?.accessorKey),
  //       ),
  //     ].filter(Boolean),
  //     orderBy: sorting.map(sort => [
  //       sort.id.replace('_', '.') as Field,
  //       sort.desc ? 'desc' : ('asc' as const),
  //     ]),
  //     where: filters,
  //     pagination: {
  //       page,
  //       limit: perPage,
  //     },
  //   });

  //   const classes = data?.data;
  //   const meta = data?.meta;

  //   useEffect(() => {
  //     if (meta?.pageCount && page > meta.pageCount) {
  //       void setPage(meta.pageCount);
  //     }
  //   }, [setPage, meta?.pageCount, page]);

  //   const isLoading = isQueryLoading || isTransitionLoading;

  //   return (
  //     <div className={cn('flex h-full flex-col gap-4', className)}>
  //       <div className="flex gap-4">
  //         <Filters filters={filters} setFilters={setFilters} />
  //         <ColumnSelector
  //           columns={translatedColumns}
  //           columnVisibility={columnVisibility}
  //           setColumnVisibility={setColumnVisibility}
  //         />
  //       </div>
  //       <TableElement
  //         columns={translatedColumns}
  //         data={classes}
  //         isLoading={isLoading}
  //         perPage={perPage}
  //         sorting={sorting}
  //         setSorting={setSorting}
  //         columnVisibility={columnVisibility}
  //         setColumnVisibility={setColumnVisibility}
  //       />
  //       <Footer
  //         isLoading={isLoading}
  //         page={page}
  //         setPage={setPage}
  //         perPage={perPage}
  //         setPerPage={setPerPage}
  //         meta={meta}
  //         sorting={sorting}
  //         columnVisibility={columnVisibility}
  //       />
  //     </div>
  //   );
  // };

  // const TableElement = ({
  //   columns,
  //   data,
  //   isLoading,
  //   perPage,
  //   sorting,
  //   setSorting,
  //   columnVisibility,
  //   setColumnVisibility,
  // }: {
  //   columns: ClassColumnDef[];
  //   data: ClassData[] | undefined;
  //   isLoading: boolean;
  //   perPage: number;
  //   sorting: { id: string; desc: boolean }[];
  //   setSorting: React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }[]>>;
  //   columnVisibility: Record<string, boolean>;
  //   setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  // }) => {
  //   const tableColumns = React.useMemo(
  //     () =>
  //       isLoading
  //         ? columns.map(col => {
  //             return {
  //               ...col,
  //               cell: col.loadingCell ?? col.cell,
  //             };
  //           })
  //         : columns,
  //     [isLoading, columns],
  //   );

  //   const tableData = React.useMemo(() => {
  //     if (isLoading || !data) {
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //       return Array(perPage).fill({});
  //     }

  //     return data;
  //   }, [isLoading, data, perPage]);

  return (
    // <DataTable
    //   columns={tableColumns.filter(col => !col.accessorKey || columnVisibility[col.id])}
    //   data={tableData}
    //   sorting={sorting}
    //   setSorting={setSorting}
    //   columnVisibility={columnVisibility}
    //   setColumnVisibility={setColumnVisibility}
    // />
    <></>
  );
};

export default Client;
