import { Button } from '@pedaki/design/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import { IconArrowDown, IconArrowUp, IconCaretSort, IconEyeNone } from '@pedaki/design/ui/icons';
import { cn } from '@pedaki/design/utils';
import type { Column } from '@tanstack/react-table';
import { useScopedI18n } from '~/locales/client';
import type { HTMLAttributes } from 'react';

interface DataTableColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: Readonly<DataTableColumnHeaderProps<TData, TValue>>) {
  const t = useScopedI18n('components.datatable.columnHeader');
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost-sub" size="sm" className="data-[state=open]:bg-accent -ml-3 h-8">
            <span className="whitespace-nowrap">{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <IconArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <IconArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <IconCaretSort className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => column.toggleSorting(false)}
            disabled={column.getIsSorted() === 'asc'}
          >
            <IconArrowUp className="text-muted-foreground/70 mr-1 h-3.5 w-3.5" />
            {t('asc')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.toggleSorting(true)}
            disabled={column.getIsSorted() === 'desc'}
          >
            <IconArrowDown className="text-muted-foreground/70 mr-1 h-3.5 w-3.5" />
            {t('desc')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <IconEyeNone className="text-muted-foreground/70 mr-1 h-3.5 w-3.5" />
            {t('hide')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
