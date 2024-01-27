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
import type { Field } from '@pedaki/services/students/query.model';
import type { GetManyStudentsOutput } from '@pedaki/services/students/student.model';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/app/[locale]/(main)/students/(list)/data-table-column-header.tsx';
import type { UseScopedI18nType } from '~/locales/client.ts';
import type { OutputType } from '~api/router/router.ts';

export type StudentData = GetManyStudentsOutput['data'][number];
export type StudentColumnDef = ColumnDef<StudentData> & {
  loadingCell?: ColumnDef<StudentData>['cell'];
  id: string;
  accessorKey: Field | null;
  title?: string;
};
const actionCell: StudentColumnDef = {
  id: 'actions',
  accessorKey: null,
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
};

const levelCell = (accessorKey: Field, name: string): StudentColumnDef => {
  // number between 0 and 100
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

const defaultCell = (id: string, accessorKey: Field | null, name: string): StudentColumnDef => {
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

export const generateColumns = (
  t: UseScopedI18nType<'tutorial'>,
  {
    propertiesMapping,
    classesMapping,
    teachersMapping,
  }: {
    propertiesMapping: OutputType['students']['properties']['getMany'];
    classesMapping: OutputType['classes']['getMany'];
    teachersMapping: OutputType['teachers']['getMany'];
  },
) => {
  const res: StudentColumnDef[] = [
    defaultCell('firstName', 'firstName', 'firstName'), // TODO: trads
    defaultCell('lastName', 'lastName', 'lastName'), // TODO: trads
    {
      ...defaultCell('class.name', `class.id`, 'class name'), // TODO: trads
      cell: ({ row }) => {
        const data = row.original;
        return <div>{classesMapping[data.class.id!]?.name ?? '-'}</div>;
      },
    },
    {
      ...defaultCell(`class.teachers.name`, `class.teachers.id`, 'teachers name'), // TODO: trads
      cell: ({ row }) => {
        const data = row.original;
        const teachers = data.class.teachers
          ?.map(({ id }) => teachersMapping[id]?.name)
          .filter(Boolean)
          .join(', ');
        return <div>{teachers ?? '-'}</div>;
      },
    },
  ];

  // add all properties cell
  Object.entries(propertiesMapping).forEach(([key, value]) => {
    if (value.type === 'LEVEL') {
      // TODO: add mapping
      res.push(levelCell(`properties.${key}`, value.name));
    } else {
      res.push(defaultCell(`properties.${key}`, `properties.${key}`, value.name));
    }
  });

  res.push(actionCell);

  return res;
};
