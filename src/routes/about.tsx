import { Reveal } from '@/components/reveal';
import { IoMdPin } from 'react-icons/io';
import { IoLanguage } from 'react-icons/io5';
import { DotNavSection } from '@/components/dot-nav';
import { MARQUEE_TECHNOLOGIES, SKILLS } from '@/lib/constants';
import { HeroTitle } from '@/components/hero-title';
import { Marquee } from '@/components/marquee';

export const About: React.FC = () => {
  return (
    <div className='container max-w-5xl mx-auto p-4'>
      <DotNavSection id='hello' label='Hi there'>
        <HeroTitle />
      </DotNavSection>

      <div className='flex flex-col gap-16 md:gap-32 xl:gap-48'>
        <DotNavSection id='about-me' label='About me'>
          <Reveal
            variant='soft-rise'
            className='grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center container max-w-4xl mx-auto'
          >
            <div className='flex flex-col gap-4'>
              <img
                src='/avatar.webp'
                width={424}
                height={424}
                loading='lazy'
                decoding='async'
                alt='Portrait of Christos Niaskos'
                className='w-full max-w-64 mx-auto md:max-w-full rounded-2xl p-1 shadow-lg object-contain'
              />

              <div className='glass p-4 rounded-lg flex gap-4'>
                <div className='bg-primary/10 text-primary-foreground p-4 text-lg rounded-lg'>
                  <IoMdPin aria-hidden='true' />
                </div>

                <dl className='flex flex-col gap-1'>
                  <dt className='text-muted-foreground'>Location</dt>
                  <dd className='m-0'>Peristeri, Attika, Greece</dd>
                </dl>
              </div>

              <div className='glass p-4 rounded-lg flex gap-4'>
                <div className='bg-primary/10 text-primary-foreground p-4 text-lg rounded-lg'>
                  <IoLanguage aria-hidden='true' />
                </div>

                <dl className='flex flex-col gap-1'>
                  <dt className='text-muted-foreground'>Languages</dt>
                  <dd className='m-0'>English (Professional) - Greek (Native)</dd>
                </dl>
              </div>
            </div>

            <div className='glass p-4 rounded-lg flex flex-col gap-4 text-lg leading-relaxed'>
              <p>
                I’m a Senior Software Engineer with a deep love for building scalable UI with
                React and TypeScript. While I mostly live in the frontend world, I’m just as
                comfortable wearing a Fullstack hat, having delivered robust APIs and backend
                integrations throughout my career.
              </p>

              <p>
                I’ve spent years navigating the Great Framework Wars, successfully shipping major
                projects in Angular and Vue.js before planting my flag in the React ecosystem.
                Whether I’m architecting enterprise-grade AI platforms or building "smart"
                checkout systems that handle millions of hits, I focus on performance,
                accessibility, and code that won't make future-me cry.
              </p>

              <p>
                I hold a Bachelor's in Computer Engineering and fueled by a "how hard can it be? /
                didn't know any better" attitude 😅, I spent my thesis building an Android game
                using Unreal Engine 4.
              </p>
            </div>
          </Reveal>
        </DotNavSection>

        <Reveal variant='soft-rise'>
          <Marquee items={MARQUEE_TECHNOLOGIES} />
        </Reveal>

        <DotNavSection id='skills' label='Skills & Expertise'>
          <Reveal variant='soft-rise' className='flex flex-col gap-8 text-center'>
            <div className='flex flex-col gap-2'>
              <h2 className='text-6xl text-gradient'>Skills & Expertise</h2>
              <p className='text-2xl text-muted-foreground'>
                Full-stack proficiency with a frontend focus.
              </p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 justify-items-center'>
              {SKILLS.map((skill) => (
                <div
                  key={skill.title}
                  className='glass p-4 rounded-md flex flex-col gap-4 items-center w-full h-full'
                >
                  <div className='text-xl bg-primary/10 text-primary-foreground p-4 rounded-sm'>
                    <skill.icon aria-hidden='true' />
                  </div>

                  <h3 className='text-lg whitespace-nowrap'>{skill.title}</h3>

                  <p className='text-sm text-muted-foreground'>{skill.summary}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </DotNavSection>
      </div>
    </div>
  );
};
