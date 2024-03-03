'use client';

import type { UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { hashCode } from '@pedaki/common/utils/hash';
import { Avatar, AvatarFallback } from '@pedaki/design/ui/avatar';
import { Button } from '@pedaki/design/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@pedaki/design/ui/card';
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
import React from 'react';
import dayjs from 'dayjs';
import { useStudentsListStore } from '~/store/students/list/list.store';

type Item = ClassesGenerateStore['studentData'][number];

const ClassesGrid = () => {
  const items = useClassesGenerateStore(store => store.studentData);
  const _setItems = useClassesGenerateStore(store => store.setStudentData);

  const containers = useClassesGenerateStore(store => store.classesData);
  const setContainers = useClassesGenerateStore(store => store.setClassesData);

  const setHasEdited = useClassesGenerateStore(state => state.setHasEdited);

  const [_, startTransition] = React.useTransition();

  const setItems = (items: Item[]) => {
    startTransition(() => {
      setHasEdited(true);
      _setItems(items);
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 @2xl/classes:grid-cols-2 @5xl/classes:grid-cols-3">
      <TooltipProvider disableHoverableContent>
        <MultiContainerSortable
          renderContainer={(container, items, index) => (
            <ContainerWrapperMemo container={container} items={items} index={index} />
          )}
          renderItem={item => <ItemMemo item={item} />}
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
  const itemIds = items.map(item => item.key);
  const isEmpty = items.length === 0;

  return (
    <SortableItem id={container.id} type="container" enabled={false}>
      <Card className={cn('gap-2 py-2', isEmpty && 'border-dashed')} data-container={container.id}>
        <CardHeader>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div>
                {/*TODO: trads*/}
                <CardTitle className={isEmpty ? 'text-soft' : ''}>Classe {index}</CardTitle>
              </div>
            </div>
            <ContainerInfo container={container} />
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
    </SortableItem>
  );
};
const ContainerWrapperMemo = React.memo(
  ContainerWrapper,
  (prev, next) =>
    prev.container.id === next.container.id && prev.items.length === next.items.length,
);

const ContainerInfo = ({ container }: { container: { id: UniqueIdentifier } }) => {
  return <Button variant="ghost-sub">{container.id}</Button>;
};

const twoLettersFromName = (name: unknown) => {
  if (typeof name !== 'string') return '??';
  if (!name || name.length < 2) return name?.toUpperCase() || '??';
  const [first, second] = name.split(' ', 2);
  if (!second) return (first![0]?.toUpperCase() ?? '') + (first![1] ?? '');
  return (first![0]?.toUpperCase() ?? '') + (second[0] ?? '');
};

const Item = ({ item }: { item: Item }) => {
  const nameHash = hashCode(item.firstName);
  const hue = nameHash % 360;
  const hsl = `hsl(${hue}, 100%, 90%)`;

  let diffBirthDateMonth = dayjs().diff(item.birthDate, 'month');
  let diffBirthDateYear = Math.floor(diffBirthDateMonth / 12);
  diffBirthDateMonth = diffBirthDateMonth % 12;


  const properties = useStudentsListStore(store => store.propertyMapping);

  return (
    <SortableItem id={item.key} type="item" className="h-8 w-8 select-none">
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <DragHandle>
              <Avatar style={{ backgroundColor: hsl }} className="h-8 w-8">
                <AvatarFallback>
                  {twoLettersFromName(item.firstName + ' ' + item.lastName)}
                </AvatarFallback>
              </Avatar>
            </DragHandle>
          </span>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="flex flex-col select-none space-y-2">
            <p className='font-medium'>{item.firstName + ' ' + item.lastName}</p>
            <ul>
              <li>
                <span className="font-semibold">Age:</span> {diffBirthDateYear} ans et {diffBirthDateMonth} mois
              </li>
              <li>
                <span className="font-semibold">Sexe:</span> {item.gender}
              </li>
              {item.properties && Object.entries(item.properties).map(([property, value]) => (
                <li key={property}>
                  <span className="font-semibold">{properties[property]?.name ?? '-'}:</span> {value}
                </li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </SortableItem>
  );
};

const ItemMemo = React.memo(Item, (prev, next) => prev.item.key === next.item.key);
export default ClassesGrid;
