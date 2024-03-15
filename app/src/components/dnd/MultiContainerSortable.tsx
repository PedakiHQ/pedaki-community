// https://itnext.io/build-a-drag-and-drop-kanban-board-with-react-typescript-tailwind-dnd-kit-3cd6bcf32bd2
'use client';

import type { DragEndEvent, DragStartEvent, DropAnimation, UniqueIdentifier } from '@dnd-kit/core';
import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { ReactNode } from 'react';
import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

export interface BaseItem {
  key: UniqueIdentifier;
  containerId: UniqueIdentifier;
}

export interface Container {
  id: UniqueIdentifier;
}

interface Props<T extends BaseItem = BaseItem, C extends Container = Container> {
  containers: C[];
  items: T[];

  onChangeContainers: (containers: C[]) => void;
  onChangeItems: (items: T[]) => void;

  renderContainer(container: C, items: T[], index: number | null): ReactNode;
  renderItem(item: T, index: number | null): ReactNode;
  instantUpdate?: boolean;
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

export function MultiContainerSortable<T extends BaseItem, C extends Container>({
  containers,
  items,
  onChangeContainers,
  onChangeItems,
  renderItem,
  renderContainer,
  instantUpdate = false,
}: Props<T, C>) {
  const [activeContainer, setActiveContainer] = useState<C | undefined>(undefined);
  const [activeItem, setActiveItem] = useState<T | undefined>(undefined);
  const containerIds = useMemo(() => containers.map(container => container.id), [containers]);
  const itemsByContainer = useMemo(() => {
    return containers.reduce(
      (acc, container) => {
        acc[container.id] = items.filter(item => item.containerId === container.id);
        return acc;
      },
      {} as Record<UniqueIdentifier, T[]>,
    );
  }, [containers, items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'container') {
      setActiveContainer(containers.find(container => container.id === event.active.id));
      return;
    }

    if (event.active.data.current?.type === 'item') {
      setActiveItem(items.find(item => item.key === event.active.id));
      return;
    }
  };

  const dropItemInContainer = (activeIndex: number, overIndex: number, isMoving = false) => {
    if (items[activeIndex]!.containerId != items[overIndex]!.containerId) {
      items[activeIndex]!.containerId = items[overIndex]!.containerId;
      onChangeItems(arrayMove(items, activeIndex, overIndex - 1));
      return;
    }

    if (isMoving && !instantUpdate) return;

    onChangeItems(arrayMove(items, activeIndex, overIndex));
    return;
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveContainer(undefined);
    setActiveItem(undefined);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'item';
    const isOverATask = over.data.current?.type === 'item';
    const isActiveAContainer = active.data.current?.type === 'container';

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const activeIndex = items.findIndex(t => t.key === active.id);
      const overIndex = items.findIndex(t => t.key === over.id);

      dropItemInContainer(activeIndex, overIndex, false);
      return;
    }

    if (isActiveAContainer) {
      const activeContainerIndex = containers.findIndex(col => col.id === activeId);
      const overContainerIndex = containers.findIndex(col => col.id === overId);
      const newContainers = arrayMove(containers, activeContainerIndex, overContainerIndex);

      onChangeContainers(newContainers);
    }
  };

  const onDragOver = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const isActiveATask = active.data.current?.type === 'item';
    const isOverATask = over.data.current?.type === 'item';

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const activeIndex = items.findIndex(t => t.key === active.id);
      const overIndex = items.findIndex(t => t.key === over.id);

      dropItemInContainer(activeIndex, overIndex, true);
      return;
    }

    const isOverAContainer = over.data.current?.type === 'container';

    // Im dropping a Task over a container
    if (isActiveATask && isOverAContainer) {
      const newTasks = (i: typeof items) => {
        const activeIndex = i.findIndex(t => t.key === active.id);
        i[activeIndex]!.containerId = over.id;
        return arrayMove(i, activeIndex, activeIndex);
      };

      onChangeItems(newTasks(items));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <SortableContext items={containerIds}>
        {containers.map((container, index) => {
          return (
            <React.Fragment key={container.id}>
              {renderContainer(container, itemsByContainer[container.id]!, index)}
            </React.Fragment>
          );
        })}
      </SortableContext>
      {typeof document !== 'undefined' &&
        createPortal(
          <DragOverlay dropAnimation={dropAnimationConfig} wrapperElement="ul" className="overlay">
            {activeItem ? renderItem(activeItem, null) : null}
            {activeContainer
              ? renderContainer(activeContainer, itemsByContainer[activeContainer.id]!, null)
              : null}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  );
}
