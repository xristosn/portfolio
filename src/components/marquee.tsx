type MarqueeProps = {
  items: string[];
  duration?: number;
  className?: string;
};

export const Marquee: React.FC<MarqueeProps> = ({ items, duration = 40, className }) => {
  if (!items.length) return null;

  const duplicatedItems = [...items, ...items];

  return (
    <div
      className={[
        'col-span-full w-full min-w-0 max-w-full',

        'relative overflow-hidden',
        'border border-border bg-card/10 backdrop-blur-sm',

        'mask-[linear-gradient(90deg,transparent,var(--foreground)_8%,var(--foreground)_92%,transparent)]',

        className,
      ].join(' ')}
    >
      <ul aria-label='Technologies' className='sr-only'>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div
        aria-hidden='true'
        style={{
          animationDuration: `${duration}s`,
        }}
        className='
          flex w-max shrink-0
          gap-10 py-4.5
          text-2xl text-muted-foreground
          motion-safe:animate-[marquee_linear_infinite]
          cursor-default
          select-none
        '
      >
        {duplicatedItems.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={(index + 1) % 3 === 0 ? 'text-foreground' : undefined}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
