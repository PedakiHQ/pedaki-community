import { Button } from '@pedaki/design/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import { IconSettings2 } from '@pedaki/design/ui/icons';
import type { StudentColumnDef } from '~/app/[locale]/(main)/students/(list)/columns.tsx';
import React from 'react';

export const ColumnSelector = ({
  columns,
  columnVisibility,
  setColumnVisibility,
}: {
  columns: StudentColumnDef[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="stroke-primary-main" size="sm" className="ml-auto hidden h-8 lg:flex">
          <IconSettings2 className="mr-2 h-4 w-4" />
          {/*TODO trads*/}
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns
          .filter(column => column.id && column.title)
          .map(column => {
            const isColumnVisible = columnVisibility[column.id];
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={isColumnVisible}
                onCheckedChange={checked => {
                  setColumnVisibility(prev => ({
                    ...prev,
                    [column.id]: checked,
                  }));
                }}
              >
                {column.title}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
