import { useEffect, useRef, type PropsWithChildren } from 'react';

type AnimatedBackgroundProps = PropsWithChildren<{
  dimmed?: boolean;
  interactive?: boolean;
  className?: string;
}>;

type Point = {
  x: number;
  y: number;
  energy: number;
};

type Ripple = {
  x: number;
  y: number;
  startedAt: number;
};

export const Background: React.FC<AnimatedBackgroundProps> = ({
  children,
  dimmed = false,
  interactive = true,
  className = '',
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;

    if (!root || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let spacing = 40;
    let columns = 0;
    let rows = 0;

    let mouseX = -999;
    let mouseY = -999;

    let smoothMouseX = -999;
    let smoothMouseY = -999;

    let points: Point[] = [];
    let ripples: Ripple[] = [];

    let animationFrame = 0;
    let lastFrameTime = 0;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      spacing = width < 700 ? 36 : 40;

      columns = Math.ceil(width / spacing) + 3;
      rows = Math.ceil(height / spacing) + 3;

      points = Array.from({ length: columns * rows }, () => ({
        x: 0,
        y: 0,
        energy: 0,
      }));
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!interactive) return;

      mouseX = event.clientX;
      mouseY = event.clientY;

      root.style.setProperty('--veil-x', `${mouseX}px`);
      root.style.setProperty('--veil-y', `${mouseY}px`);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!interactive) return;

      ripples.push({
        x: event.clientX,
        y: event.clientY,
        startedAt: performance.now(),
      });
    };

    const getColor = (energy: number, alpha: number) => {
      const intensity = Math.min(energy / 45, 1);

      const hue = 222 + intensity * 20;
      const saturation = 14 + intensity * 60;
      const lightness = 48 + intensity * 28;

      return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    };

    const render = (milliseconds: number) => {
      if (document.hidden) {
        animationFrame = 0;
        return;
      }

      if (!reducedMotion && milliseconds - lastFrameTime < 1000 / 30) {
        animationFrame = requestAnimationFrame(render);
        return;
      }

      lastFrameTime = milliseconds;

      const time = milliseconds / 1000;

      const centerX = width / 2;
      const centerY = height / 2;

      const scrollY = window.scrollY;

      smoothMouseX += (mouseX - smoothMouseX) * 0.15;
      smoothMouseY += (mouseY - smoothMouseY) * 0.15;

      const cycle = 0.5 + 0.5 * Math.sin(time * 0.32);
      const lineAlpha = Math.max(0, Math.min(1, (cycle - 0.3) / 0.35));
      const dotRadius = 0.8 + (1 - lineAlpha) * 2;

      ripples = ripples.filter((ripple) => milliseconds - ripple.startedAt < 2600);

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const baseX = (column - 1) * spacing;

          const baseY = (row - 1) * spacing - ((scrollY * 0.25) % spacing);

          const dx = baseX - centerX;
          const dy = baseY - centerY;

          const distanceFromCenter = Math.hypot(dx, dy) || 1;

          let wave =
            Math.sin(distanceFromCenter * 0.012 - time * 1.5) * 13 +
            Math.sin(baseX * 0.011 + time) * Math.sin(baseY * 0.013 + time * 0.8) * 11;

          let offsetX = (dx / distanceFromCenter) * wave;

          let offsetY = (dy / distanceFromCenter) * wave;

          const pointerDistance = Math.hypot(baseX - smoothMouseX, baseY - smoothMouseY);

          if (interactive && pointerDistance < 220 && pointerDistance > 0) {
            const force = Math.pow(1 - pointerDistance / 220, 2) * 70;

            offsetX += ((baseX - smoothMouseX) / pointerDistance) * force;

            offsetY += ((baseY - smoothMouseY) / pointerDistance) * force;

            wave += force * 0.6;
          }

          for (const ripple of ripples) {
            const age = (milliseconds - ripple.startedAt) / 1000;

            const rippleDistance = Math.hypot(baseX - ripple.x, baseY - ripple.y);

            const ring = rippleDistance - age * 520;

            const amplitude = Math.exp((-ring * ring) / 2400) * 46 * Math.exp(-age * 1.3);

            offsetX += ((baseX - ripple.x) / (rippleDistance || 1)) * amplitude;

            offsetY += ((baseY - ripple.y) / (rippleDistance || 1)) * amplitude;

            wave += amplitude;
          }

          const point = points[row * columns + column];

          point.x = baseX + offsetX;
          point.y = baseY + offsetY;
          point.energy = Math.abs(wave);
        }
      }

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';
      context.lineWidth = 1;

      if (lineAlpha > 0.02) {
        for (let row = 0; row < rows - 1; row++) {
          for (let column = 0; column < columns - 1; column++) {
            const point = points[row * columns + column];
            const right = points[row * columns + column + 1];
            const bottom = points[(row + 1) * columns + column];

            context.strokeStyle = getColor(
              point.energy,
              Math.min(lineAlpha * (0.08 + point.energy / 110), 0.6),
            );

            context.beginPath();
            context.moveTo(right.x, right.y);
            context.lineTo(point.x, point.y);
            context.lineTo(bottom.x, bottom.y);
            context.stroke();
          }
        }
      }

      for (const point of points) {
        context.fillStyle = getColor(point.energy, 0.22 + Math.min(point.energy / 70, 0.5));
        context.beginPath();
        context.arc(point.x, point.y, dotRadius + point.energy * 0.06, 0, Math.PI * 2);
        context.fill();
      }

      context.globalCompositeOperation = 'source-over';

      animationFrame = reducedMotion ? 0 : requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else if (animationFrame === 0) {
        lastFrameTime = 0;
        animationFrame = requestAnimationFrame(render);
      }
    };

    resize();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);

    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [interactive]);

  return (
    <div
      ref={rootRef}
      className={['animated-background', dimmed ? 'animated-background--dimmed' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      <canvas ref={canvasRef} className='animated-background__canvas' aria-hidden='true' />

      <div className='animated-background__veil' aria-hidden='true' />

      <div className='animated-background__content'>{children}</div>
    </div>
  );
};
