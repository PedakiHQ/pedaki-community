'use client';

import { generatePagination } from '@pedaki/common/utils/generatePagination';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@pedaki/design/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pedaki/design/ui/select';
import type { Field } from '@pedaki/services/students/query.model';
import { columns } from '~/app/[locale]/(main)/students/(list)/columns.tsx';
import type {
  StudentColumnDef,
  StudentData,
} from '~/app/[locale]/(main)/students/(list)/columns.tsx';
import { DataTable } from '~/app/[locale]/(main)/students/(list)/data-table.tsx';
import { api } from '~/server/clients/client.ts';
import { parseAsArrayOf, parseAsInteger, parseAsNumberLiteral, useQueryState } from 'nuqs';
import { createParser, createSerializer } from 'nuqs/parsers';
import React, { useEffect, useMemo, useRef } from 'react';

const sortingParser = createParser({
  parse: (value: string) => {
    const [column, direction] = value.split(':', 2);
    if (direction !== 'asc' && direction !== 'desc') {
      return null;
    }
    return {
      id: column!,
      desc: direction === 'desc',
    };
  },
  serialize: (value: { id: string; desc: boolean }) => {
    return `${value.id}:${value.desc ? 'desc' : 'asc'}`;
  },
});

const possiblesPerPage = [10, 20, 30] as const;
const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsNumberLiteral(possiblesPerPage).withDefault(20),
  sorting: parseAsArrayOf(sortingParser).withDefault([]),
};
const serialize = createSerializer(searchParams);

const Client = () => {
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
  const page = Math.max(1, _page);
  // @ts-expect-error: TODO add translations
  const translatedColumns = React.useMemo(() => columns(null), []);

  // Fetch data
  const { data, isLoading: isQueryLoading } = api.students.getMany.useQuery({
    fields: ['id', 'firstName'],
    orderBy: sorting.map(sort => [sort.id as Field, sort.desc ? 'desc' : ('asc' as const)]),
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
  }, [setPage, meta?.pageCount, _page]);

  const isLoading = isQueryLoading || isTransitionLoading;

  return (
    <div className="flex flex-col gap-4">
      <TableElement
        columns={translatedColumns}
        data={students!}
        isLoading={isLoading}
        perPage={perPage}
        sorting={sorting}
        setSorting={setSorting}
      />
      <div className="flex flex-row items-center justify-between gap-4">
        <span className="shrink-0 text-p-sm text-sub">
          {/*TODO trads*/}
          Showing {perPage} of {meta?.totalCount} results
        </span>
        <PaginationElement page={page} setPage={setPage} totalPages={meta?.pageCount} />
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-p-sm text-sub">
            {/*TODO trads*/}
            Lignes par page
          </span>
          <Select
            onValueChange={async value => {
              const newValue = Number(value) as (typeof possiblesPerPage)[number];
              if (newValue === perPage) return;
              await setPerPage(newValue);
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={perPage}>{perPage}</SelectValue>
            </SelectTrigger>
            <SelectContent>
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
}: {
  columns: StudentColumnDef[];
  data: StudentData[];
  isLoading: boolean;
  perPage: number;
  sorting: { id: string; desc: boolean }[];
  setSorting: React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }[]>>;
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
  const visibleColumns = React.useMemo(() => tableColumns, [tableColumns]);

  return (
    <DataTable
      columns={visibleColumns}
      data={tableData}
      sorting={sorting}
      setSorting={setSorting}
    />
  );
};

const PaginationElement = ({
  page,
  setPage: _setPage,
  totalPages,
}: {
  page: number;
  setPage: (page: number) => void;
  totalPages: number | undefined;
}) => {
  const cacheTotalPage = useRef<number>();
  const shownTotalPages = useMemo(() => {
    if (!totalPages || cacheTotalPage.current === totalPages) return cacheTotalPage.current;
    cacheTotalPage.current = totalPages;
    return cacheTotalPage.current;
  }, [totalPages]);

  const pageUrl = (page: number) => {
    if (!shownTotalPages) return '#';
    return serialize({ page: Math.min(Math.max(1, page), shownTotalPages) });
  };
  const pagination = shownTotalPages
    ? generatePagination(page, shownTotalPages)
    : (['ellipsis_l', 'ellipsis_r'] as const);
  const setPage = (page: number) => {
    if (!shownTotalPages) return;
    _setPage(Math.min(Math.max(1, page), shownTotalPages));
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={pageUrl(page - 1)}
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          />
        </PaginationItem>

        {pagination.map(newPage => {
          return (
            <PaginationItem key={newPage}>
              {newPage === 'ellipsis_l' || newPage === 'ellipsis_r' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={pageUrl(newPage)}
                  isActive={newPage === page}
                  onClick={() => setPage(newPage)}
                >
                  {newPage}
                </PaginationLink>
              )}
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            href={pageUrl(page + 1)}
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.length}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Client;
