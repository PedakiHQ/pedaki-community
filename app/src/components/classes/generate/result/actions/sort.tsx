'use client';

import { Button } from '@pedaki/design/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import IconCaretSort from '@pedaki/design/ui/icons/IconCaretSort';
import { useScopedI18n } from '~/locales/client';
import { useClassesGenerateStore } from '~/store/classes/generate/generate.store.ts';
import { useStudentsListStore } from '~/store/students/list/list.store.ts';

const staticColumns = ['none', 'firstName', 'gender', 'birthDate'] as const;

export const SortActions = () => {
  const sortBy = useClassesGenerateStore(store => store.sortBy);
  const setSortBy = useClassesGenerateStore(store => store.setSortBy);

  const properties = useStudentsListStore(store => store.propertyMapping);

  const hasData = useClassesGenerateStore(store => store.studentData.length > 0);

  // TODO: trads
  const t = useScopedI18n('todo');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="stroke-primary-main" size="sm" className="shrink-0" disabled={!hasData}>
          <IconCaretSort className="mr-2 h-4 w-4" />
          {/* TODO: trads  */}
          <span>Trier par</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>{'subLabel'}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {staticColumns.map(column => {
          const isColumnVisible = sortBy === column;
          return (
            <ColumnCheckbox
              key={column}
              checked={isColumnVisible}
              onCheckedChange={() => {
                setSortBy(column);
              }}
              title={t(column)}
            />
          );
        })}

        {Object.entries(properties).map(([id, value]) => {
          const key = `properties.${id}` as const;
          const isColumnVisible = sortBy === key;
          return (
            <ColumnCheckbox
              key={key}
              checked={isColumnVisible}
              onCheckedChange={() => {
                setSortBy(key);
              }}
              title={value.name}
            />
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ColumnCheckbox = ({
  checked,
  onCheckedChange,
  title,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  title: string;
}) => {
  return (
    <DropdownMenuCheckboxItem checked={checked} onCheckedChange={onCheckedChange}>
      {title}
    </DropdownMenuCheckboxItem>
  );
};
