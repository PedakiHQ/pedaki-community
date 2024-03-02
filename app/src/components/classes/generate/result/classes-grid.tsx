'use client';

import type { UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { hashCode } from '@pedaki/common/utils/hash';
import { Avatar, AvatarFallback } from '@pedaki/design/ui/avatar';
import { Button } from '@pedaki/design/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@pedaki/design/ui/card';
import { Separator } from '@pedaki/design/ui/separator';
import { cn } from '@pedaki/design/utils';
import { MultiContainerSortable } from '~/components/dnd/MultiContainerSortable.tsx';
import { DragHandle, SortableItem } from '~/components/dnd/SortableItem.tsx';
import { useClassesGenerateStore } from '~/store/classes/generate/generate.store.ts';
import type { ClassesGenerateStore } from '~/store/classes/generate/generate.store.ts';
import React from 'react';

type Item = ClassesGenerateStore['studentData'][number];

const ClassesGrid = () => {
  const items = useClassesGenerateStore(store => store.studentData);
  const _setItems = useClassesGenerateStore(store => store.setStudentData);

  const containers = useClassesGenerateStore(store => store.classesData);
  const setContainers = useClassesGenerateStore(store => store.setClassesData);

  console.log({ items, containers });

  const setHasEdited = useClassesGenerateStore(state => state.setHasEdited);

  const setItems = (items: Item[]) => {
    setHasEdited(true);
    _setItems(items);
  };

  return (
    <div className="grid grid-cols-1 gap-4 @2xl/classes:grid-cols-2 @5xl/classes:grid-cols-3">
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
          <ul className="grid min-h-8 grid-cols-11 gap-2 overflow-hidden @2xl/classes:grid-cols-7">
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

  return (
    <SortableItem id={item.key} type="item">
      {/*<Tooltip>*/}
      {/*  <TooltipTrigger asChild>*/}
      <span>
        <DragHandle>
          <Avatar style={{ backgroundColor: hsl }} className="h-8 w-8">
            <AvatarFallback>
              {twoLettersFromName(item.firstName + ' ' + item.lastName)}
            </AvatarFallback>
          </Avatar>
        </DragHandle>
      </span>
      {/*</TooltipTrigger>*/}
      {/*<TooltipContent side="right">description</TooltipContent>*/}
      {/*</Tooltip>*/}
    </SortableItem>
  );
};

export default ClassesGrid;
