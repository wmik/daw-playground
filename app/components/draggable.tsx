import { type CSSProperties, type SyntheticEvent } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ResizableBox, type ResizeCallbackData } from 'react-resizable';
import { useCurrentViewer, type ViewerData } from '~/hooks/use-viewer-data';
import { ExpandIcon } from 'lucide-react';
import { cn } from '~/lib/utils';

type DraggablePropsData = Pick<ViewerData, 'id' | 'title' | 'children'>;

type DraggablePropsConfig = {
  styles?: CSSProperties;
};

type DraggableProps = {
  data: DraggablePropsData;
  config: DraggablePropsConfig;
};

export function Draggable({ data, config }: DraggableProps) {
  let { styles } = config;
  let { id, title: Title, children } = data;
  let viewer = useCurrentViewer(id);
  let nested = typeof children === 'function' ? children : (_: any) => children;
  let { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id
    });

  let style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }
    : {};

  function onResize(
    _: SyntheticEvent<Element, Event>,
    { size }: ResizeCallbackData
  ) {
    viewer?.update({ dimension: { width: size.width, height: size.height } });
  }

  return (
    <ResizableBox
      width={Number(viewer?.current.dimension.width)}
      height={Number(viewer?.current.dimension.height)}
      minConstraints={[300, 200]}
      maxConstraints={[500, 300]}
      onResize={onResize}
      className={cn(
        'group flex flex-col rounded-xl border-x border-b border-gray-200 dark:border-gray-700 transition-shadow bg-background',
        isDragging && !viewer?.current?.state?.minimize
          ? 'shadow-lg shadow-gray-200'
          : '',
        viewer?.current?.state?.minimize ? 'overflow-hidden' : 'overflow-auto'
      )}
      style={{
        ...style,
        ...styles,
        width: viewer!.current.dimension.width
      }}
      handle={
        <button
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-opacity rounded-full ml-auto mt-auto mr-1 mb-2 cursor-nwse-resize',
            viewer?.current?.state?.minimize || viewer?.current?.state?.maximize
              ? 'pointer-events-none hidden'
              : ''
          )}
        >
          <ExpandIcon width={12} height={12} />
        </button>
      }
    >
      <>
        <div
          className='bg-gray-200 w-full min-h-4 rounded-t-xl cursor-move'
          ref={setNodeRef}
          children={typeof Title === 'function' ? <Title {...viewer} /> : Title}
          {...listeners}
          {...attributes}
        />
        {!viewer?.current?.state?.minimize ? nested(viewer) : null}
      </>
    </ResizableBox>
  );
}
