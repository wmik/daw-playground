import type { Route } from './+types/home';
import { Welcome } from '../welcome/welcome';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'DAW –– Digital audio workstation playground.' },
    {
      name: 'description',
      content: 'Sandbox for prototyping digital audio workstation features.'
    }
  ];
}

export default function HomePage() {
  return <Welcome />;
}
