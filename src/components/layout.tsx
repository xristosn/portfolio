import { Outlet, ScrollRestoration } from 'react-router';
import { Background } from './background';
import { Button } from './ui/button';
import { Reveal } from './reveal';
import { ContactDialog } from './contact-dialog';
import { useState } from 'react';
import { DotNav, DotNavSection } from './dot-nav';
import { ConnectCta } from './connect-cta';
import { Dock } from './dock';

export const Layout: React.FC = () => {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <Background>
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-primary'
      >
        Skip to main content
      </a>

      <Dock onContactClick={() => setContactOpen(true)}  />

      <ContactDialog open={contactOpen} setOpen={setContactOpen} />

      <DotNav>
        <main id='main-content' tabIndex={-1} className='relative pb-16'>
          <Outlet />

          <ScrollRestoration />

          <DotNavSection id='contact' label="Let's Connect">
            <Reveal
              variant='soft-rise'
              className='container mx-auto flex flex-col gap-8 text-center pt-32 md:pt-40 lg:pt-52'
            >
              <ConnectCta />
            </Reveal>
          </DotNavSection>

          <Reveal
            variant='soft-rise'
            className='container mx-auto max-w-lg pb-12 pt-32 md:pt-40 lg:pt-52'
          >
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
          </Reveal>
        </main>
      </DotNav>
    </Background>
  );
};
