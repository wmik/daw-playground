import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { Draggable } from '~/components/draggable';
import { Droppable } from '~/components/droppable';
import { useWindowData } from '~/components/hooks/use-window-data';

export default function NewPage() {
  let { windows, setWindows } = useWindowData();

  function handleDragEnd(e: DragEndEvent) {
    let current = windows?.find(x => x.id === e.active.id);

    if (!current) {
      return;
    }

    let clone = {
      ...current,
      position: {
        x: current.position.x + e.delta.x,
        y: current.position.y + e.delta.y
      }
    };

    // is this faster?
    // current.position.x += e.delta.x;
    // current.position.y += e.delta.y;

    let update =
      windows?.map(window => (window.id === current.id ? clone : window)) ?? [];

    setWindows(update);
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Droppable>
        {windows.map(window => (
          <Draggable
            config={{
              styles: {
                position: 'absolute',
                left: `${window.position.x}px`,
                top: `${window.position.y}px`
              }
            }}
            key={window.id}
            data={{
              id: window.id,
              children: window.children,
              title: window.title
            }}
          />
        ))}
      </Droppable>
    </DndContext>
  );
}
