import { Link, Outlet, ScrollRestoration } from 'react-router';
import { Background } from './background';
import { Navigation } from './navigation';
import { Button } from './ui/button';
import { Reveal } from './reveal';
import { ROUTES } from '@/routes/routes';
import { ContactDialog } from './contact-dialog';
import { useState } from 'react';
import { DotNav, DotNavProvider, DotNavSection } from './dot-nav';

export const Layout: React.FC = () => {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div>
      <Background />

      <Navigation />

      <ContactDialog open={contactOpen} setOpen={setContactOpen} />

      <DotNavProvider>
        <main className='relative'>
          <Outlet />

          <ScrollRestoration />

          <DotNav />

          <DotNavSection id='contact' label="Let's Connect">
            <Reveal>
              <div className='container mx-auto flex flex-col gap-8 reveal-soft-rise text-center pt-32 md:pt-40 lg:pt-52'>
                <div className='flex flex-col gap-2'>
                  <h4 className='text-3xl text-gradient'>Let's Connect</h4>
                  <p className='text-muted-foreground'>
                    Have an idea or a complex challenge? Let's turn it into a high-performance
                    reality.
                  </p>
                </div>

                <div className='flex gap-4 justify-center items-center'>
                  <Button
                    size='lg'
                    className='text-xl h-auto py-4 btn-gradient'
                    onClick={() => setContactOpen(true)}
                  >
                    Get in touch
                  </Button>

                  <Button asChild size='lg' variant='outline' className='text-xl h-auto py-4'>
                    <Link to={ROUTES.projects}>View Projects</Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          </DotNavSection>

          <Reveal>
            <div className='reveal-soft-rise container mx-auto max-w-lg pb-12 pt-32 md:pt-40 lg:pt-52'>
              <footer className='glass rounded-lg p-4 flex gap-4 justify-between items-center'>
                <div className='flex flex-col gap-2'>
                  <p className='text-gradient'>Christos Niaskos</p>
                  <p>© {new Date().getFullYear()}, All rights reserved</p>
                </div>

                <Button
                  variant='outline'
                  size='lg'
                  className='h-full min-h-14'
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                >
                  Back to top
                </Button>
              </footer>
            </div>
          </Reveal>
        </main>
      </DotNavProvider>
    </div>
  );
};
