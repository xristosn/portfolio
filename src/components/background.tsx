import { useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 50;
const GRID_SPACING = 4;
const LINE_OPACITY = 0.08;
const LINE_WIDTH = 0.8;
const ANIMATION_SPEED = 0.02;
const DOT_CYCLE_DURATION = 45;
const DOT_TRANSITION_DURATION = 4.5;

const getCssVar = (varName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${varName}`);

export const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(NaN);
  const timeRef = useRef<number>(0);

  const drawWarpedLine = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      _: number,
      end: number,
      fixed: number,
      isVertical: boolean,
      centerX: number,
      centerY: number,
      time: number,
      dotProgress: number
    ) => {
      const lineOpacity = 1 - dotProgress;

      if (lineOpacity > 0) {
        ctx.beginPath();
        ctx.globalAlpha = lineOpacity;

        for (let pos = 0; pos <= end; pos += GRID_SPACING) {
          const x = isVertical ? fixed : pos;
          const y = isVertical ? pos : fixed;

          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const warp = Math.sin(distance * 0.008 - time * 0.4) * 10;
          const flow = Math.sin(time * 0.2 + (isVertical ? fixed : pos) * 0.008) * 5;

          const px = isVertical ? x + warp + flow : x;
          const py = isVertical ? y : y + warp + flow;

          if (pos === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }

        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      if (dotProgress > 0) {
        ctx.globalAlpha = dotProgress;

        for (let pos = 0; pos <= end; pos += GRID_SPACING) {
          if (pos % GRID_SIZE === 0) {
            const x = isVertical ? fixed : pos;
            const y = isVertical ? pos : fixed;

            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const warp = Math.sin(distance * 0.008 - time * 0.4) * 10;
            const flow = Math.sin(time * 0.2 + (isVertical ? fixed : pos) * 0.008) * 5;

            const px = isVertical ? x + warp + flow : x;
            const py = isVertical ? y : y + warp + flow;

            const dotSize = LINE_WIDTH * (1 + dotProgress * 2);
            ctx.beginPath();
            ctx.arc(px, py, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.globalAlpha = 1;
      }
    },
    []
  );

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      centerX: number,
      centerY: number,
      time: number,
      dotProgress: number
    ) => {
      const blue400 = getCssVar('blue-400') || 'rgb(96, 165, 250)';
      const rgb = blue400.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${LINE_OPACITY})`;
        ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${LINE_OPACITY})`;
      }
      ctx.lineWidth = LINE_WIDTH;

      for (let x = -GRID_SIZE * 2; x < width + GRID_SIZE * 2; x += GRID_SIZE) {
        drawWarpedLine(ctx, 0, height, x, true, centerX, centerY, time, dotProgress);
      }

      for (let y = -GRID_SIZE * 2; y < height + GRID_SIZE * 2; y += GRID_SIZE) {
        drawWarpedLine(ctx, 0, width, y, false, centerX, centerY, time, dotProgress);
      }
    },
    [drawWarpedLine]
  );

  const animate = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = timeRef.current;

      const cyclePosition = (time % DOT_CYCLE_DURATION) / DOT_CYCLE_DURATION;
      let dotProgress = 0;

      if (
        cyclePosition > 0.4 &&
        cyclePosition < 0.4 + DOT_TRANSITION_DURATION / DOT_CYCLE_DURATION
      ) {
        const transitionProgress =
          (cyclePosition - 0.4) / (DOT_TRANSITION_DURATION / DOT_CYCLE_DURATION);
        dotProgress = Math.sin((transitionProgress * Math.PI) / 2);
      } else if (
        cyclePosition >= 0.4 + DOT_TRANSITION_DURATION / DOT_CYCLE_DURATION &&
        cyclePosition < 0.6
      ) {
        dotProgress = 1;
      } else if (
        cyclePosition >= 0.6 &&
        cyclePosition < 0.6 + DOT_TRANSITION_DURATION / DOT_CYCLE_DURATION
      ) {
        const transitionProgress =
          (cyclePosition - 0.6) / (DOT_TRANSITION_DURATION / DOT_CYCLE_DURATION);
        dotProgress = 1 - Math.sin((transitionProgress * Math.PI) / 2);
      }

      drawGrid(ctx, canvas.width, canvas.height, centerX, centerY, time, dotProgress);

      timeRef.current += ANIMATION_SPEED;
      // eslint-disable-next-line react-hooks/immutability
      animationRef.current = requestAnimationFrame(() => animate(ctx, canvas));
    },
    [drawGrid]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    animate(ctx, canvas);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className='animate-blur-in fixed inset-0 w-full h-full -z-10 bg-linear-to-b from-green-700 to-slate-50 dark:from-slate-950 dark:to-slate-900'
      aria-hidden='true'
    />
  );
};
