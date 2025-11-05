import { mapFrom01Linear } from '@dsp-ts/math';
import { cn } from '~/lib/utils';

type KnobBaseThumbProps = {
  readonly theme: 'stone' | 'pink' | 'green' | 'sky';
  readonly value01: number;
};

export function KnobBaseThumb({ theme, value01 }: KnobBaseThumbProps) {
  let angleMin = -145;
  let angleMax = 145;
  let angle = mapFrom01Linear(value01, angleMin, angleMax);

  return (
    <div className={cn('absolute h-full w-full rounded-full', 'bg-foreground')}>
      <div className='absolute h-full w-full' style={{ rotate: `${angle}deg` }}>
        <div className='absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2 rounded-sm bg-background' />
      </div>
    </div>
  );
}
