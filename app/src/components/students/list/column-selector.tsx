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
import type { StudentColumnDef } from '~/components/students/list/columns.tsx';
import { useScopedI18n } from '~/locales/client.ts';
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
  const t = useScopedI18n('components.datatable.hide.columns');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="stroke-primary-main" size="sm" className="shrink-0">
          <IconSettings2 className="mr-2 h-4 w-4" />
          {t('label')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>{t('subLabel')}</DropdownMenuLabel>
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
