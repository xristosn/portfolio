import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

type RevealProps = React.ComponentPropsWithoutRef<'div'> & {
  variant: 'soft-rise';
};

const REVEAL_VARIANTS = {
  'soft-rise': 'reveal-soft-rise',
} as const;

export const Reveal: React.FC<RevealProps> = ({
  variant,
  className,
  children,
  ...props
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.09,
    rootMargin: '24px 0px 0px 0px',
    fallbackInView: true,
  });

  return (
    <div
      {...props}
      ref={ref}
      className={cn(REVEAL_VARIANTS[variant], className)}
      data-reveal={inView ? 'true' : 'false'}
    >
      {children}
    </div>
  );
};
