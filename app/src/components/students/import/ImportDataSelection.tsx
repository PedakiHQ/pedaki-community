'use client';

import { Button } from '@pedaki/design/ui/button';
import { Card } from '@pedaki/design/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import { IconPanelLeftClose, IconPanelLeftOpen, IconSettings2 } from '@pedaki/design/ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import { cn } from '@pedaki/design/utils';
import {
  possibleFilters,
  serialize,
  useFilterParam,
  useIdParam,
} from '~/components/students/import/parameters.ts';
import { useScopedI18n } from '~/locales/client.ts';
import { useStudentsImportStore } from '~/store/students/import/import.store.ts';
import type { OutputType } from '~api/router/router.ts';
import Link from 'next/link';
import React from 'react';

interface ImportDataSelectionProps {
  items: OutputType['students']['imports']['classes']['getMany'];
  type: 'students' | 'classes';
}

const ImportDataSelection = ({ items, type }: ImportDataSelectionProps) => {
  const [selected] = useIdParam();
  const [filter] = useFilterParam();
  const t = useScopedI18n('students.import.selector');
  const selectorVisible = useStudentsImportStore(state => state.selectorVisible);

  if (!selectorVisible)
    return (
      <Card className="h-max w-max">
        <VisibleSelector />
      </Card>
    );

  const filteredItems = items.filter(item => filter.includes(item.status));
  return (
    <div className="min-w-[370px] shrink-0">
      <Card className="max-h-full gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-label-md font-medium tracking-tight text-soft">
            {t(`title.${type}`)}
          </h2>
          <div className="space-x-2">
            <VisibleSelector />
            <StatusSelector />
          </div>
        </div>
        <div
          role="navigation"
          aria-label="pagination"
          className="max-h-64 overflow-auto pr-4 @4xl/main:max-h-[30rem]"
        >
          <ul className="space-y-1">
            {filteredItems.map(item => {
              const isSelected = selected === item.id;
              return <Item key={item.id} item={item} selected={isSelected} />;
            })}
          </ul>
          <p className="text-label-sm text-sub">
            {filteredItems.length === 0 &&
              (filter.length !== possibleFilters.length
                ? t('noResults.withFilters')
                : t('noResults.withoutFilters'))}
          </p>
        </div>
      </Card>
    </div>
  );
};

const Wrapper = ({ items, type }: ImportDataSelectionProps) => {
  return (
    <TooltipProvider>
      <ImportDataSelection items={items} type={type} />
    </TooltipProvider>
  );
};

const Item = ({
  item,
  selected,
}: {
  item: OutputType['students']['imports']['classes']['getMany'][0];
  selected: boolean;
}) => {
  return (
    <li>
      <Link
        prefetch={false}
        href={serialize({ id: item.id })}
        className={cn('w-full rounded-sm p-2 hover:bg-weak', selected && 'bg-weak')}
        aria-current={selected ? 'page' : undefined}
      >
        {item.name}
      </Link>
    </li>
  );
};

const VisibleSelector = () => {
  const selectorVisible = useStudentsImportStore(state => state.selectorVisible);
  const setSelectorVisible = useStudentsImportStore(state => state.setSelectorVisible);
  const t = useScopedI18n('students.import.selector.visibility');

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost-sub"
          className="h-6 w-6"
          onClick={() => setSelectorVisible(!selectorVisible)}
        >
          <IconPanelLeftOpen className={cn('h-4 w-4', selectorVisible && 'hidden')} />
          <IconPanelLeftClose className={cn('h-4 w-4', !selectorVisible && 'hidden')} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        {t(selectorVisible ? 'hide' : 'show')}
      </TooltipContent>
    </Tooltip>
  );
};

const StatusSelector = () => {
  const [filter, setFilter] = useFilterParam();
  const t = useScopedI18n('students.import.selector.filter');

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost-sub" className="h-6 w-6">
              <IconSettings2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" align="end">
          {t('label')}
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side="left" align="start">
        <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {possibleFilters.map(column => {
          const isVisible = filter.includes(column);
          return (
            <DropdownMenuCheckboxItem
              key={column}
              checked={isVisible}
              onCheckedChange={async checked => {
                await setFilter(prev => {
                  if (checked) {
                    return [...prev, column];
                  }
                  return prev.filter(item => item !== column);
                });
              }}
            >
              {t(`choices.${column}`)}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Wrapper;
