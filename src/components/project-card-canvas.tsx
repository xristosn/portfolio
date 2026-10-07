import { useEffect, useRef, type RefObject } from 'react';

export type ProjectPointer = {
  x: number;
  y: number;
};

type ProjectCardCanvasProps = {
  seed: number;
  active: boolean;
  pointerRef: RefObject<ProjectPointer | null>;
};

export const ProjectCardCanvas: React.FC<ProjectCardCanvasProps> = ({ seed, active, pointerRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const timeRef = useRef(seed * 3);

  useEffect(() => {
    timeRef.current = seed * 3;
  }, [seed]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    let width = 0;
    let height = 0;
    let animationFrame: number | null = null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = width * pixelRatio;

      canvas.height = height * pixelRatio;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      draw();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      context.globalCompositeOperation = 'lighter';

      const computed = getComputedStyle(canvas);

      const primary = computed.getPropertyValue('--primary').trim();

      const spacing = 15;

      const focusX = width * (0.2 + (seed % 5) * 0.14);

      const focusY = height * (0.25 + (seed % 3) * 0.22);

      const pointer = pointerRef.current;

      const rect = canvas.getBoundingClientRect();

      const mouseX = pointer ? pointer.x - rect.left : -1000;

      const mouseY = pointer ? pointer.y - rect.top : -1000;

      const time = timeRef.current;

      for (let row = 0; row < height / spacing + 1; row++) {
        for (let column = 0; column < width / spacing + 1; column++) {
          const x = column * spacing;

          const y = row * spacing;

          const dx = x - focusX;

          const dy = y - focusY;

          const distance = Math.hypot(dx, dy) || 1;

          let wave =
            Math.sin(distance * 0.045 - time * 2) * 9 +
            Math.sin(x * 0.03 + time + seed) * Math.cos(y * 0.05 - time) * 5;

          let offsetX = (dx / distance) * wave;

          let offsetY = (dy / distance) * wave;

          /*
           * Pointer repulsion.
           * Matches the 110px influence
           * radius from the HTML.
           */
          const mouseDistance = Math.hypot(x - mouseX, y - mouseY) || 1;

          if (mouseDistance < 110) {
            const force = Math.pow(1 - mouseDistance / 110, 2) * 34;

            offsetX += ((x - mouseX) / mouseDistance) * force;

            offsetY += ((y - mouseY) / mouseDistance) * force;

            wave += force * 0.7;
          }

          const energy = Math.abs(wave);

          const intensity = Math.min(energy / 30, 1);

          context.fillStyle = primary;

          context.globalAlpha = 0.28 + intensity * 0.6;

          context.beginPath();

          context.arc(x + offsetX, y + offsetY, 0.9 + energy * 0.09, 0, Math.PI * 2);

          context.fill();
        }
      }

      context.globalAlpha = 1;

      context.globalCompositeOperation = 'source-over';
    };

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

    const animate = () => {
      if (!active || motionPreference.matches) {
        animationFrame = null;
        draw();
        return;
      }

      timeRef.current += 0.03;
      draw();
      animationFrame = requestAnimationFrame(animate);
    };

    const syncAnimation = () => {
      if (active && !motionPreference.matches) {
        if (animationFrame === null) {
          animationFrame = requestAnimationFrame(animate);
        }
      } else {
        if (animationFrame !== null) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }

        draw();
      }
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(canvas);
    motionPreference.addEventListener('change', syncAnimation);
    syncAnimation();

    return () => {
      resizeObserver.disconnect();
      motionPreference.removeEventListener('change', syncAnimation);

      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [active, pointerRef, seed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className='
        absolute
        inset-0
        size-full
      '
    />
  );
};
