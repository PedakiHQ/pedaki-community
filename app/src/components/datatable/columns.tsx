'use client';

import { Skeleton } from '@pedaki/design/ui/skeleton';
import type { ColumnDef as ReactTableColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/datatable/data-table-column-header.tsx';

export type ColumnDef<T, U extends string = string> = ReactTableColumnDef<T> & {
  loadingCell?: ReactTableColumnDef<T>['cell'];
  id: string;
  accessorKey: U | null;
  title?: string;
};

export const levelCell = <T extends ColumnDef<any>>(
  accessorKey: NonNullable<T['accessorKey']>,
  name: string,
): T => {
  // number between 0 and 100
  // @ts-expect-error: Ignore ts(2322) error, have valid types for our use case
  return {
    id: accessorKey,
    accessorKey,
    title: name,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={name} />;
    },
    loadingCell: () => {
      return <Skeleton className="h-4 w-20" />;
    },
  };
};

export const defaultCell = <T extends ColumnDef<any>>(
  id: string,
  accessorKey: NonNullable<T['accessorKey']>,
  name: string,
): T => {
  // @ts-expect-error: Ignore ts(2322) error, have valid types for our use case
  return {
    id,
    accessorKey,
    title: name,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={name} />;
    },
    loadingCell: () => {
      return <Skeleton className="h-4 w-20" />;
    },
  };
};
