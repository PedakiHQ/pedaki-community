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
import IconSettings2 from '@pedaki/design/ui/icons/IconSettings2';
import { useScopedI18n } from '~/locales/client';
import { useClassesGenerateStore } from '~/store/classes/generate/generate.store.ts';
import { useStudentsListStore } from '~/store/students/list/list.store.ts';

const staticColumns = ['firstName', 'gender', 'birthDate'] as const;

export const DisplayActions = () => {
  const displayColumn = useClassesGenerateStore(store => store.displayColumn);
  const setDisplayColumn = useClassesGenerateStore(store => store.setDisplayColumn);

  const properties = useStudentsListStore(store => store.propertyMapping);

  // TODO: trads
  const t = useScopedI18n('todo');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="stroke-primary-main" size="sm" className="shrink-0">
          <IconSettings2 className="mr-2 h-4 w-4" />
          {/* TODO: trads  */}
          <span>Affichage</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>{'subLabel'}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {staticColumns.map(column => {
          const isColumnVisible = displayColumn === column;
          return (
            <ColumnCheckbox
              key={column}
              checked={isColumnVisible}
              onCheckedChange={() => {
                setDisplayColumn(column);
              }}
              title={t(column)}
            />
          );
        })}

        {Object.entries(properties).map(([id, value]) => {
          const key = `properties.${id}`;
          const isColumnVisible = displayColumn === key;
          return (
            <ColumnCheckbox
              key={key}
              checked={isColumnVisible}
              onCheckedChange={() => {
                setDisplayColumn(key);
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
