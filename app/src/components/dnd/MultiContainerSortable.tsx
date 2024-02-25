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
  id: UniqueIdentifier;
  containerId: UniqueIdentifier;
}

export interface Container {
  id: UniqueIdentifier;
}

interface Props<T extends BaseItem = BaseItem, C extends Container = Container> {
  containers: C[];
  items: T[];

  onChangeContainers: React.Dispatch<React.SetStateAction<C[]>>;
  onChangeItems: React.Dispatch<React.SetStateAction<T[]>>;

  renderContainer(container: C, items: T[], index: number | null): ReactNode;
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

export function MultiContainerSortable<T extends BaseItem, C extends Container>({
  containers,
  items,
  onChangeContainers,
  onChangeItems,
  renderItem,
  renderContainer,
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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
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
      setActiveItem(items.find(item => item.id === event.active.id));
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveContainer(undefined);
    setActiveItem(undefined);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAContainer = active.data.current?.type === 'container';
    if (!isActiveAContainer) return; // Dropping column

    onChangeContainers(columns => {
      const activeContainerIndex = columns.findIndex(col => col.id === activeId);
      const overContainerIndex = columns.findIndex(col => col.id === overId);
      return arrayMove(columns, activeContainerIndex, overContainerIndex);
    });
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
      onChangeItems(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === active.id);
        const overIndex = tasks.findIndex(t => t.id === over.id);

        if (tasks[activeIndex]!.containerId != tasks[overIndex]!.containerId) {
          tasks[activeIndex]!.containerId = tasks[overIndex]!.containerId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAContainer = over.data.current?.type === 'container';

    // Im dropping a Task over a container
    if (isActiveATask && isOverAContainer) {
      onChangeItems(item => {
        const activeIndex = item.findIndex(t => t.id === active.id);
        item[activeIndex]!.containerId = over.id;
        return arrayMove(item, activeIndex, activeIndex);
      });
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
