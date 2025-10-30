import { PlusCircleIcon, SaveIcon } from 'lucide-react';
import { Link } from 'react-router';

export function Welcome() {
  return (
    <main className='flex items-center justify-center pt-16 pb-4'>
      <div className='flex-1 flex flex-col items-center gap-16 min-h-0'>
        <header className='flex flex-col items-center gap-9'>
          <h1 className='text-8xl font-medium'>DAW</h1>
        </header>
        <div className='max-w-[300px] w-full space-y-6 px-4'>
          <nav className='rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4'>
            <ul>
              {resources.map(({ href, text, icon }) => (
                <li key={href}>
                  <Link
                    className='group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500'
                    to={href}
                  >
                    {icon}
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}

const resources = [
  {
    href: '/new',
    text: 'New Project',
    icon: <PlusCircleIcon />
  },
  {
    href: '/',
    text: 'Load Project',
    icon: <SaveIcon />
  }
];
