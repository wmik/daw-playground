import {
  CircleIcon,
  HeadphonesIcon,
  VolumeIcon,
  VolumeXIcon
} from 'lucide-react';

import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group';

export function TrackToggleGroup() {
  return (
    <ToggleGroup
      type='multiple'
      variant='outline'
      size='sm'
      className='rounded-full'
    >
      <ToggleGroupItem
        value='mute'
        aria-label='Toggle volume'
        className='data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-gray-500 data-[state=on]:*:[svg]:stroke-gray-500 data-[state=on]:*:[svg:first-child]:hidden data-[state=on]:*:[svg:last-child]:block *:[svg:first-child]:block *:[svg:last-child]:hidden'
      >
        <VolumeIcon />
        <VolumeXIcon />
      </ToggleGroupItem>
      <ToggleGroupItem
        value='headphones'
        aria-label='Toggle headphones'
        className='data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-bg-background data-[state=on]:*:[svg]:stroke-yellow-500'
      >
        <HeadphonesIcon />
      </ToggleGroupItem>
      <ToggleGroupItem
        value='record'
        aria-label='Toggle record'
        className='data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500'
      >
        <CircleIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
