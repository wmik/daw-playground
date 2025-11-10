import type { CustomComponentProps } from '~/hooks/use-viewer-data';
import { ButtonGroup } from './ui/button-group';
import { Button } from './ui/button';
import { Maximize2Icon, Minimize2Icon, MinusIcon, XIcon } from 'lucide-react';
import { useRef, type ComponentProps, type ReactNode } from 'react';
import { cn } from '~/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

type CustomButtonProps = {
  tooltip?: ReactNode;
} & ComponentProps<'button'>;

function CustomButton({
  children,
  className,
  tooltip,
  onClick,
  ...props
}: CustomButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          aria-label='Close'
          className={cn('rounded-full h-6 w-6 p-1 cursor-pointer', className)}
          children={children}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent children={tooltip} />
    </Tooltip>
  );
}

export function ViewerTitle(props: CustomComponentProps) {
  let ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className='flex items-center py-2 px-1 w-full h-full bg-background'
      ref={ref}
    >
      <span
        className='text-xs'
        children={`Playlist. (${props?.current?.dimension.width} x ${props?.current?.dimension.height})`}
      />
      <ButtonGroup className='ml-auto'>
        <CustomButton
          tooltip='Minimize'
          onPointerDown={e => {
            e.preventDefault();
            e.stopPropagation();

            let minimize = props?.current?.state?.minimize;

            props?.update?.({
              dimension: !minimize
                ? {
                    width: Math.min(Number(ref?.current?.clientWidth), 300),
                    height: Number(ref?.current?.clientHeight)
                  }
                : { width: 300, height: 200 },
              state: {
                maximize: false,
                minimize: !minimize,
                hidden: false
              }
            });
          }}
        >
          <MinusIcon style={{ width: 12, height: 12 }} />
        </CustomButton>

        <CustomButton
          tooltip='Maximize'
          onPointerDown={e => {
            e.preventDefault();
            e.stopPropagation();

            let maximize = props?.current?.state?.maximize;

            props?.update?.({
              dimension: maximize
                ? { width: 300, height: 200 }
                : {
                    width: window.innerWidth,
                    height: window.innerHeight
                  },
              position: maximize ? { x: 100, y: 100 } : { x: 0, y: 0 },
              state: {
                maximize: !maximize,
                minimize: false,
                hidden: false
              }
            });
          }}
        >
          {props?.current?.state?.maximize ? (
            <Minimize2Icon style={{ width: 12, height: 12 }} />
          ) : (
            <Maximize2Icon style={{ width: 12, height: 12 }} />
          )}
        </CustomButton>

        <CustomButton
          tooltip='Close'
          onPointerDown={e => {
            e.preventDefault();
            e.stopPropagation();
            props?.update?.({
              state: {
                maximize: false,
                minimize: false,
                hidden: true
              }
            });
          }}
        >
          <XIcon style={{ width: 12, height: 12 }} />
        </CustomButton>
      </ButtonGroup>
    </div>
  );
}
