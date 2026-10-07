import { useState, type PointerEvent } from 'react';
import { ContactDialog } from './contact-dialog';
import { Button } from './ui/button';
import { TransitionLink as Link } from './transition-link';
import { ROUTES } from '@/routes/routes';

type ConnectCtaProps = {
  className?: string;
};

export const ConnectCta: React.FC<ConnectCtaProps> = ({ className = '' }) => {
  const [contactOpen, setContactOpen] = useState(false);

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const x = event.clientX - rect.left - rect.width / 2;

    const y = event.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(
      ${x * 0.12}px,
      ${y * 0.2}px
    )`;
  }

  function handlePointerLeave(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.style.transform = '';
  }

  return (
    <section className={['my-10 mt-16 text-center', className].join(' ')}>
      <ContactDialog
        open={contactOpen}
        setOpen={setContactOpen}
        trigger={
          <button
            type='button'
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className='
          inline-block
          cursor-pointer
          border-0
          bg-transparent
          p-0

          font-sans
          text-fluid-7
          leading-none
          font-bold
          tracking-[-0.06em]
          text-foreground

          hover:text-primary

          [transition:color_300ms_ease,transform_250ms_ease]

          motion-reduce:transform-none
          motion-reduce:transition-none

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
          focus-visible:ring-offset-4
          focus-visible:ring-offset-background
        '
          >
            Let's connect
          </button>
        }
      />

      <p className='mt-3 text-md text-muted-foreground'>
        Have an idea or a complex challenge? Let's turn it into a high-performance reality.
      </p>

      <Button
        nativeButton={false}
        role='link'
        render={<Link to={ROUTES.projects}>View Projects</Link>}
        size='lg'
        variant='outline'
        className='py-4 mt-3 text-md'
      />
    </section>
  );
};
