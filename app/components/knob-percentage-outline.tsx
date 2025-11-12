import { useState, useId } from 'react';
import {
  KnobHeadless,
  KnobHeadlessLabel,
  KnobHeadlessOutput,
  useKnobKeyboardControls
} from 'react-knob-headless';

export function KnobPercentageOutline() {
  const knobId = useId();
  const labelId = useId();

  const [valueRaw, setValueRaw] = useState(46);

  const valueMin = 0;
  const valueMax = 100;
  const dragSensitivity = 0.006;

  // Calculate normalized value (0-1)
  const normalizedValue = (valueRaw - valueMin) / (valueMax - valueMin);

  // Arc configuration
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 2;

  // Calculate stroke-dashoffset for the arc
  // Start from top (270 degrees) and go clockwise
  const offset = circumference * (1 - normalizedValue);

  // Keyboard controls
  const step = (valueRaw: number) => {
    const delta = (valueMax - valueMin) * 0.01; // 1% step
    return Math.min(valueMax, Math.max(valueMin, valueRaw + delta));
  };

  const stepLarger = (valueRaw: number) => {
    const delta = (valueMax - valueMin) * 0.1; // 10% step
    return Math.min(valueMax, Math.max(valueMin, valueRaw + delta));
  };

  const keyboardControlHandlers = useKnobKeyboardControls({
    valueRaw,
    valueMin,
    valueMax,
    step: step(valueRaw),
    stepLarger: stepLarger(valueRaw),
    onValueRawChange: setValueRaw
  });

  return (
    <div className='flex flex-col gap-2 justify-center items-center min-h-screen bg-stone-900'>
      <div className='flex flex-col gap-0.5 justify-center items-center text-xs select-none outline-none focus-within:outline-1 focus-within:outline-offset-4 focus-within:outline-stone-300'>
        <KnobHeadlessLabel id={labelId} className='text-stone-400 mb-1'>
          Volume
        </KnobHeadlessLabel>

        <KnobHeadless
          id={knobId}
          aria-labelledby={labelId}
          className='relative w-20 h-20 outline-none'
          valueMin={valueMin}
          valueMax={valueMax}
          valueRaw={valueRaw}
          valueRawRoundFn={value => Math.round(value)}
          valueRawDisplayFn={value => `${Math.round(value)}%`}
          dragSensitivity={dragSensitivity}
          orientation='vertical'
          onValueRawChange={setValueRaw}
          {...keyboardControlHandlers}
        >
          <svg
            className='absolute inset-0 w-full h-full -rotate-90'
            viewBox='0 0 20 20'
          >
            {/* Background circle */}
            <circle
              cx='10'
              cy='10'
              r={radius}
              fill='none'
              stroke='currentColor'
              strokeWidth={strokeWidth}
              className='text-stone-700'
            />

            {/* Progress arc */}
            <circle
              cx='10'
              cy='10'
              r={radius}
              fill='none'
              stroke='currentColor'
              strokeWidth={strokeWidth}
              strokeLinecap='round'
              className='text-blue-500 transition-all duration-75'
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          {/* Center indicator dot */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-1.5 h-1.5 rounded-full bg-stone-300'></div>
          </div>
        </KnobHeadless>

        <KnobHeadlessOutput
          htmlFor={knobId}
          className='text-stone-300 font-mono mt-1'
        >
          {Math.round(valueRaw)}%
        </KnobHeadlessOutput>
      </div>
    </div>
  );
}
