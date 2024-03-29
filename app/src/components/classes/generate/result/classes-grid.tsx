'use client';

import type { UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Avatar, AvatarFallback } from '@pedaki/design/ui/avatar';
import { Button } from '@pedaki/design/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@pedaki/design/ui/card';
import type { IconProps } from '@pedaki/design/ui/icons';
import { Separator } from '@pedaki/design/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import { cn } from '@pedaki/design/utils';
import { MultiContainerSortable } from '~/components/dnd/MultiContainerSortable.tsx';
import { DragHandle, SortableItem } from '~/components/dnd/SortableItem.tsx';
import { useClassesGenerateStore } from '~/store/classes/generate/generate.store.ts';
import type { ClassesGenerateStore } from '~/store/classes/generate/generate.store.ts';
import { useStudentsListStore } from '~/store/students/list/list.store';
import dayjs from 'dayjs';
import deepEqual from 'fast-deep-equal/react';
import React from 'react';

// TODO: move to @pedaki/design/ui/icons
// Lucide icon: https://lucide.dev/icons/slash
const IconSlash = (props: IconProps) => (
  <svg width="512" height="512" viewBox="0 0 24 24" {...props}>
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M22 2 2 22"
    />
  </svg>
);

type Item = ClassesGenerateStore['studentData'][number];

const ClassesGrid = () => {
  const items = useClassesGenerateStore(store => store.studentData);
  const _setItems = useClassesGenerateStore(store => store.setStudentData);

  const containers = useClassesGenerateStore(store => store.classesData);
  const setContainers = useClassesGenerateStore(store => store.setClassesData);

  const setHasEdited = useClassesGenerateStore(state => state.setHasEdited);

  const setItems = (items: Item[]) => {
    setHasEdited(true);
    _setItems(items);
  };

  return (
    <div className="grid grid-cols-1 gap-4 @2xl/classes:grid-cols-2 @5xl/classes:grid-cols-3">
      <TooltipProvider disableHoverableContent>
        <MultiContainerSortable
          renderContainer={(container, items, index) => (
            <ContainerWrapper container={container} items={items} index={index} />
          )}
          renderItem={item => <Item item={item} />}
          containers={containers}
          onChangeContainers={setContainers}
          items={items}
          onChangeItems={setItems}
        />
      </TooltipProvider>
    </div>
  );
};

const ContainerWrapper = ({
  container,
  items,
  index,
}: {
  container: { id: UniqueIdentifier };
  items: Item[];
  index: number | null;
}) => {
  return (
    <SortableItem id={container.id} type="container" enabled={false}>
      <ContainerBodyMemo container={container} items={items} index={index} />
    </SortableItem>
  );
};

const ContainerBody = ({
  container,
  items,
  index,
}: {
  container: { id: UniqueIdentifier };
  items: Item[];
  index: number | null;
}) => {
  const itemIds = items.map(item => item.key);
  const isEmpty = items.length === 0;

  return (
    <Card className={cn('gap-2 py-2', isEmpty && 'border-dashed')} data-container={container.id}>
      <CardHeader>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <div>
              {/*TODO: trads*/}
              <CardTitle className={isEmpty ? 'text-soft' : ''}>Classe {index}</CardTitle>
            </div>
          </div>
          <ContainerInfo items={items} />
        </div>
      </CardHeader>
      <Separator className="-ml-4 w-[calc(100%+2rem)]" />
      <CardContent className="flex flex-row ">
        <ul className="flex min-h-8 flex-wrap gap-2 overflow-hidden">
          <SortableContext items={itemIds}>
            {items.map(item => (
              <Item key={item.key} item={item} />
            ))}
          </SortableContext>
        </ul>
      </CardContent>
    </Card>
  );
};

const ContainerBodyMemo = React.memo(
  ContainerBody,
  (prev, next) => prev.container.id === next.container.id && deepEqual(prev.items, next.items),
);

const ContainerInfo = ({ items }: { items: Item[] }) => {
  const count = items.length;
  // TODO: trads
  // TODO: pluralize
  return (
    <Button asChild variant="ghost-sub">
      <span>{count} élèves</span>
    </Button>
  );
};

const twoLettersFromName = (name: unknown) => {
  // TODO: move in utils
  if (typeof name !== 'string') return '??';
  if (!name || name.length < 2) return name?.toUpperCase() || '??';
  const [first, second] = name.split(' ', 2);
  if (!second) return (first![0]?.toUpperCase() ?? '') + (first![1] ?? '');
  return (first![0]?.toUpperCase() ?? '') + (second[0] ?? '');
};

const Item = ({ item }: { item: Item }) => {
  return (
    <SortableItem id={item.key} type="item" className="h-8 w-8 select-none">
      <ItemBodyMemo item={item} />
    </SortableItem>
  );
};

const ItemBody = ({ item }: { item: Item }) => {
  const displayColumn = useClassesGenerateStore(store => store.displayColumn);
  const getColorForStudent = useClassesGenerateStore(store => store.getColorForStudent);
  const color = getColorForStudent(item);

  let diffBirthDateMonth = dayjs().diff(item.birthDate, 'month');
  const diffBirthDateYear = Math.floor(diffBirthDateMonth / 12);
  diffBirthDateMonth = diffBirthDateMonth % 12;

  const properties = useStudentsListStore(store => store.propertyMapping);

  const visibleName = (() => {
    if (displayColumn === 'firstName') {
      return twoLettersFromName(item.firstName + ' ' + item.lastName);
    }
    if (displayColumn === 'gender') {
      return item.gender;
    }
    if (displayColumn === 'birthDate') {
      return `${diffBirthDateYear}`;
    }
    if (displayColumn.startsWith('properties.')) {
      const id = displayColumn.split('.', 2)[1]!;
      return item.properties?.[id];
    }
  })();

  const hasNoValue = visibleName == null || visibleName === 'undefined';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <DragHandle>
            <Avatar
              style={{ backgroundColor: color }}
              className={cn('h-8 w-8 border border-dashed', !hasNoValue && 'border-transparent')}
            >
              <AvatarFallback>
                {hasNoValue ? <IconSlash className="p-2 opacity-10" /> : visibleName}
              </AvatarFallback>
            </Avatar>
          </DragHandle>
        </span>
      </TooltipTrigger>
      <TooltipContent side="right">
        <div className="flex select-none flex-col space-y-2">
          <p className="font-medium">{item.firstName + ' ' + item.lastName}</p>
          <ul>
            <li>
              <span className="font-semibold">Age:</span> {diffBirthDateYear} ans et{' '}
              {diffBirthDateMonth} mois
            </li>
            <li>
              <span className="font-semibold">Sexe:</span> {item.gender}
            </li>
            {item.properties &&
              Object.entries(item.properties).map(([property, value]) => (
                <li key={property}>
                  <span className="font-semibold">{properties[property]?.name ?? '-'}:</span>{' '}
                  {value ?? '-'}
                </li>
              ))}
          </ul>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const ItemBodyMemo = React.memo(ItemBody, (prev, next) => prev.item.key === next.item.key);
export default ClassesGrid;
