import { EllipsisIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';

export function TrackOptions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='rounded-full w-4 h-4'>
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuLabel className='text-xs text-muted-foreground'>
          Editing
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Rename...
            <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Duplicate
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Delete
            <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className='text-xs text-muted-foreground'>
          Appearance
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Color</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Random</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Customize...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className='text-xs text-muted-foreground'>
          Composition
        </DropdownMenuLabel>
        <DropdownMenuItem>Instrument</DropdownMenuItem>
        <DropdownMenuItem>Arrangement</DropdownMenuItem>
        <DropdownMenuItem disabled>Effects</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className='text-xs text-muted-foreground'>
          Rendering
        </DropdownMenuLabel>
        <DropdownMenuItem>
          Merge
          <DropdownMenuShortcut>⇧⌘M</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Export as MIDI file</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Export as wav audio file</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
