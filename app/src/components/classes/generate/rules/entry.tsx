import { Card } from '@pedaki/design/ui/card';
import { IconCircle, IconGripVertical2 } from '@pedaki/design/ui/icons';
import { cn } from '@pedaki/design/utils';
import { DragHandle, SortableItem } from '~/components/dnd/SortableItem.tsx';
import React from 'react';
import classes from './entry.module.scss';

const Entry = ({ item }: { item: { id: string } }) => {
  return (
    <SortableItem id={item.id}>
      <div className={cn(classes.item, 'py-4')}>
        <div className={classes.badge}>
          <IconCircle className="fill-stroke-soft text-stroke-soft" />
        </div>
        <Card className="ml-2 flex flex-1 flex-row justify-between pl-4">
          <div>{item.id}</div>
          <DragHandle className="focus-ring flex shrink-0 touch-none appearance-none items-center justify-center rounded-sm p-1 transition-all duration-200 hover:bg-weak">
            <IconGripVertical2 className="h-6 text-soft " />
          </DragHandle>
        </Card>
      </div>
    </SortableItem>
  );
};

export default Entry;
