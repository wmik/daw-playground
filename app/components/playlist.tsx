import { ResizableBox, type ResizeCallbackData } from 'react-resizable';
import { Slider } from '~/components/ui/slider';
import { cn } from '~/lib/utils';
import { TrackToggleGroup } from '~/components/track-toggle-group';
import { TrackOptions } from '~/components/track-options';
import { KnobPercentage } from './knob-percentage';

export function Playlist() {
  return (
    <div className='flex flex-col'>
      <Track />
    </div>
  );
}

export function Track() {
  return (
    <ResizableBox
      axis='y'
      width={Infinity}
      height={130}
      minConstraints={[100, 130]}
      maxConstraints={[Infinity, 260]}
      className='border-b border-gray-200 min-h-20 flex w-full relative'
      handle={
        <button
          className={cn(
            'absolute left-24 bottom-1 w-10 opacity-0 peer-hover:opacity-100 hover:opacity-100 bg-linear-to-r from-indigo-400 to-fuchsia-400',
            'transition-opacity rounded-full h-1 cursor-row-resize'
          )}
        />
      }
    >
      <TrackControl />
      <TrackLane />
    </ResizableBox>
  );
}

export function TrackControl() {
  return (
    <div className='peer border-r border-gray-200 bg-background flex flex-col gap-4 p-2 min-w-3xs'>
      <div className='flex justify-between items-center'>
        <TrackLabel />
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

export function TrackLabel() {
  return <p className='' children='Track 1' />;
}

export function TrackGain() {
  return <Slider defaultValue={[50]} max={100} step={1} />;
}

export function TrackLane() {
  return <div className='p-2' />;
}
