'use client';

import { Button } from '@pedaki/design/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import { IconMoreHorizontal } from '@pedaki/design/ui/icons';
import { Skeleton } from '@pedaki/design/ui/skeleton';
import type { GetManyStudentsOutput } from '@pedaki/services/students/student.model';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/app/[locale]/(main)/students/(list)/data-table-column-header.tsx';
import type { UseScopedI18nType } from '~/locales/client.ts';

export type StudentData = GetManyStudentsOutput['data'][number];
export type StudentColumnDef = ColumnDef<StudentData> & {
  loadingCell?: ColumnDef<StudentData>['cell'];
};
export const columns: (t: UseScopedI18nType<'tutorial'>) => StudentColumnDef[] = () => [
  {
    accessorKey: 'id',
    header: 'Status',
    size: 10,
    loadingCell: ({ row }) => {
      return 'Loading...';
    },
  },
  {
    accessorKey: 'firstName',
    size: 20,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="First name" />;
    },
    loadingCell: ({ row }) => {
      return <Skeleton className="h-4 w-20" />;
    },
    // cell: ({ row }) => {
    //     return <Skeleton className="w-20 h-4" />
    // }
  },
  {
    id: 'actions',
    size: 30,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <IconMoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export const levelCell = (accessorKey: string, name: string): StudentColumnDef => {
  // number between 0 and 100
  return {
    accessorKey,
    size: 20,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={name} />;
    },
    loadingCell: ({ row }) => {
      return <Skeleton className="h-4 w-20" />;
    },
  };
};

export const defaultCell = (accessorKey: string, name: string): StudentColumnDef => {
  return {
    accessorKey,
    size: 20,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={name} />;
    },
    loadingCell: ({ row }) => {
      return <Skeleton className="h-4 w-20" />;
    },
  };
};
