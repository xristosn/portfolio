import { useRef, useState, type PointerEvent } from 'react';

import { cn } from '@/lib/utils';

import { ProjectCardCanvas, type ProjectPointer } from './project-card-canvas';

export type ProjectCardProps = {
  title: string;
  description: string;

  metric?: string;
  metricLabel?: string;
  posterUrl?: string;

  tags?: string[];

  href: string;
  githubHref?: string;

  /**
   * The original HTML assigns
   * sequential seeds to each card.
   */
  seed?: number;

  primaryActionLabel?: string;

  className?: string;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  metric,
  metricLabel,
  posterUrl,
  tags,
  href,
  githubHref,
  seed,
  primaryActionLabel,
  className,
}) => {
  const [hovered, setHovered] = useState(false);
  const [failedPosterUrl, setFailedPosterUrl] = useState<string>();

  const pointerRef = useRef<ProjectPointer | null>(null);

  function handlePosterError() {
    setFailedPosterUrl(posterUrl);
  }

  function handlePointerEnter(event: PointerEvent<HTMLElement>) {
    setHovered(true);

    pointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    pointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handlePointerLeave() {
    pointerRef.current = null;
    setHovered(false);
  }

  const actionLabel = primaryActionLabel ?? (githubHref ? 'Live demo' : 'Visit');
  const canvasSeed =
    seed ?? [...title].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) % 100, 0);

  return (
    <article
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        'group',

        'flex min-w-0 flex-col',
        'overflow-visible',
        'rounded-[26px]',

        'border border-border',
        'bg-card/90',
        'backdrop-blur-[18px]',

        'transition-[transform,border-color,box-shadow]',
        'duration-300',

        'hover:-translate-y-1.5',
        'hover:border-primary/65',
        'hover:shadow-[0_26px_70px_color-mix(in_oklab,var(--primary)_28%,transparent)]',

        'motion-reduce:transform-none',
        'motion-reduce:transition-none',

        className,
      )}
    >
      <div
        className='
          relative
          h-45
          shrink-0
          overflow-hidden
          rounded-t-[25px]
          border-b
          border-border

          bg-linear-to-br
          from-card
          to-background
        '
      >
        <ProjectCardCanvas seed={canvasSeed} active={hovered} pointerRef={pointerRef} />

        {posterUrl && failedPosterUrl !== posterUrl && (
          <img
            src={posterUrl}
            alt={`${title} screenshot`}
            loading='lazy'
            onError={handlePosterError}
            className='
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-top
              transition-transform
              duration-700
              ease-[cubic-bezier(0.2,0.8,0.2,1)]
              group-hover:scale-[1.06]
            '
          />
        )}

        <div
          aria-hidden
          className='
            pointer-events-none
            absolute
            inset-0

            bg-[linear-gradient(0deg,color-mix(in_oklab,var(--background)_85%,transparent),transparent_60%)]
          '
        />

        {Boolean(metric && metricLabel) && (
          <div
            className='
            absolute
            bottom-4
            left-5.5
            z-10

            text-4xl
            leading-none
            font-bold
            tracking-[-0.045em]
            text-foreground
            text-left
          '
          >
            {metric}

            <span
              className='
              mt-1.5
              block

              text-[13px]
              leading-normal
              font-normal
              tracking-normal
              text-muted-foreground
            '
            >
              {metricLabel}
            </span>
          </div>
        )}
      </div>

      <div
        className='
          flex
          flex-1
          flex-col
          gap-3
          p-5.5
        '
      >
        <h3
          className='
            m-0
            text-2xl
            font-medium
            tracking-tight
            text-foreground
          '
        >
          {title}
        </h3>

        <p
          className='
            m-0
            text-[15px]
            text-muted-foreground
          '
        >
          {description}
        </p>

        {!!tags?.length && (
          <div
            className='
            flex
            flex-wrap
            gap-1.5
          '
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className='
                rounded-full
                border
                border-border
                px-2.75
                py-0.75

                text-xs
                text-muted-foreground
              '
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div
          className='
            mt-auto
            flex
            gap-2
            pt-2
          '
        >
          <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={`${actionLabel}: ${title}`}
            className='
              inline-grid
              h-11.5
              min-w-11.5
              place-items-center

              btn-gradient
              rounded-[14px]
              px-3.5
              text-sm
              font-bold
            '
          >
            {actionLabel} ↗︎
          </a>

          {githubHref && (
            <a
              href={githubHref}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`GitHub: ${title}`}
              className='
                inline-grid
                h-11.5
                min-w-11.5
                place-items-center

                rounded-[14px]
                border
                border-border

                bg-card
                px-3.5

                text-sm
                font-bold
                text-foreground

                transition-[transform,color,border-color]
                duration-250

                hover:-translate-y-0.75
                hover:border-primary
                hover:text-primary

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
              '
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
