import clsx from 'clsx';
import { useId, useState } from 'react';
import {
  KnobHeadless,
  KnobHeadlessLabel,
  KnobHeadlessOutput,
  useKnobKeyboardControls
} from 'react-knob-headless';
import { mapFrom01Linear, mapTo01Linear } from '@dsp-ts/math';
import { KnobBaseThumb } from '~/components/knob-base-thumb';

type KnobHeadlessProps = React.ComponentProps<typeof KnobHeadless>;
type KnobBaseThumbProps = React.ComponentProps<typeof KnobBaseThumb>;
type KnobBaseProps = Pick<
  KnobHeadlessProps,
  | 'valueMin'
  | 'valueMax'
  | 'valueRawRoundFn'
  | 'valueRawDisplayFn'
  | 'axis'
  | 'mapTo01'
  | 'mapFrom01'
> &
  Pick<KnobBaseThumbProps, 'theme'> & {
    readonly label: string;
    readonly valueDefault: number;
    readonly stepFn: (valueRaw: number) => number;
    readonly stepLargerFn: (valueRaw: number) => number;
  };

export function KnobBase({
  theme,
  label,
  valueDefault,
  valueMin,
  valueMax,
  valueRawRoundFn,
  valueRawDisplayFn,
  axis,
  stepFn,
  stepLargerFn,
  mapTo01 = mapTo01Linear,
  mapFrom01 = mapFrom01Linear
}: KnobBaseProps) {
  let knobId = useId();
  let labelId = useId();
  let [valueRaw, setValueRaw] = useState<number>(valueDefault);
  let value01 = mapTo01(valueRaw, valueMin, valueMax);
  let step = stepFn(valueRaw);
  let stepLarger = stepLargerFn(valueRaw);
  let dragSensitivity = 0.006;

  let keyboardControlHandlers = useKnobKeyboardControls({
    valueRaw,
    valueMin,
    valueMax,
    step,
    stepLarger,
    onValueRawChange: setValueRaw
  });

  return (
    <div
      className={clsx(
        // 'w-16',
        'flex flex-col gap-0.5 justify-center items-center text-xs select-none',
        'outline-none focus-within:outline-1 focus-within:outline-offset-4 focus-within:outline-stone-300'
      )}
    >
      {/* <KnobHeadlessLabel id={labelId}>{label}</KnobHeadlessLabel> */}
      <KnobHeadless
        id={knobId}
        aria-labelledby={labelId}
        className='relative w-5 h-5 outline-none'
        valueMin={valueMin}
        valueMax={valueMax}
        valueRaw={valueRaw}
        valueRawRoundFn={valueRawRoundFn}
        valueRawDisplayFn={valueRawDisplayFn}
        dragSensitivity={dragSensitivity}
        axis={axis}
        mapTo01={mapTo01}
        mapFrom01={mapFrom01}
        onValueRawChange={setValueRaw}
        {...keyboardControlHandlers}
      >
        <KnobBaseThumb theme={theme} value01={value01} />
      </KnobHeadless>
      {/* <KnobHeadlessOutput htmlFor={knobId}>
        {valueRawDisplayFn(valueRaw)}
      </KnobHeadlessOutput> */}
    </div>
  );
}
