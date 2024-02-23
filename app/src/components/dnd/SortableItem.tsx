import type { DraggableSyntheticListeners, UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical } from '@pedaki/design/ui/icons';
import React, { createContext, useContext, useMemo } from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';

interface Props {
  id: UniqueIdentifier;
}

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export function SortableItem({ children, id }: PropsWithChildren<Props>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef],
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <li ref={setNodeRef} style={style} className="w-full list-none">
        {children}
      </li>
    </SortableItemContext.Provider>
  );
}

export function DragHandle({ children, className }: PropsWithChildren<{ className: string }>) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button {...attributes} {...listeners} className={className} ref={ref}>
      {children}
    </button>
  );
}
