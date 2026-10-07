import { Link, type LinkProps, NavLink, type NavLinkProps } from 'react-router';

export const TransitionLink: React.FC<LinkProps> = ({ onClick, ...props }) => (
  <Link
    {...props}
    viewTransition
    onClick={(event) => {
      document.documentElement.style.setProperty('--transition-x', `${event.clientX}px`);

      document.documentElement.style.setProperty('--transition-y', `${event.clientY}px`);

      onClick?.(event);
    }}
  />
);

export const TransitionNavLink: React.FC<NavLinkProps> = ({ onClick, ...props }) => (
  <NavLink
    {...props}
    viewTransition
    onClick={(event) => {
      document.documentElement.style.setProperty('--transition-x', `${event.clientX}px`);

      document.documentElement.style.setProperty('--transition-y', `${event.clientY}px`);

      onClick?.(event);
    }}
  />
);
