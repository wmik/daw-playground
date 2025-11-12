import { ResizableBox } from 'react-resizable';
import { Slider } from '~/components/ui/slider';
import { cn } from '~/lib/utils';
import { TrackToggleGroup } from '~/components/track-toggle-group';
import { TrackOptions } from '~/components/track-options';
import { KnobPercentage } from '~/components/knob-percentage';
import { Button } from '~/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DraggableAttributes
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import {
  TrackDataProvider,
  useCurrentTrack,
  useTrackData
} from '~/hooks/use-track-data';
import { useRef, type UIEvent } from 'react';

export function Playlist() {
  return (
    <TrackDataProvider>
      <div className='flex flex-col'>
        <TrackList />
        <TrackInsert />
      </div>
    </TrackDataProvider>
  );
}

function TrackList() {
  let scrollRefs = useRef<Record<string, HTMLDivElement>>({});
  let sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8 // Only activate drag after a small distance to allow clicks
      }
    })
  );

  let { tracks, setTracks } = useTrackData();

  function onScroll(e: UIEvent<HTMLElement>) {
    let scrollLeft = e.currentTarget.scrollLeft;

    // Sync all children to the same scroll position
    Object.values(scrollRefs.current).forEach((child: HTMLDivElement) => {
      if (child && child !== e.target) {
        child.scrollLeft = scrollLeft;
      }
    });
  }

  function arrayMove(array: any[], previous: number, next: number) {
    let clone = array.slice();
    let [item] = clone.splice(previous, 1);

    clone.splice(next, 0, item);

    return clone;
  }

  function handleDragEnd(event: DragEndEvent) {
    let { active, over } = event;

    if (active.id !== over?.id) {
      setTracks(items => {
        let oldIndex = items.findIndex(entry => entry.id === active.id);
        let newIndex = items.findIndex(entry => entry.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext items={tracks} strategy={verticalListSortingStrategy}>
        {tracks?.map(track => (
          <Track
            key={track?.id}
            data={track}
            config={{
              registerScroll: (el: HTMLDivElement) =>
                (scrollRefs.current[track?.id] = el),
              onScroll
            }}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

function TrackInsert() {
  let { setTracks } = useTrackData();

  return (
    <Button
      className='rounded-full w-fit my-8 mx-auto'
      onClick={() =>
        setTracks(prev =>
          prev?.concat({
            id: Math.random().toString(32).substring(2),
            title: `Track ${prev?.length + 1}`
          })
        )
      }
    >
      <PlusIcon /> Add Track
    </Button>
  );
}

type TrackConfigProps = {
  registerScroll: any;
  onScroll: any;
};

type TrackDataProps = {
  id: string;
};

type TrackProps = {
  config?: TrackConfigProps;
  data: TrackDataProps;
};

export function Track({ config, data }: TrackProps) {
  let { id } = data ?? {};
  let { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  let style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <ResizableBox
      axis='y'
      width={Infinity}
      height={130}
      minConstraints={[100, 130]}
      maxConstraints={[Infinity, 260]}
      style={{ ...style }}
      className={cn(
        'border-b border-gray-200 min-h-20 flex w-full relative',
        isDragging ? 'border-t shadow-lg shadow-gray-200 z-10' : ''
      )}
      handle={
        <button
          className={cn(
            'absolute left-24 bottom-1 w-10 opacity-0 peer-hover:opacity-100 hover:opacity-100 bg-linear-to-r from-indigo-400 to-fuchsia-400',
            'transition-opacity rounded-full h-1 cursor-row-resize'
          )}
        />
      }
    >
      <TrackControl
        data={{
          id
        }}
        config={{
          setNodeRef,
          listeners,
          attributes
        }}
      />
      <TrackLane data={{ id, count: 32 }} config={config} />
    </ResizableBox>
  );
}

type TrackControlConfigProps = {
  setNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
};

type TrackControlDataProps = {
  id: string;
};

type TrackControlProps = {
  config?: TrackControlConfigProps;
  data: TrackControlDataProps;
};

export function TrackControl({ config, data }: TrackControlProps) {
  let track = useCurrentTrack(data?.id);
  let { setNodeRef, listeners, attributes } = config ?? {};

  return (
    <div
      className='peer border-r border-gray-200 bg-background flex flex-col gap-4 p-2 min-w-3xs sticky left-0'
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <div className='flex justify-between items-center'>
        <TrackLabel
          data={{
            title: track?.current.title
          }}
        />
        <TrackOptions />
      </div>
      <div className='flex justify-between items-center gap-4'>
        <TrackGain />
        <KnobPercentage label='Pan' theme='sky' />
      </div>
      <TrackToggleGroup />
    </div>
  );
}

type TrackLabelDataProps = {
  title?: any;
};

type TrackLabelProps = {
  data: TrackLabelDataProps;
};

export function TrackLabel({ data }: TrackLabelProps) {
  return <p className='cursor-move' children={data?.title} />;
}

export function TrackGain() {
  return <Slider defaultValue={[50]} max={100} step={1} />;
}

type TrackLaneConfigProps = {
  registerScroll: any;
  onScroll: any;
};

type TrackLaneDataProps = {
  id: string;
  count: number;
};

type TrackLaneProps = {
  config?: TrackLaneConfigProps;
  data: TrackLaneDataProps;
};

export function TrackLane({ config, data }: TrackLaneProps) {
  let beats = Array.from({ length: data?.count ?? 32 }, (_, idx) => (
    <Beat key={idx} data={{ count: 4 }} />
  ));

  return (
    <div
      className='w-full flex overflow-x-auto scrollbar-none whitespace-nowrap'
      children={beats}
      ref={config?.registerScroll}
      onScroll={config?.onScroll}
    />
  );
}

type BeatDataProps = {
  count: number;
};

type BeatProps = {
  data: BeatDataProps;
};

export function Beat({ data }: BeatProps) {
  let bars = Array.from({ length: data?.count }, (_, idx) => <Bar key={idx} />);
  return (
    <div
      className='flex border-r border-gray-200 last:border-0'
      children={bars}
    />
  );
}

export function Bar() {
  return (
    <div className='min-w-10 odd:bg-white even:bg-gray-50 border-r border-gray-200 last:border-0' />
  );
}
