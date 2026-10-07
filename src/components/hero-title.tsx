import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { IoLogoGithub, IoLogoLinkedin, IoMdDocument } from 'react-icons/io';
import { DEFAULT_ROLES, GITHUB_URL, LINKEDIN_URL, RESUME_URL } from '@/lib/constants';

const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#01';

type NameLineProps = {
  name: string;
  outlined?: boolean;
  className?: string;
};

const NameLine: React.FC<NameLineProps> = ({
  name,
  outlined = false,
  className,
}) => {
  return (
    <span
      aria-hidden='true'
      className={[
        'relative block w-fit motion-safe:animate-[hero-up_1s_ease_both]',
        outlined ? 'text-transparent [-webkit-text-stroke:2px_var(--foreground)]' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {[...name].map((character, index) => (
        <span
          key={`${character}-${index}`}
          className='
            relative
            inline-block

            [transition:transform_.35s_cubic-bezier(.3,1.6,.5,1),color_.2s]
            motion-reduce:transition-none

            hover:z-20
            hover:-translate-y-3.5
            hover:-rotate-6
            hover:text-primary
            hover:[-webkit-text-stroke-color:var(--primary)]
          '
        >
          {character === ' ' ? '\u00A0' : character}
        </span>
      ))}
    </span>
  );
};

type ScrambledRoleProps = {
  roles: string[];
  duration: number;
};

const ScrambledRole: React.FC<ScrambledRoleProps> = ({ roles, duration }) => {
  const [visibleText, setVisibleText] = useState(roles[0] ?? '');
  const [roleIndex, setRoleIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches);

    motionPreference.addEventListener('change', updateMotionPreference);
    return () => motionPreference.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (!roles.length) return;

    if (reducedMotion) return;

    const target = roles[roleIndex];

    let frame = 0;
    let timeoutId: number | undefined;

    const intervalId = window.setInterval(() => {
      setVisibleText(
        [...target]
          .map((character, index) => {
            if (index < frame / 2) {
              return character;
            }

            if (character === ' ') {
              return character;
            }

            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join(''),
      );

      frame += 1;

      if (frame > target.length * 2) {
        window.clearInterval(intervalId);

        setVisibleText(target);

        timeoutId = window.setTimeout(() => {
          setRoleIndex((current) => (current + 1) % roles.length);
        }, duration);
      }
    }, 28);

    return () => {
      window.clearInterval(intervalId);

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [roleIndex, roles, duration, reducedMotion]);

  if (!roles.length) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden='true'
        className='
          mt-5.5
          min-h-[1.6em]
          text-fluid-2
          motion-safe:animate-[hero-up_1s_.3s_both]
        '
      >
        <span className='text-(--hot)'>{'> '}</span>

        {reducedMotion ? roles[0] : visibleText}

        <span className='role-cursor' />
      </div>
      <span className='sr-only'>Professional focus: {roles.join('; ')}.</span>
    </>
  );
};

type HeroTitleProps = {
  firstName?: string;
  lastName?: string;
  greeting?: string;
  roles?: string[];
  roleDuration?: number;
  className?: string;
};

export const HeroTitle: React.FC<HeroTitleProps> = ({ roleDuration = 2300, className }) => (
  <section
    className={[
      'flex min-h-svh flex-col justify-center gap-2.5 select-none text-center sm:text-left',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <div
      className='
        text-fluid-2
        text-muted-foreground
        motion-safe:animate-[hero-up_.8s_both]
      '
    >
      <span aria-hidden='true' className='hero-hand'>
        👋
      </span>{' '}
      Hi there, I'm
    </div>

    <h1
      aria-label={`Christos Niaskos`}
      className='
          m-0
          text-fluid-12
          leading-[0.84]
          font-bold
          tracking-tighter
        '
    >
      <NameLine name='Christos' className='z-10 mx-auto sm:mx-0' />

      <NameLine name='Niaskos' outlined className='z-0 mx-auto sm:mx-0 [animation-delay:120ms]' />
    </h1>

    <ScrambledRole roles={DEFAULT_ROLES} duration={roleDuration} />

    <div className='flex gap-4 mt-4 justify-center sm:justify-start'>
      <Button
        nativeButton={false}
        role='link'
        render={
          <a href={RESUME_URL} target='_blank' rel='noopener noreferrer'>
            <IoMdDocument aria-hidden='true' /> Resume
          </a>
        }
        variant='outline'
        size='lg'
        className='btn-gradient'
      />

      <Button
        nativeButton={false}
        role='link'
        render={
          <a href={GITHUB_URL} target='_blank' rel='noopener noreferrer'>
            <IoLogoGithub aria-hidden='true' /> Github
          </a>
        }
        variant='outline'
        size='lg'
      />

      <Button
        nativeButton={false}
        role='link'
        render={
          <a href={LINKEDIN_URL} target='_blank' rel='noopener noreferrer'>
            <IoLogoLinkedin aria-hidden='true' /> LinkedIn
          </a>
        }
        variant='outline'
        size='lg'
      />
    </div>
  </section>
);
