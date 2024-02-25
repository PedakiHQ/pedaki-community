'use client';

import type { UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@pedaki/design/ui/card';
import { Separator } from '@pedaki/design/ui/separator';
import RulesTrigger from '~/components/classes/generate/rules/rules-trigger.tsx';
import { MultiContainerSortable } from '~/components/dnd/MultiContainerSortable.tsx';
import type { BaseItem, Container } from '~/components/dnd/MultiContainerSortable.tsx';
import { DragHandle, SortableItem } from '~/components/dnd/SortableItem.tsx';
import React from 'react';

const _containers = [{ id: 0 }, { id: 1 }, { id: 2 }];

const _items = [
  { id: 0, containerId: 0 },
  { id: 1, containerId: 0 },
  { id: 2, containerId: 0 },
  { id: 3, containerId: 1 },
  { id: 4, containerId: 1 },
  { id: 5, containerId: 1 },
  { id: 6, containerId: 2 },
  { id: 7, containerId: 2 },
  { id: 8, containerId: 2 },
];

const ClassesGrid = () => {
  const [containers, setContainers] = React.useState<Container[]>(_containers);
  const [items, setItems] = React.useState<BaseItem[]>(_items);

  return (
    <div className="grid grid-cols-1 gap-4 @2xl/classes:grid-cols-2 @5xl/classes:grid-cols-3">
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
    </div>
  );
};

const ContainerWrapper = ({
  container,
  items,
}: {
  container: { id: UniqueIdentifier };
  items: BaseItem[];
}) => {
  const itemIds = items.map(item => item.id);

  return (
    <Card className="p-2" data-container={container.id}>
      <CardHeader>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <div>
              {/*TODO: trads*/}
              <CardTitle>Classe {container.id}</CardTitle>
            </div>
          </div>

          <RulesTrigger />
        </div>
      </CardHeader>
      <Separator className="-ml-2 w-[calc(100%+1rem)]" />
      <CardContent className="flex flex-row ">
        <SortableContext items={itemIds}>
          {items.map(item => (
            <Item key={item.id} item={item} />
          ))}
        </SortableContext>
      </CardContent>
    </Card>
  );
};

const Item = ({ item }: { item: { id: UniqueIdentifier; containerId: UniqueIdentifier } }) => {
  return (
    <SortableItem id={item.id} className="w-8" type="item">
      <DragHandle>{item.id}</DragHandle>
    </SortableItem>
  );
};

export default ClassesGrid;
