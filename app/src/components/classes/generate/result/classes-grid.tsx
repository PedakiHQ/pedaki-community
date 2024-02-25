'use client';

import type { UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { hashCode } from '@pedaki/common/utils/hash';
import { randomId } from '@pedaki/common/utils/random';
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
import { MultiContainerSortable } from '~/components/dnd/MultiContainerSortable.tsx';
import type { BaseItem, Container } from '~/components/dnd/MultiContainerSortable.tsx';
import { DragHandle, SortableItem } from '~/components/dnd/SortableItem.tsx';
import React from 'react';

const _containers = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

const _items = Array.from({ length: _containers.length }, (_, containerIndex) => {
  return Array.from({ length: 2 }, (_, index) => {
    return {
      id: `item-` + (containerIndex - 1) * 35 + index,
      containerId: containerIndex,
      name: randomId(),
    };
  });
}).flat();

const ClassesGrid = () => {
  const [containers, setContainers] = React.useState<Container[]>(_containers);
  // @ts-ignore
  const [items, setItems] = React.useState<(BaseItem & { name: string })[]>(_items);

  return (
    <div className="grid grid-cols-1 gap-4 @2xl/classes:grid-cols-2 @5xl/classes:grid-cols-3">
      <TooltipProvider disableHoverableContent>
        <MultiContainerSortable
          renderContainer={(container, items) => (
            <ContainerWrapper container={container} items={items} />
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
}: {
  container: { id: UniqueIdentifier };
  items: (BaseItem & { name: string })[];
}) => {
  const itemIds = items.map(item => item.id);

  return (
    <SortableItem id={container.id} type="container" enabled={false}>
      <Card className="gap-2 py-2" data-container={container.id}>
        <CardHeader>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div>
                {/*TODO: trads*/}
                <CardTitle>Classe {container.id}</CardTitle>
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
                <Item key={item.id} item={item} />
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

const Item = ({
  item,
}: {
  item: { id: UniqueIdentifier; containerId: UniqueIdentifier; name: string };
}) => {
  const nameHash = hashCode(item.name);
  const hue = nameHash % 360;
  const hsl = `hsl(${hue}, 100%, 90%)`;

  return (
    <SortableItem id={item.id} type="item">
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <DragHandle>
              <Avatar style={{ backgroundColor: hsl }} className="h-8 w-8">
                <AvatarFallback>{twoLettersFromName(item.name)}</AvatarFallback>
              </Avatar>
            </DragHandle>
          </span>
        </TooltipTrigger>
        <TooltipContent side="right">description</TooltipContent>
      </Tooltip>
    </SortableItem>
  );
};

export default ClassesGrid;
