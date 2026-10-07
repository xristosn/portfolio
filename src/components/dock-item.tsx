import React, { type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TransitionNavLink } from './transition-link';

const itemClass = cn(
  'group relative',
  'flex h-14 w-auto min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-1',
  'cursor-pointer border-0 bg-transparent p-0',
  'text-muted-foreground',
  'outline-primary focus-visible:outline-2 focus-visible:outline-offset-2',
  '[-webkit-tap-highlight-color:transparent]',

  'fine:absolute fine:top-1/2 fine:-mt-[26px]',
  'fine:grid fine:h-[52px] fine:w-[52px] fine:place-items-center',
  'fine:transition-[left,width] fine:duration-[140ms] fine:ease-out',

  'motion-reduce:transition-none',
);

type IconShellProps = {
  children: ReactNode;
  active?: boolean;
  pill?: boolean;
  style?: CSSProperties;
};

const IconShell: React.FC<IconShellProps> = ({ children, active, pill, style }) => {
  return (
    <span
      style={style}
      className={cn(
        'relative grid h-8 w-10 place-items-center rounded-xl max-[340px]:w-8.5',
        'border border-transparent',

        '[transition:transform_140ms_ease-out,background-color_200ms,color_200ms,border-color_200ms,box-shadow_200ms]',
        'non-desktop:group-active:scale-90 motion-reduce:transition-none',

        'fine:h-11 fine:w-11 fine:origin-center',

        !pill && [
          'fine:group-hover:bg-primary/20',
          'fine:group-hover:text-primary',
          'fine:group-hover:border-primary/50',
          'fine:group-hover:shadow-[0_0_26px_color-mix(in_oklab,var(--primary)_50%,transparent)]',
        ],

        active && ['bg-primary/20', 'border-primary/45', 'text-primary'],

        pill && ['btn-gradient', 'border-0'],
      )}
    >
      {children}

      {active && (
        <span
          className='
            absolute
            -bottom-2.25
            left-1/2
            hidden
            size-1
            -translate-x-1/2
            rounded-full
            bg-primary
            shadow-[0_0_10px_var(--primary)]
            fine:block
          '
        />
      )}
    </span>
  );
};

const Label: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <span
      className='
        text-[11px] leading-none font-medium max-[340px]:text-[10px]

        fine:pointer-events-none
        fine:absolute
        fine:bottom-[calc(100%+var(--dock-ey)/2+22px)]
        fine:left-1/2

        fine:-translate-x-1/2
        fine:translate-y-1.5

        fine:whitespace-nowrap
        fine:rounded-[9px]
        fine:bg-foreground
        fine:px-2.75
        fine:py-1.25
        fine:text-[13px]
        fine:text-background

        fine:opacity-0
        fine:transition-[opacity,transform]
        fine:duration-200

        fine:group-hover:translate-y-0
        fine:group-hover:opacity-100

        fine:group-focus-visible:translate-y-0
        fine:group-focus-visible:opacity-100
      '
    >
      {children}
    </span>
  );
};

type DockNavItemProps = {
  to: string;
  label: string;
  icon: React.ElementType;
  style?: CSSProperties;
  iconStyle?: CSSProperties;
  end?: boolean;
};

export const DockNavItem: React.FC<DockNavItemProps> = ({ to, label, icon: Icon, style, iconStyle, end }) => {
  return (
    <TransitionNavLink
      to={to}
      end={end}
      viewTransition
      aria-label={label}
      style={style}
      className={({ isActive }) => cn(itemClass, isActive && 'text-foreground')}
    >
      {({ isActive }) => (
        <>
          <IconShell active={isActive} style={iconStyle}>
            <Icon aria-hidden='true' className='size-5.25' strokeWidth={1.7} />
          </IconShell>

          <Label>{label}</Label>
        </>
      )}
    </TransitionNavLink>
  );
};

type DockExternalItemProps = {
  href: string;
  label: string;
  icon: React.ElementType;
  style?: CSSProperties;
  iconStyle?: CSSProperties;
};

export const DockExternalItem: React.FC<DockExternalItemProps> = ({
  href,
  label,
  icon: Icon,
  style,
  iconStyle,
}) => {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={label}
      style={style}
      className={itemClass}
    >
      <IconShell style={iconStyle}>
        <Icon aria-hidden='true' className='size-5.25' strokeWidth={1.7} />
      </IconShell>

      <Label>{label}</Label>
    </a>
  );
};

type DockButtonProps = {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  style?: CSSProperties;
  iconStyle?: CSSProperties;
};

export const DockButton: React.FC<DockButtonProps> = ({ label, icon: Icon, onClick, style, iconStyle }) => {
  return (
    <button
      type='button'
      aria-label={label}
      onClick={onClick}
      style={style}
      className={cn(itemClass, 'text-foreground')}
    >
      <IconShell pill style={iconStyle}>
        <Icon aria-hidden='true' className='size-5.25' strokeWidth={1.7} />
      </IconShell>

      <Label>{label}</Label>
    </button>
  );
};
