import type { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

type DroppableProps = {
  children?: ReactNode;
};

export function Droppable({ children }: DroppableProps) {
  let { setNodeRef } = useDroppable({
    id: 'droppable'
  });

  return <div ref={setNodeRef} children={children} />;
}
