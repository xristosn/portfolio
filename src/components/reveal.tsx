import { useIsMobile } from '@/hooks/use-is-mobile';
import { Children, cloneElement } from 'react';
import { useInView } from 'react-intersection-observer';

export const Reveal: React.FC<{
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
}> = ({ children }) => {
  const isMobile = useIsMobile();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: isMobile ? 0 : 0.09,
    rootMargin: '24px 0px 0px 0px'
  });

  const child = Children.only(children);

  return cloneElement(child, {
    ref,
    'data-reveal': inView ? 'true' : 'false',
  } as React.HTMLAttributes<HTMLElement>);
};
