import { Mail } from 'lucide-react';

import { cn } from '@/lib/utils';

import { DockButton, DockExternalItem, DockNavItem } from './dock-item';
import { useDockMagnifier } from '@/hooks/use-dock-magnifier';
import type { IconType } from 'react-icons/lib';
import { ROUTES } from '@/routes/routes';
import { IoMdDocument, IoMdFolder, IoMdHome } from 'react-icons/io';
import { RESUME_URL } from '@/lib/constants';

type DockProps = {
  onContactClick: () => void;
  className?: string;
};

const LINKS: Array<{ label: string; path: string; icon: IconType; external?: boolean }> = [
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
    path: RESUME_URL,
    icon: IoMdDocument,
    external: true,
  },
];

export const Dock: React.FC<DockProps> = ({ onContactClick, className }) => {
  const {
    isDesktop,
    layout,
    dockStyle,
    getItemStyle,
    getIconStyle,
    onPointerMove,
    onPointerLeave,
  } = useDockMagnifier();

  return (
    <nav
      aria-label='Main navigation'
      style={dockStyle}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        'fixed left-1/2 z-30',
        'bottom-[calc(12px+env(safe-area-inset-bottom,0px))]',
        '-translate-x-1/2',

        'flex w-[min(calc(100%-24px),380px)] items-center justify-between gap-0',
        'px-2 py-1.5',

        'rounded-[26px]',
        'border border-border',
        'bg-card/90',
        'backdrop-blur-[18px]',

        '[box-shadow:0_20px_60px_color-mix(in_oklab,var(--background)_60%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--foreground)_5%,transparent)]',

        'touch-manipulation',

        'fine:block',
        'fine:h-17',
        'fine:w-75',
        'fine:p-0',
        'fine:transition-[width,height]',
        'fine:duration-140',
        'fine:ease-out',

        className,
      )}
    >
      {LINKS.map((link, idx) =>
        link.external ? (
          <DockExternalItem
            key={link.path}
            href={link.path}
            label={link.label}
            icon={link.icon}
            style={getItemStyle(idx)}
            iconStyle={getIconStyle(idx)}
          />
        ) : (
          <DockNavItem
            key={link.path}
            to={link.path}
            end
            label={link.label}
            icon={link.icon}
            style={getItemStyle(idx)}
            iconStyle={getIconStyle(idx)}
          />
        ),
      )}

      <span
        aria-hidden
        style={isDesktop ? { left: `${layout.lefts[3] + 6}px` } : undefined}
        className='
          mx-0.5 h-7.5 w-px bg-border

          fine:absolute
          fine:top-1/2
          fine:-mt-3.75
          fine:mx-0

          fine:transition-[left]
          fine:duration-140
          fine:ease-out
        '
      />

      <DockButton
        label='Contact'
        icon={Mail}
        onClick={onContactClick}
        style={getItemStyle(4)}
        iconStyle={getIconStyle(4)}
      />
    </nav>
  );
};
