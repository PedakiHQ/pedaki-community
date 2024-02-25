'use client';

import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { Active, DropAnimation, UniqueIdentifier } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface BaseItem {
  id: UniqueIdentifier;
}

interface Props<T extends BaseItem> {
  items: T[];
  onChange(items: T[]): void;
  renderItem(item: T, index: number | null): ReactNode;
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.6',
      },
    },
  }),
};

export function SortableList<T extends BaseItem>({ items, onChange, renderItem }: Props<T>) {
  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo(() => items.find(item => item.id === active?.id), [active, items]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);
          if (activeIndex === overIndex) return;

          onChange(arrayMove(items, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul role="application" className="relative">
          {items.map((item, index) => (
            <React.Fragment key={item.id}>{renderItem(item, index)}</React.Fragment>
          ))}
        </ul>
      </SortableContext>
      {typeof document !== 'undefined' &&
        createPortal(
          <DragOverlay dropAnimation={dropAnimationConfig} wrapperElement="ul" className="overlay">
            {activeItem ? renderItem(activeItem, null) : null}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  );
}
