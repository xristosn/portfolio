import { ROUTES } from '@/routes/routes';
import { Button } from './ui/button';
import { Link, useLocation } from 'react-router';
import { IoMdHome, IoMdFolder, IoMdDocument } from 'react-icons/io';
import type { IconType } from 'react-icons/lib';

const LINKS: Array<{ label: string; path: string; icon: IconType }> = [
  {
    label: 'About',
    path: ROUTES.about,
    icon: IoMdHome,
  },
  {
    label: 'Projects',
    path: ROUTES.projects,
    icon: IoMdFolder,
  },
  {
    label: 'Resume',
    path: 'https://xnresume.netlify.app/',
    icon: IoMdDocument,
  },
];

export const Navigation: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <>
      <div className='fixed top-2 left-0 w-full flex z-30'>
        <nav className='mx-auto glass rounded-2xl px-4 py-2 flex items-center gap-4 h-14 justify-center animate-sweep'>
          {LINKS.map((link) => (
            <Button
              asChild
              key={link.path}
              size='lg'
              variant={link.path === pathname ? 'outline' : 'ghost'}
              className='rounded-xl min-w-16'
            >
              <Link to={link.path}>
                {<link.icon />}

                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      <div className='h-14 mb-20' />
    </>
  );
};
