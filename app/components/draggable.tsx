import { type CSSProperties, type SyntheticEvent } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ResizableBox, type ResizeCallbackData } from 'react-resizable';
import { useCurrentWindow, type WindowData } from './hooks/use-window-data';
import { ExpandIcon } from 'lucide-react';

type DraggablePropsData = Pick<WindowData, 'id' | 'title' | 'children'>;

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
  let ref = useCurrentWindow(id);
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
    ref!.setDimension({ width: size.width, height: size.height });
  }

  return (
    <ResizableBox
      width={ref!.current!.dimension.width}
      height={ref!.current!.dimension.height}
      minConstraints={[150, 150]}
      maxConstraints={[500, 300]}
      onResize={onResize}
      className={`group flex flex-col rounded-xl border-x border-b border-gray-200 dark:border-gray-700 transition-shadow ${
        isDragging ? 'shadow-lg shadow-gray-200' : ''
      }`}
      style={{
        ...style,
        ...styles,
        width: ref!.current.dimension.width
      }}
      handle={
        <button className='opacity-0 group-hover:opacity-100 transition-opacity rounded-full ml-auto mt-auto mr-1 mb-2 cursor-nwse-resize'>
          <ExpandIcon width={12} height={12} />
        </button>
      }
    >
      <>
        <div
          className='bg-gray-200 w-full min-h-4 rounded-t-xl cursor-move'
          ref={setNodeRef}
          children={typeof Title === 'function' ? <Title {...ref} /> : Title}
          {...listeners}
          {...attributes}
        />
        {typeof children === 'function' ? children(ref) : children}
      </>
    </ResizableBox>
  );
}
