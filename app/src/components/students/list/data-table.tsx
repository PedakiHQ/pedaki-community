'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@pedaki/design/ui/table';
import { cn } from '@pedaki/design/utils';
import type { ColumnDef, SortingState, VisibilityState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useScopedI18n } from '~/locales/client';
import React from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  sorting: SortingState;
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  columnVisibility?: VisibilityState;
  setColumnVisibility?: React.Dispatch<React.SetStateAction<VisibilityState>>;
  tableClassName?: string;
  onClickRow?: (event: React.MouseEvent<HTMLTableRowElement>, value: TData) => void;
  selectedRows?: Record<string, boolean>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setSorting,
  sorting,
  columnVisibility,
  setColumnVisibility,
  tableClassName,
  onClickRow,
  selectedRows = {},
}: Readonly<DataTableProps<TData, TValue>>) {
  const t = useScopedI18n('students.list.table');
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
      rowSelection: selectedRows,
    },
    defaultColumn: {
      minSize: 0,
    },
  });

  return (
    <Table
      wrapperClassName={cn(
        'relative h-full border-separate border-spacing-0 overflow-auto rounded-md border',
        tableClassName,
      )}
    >
      <TableHeader
        className="sticky top-0 rounded-t-md bg-white"
        style={{
          boxShadow: '0 0px 4px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              return (
                <TableHead key={header.id} style={{ width: `${header.getSize()}px` }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              onClick={onClickRow && (e => onClickRow(e, row.original))}
              data-state={row.getIsSelected() ? 'selected' : undefined}
            >
              {row.getVisibleCells().map(cell => (
                <TableCell
                  key={cell.id}
                  className="py-2"
                  style={{ width: `${cell.column.getSize()}px` }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {t('noResult')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
