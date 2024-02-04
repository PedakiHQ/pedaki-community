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
  useIdParam,
  useVisibleParams,
} from '~/components/students/import/parameters.ts';
import { useScopedI18n } from '~/locales/client.ts';
import { useStudentsImportStore } from '~/store/students/import/import.store.ts';
import type { StudentsImportStore } from '~/store/students/import/import.store.ts';
import Link from 'next/link';
import React, { useEffect } from 'react';

interface ImportDataSelectionProps {
  items: (StudentsImportStore['items'][0] & { label: string })[];
  type: 'students' | 'classes';
}

const ImportDataSelection = ({ items, type }: ImportDataSelectionProps) => {
  const [selected, setSelected] = useIdParam();

  useEffect(() => {
    if (selected === null) {
      const firstNonEmpty = items.find(item => item.status === 'PENDING');
      if (firstNonEmpty) {
        void setSelected(firstNonEmpty?.id);
      }
    }
  }, [selected, setSelected, items]);

  const [filter] = useVisibleParams();
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
    <div className="shrink-0 @4xl/main:w-[320px]">
      <Card className="max-h-full gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-label-sm font-medium text-soft">{t(`title.${type}`)}</h2>
          <div className="space-x-2">
            <VisibleSelector />
            <StatusSelector />
          </div>
        </div>
        <div
          role="navigation"
          aria-label="pagination"
          className="max-h-64 overflow-auto pr-4 @4xl/main:max-h-[40vh]"
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

const Wrapper = (props: ImportDataSelectionProps) => {
  const setItems = useStudentsImportStore(state => state.setItems);
  useEffect(() => {
    setItems(props.items as StudentsImportStore['items']);
  }, [props.items, setItems]);
  return (
    <TooltipProvider>
      <ImportDataSelection {...props} />
    </TooltipProvider>
  );
};

const Item = ({
  item,
  selected,
}: {
  item: ImportDataSelectionProps['items'][0];
  selected: boolean;
}) => {
  const [visible] = useVisibleParams();

  return (
    <li>
      <Link
        href={serialize({ id: item.id, visible })}
        className={cn('w-full rounded-sm p-2 text-label-sm hover:bg-weak', selected && 'bg-weak')}
        aria-current={selected ? 'page' : undefined}
      >
        {item.label}
        {/*  TODO badge visibility when the filter is > 0*/}
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
  const [filter, setFilter] = useVisibleParams();
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
