import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import { Draggable } from '~/components/draggable';
import { Droppable } from '~/components/droppable';
import { useViewerData } from '~/hooks/use-viewer-data';
import type { Route } from './+types/new';
import { Taskbar } from '~/components/taskbar';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Untitled Project' },
    {
      name: 'description',
      content: 'Sandbox for prototyping digital audio workstation features.'
    }
  ];
}

export default function NewPage() {
  let { viewers, setViewers } = useViewerData();
  let sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8 // Only activate drag after a small distance to allow clicks
      }
      // Custom activator to prevent drag on button clicks
      // onActivation: ({ event }) => {
      //   const target = event.target as HTMLElement;

      //   // Check if the target is a button or a descendant of a button
      //   if (target.tagName === 'BUTTON' || target.closest('button')) {
      //     console.log(target.tagName);
      //     return false; // Prevent drag activation
      //   }
      //   return true; // Allow drag activation for other elements
      // }
    })
  );

  function handleDragEnd(e: DragEndEvent) {
    let current = viewers?.find(x => x.id === e.active.id);

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

    let next =
      viewers?.map(viewer => (viewer.id === current.id ? clone : viewer)) ?? [];

    setViewers(next);
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Taskbar className='w-full rounded-none px-4' />
      <Droppable>
        {viewers.map(viewer => (
          <Draggable
            config={{
              styles: {
                position: 'absolute',
                left: `${viewer.position.x}px`,
                top: `${viewer.position.y}px`
              }
            }}
            key={viewer.id}
            data={{
              id: viewer.id,
              children: viewer.children,
              title: viewer.title
            }}
          />
        ))}
      </Droppable>
    </DndContext>
  );
}
