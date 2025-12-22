import { Reveal } from '@/components/reveal';
import { IoMdPin, IoMdCode, IoLogoGithub, IoLogoLinkedin } from 'react-icons/io';
import { IoFileTrayStacked, IoLanguage } from 'react-icons/io5';
import type { IconType } from 'react-icons/lib';
import { MdArchitecture, MdOutlineMultipleStop, MdDataObject } from 'react-icons/md';
import { SiVite, SiXstate } from 'react-icons/si';
import { LuTestTube } from 'react-icons/lu';
import { RiTeamFill } from 'react-icons/ri';
import { Button } from '@/components/ui/button';
import { DotNavSection } from '@/components/dot-nav';

const SKILLS: Array<{ title: string; summary: string; icon: IconType }> = [
  {
    title: 'Frontend Engineering',
    summary: '7+ years of web development',
    icon: IoMdCode,
  },
  {
    title: 'Full Stack Development',
    summary: 'Node.js, Next.js & .NET',
    icon: IoFileTrayStacked,
  },
  {
    title: 'Multi-Framework Experience',
    summary: 'Experience with React, Vue, Angular & Solid',
    icon: MdOutlineMultipleStop,
  },
  {
    title: 'UI Architecture & Design',
    summary: 'Scalable WCAG design systems',
    icon: MdArchitecture,
  },
  {
    title: 'State Management',
    summary: 'Redux, Zustand, RxJS, NgRx',
    icon: SiXstate,
  },
  {
    title: 'Modern Frontend Tooling',
    summary: 'Vite, Webpack & Tailwind CSS',
    icon: SiVite,
  },
  {
    title: 'Database Management',
    summary: 'MongoDB, MySQL & SQL Server',
    icon: MdDataObject,
  },
  {
    title: 'DevOps & Testing',
    summary: 'CI/CD, Docker & Cypress/Jest/Playwright',
    icon: LuTestTube,
  },
  {
    title: 'Leadership & Collaboration',
    summary: 'Mentoring, Architecture, Agile',
    icon: RiTeamFill,
  },
];

export const About: React.FC = () => {
  return (
    <div className='container max-w-5xl mx-auto p-4 flex flex-col gap-16 md:gap-32 xl:gap-48'>
      <DotNavSection id='about-me' label='About me'>
        <div className='flex flex-col gap-16 md:gap-32 xl:gap-48'>
          <Reveal>
            <div className='group flex flex-col gap-4 text-center items-center reveal-bounce'>
              <p className='wave-hand text-5xl'>👋</p>
              <p className='text-2xl'>Hi there,</p>
              <h1 className='text-4xl text-gradient'>I'm Christos Niaskos</h1>

              <div className='flex gap-4'>
                <Button asChild variant='outline' size='icon-lg'>
                  <a href='https://github.com/xristosn' target='_blank'>
                    <IoLogoGithub />
                  </a>
                </Button>

                <Button asChild variant='outline' size='icon-lg'>
                  <a href='https://www.linkedin.com/in/xristos-niaskos' target='_blank'>
                    <IoLogoLinkedin />
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-12 reveal-soft-rise justify-items-center container max-w-4xl mx-auto'>
              <div className='flex flex-col gap-4'>
                <img
                  src='/avatar.webp'
                  alt=''
                  className='w-full max-w-64 mx-auto md:max-w-full rounded-2xl p-1 shadow-lg object-contain'
                />

                <div className='glass p-4 rounded-lg flex gap-4'>
                  <div className='bg-primary/10 text-primary-foreground p-4 text-lg rounded-lg'>
                    <IoMdPin />
                  </div>

                  <div className='flex flex-col gap-1'>
                    <p className='text-muted-foreground'>Location</p>
                    <p>Peristeri, Attika, Greece</p>
                  </div>
                </div>

                <div className='glass p-4 rounded-lg flex gap-4'>
                  <div className='bg-primary/10 text-primary-foreground p-4 text-lg rounded-lg'>
                    <IoLanguage />
                  </div>

                  <div className='flex flex-col gap-1'>
                    <p className='text-muted-foreground'>Languages</p>
                    <p>English (Professional) - Greek (Native)</p>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-4 text-lg leading-relaxed'>
                <p>
                  I’m a Senior Frontend Engineer with a deep love for building scalable UI with
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
            </div>
          </Reveal>
        </div>
      </DotNavSection>

      <DotNavSection id='skills' label='Skills & Expertise'>
        <Reveal>
          <div className='flex flex-col gap-8 reveal-soft-rise text-center'>
            <div className='flex flex-col gap-2'>
              <h4 className='text-3xl text-gradient'>Skills & Expertise</h4>
              <p className='text-muted-foreground'>Full-stack proficiency with a frontend focus.</p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 justify-items-center'>
              {SKILLS.map((skill) => (
                <div
                  key={skill.title}
                  className='glass p-4 rounded-md flex flex-col gap-4 items-center w-full h-full'
                >
                  <div className='text-xl bg-primary/10 text-primary-foreground p-4 rounded-sm'>
                    {<skill.icon />}
                  </div>

                  <p className='text-lg whitespace-nowrap'>{skill.title}</p>

                  <p className='text-sm text-muted-foreground'>{skill.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </DotNavSection>
    </div>
  );
};
